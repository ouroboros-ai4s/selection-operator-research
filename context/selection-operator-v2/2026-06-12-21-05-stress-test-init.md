# 求真对抗 · 相0 起手 — 登记 + 锁定攻击对象

> Created: 2026-06-12 21:05
> Topic: 选择算子 σ∘φ∘a 全景地图 · 求真对抗(falsification-first stress-test)相0 起手
> Phase: 相0 · 起手(登记 + 锁定攻击对象)

## Plan Context

本相目标:确认 7 个自建 skill 就绪;从 v3 全景地图(`2026-06-12-16-52-convergence.md`)抽取承重主张全集(四靶 A/B/C/D),按 load 排序(几条下游结论依赖它);登记本轮 spec 为产物。不做实质攻击。攻击在相1(非循环前置闸)起,相2(四靶主攻)展开,相3(辩证收口)终裁。

赢条件三桶(贯穿全 spec):BROKEN(攻出真缺陷→改地图/降级)/ CORROBORATED(经严苛攻击仍立→挣到信心)/ UNFALSIFIABLE(根本攻不动因为没说可证伪的话→最坏,降级为猜想/类比)。铁律:不产 resilience 分数、不产 hardening 清单;弱点只路由到 改/降/残余 三出路。这一轮直接服务用户奥卡姆美学:优雅必须被"挣来"(forbids+predicts),不能是漂亮的再描述。

## Expected Input

- 全景地图:`context/selection-operator-v2/2026-06-12-16-52-convergence.md`(相3 收敛+相收尾)。
- 三发散路证据:`2026-06-12-15-25-divergence.md`。
- 底图:`2026-06-12-13-59-recon-v3.md`。
- 7 个自建 SKILL.md:`context/selection-operator-v2/stress-test-skills/<name>/SKILL.md`。
- 本 spec:`docs/de-anthropocentric/specs/2026-06-12-selop-falsification-stress-test-spec.md`。

## Completion Criteria

- 7 个 SKILL.md 路径确认存在;
- 承重主张清单(≥靶 A/B/C/D 覆盖,按 load 排序)落入本 context;
- import/弃用决定登记(import: adversarial-stress-testing + counterfactual-probing;弃用: failure-anticipation FMEA)。

---

## Checkpoint: 承重主张清单(四靶 A/B/C/D,按 load 排序)+ 7 skill 核对 + import/弃用登记

### Objective

相0 的核心产出。不做实质攻击,只做三件事:① 核对 7 个自建 skill 文件存在且 frontmatter 完整;② 从 v3 全景地图(`2026-06-12-16-52-convergence.md`)抽取**承重主张全集**——即"若它为假,会有几条下游结论跟着塌"的主张,按 load(下游依赖数)排序,归入四靶 A/B/C/D;③ 登记 import(adversarial-stress-testing + counterfactual-probing)与弃用(failure-anticipation FMEA)决定。这份承重主张清单就是相2 四靶主攻的靶子定义——相2 的每个 subagent 攻的就是这里列出的某条主张,故此清单的精确度直接决定后续攻击的质量。

### Process Summary

读取来源:全景地图 convergence.md 的 5 个 checkpoint(feasibility-assessment 的 12 候选 staged-gate / multi-criteria-scoring 的求真四轴打分表 / portfolio-optimization 的四突破方向组 + 四层覆盖表 / steel-manning 三条最低分自检 / 相收尾三相汇总),以及其 Expected Input 段(相2 三路总收敛骨架 + 三塌缩通道 + 统一骨干 + 三待验承重命题)。从中识别"承重主张"的判据:一条陈述若被推翻,会导致(a)某条突破方向组失效,或(b)某张卡点的"已溶解"判定回退,或(c)整张地图的组织原则(统一性)瓦解——满足任一即为承重主张。装饰性的复述(把已知结论换个说法、不承担新预测)不计入承重主张,但会在靶A 的 elegance-trap 攻击里被单独识别。

