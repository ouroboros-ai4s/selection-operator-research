# Design: 抗体选择算子学习方法 v_final 的实现

> Date: 2026-06-07
> Source: brainstorming (superpowers)
> 上游: `docs/de-anthropocentric/specs/2026-06-07-antibody-selection-operator-validation-spec.md`(研究 spec,收敛出 v_final)
> 下游: writing-plans(实现计划)

## 目标

把对抗式简化循环收敛出的最小非循环验证方案 v_final,实现为一个 Python/PyTorch 工程。在 CR9114(流感广谱抗体的组合完备突变×抗原 Kd 地图)上学习条件依赖选择算子 f̂(seq, cond),并用三道硬验证关证明它学对了——全程零逼真仿真器、零手搓真值。

**范围**:全 v_final(S1 学 f̂ + S2 玩具SDE可辨识性 + S2b gating② + S3 三道验证关 + S4 诚实声明)。一份 spec 包全。

**非目标**:不跑公司 camelid 数据 OOD(留两阶段策略第二阶段);不覆盖结合以外的选择压(表达/稳定性,见 CS 声明边界)。

## 背景定论(不在本 spec 重议)

- 问题内核:SDE 反问题 `dX = ∇f(X,c)·dt + σ·dW`,σ(突变算子)已知,f(选择算子)未知,= condition-dependent 势函数。
- 三不变量(优先级 I1>I2>I3):I1 验证非循环性(锚外部湿实验真值,绝不比对自编 f*)、I2 可辨识性、I3 条件依赖。
- 静态-动力学分区共存:CR9114 组合完备(2^16)+ gradient-flow 结构,使"静态拟合 f 取梯度 ≈ 动力学 ∇f"在完备区成立,故 Spike0 直接拟合在此区充分。
- 数据:CR9114 = Phillips 2021 eLife 71393,CC-BY,65536 变体 × 3 抗原(H1/H3/B),−logKD。检测限 floor(已从 source data `fig1-data1-v3.csv` mean 列核实):**H1=7、H3=6、B(fluB)=6**;Tite-Seq SE=0.047。

## 已锁定的工程决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 序列表征 | 冻结 ESM-2 embedding | 梯度干净(供 ∇f̂)、训练快、先跑通 |
| f̂ 架构 | 冻结 ESM-2 + 可训练 head | 只训 head,梯度最干净,CR9114 小数据不易过拟合 |
| 抗原条件注入 | 抗原 HA 序列也用 ESM-2 编码 | 条件轴未来可泛化到新抗原,契合条件依赖内核 |
| spec 分解 | 一份包全(含玩具 SDE) | 用户选择 |

---

## §1 模块架构

Python/PyTorch 包,职责单一 + 接口清晰,6 模块。核心抽象:**f̂ 是可微打分函数 `f(seq_emb, antigen_emb) → scalar`**,所有验证关消费它。

```
selop/
├── data/          # CR9114 加载、censored 标记、留出划分(P16)
│                  # 产出: (变体序列, 抗原, −logKD, is_censored) + 留出掩码
├── repr/          # ESM-2 编码(冻结)。encode_antibody / encode_antigen,缓存
├── model/         # f̂ = head(antibody_emb, antigen_emb)→标量;对输入可微
├── train/         # S1 Spike0: censored 回归(Tobit, floor=6/7, σ=0.047)
├── verify/        # S2b/S3 验证关(消费 f̂)
│   ├── identifiability.py  # S2b gating②: ESM-2 Jacobian→a(x)→λmin
│   ├── cv_consistency.py   # S3-Ⅰ 跨抗原一致性
│   ├── cv_shuffle.py       # S3-Ⅱ 打乱对照(200 置换 null 分布)
│   └── cv_crosscond.py     # S3-Ⅲ cross-condition + N3 baseline
├── toysde/        # S2 玩具 SDE(独立子系统,不依赖真实数据)
└── report/        # S4 CS 声明 + 判定汇总(C1-C5 + FM 监测)
```

**关键边界**:
- `repr/` 把 ESM-2 隔在接口后,缓存 65536 序列 embedding 到磁盘,避免重复编码。
- `model/` 的 f̂ 是所有下游唯一消费点——换表征/换 head 不影响 `verify/`。
- `toysde/` 完全独立(合成数据),与真实数据主线零耦合,可单独测。
- `verify/` 每关一文件,各自独立可测,输出标准化判定。

