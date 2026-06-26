# Research Spec: 抗体 Repertoire 观测算子 σ 的彻底反演

> Generated: 2026-06-13
> North Star: 彻底拿下抗体 repertoire 的观测算子 σ —— 把「我们看到的序列 = 真实功能景观经『存活/选择/采样』投影后的像」整个拆开反演,刻画可辨识部分与 irreducible 零空间,在组合完备 DMS(CR9114/CR6261,答案全知)上做闭环验证。
> Scope: 7 stages, estimated 6-9 sessions
> Source: de-anthropocentric-research-engine
> Resource floor: 开源 dataset + 部分合成(禁纯沙盒)。合成只限「幸存者采样算子」;p_a/p_e/σ 的每个分量必须锚在实测开源数据。
> 关系: 与现 selop(另一 CC 推 φ=亲和→适应度,走树-SBI)正交互补。本 spec 推 p_a(功能性)并把 σ(存活/采样投影)当主对象反演,走 survivorship-PU,站 Evo-PU(arXiv:2605.06879)肩上补它的抗体洞。

---

## 这份 spec 要彻底解决什么(读执行者必读)

A/B/C/D **不是四个独立课题,是同一个观测算子 σ 的四个分量**,必须一起拿下、且能合回一个联合观测似然,才叫"彻底":
- **A = 突变可达分量 p_e**:什么 SHM 路径可能产生我们看到的序列(已知 hotspot-aware 算子,非通用核苷酸 kernel)
- **B = 采样/监测通道 p_o(x,m)**:序列经哪条 cell-state 通道(naive/memory/plasma, blood/spleen, isotype)被测到
- **C = 选择复合 σ₁∘σ₂**:generation/tolerance σ₁(从非生产性序列估)与亲和力 σ₂(sigmoid)的复合
- **D = 反卷积闭环验证**:在答案全知的 CR9114 完备景观上,证明从幸存者采样真能反演 σ + 重建隐藏景观,并量化 irreducible 零空间

**核心纪律(继承 selop):** 目标是反演整个观测算子 + 诚实标出零空间,**不是造一个更好的功能预测器**。逆问题 + 非平凡零空间 + 诚实残余。

## 核心数学骨架(Evo-PU,外部铁证)

```
P(观测到 x) = p_a(x;θ) · [ 1 − ∏_{y∈Y(x)} (1 − p_o · p_e(y;α)) ]
              └ 功能性 φ ┘   └────── 监测σ × 突变可达a ──────┘
```
Evo-PU 在病毒上 work、ProteinGym 上 fail,自陈两因:① 全局标量 p_o 抓不住异质监测;② 无 prevalence。**抗体把这两弱点翻成强项**:p_e=已知 SHM 算子;σ=可观测复合(非生产性 baseline + 亲和力 sigmoid + OAS cell-state 元数据);p_a 真值=组合完备 DMS(零幸存者污染)。

---

## Global Context Protocol

- 每个 stage 开始 invoke `context-init`,创建 `context/sigma-inversion-[stage]-[topic].md`。
- 每个 strategy 完成后 invoke `context-checkpoint`,append ≥500 行过程+结果(硬约束,不可跳)。
- 一个 context file per stage;跨 stage 的承重结论(可辨识等价类、零空间刻画、FalsificationLedger)额外汇总到 `context/sigma-inversion-INDEX.md`。
- 关键 paper IDs 与数据集标识在每个 checkpoint 里 verbatim 记录(便于续 background)。

## Global Execution Rules

- 每个 stage 的 Completion Criteria 是量化硬闸,达不到(±10%)不得进下一 stage。
- Backtrack 需用户确认后才执行,不自动回退。
- 架构选型 problem-driven:用现代/不落后的技术即可,非硬白名单;GNN/CNN/RNN 不禁用,按问题选。不为"现成工具套新领域"而设计(全原创要求)。
- **资源红线**:全程开源 dataset + 纯算力;唯一允许的合成 = 幸存者采样算子(用于在已知真值上制造"被观测"子集)。禁纯沙盒世界。
- **求真红线(继承 selop 对抗轮 7 约束)**:① 非循环——污染模拟用的 σ ≠ 反演用的 σ(独立参数化);② 不让模型偷看答案;③ abundance≠affinity(PMC5337809),prevalence 不可当 fitness 代理。

