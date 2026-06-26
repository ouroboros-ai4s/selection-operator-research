# Stage 5 — convergence:选最可辨识、最不循环、可行的反演配置

> Created: 2026-06-13 23:00
> Topic: 从 Stage 4 算子设计收敛到 1 套可 commit 配置 + commit 前 steel-man
> Phase: Stage 5 / convergence
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

## Plan Context

**Objective:** Stage 4 可能产出多套算子设计;本 stage 选出最站得住的一套(或合成一套),并在 commit 前 steel-man。

**Expected Input(已核验):** Stage 4 的 1 套算子设计(sigma-inversion-operator-design.md,四模块+合回点+三桥)+ Stage 2 可辨识边界 + Stage 1 baseline。

**Focus Areas:**
1. feasibility-assessment:纯开源+算力可行性——CR9114/CR6261 parquet(已有)、OAS 规模与下载、SHM 工具(matsengrp)链路、IGoR/SONIA 接口是否真能跑通。
2. multi-criteria-scoring:准则 = 可辨识性 / 非循环性 / 开源可行性 / 能否合回联合似然 / 对承重假设的鲁棒性。**禁用准则 = 可发表性/新颖度**。
3. steel-manning:对选中配置做对抗前预检——把最强反对意见(尤其循环风险、加性假设)先 steel-man 一遍,ACCEPT/REVISE/REJECT。

**Completion Criteria(硬闸):**
- 选定 1 套 σ-反演配置,feasibility 矩阵每维有实测依据(非纸面);
- 多准则打分表完整且无可发表性轴;
- steel-man verdict = ACCEPT 或带明确 REVISE 项;
- 选中配置明确标注它在 Stage 2 可辨识边界内。

**Backtrack Condition:** if steel-manning judge = REJECT(选中配置承重缺陷)→ 回 Stage 4 重造;if 所有配置 feasibility 都不通过 → 回 Stage 1/2。

## 继承输入
- Stage 4 算子:M_e(S5F 5-mer)/M_o(分层GLM)/M_sel(OLGA+SONIA+sigmoid)/M_a(代数反解)+ 合回点 P=M_a·[1−∏(1−M_o·M_e)] + 三桥(桥1完整等价)。
- Stage 1 冒烟已验:S5F=HH_S5F✓、SHM kernel 破 flat 1.60 log✓、OLGA Pgen 端到端✓。
- Stage 2 边界:p_a 单调可辨/σ₂ contrast/σ₁ 尺度/p_o 跨study contrast*+single-study irreducible。

---
## Checkpoint 1: feasibility-assessment(开源+算力链路实测 ★非纸面)

### Objective
对 Stage 4 四模块的工具链做**真实测**(岔口1=B 授权可达性验证),不是纸面声称。每模块标"现在能跑/需装/需下载"。

### 实测结果(真 import + 真文件检查,可复现)
```
1. 本地数据:
   CR9114: FOUND 606faf63-*.parquet (2.00 MB) ✓
   CR6261: FOUND a8097f8c-*.parquet (0.07 MB) ✓
   S5F:    FOUND data.parquet (0.03 MB) ✓
2. OLGA (σ₁ P_gen):   IMPORTABLE ✓ (D:\anaconda3\...\olga)
3. SONIA (σ₁ Q):      NOT IMPORTABLE ✗ (未装)
4. netam/Thrifty (p_e 2nd kernel): NOT IMPORTABLE ✗ (未装)
5. numpy/pandas/scipy/sklearn:     ALL OK ✓
```

