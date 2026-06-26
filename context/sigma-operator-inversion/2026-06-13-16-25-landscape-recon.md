# 抗体/蛋白工程 AI 产业全景侦察 — 截然不同途径探索

> Created: 2026-06-13 16:25
> Topic: De-anthropocentric warm-start — 在选择算子(σ∘φ∘a)之外,整个产业还有哪些没人攻的科学缺口 + 选择算子本身的另类打法
> Phase: North Star Crystallization (warm-start)

## Plan Context

用户有两个并行的 CC session。另一个 CC 正在推进 selection-operator v3 方案(`f=σ∘φ∘a`,挣来的简约 = 1 动力学原理 + 2 正交支柱 σ/辨识 + 1 残余 R_irr + 1 适用包络)以及 digital-evolution-sandbox。本 session 的任务**不是**重复那条路,而是:

1. 给一张**整个抗体/蛋白工程 AI 产业的科学缺口全景图**(选择算子只是其中一格)——用户明确说"我自己也不清楚除了我在做的这个选择算子以外,这整个产业当中还有哪些需要突破的科学研究"。
2. 在图里挑出几个能用**截然不同途径**攻的点——其中也包括对选择算子本身的另类打法(不同数学/方法/范式)。

**用户拍的两个 calibration:**
- 探索定位 = **全景图优先 + 其中也含选择算子的另类打法**(不是纯绕开,也不是纯正面竞争;是"先铺全景,再点几个截然不同的攻法,含 selop 的 alt-attack")。
- 资源现实 = **开源数据 + 纯算力沙盒起步**("我们就是不知道公司数据到底有什么程度,所以先从开源数据+纯算力沙盒起步")。每个方向都要标 attackability-with-open-data-only。

## 项目背景(从 v1/v3 context 提取)

**v1 原始动机(2026-05-28):** Click.mAb 公司需求 = 羊驼免疫 5 次 → NGS → ~2k panning 条件 → 150k VHH 序列;input 是 6×2k×150k 张量,output 想要 germline 进化 DAG,用来 ranking 候选 / 预测再进化 / 乃至全计算 de novo。直觉两条路线:Diffusion+Transformer 混合 / World Model(JEPA、RSSM)。

**v1 收敛(2026-06-10 northstar):** ranking 只是下游;真问题 = 学 condition-dependent 选择算子 f(seq,cond)。三路深挖确认:① affinity≠fitness 是 category error,正确写法 f=φ∘a(a=亲和力地图可学,φ=亲和→适应度未知);② 离散 mutation-selection 容器比 embedding-SDE 物理诚实;③ 已知突变算子 M 是可辨识的必要非充分条件。CR9114(Phillips 2021)是验证锚点。

**v3 收敛(2026-06-12~13,另一个 CC 在推进):** 锚定对象扩成 `f=σ∘φ∘a`(σ=存活/采样算子,survivorship bias 是漏掉的算子)。求真对抗轮把"漂亮统一答案"砸了一半,沉淀出"挣来的简约":1 EARNED 动力学原理 + 2 正交支柱(σ力学/辨识)+ 1 诚实残余 + 1 适用包络。带 7 条约束交给 sandbox。

## 侦察执行

5 个并行 recon agent(general-purpose,后台),每个跑 ≥12 web search + 文献搜索,覆盖全域不重叠:

| Agent | 簇 | 焦点 |
|-------|-----|------|
| ae67da6d | 可开发性+免疫原性 | aggregation/viscosity/Tm/ADA/polyreactivity |
| a540f042 | 结构+结合+表位 | AF3 抗体-抗原失败/ΔG天花板/构象动力学 |
| acdd56a1 | 免疫动力学+repertoire | GC/SHM/lineage tree/bnAb/SBI + 选择问题的另类数学攻法 |
| a6eb5cd3 | de novo 设计+生成 | RFantibody命中率/in-silico→in-vitro gap/ML引导定向进化 |
| a7548c0c | 数据+benchmark+meta | benchmark危机/幸存者偏差/因果vs相关/ground-truth本身是模型输出 |

每簇统一报: 开放科学问题 / SOTA+谁在做 / "用错的等号" / 开源数据可攻性 High-Med-Low / 关键 paper+ID。

## 状态

- [x] context-init + 5 recon agents 已派发
- [x] 收集 5 份 digest
- [x] landscape-synthesis 出 FieldPanorama(`2026-06-13-16-55-field-panorama.md`)
- [x] present-and-ask → 用户选 FIELD D(幸存者偏差/σ 算子)
- [x] direction-narrowing(深读 Evo-PU + 30 篇抗体文献)
- [x] 用户纠偏:不是拆 paper,是把 D 当"反演整个 σ 算子"彻底突破
- [x] north-star-synthesis → North Star 锁定 + ResearchBrief(`2026-06-13-17-10-research-brief.md`)
- [ ] **Phase 2(writing-specs)待用户确认进入**

---

## DIRECTION-NARROWING:用户选了 FIELD D(幸存者偏差/σ 算子)

深读 Evo-PU 全文(arXiv 2605.06879)+ 30+ 抗体 repertoire 幸存者偏差文献。核心定位:

**Evo-PU 的观测似然 = selop 的 σ∘φ∘a 写成观测概率:**
`P(观测到 x) = p_a(x;θ)·[1 − ∏_y(1 − p_o·p_e(y;α))]`
- p_a(功能性分类器,目标)≈ φ
- p_e(核苷酸级 emergence/突变可达)≈ a —— **Evo-PU 只用两个常数(transition 2.6e-5 / transversion 1.4e-7)**
- p_o(surveillance,**单个全局标量**)≈ σ

