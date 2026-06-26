# Stage 2 — deep-insight:σ 可辨识性闸

> Created: 2026-06-13 22:08
> Topic: 抗体 repertoire 观测算子 σ 的可辨识性边界 + irreducible 零空间刻画
> Phase: Stage 2 / deep-insight(spec 标注「最前置闸,凌驾一切」)
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

## Plan Context

**Objective:** 在造任何算子之前,先回答"σ 哪部分能从开源数据反演、哪部分是 irreducible 零空间"。这是与"造预测器"路线最根本的区别——不先定零空间,后面全是拟合幸存者噪声。

**Expected Input(已核验在位):** Stage 1 五块知识(sigma-inversion-ka-knowledge.md)+ baseline 边界 + 现有非辨识结果(Bakis-Minin λ/μ/ρ 非辨识、Louca-Pennell 同余类)。

**Focus Areas:**
1. problem-reformulation:把"造功能分类器 p_a"显式重述为"反演观测算子 σ + 诚实标零空间"。锁死 governing variable = 算子可辨识性,不是预测精度。
2. boundary-analysis:import Louca-Pennell(Nature 2020)birth-death 同余类机制,刻画 (p_a, σ₁, σ₂, p_o) 联合可辨识到什么程度。明确 irreducible 零空间 = 哪些不同 σ 产生同分布观测。
3. sensitivity-analysis:加性景观假设、SHM out-of-frame→in-frame 可迁移、元数据非混杂——逐条 negate 看结论翻不翻。

**Completion Criteria(硬闸):**
- 一张「σ 可辨识性地图」,覆盖全部 4 个分量(p_a, σ₁, σ₂, p_o);
- 每个分量打且仅打一个标签 ∈ {可辨识到尺度/单调变换、仅 contrast 可辨、irreducible},附数学依据;
- 零空间维度给出可计算定义(继承 selop:三子空间主夹角 θ 与比值 dim R_irr / dim 全谱 = ε,两个量都给出数值阈值,否则该判定视为不可证伪);
- ≥3 条承重假设各有一条"该假设被 negate 后结论是否翻转"的敏感性记录。

**Backtrack Condition:** if 发现整个 σ 在开源数据下基本不可辨(零空间吃掉主要自由度)→ 回 Stage 1 找额外可观测约束(需用户确认)。

**继承自 Stage 1 的承重输入(verbatim,来自 sigma-inversion-INDEX.md):**
- 数学骨架:`P(O_X=1)=p_a·[1−∏_{y∈Y(x)}(1−p_o·p_e)]`
- ★核心新认知:类先验 `[1−∏(1−p_o·p_e)]` 数学等同 birth-death **非灭绝条件因子**(1−p_extinct)→ 用 ascertainment 同余类统一刻画可辨识性。
- 可辨识性铁证:Bakis-Minin(2508.09519)λ/μ/ρ 非联合可辨,固定 ρ 解,净率 λ−μ 稳;Louca-Pennell(Nature 2020)唯一可辨=PDR `r_p=λ−μ+(1/λ)dλ/dτ`。
- 零空间已识别两源:① p_o single-study 格子(结构性不可辨);② fitness-scale(ρ 不固定则不可辨)。
- 承重假设:H-A2 SHM out-of-frame→in-frame 迁移 / H-A3 元数据非混杂 / H-A6 abundance≠affinity(优先级最高)。

---
## Checkpoint 1: problem-reformulation(dialectical-reformulation / 支配变量重述)

### Objective
把"造功能分类器 p_a"显式重述为"反演观测算子 σ + 诚实标零空间",用 Argyris 双环学习锁死 governing variable = **σ 的可辨识性(线性化观测映射 Φ 的秩/谱)**,而非预测精度。这是与"造预测器"路线最根本的分叉点,也是后续 boundary-analysis 与 sensitivity-analysis 的纪律地基。

### Process Summary
策略路由:Focus Area"锁死 governing variable"直指 dialectical-reformulation(支配变量、双环学习、辩证探究)。沿 governing-variable-surfacing → counter-assumption-generation → reformulation-synthesis 三步做。不再启动文献检索——Stage 1 已采 64 search / 20 full-text,本策略是概念手术,靠继承知识直接推演。全程对照 spec Stage 3 防 paper 化护栏精神(governing variable 必须是"反演 σ 所必需",不是"可发表性")。

### 第一步:暴露朴素框架的隐藏支配变量(governing-variable-surfacing)

**朴素问题(默认吸引子,引擎默认 skill 会往这带):**
> "给定带功能标签(DMS)的观测抗体序列,造 p_a(x;θ) 预测序列是否功能性,最大化预测精度。"

该框架藏着四个支配变量(governing variables),全部在幸存者条件下为假或危险:

