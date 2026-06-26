# Stage 3 — hypothesis-formation:把 σ 的四面写成可证伪命题

> Created: 2026-06-13 22:30
> Topic: σ 四分量 → 排序后的、每条自带证伪条件的命题集
> Phase: Stage 3 / hypothesis-formation
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

---
## ⚠️ 防 PAPER 化护栏(verbatim 抄自 spec,本 stage 最高优先级,凌驾 campaign 默认行为)★执行全程对照

这批 skill(gap-prioritization / hypothesis-formulation / research-question)骨子里是发论文导向的——FINER/PICO/SPIDER 模板带 publishability,默认会把思考往"能发几篇、新不新、referee 接不接受、把大问题切成可发表小块"上带。执行时**必须按下面重定义,禁用其默认的可发表性/新颖性逻辑**。出现下列跑偏信号即判定 stage 失败、回炉重做:

**① gap-prioritization 重定义:**
排序轴 = "解决这个承重未知量,是否反演整个 σ 算子所必需"。
禁用轴 = 可发表性 / 新颖度 / referee 接受度 / FINER / 引用潜力。
σ 是一个完整对象,四面(p_e/p_o/σ₁σ₂/反卷积)是它的四个分量,不是四个"可独立发表的 gap"。排序只为定攻击次序,不为切论文。

**② hypothesis-formulation 重定义:**
产物 = 关于 σ 结构/可辨识性的可证伪命题。
falsifiability 判据 = "什么计算/观测会推翻它"(Platt strong inference / Mayo severe testing)——**不是**"什么实验能让 referee 接受"。
例:H1「SHM-aware p_e 在 CR9114 上恢复功能性 AUC > Evo-PU 通用 kernel,否则本命题 BROKEN」;H2「反演的 σ₂ 匹配独立测的 GC sigmoid,偏差 > 阈值则 BROKEN」。每条都自带"怎么死"。

**③ research-question 重定义:**
★硬禁止把 σ 切成"能写 N 篇 paper 的子问题"。唯一允许的分解 = 算子分量分解(已在 Stage 2 定),且分解后必须能合回一个 P(obs|x) 联合似然(Stage 4 缝合验证)。
success criteria = "σ 反演到可辨识边界 + 零空间被诚实量化",**不是**"产出 X 个可发表结果"。

**④ 新颖性只作工具性判据:**
仅用于区分 EARNED simplicity(禁止/预测/subsume)vs DECORATIVE simplicity(重描述/换标签)——见 Stage 6 elegance-trap-probe。"因为新所以做"被禁止;"因为是反演 σ 所必需所以做"才允许。

这条护栏不止本 stage:凡引擎默认 skill 偏发表/存活导向处(如默认 stress-test 偏加固而非证伪)均适用。

---
## Plan Context

**Objective:** 把 Stage 2 定下的 σ 可辨识分量,转成排序后的、每条自带证伪条件的命题集。

**Expected Input(已核验):** Stage 2 可辨识等价类 + 零空间刻画 + 承重假设清单(sigma-inversion-identifiability.md / sigma-inversion-INDEX.md)。

**Focus Areas:** 四面命题(A=p_e SHM-aware emergence / B=p_o(x,m) cell-state 采样 / C=σ₁∘σ₂ 选择复合 / D=反卷积闭环)+ 各自 falsifiability 判据 + 攻击次序(依赖关系,非可发表性)。

**Completion Criteria(硬闸):**
- 四面各 ≥1 条可证伪命题,每条写明"什么计算结果会判它 BROKEN";
- **0 条命题以可发表性/新颖性为存在理由**(违反即回炉);
- 所有分量命题能在形式上合回单一 P(obs|x) 联合似然(否则不是"反演整个 σ")。

**Backtrack Condition:** if 任一命题无法写出证伪条件(不可证伪)→ 回 Stage 2 重审该分量可辨识性。

---
## Checkpoint 1: gap-prioritization(按"反演 σ 必需性"排攻击序,★禁可发表性轴)

