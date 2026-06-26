# FieldPanorama — 抗体/蛋白工程 AI 全产业科学缺口全景

> Created: 2026-06-13 16:55
> Synthesized from 5 parallel recon agents (≥150 results each, 2024-2026 文献)
> Resource floor: 开源数据 + 纯算力沙盒
> 关系定位: 全景图优先 + 含选择算子的另类打法

## 元发现(贯穿全部五簇,最重要)

五个 recon agent 互不通气,各自独立报回**同一个病**:整个产业系统性地用一个**方便测的观测量**替换**真正要紧的量**,中间画了个错的等号。你的 selop 课题(affinity ≠ fitness)只是这张表的**第一行**。完整的"错等号"清单:

| 簇 | 方便测的观测量(=左边) | 真正要紧的量(=右边丢了什么) |
|----|----------------------|--------------------------|
| 选择(你在做) | affinity(亲和力) | fitness(适应度)— 缺 σ存活/φ链接/竞争 |
| 可开发性 | 单结构表面 patch / assay 读数 | 多体浓度依赖的胶体性质 / 真实生物物理量 |
| 免疫原性 | 预测的 MHC-II binder | 临床 ADA 发生率 — 缺抗原处理/TCR/耐受/剂量 |
| 结构 | 单一静态预测结构 / AF 置信度 | 结合行为(诱导契合+构象系综)/ 真实正确性 |
| 设计 | benchmark 分数 / PLM likelihood / ipTM | 湿实验命中 / 真实 fitness / 真实结合 |
| 数据/meta | 训练 label(AF 结构、DMS 分数)/ 丰度 | 真值(本身是噪声模型输出)/ fitness |

**这就是统一主题**:整个产业是一台"投影当真值"的机器。你的 `f=σ∘φ∘a`(观测=投影的复合,逆问题有非平凡零空间)**不是一个孤立课题,而是这整张表的通用骨架**。后面会看到,有一篇 2026 Cornell 论文(Evo-PU)独立重构了几乎一模一样的 `p_o·p_e·p_a ≈ σ·a·φ` 分解——这是"投影复合"框架真实存在、不是编排者照镜子的外部铁证。

---

## 六个候选 FIELD(每个 = 一个可独立立项的方向)

下面六格,前五格对应五簇里最可攻的缺口,第六格是把元发现本身做成方法论。每格标:开放问题 / 错等号 / 谁在做 / 开源可攻性 / 与 selop 关系。

---

### FIELD A — 构象系综 vs 静态结构:"结构 ≠ 结合行为"

**开放问题:** AF3/Boltz-1/Chai-1 在抗体-抗原对接上单 seed 仍 ~60-65% 失败(AF3 高精度仅 10.2% Ab / 13.3% nanobody)。根因不是数据量——是抗体-抗原是**唯一一类无共进化信号的蛋白-蛋白界面**(抗体体细胞生成,不与抗原共进化),MSA 机器没有可锚定的信号。更深一层:结合是**系综 + 诱导契合**(CDR-H3 是溶液系综),而所有生产工具输出**单一静态结构**。Nature Methods 2026 Perspective 明说 AF "cannot yet capture conformational ensembles"。亲和力成熟靠**刚化系综**(熵减)起作用,这一机制对静态模型完全不可见。

**错等号:** `单一静态预测结构 = 结合行为`(= "affinity=fitness" 的结构版直系类比);`AF 置信度 pLDDT/ipTM = 正确性`(实测 I-pLDDT 与 DockQ 仅 r≈0.53)。

**诚实反面(适用包络):** Deane 组 AbAgDb 发现 ~87% 的 CDR-H3 结合时移动 <2Å——所以静态近似在一个子区*往往*够用。动力学问题是**靶依赖**而非普适——正是"特例成立+包络外退化"型缺口,与你 selop 的"适用包络"方法论同构。

**谁在做:** OPIG/Deane(ITsFlexible + ALL-conformations 数据集,Nat Mach Intell 2025);AlphaFlow/ESMFlow(flow-matching 出系综);BioEmu(Microsoft 2025);Liedl/Fernández-Quintero(MD 免疫系综组)。