7 skill 核对:之前已用 Glob 确认 `context/selection-operator-v2/stress-test-skills/**/SKILL.md` 返回 7 个路径全部存在(falsification-first-stress-test / adversarial-debate-truthseeking / red-team-truthseeking / isomorphism-falsification / circular-validation-audit / independent-convergence-audit / elegance-trap-probe)。每个文件均含完整 frontmatter(name/description/type/campaign 或 produces/artifact-types)。两个 import skill(adversarial-stress-testing / counterfactual-probing)亦已 Glob 确认在 repo `.claude/skills/` 内,正常按名调用。

load 排序方法:对每条承重主张,数它在全景地图里被多少条下游结论引用/依赖。骨架(无 per-seq φ / 单一测度流)load 最高——四个突破方向组、18 卡的"统一为 Φ 谱切面"判定、奥卡姆回应全部架在它上面。四语言同构 load 次高——B4 理论核心 + R_irr 的"对称性而非 bug"升格依赖它。三承重命题 load 中-高(各自支撑骨架洁净度的一个侧面)。假独立收敛 load 中(它是我们对骨架的"信心来源"而非骨架本身——但若它垮,骨架降级为"单次观测的猜想",所以它攻的是信心校准)。sandbox 非循环性 load 特殊(它不是地图内的主张,而是"下一轮如何验证地图"的元约束——但若它垮,整个 compute-only 验证路线作废,故必须前置攻)。

### 靶A · 骨架 + 四语言同构(头号嫌疑,load 最高)

靶A 是整张地图的脊柱,也是用户奥卡姆顾虑的正面对象——它最漂亮,因此最危险。拆成 A 系列承重主张:

**A1 [load 极高] 不存在每条序列的静态适应度 φ。** 原主张:抗体选择不存在 per-sequence 的静态标量 φ(s),只存在序列空间测度 μ_t 沿时间的演化。下游依赖:整张地图的重述(从"求函数 φ"改为"反演算子 Φ")、B1 测度值流恢复的全部合法性、T1 卡(φ 无机制形态)的"溶解"。若 A1 假(真存在静态 φ),则地图的根本重述是错的,我们绕了一大圈否定了一个其实存在的对象。证伪方向:能否构造一个 well-defined 的静态 φ(s) 使所有观测被解释而无需测度流?可证伪性问号:A1 是"不存在性"主张,不存在性极难证伪(要排除所有可能的 φ 构造)——这本身是 UNFALSIFIABLE 嫌疑,相2 isomorphism/elegance 须查它到底禁止了什么。

**A2 [load 极高] 存在单一非平衡随机过程(测度流 μ_t),f=σ∘φ∘a 是它的三投影。** 原主张:有一个 Doi-Peliti/MSR 场论作用量 S[φ场,ψ̃响应场] 编码的单一过程,σ、φ、a 三层是同一过程的三个投影/切面,而非三个独立对象。下游依赖:B0 统一骨干的全部、"三通道分管 Φ 谱不同区段"的组织原则、四层 18 卡"同一算子谱切面"的判定。若 A2 假(三层其实是独立对象不能统一),地图的"统一性"瓦解,退回三个分立子问题——这正是用户怕的"补丁堆"的反面证据会变成正面打击。证伪方向:σ 真能被这个过程吸收吗?(相2 已有预判:σ 不可被动力学统一子吸收,必须独立力学建模——这条恰是 A2 的已知裂缝,须查它是"A2 的反例"还是"A2 早已诚实排除 σ")。

**A3 [load 高] "恢复 φ/a_invivo" = 反演观测算子 Φ;可辨部分 = Φ 非零谱,不可辨核 R_irr = Φ 零谱。** 原主张:把恢复问题数学化为线性(或局部线性)算子 Φ 的反演,奇异值谱给统一标尺(σ_i=0=R_irr / 小=I3 病态 / 大=可辨)。下游依赖:B3 部分辨识、B4 R_irr 刻画、I1/I2/I3 辨识层卡的统一处理。若 A3 假(Φ 不是合法算子,或谱结构不成立),辨识层的统一处理失效。证伪方向:Φ 真是线性算子吗?全局非线性下"谱"还有意义吗?(地图自己标注了"四语言同构精确在线性层,全局非线性需 sandbox 验"——这是 A3 的自认边界)。