---

## §2 数据流与数据结构

**主线(真实 CR9114)**:
```
CR9114 source data (CSV) → data/ 加载
  → (变体:16位二值, 抗原∈{H1,H3,B}, −logKD, is_censored) ×65536×3
    ├ 变体 → 重建重链序列(germline + 16 突变位点)
    ├ floor 标记: −logKD ≤ (6或7,按抗原) → is_censored=True
    └ P16 留出: 按抗原留B + 按突变组合随机留20%(断言无交集)
  → repr/ 编码(冻结ESM-2,缓存): emb_ab[65536], emb_ag[3]
  → model/ f̂ = head(emb_ab, emb_ag) → 标量
  → train/ S1: Tobit censored loss 拟合
  → 训练好的 f̂ ─┬→ verify/cv_* (S3 三关)
                └→ ∇f̂(autograd) → verify/identifiability(S2b)
```

**数据结构**:
- `Variant`: 16 位二值向量 + 重建氨基酸序列。
- `Dataset`: `(emb_ab, emb_ag, y=−logKD, is_censored, split_tag)`。
- `Splits`: train / heldout_antigen(B) / heldout_genotype(20%),显式断言无交集(P16)。
- `VerdictResult`: `{invariant, pass: bool, metric, threshold, triggered_FM}`。

**Tobit loss(S1 核心)**:
```
L = Σ_{未截断} (f̂−y)²/σ²  +  Σ_{截断} max(0, f̂−floor)²/σ²
σ=0.047, floor=7(H1)/6(H3)/6(B)
```
截断项只在"预测高于检测限"时罚(截断样本真值只知 ≤floor)。

**玩具 SDE(独立)**:
```
已知 f_toy(x,c)=−½xᵀAx+b_c·x, σ_toy (d=3,解析)
  → Euler-Maruyama 前向(dt=0.01, 5000轨迹, T∈{2,3,5,10})
  → population 边际快照 → 反推 f̂_toy
  → Spearman(可辨识) + gating①余弦(静态梯度 vs 轨迹drift)
```

---

## §3 验证关判定 + 失败模式联动

每关输出 `VerdictResult{invariant, pass, metric, threshold, triggered_FM}`。

| 关 | 验 | 判定阈值 | 失败→触发 |
|---|---|---|---|
| **S1** train | (学,不判) | val loss 收敛 | 记录 N3 性能备用 |
| **S2** toysde | I2 适定性 + gating① | Spearman(f̂_toy,f_toy)>0.9 **且** gating①余弦>0.8 | 余弦低 → **FM1**: claim 降级"学 drift 场 ∇f"(写入 CS) |
| **S2b** identifiability | I2 椭圆性(C2) | λmin > 1e-3·median(λ) | λmin≈0 → **FM2**: 换低维表征/加 εI 正则/限非退化子流形 |
| **S3-Ⅰ** consistency | I3正向+I1复现 | 跨抗原方向一致率 > 0.7 | — |
| **S3-Ⅱ** shuffle | I3核心(C4) | 200 置换 null 分布,真实 f̂ 落 **p<0.05** 尾部 | — |
| **S3-Ⅲ** crosscond | I1核心(C1) | B 上 Spearman 显著>0 **且** bootstrap CI 高于 N3 | 超不过 N3 → **FM4**: 改比 cross-antigen 泛化 |
| **S4** report | I1诚实(C5) | CS 声明含 R-1/R-2/R-3 完整 | 承载 FM3/FM5 |

**全绿条件**: S2∧S2b∧S3-Ⅰ∧S3-Ⅱ∧S3-Ⅲ 全 pass → v_final 在 CR9114 完备区成立(I1/I2/I3 绿)。

**N3 baseline(S3-Ⅲ 对照,必须实现)**: 序列相似度模型 + Phillips pairwise epistasis 模型(从论文 interaction model source data 载系数)。f̂ 必须 bootstrap CI 高于它才算非平凡——断"平凡统计冒充机制"的关键,不可省。

## §4 错误处理与失败模式登记册(FM1-FM5)