### 护栏对照(执行前自检)
- 排序轴 = "解决这个承重未知量,是否反演整个 σ 算子所必需"。✓
- 禁用轴 = 可发表性/新颖度/referee/FINER/引用潜力。✓ 全程不出现。
- 四面 = σ 的四个分量,**非**四个可独立发表 gap;排序只定攻击次序。✓

### 排序方法
依赖度(downstream 分量依赖它)× 辨识性风险(Stage 2 标的致命性)× 闭环必需性(不解决则 D 面反卷积无法闭合)。**不是** impact/novelty。

### 四面攻击序(依赖驱动)

**攻击序 1 — A 面 p_e(SHM-aware emergence)★最先**
- 理由:Stage 2 撞出 θ(可达性,选择)=0.0° 真实例——p_e 若用裸计数会与选择**完全混淆**,A 面是其余三面的**辨识性地基**。p_e 错则类先验突变臂错,p_a/σ 全偏。
- 依赖:无上游(SHM kernel 从 out-of-frame 独立估);最大下游(p_a、D 面全依赖它)。

**攻击序 2 — C 面 σ₁∘σ₂(选择复合)**
- 理由:σ 反演的**主对象**。σ₁ 借 out-of-frame 锚(Stage 2 标"可辨到尺度"),σ₂ 仅 contrast 可辨(斜率耦合)。C 面定 p_a 的分解。
- 依赖:上游需 p_e(类先验);下游 D 面反卷积直接用 σ₂。

**攻击序 3 — B 面 p_o(x,m)(cell-state 采样)**
- 理由:Stage 2 标的**最危险假设 H-A3** 所在。p_o 是零空间第一主来源(single-study irreducible)。攻击序靠后因其可辨性**条件依赖**(带星号),需先有 A/C 的似然骨架才能在其上测 p_o 分离杠杆。
- 依赖:上游需 p_e+选择(类先验完整);下游 D 面用 p_o 做监测校正。

**攻击序 4 — D 面反卷积闭环 ★最后**
- 理由:D 面是 A+B+C **合回单一似然后**的终检(spec"彻底"判据)。它本身不引入新分量,是前三面的联合验证 + 零空间实证。必须最后,因为它消费前三面全部产物。
- 依赖:上游 = A+B+C 全部;下游 = 无(终点)。

### 攻击序合法性自检(护栏③)
- 分解 = 算子分量分解(Stage 2 已定),非论文切分。✓
- 四面能合回单一 P(obs|x):A→类先验突变臂,B→类先验监测臂,C→p_a 分解,D→联合反卷积。**合回点 = Stage 4 缝合验证**。✓
- success criteria = "σ 反演到可辨识边界 + 零空间诚实量化",非"N 篇 paper"。✓

### Key Findings
- 攻击序 A(p_e)→C(σ₁σ₂)→B(p_o)→D(反卷积),**依赖驱动**:p_e 是辨识地基(θ=0 教训),D 是联合终检。
- B 面排序靠后非因不重要,而因其可辨性条件依赖(H-A3),需骨架先立。
- 0 条以可发表性排序。护栏 PASS。

---
## Checkpoint 2: hypothesis-formulation(四面 → 可证伪命题 + Platt/Mayo 判据)

### 护栏对照
- 产物 = 关于 σ 结构/可辨识性的可证伪命题。✓
- falsifiability 判据 = "什么计算/观测推翻它"(Platt strong inference / Mayo severe test),**非** referee 接受。✓
- 每条自带"怎么死"。✓

### 命题格式
每条:陈述 + 锚定数据 + **BROKEN 判据(定量阈值)** + 关联 Stage 2 假设。阈值锚现有结果或物理常数,不拍脑袋。

---
### A 面 — p_e(SHM-aware emergence)

**H-A1(主命题):** SHM-aware p_e kernel(S5F/Thrifty,序列特异)在 CR9114 上恢复功能性的 AUC **严格高于** Evo-PU 通用核苷酸 kernel(flat transition/transversion 常数)。
- 锚:CR9114 65k 完备景观(p_a 真值已知)+ 本地 S5F(已验=published HH_S5F)。
- **BROKEN 判据:** ΔAUC = AUC(SHM-kernel) − AUC(flat-kernel) ≤ 0,或 95% CI 含 0(bootstrap 1000×)。即 SHM 加权**没带来**可辨识性增益。
- 关联:Stage 2 θ(可达性,选择)=0.0° 预言 flat 计数与选择共线;H-A1 是该预言的可证伪化(若 SHM kernel 也不分离 → A 面地基塌)。