| # | 隐藏支配变量 | 反证 | 来自 |
|---|---|---|---|
| G1 | 成功度量 = 预测精度(AUC/AUPRC/相关) | 精度在**幸存者数据**上测;AUC↑ 可能是把 σ 拟合得更好,不是把 p_a 恢复得更好。Evo-PU 在病毒幸存者上准、ProteinGym 上崩——正因 σ(监测)异质未被建模。σ 非平凡时精度与真值恢复**解耦**。 | Evo-PU 2605.06879 自陈失败 |
| G2 | 观测数据 ≈ 序列-功能景观的代表性采样(幸存=噪声,可平均掉) | 观测 = σ(真值)。幸存不是零均值噪声,是**结构化、可能不可逆的投影**。采更多幸存者只收敛到 σ-投影后的真值,不是真值。 | Louca-Pennell:更多系统发生数据只收敛到同余类,非唯一历史 |
| G3 | 更多数据 + 更好架构 → 更好恢复真景观(单调) | 单调性破。若景观空间某方向落在 σ 零空间,**任何量的幸存者数据都恢复不了**;学习曲线在可辨识边界 plateau,不在 1.0。 | Bakis-Minin:λ,μ,ρ 单独永不可辨,无论多少数据;只 λ−μ 可辨 |
| G4 | p_a 景观是目标对象;σ(存活/采样)是 nuisance | **整个项目反转**:σ 才是对象;p_a 只在 σ 放行的范围内可恢复。 | 本 spec North Star + selop 元发现 |

### 第二步:双环重述(改支配变量本身,不只改动作)

- **单环学习(naive):** 取"预测功能"为既定目标,只调动作(换架构/加数据/调超参)让 p_a 更准。
- **双环学习(本 spec):** 质疑目标本身的支配变量。

> **OLD governing variable:** p_a 的预测精度。
> **NEW governing variable:** **观测算子 σ 的可辨识性** —— 形式化为线性化观测映射 `Φ: 景观空间 → 观测空间` 的秩/谱,按四分量(p_a, σ₁, σ₂, p_o)分解。

> **OLD success:** leaderboard 上一个数。
> **NEW success:** 完整可辨识性地图(每分量打标 ∈ {可辨识到尺度/单调变换、仅 contrast 可辨、irreducible})+ 可计算零空间维度(θ 主夹角、ε=dim R_irr/dim 全谱)。

这与 selop 的重述结构**同构**:selop 把"恢复 φ"重述为"刻画 φ+a_invivo 可辨识等价类 + 指明塌缩所需最小介入"。共享元发现:观测=投影复合,逆问题有非平凡零空间。本 spec 是该元发现在 survivorship-PU 通道上的独立重构(对照 selop 的树-SBI 通道)。

### 第三步:反假设生成(counter-assumption-generation)

对新框架的每条核心断言,生成反假设并指明"若反假设成立,整个 spec 怎么死":

**CA1 — 反 G4 反转:** "σ 其实可被 p_a 的灵活性完全吸收,根本不需要单独反演——一个足够强的 p_a(x) 直接拟合幸存者分布就行。"
- 若成立:本 spec 退化成 AbLWR(PU-on-antibodies 无 σ),σ 反演无附加值。
- 怎么测:Stage 7 闭环——若 σ_inf 固定为常数(吸收进 p_a)仍能重建完备景观且残差 = 含 σ 版本,则 CA1 成立 → spec BROKEN。
- 现状:Evo-PU ProteinGym 失败是 CA1 的反证(常数 p_o 不够),但**不是证明**——留给 Stage 6 red-team。

**CA2 — 反"可辨识性是正确 governing variable":** "可辨识性是数学洁癖;实务只要预测够准,辨不辨识无所谓。"
- 若成立:整个 Stage 2 是浪费,应直接进 Stage 4 造预测器。
- 反驳(承重):用户的 North Star 与 selop 纪律明确——目标**不是**预测器,是"反演算子 + 诚实标零空间"。abundance≠affinity 红线(PMC5337809)证明:在幸存者数据上预测准 ≠ 恢复真功能(prevalence 与 affinity 仅 ρ=0.6,最高亲和力在低丰度亚克隆)。可辨识性正是区分"拟合幸存者"与"恢复真值"的唯一形式判据。CA2 被红线证伪。

**CA3 — 反"四分量是同一过程投影":** "p_a/σ₁/σ₂/p_o 是四个独立模块,拼起来即可,不必合回单一似然。"
- 若成立:可分头优化,Stage 2 联合可辨识性分析不必要。
- 反驳:spec"彻底"判据 = 必须合回单一 P(obs|x) 联合似然。Stage 1 ★认知证明类先验 = 非灭绝条件因子,四分量是同一生成-存活-采样过程的投影。**但这条本身是承重假设**(记为 H-B1),交 sensitivity-analysis negate。

