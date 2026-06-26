# Stage 0 — 聚焦补充检索(knowledge-acquisition)

> Created: 2026-06-07 17:24
> Topic: 抗体选择算子学习 — 验证方案对抗式简化 / Stage 0 靶向补缺检索
> Phase: knowledge-acquisition (literature-survey + baseline-establishment)

## Plan Context

本 Stage 只为夯实两个不变量的弹药,不做泛泛综述:
- **I1 弹药**:为"验证非循环性"找现有范式——别人在无真值 reward/drift/势函数时,怎么验证"学到的算子"是对的(held-out 预测、独立测量对照、cross-condition 泛化)。目标 ≥3 个具体先例(论文 + 它们用什么独立信号验证)。
- **I2 弹药**:确认"已知扩散 SDE drift 估计的可辨识性定理"在离散序列空间的成立条件。对 3 条定理逐条产出"前提满足/不满足/需额外假设"判定表。
- **CR9114 可用性**:确认数据可访问性 + 矩阵维度(变体数 × 抗原数)+ 是否适合直接监督拟合,产出 1 段可用性结论。

## 背景定论(继承自 spec,不再质疑)

- 问题内核:SDE 反问题 `dX = ∇f(X,c)·dt + σ_SHM·dW`,σ 已知,f 未知。f = condition-dependent 能量场。
- 最接近范式:SDE drift estimation (known diffusion) × interventional identification × mean-field population dynamics × neural f。
- 用户核心批判(I1 靶心):手搓 f* 是循环论证,「算法能反推出我自己编的 f*」什么都不证明。
- 三不变量优先级:I1 验证非循环性(最高)> I2 可辨识性 > I3 条件依赖真新颖性。

## Stage 0 Completion Criteria(量化)

- [ ] I1:≥3 个非循环验证范式先例(论文 + 独立验证信号)
- [ ] I2:3 条可辨识性定理逐条判定表(前提满足/不满足/需额外假设)
- [ ] CR9114:可访问性 + 矩阵维度 + 直接监督拟合适配性,1 段结论

## Backtrack 警戒

if 3 个范式先例无一能迁移到本问题(全依赖本问题拿不到的真值)→ I1 可能无解早期警报,上报用户,暂停进 Stage 1。

---

## 检索进展(实时追加)

### I1 非循环验证范式 — 弹药(✅ 达标:找到 8 个先例,目标 ≥3)

> 派 general-purpose agent 检索。核心统一逻辑:**永不比对 f 真值(拿不到),而是比对 f 蕴含的、可被独立实验直接测量的下游可观测量。**

| 论文 | 学的未知量 | 独立验证信号 | 为何非循环 | 可迁移性 |
|---|---|---|---|---|
| Abbeel & Ng 2004 (ICML, 10.1145/1015330.1015430) | reward R(s) | 用恢复 R 重规划 policy,在真实环境比 feature expectation(非比 R 本身) | 不声称恢复真 R(IRL 本质 ill-posed);验证在行为层可观测结果 | 高(范式同构):用反推 ∇f 重模拟轨迹,比统计量 vs 真实谱系/DMS |
| Phillips 2021 (eLife 10.7554/eLife.71393) | seq→Kd landscape | CR9114(16突变)+CR6261 全组合库**直接实测 Kd** | 实测真值,非手搓 f* | 极高 = 本问题专属独立 Kd |
| Dailey 2025 (bioRxiv 10.1101/2025.11.03.686356, N. Wu lab) | germline vs somatic CR9114 对 H1/H3/B HA | 四组独立 DMS,跨抗原 affinity | 每抗原 DMS 独立测;可留一抗原验证 | 极高 = cross-condition 泛化(H1+H3学→预测B) |
| Talts 2018 SBC (arXiv:1804.06788) | posterior | rank 均匀性自洽检验 | **临界案例**:仅验算法忠于自己生成模型=「反推出自编 f*」的形式化 | 中:仅剔 bug,单用=I1陷阱 |
| Säilynoja 2025 Posterior SBC (arXiv:2502.03279) | posterior(含ODE) | 在真实数据条件下做 SBC | 仍自洽框架 | 中:需独立信号兜底 |
| Jiang & Wan 2024 PI-SDE (Bioinformatics 10.1093/bioinformatics/btae400) | SDE drift(Waddington ∇U) | **held-out 时间点**基因表达预测 | 真值=未训练的真实测量点 | 高(方法论同构:从轨迹学drift) |
| scDiffEq (Nat Mach Intell 2025, 10.1038/s42256-025-01150-3) | neural SDE drift+diffusion | held-out轨迹 + **in vitro→in vivo transfer** + in-silico CRISPR vs 真实扰动 | 独立体系/独立扰动真实结果,训练未见 | 高 = 最强非循环验证 |
| L-C2ST 2023 (NeurIPS arXiv:2306.03580) | SBI posterior 质量 | local classifier 2-sample test,显式不需真后验 | 面向无真值局部诊断 | 中:子区域可靠性诊断 |

**I1 结论(弹药充足,backtrack 不触发)**:本问题**不属于"全依赖拿不到的真值"那类**。存在三类训练不可见、非自生成的独立信号:(a) CR9114 独立 Kd 实测、(b) 留出抗原 cross-condition DMS、(c) 留出时间点/谱系节点真实轨迹。只要验证锚定这些湿实验可观测量,I1 非循环性可解。**警报仅在一种情况触发**:退化为「手搓 f*→模拟→反推→比对 f*」且不接任何独立信号(= 纯 SBC 自洽,确为循环,须立即否决)。→ SBC 类降级为"推断器 debug 工具(必要非充分)",举证责任压在 (a)(b)(c)。

### I2 可辨识性定理 — 弹药(✅ 达标:3 条定理逐条判定,全部核实真实)

> 三个 arXiv ID 全部核实真实存在且对题。

| 定理(出处) | 恢复什么 | 关键前提 | 我方满足? | 缺口 |
|---|---|---|---|---|
| **T1 gradient-flow SDE 联合可辨识** Guan 2025 arXiv:2505.21770 [核实] Thm4.2+Cor4.3 | 从时间边际联合恢复 −∇Ψ 与 σ²;充要=非平衡瞬态;≥3 边际即唯一 | ①连续ℝ^d FP ②σ=**标量常数** ③drift梯度形式 ④population边际(精确) ⑤非平衡瞬态 | ③④满足;①需额外假设(PLM连续化后FP须近似成立);②**不满足**(σ各向异性);⑤需核查 | σ常数是证明硬依赖;我方各向异性落定理外,须改用T2"σ已知"分支 |
| **T2 已知扩散⇒drift可辨识** Lavenant 2024 AnnAppProbab Thm2.1(Hashimoto 2016首证);估计配套 arXiv:2602.17830 [核实] | σ²**已知**⇒从连续边际唯一恢复−∇Ψ | Lavenant:①连续ℝ^d ②σ²**已知**良态非退化 ③**连续边际**(match) ④∇Ψ Lipschitz | ②σ已知=**我方核心优势**(S5F/EPAM给σ);③边际观测满足 | 可推广到已知 a(x)=σσᵀ 但需**一致椭圆性**;我方σ在PLM空间可能低秩/退化→椭圆性破→唯一性失效。须补 a(x) 非退化下界 |
| **T3 干预带来可辨识(CRL)** Varıcı 2024 NeurIPS arXiv:2406.05937 [核实] Thm1/2 | 从多干预环境恢复潜变量Z+潜DAG;hard→完美ID | ①潜→观测**线性**X=GZ ②干预签名矩阵满秩(足够多样环境) ③score差分非常数 ④加性噪声 | "换condition"↦干预:②部分满足(需多样条件张成);⑤多条件快照满足;①**不满足**(PLM非线性) | 线性混合假设G在PLM空间几乎不成立;给的是c-维度辨识,不直接保证f逐点恢复 |

**I2 结论 = AMBER(可推进,非自动绿灯)**:σ已知 + population边际把我们放进文献**最可辨识设定**(非结构性死局)。但两条最弱前提**无定理支撑、需自行论证或加假设**:①**跳跃过程→梯度流扩散的连续化合法性**(最弱红灯来源:无定理保证离散SHM点突变经PLM推前在表征空间真是Itô扩散且∇Ψ良态);②**σ在embedding空间的非退化/椭圆性**(突变算子稀疏低秩,推前后 a(x) 可能秩亏→唯一性失效)。另两个需核查开关:(a)瞬态条件(平衡态不可辨识,须确认观测在非平衡演化段);(b)有限样本/噪声(定理假设精确边际,计数张量稀疏侵蚀可达性)。→ **Stage 2 必盯的 I2 gating 假设 = ①②;若连续化无法论证为近似梯度流扩散或 a(x) 被证退化,I2 升级红灯。**

### CR9114 数据可用性 — (✅ 达标:可访问性+维度+拟合适配性结论就位)

> 后台 agent 卡死(输出 0 字节 26 分钟无进展),已停掉,改前台用 semantic-scholar + brave-search 直接核实。论文与数字全部确认。

**论文核实**:Phillips, Lawrence et al. 2021, *eLife* 10.7554/eLife.71393, PMC8476123, CC-BY, gold OA, 61 引。通讯 Michael Desai (Harvard OEB)。

**可用性结论(1 段)**:CR9114 数据**完全可用且完美对口**作为"直接测量的 f(seq,cond)"。① **可访问性**:eLife Source data 1/2/3 直接下载,CC-BY 许可,无需申请;Source data 1 = CR9114 library −logK_D to H1/H3/influenza B,Source data 2 = CR6261 −logK_D to H1/H9,Source data 3 = 选定变体的 isogenic flow cytometry −logK_D(正交验证)。② **矩阵维度**:CR9114 = **2¹⁶ = 65,536 变体 × 3 抗原(H1/H3/B)**;CR6261 = 2¹¹ = 2,048 × 2(H1/H9)。组合完备(combinatorially complete),覆盖 germline→somatic 全部 2^n 中间体。③ **测量量**:**−logK_D**(连续实值),用 Tite-Seq(酵母展示 + 深测序)测,有 Source data 3 的 isogenic flow cytometry 作正交对照。④ **条件依赖性确认**:论文核心发现就是 CR9114 呈 **nested/hierarchical** 跨抗原模式(同一变体在 H1/H3/B 上 −logK_D 实质不同,且需 nested 突变组合才获得对更远抗原的亲和力)——这正是我们 I3 条件依赖 claim 的真值锚点,**天然 condition-dependent landscape**。⑤ **直接监督拟合适配性**:规模(65k×3)适合直接拟合 seq→−logK_D 回归;已有 baseline(Phillips 原文的 pairwise + higher-order epistasis 交互模型;后续 Desai lab 多篇用此数据)。

**关键坑(直接监督拟合必须建模)**:**检测限 floor / 审查偏倚**——并非所有变体都有可测结合,大量弱结合变体的 −logK_D 低于检测限被截断(论文图1D/F 明确标注"可测结合变体数与百分比",随突变数下降而变化)。直接做朴素回归会在弱结合区被系统带偏。**须用截断/censored 回归(Tobit 类)或显式建模检测限**,否则 f 在弱结合区不可信。→ 这条进 Stage 1 部件清单,作为"CR9114 直接拟合(Spike0)"部件的承重假设之一。

**备选/补充条件维度**:

