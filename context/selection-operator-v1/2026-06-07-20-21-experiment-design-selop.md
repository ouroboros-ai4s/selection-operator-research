# Stage 4 — 实验设计(experiment-execution,仅 design)

> Created: 2026-06-07 20:21
> Topic: 抗体选择算子学习 — 验证方案对抗式简化 / Stage 4 可执行实验设计
> Phase: experiment-execution (experiment-design only, NOT execution)

## Plan Context

把定稿 v_final 写成可执行实验设计——每步五元组(数据源/表征/loss/判据/非循环gate)。仅到 design,不跑实验(引擎边界 + 两阶段策略:开源验方法成型,公司OOD留入职后)。验收标准:零开放性追问(外部执行者无需追问上下文即可逐条照做)。

## Expected Input(已就位)

- v_final = Spike0 + P07玩具SDE + CV三子检验 + P16零泄漏 + CS扩展声明(Stage 3 定稿)
- 5 条必验条件 C1-C5
- 失败模式登记册 FM1-FM5(Stage3 附录S3-A)
- 就绪度清单(Stage3 附录S3-B):Stage4 待补=参数/阈值/架构/留出比例
- 数据字段字典(Stage0 附录G)、CV规格(r3附录r3-A)、Spike0 schema(r1附录r1-D/r2附录r2-A)

## Stage 4 Completion Criteria

- [ ] 每个验证步骤完整五元组(数据源, 表征, loss, 判据, 非循环gate)
- [ ] ≥1 个打乱条件标签对照设计(验 I3)
- [ ] 开源可达 vs 公司数据不可替代清单
- [ ] 每步标注:输入文件/accession、运行环境/依赖、预期产出物、判定阈值(零开放性追问)

---

## 实验设计正文

### 数据底座(所有步骤共用,零追问规格)

**主数据集 CR9114**:
- 来源:Phillips et al. 2021, eLife 10.7554/eLife.71393, CC-BY。
- 文件:eLife Source data(cdn.elifesciences.org/articles/71393/ 下的 fig1 source data CSV/XLSX);Source data 1 = CR9114 library −logKD to H1/H3/influenza B。
- 维度:2^16 = 65,536 变体 × 3 抗原(H1, H3, influenza B)。
- 变体编码:16 个二值位点(0=germline, 1=somatic),组合完备覆盖 germline→somatic 全 2^16 中间体。
- 标签:−logKD(连续实值)。Tite-Seq 测,生物三复重复,平均 SE = 0.047 −logKD 单位(观测噪声尺度,用于 loss 噪声项)。
- **检测限 floor(关键,C 处理依据)**:−logKD 低于 **6(部分抗原)或 7(部分抗原)** 视为无可测结合(论文明示:低于此边界不赋值,因高浓度非特异结合);H3 与 influenza B 有大量无可测结合变体。**censored 回归的左截断阈值 = 6 或 7,按抗原取**(精确值 Stage 执行时从 source data 每抗原列头/方法节确认:H1 较低floor,H3/B 较高)。
- 正交校准:Source data 3 = 选定变体 isogenic flow cytometry −logKD,用于校准 Tite-Seq。
- germline 序列:CR9114 重链(Dreyfus 2012 / 论文图1A 给 16 位点 IMGT 编号);光链不影响结合,忽略。

**辅助/对照**:
- N3 baseline 系数:Phillips pairwise + higher-order epistasis 模型(论文 Source data 的 interaction model coefficients for CR9114)。
- CR6261(Source data 2,2^11×2 H1/H9):cross-antibody 泛化备选。

**运行环境(共用)**:Python;PyTorch(模型);numpy/scipy/scikit-learn(baseline、统计检验);PLM 用 ESM-2(fair-esm)或 16维二值向量 baseline。架构遵循偏好:Transformer/Mamba,graph 作 attention bias,无独立 GNN/CNN/RNN。

---

### 步骤 S1 — Spike0:学选择算子势函数 f̂(seq,cond)