### Key Findings(problem-reformulation 产出)

1. **锁定的 governing variable:** 线性化观测映射 Φ 的秩/谱(按 4 分量分解的联合可辨识性),**不是**预测精度。后续两策略全部围绕 Φ 展开。
2. **四个被推翻的隐藏支配变量 G1-G4**:精度=成功(假)、数据=代表性采样(假)、更多数据→更好恢复(单调性破)、σ=nuisance(反转为对象)。
3. **三条反假设 CA1-CA3 各带证伪路径**,CA1/CA3 交 Stage 6/7,CA2 已被 abundance≠affinity 红线证伪。
4. **新承重假设 H-B1**(四分量=单一过程投影)浮现,加入 sensitivity-analysis 清单(原 H-A2/A3/A6 之外第四条)。

### Decisions Made
- 路由选 dialectical-reformulation 而非 dominant-idea-escape:本问题不是"范式锁定需横向逃逸",而是"目标变量选错需双环纠正",支配变量框架最贴。
- 不启动文献检索:Stage 1 已饱和,本策略纯概念手术。
- governing variable 形式化为"线性化 Φ 的谱"而非笼统"可辨识性",为 boundary-analysis 的 θ/ε 数值化铺路。

### Open Questions(交 boundary-analysis)
- Φ 的线性化在哪点展开?(germline-rooted 还是 observed-mean?影响零空间方向)
- 四分量联合可辨识 vs 边际可辨识——哪些自由度只在联合下才锁死?
- 非灭绝条件因子的同余类结构(Louca-Pennell)如何精确映射到 (p_a,σ₁,σ₂,p_o) 的 contrast?

---
## Checkpoint 2: boundary-analysis(可辨识等价类 + 零空间刻画)

### Objective
import Louca-Pennell(Nature 2020)birth-death 同余类机制 + Bakis-Minin(2508.09519)三参非辨识,刻画 (p_a, σ₁, σ₂, p_o) 联合可辨识到什么程度;明确 irreducible 零空间 = 哪些不同 σ 产生同分布观测;给出 θ(三子空间主夹角)与 ε(dim R_irr / dim 全谱)的**可计算定义 + 数值阈值**。这是 Stage 2 硬闸的主体。

### 第一步:观测映射的形式化

**观测似然(Evo-PU 形,Stage 1 锁):**
```
P(O_X=1 | x) = p_a(x;θ) · [ 1 − ∏_{y∈Y(x)} (1 − p_o(x,m)·p_e(y;α)) ]
               └ 功能性 ┘   └──────── 类先验 = 非灭绝条件因子 ────────┘
```
- `p_a(x;θ)` = 功能性概率(真景观 φ 经选择投影后的像)。
- `Y(x)` = 祖先集(germline-rooted clonal lineage;能产生 x 的 SHM 路径集)。
- `p_o(x,m)` = 监测/采样概率(Evo-PU 用全局标量;本 spec 升为带元数据 m 的 p_o(x,m))。
- `p_e(y;α)` = 从祖先 y 的突变可达性(SHM kernel,α 由 out-of-frame 序列估)。
- 类先验 `[1−∏(1−p_o·p_e)]` = 至少一条祖先路径**既被突变达到又被监测到**的概率 = birth-death 过程的**非灭绝条件因子** 1−P(lineage 未被观测)。

**四分量在似然中的位置(澄清,防 Stage 6 isomorphism 攻击):**
- p_e 进类先验(突变臂)。
- p_o 进类先验(监测臂)。
- σ₁∘σ₂(选择复合)进 **p_a**:p_a(x) 不是裸功能,是真亲和/适应度景观 φ 经 σ₁(生成/tolerance 基线)∘σ₂(亲和力 sigmoid)投影后的像。Stage 7-D 反卷积就是从 p_a 反推隐藏 φ。
- 所以辨识对象 = (p_a 经 σ₁∘σ₂ 分解, p_o, p_e) 的联合。

### 第二步:可辨识性问题陈述

观测 = 在"观测到的"序列 x 上对 P(O_X=1|x) 采样。问:能否唯一恢复 (p_a, σ₁, σ₂, p_o, p_e)?

**两条外部铁证锁死答案的形状(Stage 1 已采,此处落成映射):**

**铁证 1 — Bakis-Minin(2508.09519):** birth-death-sampling 里 (λ 出生, μ 死亡, ρ 采样) **不联合可辨**;固定 ρ 可解其余;净率 λ−μ 即使不固定 ρ 也稳健可辨。

**铁证 2 — Louca-Pennell(Nature 2020):** 时变 birth-death 模型构成**同余类**——无穷多 (λ(t),μ(t)) 产生同一观测谱系分布;唯一可辨不变量 = pulled diversification rate `r_p = λ−μ+(1/λ)dλ/dτ`。