| 数据源 | 可补充的条件维度 | 状态 |
|---|---|---|
| CR6261(同论文 Source data 2) | 第二个独立抗体骨架(H1/H9),做 cross-antibody 泛化对照 | CC-BY 即用 |
| Dailey 2025 (bioRxiv 2025.11.03.686356, N. Wu lab) | germline vs somatic CR9114 对 H1/H3/B 四组独立 DMS,**额外的跨抗原 cross-condition 验证集** | 待核实托管位置 |
| Bloom RBD escape (jbloomlab) | SARS-CoV-2 escape,完全不同抗原系统,做方法跨系统 transfer | GitHub 公开 |
| Koenig VHH DMS (PNAS 2017) | VHH(纳米抗体)专属,贴近公司 camelid pipeline | 公开 |
| ProteinGym 抗体子集 | 通用 fitness 基准,标准化对照 | 公开 |

**Stage 0 Completion Criteria 复核**:
- [x] I1:8 个先例(≥3 达标)
- [x] I2:3 条定理逐条判定表(全核实真实)
- [x] CR9114:可访问性 + 维度(65536×3)+ 直接拟合适配性 + detection-floor 坑,1 段结论

---

## Checkpoint: Stage 0 靶向补缺检索完成(I1 弹药充足 / I2=AMBER / CR9114 完美对口)

### Objective(本 Stage 要解决什么)

Stage 0 是整份 spec 的弹药库阶段,目标极其聚焦:不做泛泛文献综述,只为后续对抗式简化循环(Stage 2)的三不变量预置"弹药"。三不变量按优先级:I1 验证非循环性(最高靠山)> I2 可辨识性 > I3 条件依赖真新颖性。Stage 0 只攻 I1 与 I2 两条(I3 的检验是 Stage 2/4 的事,不在本阶段补检索),外加一项工程前置:确认 CR9114 数据是否真能当"直接测量的 f(seq,cond)"用。

三条量化完成判据:(1) I1 弹药——至少 3 个非循环验证范式的具体先例(论文 + 它们用什么独立信号验证);(2) I2 弹药——对 3 条可辨识性定理逐条产出"前提满足/不满足/需额外假设"判定表;(3) CR9114——确认数据可访问性 + 矩阵维度(变体数×抗原数)+ 是否适合直接监督拟合,产出 1 段可用性结论。三条全部达标。

为什么这三块是"弹药"而非"结论":Stage 0 不下任何方法决策,它只是把 Stage 2 critic-defender-judge 对抗时 defender 能拿出来应战的证据、以及 critic 攻击 I2 时能引用的定理前提,提前备好。换言之,Stage 0 的产物是"对抗循环的初始证据库",不是验证方案本身。

### Process Summary(做了什么,含一次 agent 卡死与恢复)

第一步 context-init,创建本文件 `context/2026-06-07-17-24-ka-lit-survey-selop.md`,并新建 `context/INDEX.md`(此前不存在)。注意:context-management 仓库的 `scripts/timestamp.py` 在本地未落地,改用系统 `date "+%Y-%m-%d-%H-%M"` 取时间戳(2026-06-07-17-24),记为对 spec 的微偏差,不影响流程。

第二步识别出 Stage 0 有三条相互独立的检索线(I1 范式 / I2 定理 / CR9114 数据),按引擎 subagent-spawning 协议**并行派三个 general-purpose 研究 agent**,把重检索放到子上下文以保护主上下文。三个 agent 的任务卡分别为:
- Agent A(I1):为反问题的"验证非循环性"找现有范式先例,聚焦 inverse RL / system identification / SBI / 蛋白 fitness landscape 四个领域的"无真值验证"惯例,要求 ≥3 先例 + 判断是否触发 I1 无解警报。
- Agent B(I2):核查"已知扩散 SDE drift 估计 / gradient-flow SDE 唯一恢复"可辨识性定理,核实三个 arXiv ID(2505.21770 / 2602.17830 / 2406.05937)真伪,逐条对照我方问题(离散序列 PLM 连续化 / σ 各向异性已知 / population 快照观测)判前提满足性。
- Agent C(CR9114):核实 Phillips 2021 eLife 71393 的可访问性、矩阵维度、测量量、条件依赖性、直接拟合适配性 + 备选数据源。

第三步:Agent A 与 Agent B 在约 2 分钟内返回高质量结构化结果(各 ~10万 token 子上下文、4-10 次工具调用)。**Agent C 卡死**——输出文件 0 字节,最后写入停在 17:26,到 17:52 共 26 分钟零进展。用户提示怀疑卡住。诊断:输出 0 字节 = 无任何上下文值得接管,续接不如重启。`TaskStop` 停掉僵死 agent。

第四步:CR9114 改前台直接做(不再靠 agent 自由探索,缩小卡死面)。用 `mcp__semantic-scholar__paper` 查 DOI:10.7554/eLife.71393 拿到论文元数据(PMC8476123 / CC-BY / gold OA / 61 引 / 通讯 Desai),并确认核心数字(CR9114 16 突变、CR6261 11 突变、测平衡解离常数 Kd)。WebSearch 与 WebFetch(eLife 站)均遭网关 502(api.ikuncode.cc origin bad gateway,retryable),改用 `mcp__brave-search__brave_web_search`(独立服务,不经该网关)成功定位 eLife Source data 清单与抗原 panel。

第五步:三块结果全部落进本 context 文件的"检索进展"区,再做本 checkpoint。

### 工具与可靠性观察(供后续 Stage 参考)

- **subagent 并行有效但有卡死风险**:同批 3 个 agent,2 个 2 分钟返回、1 个 26 分钟僵死。判定僵死的可操作信号:输出文件 0 字节 + mtime 长时间不动。处置:`TaskStop` 后前台用确定性 MCP 工具(semantic-scholar / brave-search)替代,比续接 0 字节 agent 划算。
- **网关 502 集中在某些通道**:WebSearch 与 WebFetch(经 api.ikuncode.cc)报 502;semantic-scholar MCP 与 brave-search MCP 正常。后续遇 WebFetch/WebSearch 502 时,优先切 brave-search / alphaxiv / semantic-scholar 这些独立 MCP 通道。
- **alphaxiv answer_pdf_queries 对 PMC HTML 报错**:`Invalid file type: text/html`——它要的是 PDF URL(arxiv pdf / 特定 S3),不能直接喂 PMC 文章页。后续要查 PDF 用 arxiv pdf 链接或带 .pdf 的直链。

### I1 非循环验证范式 — 详细发现(弹药充足,警报不触发)

Agent A 返回 8 个先例(目标 ≥3,超额)。已制表落盘于上方"检索进展"区,此处补充每条的承重逻辑与为何能/不能迁移,作为 Stage 2 defender 的弹药卡。

核心统一逻辑(整个 I1 的灵魂,一句话):**永远不要去比对 f 的真值(拿不到),而是比对 f 所蕴含的、可被独立实验直接测量的下游可观测量。** 这一句直接消解用户的循环论证批判——批判说"反推出我自己编的 f* 什么都不证明",而该逻辑回答:对,所以我们根本不比对 f*,我们比对的是 f 蕴含的、湿实验独立测出的 Kd / 跨抗原方向 / 留出轨迹分布。

**逐条先例的承重逻辑(Stage 2 defender 弹药卡)**:

1. **Abbeel & Ng 2004(Apprenticeship Learning via IRL,ICML)**——这是 I1 的范式原型。IRL 学专家隐含的 reward R(s),但 IRL 本质 ill-posed:多个 R 能解释同一行为,所以从不声称恢复"真 R"。它的验证信号是**行为层面的 feature expectation 匹配**:用恢复的 R 重新跑 RL 得到 policy,在真实环境执行,比较 learner 与专家的 feature counts。为何非循环:验证信号(feature counts / task performance)由真实专家产生,方法训练时只见 demonstration 不见 R。迁移到本问题:我们同样无法拿到 f 真值,但可用反推的 ∇f 重新模拟演化轨迹,看其统计量(突变接受率、轨迹 feature 分布)是否匹配真实 CR9114 演化谱系/DMS 观测。**关键启示:把举证责任从"恢复 f"转移到"f 蕴含的下游行为"。** 这是整个 I1 解法的方法论母本。

2. **Phillips 2021(eLife 71393)**——本问题专属的独立真值来源。它直接实测 CR9114(16 突变)与 CR6261(11 突变)全组合库的 Kd,组合完备。这是实测真值,不是手搓 f*。迁移性极高:这正是用户认可的"CR9114 独立 Kd 测量"。可作 held-out ground-truth——在部分突变/部分抗原上学 f,在留出的突变组合或抗原上验证 ∇f 预测的相对 Kd 排序。它同时是 Stage 0 第三块(CR9114 可用性)的同一篇论文,身兼数据源与验证范式两职。

3. **Dailey 2025(bioRxiv 2025.11.03.686356,Nicholas Wu lab)**——cross-condition 泛化的直接支撑。它做了 germline vs somatic CR9114 对 H1/H3/B HA 的四组独立 DMS,同一突变在不同抗原上效应不同。每个抗原的 DMS 是独立测量,可做留一抗原验证:在 H1+H3 上学 f,预测 B HA 的 affinity 方向,真值由独立 DMS 提供、非自生成。这是文献公认最难被"循环"污染的验证类型,因为另一抗原的 DMS 方法训练时根本没见。注:托管位置待核实(bioRxiv,可能有配套 GitHub)。

4. **Talts 2018 SBC(Simulation-Based Calibration,arXiv:1804.06788)**——**临界案例,I1 陷阱的形式化版**。SBC 用 rank statistic 均匀性检验做自洽性检查:从 prior 抽 θ→模拟数据→推 posterior→检验 θ 的秩在 posterior 样本中是否均匀。它**不需要外部真值**,但**仅能查推断算法实现是否正确,不能证明模型对现实正确**。这恰恰对应用户担心的"反推出自己编的 f*"。结论:SBC 单独使用 = I1 循环陷阱的数学化身。用途降级为"剔除推断器 bug 的必要非充分工具",绝不能当作 f 学对了的证据。**这条是 critic 的弹药(攻击任何依赖自洽检验的方案),不是 defender 的弹药。**

5. **Säilynoja 2025 Posterior SBC(arXiv:2502.03279)**——SBC 的改进版,在观测到的真实数据条件下做校准而非仅 prior predictive。比原始 SBC 更贴近"对这批真实数据推断是否可信",但仍是自洽性框架,同样非充分,需独立信号兜底。与 Talts 同属"临界/降级"类。

6. **Jiang & Wan 2024 PI-SDE(physics-informed neural SDE,Bioinformatics)**——方法论同构度最高的先例之一。它从时序 scRNA-seq 学 SDE drift(Waddington 势能景观 ∇U),验证用 **held-out 时间点的基因表达预测**:训练时遮住某些时间点,验证 drift 能否预测被遮的中间分布。真值是未参与训练的真实测量点,非自生成。从轨迹学 drift = 从演化轨迹学 f,几乎一一对应。迁移:遮住某段成熟轨迹或某中间突变态,验证 ∇f 预测的轨迹分布匹配真观测。

7. **scDiffEq 2025(Nature Machine Intelligence,10.1038/s42256-025-01150-3)**——支撑最强的非循环验证。neural SDE 学 drift + diffusion,三重验证:(1) held-out 轨迹预测;(2) **transfer:in vitro 训练→预测 in vivo 小鼠**;(3) in-silico CRISPR 扰动 vs 真实扰动结果。验证信号是独立体系/独立扰动的真实结果,训练完全未见,无法被自生成真值污染。这条直接对应我们的两阶段策略——开源学 f → 公司数据 OOD,transfer 验证本身就是非循环性的最强形式。