## Global Backtrack Conditions

- 任一 stage 发现承重假设被证伪(如 σ 某分量数学上不可辨、SHM 模型 out-of-frame→in-frame 不可迁移)→ 回到引入该假设的 stage。
- Stage 6 对抗轮把某条 σ-反演主张判为 BROKEN 且为承重 → 回 Stage 4/5 重构,或回 Stage 2 重审可辨识性。
- 闭环验证(Stage 7)显示反演的 σ 重建景观与真值系统性偏离且非零空间所致 → 回 Stage 4。

---

## Stage 1 — knowledge-acquisition:系统补齐 σ 反演的承重知识

**Objective:** 把反演 σ 所需的五块知识系统化抓齐,并测准现有 baseline 到哪——不是泛泛文献综述,是为"造算子"备料。

**Expected Input:** ResearchBrief(`context/2026-06-13-17-10-research-brief.md`)已给 North Star、数学骨架、关键 paper IDs、数据集表。本 stage 把这些从"侦察级"升到"可建模级"。

**Focus Areas(五块,缺一不可):**
1. **Evo-PU 数学全细节**:似然、p_e 近似、p_o 标量、训练目标、补集近似——已读(arXiv:2605.06879),本 stage 复核可复现性。
2. **Mora-Walczak Pgen/Ppost 机制**:IGoR/OLGA/SONIA/soNNia 如何从非生产性序列估 selection-free baseline,Q=Ppost/Pgen 的数学(→ σ₁)。
3. **SHM 算子**:S5F(5-mer)、Thrifty(13-mer CNN)、EPAM——参数、训练数据(out-of-frame)、开源接口(→ p_e kernel)。
4. **选择偏差校正的跨域武器**:Heckman two-step、IPW、phylogenetic ascertainment（条件非灭绝）——映射到 σ 的可行性。
5. **OAS 数据结构 + 元数据 schema**:cell-source/sort-gate/isotype/study 字段、paired 比例、技术偏差层(5′截断/PCR/UMI)、abundance≠affinity 红线（PMC5337809）。

**Recommended Combination:** knowledge-acquisition → literature-survey, baseline-establishment

**Completion Criteria:** 五块各产出可建模级摘要（含数学式/接口/字段);baseline 表实测记录 Evo-PU、AbLWR(arXiv:2604.11272)、Bakis-Minin(arXiv:2508.09519)在各自任务上的具体数字与适用边界;≥40 篇 paper 过 paper-search 级、≥10 篇 paper-research 级全文。

**Backtrack Condition:** if 发现 σ 的某分量根本无开源数据支撑(如 cell-state 元数据不可用)→ 回 North Star 重审该分量是否该留(需用户确认)。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-ka-knowledge.md`
- [x] literature-survey:五块知识 PRISMA/snowball 抓齐
- [x] context-checkpoint
- [x] baseline-establishment:Evo-PU/AbLWR/Bakis-Minin SOTA 实测到哪 + 适用边界
- [x] context-checkpoint
- [x] 汇总到 sigma-inversion-INDEX.md

---

## Stage 2 — deep-insight:可辨识性闸(最前置,凌驾一切)

**Objective:** 在造任何算子之前,先回答"σ 哪部分能从开源数据反演、哪部分是 irreducible 零空间"。这是与"造预测器"路线最根本的区别——不先定零空间,后面全是拟合幸存者噪声。

**Expected Input:** Stage 1 的五块知识 + baseline 边界 + 现有非辨识结果(Bakis-Minin 标的 λ/μ/ρ 非辨识、Louca-Pennell 同余类）。

**Focus Areas:**
1. **问题重述(problem-reformulation)**:把"造功能分类器 p_a"显式重述为"反演观测算子 σ + 诚实标零空间"。锁死 governing variable = 算子可辨识性,不是预测精度。
2. **可辨识性边界(boundary-analysis)**:import Louca-Pennell(Nature 2020)birth-death 同余类机制,刻画 (p_a, σ₁, σ₂, p_o) 联合可辨识到什么程度（到尺度?到单调变换?contrast 可消哪些自由度?）。明确 irreducible 零空间 = 哪些不同 σ 产生同分布观测。
3. **承重假设敏感性(sensitivity-analysis)**:加性景观假设、SHM out-of-frame→in-frame 可迁移、元数据非混杂（p_o(x,m) 不是只学 study identity)——逐条 negate 看结论翻不翻。

**Recommended Combination:** deep-insight → problem-reformulation, boundary-analysis, sensitivity-analysis

**Completion Criteria:** 产出一张「σ 可辨识性地图」,覆盖全部 4 个分量(p_a, σ₁, σ₂, p_o);每个分量打且仅打一个标签 ∈ {可辨识到尺度/单调变换、仅 contrast 可辨、irreducible},并附该判定的数学依据;零空间维度给出可计算定义(继承 selop:三子空间主夹角 θ 与比值 dim R_irr / dim 全谱 = ε,两个量都给出数值阈值,否则该判定视为不可证伪);≥3 条承重假设各有一条"该假设被 negate 后结论是否翻转"的敏感性记录。

**Backtrack Condition:** if 发现整个 σ 在开源数据下基本不可辨（零空间吃掉主要自由度)→ 回 Stage 1 找额外可观测约束（非生产性 baseline / DMS / 元数据 哪个能补辨识性)。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-identifiability.md`
- [x] problem-reformulation:锁死"反演算子+标零空间"纪律
- [x] context-checkpoint
- [x] boundary-analysis:可辨识等价类 + 零空间刻画（import Louca-Pennell）
- [x] context-checkpoint
- [x] sensitivity-analysis:承重假设逐条 negate
- [x] context-checkpoint
- [x] 可辨识性地图汇总到 INDEX