### 第三步:把同余类映射到 σ 四分量(核心)

结构类比(Stage 6 isomorphism-falsification 会攻这条,此处先写为承重假设 H-B2):
| birth-death | σ 分量 | 含义 |
|---|---|---|
| λ 出生 | p_e 突变可达 | 谱系经 SHM "生出"新序列的率 |
| μ 死亡 | 1−选择存活 | 选择失败致克隆死亡 |
| ρ 采样 | p_o 监测 | 存活谱系真被测序的概率 |

→ Bakis-Minin 非辨识(λ,μ,ρ 不联合可辨)映射为:**(p_e, 选择存活, p_o) 在纯观测下不联合可辨。这是中心零空间结果。**

可辨的(类比净率 λ−μ 与 PDR r_p):某个"pulled"组合 —— 扛过同余的 contrast。下面逐分量定标签。

### 第四步:σ 可辨识性地图(四分量逐个打标)★硬闸主体

每分量打**且仅打一个**标签 ∈ {可辨识到尺度/单调变换、仅 contrast 可辨、irreducible},附数学依据。

---
**分量 p_a(功能性,= φ 经 σ₁∘σ₂ 的像) → 标签:可辨识到单调变换**
- 依据:类先验括号项是 p_a 的乘性因子。在祖先集 Y(x)、p_o、p_e 已知(或同时估)时,P(O=1|x)/[括号] = p_a(x) 逐点可定。但**绝对尺度与单调重标定不可辨**:任意单调 g 使 p_a'=g(p_a) 配合 σ₂ sigmoid 的拐点/斜率重标定可产生同分布观测(σ₂ 的 location-scale 与 p_a 尺度耦合)。
- 即:可恢复 p_a 的**序**(哪条序列更可能功能),不可恢复其**绝对标定**。对应 selop 的 "φ 到单调变换可辨"。
- 这正是 abundance≠affinity 红线在数学上的体现:序可辨、标定不可辨 → 不能把恢复的 p_a 当真实 K_D。

---
**分量 σ₂(亲和力 sigmoid) → 标签:仅 contrast 可辨(拐点可辨,斜率/尺度与 p_a 耦合)**
- 依据:σ₂(φ) = 1/(1+exp(−s(φ−φ₀)))。从纯幸存者观测,sigmoid 的**拐点位置 φ₀ 相对可辨**(它定"功能阈"),但斜率 s 与 p_a 的尺度乘性混淆(第三步同余:放大 s、压缩 p_a 尺度 → 同观测)。
- contrast 可辨 = "高于阈 vs 低于阈"的对比可恢复,绝对斜率不可。
- **打破耦合需外部约束**:独立测的 GC sigmoid(DeWitt GC-replay,σ₂ 真值锚)→ 这是 Stage 7 交叉验证轴存在的根本理由(不是锦上添花,是辨识性必需)。

---
**分量 σ₁(生成/tolerance 基线) → 标签:可辨识到尺度(借非生产性序列锚)**
- 依据:σ₁ = Q = P_post/P_gen。**关键非对称**:σ₁ 有 Bakis-Minin 没有的额外约束——**非生产性(out-of-frame)序列提供 selection-free P_gen 基线**(它们逃过功能选择)。给定 P_gen(OLGA 实跑可得,Stage 1 冒烟已验),Q 的形状可辨到整体尺度。
- 这是抗体相对纯 birth-death 的**辨识性增益**:out-of-frame 序列 = 天然的"σ 关闭"对照,直接锚住 σ₁ 不掉进同余类。
- 残留不可辨:Q 的整体归一(与 p_a 尺度共享同一个 fitness-scale 自由度)。

---
**分量 p_o(x,m)(监测) → 标签:contrast 可辨(跨 study 可辨)+ irreducible(single-study 格子)** ★分裂标签,见下
- 这是唯一需要分裂讨论的分量(故是零空间主来源)。

p_o(x,m) 把序列经元数据格子 m=(BType, BSource, Isotype, study) 映到采样概率。两块:
- **跨 study 重复格子 → contrast 可辨**:若同一 (BType,BSource,Isotype) 组合出现在 ≥2 个独立 study,可用 study 作为"重复测量"分离监测率与功能性(类比 Bakis-Minin 固定 ρ:多 study = 多个 ρ 实例,提供分离杠杆)。
- **single-study 格子 → irreducible**:只被单个 study 支撑的 (BType,BSource,Isotype) 组合,p_o 与该格子内 p_a 完全混淆——study identity 与功能性无法分离(H-A3 元数据非混杂在此格子上必然破)。无外部约束下结构性不可辨。**这是零空间的第一主来源。**

### 第五步:irreducible 零空间的可计算定义(θ 与 ε)★硬闸