**H-A2(辨识增益命题):** SHM kernel 向选择子空间**外**注入方向,使 θ(S_mut, S_sel) 从 0° 显著抬升。
- **BROKEN 判据:** 用 S5F 序列特异可达性重算 θ(S_mut,S_sel) 仍 < 15°(实质共线阈)→ SHM kernel 未解耦,p_e 不可辨,BROKEN。
- 关联:直接可证伪 Stage 2 ★升级认知。这条**本 stage 可立即冒烟**(岔口1=B)。

---
### C 面 — σ₁∘σ₂(选择复合)

**H-C1(σ₂ 命题):** 反演的 σ₂(亲和力 sigmoid)的**拐点 φ₀** 匹配独立测的 GC sigmoid(DeWitt GC-replay),偏差在阈内。
- 锚:CR9114 K_D(反演源)vs DeWitt GC-replay sigmoid(独立真值,σ_gen≠σ_inf 非循环)。
- **BROKEN 判据:** |φ₀(inferred) − φ₀(DeWitt)| > 0.5 log K_D 单位(半个数量级),或 sigmoid 形状 KS 检验 p<0.01 拒绝同分布。
- 关联:Stage 2 标 σ₂"仅 contrast 可辨(拐点辨/斜率耦合)"——H-C1 只赌**拐点**(可辨部分),不赌斜率(不可辨)。诚实。

**H-C2(σ₁ 命题):** out-of-frame 序列锚定的 σ₁(=Q=P_post/P_gen)使 σ₁ 可辨到尺度;移除 out-of-frame 锚则 σ₁ 掉进同余类。
- 锚:OLGA P_gen(已验端到端可跑)+ OAS 非生产性序列。
- **BROKEN 判据:** 有 out-of-frame 锚 vs 无锚,反演的 σ₁ 形状(去尺度后)相关 r > 0.9 则锚**无效**(说明 σ₁ 本就可辨,out-of-frame 非必需)→ "抗体辨识增益①"主张 BROKEN;反之 r 低证明锚必需(命题 CORROBORATED)。
- 关联:可证伪 Stage 2"抗体两处辨识性增益①"。

---
### B 面 — p_o(x,m)(cell-state 采样)

**H-B1(分离杠杆命题):** 多 study 重复 + cell-state 元数据使 p_o 跨 study contrast 可辨(θ(S_obs,S_sel) > 45°);single-study 格子保持 irreducible。
- 锚:OAS BType/BSource/Isotype/study 元数据。
- **BROKEN 判据:** 在真 OAS 上,跨 study 重复格子的 θ(S_obs,S_sel) < 15°(仍共线)→ 多 study 杠杆失效,p_o 全 irreducible → B 面可辨性主张 BROKEN,ε 越界可能触发 Stage 2 Backtrack。
- 关联:直接检验 Stage 2 最危险假设 H-A3(元数据非混杂)。**这条 Stage 2 无法纯理论定,故必须落成 Stage 7 OAS 检验。**

**H-B2(混杂命题,H-A3 的可证伪化):** p_o(x,m) 学到的不只是 study identity——剥离 study 标签后,(BType,BSource,Isotype) 仍保留显著采样率信号。
- **BROKEN 判据:** 控制 study 固定效应后,cell-state 元数据对 p_o 的偏 R² < 0.05(几乎全是 study 批次)→ H-A3 BROKEN,p_o 退化为纯批次,B 面 contrast 可辨标签的星号兑现为不可辨。
- 关联:这是 Stage 2 排第 1 危险假设的正面可证伪命题。

---
### D 面 — 反卷积闭环