---

## Stage 3 — hypothesis-formation:把 σ 的四面写成可证伪命题

> ⚠️ **防 PAPER 化护栏(本 stage 最高优先级,凌驾 campaign 默认行为)**
> 这批 skill(gap-prioritization / hypothesis-formulation / research-question)骨子里是发论文导向的——FINER/PICO/SPIDER 模板带 publishability,默认会把思考往"能发几篇、新不新、referee 接不接受、把大问题切成可发表小块"上带。执行时**必须按下面重定义,禁用其默认的可发表性/新颖性逻辑**。出现下列跑偏信号即判定 stage 失败、回炉重做:
>
> **① gap-prioritization 重定义:**
> 排序轴 = "解决这个承重未知量,是否反演整个 σ 算子所必需"。
> 禁用轴 = 可发表性 / 新颖度 / referee 接受度 / FINER / 引用潜力。
> σ 是一个完整对象,四面(p_e/p_o/σ₁σ₂/反卷积)是它的四个分量,不是四个"可独立发表的 gap"。排序只为定攻击次序,不为切论文。
>
> **② hypothesis-formulation 重定义:**
> 产物 = 关于 σ 结构/可辨识性的可证伪命题。
> falsifiability 判据 = "什么计算/观测会推翻它"(Platt strong inference / Mayo severe testing)——**不是**"什么实验能让 referee 接受"。
> 例:H1「SHM-aware p_e 在 CR9114 上恢复功能性 AUC > Evo-PU 通用 kernel,否则本命题 BROKEN」;H2「反演的 σ₂ 匹配独立测的 GC sigmoid,偏差 > 阈值则 BROKEN」。每条都自带"怎么死"。
>
> **③ research-question 重定义:**
> ★硬禁止把 σ 切成"能写 N 篇 paper 的子问题"。唯一允许的分解 = 算子分量分解(已在 Stage 2 定),且分解后必须能合回一个 P(obs|x) 联合似然(Stage 4 缝合验证)。
> success criteria = "σ 反演到可辨识边界 + 零空间被诚实量化",**不是**"产出 X 个可发表结果"。
>
> **④ 新颖性只作工具性判据:**
> 仅用于区分 EARNED simplicity(禁止/预测/subsume)vs DECORATIVE simplicity(重描述/换标签)——见 Stage 6 elegance-trap-probe。"因为新所以做"被禁止;"因为是反演 σ 所必需所以做"才允许。
>
> 这条护栏不止本 stage:凡引擎默认 skill 偏发表/存活导向处(如默认 stress-test 偏加固而非证伪)均适用。

**Objective:** 把 Stage 2 定下的 σ 可辨识分量,转成排序后的、每条自带证伪条件的命题集。