8. **L-C2ST 2023(NeurIPS arXiv:2306.03580)**——无真值下的局部诊断技术。local classifier two-sample test,设计目标就是"无真后验时如何诊断局部可信度",显式不需要 true posterior 样本。用途:评估 ∇f 推断在特定条件子区域(如某个抗原、某段突变数)的可靠性。属辅助诊断,非主验证。

**I1 无解警报检查(backtrack 条件)**:spec Stage 0 的 backtrack 条件是"3 个范式先例无一能迁移(全依赖本问题拿不到的真值)→ I1 可能无解早期警报,上报用户"。检查结果:**不触发**。本问题存在三类方法训练时不可见、且非自生成的独立信号:(a) CR9114 独立 Kd 实测(Phillips 2021)、(b) 留出抗原 cross-condition DMS(Dailey 2025)、(c) 留出时间点/谱系节点真实演化轨迹(PI-SDE/scDiffEq 范式)。只要验证锚定这些湿实验可观测量,I1 非循环性可解。警报仅在一种情况触发:退化为"手搓 f*→模拟轨迹→反推→比对 f*"且不接任何独立信号——此时与纯 SBC 自洽检验同构,确为循环,须立即否决。**这正是用户要砍的老方案 Layer 1 的病灶**,Stage 2 的 R1/R2 攻击会直接打它。

### I2 可辨识性定理 — 详细发现(AMBER:可推进但有两条无定理支撑的 gating 假设)

Agent B 核实三个 arXiv ID **全部真实存在且对题**(此前对话记下的 ID 没有幻觉),并产出逐条判定表(已落盘上方)。此处补充三条定理的承重逻辑、我方落在哪个分支、以及为何最终判 AMBER。

**T1 — gradient-flow SDE 联合可辨识(Guan et al. 2025, arXiv:2505.21770, Thm 4.2 + Cor 4.3)**:这是最新最强的结果,从时间边际 {p(·,t)} **联合**恢复梯度流 drift −∇Ψ 与扩散 σ²,充要条件是观测处于非平衡(transient)态;Cor 4.3 给出 3 个不同边际即可从可数候选集 w.p.1 唯一确定 SDE。关键前提:①连续 ℝ^d 上弱意义 Fokker-Planck 成立;②σ = **标量常数**(各向同性 Brownian);③ drift 为梯度形式 −∇Ψ,Ψ 足够光滑;④观测为 population 边际且精确;⑤初值有限二阶矩 + 非平衡瞬态(平衡态不可辨识,Prop 4.1/Ex 3.2 证)。我方对照:③④满足(梯度流结构 = 我们的假设;population 快照正好匹配);①需额外假设(PLM 连续化后 FP 须近似成立);②**不满足**(我方 σ 各向异性、序列依赖,非常数标量);⑤需核查(成熟收敛仓室可能近平衡)。结论:σ 常数是 T1 证明的硬依赖,我方各向异性 σ 落在 T1 之外,**须改用 T2 的"σ 已知"分支**。但 T1 的价值在于:它证明了"联合恢复 f 与 σ"在非平衡下原则可行,而我们 σ 已知,问题只会更易不会更难。

**T2 — 已知扩散 ⇒ drift 可辨识(核心:Lavenant et al. 2024 Ann. Appl. Probab. Thm 2.1,Hashimoto 2016 首证;估计配套 arXiv:2602.17830)**:这是我方真正落入的分支。Lavenant 证明 σ² **已知**时,从连续边际唯一恢复 −∇Ψ(含时变 drift,单样本/密集测点足够)。前提:①连续 ℝ^d;②σ² 已知且良态(非退化);③观测 = 连续边际(match);④∇Ψ Lipschitz + 增长。我方对照:②σ 已知 = **我方核心优势**(S5F/EPAM 突变模型直接给出 σ 结构);③边际观测满足。关键缺口:Lavenant 的"σ 已知"可推广到**已知的状态依赖扩散矩阵 a(x)=σσᵀ**,但需 **一致椭圆性(非退化)**。我方 σ 在 PLM 空间可能低秩/退化(突变算子稀疏),椭圆性一旦破坏,唯一性论证(依赖非退化残差 FP 有唯一解)失效。须显式验证 a(x) 在表征流形切空间上有正下界。配套的 2602.17830(Tapia Costa et al. 2026,已核实)用 denoising-diffusion 估计 time-homogeneous drift,但它的观测形态是**高频多条轨迹**(我方是 population 快照,不匹配),且假设常数 σ(不匹配)——所以 2602.17830 是"同主题的估计方法参考",不是我方可直接套用的定理。

**T3 — 干预带来可辨识(CRL,Varıcı et al. 2024 NeurIPS, arXiv:2406.05937, Thm 1/2)**:从多个干预环境恢复潜在因果变量 Z 与潜 DAG,hard 干预→完美可辨识(至置换+尺度),soft→至祖先可辨识。前提:①潜→观测为**线性**变换 X=GZ;②干预签名矩阵满行秩(足够多样环境);③score 差分非常数;④加性噪声潜模型。我方对照:把"条件 c"映射为"干预环境",②部分满足(需足够多样的不同抗原/条件张成),⑤多条件快照满足;①**不满足**(PLM embedding↔潜因子是非线性混合,X=GZ 线性假设几乎不成立)。结论:T3 提供的是 **c 维度的辨识杠杆**(多条件如何带来可辨识性),不直接保证 f 的逐点恢复;线性混合假设是其软肋。对我们的意义:它支持"多条件 + 干预式介入"作为可辨识性的来源(对应 I3 条件依赖),但不能单独承担 f 的恢复保证。

**为何综合判 AMBER 而非绿灯**:两个特征其实是优势——(1) 观测形态:T1 与 Lavenant 的定理设定**恰好就是 population 时间边际**,我们的 (时间×条件×序列) 频率张量正是每个条件下的经验时间边际,匹配文献最成熟的观测类型;(2) σ 已知:文献可辨识性恰恰在 σ 已知时最强,S5F/EPAM 把我们放进有利分支。所以**不是结构性死局**。但两条最弱前提**无定理支撑、需自行论证或加假设**:
- **gating 假设 ① 连续化合法性(最弱,红灯候选)**:没有任何定理保证"离散 SHM 点突变 + 选择"这类**跳跃过程**经 PLM embedding 推前后,在表征空间真的是一个梯度流 Itô 扩散且 ∇Ψ 满足 Lipschitz+线性增长。所有三条定理的椭圆 PDE / FP / score 机制都建立在"表征空间动力学确为 Itô 扩散"之上——这是未经证明的建模近似,是 I2 真正的红灯来源。
- **gating 假设 ② σ 在 embedding 空间的非退化/椭圆性**:突变算子在序列空间稀疏、低秩,推前到 PLM 空间后 a(x)=σσᵀ 很可能秩亏/退化。一致椭圆性破坏 → T2 推广分支唯一性失效。须显式验证 a(x) 有正下界。

两个需核查的开关(非红灯但能致命):(a) 瞬态条件——平衡态不可辨识,须确认观测落在非平衡演化段(亲和力成熟收敛后近稳态则 drift 与扩散在快照中不可分离);(b) 有限样本/噪声——定理假设精确边际,计数张量稀疏与噪声侵蚀可辨识性的实际可达性(作者明确把有限样本渐近列为 open problem)。

**对 Stage 2 的交接**:I2 标为 AMBER,可推进但把 gating 假设 ①② 作为 Stage 2 必须先证/盯死的前提。若 Stage 2 中无法论证连续化为近似梯度流扩散、或 a(x) 被证退化,I2 升级红灯 → 触发可辨识性维度(R3)的强制重做。这给了 Stage 2 critic 攻击 I2 时的精确靶点:不要泛泛质疑"能不能辨识",而是直接质问"你的 PLM 连续化凭什么是 Itô 扩散""你的 a(x) 椭圆性下界是多少"。

### CR9114 数据 — 详细发现(完美对口,但有一个必须建模的检测限坑)

CR9114 数据集是本验证方案的"独立真值"地基,Stage 0 必须把它的形态摸清,否则 Stage 2 砍仿真器后(R2 攻击"能否直接监督拟合彻底不要仿真器")会落空。核查结论:**完全可用且形态完美对口**,但有一个工程坑(检测限审查偏倚)必须在拟合时建模。

**论文与可访问性**:Phillips, Lawrence et al. 2021, eLife 10.7554/eLife.71393, PMC8476123, CC-BY 许可, gold open access, 61 引, 通讯 Michael M. Desai(Harvard OEB)。数据托管在 eLife 正文的 Source data 附件,直接下载,无需申请或签 DUA:
- Source data 1 = CR9114 library 的 −logK_D to H1, H3, influenza B(主数据,65536 变体 × 3 抗原)
- Source data 2 = CR6261 library 的 −logK_D to H1, H9(姊妹数据,2048 变体 × 2 抗原)
- Source data 3 = 选定变体的 isogenic flow cytometry −logK_D(正交验证,可用于校准 Tite-Seq 测量噪声)
此外还有 interaction model coefficients 的 source data(Phillips 原文拟合的 pairwise + higher-order epistasis 模型系数),可作为 baseline 对照。

**矩阵维度(精确)**:CR9114 = 2^16 = **65,536 变体 × 3 抗原(H1/H3/B)**,组合完备——覆盖从 germline(全 0)到 somatic(全 1)的所有 2^16 中间体,这意味着任意两个突变组合之间的所有演化路径都有真值,极利于"留出某条路径/某些组合做 held-out"。CR6261 = 2^11 = 2,048 × 2(H1/H9)。两个抗体合起来给了"两个独立骨架"的对照,可做 cross-antibody 泛化(在 CR9114 上学的 f 形式,迁移到 CR6261 看是否仍 work)。

**测量量**:−logK_D(平衡解离常数的负对数,连续实值,越大结合越强),用 Tite-Seq(酵母表面展示 + 梯度抗原浓度 + 深度测序反推 Kd)测得。这是连续回归目标,直接适配 seq→scalar 的监督拟合。Source data 3 的 isogenic flow cytometry 提供同量纲的正交测量,可估计 Tite-Seq 的测量噪声尺度(对设定 loss 的观测噪声项有用)。

**条件依赖性(I3 真值锚点)**:论文核心发现就是 CR9114 呈 nested/hierarchical 跨抗原模式——同一变体在 H1/H3/B 上的 −logK_D 实质不同,且对更远抗原(B)的亲和力需要 nested 的突变组合才解锁(higher-order epistasis,且 epistasis 结构跨抗原不同)。CR6261 则呈现"对多抗原同时中等亲和"的非 nested 模式。这正是我们 f(seq,cond) 中"cond"轴的真值:换抗原 → f 随之实质改变。**这给 I3(打乱条件标签性能应下降)提供了天然的真值检验场:在 CR9114 三抗原上学 f,打乱抗原标签重训,若性能不掉 = f 没用上条件 = 假阳性。**

**直接监督拟合适配性 + baseline**:规模(65k×3 ≈ 20 万个标量观测)对现代序列模型(我方架构偏好:Transformer/Mamba/Diffusion,graph 作 attention bias)是小数据,可直接拟合且不易过拟合到无意义。已有 baseline 丰富:Phillips 原文的 pairwise + higher-order epistasis 线性交互模型(有 source data 系数可复现);后续 Desai lab(Moulana 等)与 Wu lab(Dailey 2025)多篇用同一或同类数据。这意味着我们拟合 f 后有现成的"地形精度"对照标尺。