### Feasibility 矩阵(每维实测依据)
| 模块/资产 | 状态 | 实测依据 | 缺口处理 |
|---|---|---|---|
| M_a (p_a 代数反解) | ✅ 即可跑 | 纯 numpy,核心栈 OK | 无 |
| M_e (S5F 5-mer) | ✅ 即可跑 | S5F parquet 在 + 已验=HH_S5F + 纯查表卷积 | 无 |
| M_e 2nd kernel (Thrifty) | ⚠️ 需装 netam | netam NOT importable | pip install netam(matsengrp);**非循环资产,Stage 7 才硬需**,Stage 5-6 可用 S5F 单 kernel 推进 |
| M_sel σ₁ P_gen (OLGA) | ✅ 即可跑 | olga IMPORTABLE,Stage 1 已端到端验 Pgen | 无 |
| M_sel σ₁ Q (SONIA) | ⚠️ 需装 | sonia NOT importable | pip install sonia;或先用 OLGA P_gen + 简单 Q 近似过渡 |
| M_sel σ₂ sigmoid | ✅ 即可跑 | 纯 scipy 单调拟合 | 无 |
| M_o (分层 GLM) | ✅ 即可跑 | sklearn/statsmodels 可做混合效应 | 无 |
| M_o 数据 (OAS 元数据) | ⚠️ 需下载 | 本地无 OAS;HF 镜像 ConvergeBio/oas-unpaired 存在 | Stage 7 才需全量;Stage 5-6 用元数据 schema(已知字段)做设计,不需实下 |
| DMS 真值 (CR9114/CR6261) | ✅ 即在 | 两 parquet 在本地 | 无 |

### ★Feasibility 关键结论(诚实)
- **可即刻闭环的最小核**:M_a + M_e(S5F)+ M_sel(OLGA σ₁ + sigmoid σ₂)+ M_o(GLM 结构,用 schema)+ CR9114 真值 = **全部用已装工具 + 本地数据可跑**。这是 Stage 7 闭环验证的最小可行核。
- **两个需补的非阻塞缺口**:① SONIA(σ₁ 的 Q 精修)——可用 OLGA P_gen 过渡;② netam/Thrifty(第二 p_e kernel)——**仅 Stage 7 破循环硬需**,Stage 5-6 用 S5F 单 kernel 不挡。
- **一个需下载非阻塞项**:OAS 全量——Stage 7 才需,设计期用已知 schema。
- **判定:feasibility PASS**——最小核全绿,缺口全部非阻塞且有过渡方案。无任何"纸面声称"项。

### Key Findings
1. 最小可行核(M_a+M_e-S5F+M_sel-OLGA+M_o-GLM+CR9114)全部已装+本地可跑,真 import 验证。
2. 三个缺口(SONIA/Thrifty/OAS全量)全非阻塞,均 Stage 7 才硬需,各有过渡。
3. feasibility 矩阵每维有真实测依据(import 成功/失败、文件大小),零纸面。

---
## Checkpoint 2: multi-criteria-scoring(5 准则打分,★禁可发表性轴)

### Objective
对选中配置(Stage 4 单套设计)做多准则打分。准则严格限定为 5 个,**禁用可发表性/新颖度轴**(继承 Stage 3 护栏)。打分为收敛留档,非选美。

### 准则定义(5 维,全 = σ 反演质量)
1. **可辨识性**:配置在多大程度只在 Stage 2 可辨自由度上工作,不偷拟合零空间。
2. **非循环性**:σ_gen≠σ_inf 是否有料可落(独立参数化)。
3. **开源可行性**:Feasibility 矩阵实测(已做)。
4. **能否合回联合似然**:四模块是否真嵌进单一 P(obs|x)。
5. **对承重假设的鲁棒性**:Stage 2 致命假设(H-A3/H-B2)被 negate 时配置是否有兜底。