**Expected Input:** Stage 2 的可辨识等价类 + 零空间刻画 + 承重假设清单。

**Focus Areas:** 四面命题(A=p_e SHM-aware emergence / B=p_o(x,m) cell-state 采样 / C=σ₁∘σ₂ 选择复合 / D=反卷积闭环)+ 各自 falsifiability 判据 + 攻击次序(依赖关系,非可发表性)。

**Recommended Combination:** hypothesis-formation → gap-prioritization, hypothesis-formulation, research-question

**Completion Criteria:** 四面各 ≥1 条可证伪命题,每条写明"什么计算结果会判它 BROKEN";**0 条命题以可发表性/新颖性为存在理由**(违反即回炉);所有分量命题能在形式上合回单一 P(obs|x) 联合似然(否则不是"反演整个 σ")。

**Backtrack Condition:** if 任一命题无法写出证伪条件(不可证伪)→ 回 Stage 2 重审该分量可辨识性。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-hypotheses.md`
- [x] **先把上面整段防 paper 化护栏抄进 stage context 顶部(锚定纪律,执行全程对照)**
- [x] gap-prioritization:按"反演 σ 必需性"排四面攻击序
- [x] context-checkpoint
- [x] hypothesis-formulation:每面 → 可证伪命题 + Platt/Mayo 判据
- [x] research-question:框定 scope + success criteria(禁切论文,须能合回联合似然)
- [x] context-checkpoint

---

## Stage 4 — creative-ideation:造 σ 的算子(problem-driven,不预设架构)

**Objective:** 把抽象的观测似然落成可计算的、四个分量可独立估计又能合回一体的算子族。原创要求:不是"现成工具套新领域",是问题本身要求的算子。

**Expected Input:** Stage 3 的四面可证伪命题 + Stage 2 可辨识边界(只在可辨识自由度上造,不去拟合零空间)。

**Focus Areas:**
1. **结构拆解(structural-deconstruction)**:把 `P(obs|x)=p_a·[1−∏(1−p_o·p_e)]` 拆成四个可独立估的模块,定清接口(各自吃什么开源数据、吐什么)。
2. **跨域桥接(cross-domain-discovery)**:把 Mora-Walczak Pgen/Ppost(σ₁)↔ Evo-PU survivorship class prior ↔ Heckman/IPW 选择校正 ↔ phylogenetic ascertainment 四套数学桥到同一个 σ 形式——这是核心 novelty,但只作工具(见 Stage 3 护栏④)。
3. **组合(combinatorial-creativity)**:SHM 算子(S5F/Thrifty/EPAM)装进 p_e 的 emergence kernel;祖先集从"population prevalence"换成"germline-rooted clonal lineage",距离从 flat Hamming 换成 SHM 加权。
4. **架构选型**:problem-driven。p_a 分类器、p_e/p_o 参数化用什么(逻辑回归→现代序列模型皆可),按可辨识性 + 数据规模选,用现代不落后技术,不预设白名单。

**Recommended Combination:** creative-ideation → structural-deconstruction, cross-domain-discovery, combinatorial-creativity

**Completion Criteria:** 产出 ≥1 套完整的 σ-反演算子设计,四分量接口齐全且能合回单一似然;p_e 用 SHM 算子的具体装法写定;σ₁(非生产性 baseline)与 σ₂(DMS sigmoid)的估计路径写定;每个组件标注"锚在哪个开源数据"(无悬空组件);Pgen/Ppost↔Evo-PU↔Heckman 至少一条桥的数学等价/近似关系写明。

**Backtrack Condition:** if 算子在 Stage 2 的可辨识边界内无法闭合(某分量只能靠零空间自由度才能估)→ 回 Stage 2 重定边界或回 Stage 1 找新约束。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-operator-design.md`
- [x] structural-deconstruction:似然拆四模块 + 接口
- [x] context-checkpoint
- [x] cross-domain-discovery:Pgen/Ppost↔survivorship-PU↔Heckman/IPW 桥接
- [x] combinatorial-creativity:SHM 算子装进 p_e + germline 谱系祖先集
- [x] context-checkpoint

---

## Stage 5 — convergence:选最可辨识、最不循环、可行的反演配置

**Objective:** Stage 4 可能产出多套算子设计;本 stage 选出最站得住的一套(或合成一套),并在 commit 前 steel-man。