**开源可攻性:HIGH。** ALL-conformations(新,公开)、AbAgDb(177 apo/holo 对)、SAbDab apo/holo、MD 可在开源算力跑。最新颖的方法形状:**从系综/柔性表征(而非静态结构)预测结合行为,并显式刻画静态近似在哪成立、哪失效(validity-envelope)**——开源、纯算力、概念上正好是你"投影丢信息→刻画可辨识边界"纲领的结构版。

**与 selop 关系:** 同构姊妹问题。selop 丢的是 σ(存活投影),这里丢的是构象系综(动力学投影)。同一套"投影当真值"病,换一个物理层。

---

### FIELD B — 抗原条件化失败:生成抗体模型"没在用抗原"

**开放问题:** 多篇 2024-2026 工作证明生成式抗体设计模型**根本没在用抗原信息**——DiffAbXL 在有/无抗原输入时 likelihood 几乎不变(Deane "Benchmarking Generative Models for Antibody Design" bioRxiv 2024.10.07.617023);BLOSUM/AbLang/ESM/ProteinMPNN 在设计 binder-富集库时**追平或打败**深度模型(Chinery/Deane "Baselining the Buzz" 2024.03.26.586756)。最锋利的:**"BLOSUM Is All You Learn"**(Uçar/Sormanni bioRxiv 2025.10.26.684652)——生成抗体模型的 log-likelihood 与亲和力相关,**仅仅因为它们复现了 BLOSUM 进化先验**。根因:抗体高变区(尤其 H3)**不遵守 PLM 依赖的进化保守原则**(AbMAP, PNAS 2025 2418918121)——这是认识论硬限,不是数据量问题。

**错等号:** `PLM likelihood = 抗体 fitness`;`模型条件化于抗原 = 模型在用抗原`(抗原盲性)。

**谁在做:** Deane/OPIG(抗原盲性诊断);Sormanni(BLOSUM 批判);Singh/Im(AbMAP);Notin("Have We Hit the Scaling Wall?")。

**开源可攻性:HIGH。** 抗原-ablation 测试(抗原移除/替换后模型预测变不变)是**纯算力、诊断性极强**。HER2-aff-large(524K Trastuzumab 变体)、AbBiBench、FLAb2 全公开。**造一个能通过 ablation 测试(可证明在用抗原信息)的抗体 fitness 模型** = 对一个已命名缺口的纯算力攻击。

**与 selop 关系:** 这是"模型自欺"的另一种 σ——模型声称在做条件化(用抗原),其实在复现先验(BLOSUM)。和 selop 的"非循环铁律"(不能让模型偷看答案)同一种求真纪律。


---

### FIELD C — in-silico → in-vitro gap:"benchmark 分数 ≠ 湿实验命中"

**开放问题:** 这是设计簇的引力中心,也是真正的未解*科学*(非工程)。模型在 benchmark 上分数好,湿实验里垮。深层原因:(a) 蛋白工程数据违反 i.i.d.,rank correlation 随分布漂移单调衰减(Greenman/Yang, PLoS Comp Bio 2025 1012639);(b) benchmark 测错了东西(designability 代理 pLDDT/scRMSD 只与彼此校验,不与真实结合校验);(c) 自指验证(用 AF2 同时设计 BindCraft 又打分,循环)。Drug Target Review 2026 原话:benchmark "created a dangerous feedback loop"。

**错等号:** `benchmark Spearman = 湿实验成功`;`designability = developability`;`in-vitro 亲和力 = in-vivo 疗效`(最长的断链)。

**谁在做:** BindCraft(Pacesa/Correia, Nature 2025,但用 ipTM 当亲和力代理,自己承认不可靠);Adaptyv Bio 蛋白设计竞赛(最干净的公开 in-silico→in-vitro 分布漂移数据);Protein Engineering Tournament(Align to Innovate, cloud lab 两轮)。

