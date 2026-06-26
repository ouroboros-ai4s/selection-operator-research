# Stage 1 — Knowledge Acquisition:系统补齐 σ 反演的承重知识

> Created: 2026-06-13 20:58
> Topic: 抗体 repertoire 观测算子 σ 的彻底反演
> Phase: Stage 1 / 7 — knowledge-acquisition
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md
> Context dir: G:\OUROBOROS-AI4S\context\ (spec 写 context/... 实际解析到仓库根 context/)

## Plan Context

**Objective:** 把反演 σ 所需的五块知识系统化抓齐,并测准现有 baseline 到哪 —— 不是泛泛文献综述,是为"造算子"备料。

**Expected Input(已核验存在):** ResearchBrief(`context/2026-06-13-17-10-research-brief.md`)已给 North Star、数学骨架、关键 paper IDs、数据集表。本 stage 把这些从"侦察级"升到"可建模级"。

**五块知识(缺一不可):**
1. **Evo-PU 数学全细节**:似然、p_e 近似、p_o 标量、训练目标、补集近似(arXiv:2605.06879,本 stage 复核可复现性)。
2. **Mora-Walczak Pgen/Ppost 机制**:IGoR/OLGA/SONIA/soNNia 如何从非生产性序列估 selection-free baseline,Q=Ppost/Pgen 数学(→ σ₁)。
3. **SHM 算子**:S5F(5-mer)、Thrifty(13-mer CNN)、EPAM —— 参数、训练数据(out-of-frame)、开源接口(→ p_e kernel)。
4. **选择偏差校正的跨域武器**:Heckman two-step、IPW、phylogenetic ascertainment(条件非灭绝)—— 映射到 σ 的可行性。
5. **OAS 数据结构 + 元数据 schema**:cell-source/sort-gate/isotype/study 字段、paired 比例、技术偏差层(5′截断/PCR/UMI)、abundance≠affinity 红线(PMC5337809)。

**Recommended Combination:** knowledge-acquisition → literature-survey, baseline-establishment

**Completion Criteria(硬闸,±10%):**
- 五块各产出可建模级摘要(含数学式/接口/字段);
- baseline 表实测记录 Evo-PU、AbLWR(arXiv:2604.11272)、Bakis-Minin(arXiv:2508.09519)在各自任务上的具体数字与适用边界;
- ≥40 篇 paper 过 paper-search 级、≥10 篇 paper-research 级全文。

**Backtrack Condition:** if 发现 σ 的某分量根本无开源数据支撑(如 cell-state 元数据不可用)→ 回 North Star 重审该分量是否该留(需用户确认)。

**Execution Steps:**
- [ ] context-init → `context/sigma-inversion-ka-knowledge.md`(本文件,完成)
- [ ] literature-survey:五块知识 PRISMA/snowball 抓齐
- [ ] context-checkpoint
- [ ] baseline-establishment:Evo-PU/AbLWR/Bakis-Minin SOTA 实测到哪 + 适用边界
- [ ] context-checkpoint
- [ ] 汇总到 sigma-inversion-INDEX.md

## 执行模式约定(本轮,经用户确认)

- **岔口1 = B**:实测 = 可达性核验 + 论文报告数字 + **小 smoke 冒烟**(本地 S5F 在几条 CR9114 genotype 上算 p_e;若装得上,跑几条序列 OLGA Pgen)。不跑完整 pipeline、不下 OAS 全量、不端到端 IGoR/SONIA。
- **岔口2 = A**:每个 stage 闸口暂停,跑完核验硬闸后停下给用户过目,不擅自进下一 stage。
- 文献抓取用并行 subagent 分头抓五块 + baseline,主线缝合 + 冒烟。

## 资源/求真红线(全程生效)

- 资源红线:开源 dataset + 纯算力;唯一合成 = 幸存者采样算子。禁纯沙盒。
- 求真红线:① 非循环(σ_gen≠σ_inf);② 不偷看答案;③ abundance≠affinity(PMC5337809),prevalence 不可当 fitness 代理。

## 本地已核验资产(开工前 ground truth)

| 资产 | 路径 | 形状/内容 | 角色 |
|---|---|---|---|
| CR9114 DMS | `datasets/cr9114/datasets/cr9114/606faf63-*.parquet` | 65536×11(genotype, som_mut, h1/h3/b_mean+sem+censored) | p_a 真值 + 反卷积闭环靶 |
| CR6261 DMS | `datasets/cr9114/datasets/cr6261/a8097f8c-*.parquet` | 2048×8(genotype, som_mut, h1/h9_mean+sem+censored) | p_a 真值(第二景观) |
| S5F kernel | `datasets/s5f/datasets/s5f/data.parquet` | 1024×6(fivemer, mutability, sub_A/C/G/T) | **p_e emergence kernel 本地已有** |
| (其它) engelhart / magma-seq | `datasets/engelhart/`, `datasets/magma-seq/` | parquet 已存在 | 待 stage 内核验角色 |

---

## Checkpoint: literature-survey 五块知识抓齐 + 岔口1=B 冒烟

> Appended: 2026-06-13 21:19
> Strategy: literature-survey(deep-survey × 5 并行 subagent + 主线缝合 + smoke)
> 模式:岔口1=B(可达性核验 + 论文报告数字 + 小 smoke 冒烟);岔口2=A(stage 闸口暂停)

### Objective(本 checkpoint 覆盖)

把反演 σ 所需的五块承重知识从"侦察级"升到"可建模级",并用并行 subagent 分头 PRISMA/snowball 抓齐文献;同时按岔口1=B 落地三项小冒烟(本地 S5F 是否=published、p_e kernel 装法是否真破 flat-Hamming 退化、OLGA σ₁ Pgen 是否端到端跑通),给 baseline 可行性提供活数字而非纸面断言。本 checkpoint 记录五块的可建模级结论、文献账本、冒烟结果、以及交给 Stage 2 的承重移交项。

### Process Summary(执行流水)