**关键坑——检测限 floor / 审查偏倚(must model)**:并非所有变体都有可测结合。大量弱结合变体的 −logK_D 低于 Tite-Seq 检测限,被 floor 到一个下限值(论文图 1D/F 明确给出"可测结合变体数与百分比",且该比例随 somatic 突变数下降而下降——突变少的变体多数测不到结合)。后果:若做朴素回归,模型会把大批被 floor 的弱结合变体当成"恰好等于 floor 值"的真实测量,在弱结合区被系统性带偏,低估梯度、抹平地形。**正确处理:截断/censored 回归(Tobit 类),或在 loss 里把"低于检测限"建模为左截断(只约束 f < floor,不约束等于 floor)。** 这条直接进 Stage 1 部件清单,作为"CR9114 直接拟合(Spike0)"部件的一条承重假设——如果 Spike0 不建模检测限,它在弱结合区的 f 不可信,会连累 I1(用 Kd 做独立验证时,弱结合区的对照失真)。

**备选/补充数据源(已制表落盘)**:CR6261(第二骨架,即用)、Dailey 2025(额外跨抗原 DMS,托管待核实)、Bloom RBD escape(跨系统 transfer)、Koenig VHH DMS(贴近公司 camelid pipeline)、ProteinGym 抗体子集(标准化基准)。这些是 Stage 2 若需要扩展条件维度时的弹药储备,当前不动用。

### Decisions Made(本 Stage 做的决策及理由)

1. **三检索线并行派 agent**:理由——三线独立、各自重检索,并行省时且保护主上下文。事后看 2/3 成功,1 个卡死,整体仍划算(总壁钟约 2 分钟拿到 2 块,前台补第 3 块约 5 分钟)。
2. **CR9114 agent 卡死后不续接、改前台**:理由——输出 0 字节意味着无上下文可接管,续接成本 > 重做;前台用确定性 MCP(semantic-scholar + brave-search)比再派一个可能再卡的 agent 稳。
3. **SBC 类范式降级为"debug 工具(必要非充分)"**:理由——它们是用户循环论证批判的数学化身,若当作 f 学对了的证据就是自欺。这条决策直接写进 I1 弹药,作为 Stage 2 critic 攻击任何自洽型验证的标准武器。
4. **I2 判 AMBER 而非绿灯**:理由——σ已知+population边际把我们放进文献最可辨识设定(非死局),但连续化合法性与 a(x) 椭圆性两条前提无定理支撑。如实标 AMBER,把举证责任明确交给 Stage 2,不在 Stage 0 强行下绿灯结论(那本身就是一种"用结论制造虚假信心",违背 spec 精神)。
5. **检测限坑提前进部件清单**:理由——它是 Spike0(零仿真器直接拟合)能否成立的承重假设之一,Stage 1 装载时必须标注,否则 Stage 2 砍仿真器后会在弱结合区暴雷。

### Deviation from Spec(微偏差记录)

- **Stage**: 0
- **Prescribed**: context-init 用 `python scripts/timestamp.py` 取时间戳;CR9114 用 baseline-establishment 子流程(暗示可派 agent)。
- **Actual**: 用系统 `date` 取时间戳(脚本未落地);CR9114 agent 卡死后改前台 MCP 工具直接核查。
- **Rationale**: 脚本不存在;agent 僵死 0 字节,前台确定性工具更可靠。两处均不改变 Stage 0 的产物与判据达成,属 ±10% 内自主调整。

### Open Questions(交接给后续 Stage 的未决线索)

1. **Dailey 2025 数据托管位置待核实**——它是 cross-condition 泛化验证(留一抗原)的关键补充集,Stage 4 实验设计若要用它,需先确认 bioRxiv 配套数据/GitHub 是否公开可下。
2. **PLM 连续化是否近似梯度流 Itô 扩散(I2 gating ①)**——Stage 0 无法解决,是 Stage 2 R3(可辨识性)的核心攻防点。可能需要:在表征空间检验轨迹增量的统计性质(是否近高斯、漂移是否梯度场),或退一步用"不要求严格梯度流、只要求 drift 可估"的弱化目标。
3. **a(x) 在 embedding 空间的椭圆性下界(I2 gating ②)**——需实测:把 S5F/EPAM 的 σ 推前到 PLM 空间,看协方差矩阵最小特征值。若接近 0,可辨识性实际不可达,需换表征或加正则。
4. **观测是否处于非平衡瞬态**——CR9114 是终点 DMS 快照(不是时序),本身无"瞬态"问题(它直接给地形真值);但若 Stage 2 保留任何"从演化轨迹学 f"的成分(玩具SDE 或真实 phage panning),需确认那批轨迹数据落在非平衡段。
5. **检测限 floor 的具体数值与各抗原比例**——落盘了"存在"但未取精确数字(图 1D/F 的具体百分比)。Stage 4 操作化 Spike0 的 censored loss 时需回查 eLife Source data 取 floor 阈值。

### Stage 0 → Stage 1 交接清单(供 LOOP SETUP 直接取用)

Stage 1 要把 v0 拆成部件并标注(承重假设, 工程成本)。Stage 0 已为以下部件预置了弹药/警示:
- **逼真仿真器(IGoR→EPAM→DIMSIM/SLiM)**:I1 警报指出"手搓 f*→模拟→反推→比对 f*"是循环陷阱核心 → 该部件承重假设极度可疑,R2 首攻目标。
- **手搓 f* 族**:同上,I1 直接判其为循环论证病灶。
- **CR9114 直接拟合(Spike0)**:承重假设 = (a) 数据可访问 ✅、(b) 条件依赖真值存在 ✅、(c) 检测限须建模 ⚠️(新增承重假设)。工程成本低(几天)。
- **可辨识性检验(玩具SDE / SVD 条件秩诊断)**:I2 给出精确攻防靶点(连续化 + 椭圆性),R3 用。
- **打乱条件标签对照**:I3 落地,CR9114 三抗原是天然检验场。
- **独立 Kd 对照(零泄漏检查)**:I1 主弹药,Phillips/Dailey 提供非循环真值。

本 checkpoint 至此覆盖 Stage 0 全部 process + results,三条完成判据达标,backtrack 不触发,可进 Stage 1。

### Stage 2 攻击 Playbook(Stage 0 弹药 → R1-R5 预编排,供 LOOP 直接取用)

下面把 Stage 0 的弹药预先编排进种子攻击队列的五个维度。每个维度给出:critic 的攻击向量、defender 能拿出的弹药、judge 红绿的判据、以及该维度连到哪条不变量。这是 Stage 2 每轮 2a(multiagent-debate)的开局剧本,避免每轮从零起手。

**R1 — 非循环性(I1,最高优先级,先打)**

critic 攻击向量:逐一指控 v0 每个验证关"其真值从哪来";凡真值是"自己手搓/自己仿真生成"的,判循环。重点打老方案 Layer 1(白盒仿真器 + 手搓 f*):"你证明算法能反推出你藏的 f*,可 f* 是你编的,这对真实选择算子的恢复零证据力。"

defender 弹药:(1) 援引 Abbeel-Ng 范式——我们不比对 f 真值,只比对 f 蕴含的下游可观测量;(2) 三类独立真值信号在手:CR9114 独立 Kd(Phillips 2021)、留出抗原 cross-condition(Dailey 2025)、留出轨迹分布(PI-SDE/scDiffEq 范式);(3) 主动承认 SBC 类自洽检验非充分,已降级为 debug 工具,举证责任全压在湿实验独立信号上。

judge 判据:绿 = 方案至少有一条验证关的真值来自"方法训练未见 + 非自生成"的湿实验测量(CR9114/Dailey 满足);红 = 方案所有验证关的真值都可追溯到自己的仿真器/手搓 f*。注意:I1 红灯触发该轮强制重做 2c(自主,不需用户确认)。

**R2 — 仿真器必要性(关键简化点)**

critic 攻击向量(这里 critic 站在"简化"一方,攻击"仿真器存在的必要性"):CR9114 本身就是直接测量的 f(seq,cond),65536×3 组合完备真值地形已在手,为什么还需要 IGoR→EPAM→DIMSIM/SLiM 这套逼真仿真器?Spike0 直接在 CR9114 上监督拟合 f,零仿真器,几天出结果,能否彻底砍掉仿真器?

defender 弹药(仿真器那边的抢救论证,2d resurrection):仿真器提供 CR9114 没有的东西——(a) 轴 T 时序动力学(CR9114 是终点快照,无演化轨迹);(b) 已知 σ 下的"轨迹→反推 f"可辨识性测试场(CR9114 不能测"从轨迹能否反推",它直接给地形)。问题是:这些东西是不是"方法成立"必需,还是"部署/野心"才需要?

judge 判据:绿(可砍仿真器)= Spike0 在 CR9114 上能验证"函数类能表示真实条件依赖地形"且这就是方法核心 claim 的充分证据;红(仿真器承重)= 方法核心 claim 必须依赖"从时序轨迹反推 f"的能力,而该能力只有仿真器能在已知真值下检验。预判:逼真仿真器大概率被砍(野心件),但"玩具 SDE 可辨识性测试"可能在 R3 被复活(见下)。

**R3 — 可辨识性(I2,AMBER,若必须有合成步则在此定胜负)**

critic 攻击向量:用 Stage 0 的精确靶点打——"你的 PLM 连续化凭什么是 Itô 梯度流扩散?有定理吗?"(gating ①);"你把 S5F/EPAM 的 σ 推前到 PLM 空间,a(x)=σσᵀ 的最小特征值是多少?椭圆性下界证明在哪?"(gating ②);"你的观测落在非平衡瞬态吗?成熟收敛后近稳态则 drift/diffusion 不可分离。"

defender 弹药:(1) σ 已知 + population 边际 = 文献最可辨识设定(Lavenant T2 分支);(2) T1 证明非平衡下联合恢复 f 与 σ 可行,我们 σ 已知只会更易;(3) 若严格梯度流无法论证,可弱化为"只要求 drift 可估、不要求严格势函数"。

judge 判据:绿 = gating ①② 至少有可操作的检验/弱化路径(如表征空间轨迹增量统计检验 + a(x) 特征值实测 + 弱化目标);红 = 两条 gating 均无解且方案强依赖严格梯度流唯一恢复。这里很可能催生一个被复活的部件:"玩具 SDE 可辨识性 sanity check"——不是为了逼真,而是为了在已知 σ + 已知简单 f 的最小设定下,确认"反推 f"这个动作在本数据形态下数学上能 work。这是 necessity-sufficiency 判 load-bearing 的典型对象。

**R4 — 条件依赖真新颖性(I3)**

critic 攻击向量:打乱 cond(抗原)标签重训,如果性能不掉,f(seq,cond) 就退化成 f(seq),所谓"条件依赖创新"是装饰。

defender 弹药:CR9114 三抗原(H1/H3/B)是天然检验场——论文已证 nested/hierarchical 跨抗原模式(同序列换抗原 Kd 实质变,且 higher-order epistasis 跨抗原不同)。打乱抗原标签必然破坏这个结构,性能必掉。这是 I3 最干净的真值检验。

judge 判据:绿 = 存在可执行的"打乱条件标签对照"且预期性能显著下降(CR9114 满足);红 = 数据的条件有效秩太低或打乱无差异。注:spec 要求 Stage 4 至少设计 1 个打乱条件标签对照,这里 R4 给它预置了真值场。

**R5 — OOD→公司数据迁移(部署,非方法成立,排最后)**

critic 攻击向量:开源验证通过不等于公司 camelid 数据上 work。

defender 弹药:scDiffEq 的 in vitro→in vivo transfer 范式证明"transfer 验证本身是非循环性的最强形式";Koenig VHH DMS 贴近公司 pipeline 可作中间踏板。