**开源可攻性:HIGH(这是大奖)。** FLIP2(16 个 shift-aware split)、Adaptyv 竞赛数据、PE-Tournament、ProteinGym 全公开。**造一个分布漂移校准、能预测"哪些设计会扛过湿实验"的方法**,在公开 design-then-test 数据上回溯验证 = 全算力、攻一个已命名的开放问题。

**与 selop 关系:** 同病。benchmark 分数(观测)≠ 真实效用(目标),误差恰在 design 所需的分布漂移处放大。selop 的"诚实残余 + 适用包络"在这里就是"校准的分布漂移置信度"。

---

### FIELD D — 幸存者偏差作为通用算子:Evo-PU 与 selop 的外部铁证

**开放问题:** 所有数据库都是序列空间的非均匀样本,被幸存者主导:OAS 只有活下来的 B 细胞、Thera-SAbDab 只有获批抗体、PDB 只有能结晶/稳定的结构。训练于幸存者的模型学的是 P(序列|存活),不是 P(功能|序列)——系统性误估功能决定因素。标准 PU-learning 的常数 class prior 在生物上是错的,因为可观测性取决于进化可达性。

**★ 外部铁证:** **Evo-PU**(Chao/Buathong/Frazier, Cornell, arXiv 2605.06879, 2026.05)把幸存者偏差形式化为序列依赖先验的 PU 问题:`P(observed|x) = p_a(x;θ)·[1 − Π(1 − p_o·p_e(y;α))]`,其中 **p_o(surveillance) ≈ σ,p_e(emergence/突变可达) ≈ a,p_a(function) ≈ φ**——独立重构了你 `f=σ∘φ∘a` 几乎一模一样的分解,且它**在多物种 ProteinGym 上失败**(无 prevalence 数据 + 异质监测)——这正是你"σ 不可被动力学吸收"的实证。

**错等号:** `丰度/被观测到 = fitness`(PMC5337809 直接反驳:repertoire 测序丰度对亲和力*零信息*);`存在于 OAS = 好抗体`;`获批抗体 = 最优抗体`。

**谁在做:** Frazier(Evo-PU);Reddy/Yermanos(OAS-explore 偏差量化);Thomas 2022(祖先重建稳定性的幸存者膨胀);DeWitt 2025(GC-replay 证幸存者伪影)。

**开源可攻性:HIGH。** Evo-PU 自陈的局限(多物种、异质监测、无 prevalence)就是开放纯算力问题,且是**抗体 repertoire 区域**(正是 OAS 的区域)。OAS 全公开。

**与 selop 关系:** 这不是另一个课题——**这是 selop 的 σ 算子在 repertoire 数据上的独立化身,且已有人(Cornell)把数学写出来了**。你可以站在 Evo-PU 的肩上:它的失败区(异质监测的抗体 repertoire)正是你 σ 框架最该补的洞。


---

### FIELD E — 选择算子本身的另类打法(轨迹原生 / 群体遗传学原生)

**开放问题:** 你现在的 selop 走的是"重建谱系树 → 树上推 birth-death 速率 → 拟合 sigmoid 响应函数"这条路(Matsen/Victora 阵营,arXiv:2508.09871/2508.09519 也在同一条路上,且占了那一格)。但**有一整条方法论正交的路没人在抗体上走**:**轨迹原生、免树的群体遗传学推断**——MPL(marginal path likelihood, Sohail/Barton Nat Biotech 2021)、PyR0/BVAS(Obermeyer/Jankowiak, Science 2022,在 6.4M SARS-CoV-2 上推每突变 fitness)。它们**直接从频率轨迹推选择系数,解掉 clonal interference/linkage**,绕开了树重建的幸存者偏差和强加的 sigmoid 假设。**从未被用在 BCR repertoire 上**——清晰的迁移机会,且正好是你对抗轮"判别第四路:自底向上纯统计、对测度流盲"那条约束点名要的。