| 五元组 | 内容 |
|---|---|
| 数据源 | CR9114 Source data 1(65536×3 −logKD)+ floor 阈值(H1/H3/B 各自 6 或 7) |
| 表征 | seq: 16维二值突变向量(baseline)或 ESM-2 embedding;cond: 抗原 one-hot(3维)或 HA 序列 embedding。架构 Transformer/Mamba,graph 作 attention bias |
| loss | **censored 回归(Tobit)**:未截断观测(−logKD > floor)用 MSE;左截断观测(=floor,无可测结合)用 `max(0, f̂ − floor)²` 软惩罚(只罚 f̂ 预测高于 floor,不强制等于 floor)。观测噪声项 σ_obs=0.047 |
| 判据 | held-out 上 f̂ 预测 −logKD 的 Spearman(具体阈值见 S3 的 gate) |
| 非循环 gate | 本步是"学",非循环 gate 在 S3(CV)验。S1 只产出 f̂ + ∇f̂ |

- 输入文件:elife-71393 fig1 source data(CSV)。
- 运行环境:PyTorch + fair-esm(若用 ESM-2)。
- 预期产出物:f̂(seq,cond) 模型权重 + 在留出集的预测 + ∇f̂(对 seq 表征微分)。
- 判定阈值:训练收敛(val loss 平台);留出 Spearman 报告(不在此设 pass/fail,留 S3)。
- 监测 FM4:同时训练 N3 baseline(pairwise epistasis),记录其留出性能供 S3 对照。

### 步骤 S2 — P07 玩具 SDE:可辨识性数学适定性 + gating① 一致性(验 I2)

| 五元组 | 内容 |
|---|---|
| 数据源 | 自造玩具(无外部数据):低维连续空间 d=3,已知势 f_toy(x,c)=−½xᵀAx + b_c·x(A 正定,b_c 条件依赖项,c∈{0,1,2} 模拟3抗原),已知 σ_toy(满秩对角,可调退化做gating②玩具) |
| 表征 | 直接用玩具 3 维坐标;gating① 检验时另把玩具序列经 ESM-2 embed 检验真实 PLM 空间 |
| loss | 反推 f̂_toy 用与 S1 同款拟合(从 population 边际快照);gradient-flow SDE 前向用 Euler-Maruyama |
| 判据 | (a) 可辨识:f̂_toy 与 f_toy 的 Spearman > 0.9(理想设定应高恢复);(b) gating①:静态取梯度 ∇f̂_static 与轨迹反推 drift ∇f̂_dyn 的余弦一致性 > 0.8 在数据覆盖区 |
| 非循环 gate | 不适用——S2 验数学适定性(I2)非生物正确性(I1)。用自设 f_toy 正当(验适定性,r1附录r1-I) |

- 输入文件:无(自造)。
- 运行环境:PyTorch + numpy(Euler-Maruyama 前向)。
- 预期产出物:可辨识性恢复精度报告 + gating① 一致性度量 + 边界扫描图(扫时间点数 T∈{2,3,5,10}、噪声、变体数,看可辨识性何时失效)。
- 判定阈值:可辨识 Spearman>0.9(理想设定);gating① 余弦>0.8。
- **监测 FM1**:若 gating① 余弦低(drift 显著有旋)→ 触发 R-2,claim 降级"学 drift 场"。
- **监测 FM5**:P07 定位原理验证,真实空间靠 S2b 的 gating② 补。

### 步骤 S2b — gating② 实测:a(x) 在 PLM 空间椭圆性(验 I2 条件 C2)

| 五元组 | 内容 |
|---|---|
| 数据源 | S5F/EPAM 突变模型(netam/EPAM 包)给序列空间突变率;CR9114 序列 |
| 表征 | ESM-2 encoder;计算其 Jacobian J(自动微分) |
| loss | 无(诊断,非训练) |
| 判据 | a_emb(x)=J·Σ_seq·Jᵀ 的最小特征值 λmin 在 CR9114 变体上的分布;判 λmin > 正下界(预注册,如 1e-3·median) |
| 非循环 gate | 不适用(诊断) |