**H-D1(闭环命题):** 从独立参数化 σ_gen 制造的幸存者观测,反演算子能重建隐藏 CR9114 景观,可恢复率达阈,且残差由 Stage 2 零空间(θ/ε)解释,非系统偏差。
- 锚:CR9114 完备景观(答案全知)+ 独立 σ_gen(σ_gen≠σ_inf 破循环)。
- **BROKEN 判据:** ① 重建景观与真值的系统偏差(非零空间方向)> 阈(如去尺度后 Spearman ρ < 0.8);或 ② 残差落在 Stage 2 预言的可辨方向上(本该恢复却没恢复)→ 反演失败非零空间所致 → 回 Stage 4。
- 关联:spec"彻底"判据的终检;消费 A+B+C 全部。

**H-D2(零空间实证命题):** 反演在 Stage 2 标的 irreducible 方向(fitness-scale + single-study 格子)上**注定**恢复不了,且该不可恢复量 = 理论 ε。
- **BROKEN 判据:** 若在 irreducible 方向上反演**反而恢复**了真值(实测可恢复率 > 理论上界)→ Stage 2 零空间刻画错 → 回 Stage 2。(注:这条"反向"证伪——零空间太小也是错。)

### 联合似然合回自检(护栏③ 硬闸)
四面命题对应单一 `P(O=1|x)=p_a·[1−∏(1−p_o·p_e)]` 的各项:A→p_e,B→p_o,C→p_a 内的 σ₁∘σ₂ 分解,D→全式联合反卷积。**形式上可合回。** Stage 4 缝合验证。✓

---
## Checkpoint 3: research-question(框定 scope + success criteria,★禁切论文)

### 护栏对照(护栏③)
- ★硬禁止把 σ 切成"能写 N 篇 paper 的子问题"。✓ 唯一分解 = 算子分量(Stage 2 已定)。
- success criteria = "σ 反演到可辨识边界 + 零空间诚实量化",非"X 个可发表结果"。✓

### 总研究问题(单一,不可切)
> 给定从真实功能景观经存活/选择/采样投影后的幸存者抗体观测,**反演观测算子 σ 到其可辨识边界,并诚实量化 irreducible 零空间** —— 使得 P(obs|x)=p_a·[1−∏(1−p_o·p_e)] 的四分量在可辨自由度上被恢复、在不可辨自由度上被显式标注。

### Scope(三道边界,防膨胀也防切分)
1. **对象边界:** σ 的四分量(p_e/p_o/σ₁∘σ₂)+ 联合反卷积。不外扩到 σ 之外(如不做 de novo 抗体设计、不做亲和力成熟轨迹预测——那是 selop/sandbox 的地盘)。
2. **数据边界:** 开源 dataset + 纯算力;唯一合成 = 独立参数化幸存者采样算子(σ_gen≠σ_inf)。禁纯沙盒。
3. **可辨边界:** 只在 Stage 2 标的可辨自由度上反演;irreducible 方向只标注、不拟合(拟合零空间 = 拟合幸存者噪声,是本 spec 反对的核心)。

### Success Criteria(全 = σ 反演质量,0 = 可发表性)
- SC1:四面 ≥8 命题中,可证伪命题在闭环(Stage 7)上各得 BROKEN/CORROBORATED/UNFALSIFIABLE 三桶分类(Stage 6 产 Ledger)。
- SC2:可辨识性地图(Stage 2 已出)被 Stage 7 实证检验,θ/ε 实测值落在预言带内。
- SC3:联合似然合回成立(Stage 4 缝合;给不出 → H-B1 BROKEN 坦白降级)。
- SC4:零空间被量化(可恢复率 + dim R_irr),非定性"有零空间"。
- **反 success criteria(出现即 stage 失败):** "发现 N 个新机制"、"超过 SOTA X 个点"作为目标本身、"可写成 N 篇"。

### 命题↔可辨识性地图↔Stage 2 假设对照表
| 命题 | 攻击序 | 检验 σ 分量 | 关联 Stage 2 假设 | 何时可测 |
|---|---|---|---|---|
| H-A1 SHM>flat AUC | 1 | p_e | θ(可达,选择)=0 教训 | Stage 7(需完整似然) |
| H-A2 SHM 抬 θ | 1 | p_e | ★升级认知 | **本 stage 可冒烟** |
| H-C1 σ₂ 拐点匹配 | 2 | σ₂ | σ₂ contrast 可辨 | Stage 7(DeWitt) |
| H-C2 out-of-frame 锚 σ₁ | 2 | σ₁ | 辨识增益① | Stage 7(OLGA+OAS) |
| H-B1 多 study 分离 p_o | 3 | p_o | 辨识增益② | Stage 7(OAS) |
| H-B2 元数据非混杂 | 3 | p_o | ★最危险 H-A3 | Stage 7(OAS) |
| H-D1 闭环重建 | 4 | 全 | 彻底判据 | Stage 7(CR9114) |
| H-D2 零空间实证 | 4 | R_irr | ε 刻画 | Stage 7(CR9114) |