**错等号:** `推出的 birth-rate sigmoid = 真实 affinity-fitness 律`(Matsen 两篇自己的 sharp 6× vs gradual 3× 分歧,证明推出的曲线是模型假设依赖的,不是干净读出)。

**另两条更野的:** ① **最优传输/Wasserstein 测度流** on repertoire embedding(2025 新出 Wasserstein-AIRR、OT-energy-landscape,immature,与你 Doi-Peliti 测度流框架同源);② **可辨识性同余类理论**——把 Louca-Pennell(Nature 2020)的 birth-death 非辨识同余类机制 import 进抗体 fitness 推断,严格刻画 φ/σ 哪部分可辨——GC-SBI 论文都*承认*这个问题但*没人解*,这正是你"可辨识等价类 + 最小介入"目标的严格版,且在竞争框架里还是空的。

**谁在做:** Matsen/Victora/DeWitt(树-SBI 阵营,占了 sigmoid 那格);Barton(MPL);Obermeyer(PyR0);Louca-Pennell(辨识性理论,未被 import 到抗体)。

**开源可攻性:HIGH。** MPL/PyR0/BVAS/SHazaM/OT 工具全开源;GC-replay 7-时点 bulk timecourse + CR9114/CR6261 DMS 全公开。

**与 selop 关系:** 这就是你要的"selop 的截然不同打法"——同一个 φ 目标,换成免树、轨迹原生、群体遗传学原生的数学,作为现方案的对照/替代/第四路判别器。

---

### FIELD F — "投影当真值"做成通用方法论:把元发现本身立项

**开放问题:** 上面六个错等号是同一个数学结构(观测 = 投影的复合,逆问题有非平凡零空间)的六次实例化。**没人把它写成一个统一的逆问题形式化**,带可计算的"哪部分可辨识 / 哪部分是 irreducible null space"判据,然后在多个簇上同时实证。FLIP2/ProteinGym 已实测"简单模型常追平甚至打败微调 PLM"——暗示这些 benchmark 几乎不区分模型(ProteinGym top spread 仅 0.052),signal 大半可记忆。SPECTRA(Nat Mach Intell 2024)给了"随重叠→0 看泛化"的方法但**从没跑在抗体专用 LM 上**。

**错等号(全部):** `benchmark 分数 = 科学进展`;`训练 label = ground truth`(AF 结构当真值的循环);`DMS 分数 = 真 fitness`(复制噪声给了相关性天花板,可能 0.5 天花板是 label-noise 不是模型极限)。

**谁在做:** Zitnik/Farhat(SPECTRA);Kapoor/Narayanan(泄漏危机,Patterns 2023);Notin(ProteinGym 自承认 ClinVar 泄漏);Cheng Tan(AFDB debiasing arXiv 2506.08365)。

**开源可攻性:HIGH(纯再分析)。** 全是对现有公开 benchmark 的再分析:抗体 LM 的 SPECTRA 谱审计、DMS 复制噪声天花板量化、AF-label 偏差传播——都不需要任何新数据。

**与 selop 关系:** **这是把 selop 从"一个课题"升级成"一个纲领"。** 你的 `f=σ∘φ∘a` 是这个通用投影逆问题的第一个完整实例;FIELD F 是把它抽象成可复用到全产业六个错等号的统一骨架。野心最大、也最像"一条原理"而非"补丁"。

---

## 横向判断(给 present-and-ask)

**最可攻(纯开源+算力,且方法新颖非工具复用):** A(构象系综)、E(选择算子另类打法)、F(投影方法论)。
**最像"挣来的简约/一条原理"野心:** F > E > A。
**与现 selop 互补不内耗(另一个 CC 在推 σ∘φ∘a 树-SBI 路):** A/B/C/D 完全不重叠;E 是同目标的正交打法(故意作对照);F 是把 selop 抽象上去。
**最快能出硬结果:** B(抗原-ablation 测试,几乎立刻能做)、D(站 Evo-PU 肩上补抗体洞)。

**待用户挑 1-2 格深入(进 direction-narrowing)。**