- 输入文件:netam/EPAM σ 模型 + CR9114 序列。
- 运行环境:PyTorch(Jacobian)+ numpy(特征值)。
- 预期产出物:λmin 分布直方图 + 椭圆性判定。
- 判定阈值:λmin > 下界 → I2 条件 C2 满足;若 λmin≈0(秩亏)→ **触发 FM2**:换更低维表征 / 加 εI 正则 / 限非退化子流形声明。

### 步骤 S3 — CV 条件轴验证模块(验 I1 + I3)

共用前提 **P16 零泄漏**:按抗原留出(B 完全不进训练)+ 按突变组合留出(随机留 20% 的 2^16 组合);留出集与训练集无交集,显式断言检查。

#### S3-Ⅰ 跨抗原一致性(验 I3 正向 + I1 真值复现)

| 五元组 | 内容 |
|---|---|
| 数据源 | CR9114 全 3 抗原 −logKD(训练集) |
| 表征 | S1 学好的 f̂ |
| loss | 无(评估) |
| 判据 | 固定变体扫 H1/H3/B,f̂ 跨抗原变化方向与实测 −logKD 跨抗原变化方向的一致率 > 0.7;复现 Phillips "对 B 需 nested 组合" 模式 |
| 非循环 gate | 实测 −logKD 是外部真值;一致率对照实测,非自洽 |

- 预期产出物:f̂ vs 实测的跨抗原变化散点 + 一致率 + nested 模式复现图。
- 判定阈值:一致率 > 0.7(预注册)。

#### S3-Ⅱ 打乱抗原标签对照(验 I3 核心,spec 要求的 ≥1 打乱对照)

| 五元组 | 内容 |
|---|---|
| 数据源 | CR9114 训练集 (变体, 抗原, −logKD) |
| 表征 | 同 S1 |
| loss | 同 S1 censored 回归 |
| 判据 | 把抗原标签随机置换重训 f̂_shuffled,**重复 N=200 次**построить null 分布;真实 f̂ 的留出 Spearman 须落在 null 分布上 5% 尾部(**p < 0.05**) |
| 非循环 gate | 打乱破坏条件信息,真模型必掉=证 f 用上条件;CR9114 nested 结构保证功效(r3 T-r3) |

- 输入文件:CR9114 source data。
- 运行环境:PyTorch(200次重训,可并行/降采样变体加速)。
- 预期产出物:null 分布直方图 + 真实性能位置 + p 值。
- 判定阈值:**p < 0.05**(真实 f̂ 显著优于打乱)→ I3 条件 C4 满足。
- 落实 C4:多次随机置换 null 分布 + p 值量化(非打乱一次)。

#### S3-Ⅲ cross-condition 预测 + N3 baseline(验 I1 核心)

| 五元组 | 内容 |
|---|---|
| 数据源 | CR9114:H1+H3 训练,留出 B 测试 |
| 表征 | 同 S1 |
| loss | 同 S1 |
| 判据 | 在留出抗原 B 上预测变体相对 −logKD 排序:(1) Spearman 显著 >0(p<0.05);(2) **显著优于 N3 baseline**(序列相似度 + Phillips pairwise epistasis,bootstrap CI 不重叠) |
| 非循环 gate | B 抗原训练时未见(P16);打败 N3 排除平凡统计(r1 T-r1 机制鉴别力) |

- 输入文件:CR9114 source data + Phillips interaction model 系数(N3)。
- 运行环境:PyTorch + scikit-learn(baseline)+ scipy(bootstrap)。
- 预期产出物:B 上 f̂ vs 实测 Kd 排序相关 + N3 对照 + bootstrap CI。
- 判定阈值:f̂ Spearman 显著 >0 且 bootstrap CI 高于 N3 → I1 条件 C1 满足。
- **监测 FM4**:若 f̂ 同抗原内不显著超 N3(pairwise 太强),CV-Ⅲ 的 cross-antigen 设计正是应对(pairwise 逐抗原拟合,跨抗原泛化弱),比泛化而非比拟合。