**Expected Input:** Stage 4 的 ≥1 套算子设计 + Stage 2 可辨识边界 + Stage 1 baseline。

**Focus Areas:**
1. **可行性(feasibility-assessment)**:纯开源+算力可行性——CR9114/CR6261 parquet(已有)、OAS 规模与下载、SHM 工具(matsengrp)链路、IGoR/SONIA 接口是否真能跑通。
2. **多准则打分(multi-criteria-scoring)**:准则 = 可辨识性 / 非循环性 / 开源可行性 / 能否合回联合似然 / 对承重假设的鲁棒性。**禁用准则 = 可发表性/新颖度**(继承 Stage 3 护栏)。
3. **Steel-manning**:对选中配置做对抗前预检——把最强的反对意见(尤其循环风险、加性假设)先steel-man一遍,ACCEPT/REVISE/REJECT。

**Recommended Combination:** convergence → feasibility-assessment, multi-criteria-scoring, steel-manning

**Completion Criteria:** 选定 1 套 σ-反演配置,feasibility 矩阵每维有实测依据(非纸面);多准则打分表完整且无可发表性轴;steel-man verdict = ACCEPT 或带明确 REVISE 项;选中配置明确标注它在 Stage 2 可辨识边界内。

**Backtrack Condition:** if steel-manning judge = REJECT(选中配置承重缺陷)→ 回 Stage 4 重造;if 所有配置 feasibility 都不通过 → 回 Stage 1/2。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-convergence.md`
- [x] feasibility-assessment:开源+算力链路实测
- [x] multi-criteria-scoring:可辨识/非循环/可行/可合一/鲁棒(禁可发表性)
- [x] steel-manning:对抗前预检
- [x] context-checkpoint

---

## Stage 6 — stress-test:★自建 falsification-first 套砸"我们真反演了 σ 吗"

> **不用引擎默认 stress-test campaign。** 默认那套(red-teaming/adversarial-stress-testing)偏存活/加固导向,产 resilience 分与 hardening list。本 stage 用用户自建的 **falsification-first-stress-test 套**(在 `context/selection-operator-v2/stress-test-skills/`,7 个 skill),赢条件**翻转为主动证伪**,产 FalsificationLedger(三桶 BROKEN / CORROBORATED / UNFALSIFIABLE),不产 resilience 分。

**Objective:** 主动攻击"σ 被成功反演"这组承重主张,找出我们在哪自欺了,并确认每条承重主张是否可证伪。

**Expected Input:** Stage 5 选定的 σ-反演配置 + Stage 3 的可证伪命题 + Stage 2 可辨识边界。

**Focus Areas(7 skill 对位 σ 的具体风险):**
1. **circular-validation-audit ★★ 最关键**:D 面致命死穴——用来"污染"模拟的 σ = 你要反演的 σ → 建 non-circularity 矩阵(theory-claim × validator-assumption),证明"必须用独立参数化的 σ 污染、另一独立 σ 反演",否则 PASS 零证据力。
2. **red-team-truthseeking**:逐条 σ-反演主张配"什么计算会证伪它";造对抗真值世界(σ 部分可被动力学吸收 / 加性假设破 / 元数据只编码 study identity)让方法诚实失败。
3. **elegance-trap-probe**:"σ 漂亮分解成四面"是 EARNED(禁止/预测/subsume)还是 DECORATIVE(重描述/换标签)?直接服务用户的 Occam 判据。
4. **independent-convergence-audit**:若多路(Pgen↔Evo-PU↔Heckman 桥)都说"σ 可反演",查是否共享编排者先验/共享盲点,校正过counted的 confidence。
5. **isomorphism-falsification**:攻"本课题 σ ≈ Evo-PU 的 p_o·p_e·p_a"这条同构主张——要么给出 explicit structure-preserving map 并扛住,要么降级为 analogy。
6. **adversarial-debate-truthseeking**:defender 把"σ 可反演"steelman 成最可证伪形式 → critic 攻 → judge 分桶(不选赢家、不打说服力分)。
7. **falsification-first-stress-test(campaign 壳)**:汇总成 FalsificationLedger。

**Recommended Combination:** falsification-first-stress-test(campaign)→ circular-validation-audit, red-team-truthseeking, elegance-trap-probe, independent-convergence-audit, isomorphism-falsification, adversarial-debate-truthseeking

**Completion Criteria:** 产出 FalsificationLedger:≥10 条承重主张全部三桶分类;circular-validation-audit 的 non-circularity 矩阵完成且 D 面验证设计的循环风险被显式判定(PASS 须证非循环);每条 BROKEN 主张标注是否承重 + 回退去向;elegance verdict 明确(EARNED/DECORATIVE,decorative 部分须坦白)。

**Backtrack Condition:** if 某条承重主张 BROKEN → 回 Stage 4/5 重构,或(若是可辨识性问题)回 Stage 2;if circular-validation-audit 判定 Stage 7 设计循环且无法去循环 → 回 Stage 4 重设计验证。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-falsification.md`
- [x] 载入 `context/selection-operator-v2/stress-test-skills/` 7 skill
- [x] circular-validation-audit(先跑,因为它 gate 住 Stage 7 设计)
- [x] red-team-truthseeking + 对抗真值世界构造
- [x] elegance-trap-probe + independent-convergence-audit + isomorphism-falsification
- [x] adversarial-debate-truthseeking
- [x] context-checkpoint:FalsificationLedger 汇总到 INDEX