**A4 [load 极高,★头号嫌疑] 四语言同构:因果 hedge = 反问题零奇异向量 = 场论 Doi-Peliti 零模 = OT 非保守 curl = Fisher Φ*Φ 核。** 原主张:R_irr 这一个对象在四种数学语言里是同一个东西,且都等于 Fisher 算子的核。这是地图里最强的数学主张,也是最可能"美而空"的——"同构"是精确数学词,burden of proof 极重。下游依赖:B4 理论核心、R_irr "升格为 Noether 对称而非 bug"的全部论证、四层不可辨部分的统一刻画。若 A4 其实只是"类比"而非"同构",则 B4 的理论深度被高估,须降级措辞。这是 isomorphism-falsification skill 的专属靶子。证伪方向:能否对至少两对(因果-hedge↔场论-零模 最大胆;反问题-零奇异向量↔Fisher-核 最可查)写出显式 structure-preserving map?维数/计数 sanity:四语言是否各自独立给出 2 参数零集(N_e·s 标度 ⊕ s−κ 移位两个生成元)?若计数对不上,A4 立即降到"共享不变量"档(rung 4)甚至"类比"档(rung 5)。

**A5 [load 高] R_irr = Noether 对称(选择强度标度 N_e·s ⊕ σ-φ 移位 s−κ)的轨道。** 原主张:不可辨核不是杂乱的"解不出",而是由两条具体对称性(群体遗传选择强度标度对称 + σ-φ 移位对称)生成的轨道——不可辨=对称性,是 feature 不是 bug。下游依赖:奥卡姆回应的最强一笔(把 18 个零散"解不出"统一为"一个核由两生成元生成")、A4 的"Noether"语言支柱。若 A5 假(R_irr 不由这两对称生成,或还有第三条对称/或根本无对称结构),则"不可辨=对称性"的优雅论证垮,R_irr 退回"一堆没说清的不可辨方向"。证伪方向:这两条对称真是 R_irr 的全部生成元吗?有没有 R_irr 里的方向不对应任何对称?(这是待验命题②"全部 hedge 由 gauge 对称诱导"的另一面,靶A 与靶B 在此交叉)。

### 靶B · 三条承重命题(load 中-高,各支撑骨架洁净度一侧面)

靶B 是相2 用 import 的 adversarial-stress-testing(Lakatos monster-barring + boundary-probing)+ counterfactual-probing(Pearl PNS/PS)来攻的三条数学命题。本轮只做可证伪性 + 纯推理攻击(找反例/边界/必要充分性),sandbox 实测留下一轮。这三条决定骨架是"洁净统一"还是"统一但乏力"。

**B-命题① [load 高] 三塌缩子空间近似直和 + R_irr 小。** 原主张:三条塌缩通道作用的子空间(通道1 频率依赖/通道2 σ纠缠/通道3 a混淆)在切空间 T_E 上近似直和(夹角接近正交),且不可消残余 R_irr 的维数相对全谱小。下游依赖:四突破方向组的"正交分工"合法性(组I/II/III 各管 Φ 谱不同区段且不重叠)、奥卡姆回应的"少数正交公理"论证、B5 奥卡姆诊断量的对偶命题。若①假(三子空间强重叠/非直和),则"四组正交分工"是假象,通道间互相污染,地图退回纠缠的一团;若 R_irr 大,则"可辨部分是主体、不可辨是小残余"的乐观判断错,大部分信息其实不可恢复。证伪方向(纯推理):能否构造一个 E 上的情形使两通道子空间夹角趋于 0(强共线)?有没有理由相信 R_irr 必然小,还是只是希望它小?(counterfactual-probing 查:R_irr 小是承重假设还是已证结论——若是假设,它的 PN/PS 是多少)。