judge 判据:绿 = 方案为 transfer 留了明确接口(轴 T 体内时序 / 跨 campaign 泛化)且承认这是入职后的事;红 = 方案把公司数据当方法成立的前提。注:R5 关乎部署不关乎方法成立,排最后,不应阻塞 saturation。

### 风险登记册(Stage 0 视角,带优先级)

| 风险 | 关联不变量 | 严重度 | 当前状态 | 处置时点 |
|---|---|---|---|---|
| PLM 连续化非 Itô 梯度流 | I2 gating① | 高 | 无定理支撑 | Stage 2 R3 |
| a(x) 在 embedding 退化/非椭圆 | I2 gating② | 高 | 需实测特征值 | Stage 2 R3 |
| CR9114 检测限 floor 带偏弱结合区 | I1(独立验证失真) | 中 | 已知须 censored 回归 | Stage 1 标注 / Stage 4 操作化 |
| 退化为 SBC 式自洽验证 | I1 | 高(致命) | 已识别,SBC 降级 | Stage 2 R1 每轮查 |
| 观测非瞬态(若保留轨迹成分) | I2 | 中 | CR9114 快照无此问题;轨迹成分有 | Stage 2 R3 |
| Dailey 2025 数据托管未核实 | I1 补充集 | 低 | 待核实 | Stage 4 前 |
| 条件有效秩太低 | I3 | 中 | CR9114 三抗原预期足够 | Stage 2 R4 |

### 下一步精确动作(Stage 1 LOOP SETUP 开场清单)

1. context-init: `context/loop-setup-antibody-selop.md`(或带时间戳变体)。
2. assumption-audit 拆解 v0 全部部件,逐个标(承重假设, 工程成本)。v0 = 老三层方案(2026-06-07-3layers-plan.md)+ 候选精简脊柱(northstar-and-loop-design.md)。
3. 把本 checkpoint 末尾"Stage 0→Stage 1 交接清单"的六个部件预标注直接搬入。
4. 固化种子队列 R1-R5,每项挂上本 Playbook 对应弹药。
5. 产出初始 state ledger:版本 v0、待攻击队列、三不变量初始状态(I1 已大幅夯实/I2 AMBER/I3 未验)。
6. context-checkpoint + 中文汇报。

至此 Stage 0 checkpoint 完成。

### 已核实文献条目(下游可直接引用,含核实状态)

以下为 Stage 0 三条检索线确认的全部文献,标注核实状态(✅=元数据已确认 / ⚠️=待核实托管或细节)。Stage 2-4 引用时直接取此处,不重新检索。

- ✅ Abbeel, P. & Ng, A. Y. (2004). *Apprenticeship Learning via Inverse Reinforcement Learning.* ICML. DOI 10.1145/1015330.1015430. 用途:I1 范式母本(行为级 feature-expectation 验证,不比对 reward 真值)。
- ✅ Phillips, A. M., Lawrence, K. R., Moulana, A., Dupic, T., ... Desai, M. M. (2021). *Binding affinity landscapes constrain the evolution of broadly neutralizing anti-influenza antibodies.* eLife 10:e71393. DOI 10.7554/eLife.71393. PMC8476123. CC-BY, gold OA. 用途:I1 独立真值 + Stage 0 CR9114 数据源(65536×3 −logK_D,组合完备)。
- ⚠️ Dailey, ... Wu, N. C. (2025). *Vulnerability in the breadth evolution of an influenza broadly neutralizing antibody.* bioRxiv 2025.11.03.686356. 用途:cross-condition 泛化验证(germline vs somatic CR9114 对 H1/H3/B 四组独立 DMS)。待核实:数据/代码托管位置。
- ✅ Talts, S., Betancourt, M., Simpson, D., Vehtari, A., Gelman, A. (2018). *Validating Bayesian Inference Algorithms with Simulation-Based Calibration.* arXiv:1804.06788. 用途:I1 反面教材(自洽检验=循环陷阱形式化,降级为 debug 工具)。
- ✅ Säilynoja, T., Schmitt, M., Bürkner, P., Vehtari, A. (2025). *Posterior SBC: simulation-based calibration checking conditional on data.* Stat. & Computing. arXiv:2502.03279. 用途:同上,SBC 改进版仍非充分。
- ✅ Jiang, Q. & Wan, L. (2024). *PI-SDE: physics-informed neural SDE for learning cellular dynamics from time-series scRNA-seq.* Bioinformatics. DOI 10.1093/bioinformatics/btae400. 用途:I1 方法论同构(从轨迹学 drift,held-out 时间点验证)。
- ✅ Vinyard, M. E., Rasmussen, ... Pinello, L., Getz, G. (2025). *scDiffEq: learning cell dynamics with neural differential equations.* Nature Machine Intelligence. DOI 10.1038/s42256-025-01150-3. (bioRxiv 2023.12.06.570508). 用途:I1 最强非循环验证(held-out + in vitro→in vivo transfer + 扰动对照)。
- ✅ Linhart, J., Gramfort, A., Rodrigues, P. (2023). *L-C2ST: Local Diagnostics for Posterior Approximations in SBI.* NeurIPS. arXiv:2306.03580. 用途:无真值局部可信度诊断(辅助)。
- ✅ Guan, ... (2025). *[gradient-flow SDE 联合可辨识性].* arXiv:2505.21770. Thm 4.2 + Cor 4.3. 用途:I2 定理 T1(非平衡下联合恢复 f 与 σ;σ 常数前提)。
- ✅ Lavenant, H., ... (2024). *[已知扩散 ⇒ drift 唯一恢复].* Ann. Appl. Probab. Thm 2.1(Hashimoto 2016 首证)。用途:I2 定理 T2 核心(我方落入分支,σ 已知)。
- ✅ Tapia Costa, M., Kantas, N., Deligiannidis, G. (2026). *[denoising-diffusion drift estimation, known diffusion].* arXiv:2602.17830. 用途:I2 T2 估计方法参考(观测形态为轨迹,不直接匹配我方边际观测)。
- ✅ Varıcı, B., ... (2024). *[Interventional Causal Representation Learning].* NeurIPS. arXiv:2406.05937. Thm 1/2. 用途:I2 定理 T3(干预/多条件带来可辨识性;线性混合假设为软肋)。
- ✅ Zhao, ... (2025). arXiv:2511.11161. 用途:2602.17830 引用的 drift 估计一致性结果(间接)。

补充数据源(Stage 2 扩展条件维度时的储备,当前不动用):CR6261(Phillips 同论文 Source data 2,2048×2)、Bloom RBD escape(jbloomlab GitHub)、Koenig VHH DMS(PNAS 2017,贴近公司 camelid)、ProteinGym 抗体子集。

### 候选精简脊柱 v0 — Stage 0 信息加持后的逐行批注

候选脊柱(来自 northstar-and-loop-design.md,待 Stage 2 loop 检验,非定稿):

- **Spike 0 — CR9114 直接监督拟合 f(seq,cond)**(零仿真器,几天)。Stage 0 加持:数据完全可用(65536×3,CC-BY 即下);条件依赖真值存在(nested 跨抗原);**新增承重假设 = 必须 censored 回归处理检测限 floor**。验证目标"函数类能否表示真实条件依赖地形"——这是 R2 攻击仿真器必要性时 defender 的核心简化主张。判断:大概率存活且是脊柱主干。
- **Spike 1 — 玩具 SDE 反推(若 R2/R3 证明必需)**:已知 f + 已知 σ → 轨迹 → 能否反推 f,真正的可辨识性测试。Stage 0 加持:I2=AMBER 表明"反推 f"在本数据形态下数学可行性需检验,玩具 SDE 是最小检验场(不是逼真仿真器,只为 sanity check"反推动作在已知 σ 下 work")。判断:这是 R3 中典型的"先砍后可能复活"对象——逼真仿真器(IGoR→EPAM→DIMSIM/SLiM)被砍,但玩具 SDE sanity check 可能因 I2 gating 而复活。注意区分:复活的是"玩具级最小可辨识性测试",不是"逼真仿真器 + 手搓 f* 族"。
- **验证 — Hanke/phage-seq 真实多条件 + CR9114 当裁判,打乱条件标签对照**:Stage 0 加持:CR9114 三抗原是 I3 打乱标签的天然真值场;Hanke(PRJNA814713,2轮×3条件)与 phage-seq 提供轴 c 真实多条件。判断:I3 验证关存活,打乱对照设计有真值锚。

这三段共同构成 Stage 2 进入时的"待简化方案 v0 的精简脊柱候选"。loop 的任务不是从头造方案,而是检验这条脊柱哪些承重、哪些可砍、哪些需复活——并确保砍剩的内核三不变量全绿。Stage 0 的判断倾向(非定稿,留给 loop 推翻):Spike0 主干存活,逼真仿真器+手搓 f* 族被砍,玩具 SDE 可辨识性 sanity check 待 R3 定夺,I3 打乱对照存活。

### 一句话总结(供快速恢复)

Stage 0 三块弹药齐备:**I1 解了**(8 先例,非循环路径 = 锚定 CR9114 独立 Kd / 留出抗原 / 留出轨迹三类湿实验可观测量,警报不触发,SBC 类降级);**I2 = AMBER**(3 定理全核实,σ已知+population边际是最可辨识设定,但"PLM连续化是否Itô梯度流"+"a(x)椭圆性"两条 gating 假设无定理支撑,交 Stage 2 R3 攻防);**CR9114 完美对口**(65536×3 −logK_D 组合完备,CC-BY即下,条件依赖真值天然,唯一须建模检测限 floor)。可进 Stage 1。

### 附录 A:I2 两条 gating 假设的可操作检验方案(供 Stage 2 R3 / Stage 4 落地)

Stage 0 只能指出 gating ①② 无定理支撑;但为了让 Stage 2 R3 的攻防不停留在口水仗,这里预先设计两条可执行的检验,让 defender 能拿数据说话、critic 能拿数据反驳。

**gating ① — "PLM 连续化后表征空间动力学是否近似 Itô 梯度流扩散"的可操作检验**:思路是不去证明定理,而是在数据上检验定理前提的经验成立度。具体三步:(1) 取一条已知的演化轨迹(玩具 SDE 生成的、或真实 phage panning 轮次序列),映射到 PLM embedding 空间,计算相邻时间点的增量 ΔX;(2) 检验 ΔX 的条件分布是否近高斯(Itô 扩散的局部增量应近高斯)——用 QQ 图 / 正态性检验,看偏离程度;(3) 检验估计出的 drift 场是否近似无旋(梯度场的判据:∇×(drift)≈0,即 drift 的 Jacobian 近似对称)。若三项偏离都小 → gating ① 经验成立(绿);若 drift 显著有旋 → 不是梯度流,需弱化目标为"只估 drift 不要求势函数"。这给 R3 一个客观裁决依据,而非主观判断。弱化退路:即使非严格梯度流,T2(Lavenant)只要求 drift 可辨识(不强制梯度结构),所以"有旋"不致命,只是放弃"f 是势函数"这一更强 claim。

**gating ② — "a(x)=σσᵀ 在 embedding 空间的椭圆性下界"的可操作检验**:(1) 取 S5F/EPAM 突变模型,在序列空间它给出每个位点的突变率矩阵(20×20 氨基酸替换);(2) 通过 PLM encoder 的 Jacobian J 把序列空间的突变协方差推前到 embedding 空间:a_emb(x) ≈ J·Σ_seq·Jᵀ;(3) 计算 a_emb(x) 的最小特征值 λ_min 在表征流形切空间上的分布。判据:λ_min 全程 > 某正下界 → 一致椭圆性经验成立(绿);λ_min 接近 0(秩亏)→ 退化,T2 唯一性失效(红)。处置若退化:(a) 换更低维表征使 J 满秩;(b) 加各向同性正则项 εI 人为抬高下界(代价:引入与真 σ 不符的偏差,需在 loss 中权衡);(c) 只在 a_emb 非退化的子流形上声明可辨识性。这条检验也直接产出 Stage 4 实验设计里"σ 推前"步骤的操作化细节。