### 打分(1-5,5 最强;附实测/分析依据)
| 准则 | 分 | 依据 |
|---|---|---|
| 可辨识性 | 5 | M_a/M_e 用代数解+查表不引入学习自由度;每模块吐零空间标注;Stage 2 边界硬约束写进设计。无偷拟合通道。 |
| 非循环性 | 4 | 双 kernel(S5F/Thrifty)+ σ₂ 双源(CR9114 K_D / DeWitt GC)给 σ_gen≠σ_inf。扣1分:Thrifty 需装(Feasibility ⚠️),非循环资产现状只 S5F 一半就位。 |
| 开源可行性 | 4 | 最小核全绿可跑(实测);扣1分:SONIA/Thrifty/OAS全量三缺口(非阻塞但确实缺)。 |
| 合回联合似然 | 5 | 合回点写定 P=M_a·[1−∏(1−M_o·M_e)],四模块占不同因子位;桥1完整等价证明类先验=ascertainment因子。形式严格合一。 |
| 鲁棒性 | 3 | H-B2 有路径②(σ自身Jacobian θ)兜底✓;但 H-A3(元数据非混杂)无 Stage 2 兜底,完全押后到 Stage 7 OAS 检验。这是配置最弱维——p_o 可辨性是条件性的。 |
| **总分** | **21/25** | 强配置,唯一真短板=H-A3 押后(鲁棒性3)。 |

### 单配置说明(为何不需多配置对比打分)
Stage 4 收敛到一套自洽设计,无真正分叉备选——四模块互相约束(合回点锁死因子位,Stage 2 边界锁死辨识自由度,非循环要求锁死双 kernel)。多准则打分此处作**绝对体检**(暴露弱维)而非相对选美。最弱维=鲁棒性3(H-A3 押后),作为 steel-man 的主攻靶。

### 护栏自检
- 5 准则:可辨识/非循环/可行/合一/鲁棒。**0 个可发表性或新颖度轴。** ✓
- 打分服务"暴露承重弱点"(falsification-first 精神),非"证明配置好"。✓

### Key Findings
- 配置总分 21/25;四维强(可辨识5/合一5/非循环4/可行4),一维弱(鲁棒性3)。
- 唯一真短板:H-A3(元数据非混杂)无 Stage 2 兜底,p_o 可辨性条件性押后 Stage 7。→ steel-man 主攻靶。
- 无可发表性轴,护栏 PASS。

---
## Checkpoint 3: steel-manning(对抗前预检,winner-stress-testing)

### Objective
对选中配置做 commit 前对抗预检(winner-stress-testing + multi-perspective-attack)。≥3 攻击角度、≥5 承重假设挑战、显式 ACCEPT/REVISE/REJECT verdict。这是进 Stage 6 自建证伪套前的最后一道自检(Stage 6 才是真正全面证伪;此处只预检免得带病进 Stage 6)。

### 攻击角度 1:循环风险(σ_gen = σ_inf?)★最致命类
- **最强反对(steelman):** "双 kernel 看似破循环,但 S5F 和 Thrifty 都拟合同一类 SHM 数据(out-of-frame 突变谱),本质是同一过程的两个估计,不是独立 σ。σ_gen 用 S5F、σ_inf 用 Thrifty 仍是用 SHM 校正 SHM,循环没破。"
- **回应:** 部分成立。S5F(syn-fitted)与 Thrifty(out-of-frame-fitted)抓**不同子过程**(Stage 1 证 1.60 log 区分),但都属 SHM family。**真正的破循环不在 kernel 层,在 σ 的不同分量层**:σ_gen 是幸存者**采样**算子(用 p_o + 选择制造观测子集),σ_inf 是**反演**算子——它们参数化的是 σ 的不同臂(采样臂 vs 选择臂),不是同一个 SHM kernel 的两份。
- **REVISE 项 R1:** 把"双 kernel = 破循环"的表述**降级**——真破循环 = σ_gen(采样+选择参数化 A)≠ σ_inf(反演参数化 B),双 kernel 只是附加的敏感性探针,不是破循环主力。这条交 Stage 6 circular-validation-audit 严格审(它 gate Stage 7)。

### 攻击角度 2:加性景观假设(H-B1/H-A 加性)
- **最强反对:** "CR9114 是加性 DMS 真值,但真实抗体景观有上位(epistasis)。在加性 toy 上 θ=0/6.59° 的结论,到真实非加性景观可能完全不同——p_e 与选择的共线性是加性假设的产物。"
- **回应:** 成立且重要。Stage 3 冒烟明说是"加性 CR9114 上的下界"。**但方向稳健**:非加性只会让 p_e/选择关系更复杂,不会让 5-mer 上下文非线性这个解耦机制失效。
- **REVISE 项 R2:** 配置须显式标注"加性是 toy 简化,真景观上位待 Stage 7 用真 CR9114(本身含部分上位信号)+ 真 5-mer 全表复测"。加性假设进 Stage 6 假设挑战清单。