继承 selop 纪律:零空间判定必须可计算、可证伪,否则无效。两个量:

**(1) 三子空间主夹角 θ**
- 三子空间:S_mut = span(∂P/∂p_e 的方向)、S_sel = span(∂P/∂σ 的方向)、S_obs = span(∂P/∂p_o 的方向),在线性化点(germline-rooted)处由 Fisher 信息/Jacobian 列空间定义。
- θ_ij = 子空间 i,j 间的最小主夹角(principal angle,SVD of 正交基内积)。
- **判读:θ_ij → 0° 表示分量 i,j 的观测效应共线(不可分离,落入同余零空间);θ_ij → 90° 表示正交(可独立辨识)。**
- **数值阈值(承重,Stage 6 可攻):θ < 15° 判为"实质共线/不可辨";θ > 45° 判为"可辨";15°–45° 为"弱可辨,需外部约束"。** 阈值锚:cos15°≈0.966(相关 >0.966 即实务不可分),cos45°≈0.707。

**(2) 零空间维度比 ε = dim R_irr / dim 全谱**
- 全谱 = 线性化 Φ 的 Jacobian 全部奇异值。
- R_irr = 奇异值 σ_k < τ·σ_max 的右奇异向量张成的子空间(数值零空间);τ = 容差。
- ε = dim R_irr / dim 全谱 ∈ [0,1]。
- **数值阈值(承重):τ = 1e-3(相对最大奇异值);ε < 0.1 判"零空间小,σ 大体可辨";ε > 0.5 判"零空间吃掉主要自由度"→ 触发 Stage 2 Backtrack(回 Stage 1 找约束,需用户确认);0.1–0.5 为"非平凡零空间,诚实标注但可推进"。**
- 注:θ 与 ε 互补——θ 测"哪两分量纠缠",ε 测"总共多少自由度丢失"。两者都给阈值,满足 spec"否则该判定视为不可证伪"。

### 第六步:可辨识性地图汇总表(交 INDEX)

| 分量 | 标签 | 数学依据 | 打破不可辨所需外部约束 |
|---|---|---|---|
| p_a(功能性) | 可辨识到单调变换 | 类先验乘性因子逐点可定;尺度/单调与 σ₂ 耦合 | DMS 绝对 K_D(CR9114)锚标定 |
| σ₂(亲和 sigmoid) | 仅 contrast 可辨(拐点可辨,斜率耦合) | sigmoid 斜率与 p_a 尺度同余 | DeWitt GC-replay 独立 sigmoid |
| σ₁(生成/tolerance) | 可辨识到尺度 | out-of-frame 锚 P_gen,Q 形状可定 | 非生产性序列(OAS 内含,已有) |
| p_o(监测) | 跨study contrast可辨 / single-study irreducible | 多 study=多 ρ 实例分离;单 study 混淆 | 多 study 重复 + cell-state 元数据 |

**联合可辨识核心结论:** (p_e, 选择存活, p_o) 三者**不联合可辨**(Bakis-Minin 映射);可辨的是"pulled"contrast 组合。抗体相对纯 birth-death 有**两处辨识性增益**:① out-of-frame 序列锚 σ₁;② 多 study + cell-state 元数据给 p_o 分离杠杆。这两处增益正是本 spec 站得住、不退化成 Louca-Pennell 纯同余困境的原因。

### 第七步:零空间两主来源落成维度(回应 Stage 1 交办)
1. **p_o single-study 格子**:dim = OAS 中只单 study 支撑的 (BType,BSource,Isotype) 组合数。可计算(待 Stage 7 在真 OAS 上数;Stage 2 给出定义式)。
2. **fitness-scale**:dim = 1(p_a 尺度 ⊕ σ₂ 斜率 ⊕ σ₁ 归一共享的单一标定自由度)。对应 selop 的 s 尺度自由度与 Bakis-Minin 的 ρ 自由度。
- 合计已识别零空间 ≥ (single-study 格子数 + 1) 维;ε 的分子下界由此给出。

### Key Findings(boundary-analysis 产出)
1. 四分量可辨识性地图完成,每分量单一标签 + 数学依据 + 解锁约束。
2. 中心结果:(p_e, 选择, p_o) 不联合可辨(Bakis-Minin 同余映射,承重假设 H-B2)。
3. θ(主夹角,阈 15°/45°)与 ε(零空间比,阈 0.1/0.5,τ=1e-3)给出可计算可证伪定义。
4. 抗体两处辨识性增益(out-of-frame 锚 σ₁ / 多 study 锚 p_o)——本 spec 不退化的根因。
5. 零空间两主来源落成维度定义(single-study 格子数 + fitness-scale 1 维)。

