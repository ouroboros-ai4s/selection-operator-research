# North Star 重新审视 — 抗体选择算子问题再定位

> Created: 2026-06-10 12:59
> Topic: 抗体亲和力成熟的 condition-dependent 选择算子学习 — 问题定义的再审视
> Phase: North Star Crystallization (hot-start, 含 redefinition 授权)

## Plan Context

用户已有一条收敛的问题定义(来自 2026-05-28 ~ 2026-06-08 系列对话 + 老 spec):学习抗体亲和力成熟背后的 condition-dependent 选择算子 f(seq,cond),一个突变算子(SHM)已知、选择算子未知的 SDE 反问题 `dX = ∇f(X,c)·dt + σ_SHM·dW`。老 spec(2026-06-07)已围绕此定义产出了一套"对抗式简化的验证方案",CR9114(Phillips 2021 eLife,65536×3 −logK_D 组合完备 DMS)被选为开源验证锚点。

用户当前正在学习 CR9114 数据结构(2026-06-08 对话),并明确发出再审视授权:"我打算让你来重新审视一下这个问题,看看你会给出什么样的更好的想法吗。…或者如果你能从头提出这个问题更新颖更强力的定义也可以。" 用户当前意图:用开源 dataset 先做选择算子研究。

本 Phase 的任务(per de-anthropocentric-research-engine):
1. 不默认继承老定义 —— 用户授权 redefinition,需真正 stress-test 现有定义,而非橡皮图章。
2. 产出:一句话 North Star + 结构化 ResearchBrief(hard gate)。
3. 关键张力候选:老定义把 CR9114 当"SDE 反问题验证锚点",但 CR9114 是终点静态 DMS 快照(无时序轨迹),与 SDE drift-from-trajectory 的核心叙事存在潜在错配 —— 这是再审视的第一靶点。

## 待审视的承重判断(从历史 context 提取)

- D1: 问题本质 = SDE drift estimation (known diffusion) 反问题。来源:5-28 广域调研收敛。
- D2: 选择算子 f = condition-dependent 能量场/势函数,∇f = 推动群体的力场。
- D3: CR9114 适合作为 f(seq,cond) 的"直接测量真值",可直接监督拟合(Spike0)。
- D4: 三不变量 I1(非循环性) > I2(可辨识性) > I3(条件依赖真新颖性)。
- D5: 新颖性 = SDE drift × interventional identification × mean-field population dynamics × neural f 的文献空白交叉。

## 第一靶点:CR9114-vs-SDE 错配

老 spec 自己已埋下线索(Stage 0 附录):CR9114 是"终点 DMS 快照,无演化轨迹","快照无瞬态问题(它直接给地形真值)"。但 SDE 反问题的整个叙事是"从时序轨迹反推 drift"。若用 CR9114 直接监督拟合 f(seq,cond),那做的其实是**静态 fitness landscape 回归**,SDE/drift/可辨识性那套数学(I2)在这一步根本没被触及 —— I2 是为"从轨迹反推"准备的,而 Spike0 不反推任何东西。这意味着老方案的"脊柱主干 Spike0"与"问题内核 SDE 反问题"之间可能存在断层。需在本 Phase 厘清。

## 深挖结论(三路并行 agent,2026-06-10,全部 verified IDs)

用户指令:AI4S 求真,不从发论文角度;并质疑"为什么是离散而非连续"。三路 dig 结果:

### 结论 A — affinity ≠ fitness(category-error 风险确认,这是最重的发现)
- CR9114 测的是 −logK_D = genotype→phenotype 的**结合亲和力地图**;选择算子 f 是 phenotype→reproductive-fitness 的映射。两者由一个 **affinity→fitness link 函数 φ** 连接,而 φ 是 **sigmoid/saturating + threshold + ceiling + 竞争相对 + 随机**(Batista-Neuberger 1998 阈值-天花板;Kuraoka 2016 permissive;Victora-Nussenzweig 2022 竞争相对)。
- 关键:**φ 至今未知,正被反推**(Matsen/Victora SBI, arXiv:2508.09871 原话:"the details of the relationship between affinity and fitness are unknown";"fitness… cannot be measured using an in vitro assay")。
- Phillips 2021 自己**从不把 affinity 当 fitness**:标题动词 "constrain" 是 load-bearing;正文显式"we must assume a selection model… extremely simple model as a first step"。
- **裁定**:把 CR9114 −logK_D 当选择算子 f 是 **proxy,合法当且仅当显式声明一个独立的 affinity→fitness 层 φ**;静默令 f=−logK_D 并称其为"真实选择算子"= category error。正确写法:f = φ∘a,a(genotype→−logKd) 用 CR9114 学(数据完美支持),φ 是独立的未知可学对象,**不可折叠进 a**。

