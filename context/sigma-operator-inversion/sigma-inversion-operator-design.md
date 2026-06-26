# Stage 4 — creative-ideation:造 σ 的算子(problem-driven)

> Created: 2026-06-13 22:45
> Topic: 把观测似然落成可计算、四分量可独立估又能合回一体的算子族
> Phase: Stage 4 / creative-ideation
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

## Plan Context

**Objective:** 把抽象的观测似然落成可计算的、四个分量可独立估计又能合回一体的算子族。原创要求:不是"现成工具套新领域",是问题本身要求的算子。

**Expected Input(已核验):** Stage 3 的四面可证伪命题(sigma-inversion-hypotheses.md,8 命题)+ Stage 2 可辨识边界(只在可辨自由度上造,不去拟合零空间)。

**Focus Areas:**
1. structural-deconstruction:把 `P(obs|x)=p_a·[1−∏(1−p_o·p_e)]` 拆成四个可独立估的模块,定清接口(各自吃什么开源数据、吐什么)。
2. cross-domain-discovery:把 Mora-Walczak Pgen/Ppost(σ₁)↔ Evo-PU survivorship class prior ↔ Heckman/IPW 选择校正 ↔ phylogenetic ascertainment 四套数学桥到同一个 σ 形式——核心 novelty,但只作工具(护栏④)。
3. combinatorial-creativity:SHM 算子(S5F/Thrifty/EPAM)装进 p_e 的 emergence kernel;祖先集从"population prevalence"换成"germline-rooted clonal lineage",距离从 flat Hamming 换成 SHM 加权。
4. 架构选型:problem-driven。按可辨识性 + 数据规模选,用现代不落后技术,不预设白名单。

**Completion Criteria(硬闸):**
- ≥1 套完整的 σ-反演算子设计,四分量接口齐全且能合回单一似然;
- p_e 用 SHM 算子的具体装法写定;
- σ₁(非生产性 baseline)与 σ₂(DMS sigmoid)的估计路径写定;
- 每个组件标注"锚在哪个开源数据"(无悬空组件);
- Pgen/Ppost↔Evo-PU↔Heckman 至少一条桥的数学等价/近似关系写明。

**Backtrack Condition:** if 算子在 Stage 2 可辨识边界内无法闭合(某分量只能靠零空间自由度才能估)→ 回 Stage 2 重定边界或回 Stage 1 找新约束。

## 继承的硬约束(来自 Stage 2/3,造算子时强制对照)
- ★Stage 2 升级认知:**p_e 必须用 5-mer 上下文非线性 kernel**(S5F/Thrifty),不能用裸计数或标量加权——后者 θ(S_mut,S_sel)=0° 与选择完全混淆。Stage 3 冒烟证实标量加权仍 0°,邻位近似仅 6.59°。
- 只在可辨自由度上造:irreducible 方向(fitness-scale + single-study 格子)只标注不拟合。
- 抗体两处辨识增益必须被算子用上:① out-of-frame 锚 σ₁;② 多 study+cell-state 锚 p_o。
- 四分量必须合回单一 P(obs|x)(否则 H-B1 BROKEN 降级拼接)。

---
## Checkpoint 1: structural-deconstruction(似然拆四模块 + 接口)

### Objective
把 `P(O=1|x)=p_a·[1−∏_{y∈Y(x)}(1−p_o·p_e)]` 拆成四个可独立估计、各有清晰 I/O 接口、且能合回一体的模块。每模块标注吃什么开源数据、吐什么、锚在哪。

### 设计原则(继承纪律)
- 模块化但**不拼接**:四模块共享同一似然(合回点已定),各自可独立估只是为了分头锚不同数据源,不是独立优化。
- 每模块只在 Stage 2 可辨自由度上工作;不可辨自由度(尺度/single-study)作为模块的**显式输出标注**(模块吐出"我恢复了什么 + 我恢复不了什么")。

### 四模块接口定义