---

## Stage 7 — experiment-execution:闭环验证设计(纯开源+部分合成,禁纯沙盒)

> **只做设计,不实跑**(executing-specs 阶段才跑)。**资源红线**:真值与协变量全部锚在实测开源数据;唯一合成 = 独立参数化的幸存者采样算子。**禁纯沙盒世界。**

**Objective:** 设计一个闭环验证:从幸存者采样的观测 → 反演 σ → 重建隐藏功能景观 → 比组合完备真值 → 残差反馈 refine,并量化 irreducible 零空间。

**Expected Input:** Stage 5 配置 + Stage 6 FalsificationLedger(尤其 circular-validation-audit 的非循环要求)+ Stage 2 零空间刻画。

**Focus Areas:**
1. **闭环主轴(experiment-design)**:真值 = 真实 CR9114(2¹⁶)/CR6261(2¹¹)完备 K_D 景观(答案全知)。用**独立参数化**的幸存者采样算子 σ_gen 制造"被观测子集" → 反演算子估 σ_inf 与重建景观 → 比真值 → 残差反馈 refine(闭环,非一次性)。**破循环:σ_gen ≠ σ_inf(不同参数化),且 σ_gen 用一组、σ_inf 校正用另一组独立 σ。**
2. **真实交叉验证**:DeWitt GC-replay(真实幸存者采样 + 已知 GC 亲和力 sigmoid 当 σ₂ 真值)+ OAS(真实异质监测 cell-state 元数据当 p_o(x,m) 协变量)。证明方法不只在合成采样上 work,在真实幸存者数据上也站得住。
3. **零空间实证(constraint-analysis)**:在完备景观上,定量给出"反演能恢复到哪、哪部分 σ 注定恢复不了"——把 Stage 2 的理论零空间刻画落成可测残差。
4. **资源/迁移风险写明**:SHM 模型 out-of-frame→in-frame 迁移风险、加性 DMS 真值本身是模型、OAS 元数据=study 混杂——逐条写进设计的 caveat,不藏。

**Recommended Combination:** experiment-execution → experiment-design, constraint-analysis

**Completion Criteria:** 产出可执行的闭环验证设计:① 真值/合成/反演/重建/比对/反馈六环齐全且每环锚定具体开源数据或明确的独立合成算子;② 循环风险被 Stage 6 矩阵判定为 PASS（σ_gen≠σ_inf 写死);③ 至少 1 个真实数据交叉验证轴(GC-replay 或 OAS)有具体落地步骤;④ 零空间量化指标(可恢复率 / dim R_irr)有可计算定义;⑤ ≥3 条 caveat 显式写明。**不含任何纯合成沙盒世界**。

**Backtrack Condition:** if 设计无法去循环(σ_gen 与 σ_inf 必然耦合)→ 回 Stage 4 重设计反演算子;if 完备真值不足以暴露零空间 → 回 Stage 2 重审零空间可测性。