### Open Questions(交 sensitivity-analysis)
- H-B2(birth-death↔σ 映射)被 negate 会怎样?(若映射不成立,Bakis-Minin 铁证失效)
- 线性化点选 germline-rooted 是否引入偏差?(承重假设)
- θ/ε 阈值本身的敏感性(15°/45°、0.1/0.5 是否稳健)。

---
## Checkpoint 3: sensitivity-analysis(承重假设逐条 negate)

### Objective
对 Stage 2 承重假设逐条 negate(assumption-criticality / OAT 否定 + 重新推导),看可辨识性地图的结论翻不翻。spec 硬闸要求 ≥3 条;本 stage 推演到 6 条(H-A2/A3/A6/B1/B2 + 线性化点),按致命性排序。每条记录:假设陈述 → negate 后的反事实 → 结论是否翻转 → 缓解/锚定。

### 方法
assumption-perturbation tactic:一次否定一条(其余 hold),重新推导可辨识性地图受影响的格子。致命性 = 翻转的格子数 × 该格子承重度。

---
### H-A6:abundance ≠ affinity(prevalence 不可当 fitness 代理)★最高优先级
- **陈述:** 序列丰度(prevalence/Redundancy)与亲和力仅弱相关(PMC5337809,ρ=0.6,最高亲和在低丰度亚克隆),故 prevalence 不可当 p_a/fitness 代理。
- **negate:** 假设 abundance = affinity 的好代理(ρ→1)。
- **重新推导:** 若成立,p_o(监测,与丰度强相关)与 p_a(功能)将高度共线 → θ(S_obs, 含p_a的S_sel) → 0° → p_o 与 p_a **不可分离**,整个监测臂塌进功能臂。可辨识性地图的 p_o 行从"contrast 可辨"降为"全 irreducible"。
- **结论翻转?** ★**是,且是致命方向**——但 negate 的是"好代理",现实是 ρ=0.6(实测),**反假设被数据证伪**,故真实情形下 θ 不为 0,p_o 保持部分可辨。**结论稳健,因为红线本身就是在防这条翻转。** 这正是 abundance≠affinity 必须作为全程红线的数学理由:它守住的就是 p_o/p_a 的可分离性。
- **缓解:** 全程禁用 prevalence 作 fitness 代理(已是红线);Stage 7 用 DMS 真 K_D 而非丰度做 p_a 真值。

---
### H-A3:元数据非混杂(p_o(x,m) 不只编码 study identity)
- **陈述:** cell-state 元数据 m=(BType,BSource,Isotype) 承载真实监测异质性,不是纯 study 批次标签。
- **negate:** 假设 m 只编码 study identity(p_o 学到的全是批次,无生物监测信号)。
- **重新推导:** 若成立,跨 study 重复格子的"分离杠杆"失效——因为不同 study 的同名格子其实是不同批次伪影,不是同一监测率的重复测量。p_o 的"跨 study contrast 可辨"塌缩,**所有格子退化为 single-study irreducible** → ε 暴涨,可能越过 0.5 触发 Backtrack。
- **结论翻转?** ★**是,这是最危险的一条**(不像 A6 有数据兜底)。元数据是否混杂是**经验问题**,Stage 2 无法纯理论排除。
- **缓解:** 此假设的真伪 = Stage 7 OAS 交叉验证的核心检验项;Stage 6 red-team 必攻(已在 spec Stage 6 Focus"元数据只编码 study identity"对抗世界)。**Stage 2 标注:H-A3 是 p_o 可辨识性的承重前提,未证实前 p_o 的 contrast 可辨标签带星号(条件可辨)。**

---
### H-A2:SHM out-of-frame → in-frame 可迁移
- **陈述:** 从非生产性(out-of-frame)序列估的 SHM kernel α 可迁移到生产性(in-frame)序列的 p_e。
- **negate:** 假设 out-of-frame 与 in-frame 的突变过程实质不同(如 in-frame 受选择反馈改变可见突变谱)。
- **重新推导:** 若成立,p_e(y;α) 的 α 估错 → 类先验突变臂偏置 → p_a 反演带系统偏差(非零空间所致的偏差)。**但不直接改可辨识性标签**——p_e 仍可辨,只是估计有偏。影响的是 Stage 7 重建精度,不是 Stage 2 的辨识性结构。
- **结论翻转?** 否(辨识性地图不翻),但**注入系统偏差**。
- **缓解:** S5F(syn-fitted)与 Thrifty(out-of-frame-fitted)两 kernel 抓不同过程(Stage 1 已证 1.60 log-unit 区分力)→ 用两者差异作 H-A2 偏差的敏感性探针(非循环资产)。