**B-命题② [load 高] 全部 hedge 由 gauge 对称(N_e·s 标度 ⊕ s−κ 移位)诱导。** 原主张:本问题里所有的不可辨(hedge,因果术语)都源于这两条规范对称——没有"杂项"不可辨。下游依赖:A5(R_irr=Noether 轨道)、"不可辨=对称性"的全部优雅、四语言同构里"零模/零奇异向量/curl/hedge 都对应同一对称轨道"的统一。若②假(存在不由这两对称诱导的 hedge),则 R_irr 不是干净的"对称轨道"而是"对称轨道 + 杂项",优雅论证出现裂缝,且四语言同构的 A4 也连带受损(因为同构正是建立在"都是同一对称的不同语言表述"上)。证伪方向(纯推理):能否找到一个不可辨方向,它在四语言之一里出现但不对应 N_e·s 或 s−κ 任一对称?Lakatos monster:构造一个 hedge 反例,看框架是 monster-barring(收窄定义排除它)还是真能吸收它。

**B-命题③ [load 中-高] φ 经 ΔG 因子化成立。** 原主张:适应度连接函数 φ 可以经由结合自由能 ΔG 因子化(φ 通过 ΔG 这个中间量依赖序列,而非直接任意依赖)。下游依赖:T-Crooks(Crooks/Jarzynski 连 a_DMS↔a_invivo,gap=耗散功——依赖 ΔG 的热力学意义)、a_DMS 与 a_invivo 的可连接性、B2 力学读出里 DHS 反演的 (k_0,x‡,ΔG‡) 解释。若③假(φ 不经 ΔG 因子化,即亲和→适应度不通过自由能这个单一中间量),则 T-Crooks 的桥断裂,a 两层无法用热力学功连接,S2(a 错观测量)的"定量化"失效。证伪方向(纯推理):φ 真只通过 ΔG 依赖序列吗?有没有 ΔG 之外的序列特征直接进 φ(如动力学 on-rate 独立于平衡 ΔG 的贡献——catch-bond 的非单调性正是这种嫌疑)?这条与 B2 的 catch-bond 解纠缠在机制上耦合,须一并查。

### 靶C · 假独立收敛(load 中,攻的是"信心来源"而非骨架本身)

靶C 由 independent-convergence-audit skill 专攻。它不直接攻骨架对错,而是攻"我们凭什么这么信骨架"——相2 三发散路"独立"收敛到测度流,我们把这当强佐证。若独立性是假的,佐证强度被高估,骨架须从"已被三重独立证据支持"降级为"一个吸引人的单一假设,仍待真验证"。

**C-主张 [load 中] 三发散路独立收敛到测度流骨架,构成强佐证。** 原主张:Phase-2 三条路(炸假设/数学手术/跨域六域)互不通气却收敛到同一骨架,这种独立汇聚是骨架为真的强信号。下游依赖:我们对骨架的信心水平、"不是补丁而是真简约"的论证(部分建立在"多路独立都见到同一简约结构")。证伪方向:三路真独立吗?共享通道有五个嫌疑——(a)同一 base model 同一训练先验(结构性共享,不可消);(b)同一对话 context(subagent 是否真隔离);(c)同一 prompt 框架(我是否在 Phase-2 把每张卡都框成"缺一个动力学对象的症状",从而把三路都预先瞄准了动力学统一子);(d)同一来源文献(三路是否都喂了 Doi-Peliti 相关文献);(e)同一美学拉力(三路都被"找到漂亮统一子"诱导)。这五个共享通道每一个都把"有效独立路数 N_eff"从 3 往 1 压。判别测试:造一条真正独立的第四路(不同框架、对测度流答案盲、最好换推理模式如自底向上从数据而非自顶向下从理论),看它是否也落到测度流——若是,真独立佐证;若否,原三路收敛是框架诱导的伪影。本轮产出:独立性账本 + N_eff 估计 + 我的框架指纹审计 + 校正后的信心陈述。注意:靶C 是健康的自我校准,不是要证明骨架错——骨架可能完全对,靶C 只防我们比证据允许的更自信(从而跳过真验证)。

### 靶D · sandbox 非循环性(load 特殊=元约束,必须造 sandbox 前先攻)

靶D 由 circular-validation-audit skill 专攻,且 spec 把它放相1 最先跑(前置闸)。它不是地图内的主张,而是"下一轮如何验证地图"的元约束。本轮按用户确认:审计的是**计划中的** DIY-4 sandbox 构造选择(完整设计下一轮才做),产出 = 交下轮的非循环约束清单。