**模块 M_e(突变可达 p_e) — A 面**
- **吃:** germline 序列 + 观测序列 x + SHM 5-mer 速率表(S5F 本地 / Thrifty netam)。
- **吐:** p_e(y→x;α) = 从祖先 y 经 SHM 到 x 的可达性,**5-mer 上下文非线性**(硬约束)。
- **装法(Stage 1 锁):** `P(y'→y)=(1−exp(−λ·r_i))·CSP_i`,r_i=5-mer mutability,CSP=conditional substitution prob。
- **锚:** S5F 本地 parquet(1024×6,已验=HH_S5F)/ CR9114 germline(已有)。
- **Stage 2 输出标注:** 报 θ(S_mut,S_sel)——若用真 5-mer 全表仍 <15° 则 p_e 不可辨(H-A2 BROKEN)。

**模块 M_o(监测 p_o(x,m)) — B 面**
- **吃:** 观测序列 x + 元数据 m=(BType,BSource,Isotype,study) + 多 study 重复结构。
- **吐:** p_o(x,m) = 采样概率;**分两部分输出**:跨 study 可辨的 contrast 部分 + single-study irreducible 标注(吐出"哪些格子我估不了")。
- **装法:** 带 study 固定效应的分层模型;cell-state 作随机效应,study 作固定效应——剥离批次(直接服务 H-B2 检验:控 study 后 cell-state 偏 R²)。
- **锚:** OAS BType/BSource/Isotype(HF 镜像 ConvergeBio/oas-unpaired)。
- **Stage 2 输出标注:** 报每格子 study 计数 + single-study 格子集(= 零空间第一主来源维度)。

**模块 M_sel(选择复合 σ₁∘σ₂) — C 面**
- **吃:** 观测序列 x + 非生产性(out-of-frame)序列 + DMS K_D(CR9114)。
- **吐:** σ₁(x)=Q=P_post/P_gen(生成/tolerance 基线,借 out-of-frame 锚)+ σ₂(φ)=亲和力 sigmoid(拐点可辨,斜率标注为不可辨)。
- **装法:** σ₁ 用 OLGA P_gen(已验可跑)+ SONIA Q;σ₂ 用单调 sigmoid,**只反演拐点 φ₀,斜率 s 作为耦合自由度显式标注**。
- **锚:** OLGA human_B_heavy(已验)+ OAS 非生产性 + CR9114 K_D。
- **Stage 2 输出标注:** σ₂ 吐"拐点 φ₀(可辨)+ 斜率 s(与 p_a 尺度耦合,不可辨)"。

**模块 M_a(功能性 p_a) — 联合枢纽**
- **吃:** 以上三模块输出 + 观测 O。
- **吐:** p_a(x) = 真景观 φ 经 σ₁∘σ₂ 投影后的像;**到单调变换可辨**(序可恢复,绝对 K_D 不可)。
- **装法:** p_a(x) = P(O=1|x) / [1−∏(1−p_o·p_e)],即用 M_e/M_o 算出的类先验**除掉**观测,反解 p_a。
- **锚:** CR9114 完备景观(答案全知,p_a 真值 = σ₂(φ_DMS))。
- **Stage 2 输出标注:** 报 p_a 的序(Spearman)而非绝对值;fitness-scale 自由度显式标注。

### 合回点(护栏③ 硬闸 — 四模块如何合成单一似然)
```
P(O=1|x) = M_a(x) · [ 1 − ∏_{y∈Y(x)} (1 − M_o(x,m)·M_e(y→x)) ]
```
- Y(x) = germline-rooted clonal lineage 祖先集(combinatorial-creativity 步细化)。
- **四模块不是相加/拼接,是嵌进同一乘积式的不同因子位**:M_e/M_o 在类先验括号内,M_sel 进 M_a 的分解(p_a=σ₁∘σ₂∘φ),M_a 在最外层。
- 这保证"合回单一 P(obs|x)"——H-B1 的正面兑现。