**Evo-PU 在病毒单物种上work,在多物种 ProteinGym 上fail,自陈两个原因**:① 全局标量 p_o 抓不住异质监测;② 无 prevalence 数据。**这两个 fail 模式正好是 OAS 的结构特征——但在抗体上,它们不是缺陷而是已记录的协变量/可被生物物理算子替换。**

### ★ 最锋利的定位:抗体是唯一一个 Evo-PU 失败方程里每一项都能单独观测的领域

| Evo-PU 项 | 病毒(Evo-PU 原版) | 抗体(本方向的升级) |
|-----------|------------------|--------------------|
| p_e 突变可达 | 两常数 transition/transversion 核苷酸 kernel | **已知的 SHM context model(S5F/Thrifty/EPAM, Matsen),hotspot-aware,开源参数;祖先集=germline-rooted clonal lineage,距离=SHM 加权而非 flat Hamming** |
| p_o/σ 监测/存活 | 单个全局标量 | **(1) 可观测的 selection-free baseline(nonproductive/out-of-frame 序列,Pgen/Ppost,Mora-Walczak)+ (2) DMS-grounded 亲和力 sigmoid(DeWitt 2025)+ (3) OAS 记录的 cell-state 元数据(naive/memory/plasma, blood/spleen, IgM/IgG)** |
| p_a 功能性真值 | 弱 | **组合完备 DMS(CR9114 2^16 / CR6261 2^11,用户已有 parquet)——每个中间体都测了,无幸存者污染** |

### 4 个候选研究问题(deep-read agent 产出)

- **A — SHM-aware survivorship PU(Evo-PU→"SHM-PU")**:把 Evo-PU 的两常数 p_e 换成 hotspot-aware SHM 模型 + germline-rooted lineage emergence。问:SHM-aware 的序列依赖 class prior 能否比 Evo-PU 通用 kernel 和幸存者盲的 PLM 更好地恢复抗体功能性?真值=CR9114/CR6261 DMS。novelty:vs Evo-PU 更富的生物物理 emergence;vs Matsen 把他们的 SHM 模型用作观测似然里的 emergence kernel 而非轨迹预测。
- **B — 异质监测:标量 p_o → cell-state 观测算子**:把全局标量 p_o 换成序列+元数据依赖的 p_o(x,m)。问:OAS 能否成为"Evo-PU 做不了的异质监测区"——但监测是被观测而非隐变量?真值=paired OAS cell-state + 抗原特异子集(CoV-AbDab)。
- **C — 统一选择算子:Pgen/Ppost ↔ 幸存者 class prior(双-σ 模型)**:观测=两个选择算子复合 σ₁(generation/tolerance,从 nonproductive 估)·σ₂(亲和力 sigmoid)。问:把观测算子分解成 selection-free baseline + 亲和力项,能否优于单一 lumped class prior,且恢复的 σ₂ 匹配独立测的 GC 亲和力 sigmoid?真值=DeWitt GC-replay + CR9114。novelty:首次桥接 Mora-Walczak repertoire-selection 与 Evo-PU survivorship-PU;抗体独有的"可观测 selection-free baseline"(nonproductive 等位)是病毒没有的结构优势。
- **D — 幸存者伪影矫正作为验证目标(恢复隐藏景观)**:DeWitt 2025 声称 GC"对低亲和力宽容"+"亲和力 plateau"是幸存者伪影。问:只给幸存者采样的 BCR,能否重建真实无偏景观、定量移除伪影?真值=CR9114 完备景观(模拟幸存者采样→尝试恢复,答案全知)。novelty:把幸存者矫正重构成有完整答案钥匙的 landscape deconvolution——只有抗体 DMS 的组合完备真值能做。风险:用来污染的 σ = 你要矫正的 σ,有循环风险,须用独立 σ。

### Bottom-line(agent 推荐)

最紧、最可辩护的核心 = **A + C 交集**:抗体是唯一一个 Evo-PU 失败方程每一项都单独可观测的领域。最干净的单一 novelty 主张:"抗体 emergence 算子 p_e 不是通用突变 kernel 而是已知 hotspot-aware SHM 算子;抗体 survivorship 算子不是隐标量而是 可观测 selection-free baseline(nonproductive)+ DMS-grounded 亲和力 sigmoid 的复合——使抗体 repertoire 成为 survivorship-aware 功能性推断的天然home,在组合完备 DMS 上验证。" 全程开源+纯算力。

**与现 selop(另一个 CC 推 σ∘φ∘a 树-SBI)的关系**:不内耗。selop 推 φ(亲和→适应度);本方向推 p_a(功能性)并把 σ 当观测算子去反演。是 selop 的 σ 算子在 repertoire 数据上的独立、已数学化(Evo-PU)的化身。

**关键 paper IDs**:Evo-PU arXiv:2605.06879;AbLWR arXiv:2604.11272(PU-on-antibodies 但无 σ);Bakis/Minin arXiv:2508.09519;DeWitt GC-replay bioRxiv 2025.06.02.656870 / Cell S0092-8674(26)00572-6;CR9114/CR6261 eLife 71393;Thrifty SHM eLife 105471;EPAM bioRxiv 2025.06.16.659977;abundance≠affinity PMC5337809;OAS pro.4205;Mora-Walczak SONIA PLoS Comput Biol 1008394。

**待用户从 A/B/C/D(或 A+C 交集)挑核,然后 north-star-synthesis 结晶。**