**D-主张 [load 元级] DIY-4 升级版 sandbox 能非循环地验证地图的承重主张。** 风险:sandbox 用理论自己的假设(同一测度流生成元 / 同一 σ∘φ∘a 因子化 / 同一噪声律)造 ground truth,再跑理论的方法去"恢复",则"恢复成功"是构造保证的同义反复,PASS 携带零证据权重。下游依赖:整个 compute-only 验证路线的合法性、下一轮 sandbox 设计的全部价值。若 D 假(sandbox 如设计无法非循环地测任何承重主张),则下一轮造 sandbox 是烧算力产自欺,必须先改设计。证伪/审计方向:建非循环矩阵(行=承重主张 f=σ∘φ∘a 因子化/噪声律=形式X/σ 不可吸收/三通道直和/φ 经 ΔG,列=sandbox 真值构造选择 σ实现/a_invivo力学/φ噪声律/do()语义/测度流生成元),每格判 CIRCULAR/INDEPENDENT/PARTIAL;为每个红格附去循环手术(对抗性真值/held-out 机制/异形式 oracle)或标"此 sandbox 测不了须别的 oracle";产出"sandbox 应让理论失败的真值集"(把 sandbox 从确认机器变成真测试)。

### load 排序总表(相2 攻击优先级)

| 靶 | 承重主张 | load | 攻击 skill | 可证伪性预判 |
|---|---|---|---|---|
| A4 | 四语言同构 | 极高(★头号) | isomorphism-falsification | 高危:同构 burden 重,可能只是类比 |
| A2 | 单一过程三投影 | 极高 | elegance-trap-probe + 辩证 | 中:σ 不可吸收是已知裂缝 |
| A1 | 无静态 φ | 极高 | elegance-trap-probe | 高危:不存在性主张难证伪=UNFALSIFIABLE 嫌疑 |
| A5 | R_irr=Noether 轨道 | 高 | isomorphism + 靶B② | 中 |
| A3 | Φ 算子谱反演 | 高 | isomorphism-falsification | 中:线性层成立,全局非线性自认待验 |
| B① | 三子空间直和+R_irr小 | 高 | adversarial-stress-testing + counterfactual | 中:R_irr 小是假设还是结论? |
| B② | hedge 全由 gauge 诱导 | 高 | adversarial-stress-testing | 中:杂项 hedge 反例? |
| B③ | φ 经 ΔG 因子化 | 中-高 | counterfactual-probing | 中:on-rate 独立贡献嫌疑 |
| C | 三路独立收敛 | 中 | independent-convergence-audit | 校准类:N_eff 折算 |
| D | sandbox 非循环 | 元级 | circular-validation-audit | 前置闸:相1 先跑 |

### 7 个自建 skill 核对结果

Glob `context/selection-operator-v2/stress-test-skills/**/SKILL.md` 返回 7 个路径,逐一核对 frontmatter 完整性:

1. **falsification-first-stress-test**(type: campaign,produces: FalsificationLedger)— 伞 campaign,定义三桶赢条件(BROKEN/CORROBORATED/UNFALSIFIABLE)、no-hardening 铁律、按 claim type 的 strategy 路由表。✓
2. **adversarial-debate-truthseeking**(type: strategy,campaign: falsification-first-stress-test,produces: DebateBucketing)— 翻转 multiagent-debate;defender steelman 成最可证伪形式、critic 锁定 refuter、judge 不选赢家只分桶 + Mayo 严苛度检查。✓
3. **red-team-truthseeking**(type: strategy,produces: RefutationSurfaceMap)— 翻转 red-teaming;威胁面=承重主张、产出=每条的证伪条件、无 resilience 分无 hardening。✓
4. **isomorphism-falsification**(type: strategy,produces: IsomorphismVerdict)— 攻 A4;同构阶梯 rung 1-5、6 对 map 显式构造、维数/计数 sanity、降级措辞。✓
5. **circular-validation-audit**(type: strategy,produces: NonCircularityMatrix)— 攻 D;非循环矩阵、三招去循环手术、"应让理论失败的真值集"。✓
6. **independent-convergence-audit**(type: strategy,produces: ConvergenceIndependenceReport)— 攻 C;独立性账本、N_eff 折算、共因框架指纹、判别第四路。✓
7. **elegance-trap-probe**(type: strategy,produces: EleganceVerdict)— 攻 A1/A2;EARNED vs DECORATIVE、禁止集构造、风险预测、删除测试。✓