### 接口依赖图(攻击序的算子化)
```
M_e ──┐
      ├─→ 类先验 [1−∏(1−p_o·p_e)] ──┐
M_o ──┘                              ├─→ M_a = O / 类先验 ──→ 反解 p_a ──→ M_sel 反卷积 φ
                                     │
M_sel(σ₁ from out-of-frame) ─────────┘ (定 p_a 的分解结构)
```

### Key Findings
- 四模块接口齐全,每个标注吃什么/吐什么/锚哪/Stage 2 不可辨输出。
- 合回点写定:单一乘积式,四模块占不同因子位(非拼接)。
- 每模块**主动吐出自己恢复不了的部分**(零空间标注内建进接口)——这是"诚实标零空间"落到算子层。
- 无悬空组件:M_e←S5F本地,M_o←OAS,M_sel←OLGA+OAS+CR9114,M_a←CR9114。

---
## Checkpoint 2: cross-domain-discovery(四套数学桥到同一 σ 形式)★核心 novelty(工具性)

### Objective
把 Mora-Walczak Pgen/Ppost(σ₁)↔ Evo-PU survivorship class prior ↔ Heckman/IPW 选择校正 ↔ phylogenetic ascertainment 四套数学桥到同一 σ 形式。硬闸:**至少一条桥写明数学等价/近似关系**。护栏④:novelty 只作工具(因反演 σ 必需),非"因为新所以做"。

### 四套数学的共同骨架(核心洞察)
四套都在处理同一结构:**观测 = 真分布 × 条件采纳因子**,只是各自给采纳因子不同名字。

| 领域 | 真分布 | 采纳/选择因子 | 观测 |
|---|---|---|---|
| Mora-Walczak | P_gen(序列生成) | Q=P_post/P_gen(选择) | P_post=P_gen·Q |
| Evo-PU | p_a(功能) | [1−∏(1−p_o·p_e)](存活+监测) | P(O=1) |
| Heckman | 结果方程 Y | 选择方程 P(选中) | E[Y|选中] |
| Phylogenetic ascertainment | 谱系先验 | P(非灭绝\|参数) | 条件似然 |

→ **统一形式:** `P(观测|x) = π(x) · S(x)`,π=真分布,S=条件采纳因子。σ 反演 = 从观测解耦 π 与 S。

### ★桥 1(完整数学等价)——Evo-PU 类先验 = Phylogenetic 非灭绝条件因子

**主张:** Evo-PU 的 survivorship class prior `S_EvoPU(x) = [1−∏_{y∈Y(x)}(1−p_o·p_e(y))]` 数学等同 birth-death 谱系的非灭绝条件因子 `S_phylo = 1−P(lineage 全灭绝/未观测)`。

**推导:**
- 谱系灭绝概率(每条祖先路径 y 独立):路径 y 未产生可观测后代的概率 = (1−p_e(y))(无突变达到)+ p_e(y)(1−p_o)(达到但没被采样到) ... 取一阶 = 1 − p_o·p_e(y)(达到且被采样 = "存活到观测"的概率)。
- 全部祖先路径都失败(谱系完全未观测)= ∏_{y∈Y(x)}(1 − p_o·p_e(y))。
- **至少一条路径存活到观测 = 1 − ∏(1−p_o·p_e(y)) = S_EvoPU。** ∎
- 这正是 birth-death-sampling 里"条件于至少一个采样后代"的 ascertainment 因子(Stadler 2013 的 conditioning-on-sampling)。

**等价的后果(可辨识性继承):** 因 S_EvoPU = ascertainment 因子,**Louca-Pennell 同余类 + Bakis-Minin (λ,μ,ρ) 非辨识直接迁移到 σ**(这就是 Stage 2 H-B2 映射的数学根)。桥 1 把 H-B2 从"类比"升级为"代数等价"——Stage 6 isomorphism-falsification 攻这条时,有 explicit structure-preserving map 可扛。

### 桥 2(近似关系)——Q=P_post/P_gen ↔ Heckman 逆 Mills 比