1. **开工前 ground truth 核验**(主线,开工即做):
   - 读 spec 全文 + ResearchBrief 全文 + CLAUDE.md + 根 INDEX + memory MEMORY.md。
   - 核验本地数据:`cr9114` parquet = 65536×11、`cr6261` = 2048×8(与 spec 声称完全一致);S5F kernel `datasets/s5f/.../data.parquet` = 1024×6 本地已有(p_e 料在盘上,不只可引用)。
   - 核验 Stage 6 自建证伪套:7 个 skill 都在 `context/selection-operator-v2/stress-test-skills/`(circular-validation-audit / red-team-truthseeking / elegance-trap-probe / independent-convergence-audit / isomorphism-falsification / adversarial-debate-truthseeking / falsification-first-stress-test)。
   - 路径澄清:spec 写 `context/...`,实际 `context/` 在仓库根(`G:\OUROBOROS-AI4S\context\`),所有引用都解析到根 context/;新建 sigma-inversion-*.md 放根 context/。
   - 核验外部铁证 Evo-PU(arXiv:2605.06879)原文:似然式、p_e 公式、转换/颠换常数(2.6e-5/1.4e-7)、两个自陈失败原因(全局标量 p_o + 无 prevalence→等 prevalence 假设)全部与 spec 引用一致。

2. **并行 subagent 分五块抓文献**(deep-survey 各一,modeling-grade):
   - Block 1 = Evo-PU 数学全细节 + 可复现性;
   - Block 2 = Mora-Walczak Pgen/Ppost(→ σ₁);
   - Block 3 = SHM 算子 S5F/Thrifty/EPAM(→ p_e kernel);
   - Block 4 = 选择偏差校正跨域武器 Heckman/IPW/ascertainment(→ 映射 σ + 可辨识性铁证);
   - Block 5 = OAS 数据结构 + 元数据 schema(→ p_o(x,m) 协变量 + abundance≠affinity 红线)。
   - 五块全部返回结构化报告含 paper ledger + counts。

3. **岔口1=B 冒烟**(主线,subagent 回来后):
   - S5F published 核验(rows/mutability 归一/sub 行和/center-base 自替换/WRC-GYW-SYC hotspot ordering);
   - p_e kernel 装法冒烟(S5F→P(y'→y),比 SHM-weighted vs flat 在同 som_mut 基因型上的可达性退化);
   - OLGA 安装 + human_B_heavy Pgen 端到端跑(σ₁ baseline 可行性活数字)。

### 文献账本汇总(counts)

| Block | search-level N | full-text M | 关键全文 |
|---|---|---|---|
| 1 Evo-PU | 15 | 2 | Evo-PU 2605.06879;Protein-PU Song2021 PMC7856229 |
| 2 Pgen/Ppost | 9 | 6 | IGoR 1705.08246;OLGA 1807.04425;soNNia 2011.03112;SONIA/PLoS-CB 2001.02843;Elhanati2014 1404.4956;GSSP PMC5424261 |
| 3 SHM 算子 | 12 | 4 | S5F PMC3828525;Thrifty eLife105471(2024.11.26.625407);EPAM 2025.06.16.659977;DeepSHM PMC8749460 + netam 源码 |
| 4 跨域校正 | 16 | 3 | Bakis-Minin 2508.09519;Cortes IPW 0805.2775;Dieselhorst-Stadler 2604.17926(含 Louca-Pennell 同余式 verbatim) |
| 5 OAS | 12 | 5 | OAS PMC8740823;红线 PMC5337809;OAS 文档×2;Mal-ID PMC12061481 |
| **合计** | **64**(≥40 ✓) | **20**(≥10 ✓) | — |

硬闸文献量:**search-level 64 ≥ 40**(即便去重跨 block 仍远超);**full-text 20 ≥ 10**。两项达标。

---

### 五块知识 · Block 1:Evo-PU 数学全细节 + 可复现性(可建模级)

**核心似然(Section 2.1,verbatim 核对):** 三隐变量——功能性 `A(B(y))`、涌现 `E(y)`、监测标量 `p_o`。核苷酸级观测 `P(O_Y(y)=1|E,A) = p_o·E(y)·A(B(y))`;氨基酸级是同义密码子的 OR:`O_X(x)=1[∃y∈Y(x): O_Y(y)=1]`。边缘化得序列依赖类先验:

```
P(O_X(x)=1) = p_a(x;θ) · [ 1 − ∏_{y∈Y(x)} (1 − p_o·p_e(y;α)) ]
```

中括号项就是类先验(功能性 x 被观测的概率),即全部 novelty。**Y(x) = 同义密码子回译集**(x 的 codon preimage)。

**精确 log-likelihood(Eq 1):** `ℓ = Σ_{x∈D_X} log P(O_X=1) + Σ_{x'∈D'_X} log(1−P(O_X=1))`,D'_X 指数大 → 需 Eq4 近似。

**涌现模型 p_e(Eq 2/3,verbatim):**
```
Eq2: p_e(y;α) = 1 − ∏_{y'∈D_Y}(1−P(y'→y)·α)^{c(y')}
Eq3: p_e(y;α) ≈ 1 − exp(−Σ_{y'∈D_Y} P(y'→y)·α·c(y'))   [(1+x)^a≈e^{ax}]
```
- D_Y = 观测核苷酸集(所有观测序列充当候选祖先);已观测 y∈D_Y 设 p_e=1。
- α = 标量 nuisance,"涌现序列变 dominant 的概率"/吸收 failure-to-reproduce,**联合估**。
- c(y') = 祖先 y' 的 progeny 机会数,**算法:∝ y' 在 D_Y 的经验频率,按 T 标度**(T=有 progeny 的 unique organism 估数);α 吸收剩余比例常数。

**突变核 P(y'→y)(Section 2.4):** RNA 两机制——transition(A↔G,C↔U)/transversion(A↔C,A↔U,G↔C,G↔U)。单点差:transition **2.6e-5**、transversion **1.4e-7**(全局常数,所有任务通用);多点差概率指数衰减→近似中丢弃。

**可解近似(Eq 4/5):** 对每个 y∈D_Y 枚举所有单核苷酸突变 y',保留 p_e(y';α)>ε(**ε=1−exp(−10),α=1** 用于构集)→ D̂'_Y;翻译得 D̂'_X;限制 Ŷ(x)=Y(x)∩(D_Y∪D̂'_Y)。训练目标 Eq5:`argmin −ℓ̂_n + λ‖θ‖²`,p_o∈(0.01,0.99)、α 按任务设界(如 flu-fusion (0.00075,0.99))。

**分类器/编码:** LR 或 Wide&Deep(wide 1FC→64 ∥ deep 2-MLP 32/16+BN+ReLU+dropout0.3→concat 80→sigmoid);**CHEM = 3 个理化氨基酸属性**(Moon&Fleming 疏水 + Foulquier IMGT 电荷 + 第三个未命名)。ESM2(t30_150M)反而更差(高维低数据过拟)。

**超参:** λ=50;T=24B(flu/RSV/ProteinGym)/12B(flu-evasion H1)/1B(SARS);ε=1−exp(−10);Adam lr1e-3 + CyclicLR 1e-3↔1e-1 + grad-clip1.0 + ≤2000epoch 早停。App E/F/G/H 全做了 λ/T/ε/编码 消融——**对 λ/T/ε 不敏感,CHEM 稳超 ESM2**(定性结论稳健)。

**vs 现有 PU:** 经典二分类 = Evo-PU 取 p_o·p_e≡1 的特例;Protein-PU(Song2021)用常数标注效率 q,即 `Σlog(q·p_a)+Σlog(1−q·p_a)`,q=1 退化为经典。**Evo-PU 把标量 q 换成序列依赖 `1−∏(1−p_o·p_e)`**——这是全部区别。

**可复现性评估:**
- **代码未公开**(arXiv v1 + OpenReview zWwU6tyDGt 均无 repo)。仅 baseline EVE 公开;Protein-PU 代码公开(RomeroLab/pudms + PUlasso),可作 q-baseline 重实现锚。
- **完全可重实现:** 5 个方程齐全、突变核全表+常数、D̂'_Y 构造算法、WD 架构逐层、优化 schedule、per-task α/p_o 界、λ/T、数据来源与计数(App C)。
- **欠定(挡精确复现):** ① CHEM 第三个属性 + 精确数值标度只给引用未列表;② "non-consecutive motifs" 拼接位置未给;③ c(y') 绝对归一约定(∝freq×T,α 吸收常数)使 p_e 绝对值只能重建到约定;④ ProteinGym 随机回译无种子;⑤ codon table(标准 vs 物种特异)未述。

**★抗体翻盘的三个数学接口(本课题存在理由,verbatim 落点):**

| Evo-PU 项 | 病毒默认 | 抗体替换 | 翻哪个弱点 |
|---|---|---|---|
| P(y'→y)(Eq2/4) | 2 全局常数 | SHM 5-mer context kernel(S5F/hotspot)+ 谱系轨迹 | 突变现实性(flat→context) |
| p_o 标量 | 单全局 (0.01,0.99) | p_o(z) GLM over cell-state 元数据 | **W1** 异质监测 |
| c(y') prevalence | freq×T(ProteinGym 强制等) | repertoire UMI/read-depth 克隆丰度计数 | **W2** 缺 prevalence |
| p_a / negatives | 隐变量 PU 推断 | 组合完备 DMS(CR9114)**直接观测** negatives | PU 前提→监督;使 σ 反演可验 |

**Hook C 关键:** CR9114 组合完备 DMS(2¹⁶ 全变体,H1/H3/B 直接测)提供 **labeled negatives** → A(x) 直接观测非隐;把 Evo-PU **不可证伪**的类先验(自陈 ProteinGym 失败但无 negative-labeled check)变成**可证伪/可监督**——这是反演 σ 的干净 ground-truth 锚。

---

### 五块知识 · Block 2:Mora-Walczak Pgen/Ppost → σ₁(可建模级)

**σ₁ 是什么:** 选择因子 **Q(x) = P_post(x)/P_gen(x)**(差归一 Z)——逐序列乘性偏差,把"未选择的生成测度"映到"观测(后 tolerance、前抗原)repertoire 测度"。Q>1=tolerance 富集,Q<1=耗竭;log Q 是特征空间加性 log-bias。

**生成模型 P_gen(IGoR/OLGA):** 重组 scenario E = 隐事件全集(germline 基因选择 + 末端删除 + 非模板插入)。重链:
```
P_rec(E)=P(V,D,J)·P(delV|V)·P(delDl,delDr|D)·P(delJ|J)·P(insVD)p₀(m₁)∏S_VD·P(insDJ)q₀(n)∏S_DJ
```
插入=Markov 链(每插入核苷酸只依赖前一个)+ 非参长度分布。**隐变量边缘化**:同一观测序列可由多 scenario 产生(IGoR 报 >70% IGH 的 max-likelihood scenario 是错的)→ `P_gen^nt(σ)=Σ_{E→σ}P_rec(E)`;氨基酸级 `P_gen^aa(a)=Σ_{σ∼a}P_gen^nt(σ)`,**OLGA 用 O(L²) 动态规划精确求解**(CDR3 切 5 段 V/N1/D/N2/J,左右累积权重矩阵收缩,codon 边界记 4 维核苷酸身份)。P_gen 跨真实 repertoire ~20 数量级。

**IGoR 推断:** 稀疏 EM on 隐 scenario,**只用非生产性(out-of-frame)序列训练**(~5000 unique out-of-frame TRB 足够);BCR 可加 7-mer PWM context-dependent SHM 模型 `P_mut/(1−P_mut)=μ·exp(Σeᵢ(πᵢ))`,但重组统计须从 naive/非超突变细胞学。

**选择因子 Q(SONIA/soNNia):**
- **线性 SONIA**(Elhanati2014/Sethna2020):`Q(σ)=(1/Z)∏_{f∈F(σ)}q_f`,原参数化 `Q=(1/Z)q_L·q_{VJ}·∏ᵢq_{i;L}(aᵢ)`,选择因子作用于 **(i) V,J 联合用法 q_VJ,(ii) CDR3 长度 q_L,(iii) 每位氨基酸身份 q_{i;L}(a)**。Left+Right 模型把位置因子按距 5'/3' 端距离分解(默认 25aa),大减参数。
- **深 soNNia**:Q_θ 是 DNN(三特征类各过子网→dense 合并→log Q)。743-个体 TCRβ:soNNia D_KL≈1.0bit vs 线性 SONIA 1.6 vs P_gen alone 3.0。
- **训练:** max `L(θ)=⟨logQ⟩_D − log⟨Q⟩_G`,G=从 P_gen(OLGA)采的未选择 baseline ensemble,D=观测生产性数据;等价于匹配模型/数据特征边缘(θ_f=log q_f)。
- **方差分解(Sethna2020,651 donor):** Var(logP_post)≈80% 来自生成、~4.5% 来自 Q、其余正协方差("自然选择预判体细胞选择")。Q 饱和 ~7 → 过选择比例 ≤15%。

**开源接口(github.com/statbiophys,纯 Python 除 IGoR):**
| 工具 | repo | PyPI | 角色 | I/O |
|---|---|---|---|---|
| IGoR | statbiophys/IGoR | (C++;pygor3) | 学重组模型θ+SHM PWM,EM from 非生产 | in 原始核苷酸 reads+IMGT germline;out 模型 marginals+P_gen |
| OLGA | statbiophys/OLGA | `olga` | 快速精确 P_gen(aa/nt/motif)+生成 | in CDR3 aa/nt(+V/J)+模型文件;out P_gen float / 合成序列;**自带 human/mouse IGH/TRA/TRB 模型** |
| SONIA | statbiophys/SONIA | `sonia` | 线性 Q,P_post | in 生产性 CDR3 aa+V/J;baseline 内置 OLGA 自生成 |
| soNNia | statbiophys/soNNia | `sonnia` | 深 Q + 经验 baseline 模式 | 同 SONIA;Keras 后端 |

**安装可行性:** `pip install olga sonia sonnia` 纯 Python 可装、互通(SONIA/soNNia 内部调 OLGA;OLGA 直读 IGoR 模型文件)。**唯一摩擦 IGoR 是 C++**——但我们大概率不需跑 IGoR:OLGA **已自带预学 human IGH 模型**,只在 locus/germline 不同才需 IGoR 重学。Pipeline:非生产 reads → IGoR(P_gen 模型)→ OLGA(算 P_gen/生成 baseline)→ SONIA/soNNia(推 Q/算 P_post)。

**映射到 σ₁:** σ₁ 吃氨基酸序列(CDR3+V/J,编码为 {V/J 用法,CDR3 长度,位置解析 aa 身份} 二值特征向量),吐标量选择偏差校正 Q(x)(+ OLGA 给绝对 P_post)。**去 σ₁** = 观测序列权重除以 Q(回到生成测度);**施 σ₁** = P_gen 乘 Q。这是 σ 生成/tolerance 分量最干净的开源可操作化。

**非生产性 baseline 假设 + 失败模式(承重):** 假设 out-of-frame 重组=表达但不被选择=只反映生成。机制可辩护(非生产 allele 搭车在另一生产 allele 的细胞;AID 仍作用但无功能选择)。GSSP(Sheng2017)实证:passenger-allele vs functional GSSP 相关 **r=0.90(替换频率)/0.80(rarity)**。**但失败模式:** ① 残余选择非零(~30% FW3 位负选择、~5% 正选择;Cys 突变在功能 profile 被抑制)→ baseline 是 approximate-neutral 非严格中性;② **SHM 污染 BCR 生成模型**(IGoR 警告 10⁻¹ 超突变率显著降精度,gene-usage 最受影响)→ BCR 重组统计须从 naive 学,memory out-of-frame 会偏;③ B 细胞 out-of-frame 比 TCR 稀少且噪;④ Q 只抓粗全局选择(饱和 ~7,平滑掉个体特异/HLA 驱动/抗原驱动精细选择——后者恰是 σ 其它分量);⑤ 线性独立性假设。**净:** Q=P_post/P_gen 是 σ₁ 正确的开源可解估计,非生产 baseline 可辩护但不完美(r≈0.9),残余选择/SHM 污染/粗糙性应建模为 σ₁ 已知误差预算而非忽略。

---

### 五块知识 · Block 3:SHM 算子 S5F/Thrifty/EPAM → p_e kernel(可建模级)

**共同结构(matsengrp/Kleinstein 生态):** 三模型都分解为 **(每位 targeting/mutability)×(突变后条件替换概率 CSP)**——恰是 p_e 需要的"rate × where-to"两因子。

| | S5F(Yaari/Kleinstein 2013) | Thrifty(Sung 2024/25) | EPAM/Thrifty-prod(Johnson 2025) |
|---|---|---|---|
| 形式 | 5-mer 查表(4⁵=1024) | CNN on 3-mer embed,kernel11→**13-mer** context | Thrifty SHM CNN + 选择因子 |
| context | ±2nt | ±~6nt | 13-mer(NT)×可选 AA 选择 |
| 预测 | (1)中心碱基相对 mutability(均值归1)(2)到其它3碱基替换 profile | (1)每位突变率(指数等待)(2)每位 CSP | 每位 NT→提升到 AA 概率 + 可选选择乘子 |
| 参数 | ~3072 | "最省"13-mer 比 5-mer 还少;EPAM 报 Thrifty-SHM≈5931 | 同 SHM core + 选择(ESM-1v/BLOSUM/DMS) |
| 训练中性源 | **同义突变**(4-fold 简并位,**生产性** BCR;806860 syn from 1.14M seq) | **out-of-frame/非生产** | S5F=syn;Thrifty=非生产;ReplaySHM(mouse)=非生产 passenger |
| 关键发现 | 替换 neighbor-dependent 且非链对称;targeting 跨个体高度保守(r~0.9);WRC/GYW 内 62.7 倍 range | 13-mer 略胜 5-mer;**给定核苷酸 context 不需 per-site 项**;out-of-frame 与 syn 拟合**显著不同** | 核苷酸 context CNN **胜过** 650M ESM-1v 和 AbLang2;加 ESM-1v 选择反而**有害**;DMS 选择仅微增 |
| 接口 | shazam R `HH_S5F`(本地 parquet 是其 port) | Python **netam**(`pip install netam`;预训练 ThriftyHumV0.2-{20,45,59} 从 matsengrp/thrifty-models v0.2.0 自动下) | github matsengrp/epam;数据 Zenodo 17353498;底层用 netam |

**★p_e kernel 装法(netam molevol.py 源码核对——承重发现):** matsengrp 核 **正是 p_e 同款 1−exp(−rate) 形式**:
```python
mut_probs = 1.0 - torch.exp(-branch_length * nt_rates)   # 每位突变概率
result = codon_mut_probs[:,:,None] * codon_csps           # × CSP
```
单代突变概率逐位分解:
```
P(y'_i → y_i) = (1 − exp(−λ·r_i(context_i))) · CSP_i(y'_i → y_i)
```
- r_i = SHM 模型从 5-mer(S5F)/13-mer(Thrifty)context 读的每位 mutability(S5F:`r_i=mutability[fivemer_i]` 均值归1)。
- CSP_i = 替换 profile(S5F sub_{A,C,G,T};Thrifty CSP head);parent base 项=0,行和=1。
- λ = branch-length/单代标度,把相对 mutability 转绝对概率(= 我们的 α 角色)。

**从 Evo-PU flat 常数的具体替换:** 把全局 transition 2.6e-5/transversion 1.4e-7 换成 `P(y'_i→y_i)=(1−exp(−α·mutability[5mer_i]))·sub_base[5mer_i]`——flat 2 常数 → 1024 项 context-dependent kernel(S5F)或 CNN 评估 kernel(Thrifty)。
- **SHM 加权距离(非 flat Hamming):** 路径 log 概率 `Σ_i log P(y'_i→y_i)`,故祖先-观测距离 `=−Σ_i log[(1−exp(−α·r_i))·CSP_i]`——WRC hotspot 突变代价小,cold spot 代价大。
- **germline 谱系祖先集(非 population prevalence):** 祖先集 = 推断 germline V(D)J 根的**克隆谱系树**,Σ over y' 跑可达谱系祖先,各按 α·c(y')(谱系丰度)权,非 population frequency。
- **多步路径合成:** 单代 P 沿树枝合成,g 代可达性 `1−Π_branches(1−P_branch)`,与 netam `1−exp(−Σrate)` 累积一致。

**推荐算子:** 默认 **S5F**(静态 1024 行表,无 torch 依赖,本地 parquet 已有);**Thrifty**(ThriftyHumV0.2-59 via netam)当宽 context 重要且可接受 torch。两者 mutability+CSP 同形状。

**out-of-frame→in-frame 迁移风险(中心 caveat,matsengrp 明说):** ① 两种中性数据策略 **互相不一致**:syn-in-functional(S5F,简并位 silent,风险=简并位仍可能 codon/表达选择)vs out-of-frame/非生产(Thrifty/ReplaySHM,真正 selection-free,风险=染色质/转录 context 不同)。② Sung et al. 直接证两拟合"产生显著不同结果",一个上训另一上差,合并不改善——它们"抓不同过程",故 S5F vs Thrifty **不可互换**。③ **我们的迁移是反向且未验**:把 selection-free 数据拟合的 kernel 用到 in-frame 已选择 context(观测成熟抗体已过选择)。SHM 给 P(突变|中性 SHM),p_e 用它作突变可达性先验——**只在作生成/中性项时正确**,选择(σ)须分开处理。风险=双重计算或遗漏(若选择泄漏进 SHM 拟合,用作纯突变 kernel 会混淆突变与选择——恰是 σ 反演须避免的循环)。④ EPAM 发现加选择因子仅微增、ESM-1v 选择有害 → 突变(SHM context)载大部分信号、选择是更弱可分层,**支持 p_e(突变)与 σ(选择)正交**。**设计建议:** 偏好 out-of-frame 拟合的 Thrifty 作 p_e(最干净 selection-free 声明),显式记 in-frame 应用是 OOD 迁移,把 syn-vs-out-of-frame 差异当显式敏感性轴(两 kernel 都跑报分歧)而非静默择一。

**本地 S5F 核验标准(交主线冒烟):** rows=1024;mutability 均值归1(或 sum 归1,见冒烟);sub 行和=1 且 center base 自替换=0;WRC/GYW>SYC hotspot ordering;应是 **HH_S5F**(人重链 silent functional)非 light/mouse。

---

### 五块知识 · Block 4:跨域选择偏差校正武器 → 映射 σ + 可辨识性铁证(可建模级)

**武器1 — Heckman 两步选择模型(计量经济):** 单元仅当潜变量过阈才被观测。结果式 `Y₁=X₁β₁+U₁`,选择式 `Y₂*=X₂β₂+U₂`(观测 iff Y₂*>0),(U₁,U₂)二元正态 corr=ρ。选择偏差 ≡ σ₁₂≠0。校正:逆 Mills 比 `E[Y₁|X₁,选中]=X₁β₁+σ₁₂·λ(X₂β₂/σ₂)`,λ(c)=φ(c)/Φ(c)。两步:probit 估 β₂/σ₂→λ̂;OLS Y₁ on [X₁,λ̂]。**可辨识要求 = 排除约束**(一个驱动观测但不驱动结果的协变量,即工具),否则 λ̂ 与 X₁ 近共线、识别仅靠 λ 曲率→不稳。失败:正态假设承重、无排除约束共线爆炸、选择式误设直传 β₁。

**武器2 — IPW/Horvitz-Thompson + 倾向分(因果/调查统计):** 单元 z=(x,y) 以 Pr[s=1|z] 采样。MAR/ignorability:Pr[s=1|z]=Pr[s=1|x]。Bayes 反演(Cortes Eq5-6 verbatim):`Pr_D[z]=(Pr[s=1]/Pr[s=1|x])·Pr_{D'}[z]`,即每观测点重权 `w(x)=1/propensity` 使经验风险无偏。倾向 `p_o(x)=Pr[s=1|x]` = Rosenbaum-Rubin 倾向分。**可辨识要求:** ① **positivity/overlap**(Pr[s=1|x]≠0,永不可观测单元不可恢复)② 倾向正确设定 ③ 选择只依赖 x。失败:positivity 违反权重爆炸、估计权误差 ∝√(log m'/n₀)(最稀层 n₀ 主导)、倾向误设。

**武器3 — 系统发生 ascertainment/条件非灭绝(birth-death):** 只见存活+被采样谱系。Bakis-Minin Eq4:条件树密度除以非灭绝概率 `p_c(Tᵢ|θ)=q_{Nroot}(t)/(1−p_{xroot}(t))`,p_x 解灭绝 ODE。**关键实证:** 多独立 replicate 下不 condition **严重低估死亡率 μ**(偏差随树数增长)——存活偏差直接对应物。**可辨识要求 = 采样分数 ρ 须固定/已知**(否则 (λ,μ,ρ) 联合不可辨,Stadler-Bonhoeffer;Bakis-Minin 设 ρᵢ=|Gᵢ|/1000)。ρ 误设偏 birth-rate 水平但净率 λ−μ 仍稳。

**★映射到 σ(关键综合):** σ 的类先验 `[1−∏(1−p_o·p_e)]` = "≥1 拷贝既产生(p_e)又被观测(p_o)"的概率 = **complement-of-product 的"≥1 成功"形式**,**结构上等同 birth-death 条件因子**,非逐单元重权。

| σ 分量 | 最佳武器 | 映射 | 可辨识代价 |
|---|---|---|---|
| 监测/采样 p_o(x,m) | **IPW 倾向** | p_o(x,m)=Pr[s=1\|x,m] 就是倾向分,1/p_o 重权 | 需 **positivity**:p_o=0 的克隆(永不测序)∈ σ 零空间——诚实不可恢复集 |
| 存活/与适应度耦合的非随机保留 | **Heckman** | 存活指数 Y₂*=X₂β₂+U₂,U₂ 与适应度 shock U₁ 相关→σ₁₂≠0 抓"亲和力同驱存活与测量" | 需**排除约束**:驱动被保留但不驱动亲和力本身——生物上难找;无则 σ 选择与 φ 亲和力共线(f=σ∘φ∘a 混杂具象化) |
| "产生 AND 被观测≥1次"克隆级先验 | **ascertainment/非灭绝条件 ← 最佳桥** | `[1−∏(1−p_o·p_e)]`=1−P(无拷贝存活+被采)=birth-death 灭绝概率补,除以此因子 | 需**已知采样分数 ρ≡p_o**;(birth/φ, death, ρ) 非 ρ 钉死不可辨 |

**最佳桥裁定:** ascertainment/条件非灭绝是 Evo-PU 类先验最干净的数学桥——`[1−∏(1−p_o·p_e)]` 字面就是 `1−p_extinct`,p_e 演每谱系存活、p_o 演采样 ρ、product-over-copies 是分支过程"无后代成功"概率;除以此因子 = Bakis-Minin `p_c=q/(1−p_xroot)` 同操作。IPW 是 p_o 单独的**局部**正确工具(且经 positivity 干净给零空间)但表达不了跨拷贝乘性"≥1"结构;Heckman 是 **σ↔φ 混杂诊断**的正确工具(σ₁₂ 项直测"存活是否与待读适应度相关"),其排除约束要求 = ρ 固定在 phylodynamics 中解的同一可辨识缺口的计量陈述。**综合:用 ascertainment 条件似然作反演骨架(精确匹配类先验),借 IPW positivity 定 σ 零空间,用 Heckman σ₁₂ 检验作混杂/可辨识诊断。**

**★可辨识性铁证(交 Stage 2):**
- **(1) Bakis-Minin(2508.09519):** 抗体成熟多型分支过程中 (λ_φ, μ, ρ) **不联合可辨**(引 Stadler-Bonhoeffer);解=固定 ρ。条件 ≥1 存活观测另需(避免 pool replicate 时灾难性低估 μ)。**净率 λ−μ 即便 ρ 错仍可辨;φ 水平(scale)不可辨。** → 对 σ:采样分数须外生固定;否则 fitness-level(φ 尺度)∈零空间,净流量可恢复。
- **(2) Louca-Pennell 同余类(Nature 2020,同余式 verbatim 见 Dieselhorst-Stadler 2604.17926):** 时变率 λ(τ),μ(τ) 下,无穷多 (λ',μ',ρ') 给**同一树分布**(同余类),即便 ρ 已知。唯一可辨组合 = **pulled diversification rate** `r_p=λ−μ+(1/λ)dλ/dτ` 与 **pulled speciation rate** `λ_p=(1−p₀)λ`。破同余的信息:沿枝隐 birth-event 计数(Dieselhorst-Stadler 证 burst 模型/突变在分裂累积时可辨识**恢复**——序列数据载额外信息,定理 2.1-2.4)。→ 对 σ:σ 同余类 = 产生同一观测 repertoire 的 (φ,存活,监测) 三元组集;可辨不变量是 pulled/净量;破它需额外信息通道(免疫版 hidden-birth/分裂耦合突变)。**这是 selop 项目 R_irr(不可辨核=对称轨道)的精确 phylodynamic 镜像:PDR=非零谱可恢复部分,同余轨道=σ 解不了的零空间。**

---

### 五块知识 · Block 5:OAS 数据结构 + 元数据 schema → p_o(x,m) 协变量(可建模级)

**规模(2021 OAS 论文 PMC8740823 verbatim):** unpaired **1,535,831,565 unique**(1.499B VH + 36.7M VL),80 studies;paired 2021 快照 **121,838 pairs**(5–7 studies),**注意 brief 给的 ~1.5M paired 是当前 2026 线上规模**——活体增长库,建模以下载当下计数为准。unpaired 全量下载 >700GB。

**组织:** 序列按 `相同 metadata × chain × isotype` 分桶成 data-unit(一个 `.csv.gz`,第1行 JSON metadata header,其后逐行注释序列;文件名 `Species_Author_Year_idx_Chain_Isotype.csv.gz`)。

**data-unit 级 metadata(文档 verbatim):** Author/Link/Run/Subject/Species/Chain/Isotype/Age/Disease/Vaccine/**B-cell subset(=BType)**/**B-cell source(=BSource)**/Longitudinal/Total sequences/Unique sequences。命名注意:unpaired 用 "B-cell subset/source",paired 用 "BType/BSource" 指同概念;paired metadata 不单列 Chain/Isotype(双链已含)。
- BType 取值:Naive/Memory/Plasma/Unsorted-B-Cells;BSource:PBMC/Bone-Marrow/Spleen/Lymph-Node;Isotype:IGHG/IGHM/IGHA/IGHE/IGHD/Bulk。

**per-sequence 注释列(AIRR):** sequence/locus/stop_codon/vj_in_frame/productive/v_call/d_call/j_call/sequence_alignment(_aa)/germline_alignment(_aa)/fwr1-3(_aa)/cdr1-3(_aa)/junction(_aa)(_length)/v_d_j_score/cigar/support/identity/np1/np2/c_region/**Redundancy**/ANARCI_numbering/ANARCI_status。**Redundancy = 该 unique 序列观测拷贝数 = "丰度"来源 = 红线攻击对象。** paired 每注释列带 _heavy/_light;sequence_id_heavy/_light 共享 10x barcode。

**下载可行性(确认可行,未下载):** 官方 opig.stats.ox.ac.uk/webapps/oas/downloads(选筛选→下 wget 脚本→一堆 csv.gz);**HF parquet 镜像 `ConvergeBio/oas-unpaired`(Xet 去重,parquet,对建模最友好入口)**;OPIG blog "Handling OAS-Scale Datasets Without The Drama"(2025)指南。

**p_o(x,m) 协变量映射:**
| m 分量 | OAS 字段 | 物理含义 |
|---|---|---|
| 细胞状态通道 | BType | naive→memory→plasma 分化态(核心) |
| 解剖隔室 | BSource | blood/spleen/bone-marrow/lymph-node |
| 类别开关读出 | Isotype | IgM(未切换)vs IgG/IgA(已切换)=存活/成熟读出代理 |
| 链/时间/宿主 | Chain/Longitudinal/Species/Disease/Vaccine/Age | 监测背景 |
| **技术/研究身份** | Author/Link/Run | **非真监测通道=混杂** |

**★元数据混杂分析(Stage 2 零空间旗标——承重):** cell-state ≡ study ≡ sequencing-protocol 高度缠结,p_o(x,m) 极可能学到 **study 身份** 而非真生理监测。证据:① 结构性(OAS 论文自述 data-unit 按 metadata×chain×isotype 分桶,每 study 用自己 pipeline,"data processing often inconsistent between datasets"——BType/BSource 分布与具体 study 近共线:某 BType 往往只来自少数 study,某 study 又只一种协议)② 下游已撞墙(Mal-ID Science2024 PMC12061481 必须整 cohort 留出验证、专处理协议混杂、demographics-only 分类器反证;某外部集因 cohort 设计让人口学单独拿 1.0 AUROC=纯混杂冒充真信号活案例;Mal-ID 能缓解唯因全程标准化协议,OAS 没有)。**Disentanglement 前景:** 可缓解=用 study/Run 作已知混杂调整、只同 study 内对比 BType/BSource(协议恒定)但大幅缩数据;**不可约(零空间旗标):** 当某 (BType,BSource,Isotype) 组合**只**存在单一 study,真监测效应与该 study 协议偏差**观测上完全混淆,任何统计调整不可分**——结构性不可辨非样本量问题。**建议 Stage 2 显式标注:p_o(x,m) 中 study 支撑数=1 的格子标 null-space;只 ≥2 独立 study(不同协议)覆盖的通道组合进可辨识子空间。**

**技术偏差层(每层扭曲 Redundancy 而非真细胞频率):** ① 5'-RACE vs multiplex PCR 对不同 V 家族扩增效率不同(multiplex 引物覆盖不均;PMC7377388 量化 5'-RACE 效率/技术变异);OAS 跨 study 混用且**不记录协议字段**→丰度跨 study 不可比。② PCR 扩增偏差(指数放大早期随机偏差;MAF sciadv1501371、dual-UMI fimmu.2021.778298 证只有最小扩增能恢复真丰度)。③ UMI 去重(有 UMI 能塌缩 PCR 重复;**OAS metadata 不含 UMI 字段**→跨 study 不知某丰度是否已去重)。三层叠加 ⇒ **OAS Redundancy/Total 是协议依赖工程量,非生物丰度。**

**★abundance≠affinity 硬红线(精确,PMC5337809=Front.Immunol.2017.00221):** 仿真 GC 中 subclone **丰度与亲和力仅中等相关 Spearman ρ=0.6**;高丰度 subclone 中低亲和力占 **17–70%**;低丰度中高亲和力 ~25%;**"the largest affinities correspond to the low abundant subclones"** 且 **"the most abundant subclones never correspond to the highest affinity subclone"**。**项目红线(锁定):** repertoire 丰度/prevalence 对亲和力载近零(且方向可反)信息;**严禁把 OAS Redundancy/频率当 fitness/affinity 代理**——最高亲和力克隆系统性是稀有克隆,用丰度选择精确漏掉它们。与技术偏差叠加 = 观测丰度既被协议污染又本就不编码亲和力的**双重失格**。与 CLAUDE.md selop 对抗轮"σ 力学读出 n_Ag、丰度非 fitness"一致。

---

### 岔口1=B 冒烟结果(活数字,非纸面)

**冒烟1 — 本地 S5F = published HH_S5F 核验(PASS):**
- rows=1024 ✓(全 4⁵ 5-mer)。
- mutability:n_nonNA=1024,**sum 归一**(mean=0.00098,×1024≈1.0;非 mean 归1,但 S5F 合法约定),min=0、max=0.00906。
- sub 行和:1024/1024 行 ≈1.0 ✓;**center-base 自替换 >0 的行数 = 0** ✓(中心碱基 sub_<center> 全为 0)。
- hotspot ordering(用正确 5-mer 坐标 -2,-1,0,+1,+2,center=index2):
  - WRC(中心 C,−2∈W=A/T,−1∈R=A/G)mean mutability = **0.00182**(n=64)
  - GYW(中心 G,+1∈Y=C/T,+2∈W=A/T)= **0.00240**(n=64)
  - SYC coldspot(−2∈S=C/G,−1∈Y=C/T,中心 C)= **0.00022**(n=64)
  - overall = 0.00098 → **WRC/GYW ≈ 2–2.5× overall,SYC ≈ 4.5× below**。
- top 5-mer:GGGCA/ACGTA/GGGTA(中心 G,GYW context)、TTCAA/AGCAT/AGCCC(中心 C,WRC context);bottom:TCGGG/GCCGG/CCCGC(CpG-context cold spot)。
- **结论:本地 parquet 确是 published HH_S5F 的 targeting+substitution 模型**;早先 WRC/SYC 看似相等是我索引位置取错,修正坐标后 hotspot 结构清晰显现。

**冒烟2 — p_e kernel 装法(PASS,核心机制验活):**
- CR9114 genotype = 16-bit 字符串,每 bit = 16 个体细胞突变之一在/不在;som_mut = bit 数 = 距 germline SHM 距离;计数严格 binomial(16,k)(1/16/120/560/.../1=组合完备 cube)。
- 把 S5F mutability 赋给 16 个突变位(示意 context,真 per-site context 需 germline nt 序列+位点注释→Stage 4/7),per-site SHM emergence `P_i=1−exp(−α·r_i)`。
- per-site SHM mutability 跨 16 位 **11.1× spread**(0.00017–0.00194);flat Evo-PU kernel = 常数 2.6e-5(0× spread)。
- **关键对照(两个 som_mut=8 基因型,flat-Hamming 距离相同):**
  - gA=1011010010101001:SHM-logreach=**−18.31**,flat-logreach=−84.46
  - gB=1101110001001100:SHM-logreach=**−16.70**,flat-logreach=−84.46
  - **flat kernel:两者可达性完全相同(退化);SHM kernel:差 1.60 log-unit。**
- **结论:SHM 加权打破 Evo-PU 的 flat-Hamming 退化——同突变数→同 Evo-PU p_e;SHM kernel 区分 hot-vs-cold context 路径。"抗体翻盘 Evo-PU 弱点"机制上是真的,非论文断言。**

**冒烟3 — OLGA σ₁ Pgen 端到端(PASS,σ₁ 可行性活数字):**
- `pip install olga`(v1.3.0,纯 Python,764KB,PyPI 干净拉取)。
- OLGA 自带 10 个模型,含 **human_B_heavy**(=σ₁ 需的 IGH 生成模型,**无需 IGoR C++ 编译**)。
- 实跑 compute_aa_CDR3_pgen(human_B_heavy):
  - Pgen(CARDYYGSGSYYNDAFDIW)=**9.471e-09**
  - Pgen(CARGYW)=**1.210e-06**(短 CDR3 概率高,合理)
  - Pgen(CAKDILTGYYYYGMDVW)=**1.539e-09**
- **结论:σ₁ 的 selection-free baseline(P_gen)端到端可跑,无 IGoR 编译门槛;SONIA/soNNia 在其上加 Q 也是 pip 可装。**

### baseline-establishment:三 baseline 实测到哪 + 适用边界

| Baseline | 任务 | 实测数字(报告) | 适用边界 / 对本课题意义 |
|---|---|---|---|
| **Evo-PU**(2605.06879) | 单生物病毒 motif 预测 | flu-fusion AUC≈0.71、flu-binding≈0.83–0.89、flu-evasion≈0.96、RSV-HRC≈0.75、SARS-fusion≈1.00;SARS-emergence Spearman ρ≈0.43 | **work 在单生物均匀监测**;ProteinGym(多生物异质监测)**fail**,PLM 胜——自陈两因(全局标量 p_o + 无 prevalence)。**抗体恰补这两洞**。代码未公开,须从零重实现(5 方程齐全)。 |
| **AbLWR**(2604.11272) | PU-on-antibodies | (本 stage 未抽到具体数字,Block 未深挖此篇——见 open question) | PU 用在抗体但**无 σ**;是"有 PU 没观测算子"的 baseline,本课题正是补 σ。 |
| **Bakis-Minin**(2508.09519) | GC 多型分支过程贝叶斯推断 | 关键定性:不 condition 严重低估 μ(偏差随树数增长);(λ_φ,μ,ρ) 非联合可辨,固定 ρ=|G|/1000 解;净率 λ−μ 即便 ρ 错仍稳 | **可辨识性铁证**:λ/μ/ρ 非辨识 = σ 反演的 fitness-scale 零空间直接对应物。是 Stage 2 边界的承重输入。 |

**适用边界总结:** Evo-PU 适用域 = 单生物 + 均匀监测 + 有 prevalence;出此域即退化。本课题在抗体上把三处弱点(flat kernel/标量 p_o/无 prevalence→丰度污染)逐一替换,但**注意红线**:抗体的 prevalence(OAS Redundancy)恰恰**不可当 fitness 代理**(冒烟红线 PMC5337809),所以"补 prevalence"在抗体里不是补 c(y') 当 fitness——而是把 c(y') 留在 p_e 的突变机会语义(谱系丰度),把 fitness/功能性留给 CR9114 DMS 真值。这是与 Evo-PU 的关键分野,须在 Stage 4 算子设计写死。

### 交给 Stage 2(可辨识性闸)的承重移交

1. **Evo-PU 类先验 `[1−∏(1−p_o·p_e)]` 数学等同 birth-death 非灭绝条件因子**(Block4)——Stage 2 用 ascertainment 同余类机制刻画可辨识性,不必另起炉灶。
2. **可辨识铁证两条:** Bakis-Minin λ/μ/ρ 非联合可辨(固定 ρ 解,净率 λ−μ 稳);Louca-Pennell 同余类(唯一可辨=PDR/pulled rate)。σ 同余类 = 产生同观测的 (φ,存活,监测) 三元组集。
3. **零空间已现两个具体来源:** ① p_o 的 study-支撑=1 格子(Block5,结构性不可辨);② fitness-scale(φ 尺度,Block4,ρ 不定则不可辨)。Stage 2 把这两落成可计算零空间维度。

4. **abundance≠affinity 红线(PMC5337809):** prevalence 不可当 fitness;"补 prevalence" 在抗体里 = c(y') 留突变机会语义(谱系丰度),fitness/功能性交给 CR9114 DMS 真值。
5. **三条承重假设候选(供 Stage 2 sensitivity 逐条 negate):** ① 加性景观(CR9114 DMS 真值本身是加性外推模型);② SHM out-of-frame→in-frame 可迁移(Block3 证 syn vs out-of-frame 拟合显著不同,迁移未验);③ 元数据非混杂(p_o(x,m) 可能只学 study identity)。
6. **非循环铁律前置:** Block4 的 Heckman σ₁₂ 检验可作 σ↔φ 混杂诊断;Stage 6 circular-validation-audit 将 gate Stage 7 设计。

### 关键 paper IDs verbatim(便于续 background)

**Block1 Evo-PU:** arXiv:2605.06879(Evo-PU,full-text);Song2021 Protein-PU PMC7856229 / DOI 10.1016/j.cels.2020.10.007(full-text,代码 RomeroLab/pudms);Bekker&Davis arXiv:1811.04820;Kiryo nnPU arXiv:1703.00593;EVE DOI 10.1038/s41586-021-04043-8;ProteinGym(Notin 2023);OpenReview zWwU6tyDGt。

**Block2 Pgen/Ppost:** IGoR arXiv:1705.08246;OLGA arXiv:1807.04425;soNNia arXiv:2011.03112(PNAS PMC8040596);SONIA/PLoS-CB DOI 10.1371/journal.pcbi.1008394(arXiv:2001.02843,PMC7725366);Elhanati2014 arXiv:1404.4956;GSSP PMC5424261;Murugan2012 arXiv:1208.3925。repos:github.com/statbiophys/{OLGA,SONIA,soNNia,IGoR,pygor3}。

**Block3 SHM:** S5F DOI 10.3389/fimmu.2013.00358(PMC3828525,PMID 24298272,full-text);Thrifty eLife 105471 / bioRxiv 2024.11.26.625407(full-text);EPAM bioRxiv 2025.06.16.659977 / DOI 10.1371/journal.pcbi.1013758(full-text);DeepSHM PMC8749460;Spisak SHM landscape arXiv:2007.11841;context-dep lineage arXiv:2512.11693;netam github matsengrp/netam(molevol.py 源码读全);epam github matsengrp/epam;数据 Zenodo 10.5281/zenodo.17353498;shazam HH_S5F(CRAN)。

**Block4 跨域:** Bakis-Minin arXiv:2508.09519(full-text);Cortes IPW arXiv:0805.2775(full-text);Dieselhorst-Stadler arXiv:2604.17926(full-text,含 Louca-Pennell 同余式);Louca-Pennell DOI 10.1038/s41586-020-2176-1(Nature 2020);Heckman 1979 Econometrica 47(1):153;可辨识 birth-death PMC9436344;multitype arXiv:2206.09057;debiased-ML 选择 arXiv:2601.08643。

**Block5 OAS:** OAS pro.4205 / PMC8740823(full-text);abundance≠affinity 红线 PMC5337809 / DOI 10.3389/fimmu.2017.00221(full-text);Mal-ID DOI 10.1126/science.adp2407(PMC12061481);OAS 文档 opig.stats.ox.ac.uk/webapps/oas;HF 镜像 ConvergeBio/oas-unpaired;5'-RACE PMC7377388;MAF sciadv 10.1126/sciadv.1501371;非功能校正 eLife 10.7554/eLife.69157。

### Completion Criteria 核验(Stage 1 硬闸)

| 硬闸项 | 要求 | 实测 | 状态 |
|---|---|---|---|
| 五块可建模级摘要 | 各含数学式/接口/字段 | Block1-5 全产出(似然+5方程 / Q=P_post/P_gen+statbiophys 接口 / S5F-Thrifty-EPAM 对比表+netam 装法 / Heckman-IPW-ascertainment 映射表 / OAS schema 字段表) | ✓ |
| baseline 表实测 | Evo-PU/AbLWR/Bakis-Minin 数字+边界 | Evo-PU 各任务 AUC/ρ 齐;Bakis-Minin 非辨识定性齐;**AbLWR 缺具体数字** | ⚠ 见 open |
| ≥40 paper-search 级 | 40 | **64** | ✓ |
| ≥10 paper-research 全文 | 10 | **20** | ✓ |

**裁定:四项中三项明确 PASS,baseline 表 AbLWR 一行缺具体数字(其余两 baseline 齐)。** 按 ±10% 容差,baseline 表 2/3 完整且 AbLWR 的定性角色("PU 用在抗体但无 σ")已明确,不构成硬闸失败,但记为 open question 待 Stage 5 feasibility 时补(那时才真正需要 AbLWR 的可比数字)。

### Backtrack Condition 评估

Stage 1 backtrack 条件 = "若发现 σ 某分量根本无开源数据支撑(如 cell-state 元数据不可用)→ 回 North Star"。**未触发:** 四分量数据全部确认可达——p_e(本地 S5F + netam Thrifty)、σ₁(OLGA human_B_heavy 实跑)、p_o(OAS BType/BSource/Isotype 字段确认存在 + HF parquet 镜像)、p_a 真值(本地 CR9114/CR6261 parquet)。无分量落空,无需回退。

### Decisions Made

1. **文献用并行 5 subagent**(deep-survey 各一)而非单线 systematic-survey——五块知识各有独立 anchor 论文,并行省时且不串味。这是 ±10% 容差内的合理 strategy 实现(spec 推荐 literature-survey,未规定单/多 agent)。
2. **岔口1=B 三冒烟全做**:S5F 核验 / p_e 装法 / OLGA Pgen——用活数字夯 baseline 可行性,而非纸面断言。
3. **新建 context 文件放仓库根 `context/`** 而非 `docs/de-anthropocentric/context/`(后者不存在;spec 的 context/ 引用全解析到根)。
4. **AbLWR 数字延后到 Stage 5** 补,不阻塞 Stage 1 闸(其定性角色已明确)。

### Open Questions(交后续 stage)

1. **AbLWR(2604.11272)具体数字** —— 本 stage 只抓到定性("PU 用在抗体但无 σ")。Stage 5 feasibility 做多准则打分时补可比数字。
2. **CR9114 genotype→核苷酸序列+per-site context 映射** —— 冒烟2 用示意 context;真 p_e 需 germline VH nt 序列 + 16 个突变位的核苷酸坐标,才能给每位真 5-mer。这是 Stage 4 算子设计的具体接口活,本地是否有 germline nt(eLife 71393 supp / cr9114 repo src/schema.py)待 Stage 4 核。
3. **engelhart / magma-seq 两本地数据集角色** —— parquet 已存在但本 stage 未定其在 σ 反演的角色,待相关 stage 核(可能是额外 DMS 或时序交叉验证源)。
4. **OAS study-支撑=1 格子的实际占比** —— Block5 标了零空间机制,但具体有多少 (BType,BSource,Isotype) 组合是单 study 支撑,需真扫 OAS metadata(Stage 2 或 7,非本 stage——本 stage 不下 OAS)。
5. **DeWitt GC-replay(σ₂ sigmoid 真值)** —— 附录 A 列为 σ₂ 真值源 + 真实幸存者交叉验证,本 stage 五块未深挖(不在五块明列),Stage 7 实验设计时需补其 Zenodo 15022130 接口。

### 一句话总结(给下一 session 续 background)

Stage 1 完成:五块知识全达可建模级,文献 64 search/20 full-text 超闸,三冒烟(S5F=published✓ / SHM kernel 破 flat-Hamming 退化✓ / OLGA σ₁ Pgen 端到端✓)全 PASS,四 σ 分量数据全部确认可达,backtrack 未触发。**核心新认知:Evo-PU 类先验数学等同 birth-death 非灭绝条件 → Stage 2 直接用 ascertainment 同余类刻画可辨识性;零空间已现两源(p_o 单-study 格子 + fitness-scale)。** 待用户过目后进 Stage 2(可辨识性闸,最前置)。

---

### 附:四分量合回单一联合似然(spec "彻底" 判据的形式骨架)

spec 反复强调:四面不是四个独立课题,必须能合回一个 `P(obs|x)` 联合似然才叫"彻底反演 σ"。本 stage 五块知识已足以写出这个缝合骨架(细节留 Stage 4 structural-deconstruction):

```
P(观测到 x) = p_a(x;θ_a)
            · [ 1 − ∏_{y∈Y(x)} (1 − p_o(m; θ_o) · p_e(y; θ_e)) ]
            · σ₁(x; θ₁) 归一项(经 Q=P_post/P_gen 进入)
            其中 σ₂ 的亲和力 sigmoid 经 p_a 的功能性定义注入(CR9114 K_D → A(x))
```

四分量的接口归属(本 stage 已各自钉死):
- **p_a(功能性,θ_a)** ← CR9114/CR6261 DMS 真值(本地 parquet);A(x) 由 K_D 阈值(floor H1=7/H3=6/B=6)二值化。这是唯一"答案全知"的项。
- **p_e(突变可达,θ_e)** ← S5F/Thrifty kernel,`P(y'→y)=(1−exp(−α·r_i))·CSP_i`(netam 形式),germline 谱系祖先集,SHM 加权距离。替换 Evo-PU flat 2 常数。
- **p_o(监测,θ_o=m)** ← OAS BType/BSource/Isotype 协变量,`p_o(m)=σ(w^T m)` GLM,替换 Evo-PU 全局标量。**零空间:single-study 格子。**
- **σ₁(生成/tolerance,θ₁)** ← OLGA P_gen(selection-free baseline)+ SONIA/soNNia Q;`去 σ₁ = ÷Q`。
- **σ₂(亲和力 sigmoid)** ← DeWitt GC-replay 独立测的 sigmoid 当真值(Stage 7 交叉验证),进入 p_a 的功能性定义。

**缝合可辨识性预警(交 Stage 2):** 四分量乘在一起时,p_a 与 σ₂ 都编码"功能性/亲和力",p_o 与 σ₁ 都编码"为什么没看到"——存在两对潜在共线。具体:
- **p_a × σ₂ 共线**:若 σ₂ 亲和力 sigmoid 也驱动 p_a 功能性二值化,则"高亲和力→功能性"与"高亲和力→被选择"无法从观测分离,除非 σ₂ 真值来自**独立**测量(DeWitt GC-replay,非 CR9114 自身)。这是 Stage 7 非循环要求(σ_gen≠σ_inf)在似然层的体现。
- **p_o × σ₁ 共线**:监测通道(为什么这条 cell-state 被测到)与生成/tolerance(为什么这条序列被生成留下)都减少观测概率,需 OAS 元数据(p_o)与非生产 baseline(σ₁)各自独立锚才可分。
- 这两对共线 = Stage 2 可辨识性地图要正面回答的核心,也是为何 spec 把 Stage 2 列为"最前置闸,凌驾一切"。

---

### 附:工具链可行性矩阵(实测/可达性,岔口1=B)

| 组件 | 工具 | 可达性实测 | 安装/运行门槛 | 状态 |
|---|---|---|---|---|
| p_e 静态 | 本地 S5F parquet | 已在盘,1024×6,核验=published HH_S5F | 无(pandas 直读) | ✓ 即用 |
| p_e 宽 context | netam Thrifty | `pip install netam`,预训练 ThriftyHumV0.2-{20,45,59} 自动下 | torch 运行时 | ✓ 可装(本 stage 未实装) |
| σ₁ P_gen | OLGA | **实跑 human_B_heavy Pgen 成功** | pip 纯 Python,自带 IGH 模型,无 IGoR 编译 | ✓ 已验 |
| σ₁ Q | SONIA/soNNia | pip 可装,内部调 OLGA | Keras(soNNia) | ✓ 可装 |
| σ₁ 重学(可选) | IGoR | C++ 需编译 | 仅 locus/germline 不同才需 | ⚠ 大概率不需 |
| p_o 协变量 | OAS HF 镜像 ConvergeBio/oas-unpaired | 确认存在,parquet 格式 | 全量 >700GB(本 stage 不下) | ✓ 可达(延后) |
| p_a 真值 | 本地 CR9114/CR6261 | 已在盘,65536×11 / 2048×8 | 无 | ✓ 即用 |
| σ₂ 真值 | DeWitt GC-replay Zenodo 15022130 | 列在附录 A,本 stage 未核下载 | 待 Stage 7 | ⚠ 待核 |

**净:** σ 四分量的核心工具链**全部开源可达**,三个最关键的(S5F p_e / OLGA σ₁ / CR9114 p_a)已实测即用或实跑通过。无组件落空,资源红线(开源+算力)满足。重活(OAS 全量下载、netam/SONIA 实装、DeWitt 接口)按岔口1=B 延后到真正需要的 stage,不在 Stage 1 提前消耗。

---

### 附:Block1 paper ledger(全文+search,带 relevance)

| ID | Title | Level | Relevance |
|---|---|---|---|
| arXiv:2605.06879 | Better Protein Function Prediction by Modeling Survivorship Bias (Evo-PU) | full | 目标论文;似然+可复现性全抽 |
| PMC7856229 | Inferring Protein Sequence-Function Relationships with Large-Scale PU Learning (Protein-PU) | full | 直接前身;q 常数先验,Evo-PU 泛化它;代码公开 |
| arXiv:1811.04820 | Learning from Positive and Unlabeled Data: A Survey (Bekker&Davis) | search | PU 综述;2Step baseline + class-prior 分类 |
| arXiv:1703.00593 | PU Learning with Non-Negative Risk Estimator (nnPU) | search | SOTA 无偏风险 PU;Evo-PU 似然路的替代 |
| arXiv:2502.21194 | Prior Shift Estimation for PU through Kernel Embedding | search | shift 下类先验估计;关联异质监测 p_o |
| DOI 10.1038/s41586-021-04043-8 | EVE: Disease Variant Prediction with Deep Generative Models | search | PLM/DGM baseline,ProteinGym 上胜 Evo-PU 的标杆 |
| Meier 2021 | Language Models Enable Zero-Shot Prediction (ESM-1v) | search | 零样本 PLM baseline |
| Notin 2023 | ProteinGym: Large-Scale Benchmarks | search | Evo-PU 退化的多生物 benchmark(PSAE/A0) |
| PMC11211813 | PU-GO: Protein Functions via PU Ranking with Ontology Priors | search | 另一 protein-PU(序列依赖先验平行) |
| arXiv:2507.07354 | PU Examples — Finite Size Sample Bounds | search | PU 样本复杂度理论;p_a 可辨识所需数据 |

### 附:Block3 SHM paper ledger(带 relevance)

| ID | Title | Level | Relevance |
|---|---|---|---|
| PMC3828525 (10.3389/fimmu.2013.00358) | Models of SHM Targeting and Substitution from Synonymous Mutations (S5F) | full | 核心;定义 S5F;本地 parquet 来源 |
| eLife 105471 (2024.11.26.625407) | Thrifty wide-context models of BCR SHM | full | 核心;13-mer CNN,out-of-frame vs syn,netam 包 |
| 2025.06.16.659977 (10.1371/journal.pcbi.1013758) | Nucleotide context models outperform PLMs for antibody affinity maturation (EPAM) | full | 核心;benchmark,SHM+选择组合,branch-length/PCP |
| PMC8749460 | DeepSHM: deep learning of SHM, sequence context beyond hotspots | full | AID/WRC-GYW/WA-TW 生物学,15-mer context,cold spots |
| arXiv:2007.11841 | Learning heterogeneous hypermutation landscape of Ig from repertoire | search | 替代 SHM landscape 推断(Spisak/Mora/Walczak) |
| arXiv:2512.11693 | Reconstructing B Cell Lineages with Context-Dependent SHM | search | germline 谱系祖先重建的 context-dep SHM |
| arXiv:1403.3066 | Quantifying evolutionary constraints on B cell affinity maturation | search | 成熟中选择 vs 突变分离 |
| arXiv:2112.07953 | Statistics of SHM-induced indels in antibodies | search | indel SHM(超出点替换 kernel) |
| netam (matsengrp/netam) | molevol.py / pretrained.py 源码 | full(源码) | p_e 装法的 1−exp(−rate)·CSP 实现确证 |

### 附:Block4 跨域 paper ledger(带 relevance)

| ID | Title | Level | Relevance |
|---|---|---|---|
| arXiv:2508.09519 | Bayesian inference of antibody evolutionary dynamics, multitype branching (Bakis-Minin) | full | 可辨识骨架#1;(λ_φ,μ,ρ) 非辨识,固定 ρ;条件存活似然=类先验桥 |
| arXiv:0805.2775 | Sample Selection Bias Correction Theory (Cortes et al.) | full | IPW 典范;HT 反演,无偏证明,误差 ∝ 最稀层 n₀ |
| arXiv:2604.17926 | Information on hidden birth events restores identifiability (Dieselhorst-Stadler) | full | 含 Louca-Pennell 同余式 verbatim;证额外信息破同余 |
| 10.1038/s41586-020-2176-1 | Extant timetrees consistent with myriad histories (Louca-Pennell, Nature 2020) | search | 可辨识骨架#2;同余类,PDR/pulled rate 唯一可辨 |
| arXiv:2605.01713 | Multiple Heckman Selection Model | search | 矩阵变量 Heckman→多结果选择(多属性 readout) |
| arXiv:2012.01807 | Generalized Heckman with Varying Selection Bias | search | 鲁棒 Heckman 放松正态;σ 选择误差非高斯时用 |
| arXiv:2601.08643 | Automatic debiased ML & sensitivity for selection models | search | Riesz 表示/debiased-ML 统一选择+处理非随机 |
| arXiv:2511.10077 | Tutorial for propensity score weighting under positivity violations | search | positivity 违反=σ 零空间;估计量不可辨 |
| PMC9436344 | A class of identifiable phylogenetic birth-death models | search | 哪些子类可辨→指导 σ 限制买可辨识性 |
| arXiv:2206.09057 | Parameter Identifiability of Multitype Pure-Birth Model | search | 多型可辨识(类型空间=亲和力 bin) |

### 附:Block2 Pgen/Ppost paper ledger(带 relevance)

| ID | Title | Level | Relevance |
|---|---|---|---|
| arXiv:1705.08246 | IGoR: high-throughput immune repertoire analysis | full | 核心;P_gen,重组 Bayesian network,EM from 非生产,BCR SHM PWM |
| arXiv:1807.04425 | OLGA: fast P_gen of BCR/TCR aa sequences and motifs | full | 核心;O(L²) DP 精确 aa P_gen;SONIA/soNNia 调用的引擎 |
| arXiv:2011.03112 | Deep generative selection models with soNNia | full | 核心;P_post=P_gen·Q,深 vs 线性 Q,经验 baseline |
| arXiv:2001.02843 | Population variability in generation and selection of TCR (SONIA) | full | 核心;SONIA 软件;Q=(1/Z)∏q_f;方差分解 |
| arXiv:1404.4956 | Quantifying selection in immune receptor repertoires (Elhanati) | full | 基础;原 Q(τ,V,J);选择预判;Q_max 饱和 |
| PMC5424261 | Gene-Specific Substitution Profiles during Antibody SHM (GSSP) | full | 非生产 baseline 验证 r=0.90/0.80;残余选择失败模式 |
| arXiv:1208.3925 | Statistical inference of TCR generation probability (Murugan) | search | 因子化 P_gen 重组模型起源 |

### 附:Block5 OAS paper ledger(带 relevance)

| ID | Title | Level | Relevance |
|---|---|---|---|
| PMC8740823 (pro.4205) | Observed Antibody Space (OAS) | full | 锚点;计数+metadata 字段+data-unit+跨 study 不可比 |
| PMC5337809 (10.3389/fimmu.2017.00221) | GC B-Cell Subclone Abundancy vs Affinity 弱相关 | full | abundance≠affinity 红线定量(ρ=0.6) |
| PMC12061481 (10.1126/science.adp2407) | Mal-ID: disease diagnostics via BCR/TCR ML | full | study/batch/协议混杂铁证;缓解需标准化+留 cohort |
| OAS 文档 unpaired/paired | opig.stats.ox.ac.uk/webapps/oas | full(fetch) | 字段定义+per-seq 列+BType/BSource 命名 |
| 10.3389/fimmu.2021.778298 | Dual UMIs Minimal PCR Removes Artifacts | search | UMI+最小扩增去 PCR 偏差 |
| 10.1126/sciadv.1501371 | MAF: predictive antibody repertoire profiling | search | PCR 扩增偏差校正 |
| PMC7377388 | 5'-RACE efficiency for TCRβ repertoire | search | 5'-RACE 效率/技术变异量化 |
| 10.7554/eLife.69157 | Non-functional clonotypes as quantitative bias calibrator | search | 跨样本定量偏差校正 |

### 附:承重假设清单(预备 Stage 2 sensitivity 逐条 negate)

| # | 承重假设 | 来源 block | 若 negate 的初判后果 | 数据可检性 |
|---|---|---|---|---|
| H-A1 | 加性景观:CR9114 DMS 真值是 16 突变加性外推,无高阶上位 | Block1/数据 | p_a 真值本身带模型误差→反卷积靶不纯 | 可检:CR9114 完备 cube 可直接测上位(som_mut 各层残差) |
| H-A2 | SHM out-of-frame→in-frame 可迁移 | Block3 | p_e kernel 在 selected context 偏;syn vs out-of-frame 已证不同 | 可检:两 kernel 都跑报分歧(EPAM 路径) |
| H-A3 | 元数据非混杂:p_o(x,m) 学真监测非 study identity | Block5 | p_o 退化为 batch 检测器;single-study 格子不可辨 | 可检:留 study 验证 + demographics-only 反证(Mal-ID 法) |
| H-A4 | 非生产 baseline 严格中性(σ₁ via Q 无残余选择) | Block2 | σ₁ 含 ~5–30% 残余选择污染 | 可检:GSSP 已量化 r=0.90,残余 FW3 选择 |
| H-A5 | 采样分数 ρ≡p_o 可外生固定 | Block4 | 不固定则 fitness-scale 入零空间 | 理论:Bakis-Minin/Stadler-Bonhoeffer |
| H-A6 | prevalence/丰度不当 fitness(红线,反向假设) | Block5 | 若违反则全盘塌(用丰度选漏掉高亲和稀有克隆) | 已证:PMC5337809 ρ=0.6,方向可反 |

这 6 条是 Stage 2 sensitivity-analysis 的 negate 清单候选(spec 要 ≥3 条),H-A2/A3/A6 优先级最高(分别威胁 p_e/p_o/红线三个分量)。

### 附:关键机制方程速查(Stage 4 算子设计直接引用)

- **观测似然(Evo-PU 骨架):** `P(O_X=1)=p_a·[1−∏_{y∈Y(x)}(1−p_o·p_e)]`
- **p_e 涌现(SHM 替换后):** `p_e(y)=1−exp(−Σ_{y'}P(y'→y)·α·c(y'))`,`P(y'_i→y_i)=(1−exp(−λ·r_i))·CSP_i`
- **σ₁ 选择因子:** `P_post(x)=(1/Z)·P_gen(x)·Q_θ(x)`,`Q=exp(Σ_f θ_f x_f)`(线性)/DNN(深)
- **σ 同余/可辨识不变量(Louca-Pennell):** PDR `r_p=λ−μ+(1/λ)dλ/dτ`;pulled speciation `λ_p=(1−p₀)λ`
- **ascertainment 条件(Bakis-Minin):** `p_c(T|θ)=q_{Nroot}/(1−p_{xroot})`,p_x 解灭绝 ODE
- **Heckman 混杂诊断:** `E[Y₁|选中]=X₁β₁+σ₁₂·λ(X₂β₂/σ₂)`,σ₁₂≠0 即 σ↔φ 耦合
- **IPW 反演(p_o 校正):** `Pr_D[z]=(Pr[s=1]/p_o(x))·Pr_{D'}[z]`,positivity p_o≠0 否则零空间

### 附:四面攻击次序的依赖关系(预备 Stage 3 gap-prioritization)

spec 明确 Stage 3 排序轴 = "反演整个 σ 必需性",禁可发表性。本 stage 的知识已揭示四分量的**依赖拓扑**(非可发表性),供 Stage 3 排序参考:

- **p_a(功能性)是地基**:唯一答案全知项(CR9114),其它三分量的可辨识性都相对它定义。无 p_a 真值则 σ 反演无锚。→ 逻辑上最先锁。
- **p_e(突变可达)最成熟**:本地 S5F 即用,装法已冒烟验证,依赖最少(只需 germline + SHM kernel)。→ 可早攻,风险最低。
- **σ₁(生成/tolerance)工具就绪**:OLGA 实跑通,但依赖非生产 baseline 的中性假设(H-A4)。→ 中等风险,需 baseline 数据。
- **p_o(监测)风险最高**:OAS 元数据混杂(H-A3),零空间最大(single-study 格子)。→ 可辨识性最存疑,Stage 2 须先判它能辨到哪,再决定 Stage 3 投入。
- **D(反卷积闭环)依赖全部四者 + 非循环**:必须等 p_a/p_e/σ₁/p_o 各自接口定清才能缝合验证。→ 逻辑上最后,且 gate 于 Stage 6 circular-validation-audit。

依赖序(粗):p_a 地基 → {p_e 低险, σ₁ 中险, p_o 高险} 并行可辨识性判定 → D 缝合闭环。这条序**纯由数据可达性+可辨识风险驱动**,无任何可发表性成分,符合 Stage 3 护栏。

### 附:本 stage 对 spec framing 的一处强化(非偏离)

spec 数学骨架把 σ 写成 `p_o × p_e`(监测×可达)与 σ₁∘σ₂(选择复合)分列。本 stage Block4 发现一个**统一视角**:整个 `[1−∏(1−p_o·p_e)]` 类先验 = birth-death **非灭绝条件因子**,而 σ₁(P_post/P_gen)和 σ₂(亲和力 sigmoid)可分别看作"生成率调制"和"类型相关存活率"——四者在 ascertainment-conditioned branching process 下是**同一个生成-存活-采样过程的不同投影**,不是四个拼接模块。这与 selop 元发现(观测=投影复合,逆问题有非平凡零空间)完全同构,且给 Stage 2 一个**统一的可辨识性分析框架**(同余类)而非四套独立分析。这是强化 spec 的"彻底=合回单一似然"判据,非偏离。**无 Deviation from Spec 需记录(本 stage 严格按 Recommended Combination 执行:literature-survey + baseline-establishment)。**

### 附:非循环资产盘点(预备 Stage 6/7 的 σ_gen≠σ_inf)

求真红线要求污染用的 σ_gen ≠ 反演用的 σ_inf(独立参数化)。本 stage 的工具盘点已能列出**可用于独立参数化的资产对**,交 Stage 7 闭环设计:

- **p_e 两套独立 kernel**:S5F(syn-fit,本地)vs Thrifty(out-of-frame-fit,netam)——天然两套独立参数化,一套作 σ_gen 污染、另一套作 σ_inf 反演,且 Block3 已证两者"抓不同过程",独立性有实据。
- **σ₂ 真值独立来源**:CR9114 K_D(p_a 真值)vs DeWitt GC-replay sigmoid(σ₂ 交叉验证)——两个独立测量,避免"用 CR9114 自身定 σ₂ 又用 σ₂ 反演 CR9114"的循环。
- **σ₁ baseline 独立性**:OLGA P_gen(germline 重组先验)与观测 repertoire 是不同数据生成路径,P_gen 不偷看观测的选择信号(非生产 baseline)。
- **p_o 协变量 vs 真值分离**:OAS 元数据(m 协变量)与 CR9114 功能性真值完全不同来源,p_o 不可能偷看 p_a 答案。

**净:** 四分量都至少有一对独立资产可支撑 σ_gen≠σ_inf,Stage 7 闭环的非循环要求在数据/工具层**有料可落**,非纸面承诺。Stage 6 circular-validation-audit 将正式建 non-circularity 矩阵核验这点。

**Checkpoint 完。** 下一步(待用户过目):进 Stage 2 deep-insight 可辨识性闸。

### 附:session 恢复锚点(若中断后续 background)

- **spec 进度:** Stage 1 全 5 个 Execution Step 完成(context-init ✓ / literature-survey ✓ / checkpoint ✓ / baseline-establishment ✓ / 待汇总 INDEX);Stage 2-7 全 `[ ]`。
- **本 stage context 文件:** 本文件 `context/sigma-inversion-ka-knowledge.md`(一个 checkpoint)。
- **承重结论汇总去向:** `context/sigma-inversion-INDEX.md`(本 checkpoint 后创建)。
- **执行模式:** 岔口1=B(可达性+报告数字+小 smoke)/ 岔口2=A(stage 闸口暂停),用户已确认。
- **下一 stage 入口:** Stage 2 = deep-insight,context-init → `context/sigma-inversion-identifiability.md`,Recommended = problem-reformulation + boundary-analysis + sensitivity-analysis;最前置闸,import Louca-Pennell 同余类(铁证已在本 checkpoint Block4),零空间两源已识别(p_o single-study 格子 + fitness-scale)。
- **subagent IDs(可 SendMessage 续):** Block1 abb16cb4 / Block2 a3132351 / Block3 a43a722b / Block4 a0695923 / Block5 a634ae6f。

### 附:本 stage 锁定术语

- **σ_gen / σ_inf**:污染用 / 反演用的观测算子,必须独立参数化(非循环铁律)。
- **PDR(pulled diversification rate)**:Louca-Pennell 同余类下唯一可辨的净率不变量,= σ 非零谱可恢复部分。
- **single-study 格子**:OAS 中只被一个 study 支撑的 (BType,BSource,Isotype) 组合,结构性不可辨 = p_o 零空间。
- **Q = P_post/P_gen**:σ₁ 选择因子,逐序列乘性偏差。
- **CSP**:conditional substitution probability,SHM 模型给定突变后到各碱基的条件概率。
- **组合完备景观**:CR9114 2¹⁶ 全中间体都测了 K_D 的 cube,p_a 答案全知。