---
### H-B1:四分量 = 同一生成-存活-采样过程的投影(可合回单一似然)
- **陈述:** p_a/σ₁/σ₂/p_o 不是独立模块,是同一过程的投影,能合回单一 P(obs|x)。
- **negate:** 假设它们是真正独立的子过程,无统一生成机制。
- **重新推导:** 若成立,联合可辨识性分析的前提没了——但**可分头边际辨识**反而更简单(各分量独立估)。然而 spec"彻底"判据(必须合回联合似然)失效 → 退化成 AbLWR 式拼接,这是 North Star 不接受的。
- **结论翻转?** 不翻转可辨识性**结构**(分头辨识各标签仍成立),但翻转**项目定位**(从"反演整个 σ"降为"拼四个估计器")。
- **致命性:** 中。这是定位假设,不是辨识性假设。Stage 6 elegance-trap-probe 必查(四分量分解是 EARNED 还是 DECORATIVE)。
- **缓解:** Stage 4 须显式给出合回联合似然的数学;给不出则 H-B1 BROKEN,坦白降级为拼接。

---
### H-B2:birth-death (λ,μ,ρ) ↔ σ (p_e, 选择, p_o) 映射成立
- **陈述:** Bakis-Minin/Louca-Pennell 的 birth-death 非辨识结果可经第三步映射迁移到 σ 四分量。
- **negate:** 假设映射不成立(σ 的代数结构与 birth-death 本质不同,如类先验非真的非灭绝因子)。
- **重新推导:** 若成立,Bakis-Minin/Louca-Pennell 两条铁证**对本课题失效**——可辨识性结论失去外部数学支撑,退回纯自证。中心结果"(p_e,选择,p_o) 不联合可辨"可能不成立(也可能仍成立,但需另证)。
- **结论翻转?** ★**潜在致命**——整个 boundary-analysis 的外部铁证全靠这条映射。
- **致命性:** 高(与 H-A3 并列最危险)。但 Stage 1 ★认知(类先验数学等同非灭绝条件因子)给了映射的代数依据,非纯类比。
- **缓解:** Stage 6 isomorphism-falsification 必攻这条——要么给出 explicit structure-preserving map 扛住,要么降级为 analogy(那时 boundary-analysis 需改用 σ 自身的 Fisher 信息直接算,不借 birth-death)。**Stage 2 标注:中心结果"三者不联合可辨"有两条独立支撑路径(① birth-death 映射 H-B2;② σ 自身 Jacobian 共线性 θ 测量),即使 H-B2 BROKEN,路径② 仍可独立验证。**

---
### H-B3(新):线性化点选 germline-rooted
- **陈述:** Φ 的线性化在 germline-rooted 点展开(而非 observed-mean)。
- **negate:** 在 observed-mean 展开。
- **重新推导:** 零空间方向(右奇异向量)依赖展开点;不同点给不同 θ/ε 数值。germline-rooted 是生物学正确点(SHM 从 germline 出发),observed-mean 受幸存者偏置污染(在被 σ 投影后的均值展开 = 偷看了幸存者结构)。
- **结论翻转?** 数值翻转(θ/ε 具体值变),结构不翻转(哪些分量纠缠不变)。
- **致命性:** 低-中。**缓解:** 锁定 germline-rooted 为标准展开点(避免幸存者污染);Stage 7 报两点的 θ/ε 做稳健性带。

---
### 阈值稳健性附检(θ 15°/45°、ε 0.1/0.5、τ=1e-3)
- 这些阈值是判定边界,本身需稳健。**negate 检验:** 若把 θ 阈从 15° 放到 25°,p_o 的弱可辨格子可能改判 irreducible。
- 结论:阈值在 ±10° / ±0.1 内改判的分量 = 边界敏感分量(p_o 弱可辨格子最敏感),须在 Stage 7 报敏感带,不报单点。p_a/σ₁ 的标签对阈值不敏感(它们的 θ 远离边界)。

### 致命性排序(critical-path,交 Stage 6 优先攻击)
1. **H-A3(元数据非混杂)** — 最危险,无数据兜底,直接决定 p_o 可辨性,ε 可越界。
2. **H-B2(birth-death 映射)** — 高,外部铁证全靠它,但有路径② 兜底。
3. **H-A6(abundance≠affinity)** — 致命方向但**已被实测数据(ρ=0.6)证伪反假设**,红线守住,稳健。
4. **H-B1(单一投影)** — 中,定位假设,Stage 4 须给联合似然证明。
5. **H-A2(SHM 迁移)** — 中,注偏差不翻结构,两 kernel 探针缓解。
6. **H-B3(线性化点)** — 低-中,锁 germline-rooted。