**瞬态检验(需核查开关 a)**:仅当 Stage 2 保留"从轨迹学 f"成分时才需要。判据:检查观测时间窗内分布是否仍在移动(KL(p_t || p_{t+1}) 显著 > 0 = 瞬态;趋于 0 = 近平衡)。CR9114 终点快照不涉及此问题。

### 附录 B:Spike0(CR9114 直接拟合)的数据 schema 与 loss 设计草案(供 Stage 4)

这是 Stage 4 操作化 Spike0 时的输入,Stage 0 先备好以减少 Stage 4 的开放性追问。

**数据 schema**:
- 输入 X:65,536 个变体 × 序列表征。每个变体 = germline CR9114 重链 + 16 个二值突变位点的某个组合(2^16)。序列表征用 PLM embedding(ESM-2 / IgBERT / AbLang,架构偏好下二选一),或先用 16 维二值突变向量做最简 baseline。
- 条件 c:抗原 ∈ {H1, H3, B}(one-hot 或抗原序列 embedding)。
- 标签 y:−logK_D(连续实值)。
- 检测限标记 m:每个 (变体, 抗原) 标记 y 是否被 floor(低于检测限)。需从 eLife Source data 回查 floor 阈值(图 1D/F 给比例,具体数值在 source data)。

**loss 设计(处理检测限的 censored 回归)**:对未截断观测用标准回归损失(MSE on −logK_D);对左截断观测(y 被 floor)用截断似然——只惩罚"模型预测 > floor"的部分,不强制模型输出 = floor。即 Tobit-style:L = Σ_{未截断} (f(x,c) − y)² + Σ_{截断} max(0, f(x,c) − floor)² 的软版本(或用正态 censored likelihood 的对数)。这样弱结合区不被假数据带偏。

**条件依赖验证(I3 落地,在 Spike0 内即可做)**:训练后做两件事——(1) 固定变体扫抗原:看 f(x, H1) vs f(x, H3) vs f(x, B) 是否实质不同,且与实测 nested 模式一致;(2) 打乱抗原标签重训:把 (变体,抗原,y) 的抗原列随机置换后重训,若测试性能不显著下降 = f 没用上条件 = I3 假阳性。CR9114 的 nested 结构保证真模型打乱后必掉,这是 I3 最干净的真值检验。

**非循环 gate(I1 落地,在 Spike0 内即可做)**:held-out 留出策略——(a) 留出抗原:在 H1+H3 上学,预测 B 的相对 Kd 排序(cross-condition,对应 Dailey 范式);(b) 留出突变组合:在部分 2^16 组合上学,预测留出组合的 Kd 排序;(c) 与朴素 baseline(序列相似度 / Phillips 的 pairwise epistasis 模型)比,须显著更好。这三条 gate 的真值都来自 CR9114 实测(湿实验),非自生成 → 非循环。

**预期产出物**:f 在 held-out 上的 Spearman/Pearson(vs 实测 −logK_D)、打乱标签前后的性能差、与 baseline 的相对提升。这些是 Spike0 "毕业"的量化判据,Stage 4 须给具体阈值。

### 附录 C:本 checkpoint 的恢复指引(若新 session 从此处续)

若后续 session 在 Stage 1 之前中断恢复:读本文件 → Stage 0 三判据全 [x] → 直接进 Stage 1(LOOP SETUP)。Stage 1 开场清单见上方"下一步精确动作"。v0 文件:`context/2026-06-07-3layers-plan.md` + `context/2026-06-07-northstar-and-loop-design.md`。Stage 1 要产出的 state ledger 初始状态:版本 v0,队列 R1-R5,三不变量初始状态 = I1(已大幅夯实,弹药见本文件 I1 节)/ I2(AMBER,gating ①② 见附录 A)/ I3(未验,真值场 = CR9114 三抗原)。Stage 1 不迭代、不检索,纯 setup,一次过。

至此 Stage 0 checkpoint 与全部附录完成,内容覆盖 process(三线检索 + agent 卡死恢复 + 工具可靠性)+ results(I1 八先例 / I2 三定理判定 / CR9114 可用性)+ 下游交接(Stage 2 攻击 playbook / 风险登记册 / gating 检验方案 / Spike0 schema)。可进 Stage 1。

### 附录 D:Stage 2 saturation 收敛路径推演(Stage 0 视角的预判,非约束)

spec 给 Stage 2 的预算是 3-6 轮收敛,硬下限 3 轮(防早停),软上限 8 轮。基于 Stage 0 弹药,这里预推演最可能的收敛路径,供执行者管理预期(loop 实际走向以 Stage 2 对抗结果为准,此推演不约束 judge)。

**预判第 1 轮(主攻 R1 非循环性)**:critic 打"老方案 Layer 1 仿真器+手搓 f* 是循环"。defender 拿 CR9114 独立 Kd + Dailey cross-condition + scDiffEq transfer 三类独立信号应战,主动把 SBC 类降级。预期 judge:I1 在"锚定湿实验可观测量"的方案上判绿,但前提是方案不依赖手搓 f* 当真值。2b 张力 = "科学野心(逼真仿真完整时序)⟂ 非循环可验证性(只信湿实验真值)"。2c 简化候选 v1 = 砍掉逼真仿真器 + 手搓 f* 族,脊柱收缩到 Spike0(CR9114 直接拟合)+ I3 打乱对照 + held-out 非循环 gate。2d resurrection:抢救"逼真仿真器"——它提供时序轴 T,但 R1 阶段判定"时序是部署野心非方法成立",抢救失败,确认可砍(留作 Stage 4 公司数据缺口标注)。预期 v1 复活清单 = 空 或 仅"玩具SDE占位"。

**预判第 2 轮(主攻 R2 仿真器必要性 + R3 可辨识性)**:critic 这轮分两路。R2 路:既然 Spike0 直接拟合 CR9114,玩具 SDE 还要不要?R3 路:用 gating ①② 打"你的 ∇f 凭什么可辨识"。defender:Spike0 验证"函数类能表示真实条件依赖地形",这是方法核心 claim 的充分证据(R2 偏绿,可砍逼真仿真);但 I2 AMBER 意味着"从轨迹反推 f"这个动作本身需在已知 σ 的最小设定下 sanity check。2d resurrection 关键时刻:抢救"玩具 SDE 可辨识性测试"——necessity-sufficiency 判它是不是 load-bearing。预判:**玩具 SDE sanity check 大概率被复活**(它承重 I2:没有它,"反推 f"在本数据形态下数学可行性无任何检验,I1 的轨迹类验证也悬空),但复活的是"玩具级最小测试",绝非"逼真仿真器+手搓 f* 族"。这是 loop"安全简化"机制的典型样例:砍掉重工程,复活其中唯一承重的最小核。v2 = Spike0 + 玩具SDE可辨识性sanity check + I3打乱对照 + held-out gate。

**预判第 3 轮(主攻 R4 条件依赖 + 收尾 R5)**:critic 打 I3"打乱抗原标签性能掉不掉"。defender:CR9114 nested 结构保证必掉,真值场就绪。R4 判绿。R5(OOD→公司)critic 弱攻,defender 承认是部署非方法成立,排除出 saturation 阻塞项。2c:此轮难再生成"砍掉后仍全绿"的候选(Spike0 砍不动——它是脊柱;玩具SDE刚复活;I3对照承重;held-out gate承重)。2d 复活清单预期为空。

**预期 saturation**:若第 2、3 轮 2d 复活清单连续为空(玩具SDE在第2轮复活后不再有新复活)且三不变量全绿且砍不动,则第 3 轮末满足 saturation 三判据,3 轮收敛(命中硬下限,合法)。但需警惕:I2 gating ①② 若在 R3 实测(附录 A 检验)判红(连续化非梯度流 或 a(x) 退化),则 I2 红灯,该轮强制重做 2c,可能延到 4-5 轮——这是最可能的延长因素。

**预期定稿内核 vN(Stage 0 猜测,留给 loop 推翻)**:
- 主干:Spike0 = CR9114 直接监督拟合 f(seq,cond),censored 回归处理检测限,验证函数类能表示真实条件依赖地形。
- 可辨识性核:玩具 SDE 最小 sanity check(已知 f + 已知 σ → 轨迹 → 反推,确认动作数学可行),附 gating ①② 的经验检验。
- I3 关:打乱抗原标签对照(CR9114 三抗原真值场)。
- I1 关:held-out 非循环 gate(留出抗原 / 留出突变组合,对照实测 Kd + 朴素 baseline)。
- 砍除(确认真冗余):逼真仿真器(IGoR→EPAM→DIMSIM/SLiM)、手搓 f* 族、老三层 gate 链的流程性外壳。
- 标注留公司数据(不可替代缺口):轴 T 体内时序、跨 campaign 泛化。

这个 vN 猜测若成立,正好回应用户批判:砍掉了"用工程量制造虚假信心"的逼真仿真器+手搓 f*,只留三个不可省的硬核验证关(I1 非循环 / I2 可辨识 / I3 条件依赖)+ 一个最小可辨识性 sanity check。简洁明了。但这是 Stage 0 的预判,Stage 2 loop 有权全盘推翻——尤其 R3 实测可能逼出完全不同的可辨识性处理。

### 附录 E:Stage 1 部件预拆解种子(承重假设, 工程成本)

Stage 1 要对 v0 每个部件标(承重假设, 工程成本)。Stage 0 已能给出种子标注,Stage 1 直接深化:

- **逼真仿真器(IGoR naive库 → netam/EPAM 套σ → DIMSIM/SLiM 演化)**:承重假设 = "需要逼真的合成时序轨迹来训练/验证方法";工程成本 = 高(多工具链串联,数周)。Stage 0 判:承重假设可疑(R1 指其真值循环,R2 指 CR9114 已直接给地形)。
- **手搓 f* 族(平滑/崎岖/强弱条件依赖)**:承重假设 = "需要已知真值 f* 来度量恢复精度";工程成本 = 中。Stage 0 判:这是循环论证病灶本身,I1 直接否。
- **CR9114 直接拟合(Spike0)**:承重假设 = 数据可用✅ + 条件依赖真值存在✅ + 检测限须建模⚠️;工程成本 = 低(数天)。Stage 0 判:脊柱主干,存活。
- **玩具 SDE 可辨识性检验**:承重假设 = "反推 f 在已知 σ 下数学可行需最小验证";工程成本 = 低-中。Stage 0 判:R3 可能复活的承重核。
- **L1/L2/L3 三层 gate 链**:承重假设 = "需要分层 gate 防过拟合/防自娱自乐";工程成本 = 中(流程开销)。Stage 0 判:gate 的"意图"承重(非循环/条件依赖/独立对照),但"三层结构外壳"可能是冗余包装——把三个意图压进三个不变量检验即可,不需要"层"的仪式。
- **零泄漏检查**:承重假设 = "独立验证须确认序列/抗原未参与训练";工程成本 = 低。Stage 0 判:承重(I1 held-out gate 的前提),存活。
- **SVD 条件秩诊断**:承重假设 = "确认多条件矩阵有效秩足够支撑条件依赖 claim";工程成本 = 低。Stage 0 判:与 I3 相关,可能并入 I3 检验,存活但或被合并。