**Execution Steps:**
- [x] context-init → `context/sigma-inversion-experiment-design.md`
- [x] experiment-design:闭环六环 + 独立 σ_gen/σ_inf 破循环
- [x] context-checkpoint
- [x] constraint-analysis:零空间实证指标 + 资源/迁移 caveat
- [x] context-checkpoint
- [x] 全 spec 产物汇总到 sigma-inversion-INDEX.md

---

## 附录 A — 关键数据集(全开源)

| 数据集 | 内容 | ID/访问 | 角色 |
|---|---|---|---|
| CR9114/CR6261 DMS | 组合完备 K_D 景观(2¹⁶/2¹¹ 全中间体,回溯 germline) | eLife 71393;用户已有 parquet(cr9114 65536×11, cr6261 2048×8) | **答案钥匙**:p_a 真值 + 反卷积闭环靶 |
| DeWitt GC-replay | 52–119 平行 GC,单细胞 BCR + DMS 亲和力景观 + 7 时点 bulk;自称低亲和力宽容/plateau 是幸存者伪影 | bioRxiv 2025.06.02.656870 / Cell S0092-8674(26)00572-6;Zenodo 15022130 | σ₂ sigmoid 真值 + 真实幸存者交叉验证 |
| OAS | ~2.4B unpaired/~1.5M paired BCR + cell-source/sort-gate/isotype/study 元数据 | Olsen/Deane pro.4205;HF Parquet 镜像 | 真实异质监测 p_o(x,m) 协变量 |
| SHM 算子 | S5F(Yaari/Kleinstein 2013)/Thrifty(eLife 105471)/EPAM(bioRxiv 2025.06.16.659977) | matsengrp/* | p_e emergence kernel |
| 非生产性/out-of-frame | selection-free baseline | OAS 内含;Sheng GSSP PMC5424261 | σ₁ generation/tolerance |
| Pgen/Ppost 工具 | IGoR/OLGA/SONIA/soNNia | Mora-Walczak PLoS Comput Biol 1008394 | σ₁ 选择校正机制 |

## 附录 B — 关键 paper IDs

- **Evo-PU**(外部铁证,σ∘φ∘a 的独立重构):arXiv:2605.06879
- **AbLWR**(PU-on-antibodies 但无 σ,baseline):arXiv:2604.11272
- **Bakis-Minin**(GC 多型分支过程,λ/μ/ρ 非辨识,baseline):arXiv:2508.09519
- **Ralph 等树-SBI**(现 selop 同路,对照):arXiv:2508.09871
- **CR9114/CR6261 DMS**:eLife 71393
- **Thrifty SHM**:eLife 105471 / bioRxiv 2024.11.26.625407;**EPAM**:bioRxiv 2025.06.16.659977
- **abundance≠affinity 红线**:PMC5337809
- **Louca-Pennell 非辨识同余类**:Nature 2020
- **OAS**:Protein Science pro.4205

## 附录 C — 与现 selop(另一 CC)的分工

- 现 selop 推 **φ**(亲和→适应度 link),走树-SBI(同 Matsen/Victora 阵营)。把 σ 当"承认存在的 irreducible 障碍"。
- 本 spec 推 **p_a**(功能性)并把 **σ**(存活/采样投影)当主对象**正面反演**,走 survivorship-PU,站 Evo-PU 肩上。
- 两条共享同一元发现(观测=投影复合,逆问题有非平凡零空间),互为对照/补强,**不内耗**。

---

## 执行须知(给 executing-specs)

1. 7 stage 顺序执行;每 stage Completion Criteria 是硬闸(±10%)。
2. **Stage 2(可辨识性)是最前置闸**——不先定零空间,后面全是拟合幸存者噪声。
3. **Stage 3 的防 paper 化护栏必须抄进 stage context 顶部**,执行全程对照;凡引擎默认 skill 偏发表/存活处均适用此护栏。
4. **Stage 6 用自建 falsification 套**(`context/selection-operator-v2/stress-test-skills/`),不用引擎默认 stress-test;circular-validation-audit 先跑,它 gate 住 Stage 7。
5. **资源红线全程生效**:开源 dataset + 部分合成(只限幸存者采样算子),禁纯沙盒。
6. **求真红线全程生效**:非循环(σ_gen≠σ_inf)、不偷看答案、abundance≠affinity。
7. Backtrack 需用户确认。