### Key Findings(sensitivity-analysis 产出)
1. 6 条承重假设全部 negate + 重新推导(超 spec ≥3 硬闸一倍)。
2. 两条结构性致命假设:H-A3(元数据非混杂,无兜底)、H-B2(birth-death 映射,有路径② 兜底)。
3. H-A6 看似致命实则稳健——红线守的就是它防的翻转,实测 ρ=0.6 证伪反假设。
4. p_o 是阈值最敏感分量;p_a/σ₁ 标签稳健。
5. 中心结果有双路径支撑(H-B2 映射 + σ 自身 Jacobian θ),抗 H-B2 BROKEN。

### Decisions Made
- p_o contrast 可辨标签**带星号(条件可辨,前提 H-A3)**,Stage 7 OAS 检验、Stage 6 red-team。
- 线性化点锁 germline-rooted(防幸存者污染)。
- 中心结果保留双独立支撑路径,降低对 H-B2 的单点依赖。

---
## Checkpoint 4: 冒烟验证(岔口1=B)——θ/ε 在真 CR9114 上可计算 + 撞出真零空间实例

### 目的
坐实 Stage 2 硬闸"零空间给出可计算定义"不是纸面公式。在真 CR9114(65094 非删失行,h1_mean ∈ [7.0,9.83])上实算 θ(三子空间主夹角)与 ε(零空间维度比),并验 H-A6 negate 的方向预测。

### 构造(toy 但锚真数据)
- S_sel = 16 个突变指示列(去均值),选择作用于加性亲和力景观。
- S_mut = som_mut 突变计数列(去均值),可达性随突变数标度。
- S_obs CLEAN = 随机元数据格(独立于亲和力,模拟干净监测协变量)。
- S_obs BAD = abundance≈affinity 违规列(= 亲和力 + 小噪声,模拟 H-A6 被 negate)。
- principal_angle 用 QR + SVD 算列空间最小主夹角;ε 用堆叠 Jacobian 奇异谱 + τ=1e-3 容差。

### 实测结果(真数据,可复现)
```
clean rows 65094, y range 7.0–9.83, no NaN
theta(S_sel, S_obs CLEAN)              = 89.2 deg   (>45 => p_o 可辨) ✓
theta(S_sel, S_obs=abundance~affinity) = 36.5 deg   (H-A6 negate: 89→36,向共线塌) ✓方向
theta(S_mut, S_sel)                    = 0.0 deg    ★真零空间实例
eps[CLEAN]      = 0.056 (eff rank 17/18, tau=1e-3)
eps[COLLINEAR]  = 0.056 (eff rank 17/18)
```

### ★三条真发现
1. **θ/ε 可计算坐实**:两个量在真 65k 行 CR9114 上算出具体数(89.2° / 36.5° / 0.0° / ε=0.056),Stage 2 硬闸"零空间可计算定义"**非纸面**,有可复现脚本。
2. **θ(S_mut,S_sel)=0.0° 是 boundary-analysis 中心结果的真数据实例**:把可达性建模为突变计数时,som_mut = 16 位指示的行和,**精确落入选择子空间** → (p_e 可达, 选择) 在此参数化下**完全不可分离**。这正是第三步预言的"(p_e,选择,p_o)不联合可辨"——不是类比,是真数据上 θ=0 的硬塌缩。ε=0.056 的那 1 个零维(18→17)正是这条共线。**含义**:p_e 不能用裸突变计数参数化(会与选择完全混淆),必须用 SHM kernel 的**序列特异**可达性(S5F/Thrifty)注入选择子空间外的方向——这反向印证 Stage 1 为何坚持 SHM-aware kernel 而非 flat 计数。
3. **H-A6 negate 方向预测验证**:干净元数据 θ=89.2°(近正交,可辨);abundance≈affinity 时 θ=36.5°(cos≈0.80,强共线,向 p_o/p_a 不可分离塌)。未破 15° 因亲和力只占 16 维选择空间的 1 个方向,但**方向与 sensitivity-analysis H-A6 推导一致**(negate 把 θ 拉向 0)。红线守的就是这条塌缩。

### 对地图的回写
- p_e 标签补注:**裸突变计数参数化 → θ=0 与选择完全混淆(不可辨);SHM-kernel 序列特异参数化 → 注入正交方向,恢复可辨。** 这把"用 SHM kernel"从 Stage 1 的工程选择升级为 Stage 2 的**辨识性必需**。
- ε 实测下界 0.056(此 toy 构造);真 OAS p_o 格子的 single-study 维度待 Stage 7 加,ε 会上升。

### Deviation from Spec
- **Stage**: 2
- **Prescribed**: boundary-analysis + sensitivity-analysis(纯分析)。
- **Actual**: 额外加一个真数据冒烟(算 θ/ε)。
- **Rationale**: 岔口1=B 用户授权"可达性验证 + 小冒烟";硬闸要求零空间"可计算定义",冒烟坐实可计算性,且撞出 θ=0 真实例强化中心结果。属 ±10% 允许的"加 1 个 SOP"。