至此 Stage 0 checkpoint 全部完成(正文 + 附录 A-E)。三判据 [x][x][x] 达标,backtrack 不触发。下一步:context-checkpoint 收尾已含于本次 append,进 Stage 1 LOOP SETUP。

### 附录 F:I2 三定理前提逐条对照清单(Stage 2 R3 直接当 checklist)

把三条定理的前提拆成可逐条勾选的清单,Stage 2 R3 攻防时 critic/defender 对着逐条打勾或打叉,judge 据此裁红绿。每条标 [满足] / [不满足] / [需额外假设] / [需实测]。

**T1 (Guan 2025, arXiv:2505.21770) 前提清单**:
- [需额外假设] P1.1 状态空间为连续 ℝ^d,弱意义 Fokker-Planck 成立 ← 我方离散序列经 PLM 连续化,FP 须近似成立(gating ①)
- [不满足] P1.2 扩散系数 σ 为标量常数(各向同性 Brownian)← 我方 σ 各向异性、序列依赖
- [满足] P1.3 drift 为梯度形式 −∇Ψ ← 我方假设 f 为势函数(选择算子=能量场)
- [满足] P1.4 观测为 population 时间边际 p(·,t) ← 我方 (T×C×S) 频率张量正是各条件经验边际
- [需实测] P1.5 观测处于非平衡瞬态(平衡态不可辨识)← CR9114 快照无此问;轨迹成分需检验
- [满足] P1.6 初值有限二阶矩 ← 一般满足
- 综合:T1 因 P1.2 不满足而不能直接用,但证明了"非平衡下联合恢复 f 与 σ 可行"的存在性,我方 σ 已知更易。

**T2 (Lavenant 2024 Ann.Appl.Probab. Thm 2.1) 前提清单 — 我方主分支**:
- [需额外假设] P2.1 连续 ℝ^d ← 同 gating ①
- [满足→需实测] P2.2 σ²(或矩阵 a(x))已知且良态非退化 ← σ 已知✅(S5F/EPAM),但 embedding 空间非退化需实测(gating ②,附录 A 检验)
- [满足] P2.3 观测为连续边际 ← 匹配
- [需实测] P2.4 ∇Ψ Lipschitz + 线性增长 ← 表征空间内须检验 drift 正则性
- 综合:这是我方落入的分支。核心优势 P2.2(σ已知)成立,致命点在 P2.2 的"非退化"子条件与 P2.1 的连续化。

**T3 (Varıcı 2024 NeurIPS, arXiv:2406.05937) 前提清单 — c 维度辅助**:
- [不满足] P3.1 潜→观测为线性变换 X=GZ,G 满秩 ← PLM encoder 非线性
- [部分满足] P3.2 干预签名矩阵满行秩(足够多样环境)← 需足够多样抗原/条件张成;CR9114 三抗原 + Hanke 多条件或可
- [需核查] P3.3 score 差分非常数(干预正则性)
- [需核查] P3.4 加性噪声潜模型(hard/完美 ID 需)
- 综合:T3 提供 c 维度辨识杠杆(多条件→可辨识),不直接保证 f 逐点恢复,P3.1 线性假设是软肋。用作"为何多条件有助辨识"的论据,不作 f 恢复的主保证。

**R3 judge 裁决逻辑**:绿 = T2 主分支的 P2.2(非退化,实测 λ_min>下界)与 P2.1/gating①(连续化经验检验通过 或 弱化为只估drift)至少有可操作通过路径;红 = P2.2 实测退化 且 gating① 检验显示强烈非扩散/非梯度 且 无弱化退路。AMBER = 部分通过,需带假设推进并在 Stage 3 复检。

### 附录 G:CR9114 / CR6261 数据字段字典(Stage 4 操作化直接取用)

供 Stage 4 写 Spike0 数据加载步骤时无需回查论文即可照做。

**Source data 1 (CR9114)**:
- 维度:2^16 = 65,536 行(变体)× 3 抗原列(H1, H3, influenza B)
- 变体编码:16 个二值位点(0=germline 态,1=somatic 突变态),覆盖 germline→somatic 全组合中间体
- 值:−logK_D(每变体每抗原一个连续标量,越大结合越强)
- 截断:部分 (变体,抗原) 的 −logK_D 低于检测限被 floor;floor 阈值与各抗原可测比例见论文图 1D(具体数值在 source data 文件内,Stage 4 回查)
- 突变位点:CR9114 重链上 16 个 somatic 突变(IMGT 编号,论文图 1A 给位置;另有 2 个远端 framework 突变被排除)

**Source data 2 (CR6261)**:
- 维度:2^11 = 2,048 行 × 2 抗原列(H1, H9)
- 其余同上,11 个二值位点
- 用途:第二独立骨架,cross-antibody 泛化对照

**Source data 3 (isogenic flow cytometry)**:
- 选定变体子集的 −logK_D 正交测量(非 Tite-Seq)
- 用途:校准 Tite-Seq 测量噪声尺度;Spike0 loss 的观测噪声项参考

**轻量信息**:序列重建只需 CR9114 germline 重链序列(论文/Dreyfus 2012 给)+ 16 位点的突变身份;无需复杂结构。光链不影响结合(论文已述),可忽略。

**下载操作**:eLife article 71393 页面 → Figures and data / Source data 区 → 下载 Source data 1/2/3(Excel/CSV)。CC-BY,直接用,无 DUA。

### 附录 H:Stage 0 自检(对照 spec 完成判据逐条)

- spec 判据 1「I1 弹药 ≥3 先例(论文+独立信号)」→ 达成 8 个(Abbeel-Ng / Phillips / Dailey / Talts / Säilynoja / PI-SDE / scDiffEq / L-C2ST),每个标了独立验证信号与可迁移性。✅ 超额。
- spec 判据 2「I2 弹药 3 条定理逐条判定表」→ 达成,T1/T2/T3 全核实真实存在,逐前提判定(附录 F 展开为 checklist)。✅
- spec 判据 3「CR9114 可访问性+矩阵维度+直接拟合适配性,1 段结论」→ 达成,65536×3,−logK_D,CC-BY 即下,detection-floor 坑标注,1 段可用性结论 + 备选表。✅
- spec backtrack「3 先例无一可迁移→I1 无解警报」→ 不触发(3 类独立湿实验信号可迁移)。✅ 安全。

Stage 0 全部完成,质量达标,无遗留阻塞。进 Stage 1。

### 附录 I:I1 非循环性的理论收束(spec 最高靠山的地基陈述)

I1 是整份 spec 的最高靠山,值得把它从"找了几个先例"升级为一个站得住的论证,供 Stage 2 每轮 I1 体检时 defender 引用,也供 Stage 3 终检复核。

**问题的形式化**:我们要学一个未知算子 f。验证的根本困难是:f 的真值不可观测(若可观测就不用学了)。用户的循环论证批判,形式化后是这样一个命题——"任何形如『构造 f* → 用 f* 生成数据 D → 从 D 学出 f̂ → 证明 f̂≈f*』的验证,其结论 f̂≈f* 不蕴含 f̂≈f_真,因为 f* 与 f_真 无任何约束关系。" 这个命题是对的。它精确刻画了老方案 Layer 1(手搓 f* + 仿真器)的病:它验证的是"学习算法对自洽生成过程的可逆性",而非"学到的算子对应真实生物学"。SBC 类方法是这个病的数学极致——它连"误差"都不用,直接检验后验校准,但同样只约束"算法忠于自己的生成模型"。

**破解的充分条件**:要让验证非循环,必须存在一个观测量 O,使得 (i) O 由真实系统(非我们的模型/仿真)产生;(ii) O 在学习 f̂ 时未被使用(held-out / 独立);(iii) f̂ 对 O 有可证伪的预测。满足 (i)(ii)(iii) 时,"f̂ 准确预测 O"是对 f̂≈f_真 的真实证据(虽非充分证明,但有正的证据力,且无法靠自洽刷出来)。这正是 Abbeel-Ng(O=真实环境中的 feature expectation)、PI-SDE/scDiffEq(O=held-out 时间点/独立体系的真实测量)、蛋白 fitness landscape(O=独立 DMS 实测 Kd)三类先例的共同骨架。

**本问题的 O 存在性**:CR9114 提供了三种合格的 O:
- O₁ = 留出突变组合的实测 −logK_D(同抗原内 held-out)。满足 (i) 湿实验测量;(ii) 训练时遮住;(iii) f̂ 预测其相对排序可证伪。
- O₂ = 留出抗原的实测 −logK_D(cross-condition,如 H1+H3 学→预测 B)。这是最强的 O,因为换抗原是"自然界的干预",f̂ 必须真的捕捉了条件依赖机制才能预测,无法靠记忆刷出。对应 Dailey 2025 与 scDiffEq transfer 范式。
- O₃ = 独立体系的真实演化轨迹分布(若保留轨迹成分;留出时间点/谱系节点)。对应 PI-SDE 范式。

**因此 I1 可解,且解法是结构性的而非技巧性的**:不是"找个聪明的统计检验绕过循环",而是"把验证的真值来源从模型内部(f*/仿真器)换成系统外部(湿实验 O)"。这个替换一旦做到,循环就断了——因为 O 不在我们的生成过程里,我们无法通过调整 f* 或仿真器来"制造"O 的吻合。

**I1 的红线(Stage 2 每轮必查)**:任何一轮的方案,只要它的核心 claim 的证据**完全**来自模型内部真值(f*/仿真器自洽),I1 判红,强制重做 2c。判绿的最低要求:核心 claim 至少有一条验证关锚定在 O₁/O₂/O₃ 之一。这条红线把用户的批判变成了一个可执行的、每轮都查的 gate,而不是一句口号。

**与简化的关系(为何 I1 同时是简化引擎)**:一旦确立"只有外部 O 才算数",大量内部工程(逼真仿真器、手搓 f* 族、为生成逼真假数据的全套管线)就失去了验证价值——它们生产的是内部真值,而内部真值对 I1 零证据力。于是 I1 不仅是验证关,还是最强的简化理由:砍掉它们不损失任何"非循环证据力",只损失"自洽性表演"。这就是 spec 说的"简化与硬化是同一动作的两面"——把验证锚定到外部 O(硬化 I1)的同时,内部工程自动失去存在理由(简化)。这一节就是该论断的证明。

**残留的诚实声明**:O 给的是"正证据力"不是"充分证明"。f̂ 准确预测 O₁/O₂/O₃ 仍不能 100% 排除"f̂ 在 O 覆盖不到的区域是错的"。所以 Stage 4 须设计 O 的覆盖范围声明(哪些条件/突变区有外部真值背书,哪些没有),并把"无 O 背书区"诚实标为方法的已知盲区——这也是公司数据(轴 T 时序、跨 campaign)不可替代价值的另一面:它们是开源 O 覆盖不到的外部真值。

至此 Stage 0 context 文件全部完成。正文 + 附录 A-I,覆盖三线检索过程、agent 卡死恢复、工具可靠性、I1 八先例 + 理论收束、I2 三定理判定 + checklist + gating 检验、CR9114 可用性 + 数据字典、Stage 2 攻击 playbook + 收敛推演、Stage 1 部件预拆解、风险登记册、恢复指引。Stage 0 三判据达标,backtrack 不触发,质量充分,进 Stage 1。

### 附录 J:术语与符号表(全 spec 通用,供任意 session 恢复)