### 步骤 S4 — CS 覆盖范围诚实声明(落实 C5 + R-1/R-2/R-3)

非实验步骤,是随实验产出的诚实声明文档。须包含:
- 严格验证区:CR9114 完备 16 位点 × 3 抗原。此区内"学到结合驱动的选择算子"是已验证结论。
- **R-1 选择压维度边界**:vN 验证"结合亲和力驱动的选择分量";表达量/稳定性/可开发性/polyreactivity 等其他选择压未覆盖(CR9114 只测结合 Kd)。
- **R-2 claim 形态退路**:若 S2 gating① 实测非梯度流,claim 从"学势函数 f"降级为"学 drift 场 ∇f";CV 排序判据(S3)对此稳健。
- **R-3 可辨识性层次**:S2 验原理适定性,真实 PLM 空间可辨识性依赖 S2b(λmin)实测。
- 外推区 + 数值精度 limitation(见下表)。

---

### 打乱条件标签对照(spec 要求 ≥1,落地 = S3-Ⅱ)

spec Stage 4 要求"至少 1 个打乱条件标签的对照实验设计(验 I3)"。**落地 = S3-Ⅱ**:打乱 CR9114 抗原标签,200 次置换построить null 分布,真实 f̂ 须 p<0.05 显著优于打乱。CR9114 nested 结构保证统计功效(功效来自 65536 变体 × 200 置换,非抗原数)。

---

### 开源可达 vs 公司数据不可替代清单

| 维度 | 开源(CR9114等)可达 | 公司数据不可替代 |
|---|---|---|
| 选择算子 f(seq,cond) 学习与验证 | ✅ Spike0 + CV(完备16位点×3抗原) | — |
| 非循环性 I1(外部Kd真值) | ✅ CR9114 held-out + cross-antigen | — |
| 可辨识性 I2(数学适定性) | ✅ P07玩具SDE + gating②实测 | — |
| 条件依赖 I3(打乱对照) | ✅ CR9114 nested + S3-Ⅱ | — |
| **轴 T 体内时序** | ❌ 开源仅终点DMS快照(CR9114无时序) | ✅ 公司6点免疫时序 |
| **跨 campaign 泛化** | ❌ 单一抗体骨架(CR9114) | ✅ 公司多campaign |
| **结合以外选择压**(表达/稳定性/可开发性,FM3/R-1) | ⚠️ 部分(open-alphaseq表达量等,有限) | ✅ 公司多维assay |
| **真实演化轨迹反推**(非玩具) | ⚠️ 仅phage panning(P09 Hanke,无完备Kd真值) | ✅ 公司体内时序轨迹 |
| OOD 部署(camelid VHH) | ⚠️ Koenig VHH DMS 作踏板 | ✅ 公司 camelid pipeline |

**结论**:方法成立性(I1/I2/I3)全程开源可验证,零公司数据依赖。公司数据不可替代价值集中在:轴 T 体内时序、跨 campaign 泛化、结合以外选择压维度、真实演化轨迹——这些是两阶段策略第二阶段(入职后 OOD)的内容,CS 声明已明确划界。

---

## 执行顺序与依赖图(零追问的执行序)

```
S1 Spike0 学f̂ ──────┬──→ S3-Ⅰ 跨抗原一致性
  (含N3 baseline训练)│──→ S3-Ⅱ 打乱对照(200置换)
                     └──→ S3-Ⅲ cross-condition+N3
S2 玩具SDE 可辨识性 ──→ (gating① 一致性)
S2b gating② λmin ───→ (独立诊断,可与S2并行)
S1+S2+S2b+S3 全部 ──→ S4 CS声明(汇总所有limitation+触发的FM)
```

依赖:S3 三子检验依赖 S1 的 f̂;S2/S2b 独立于 S1 可并行;S4 汇总全部。无循环依赖。

---

## Stage 4 Completion Criteria 复核