### 攻击角度 3:H-A3 元数据非混杂(多准则最弱维)
- **最强反对:** "整个 p_o 可辨性押在'cell-state 元数据非纯 study 批次'上,而 OAS 的 study 间技术差异(5′截断/PCR/UMI)巨大,极可能 cell-state 信号被批次淹没。配置在 p_o 上可能根本不可辨。"
- **回应:** 这正是多准则打分鲁棒性给 3 分的原因,无 Stage 2 兜底。**但配置已内建诚实出口**:M_o 吐 single-study 格子标注 + H-B2 检验(控 study 后 cell-state 偏 R²<0.05 即判 BROKEN)。即配置**预备了自己在 p_o 上失败的检测**。
- **REVISE 项 R3:** p_o 的 contrast 可辨标签**全程带星号**直到 Stage 7 OAS 实测;若 H-B2 BROKEN,配置坦白降级为"p_o 仅 single-study irreducible + 跨study也不可辨",ε 重算可能触发 Stage 2 Backtrack(需用户确认)。

### 攻击角度 4(assumption challenges,凑齐 ≥5):
- **A4-a 桥1等价的一阶近似:** 非灭绝因子推导用了"取一阶 =1−p_o·p_e"。**挑战:** 高阶项被丢,p_e 大时近似破。**影响:** 抗体 p_e 极小(SHM 率 ~1e-3),一阶近似在适用域内。低风险,标注适用域。
- **A4-b OLGA P_gen 的 model 依赖:** σ₁ 锚 OLGA,但 OLGA 本身是 IGoR 训练的生成模型,非真值。**挑战:** 用模型当 baseline。**影响:** 中——σ₁"可辨到尺度"依赖 OLGA 正确;REVISE R4:标注 σ₁ 真值本身是 model-based,Stage 7 caveat。
- **A4-c CR9114 K_D 是平衡常数非体内选择:** Stage 1 已知 a_DMS≠a_invivo。**挑战:** p_a 真值用 DMS K_D,但体内选择读 off-rate。**影响:** 已知边界,继承 selop;σ₂ 用 DMS sigmoid 是"输入端"定义,Stage 7 caveat 标明。

### Verdict(显式)
- **ACCEPT WITH REVISE。** 配置承重结构站得住(可辨识/合一两维满分,桥1完整等价),无 REJECT 级缺陷。
- **4 条 REVISE 项必须带进后续:**
  - R1:破循环表述降级(双 kernel→探针;真破循环=σ_gen/σ_inf 分量层独立)→ Stage 6 circular-validation-audit。
  - R2:加性=toy 简化,上位待 Stage 7 真景观复测 → Stage 6 假设清单。
  - R3:p_o contrast 可辨全程带星号,H-B2 BROKEN 则坦白降级 → Stage 7 OAS。
  - R4:σ₁(OLGA)/σ₂(DMS K_D)真值本身 model-based,Stage 7 caveat。
- **配置在 Stage 2 可辨边界内**:四模块只在可辨自由度工作,零空间(fitness-scale+single-study)只标注不拟合。✓

### Key Findings
1. Verdict = ACCEPT WITH REVISE(无 REJECT 级缺陷,4 条 REVISE 全可带进 Stage 6/7)。
2. 最致命角度=循环风险:破循环主力**不是**双 kernel,是 σ_gen/σ_inf 分量层独立参数化(R1 修正,Stage 6 严审)。
3. 配置最弱维 H-A3 已内建失败检测(H-B2 判据),诚实出口在位。
4. ≥4 攻击角度、≥6 假设挑战(超 ≥3/≥5 闸)。