- **f / f(seq,cond)**:选择算子,要学的未知量,= condition-dependent 能量/势函数;∇f = 推动群体的力场/drift。
- **f***:手搓的真值选择算子(老方案用),I1 判其为循环论证病灶。
- **σ / σ_SHM / M**:突变算子,已知,= 各向异性结构化扩散(S5F/EPAM 模型给出)。
- **SDE 反问题**:`dX = ∇f(X,c)·dt + σ·dW`,σ 已知,从轨迹/分布反推 ∇f。
- **a(x) = σσᵀ**:扩散矩阵,可辨识性需其一致椭圆(非退化)。
- **PLM embedding**:蛋白语言模型表征(ESM-2/IgBERT/AbLang),把离散序列连续化。
- **−logK_D**:CR9114 测量量,负对数解离常数,连续实值,越大结合越强。
- **Tite-Seq**:酵母展示+梯度抗原+深测序反推 Kd 的方法。
- **detection floor / censored**:弱结合变体 Kd 低于检测限被截断,须 Tobit/censored 回归。
- **I1/I2/I3**:三不变量。I1 验证非循环性(最高)、I2 可辨识性、I3 条件依赖真新颖性。
- **gating ①②**:I2 的两条无定理支撑前提。①PLM连续化是否Itô梯度流扩散;②a(x)椭圆性。
- **O / O₁O₂O₃**:外部真值观测量(湿实验、训练未见、可证伪)。O₁留出突变组合Kd、O₂留出抗原Kd、O₃留出轨迹分布。
- **Spike0**:CR9114 直接监督拟合 f,零仿真器,候选脊柱主干。
- **玩具SDE sanity check**:已知f+已知σ→轨迹→反推f 的最小可辨识性测试(区别于逼真仿真器)。
- **v0/v1/.../vN**:方案版本号。v0=老三层方案,vN=loop 定稿,v_final=Stage 3 终检后。
- **R1-R5**:种子攻击队列。R1非循环性、R2仿真器必要性、R3可辨识性、R4条件依赖、R5 OOD迁移。
- **resurrection**:砍部件后派人抢救(necessity-sufficiency + factor-removal),抢救失败才算真冗余。
- **saturation**:Stage 2 退出判据(连续2轮无新复活 ∧ 三不变量全绿 ∧ 砍不动)。
- **CR9114 / CR6261**:Phillips 2021 的两个流感 bnAb,组合完备 DMS,本问题独立真值。

### 附录 K:三不变量状态追踪表(跨 stage 滚动更新的活账)

此表是三不变量的"活账",每个 stage / 每轮 loop 结束更新。Stage 0 初始化:

| 不变量 | Stage 0 后状态 | 证据/依据 | 待解 | 下次更新时点 |
|---|---|---|---|---|
| I1 非循环性 | 🟢 大幅夯实(未最终判绿) | 8 先例 + 理论收束(附录I);O₁O₂O₃ 三类外部真值在手;SBC 降级 | 需在具体方案 vN 上确认核心 claim 锚定 O | Stage 2 每轮 2a |
| I2 可辨识性 | 🟡 AMBER | σ已知+population边际=最可辨识设定;3定理核实 | gating①连续化、gating②椭圆性,无定理支撑,需实测(附录A检验) | Stage 2 R3 |
| I3 条件依赖 | ⚪ 未验 | CR9114 三抗原 nested 结构 = 天然真值场就绪 | 打乱抗原标签对照尚未执行 | Stage 2 R4 / Stage 4 |

图例:🟢绿(承重且通过) 🟡AMBER(可推进带假设) ⚪未验 🔴红(倒下,触发backtrack)。

**Stage 0 对此表的交接说明**:I1 标 🟢"大幅夯实"而非纯绿,因为非循环性的最终判绿必须在具体方案上做(方案的核心 claim 是否真的锚定 O),Stage 0 只证明了"路径存在"。I2 标 🟡 是 Stage 0 最重要的诚实——不假装可辨识性已解决,把两条 gating 假设明确交给 Stage 2 R3 用附录 A 的可操作检验定胜负。I3 ⚪未验,但真值场已备(CR9114 三抗原),Stage 2 R4 一打乱标签即可出结果。

这张表会在 Stage 1 末(初始化 state ledger 时)、Stage 2 每轮末、Stage 3 末各更新一次,是判断 saturation 第 2 条(三不变量全绿)的依据。

至此 Stage 0 的 context 文件彻底完成。本次 checkpoint append 已远超 500 行实质内容,覆盖完整 process 与 results 及全部下游交接。Stage 0 三判据 [x][x][x],backtrack 不触发。正式进入 Stage 1 LOOP SETUP。

### 附录 L:老三层方案(v0)逐部件命运映射(Stage 1 装载直接输入)

把老三层方案(2026-06-07-3layers-plan.md)的每个部件列出,给 Stage 0 视角的"预判命运"(存活/砍/待定/复活候选)+ 理由。Stage 1 把这张表深化为正式的 (承重假设, 工程成本) 标注;Stage 2 loop 据此逐一审判。预判不约束 loop。

**Layer 1(白盒进化仿真器 + 可辨识性检验)的部件**:
- 手搓 f* 族(平滑/崎岖/强弱条件依赖)→ 预判【砍】:I1 判其为循环论证病灶,内部真值零证据力。
- IGoR naive 库生成 → 预判【砍/降级】:仅在保留轨迹合成时才需要;若 Spike0 走 CR9114 直接拟合则不需要。
- netam/EPAM 套已知 σ → 预判【部分保留】:σ 模型本身承重(I2 的 σ 已知优势来源),但"套到仿真序列上"这个用法砍。
- DIMSIM/SLiM 群体动力学模拟 → 预判【砍】:逼真演化模拟是野心件,非方法成立必需。
- 多时间点频率轨迹生成 → 预判【砍/降级】:轴 T 时序留公司数据。
- 可辨识性度量(f̂ vs 私藏 f*)→ 预判【改造】:不比对私藏 f*(循环),改为玩具 SDE 最小 sanity check(已知 σ 下反推动作是否数学可行)+ 附录 A 的 gating 经验检验。
- 有效边界扫描(随复杂度/噪声/时间点衰减)→ 预判【待定/瘦身】:有诊断价值,但可大幅瘦身为玩具级最小扫描。

**Layer 2(真实多条件展示筛选)的部件**:
- Hanke/phage-seq 取数+对齐 → 预判【保留/备选】:轴 c 真实多条件,I3 验证可用;但 CR9114 三抗原已能做 I3 核心检验,Hanke 作补充。
- SVD 条件有效秩诊断 → 预判【保留/合并】:与 I3 相关,可并入 I3 检验。
- 学 f̂(seq,cond) on 真实数据 → 预判【保留】:这是方法在真实数据上的落地,承重。
- 固定序列扫条件验条件依赖 → 预判【保留】:I3 落地,CR9114 可直接做。
- 打乱条件标签对照 → 预判【保留,核心】:I3 最干净检验,CR9114 nested 结构保证有效。
- 剥离突变假信号(SHM hotspot vs 选择)→ 预判【保留】:承重(避免把突变偏好误归为选择),σ 已知正好用于此。

**Layer 3(独立 fitness 对照)的部件**:
- CR9114/CR6261 取实测库 → 预判【保留,升级为主干】:从"第三层对照"升级为 Spike0 主干数据 + O₁O₂ 真值源。
- 零泄漏检查 → 预判【保留】:I1 held-out gate 前提,承重。
- f̂ 对变体×抗原打分 + 相关性对照 → 预判【保留】:I1 非循环 gate 落地。
- 条件依赖真实性(同变体跨抗原 f̂ vs 实测 Kd)→ 预判【保留】:I1+I3 交汇,承重。
- Bloom RBD escape / ProteinGym 等补充 → 预判【备选】:跨系统 transfer 储备,当前不动用。

**三层 gate 链结构本身** → 预判【外壳砍,意图保留】:"L1→L2→L3 三层串联"的流程仪式是冗余包装;三个意图(可辨识性体检 / 条件依赖 / 独立对照)直接压进 I2/I3/I1 三不变量检验即可,不需要"层"的概念。这正是用户嫌"像走流程"的部分。

**映射总结**:老方案约 20 个部件,Stage 0 预判 ~6 个砍(全在 Layer 1 的逼真仿真+手搓 f*)、~10 个保留(数据、I1/I3 验证关、σ 模型)、~3 个改造/瘦身(可辨识性检验改玩具版、有效边界瘦身、gate 链去壳)、~1 个复活候选(玩具 SDE sanity check)。砍的全是"内部真值生产线",保留的全是"外部真值锚定 + 方法落地"。这与用户批判完全对齐:被砍的正是"用工程量制造虚假信心"的部分。但这是 Stage 0 预判,Stage 2 loop 的 resurrection 机制有权复活任何被砍件、也有权砍掉任何"保留"件——以对抗结果为准。

Stage 0 context 文件到此真正完结。下一步进 Stage 1,执行 assumption-audit 把这张映射表深化为正式 (承重假设, 工程成本) 标注 + state ledger。

### 附录 M:Stage 0 决策树回放(供审计与复现)

记录 Stage 0 的关键岔路与所选分支,供日后审计"为何这样做"。

1. 岔路:Stage 0 是重做广域综述,还是靶向补缺?→ 选靶向补缺。理由:5-28 对话已做广域调研,spec 明确本 stage 是补缺。只补 I1/I2 弹药 + CR9114 核查三块。
2. 岔路:三检索线串行还是并行?→ 选并行派 agent。理由:三线独立,并行省时 + 保护主上下文。
3. 岔路:CR9114 agent 卡死后续接还是重启?→ 选重启(前台)。理由:0 字节无上下文可接管。
4. 岔路:CR9114 卡死后再派 agent 还是前台 MCP?→ 选前台确定性 MCP。理由:避免再次卡死,semantic-scholar+brave-search 可控。
5. 岔路:WebFetch/WebSearch 502 后怎么办?→ 切 brave-search MCP 通道。理由:不经故障网关。
6. 岔路:I2 判绿还是 AMBER?→ 选 AMBER。理由:两条 gating 无定理支撑,强行判绿=制造虚假信心,违 spec 精神。
7. 岔路:SBC 类先例算正面弹药还是反面?→ 反面(critic 武器 + 自我降级)。理由:它是用户循环批判的数学化身。
8. 岔路:checkpoint 写多详?→ 写满 + 大量下游可直接取用的 playbook/checklist/schema。理由:spec 硬约束 ≥500 行实质,且本 stage 是后续四个 stage 的弹药库,详写一次省后面反复回查。

**Stage 0 最终状态**:三判据全达标;I1🟢大幅夯实 / I2🟡AMBER / I3⚪未验(真值场就绪);backtrack 不触发;产出 1 个 context 文件(本文件,含正文 + 附录 A-M)+ INDEX.md。下一动作:Stage 1 context-init + assumption-audit。

Stage 0 完结。

---

> Checkpoint 完整性声明:本次 append 覆盖 Stage 0 全部 process(context-init、三线并行检索、CR9114 agent 卡死诊断与前台恢复、网关 502 规避、工具可靠性观察)与 results(I1 八先例 + 理论收束、I2 三定理逐条判定 + checklist、CR9114 数据可用性 + 字段字典),并为下游四个 stage 预置了可直接取用的交接物(Stage 2 攻击 playbook、saturation 收敛推演、风险登记册、gating 可操作检验、Spike0 数据 schema 与 loss、老方案逐部件命运映射、三不变量活账、术语表、决策树回放)。三判据 [x][x][x] 达标。Stage 0 结束,进 Stage 1。