### 结论 B — 离散 vs 连续(用户质疑的正面回答:连续是要"挣来"的极限,不是默认)
- 物理诚实的容器 = **离散态连续时间随机 mutation-selection 过程**:群体尺度 = master/quasispecies/replicator-mutator 方程(Eigen 1971 / Crow-Kimura);单谱系尺度 = 序列-CTMC + Halpern-Bruno 速率 `Q(s→s')=μ(s→s')·P_fix(Δf)`。两者是同一对象的两个分辨率。
- 连续 SDE(老 formulation B)**不是该离散过程对表观蛋白的严格极限**。Wright-Fisher/Kimura 扩散仅在 **弱选择 s=O(1/N) + 弱突变 + 大群体 + 小步跳 + 频率(非 embedding)连续** 的联合标度下严格(Ethier-Nagylaki 1989;Chalub-Souza 2011)。**强选择 / 大效应单突变 / 稀疏崎岖上位性景观会让扩散近似失效**(Saakian-Hu 2016;Spence 2023)。抗体成熟正好落在"强选择+大效应单突变+崎岖上位"区 = 扩散失效区。
- "embedding 空间上的扩散"(formulation B 的具体形态)**不是公认严格对象** —— 文献里 protein-latent SDE 全是生成式启发,其"时间"是算法时间非生物时间,无定理授权 ∇f_embedding 对应真实序列生成子。
- **关键 revealed preference**:真正掌握已知突变算子 M 的那个组(Matsen/Song,S5F/Thrifty 作者)在 2026 的工作(CoSiNE ICML 2026 arXiv:2602.18982;DASM eLife 2026)里选的是**容器 C(离散 CTMC),不是 B**。抗体成熟建模文献里 **Wright-Fisher 扩散 / embedding-SDE 作为主动力学模型 = 零实例**。

### 结论 C — 可辨识性(已知 M 是必要非充分)
- 已知 M 把"M 与 f 联合不可辨识"塌缩为"f 可辨识,但仅到全局尺度 N_e + 加性常数 + 单调变换"(CoSiNE 显式:同时推 q 和 F 不可能,必须从无选择数据固定 q=已知 M)。
- 还需两个条件:**非平衡瞬态观测**(平衡频率 + 已知 M 仍留 N_e 尺度自由;McCandlish-Shah-Plotkin 2016 证动力学携带静态地形之外的信息);**真实频率变化**(MPL/WFABC/PyR0 都要时序里有真变化)。
- **条件依赖 f(s,c) 的可辨识性**:同一序列在 ≥2 个标注选择条件下观测,**contrast f(s,c)−f(s,c') 可辨识且 contrast 抵消 N_e 尺度**(BVAS 2022 用疫苗状态做到)。但 interventional-CRL(Varici 2024)的线性混合假设对离散上位序列**不成立** → 是直觉不是定理。
- **静态完备地形(CR9114)单独给你**:每变体每抗原的 affinity 值 + 跨抗原 affinity 差 + 上位结构 —— **不给**动力学选择算子(affinity≠fitness + 缺 N_e/drift/M accessibility + survivorship bias,DeWitt 2025 GC-replay 直接证明推断出的 fitness 地形 ≠ 原始 affinity 地形)。

### 对问题定义的净影响
1. 老定义的 "SDE on embedding" 容器在物理上站不住(结论 B)+ 其可辨识性定理(Lavenant/Guan)挂在错误对象上(老 spec 自己标的 gating①② 正是此处)→ **应换成离散 mutation-selection 容器**。
2. "f = CR9114 affinity 直接拟合" 是 category error,除非显式分层 f=φ∘a(结论 A)→ **North Star 必须把 a(亲和力地图,可学)与 φ(亲和力→适应度,未知)分开**。
3. AI4S 求真视角下,真正未知、最有科学价值的对象是 **φ(affinity→fitness link)+ 它的 condition-dependence**,而非 a(亲和力地图,已被 DMS 测得/可回归)。这是对"选择算子"最诚实的再定位。
4. 已有最接近工作(CoSiNE/DASM)recover 的是 f(s) 平均掉条件,条件依赖靠外部预测器注入 → **f(s,c) 从动力学内生辨识 = 真实文献空白且方法成立(结论 C 的 contrast 论证),这才是站得住的新颖性,且不为发论文而设,是 recover 真算子的必要拼图**。