- Heckman 两步:E[Y|选中] = Xβ + ρσ·λ(Zγ),λ=逆 Mills 比 = 选择偏差校正项。
- 映射:P_post = P_gen·Q ⟺ 观测分布 = 生成分布 × 选择校正。**Q 扮演 Heckman 的 exp(选择校正)角色。**
- **关键近似:** Heckman 要 exclusion restriction(有变量只进选择方程不进结果方程)。σ 的 exclusion restriction = **out-of-frame 序列**——它们只受 P_gen 影响,不受功能选择 Q 影响(选择关闭)。**out-of-frame 序列 = 抗体天然的 Heckman exclusion restriction。** 这是抗体辨识增益①的 Heckman 语言表述。

### 桥 3(概念对应)——IPW ↔ p_o 监测校正
- IPW:用 1/P(选中) 加权恢复总体。σ 里 = 用 1/p_o(x,m) 加权幸存者观测恢复真功能分布。
- positivity 条件(IPW 必需)= 每个 (BType,BSource,Isotype) 格子都有 >0 采样概率 → **positivity 破 = single-study 格子 = 零空间第二来源**。IPW 语言精确解释了为何 single-study 不可辨:violation of positivity。

### 三桥收敛到单一 σ 形式
```
P(O=1|x) = p_a(x) · S(x),  S(x)=[1−∏(1−p_o·p_e)]
         └ π 真功能 ┘  └ ascertainment因子(桥1=非灭绝;桥2=Heckman校正;桥3=IPW逆权)┘
```
- σ₁(生成/tolerance)的辨识 ← 桥 2(out-of-frame = exclusion restriction)。
- p_o(监测)的辨识边界 ← 桥 3(positivity violation = single-study 不可辨)。
- 整体可辨识性同余结构 ← 桥 1(= phylogenetic ascertainment 同余类)。

### Key Findings(cross-domain 产出)
1. 四套数学共享骨架 `观测 = 真分布 × 条件采纳因子`,统一为 P=π·S。
2. **桥 1 完整数学等价**(Evo-PU 类先验 = 非灭绝 ascertainment 因子,含推导)——硬闸满足,且把 Stage 2 H-B2 从类比升为代数等价(抗 Stage 6 isomorphism 攻击)。
3. 桥 2:out-of-frame 序列 = 抗体天然 Heckman exclusion restriction(辨识增益①的跨域表述)。
4. 桥 3:single-study 不可辨 = IPW positivity violation(零空间第二来源的跨域表述)。
5. novelty 全程工具性:每条桥都因"反演 σ 必需"(护栏④),非"因为新"。

---
## Checkpoint 3: combinatorial-creativity(SHM 算子装进 p_e + germline 谱系祖先集)

### Objective
把 SHM 算子(S5F/Thrifty/EPAM)具体装进 p_e 的 emergence kernel;祖先集从 Evo-PU 的"population prevalence"换成"germline-rooted clonal lineage",距离从 flat Hamming 换成 SHM 加权。这是 A 面命题 H-A1/H-A2 的算子化,且直接回应 Stage 2 升级认知(5-mer 非线性必需)。

### 组合 1:SHM 算子装进 p_e emergence kernel