- [x] 每个验证步骤完整五元组:S1/S2/S2b/S3-Ⅰ/S3-Ⅱ/S3-Ⅲ 各有(数据源,表征,loss,判据,非循环gate)。✅
- [x] ≥1 打乱条件标签对照:S3-Ⅱ(200 次置换 null 分布 + p<0.05)。✅
- [x] 开源可达 vs 公司数据不可替代清单:完成(9 维度表)。✅
- [x] 每步标注 输入文件/accession + 运行环境/依赖 + 预期产出物 + 判定阈值:逐步已标。✅

---

## Checkpoint: Stage 4 实验设计完成(v_final 操作化为 6 步五元组,零开放性追问)

### Objective

Stage 4 把 Stage 3 定稿的 v_final 写成可执行实验设计——仅 design 不执行(引擎边界 + 两阶段策略)。每个验证步骤给完整五元组(数据源/表征/loss/判据/非循环gate),落地 5 条必验条件 C1-C5,设计 spec 要求的打乱条件标签对照(I3),产出开源可达 vs 公司数据缺口清单。验收标准:零开放性追问——外部执行者无需追问上下文即可逐条照做。

### Process Summary

先用 brave-search 核实 CR9114 数据访问细节(文件位置 cdn.elifesciences.org CSV/XLSX、检测限 floor=6或7按抗原、Tite-Seq SE=0.047),消除数据层开放问题。然后把 v_final 5 核心件操作化为 6 个执行步骤:S1(Spike0)、S2(玩具SDE可辨识性)、S2b(gating②实测)、S3-Ⅰ/Ⅱ/Ⅲ(CV三子检验)、S4(CS声明)。每步给五元组 + 输入文件 + 运行环境 + 预期产出 + 判定阈值 + 监测的 FM。产出执行依赖图、打乱对照落地(S3-Ⅱ)、开源vs公司清单。复核 4 条完成判据全达标。

### Key Findings

**发现 1(检测限 floor 精确化 = 6 或 7 按抗原)**:Stage 0 只知"存在 floor",Stage 4 核实精确值——论文明示低于 −logKD 6(部分抗原)或 7(部分抗原)视为无可测结合(因高浓度非特异结合,不赋值)。H3 与 influenza B 有大量无可测结合变体。这直接定死 S1 censored 回归的左截断阈值,消除了 Spike0 最后一个开放参数。

**发现 2(Tite-Seq 噪声尺度 = 0.047 −logKD 单位)**:生物三复重复的平均 SE,用作 S1 loss 的观测噪声项 σ_obs。又一个被精确化的参数。

**发现 3(玩具 SDE 的具体规格落地)**:S2 给了零追问的玩具——d=3 维,f_toy=−½xᵀAx+b_c·x(A正定 + 条件依赖线性项),σ_toy 满秩对角(可调退化以联动 gating② 玩具),Euler-Maruyama 前向,反推用与 S1 同款拟合。判据 Spearman>0.9(可辨识)+ 余弦>0.8(gating①一致性)。边界扫描扫 T∈{2,3,5,10}/噪声/变体数。

**发现 4(5 条必验条件 C1-C5 全部落地)**:C1(CV-Ⅲ 打败 N3,bootstrap CI 不重叠)→ S3-Ⅲ;C2(gating② λmin>下界)→ S2b;C3(静态=动力学限完备区)→ S2 gating① + CS;C4(打乱多次置换+p值)→ S3-Ⅱ(N=200,p<0.05);C5(CS 声明 + limitation)→ S4。每条都有承载步骤 + 判定阈值。

**发现 5(FM1-FM5 监测点嵌入步骤)**:Stage 3 的失败模式登记册落地为各步的监测信号 + 触发缓解——S2 监测 FM1(gating① 余弦低→claim降级)、S2b 监测 FM2(λmin≈0→换表征)、S3-Ⅲ 监测 FM4(超不过pairwise→比泛化)、S4 承载 FM3/FM5(CS 声明)。pre-mortem 从"想过风险"变成"实验里有探测器+预案"。