7 个 skill 全部存在且 frontmatter 完整。执行协议:本轮一律 Read 本地 SKILL.md 正文内联编排执行,不走 Skill 工具按名解析(它们不在 repo `.claude/skills/`)。

### import / 弃用登记

**import 保留(在 repo `.claude/skills/`,正常按名调用)**:
- **adversarial-stress-testing**(Lakatos《证明与反驳》/ Popper 证伪 / BVA 边界值分析)— 攻靶B 三命题的 monster-barring + boundary-probing 主力。已 Glob 确认在 repo 内。这个 skill 本身已是科学哲学工具(Lakatos 讲的就是数学定理如何被反例逼着精炼),求真导向天然契合,不改。
- **counterfactual-probing**(Pearl SCM 三步 / Lewis 可能世界 / PNS-PS)— 攻靶B 三命题的承重因子识别 + 必要/充分性评估。已 Glob 确认在 repo 内。对满是因果主张的框架直接对路(我们的 ∘ 就是因果 DAG 主张),不改。

**弃用(本轮不调用)**:
- **failure-anticipation FMEA**(RPN / S·O·D / IEC-60812)— 类别错配。FMEA 的 RPN 打分针对"工序/制造会不会出故障"的概率,套到"一个数学理论是否为真"上基本空转。若要前向失败分析,正确做法是 reframe 成"若理论为假,什么观测会暴露它"——而这就是波普尔式证伪,已被伞 campiagn 的三桶覆盖。故弃用 FMEA,其意图由 falsification-first 吸收。

### 相0 完成判据核对

- [x] 7 个 SKILL.md 路径确认存在且 frontmatter 完整(见上)。
- [x] 承重主张清单落入本 context:靶A 五条(A1-A5)+ 靶B 三条(B①②③)+ 靶C 一条 + 靶D 一条,共 10 条承重主张,按 load 排序成总表。四靶 A/B/C/D 全覆盖。
- [x] import/弃用决定登记(import 2 个、弃用 FMEA)。

相0 完成判据全部满足,无 backtrack condition(相0 无 backtrack)。

### Decisions Made

1. **承重主张的判据**:只收"若为假会塌下游结论"的主张,装饰性复述不计入承重主张(但会在靶A elegance-trap 里被识别为 DECORATIVE 嫌疑)。这避免把攻击力分散到无关紧要的措辞上。
2. **A1(无静态 φ)与 A4(四语言同构)预标 UNFALSIFIABLE 嫌疑**:A1 是不存在性主张(难证伪),A4 是同构主张(burden 重易降为类比)。相2 须优先查这两条到底禁止了什么——这正是伞 campaign 三桶里 UNFALSIFIABLE 桶的设计目的。
3. **靶C 定位为信心校准而非对错攻击**:明确写入清单——靶C 不证明骨架错,只防我们比证据允许的更自信。这与 independent-convergence-audit skill 的"健康结果=诚实重新校准"一致。
4. **靶D 前置**:相1 最先跑 circular-validation-audit,因为它既攻靶D 又给相2 其他靶提供"哪些主张 compute 现在可攻/哪些须 oracle"的输入。

### Open Questions(留给相1+)

- A4 四语言同构的维数/计数 sanity 能否在相2 廉价证伪(四语言是否各自独立给出 2 参数零集)?这是最便宜的一刀,相2 靶A 优先做。
- 靶C 的判别第四路用什么"真正独立"的推理模式?候选:自底向上从 CR9114 实际 DMS 数据出发,而非自顶向下从场论。相2 设计时定。
- 靶D 非循环矩阵里,σ 那一列(σ 实现)对 A2(σ 不可吸收)是否必然 CIRCULAR——若 sandbox 的 σ 实现就假设了 σ 不可吸收,则这条测不了,须异形式 oracle。相1 重点查。

相0 完成,进入相1 非循环前置闸。