**Evo-PU 原版(flat,被 Stage 2 证 θ=0):**
- p_e(y) ≈ 1−exp(−Σ_i P(y_i'→y_i)·α·c),P 用全局转换/颠换常数(2.6e-5 / 1.4e-7),与位点上下文无关 → 落入选择子空间,θ(S_mut,S_sel)=0。

**本 spec 版(S5F 5-mer 上下文非线性):**
```
p_e(y→x) = 1 − ∏_{i∈mut sites} [ (1−exp(−λ·r_i(5mer)))·CSP_i(5mer→target) ]
```
- r_i(5mer) = 位点 i 的 5-mer mutability(本地 S5F 表,已验);**依赖左右各 2 邻位** → 注入选择子空间外方向(Stage 3 冒烟证实:邻位依赖把 θ 从 0 抬到 6.59°,真全表预期更高)。
- CSP_i(5mer→target) = 5-mer 条件替换概率(替换到目标残基的概率)。
- **关键:非线性来自 5-mer 上下文耦合**——位点 i 的可达性依赖其邻居,这是打破 θ=0 共线的机制(Stage 2/3 双重锁定)。

**双 kernel 设计(非循环资产,Stage 1 备料):**
- S5F(syn-fitted)与 Thrifty(out-of-frame-fitted,netam)抓不同 SHM 过程。
- **用途:** σ_gen 用一个 kernel、σ_inf 校正用另一个(Stage 7 破循环),且两者差异 = H-A2 偏差敏感性探针。

### 组合 2:祖先集 Y(x) 从 prevalence 换成 germline-rooted clonal lineage

**Evo-PU 原版:** Y(x) = 序列空间里 Hamming 近邻(population prevalence 加权),flat 距离。

**本 spec 版:** Y(x) = **germline-rooted clonal lineage** 上的祖先序列。
- 起点 = germline V(D)J(CR9114 已知回溯 germline)。
- 路径 = SHM 单步可达的中间体(combinatorial complete DMS 提供全中间体,2¹⁶ 个)。
- 距离 = **SHM 加权**(不是 flat Hamming):沿谱系每步的代价 = −log p_e(5mer),hotspot 步便宜、coldspot 步贵。
- **生物学正确性:** germline-rooted 是线性化展开点(Stage 2 H-B3 锁定,防幸存者污染);clonal lineage 尊重 SHM 从 germline 出发的方向性(Evo-PU 的 flat prevalence 丢了这个)。

### 组合 3:架构选型(problem-driven,非白名单)
- **M_e(p_e):** 不需学习——S5F/Thrifty 是预训练 SHM 表,直接查表 + 5-mer 卷积。轻量,可辨识性优先于表达力。
- **M_o(p_o):** 分层 GLM(study 固定效应 + cell-state 随机效应)。选它因 H-B2 检验需要"控 study 后看 cell-state 偏 R²"——GLM 的固定/随机效应结构天然支持这个分解,比黑箱 NN 更可辨。
- **M_sel(σ₁):** OLGA(P_gen,已验)+ SONIA(Q,浅层神经网络,statbiophys 现成)。σ₂ = 单调 sigmoid(2 参:拐点 φ₀ 可辨 + 斜率 s 标注不可辨)。
- **M_a(p_a):** 不直接学——代数反解 p_a = O/类先验。避免引入额外拟合自由度(防偷拟合零空间)。
- **总原则:** 能查表/代数解的不学(M_e/M_a);需统计分离的用可解释结构(M_o GLM/M_sel SONIA)。**全程可辨识性 > 表达力**——因为目标是反演不是预测(Stage 2 governing variable)。

### 组合的涌现性质(检查是否 EARNED,预备 Stage 6 elegance-trap)
- germline-rooted + SHM 加权 + 5-mer 非线性三者组合**禁止**了什么:禁止 p_e 与选择共线(θ=0 → >0),这是 flat Evo-PU 做不到的硬禁止 → 候选 EARNED simplicity(非重描述)。
- 但强度待真 5-mer 全表验证(Stage 3 冒烟 6.59° 未破 15° 阈)→ Stage 6/7 终判。

### Key Findings
1. p_e 装法写定:S5F 5-mer kernel,非线性来自上下文耦合(打破 θ=0 的机制)。
2. 祖先集 = germline-rooted clonal lineage,SHM 加权距离(非 flat Hamming)。
3. 双 kernel(S5F/Thrifty)= 非循环资产 + H-A2 探针。
4. 架构 problem-driven:能查表/代数解的不学,需分离的用可解释结构,可辨识性优先。
5. 组合的硬禁止(p_e⊥选择)是 EARNED 候选,强度待真全表验证。