### Key Findings
- 单一总问题 + 三道 scope 边界 + 4 条 success criteria(全 σ-反演质量,0 可发表性)。
- 8 命题映射到可辨识性地图与 Stage 2 假设,无悬空命题。
- H-A2 标记为本 stage 可立即冒烟(下一步执行)。

---
## Checkpoint 4: H-A2 冒烟(岔口1=B)——SHM kernel 抬 θ,但抬得不够 ★诚实负结果

### 目的
H-A2 标记"本 stage 可立即冒烟":验 SHM-aware 序列特异可达性能否把 θ(S_mut,S_sel) 从 Stage 2 的 0.0° 抬离共线区。

### 实测(真 CR9114 65094 行,可复现)
```
theta(S_mut = bare count,            S_sel) = 0.00 deg   (Stage2 baseline,完全共线)
theta(S_mut = SHM-weighted scalar,   S_sel) = 0.00 deg   ★标量重加权无效!
theta(S_mut = context-dependent 5mer kernel, S_sel) = 6.59 deg  (抬离 0,但仍 <15° 阈)
```

### ★三条诚实发现(其中两条是负结果,不夸大)
1. **标量 SHM 权重无效(θ 仍 0.0°):** 给每个位点一个 SHM 速率但**塌成标量**(Σ w_j·indicator)仍与选择完全共线——因为它仍是 16 位指示的线性组合,落在选择子空间张成内。**含义:p_e 不能是"加权突变计数",必须是位点间非线性(真 5-mer 上下文)。**
2. **上下文依赖 kernel 抬 θ 到 6.59°,但未破 15° 阈:** 让可达性依赖**邻位**(模拟 WRC/GYW motif,即真 S5F 的 5-mer 机制)才把 θ 抬离 0。这印证 SHM-aware 的方向对,但 **6.59° < 15°"实质共线"阈** → 在**加性景观**这个 toy 构造里,解耦仍弱。
3. **H-A2 判定:方向 CORROBORATED,但强度 NOT-YET。** 不夸大成"已证伪 θ=0 困境"。真实结论:context-dependence 是抬 θ 的**必要机制**,但在加性 CR9114 上单靠它不足以越过可辨阈——**这恰好预言:A 面要真解耦,需 S5F/Thrifty 的完整 5-mer 表(本 toy 只用了邻位近似),且可能需配合 C 面的非加性选择项**。把这条交 Stage 4 作算子设计约束、Stage 7 用真 kernel 复测。

### 对命题的回写
- H-A2 BROKEN 判据原为"θ<15° 即 BROKEN"。**本冒烟在 toy 上得 6.59°(技术上 <15°)——但这是邻位近似 + 纯加性景观的下界**,非真 S5F 全表结果。**修正命题:H-A2 的公平检验须用真 S5F/Thrifty 5-mer 表 + 在 Stage 7 完整似然下测,不能用 toy 邻位近似下结论。** 此修正记入 Ledger 候选(Stage 6)。
- 这是 falsification-first 纪律的正面体现:冒烟没给"漂亮通过",给了"方向对但强度存疑 + 公平检验条件",更诚实。

### Deviation from Spec
- **Stage**: 3
- **Prescribed**: gap-prioritization + hypothesis-formulation + research-question(纯命题工作)。
- **Actual**: 加一个 H-A2 真数据冒烟。
- **Rationale**: 岔口1=B 授权小冒烟;命题 H-A2 自标"可立即测";结果强化命题精度(暴露 toy vs 真 kernel 的检验条件差异)。±10% 允许加 1 SOP。