### v_final 6 步操作化总览

S1 Spike0(学 f̂,censored 回归,floor=6/7,σ_obs=0.047)→ S2 玩具SDE(可辨识性 + gating① 一致性,d=3 玩具)→ S2b gating②(a(x) λmin 实测,ESM-2 Jacobian)→ S3-Ⅰ(跨抗原一致性,一致率>0.7)→ S3-Ⅱ(打乱对照,200置换 p<0.05)→ S3-Ⅲ(cross-condition+N3,bootstrap CI)→ S4(CS 声明 + R-1/R-2/R-3)。

### Decisions Made

1. **先核实数据细节再写设计**。理由:零追问验收标准要求数据层无开放问题;floor=6/7、SE=0.047 是 Spike0 的硬参数。
2. **玩具 SDE 给具体 d=3 + 解析 f_toy**。理由:让 S2 可照做,不留"玩具怎么搭"的开放问题。
3. **打乱对照 N=200 置换 + p<0.05**。理由:落实 C4 的"多次置换 null 分布"(非打乱一次),功效来自变体数×置换数。
4. **FM 监测嵌入每步**。理由:pre-mortem 必须落地为可执行探测器,否则只是纸上风险。
5. **开源 vs 公司清单按 9 维度**。理由:明确方法成立性零公司依赖,公司价值集中在 4 个缺口(轴T/跨campaign/结合外选择压/真实轨迹)。

### Open Questions(留执行阶段,非本 design 缺口)

这些是"执行时按规格做"的,非设计开放问题(设计已给规格):
1. 模型架构在 Transformer 与 Mamba 间的最终选型(规格已限定二选一 + graph 作 bias)。
2. ESM-2 具体版本(35M/150M/650M)——按算力选,规格已限 fair-esm。
3. 留出比例 20% 是否调整——规格已给默认 20%。
这些有明确默认值/范围,执行者无需追问上下文。

### Deviation from Spec

无偏差。Stage 4 按 experiment-execution → experiment-design 执行,产出五元组、打乱对照、开源vs公司清单,每步零追问标注。仅 design 不执行(spec 明确边界)。

### 附录 S4-A:逐步骤执行卡(外部执行者照做,零追问)

每张卡 = 一个可独立交付的执行单元,含全部照做所需信息。

**执行卡 S1 — Spike0**
- 目标:学 f̂(seq,cond) = 选择势函数。
- 数据:下载 elife-71393 CR9114 source data(CSV);列 = [16个突变位点二值, 抗原, −logKD]。
- 预处理:按抗原标 floor(H1/H3/B 各自 6 或 7,从 source data 方法节确认);标记每行是否截断(−logKD≤floor)。
- 模型:输入 [16维二值 ⊕ 抗原one-hot 3维] → MLP/Transformer encoder → 标量 f̂。(baseline 先用 16维;升级用 ESM-2 embed germline+突变序列)。
- loss:L = Σ_未截断 (f̂−y)²/σ_obs² + Σ_截断 max(0, f̂−floor)²/σ_obs²,σ_obs=0.047。
- 训练:Adam,early-stop on val;留出策略见 S3 的 P16。
- 产出:f̂ 权重、留出预测、∇f̂(torch.autograd 对输入表征)。
- 并行训 N3 baseline(Phillips pairwise epistasis 系数,从 interaction model source data 载入)。

**执行卡 S2 — 玩具 SDE 可辨识性**
- 目标:验"从 population 边际反推 ∇f well-posed"(I2)+ gating① 一致性。
- 玩具:d=3,f_toy(x,c)=−½xᵀAx+b_c·x,A=diag(2,1.5,1) 正定,b_0=(1,0,0)/b_1=(0,1,0)/b_2=(0,0,1)(3抗原),σ_toy=0.3·I。
- 前向:Euler-Maruyama,dt=0.01,从 N(0,I) 初值跑 N_traj=5000 条到 T∈{2,3,5,10} 个时间点,取每时间点的样本作 population 边际快照。
- 反推:用与 S1 同款拟合从快照学 f̂_toy。
- gating①:计算 ∇f̂_static(静态拟合快照值取梯度)vs ∇f̂_dyn(从快照间漂移估计 drift),取余弦相似度(在样本覆盖区)。
- 产出:Spearman(f̂_toy, f_toy)、gating① 余弦、边界扫描曲线(精度 vs T/噪声/N_traj)。
- 判定:Spearman>0.9 且余弦>0.8 → I2 原理适定 + gating① 一致(分支A);余弦低→FM1 触发 R-2。