来自研究 spec Stage 3 的 pre-mortem,每条落地为可执行探测器 + 缓解。

| FM | 失败情景 | 探测信号(代码内监测) | 缓解动作 |
|---|---|---|---|
| FM1 | PLM 空间非梯度流(drift 有旋) | S2 gating① 余弦低 | claim 降级"学 drift 场 ∇f";CV 排序判据稳健 |
| FM2 | a(x) 退化 λmin≈0 | S2b λmin 接近 0 | 换低维表征/加 εI 正则/限非退化子流形 |
| FM3 | 选择压含结合以外维度 | f̂ 在 held-out 系统偏离(表达/稳定性相关变体) | CS 收窄 claim 为"结合驱动选择分量";未来加多维 assay |
| FM4 | N3 baseline 太强难超越 | S3-Ⅲ 同抗原内不显著超 pairwise | 改比 cross-antigen 泛化(pairwise 跨抗原泛化弱) |
| FM5 | 玩具 SDE 不迁移真实空间 | S2 过但真实空间可辨识性存疑 | P07 定位原理验证;真实空间靠 S2b λmin 补 |

每个 verify 模块须在判定失败时返回 `triggered_FM` 字段,report/ 汇总时据此输出缓解建议。

## §5 测试策略

- **单元测试**: 每个 verify 模块用合成小数据测判定逻辑。如 cv_shuffle 在"已知无条件依赖"的假数据上,真实模型应 NOT 显著优于打乱(pass=False),验证检验本身不假阳。
- **玩具 SDE 端到端自测**: S2 本身是对反推链的端到端检验(已知 f_toy 能否恢复)。
- **快照测试**: 冻结 ESM-2 编码确定性(同序列同 emb),缓存正确性。
- **P16 零泄漏断言**: Splits 构造后强制断言 train/heldout 无交集,作为测试用例。
- **Tobit loss 单测**: 在合成 censored 数据上验证截断项只罚"预测高于 floor"。

## §6 5 条必验条件 → 代码落点(C1-C5)

| 条件 | 含义 | 代码落点 |
|---|---|---|
| C1 | CV-Ⅲ 须打败 N3 baseline | verify/cv_crosscond.py + N3 实现 |
| C2 | gating② λmin > 下界 | verify/identifiability.py |
| C3 | 静态=动力学限完备区 | toysde gating① + report/CS |
| C4 | 打乱多次置换 + p 值 | verify/cv_shuffle.py(N=200) |
| C5 | CS 声明 + limitation | report/(R-1/R-2/R-3) |

## §7 执行顺序

```
S1 学f̂ ──┬→ S3-Ⅰ/Ⅱ/Ⅲ (依赖f̂)
          └→ ∇f̂
S2 玩具SDE (独立,可并行)
S2b gating② (独立诊断,可并行)
全部 → S4 CS声明(汇总判定 + 触发的FM)
```
依赖: S3 依赖 S1 的 f̂;S2/S2b 独立可并行;S4 汇总全部。无循环依赖。

## §8 数据与环境

- **CR9114**: cdn.elifesciences.org/articles/71393 source data,CC-BY,**已下载至 `datasets/cr9114/`**。主表=`fig1-data1-v3.csv`(genotype/pos1..16 + h1_mean/h3_mean/fluB_mean,65536 行);N3=`fig2-data1-v3.csv`(epistasis Coefficient,Intercept+main+pair,H1/H3/FluB)。
- **环境**: Python, PyTorch, fair-esm(ESM-2), numpy/scipy/scikit-learn。
- **架构约束**: Transformer/Mamba head,graph 作 attention bias,无独立 GNN/CNN/RNN(项目偏好)。
- **floor 实测值**: H1=7、H3=6、B(fluB)=6(已从 source data mean 列核实,早期"6或7"占位作废)。
- **剩余待填常量**: 16 位点 (pos, germline_aa, somatic_aa) 与 germline VH 序列 → 从 `supp*.xlsx` 拆。

## 开源可达 vs 公司数据缺口

- **开源全程可验**: I1/I2/I3 方法成立性(CR9114 完备区)。
- **公司数据不可替代**: 轴 T 体内时序、跨 campaign 泛化、结合以外选择压、真实演化轨迹——留两阶段策略第二阶段。