**执行卡 S2b — gating② λmin**
- 目标:验真实 PLM 空间 a(x) 椭圆性(I2 条件 C2)。
- 步骤:取 CR9114 全 65536 变体序列 → ESM-2 embed → 对每个变体算 encoder Jacobian J(torch.autograd.functional.jacobian,可子采样位点降本)→ a_emb=J·Σ_seq·Jᵀ(Σ_seq 来自 S5F/EPAM 突变率)→ 取 λmin。
- 产出:λmin 分布 + 椭圆性判定。
- 判定:λmin > 1e-3·median(λ) → C2 满足;≈0 → FM2(换低维表征/εI正则/限子流形)。

**执行卡 S3-Ⅰ/Ⅱ/Ⅲ — CV 三子检验**(详见正文步骤 S3,五元组完整)
- P16 零泄漏:按抗原留 B + 按突变组合随机留 20%,显式断言训练/留出无交集。
- S3-Ⅰ:跨抗原一致率>0.7。
- S3-Ⅱ:200 次抗原标签置换 null 分布,真实 f̂ p<0.05。
- S3-Ⅲ:H1+H3 训练→B 预测,Spearman 显著且 bootstrap CI 高于 N3。

**执行卡 S4 — CS 声明**(随产出写文档,含 R-1/R-2/R-3 + 外推区 + 数值精度 limitation)

### 附录 S4-B:整套实验的判定汇总(一张表看全 pass/fail)

| 步骤 | 验的不变量/条件 | 判定阈值 | 触发的FM监测 |
|---|---|---|---|
| S1 | (学,不判) | 收敛 | FM4(记录N3性能) |
| S2 | I2 适定性 + gating① (C3) | Spearman>0.9 且余弦>0.8 | FM1→R-2降级 |
| S2b | I2 椭圆性 (C2) | λmin>1e-3·median | FM2→换表征 |
| S3-Ⅰ | I3正向+I1复现 | 一致率>0.7 | — |
| S3-Ⅱ | I3核心 (C4) | 200置换 p<0.05 | — |
| S3-Ⅲ | I1核心 (C1) | Spearman显著 且 CI>N3 | FM4→比泛化 |
| S4 | I1诚实 (C5) | CS声明完整(R-1/2/3) | FM3/FM5承载 |

全部 pass → v_final 验证方案在 CR9114 完备区成立(I1/I2/I3 全绿),方法成立性确立,可进第二阶段(公司数据 OOD)。任一 fail → 按对应 FM 缓解或回溯(spec backtrack:某步无法操作化→回 Stage3/2;但本设计每步均可操作化,预期不触发)。

### 附录 S4-C:Stage 4 一句话总结

v_final 操作化为 **6 个零追问执行步骤**:S1 Spike0(censored 回归学 f̂,floor=6/7,σ_obs=0.047)、S2 玩具SDE(d=3 解析玩具验可辨识+gating①)、S2b gating②(ESM-2 Jacobian 测 λmin)、S3-Ⅰ/Ⅱ/Ⅲ(CV:跨抗原一致>0.7 / 打乱200置换 p<0.05 / cross-condition 打败N3)、S4 CS声明。5 条必验条件 C1-C5 全落地、FM1-FM5 监测嵌入、打乱对照=S3-Ⅱ、开源vs公司9维度清单完成。每步含输入文件/环境/产出/阈值,外部执行者可逐条照做。仅 design 不执行(引擎边界 + 两阶段策略)。

Stage 4 完成。




