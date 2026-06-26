# Research Spec: 选择算子 σ∘φ∘a 全景地图 · 求真对抗(falsification-first stress-test)

> Generated: 2026-06-12
> North Star: 对 v3 三相产出的 σ∘φ∘a 全景地图施加一轮**求真导向**(非发表导向)的对抗——目标不是"摁死方案"也不是"加固以求存活",而是**找出我们自己忽视的缺陷,并逼问每条承重主张到底可不可证伪**。赢条件三桶:BROKEN(攻出真缺陷→改地图/降级)/ CORROBORATED(经严苛攻击仍立→挣到信心)/ UNFALSIFIABLE(根本攻不动因为没说可证伪的话→最坏,降级为猜想/类比)。这一轮直接服务用户的奥卡姆美学:优雅必须被"挣来"(forbids+predicts),不能是漂亮的再描述。
> Scope: 4 实质相(相1 非循环前置闸 + 相2 主攻 + 相3 辩证收口)+ 起手(相0)+ 收尾,session 数不预设(saturation 驱动,无上限)。注:相1 审计的是**计划中的** DIY-4 sandbox 构造选择(完整设计下一轮才做),产出=交下轮的非循环约束清单;靶B 三命题本轮只做可证伪性 + 纯推理攻击,sandbox 实测留下轮。
> Source: de-anthropocentric-research-engine / stress-test 阶段,**赢条件已翻转**。
> 前身: v3 spec(`docs/de-anthropocentric/specs/2026-06-12-selop-frontal-breakthrough-v3-spec.md`,三相全 `[x]`)产出全景地图,落于 `context/selection-operator-v2/2026-06-12-16-52-convergence.md`。
> ★skill 改装: 现有 stress-test 5 campaign 多为"发表/存活"导向,本轮**自建 7 个求真 skill**,落于 `context/selection-operator-v2/stress-test-skills/<name>/SKILL.md`(镜像 repo `.claude/skills/` 结构,供日后 issue 引入)。本轮按这 7 个 skill 设计**内联编排**执行(直接调,不先装进 repo)。

## 本轮定位(一句话,贯穿全 spec)

本轮交付物是一张 **FalsificationLedger(证伪账本)**——把全景地图的每条承重主张过一遍诚实猛攻,记录:它可证伪吗?什么观测/计算能推翻它?攻了没攻动?落入哪个桶?BROKEN 的记下教训与改法,CORROBORATED 的记下"它禁止了什么且扛住了",UNFALSIFIABLE 的红旗降级。**不产 resilience 分数,不产 hardening 清单。** 找到弱点只触发三条出路之一:改主张 / 降主张地位 / 记为诚实残余——绝不"打补丁让它看起来更强"(那正是用户要避免的补丁堆)。

## 攻击对象(承重主张清单,锁定四个靶子)

来自 v3 全景地图,按用户选定的首要目标:
- **靶A · 骨架 + 四语言同构**(头号嫌疑):无 per-seq 静态 φ、单一测度流 μ_t(Doi-Peliti/MSR 作用量)、f=σ∘φ∘a 三投影;R_irr=Φ 零谱,四语言同构(因果 hedge=反问题零奇异向量=场论零模=OT 非保守 curl=Fisher Φ*Φ 核)。
- **靶B · 三条承重命题**:① 三塌缩子空间近似直和 + R_irr 小;② 全部 hedge 由 gauge 对称(N_e·s 标度⊕s−κ 移位)诱导;③ φ 经 ΔG 因子化成立。
- **靶C · 假独立收敛**:相2 三发散路"独立"收敛到测度流——独立性是真的吗,还是同模型/同 context/同我框架诱导的伪影?
- **靶D · sandbox 非循环性**:DIY-4 升级版 sandbox 拿来验理论,但若建在理论自己的假设上,"通过"即循环论证。**必须在造 sandbox 之前先攻。**

## 7 个自建 skill(本轮工具集)

★这 7 个 skill **未引入 repo `.claude/skills/`,存于本地目录**;spec 内一律按本地路径直接读取正文执行(见下方"执行协议")。本地根:`context/selection-operator-v2/stress-test-skills/`。

| skill | 类型 | 来源 | 攻谁 | 本地路径(相对项目根) |
|---|---|---|---|---|
| falsification-first-stress-test | campaign(伞) | 新造 | 全局裁判口径(三桶) | `context/selection-operator-v2/stress-test-skills/falsification-first-stress-test/SKILL.md` |
| adversarial-debate-truthseeking | strategy | 翻转 multiagent-debate | 引擎·辩证(judge 不选赢家,只分桶) | `context/selection-operator-v2/stress-test-skills/adversarial-debate-truthseeking/SKILL.md` |
| red-team-truthseeking | strategy | 翻转 red-teaming | 引擎·系统探测(产出=证伪条件,非加固) | `context/selection-operator-v2/stress-test-skills/red-team-truthseeking/SKILL.md` |
| isomorphism-falsification | strategy | 新造 | 靶A 四语言同构(同构阶梯 1-5,降级到真实档位) | `context/selection-operator-v2/stress-test-skills/isomorphism-falsification/SKILL.md` |
| circular-validation-audit | strategy | 新造 | 靶D sandbox 非循环性(非循环矩阵,造前先攻) | `context/selection-operator-v2/stress-test-skills/circular-validation-audit/SKILL.md` |
| independent-convergence-audit | strategy | 新造 | 靶C 假独立收敛(N_eff 折算) | `context/selection-operator-v2/stress-test-skills/independent-convergence-audit/SKILL.md` |
| elegance-trap-probe | strategy | 新造 | 靶A 骨架(EARNED vs DECORATIVE) | `context/selection-operator-v2/stress-test-skills/elegance-trap-probe/SKILL.md` |

**执行协议(关键)**:本轮 7 个自建 skill **不通过 Skill 工具按名解析**(它们不在 repo `.claude/skills/`,按名调用会找不到)。执行时一律 **Read 上表"本地路径"列的 SKILL.md 正文,按其正文内联编排执行**(同 v3 轮 mechanism-gap-hunting 的内联编排做法)。下文各相 Execution Steps 写 skill 名处,均指"读该 skill 的本地 SKILL.md 正文执行"。

**保留直接 import(已求真,不改;这两个**在** repo `.claude/skills/`,正常按名调用)**:adversarial-stress-testing(Lakatos/Popper/BVA,打靶B)、counterfactual-probing(Pearl PNS/PS,打靶B)。**弃用**:failure-anticipation FMEA(类别错配:RPN 测工序故障,不测理论真假)。

---

## Global Context Protocol

- 攻击对象(全景地图)= `context/selection-operator-v2/2026-06-12-16-52-convergence.md`;三发散路证据 = `2026-06-12-15-25-divergence.md`;底图 = `2026-06-12-13-59-recon-v3.md`。
- **硬目录约定**:本轮所有 context-init 与 context-checkpoint 一律写入 `context/selection-operator-v2/`,INDEX 用该目录下 `INDEX.md`。
- **每相起手** context-init;**每个 strategy 完成后** context-checkpoint(硬性,≥500 行,追加 evidence + 产出)。
- **一相一 context 文件**,命名 `context/selection-operator-v2/<timestamp>-<相名>.md`。
- 所有 prose 段落单行成段,无段内换行。
- FalsificationLedger 是单一累积产物,每个 checkpoint 追加不覆盖。

## Global Execution Rules

- 每相 strategy 组合按本 spec;CC 可在 ±10% 内自主增减子代理/迭代轮次,超出须回报。
- **completion 由 saturation-detection 驱动,不以 session 数或时长封顶**(用户定:不设上限)。saturation per 靶 per 攻击路:连续 2 轮无新证伪向量且无新严苛测试即停。
- 工具现实:biorxiv MCP 主力之一;brave_llm_context 取正文逐字;semantic-scholar 取引文图谱。**子代理凭记忆不得编造 verbatim quote(全原创+求真:伪证据比缺证据更糟),取不到须显式声明并退二次精准取证。**
- 硬约束(来自 memory,不可违背):全原创(禁"现成工具套新域");架构限 Transformer/Mamba/Diffusion,图仅作 attention bias,无独立 GNN/CNN/RNN;AI4S 求真非发表;200 年雄心为真,compute 为首选验证路径但非硬约束(非 compute 路径不淘汰,记成本);绝不主动缩小问题。
- backtrack 须用户确认后执行。
- **赢条件铁律**:任何 strategy 都不得产出 resilience 分数或 hardening 清单;弱点只路由到 改/降/残余 三出路。judge/auditor 不选赢家,只分桶。

## Global Backtrack Conditions

- 相2 某攻击发现地图的某承重主张依赖的机制/文献在 v3 侦察未覆盖 → 回 v3 相1 补侦察(须用户确认)。
- 相2/相3 攻出 BROKEN 且破的是骨架本身(测度流分解或 f=σ∘φ∘a 三投影被推翻)→ 暂停回报用户,可能触发 North Star 再审视(超本轮范围)。
- 相1 非循环闸判定"sandbox 如设计无法非循环地测任何承重主张"→ 暂停,sandbox 设计须先改(交棒下一轮的 DIY-4 设计前置)。

---

## 相0 · 起手(登记 + 锁定攻击对象)

- **Objective**: 确认 7 个自建 skill 就绪;从全景地图抽取承重主张全集(四靶);登记本轮 spec 为产物。不做实质攻击。
- **Expected Input**: 全景地图(convergence.md);7 个 SKILL.md(stress-test-skills/);本 spec。
- **Focus Areas**: 核对 7 个 skill 文件存在且 frontmatter 完整;从地图抽取承重主张清单(按 load 排序:几条下游结论依赖它);确认弃用 FMEA、import 两个保留 skill。
- **Recommended Combination**: context-management → context-init。
- **Completion Criteria**: 7 个 SKILL.md 路径确认;承重主张清单(≥靶A/B/C/D 覆盖)落入 context;import/弃用决定登记。
- **Backtrack Condition**: 无。
- **Execution Steps**:
  - [x] context-init(新建 `<ts>-stress-test-init.md`)
  - [x] 核对 7 个 SKILL.md 存在
  - [x] 从 convergence.md 抽取承重主张清单(四靶,按 load 排序),写入 context
  - [x] 登记 INDEX.md 行

---

## 相1 · 非循环前置闸(circular-validation-audit 先跑)

> 逻辑前置:此相的产出决定后续哪些主张"compute 现在可攻"、哪些"须真值 oracle/介入"。必须最先跑,因为它同时是靶D 的攻击,又是相2 其他靶"可攻性"的输入。

- **Objective**: 对 DIY-4 升级版 sandbox 的**设计**(尚未建)做非循环审计——建非循环矩阵(承重主张 × sandbox 真值构造选择),找出哪些 sandbox 构造选择偷偷假设了它本应检验的主张(CIRCULAR 红格)。为每个红格附"去循环手术"或标"此 sandbox 测不了,须别的 oracle"。
- **Expected Input**: 全景地图承重主张清单(相0);v2 sandbox 草图 `context/digital-evolution-sandbox/2026-06-11-16-10-design.md`;v3 计划新增(σ/a_invivo Bell-k_off(F)/φ 噪声真值/do(F)/do(n_Ag)/冻结环境)。
- **Focus Areas**:
  - 非循环矩阵:行=承重主张(f=σ∘φ∘a 因子化/噪声律=形式X/σ 不可吸收/三通道直和/φ 经 ΔG),列=sandbox 真值构造选择(σ 实现/a_invivo 力学/φ 噪声律/do() 语义/测度流生成元)。每格 CIRCULAR/INDEPENDENT/PARTIAL。
  - 去循环手术三招:对抗性真值(用理论不预测的机制造 ground truth,看方法是否仍恢复 OR 诚实报告"测不了")/ held-out 机制(留方法不知道的自由参数,盲恢复)/ 异形式 oracle(一形式造、另一形式恢复)。
  - compute-only 咬合:R_irr 核/Weinstein 方向可能可证不可从观测恢复 → sandbox"恢复"它必须用真介入;审计须验介入是真的(真施 do(),恢复用介入数据),非观测法穿介入外衣。
  - **产出"sandbox 应让理论失败的真值集"**——把 sandbox 从确认机器变成真正的测试。
- **Recommended Combination**: falsification-first-stress-test → circular-validation-audit(主);spawn-agent 并行填矩阵(一 subagent 一行)。
- **Completion Criteria**: 非循环矩阵填满;每红格附去循环手术或"测不了"标注;GREEN-LIGHT/REVISE 判决;对抗性真值集列出。
- **Backtrack Condition**: 若每条承重主张都只有 CIRCULAR 格(sandbox 如设计测不了任何东西)→ 暂停,DIY-4 设计须先改(回报用户)。
- **Execution Steps**:
  - [x] context-init(新建 `<ts>-stress-test-noncircular.md`)
  - [x] circular-validation-audit:枚举 sandbox 构造选择 + 承重主张
  - [x] 填非循环矩阵(subagent 并行,一行一 agent)
  - [x] 每红格附去循环手术 / 标"须别的 oracle"
  - [x] 算 GREEN/REVISE 判决 + 列对抗性真值集
  - [x] context-checkpoint(非循环矩阵全集 + 判决 + 交棒 DIY-4 的非循环约束)

---

## 相2 · 主攻(四靶并行,subagent 隔离防污染)

> 相1→相2 路由:相1 标了每条主张"现在可攻 / 须 oracle"。相2 对四靶全展开攻击,每靶一路,各路 subagent 隔离(防 defender 框架污染 critic)。saturation per 靶判停。

- **Objective**: 对四靶施加证伪攻击,每条承重主张产出:可证伪吗?证伪条件是什么?攻了没攻动?初步分桶(BROKEN/CORROBORATED/UNFALSIFIABLE)。本相只管穷尽攻击与初判,终裁在相3 辩证收口。
- **Expected Input**: 相0 承重主张清单;相1 非循环矩阵(标可攻性);全景地图三发散路证据。
- **Focus Areas**:
  - **靶A 同构** → isomorphism-falsification:四对象精确钉死;6 对(或共同目标)map 显式构造;monster-hunting;维数/计数 sanity(两生成元?四语言各自独立给出 2 参数零集?);定档位 1-5,降级措辞。
  - **靶A 骨架** → elegance-trap-probe:禁止集构造(骨架禁止什么可检验的观测?空=DECORATIVE)/ 风险预测猎取(与旧 φ∘a 不同且 sandbox 可检的预测)/ accommodation 审计(三通道是被骨架预测还是事后塞进去)/ 删除测试(删骨架留三通道,丢的是预测力还是只是故事?)。
  - **靶B 三命题** → adversarial-stress-testing(Lakatos monster-barring + boundary-probing)+ counterfactual-probing(Pearl PNS/PS:每命题的承重因子、必要/充分性)。
  - **靶C 假独立** → independent-convergence-audit:独立性账本(同模型/同 context/同框架/同文献/同美学拉力 → N_eff)/ 找共因框架(我的指纹:Phase-2 是否把每张卡都框成"缺动力学对象的症状")/ 判别测试(造真正独立第四路,若也落测度流=真独立佐证,若否=框架诱导)/ 相关误差检查 / 校正信心。
  - 辨识诚实贯穿:攻击不得偷换 a_DMS 冒充 a_invivo、不得在不可辨等价类内谎称恢复绝对刻度。
- **Recommended Combination**: falsification-first-stress-test → 四 strategy 并行(isomorphism-falsification / elegance-trap-probe / adversarial-stress-testing+counterfactual-probing / independent-convergence-audit);spawn-agent 一靶一路隔离。
- **Completion Criteria**(saturation 驱动):
  - 每靶攻击达饱和(连续 2 轮无新证伪向量且无新严苛测试);
  - 四靶都被攻过(无某靶整体跳过);
  - 每条承重主张带 {可证伪? | 证伪条件 | 攻击尝试 | 初步桶};
  - 靶A 同构定出真实档位(若 < 1 给出须改的措辞);靶A 骨架定出 EARNED/DECORATIVE/PROMISING(若未挣到给出命名预测 P);靶C 给出 N_eff 与校正信心。
- **Backtrack Condition**: 某攻击依赖的机制/文献 v3 未覆盖 → 回 v3 相1 补侦察(须用户确认)。攻出 BROKEN 且破骨架本身 → 暂停回报。
- **Execution Steps**:
  - [x] context-init(新建 `<ts>-stress-test-assault.md`)
  - [x] 靶A 同构:isomorphism-falsification(subagent 隔离)
  - [x] context-checkpoint(同构档位 + 措辞改 + monster 清单)
  - [x] 靶A 骨架:elegance-trap-probe(subagent 隔离)
  - [x] context-checkpoint(禁止集 + 风险预测 + 删除测试 + EARNED/DECORATIVE 判)
  - [x] 靶B 三命题:adversarial-stress-testing + counterfactual-probing(subagent 隔离)
  - [x] context-checkpoint(三命题 monster/boundary + PNS/PS + 初步桶)
  - [x] 靶C 假独立:independent-convergence-audit(subagent 隔离;含独立第四路)
  - [x] context-checkpoint(独立性账本 + N_eff + 共因框架 + 校正信心)

---

## 相3 · 辩证收口(三桶终裁 + FalsificationLedger)

> 把相2 四靶的初判过一遍辩证引擎做终裁:defender 把每条主张 steelman 成最可证伪形式,critic 锁定一个 refuter 攻,judge 不选赢家只分三桶并做严苛度检查。red-team-truthseeking 补系统覆盖(证伪条件全集 + devil's-advocate 攻"整骨架是自我框架的诱人产物")。

- **Objective**: 对相2 每条主张做三桶终裁,产出完整 FalsificationLedger;每条 BROKEN 记refutation+改法,CORROBORATED 记"禁止了什么且扛住了"+严苛度,UNFALSIFIABLE 红旗降级。汇出诚实残余清单(compute 不可证伪、须外部 oracle 的主张 + 成本)。
- **Expected Input**: 相2 四靶攻击全集(带初步桶);相1 非循环矩阵。
- **Focus Areas**:
  - adversarial-debate-truthseeking:per 主张 defender steelman→最可证伪形式;critic 承诺 refuter 类型再攻;cross-exam 抓滑头逃逸(中途改定义/退守弱主张/"只是模型"挡箭);severity 检查(若主张为假这攻击会抓到吗?抓不到则升级再裁);分桶。
  - red-team-truthseeking:承重主张=威胁面;Key-Assumptions-Check 分类隐藏假设(SUPPORTED/ASSERTED/CONVENIENT,后两者优先攻);Platt 强推理构证伪条件(clean/oracle-only/none);devil's-advocate 攻"骨架=框架诱人产物"。
  - 严苛度铁律(Mayo):只有经严苛测试(若假则大概率会失败)才记 CORROBORATED;过弱测试存活=仍"未测",不升级。
  - **不产 resilience 分数、不产 hardening**;弱点→改/降/残余。
- **Recommended Combination**: falsification-first-stress-test → adversarial-debate-truthseeking + red-team-truthseeking;spawn-agent 隔离 defender/critic/judge 防污染。
- **Completion Criteria**:
  - 相2 全部承重主张都被分桶(无遗漏);
  - 每桶记录完整(BROKEN:refutation+改法 / CORROBORATED:禁止内容+严苛度 / UNFALSIFIABLE:降级措辞);
  - 诚实残余清单(须外部 oracle 的主张 + 成本)落定;
  - FalsificationLedger 能回答"地图每条承重主张可证伪吗、什么能推翻它、攻了什么结果、该改/降/留"。
- **Backtrack Condition**: 终裁发现承重主张全集存在重大遗漏靶(四靶之外的承重主张未被攻)→ 回相0 补清单(须用户确认)。
- **Execution Steps**:
  - [x] context-init(新建 `<ts>-stress-test-ledger.md`)
  - [x] adversarial-debate-truthseeking(per 主张 steelman→攻→分桶,subagent 隔离三角色)
  - [x] context-checkpoint(辩证分桶 + cross-exam 逃逸记录 + severity)
  - [x] red-team-truthseeking(威胁面=主张全集,证伪条件全集 + KAC + devil's-advocate)
  - [x] context-checkpoint(证伪条件全集 + 假设分类 + 骨架-as-artifact 风险)
  - [x] 汇 FalsificationLedger(三桶终裁 + 诚实残余清单)
  - [x] context-checkpoint(完整 ledger)

---

## 相收尾 · 落盘交棒

- **Objective**: 对抗结果固化,把"改地图/降级/诚实残余"回写到地图相关记录,列出对 DIY-4 sandbox 的非循环约束清单(交下一轮)。
- **Recommended Combination**: context-management → context-checkpoint。
- **Completion Criteria**: FalsificationLedger + 四靶攻击全集 + 非循环矩阵 + 诚实残余清单 全部落盘;INDEX 更新;memory/CLAUDE.md 进展更新;下一轮(DIY-4 sandbox 设计,带非循环约束)入口显式列出。
- **Execution Steps**:
  - [x] context-checkpoint(四相汇总)
  - [x] 更新 INDEX.md
  - [x] 回写地图:BROKEN 改处 / 降级措辞 / 诚实残余(标注来源 ledger 条目,不静默改)
  - [x] 更新 memory(project_selop_v3_execution_progress 或新建对抗轮进展)+ CLAUDE.md
  - [x] 列下一轮待办:DIY-4 升级版 sandbox 设计(带相1 非循环约束 + 相2 命名预测 P + 对抗性真值集)

---

## 推迟到下一轮(本轮不展开)

- **DIY-4 升级版 sandbox 设计**:在 `context/digital-evolution-sandbox/2026-06-11-16-10-design.md` 上正式设计 v3(加 σ/a_invivo Bell-k_off(F)/φ 噪声真值 + do(F)/do(n_Ag)/冻结环境),**带入本轮相1 非循环约束 + 相2 elegance-trap 命名的风险预测 P + 对抗性真值集**(让 sandbox 能让理论失败,而非只确认)。
- 本轮证伪账本里 CORROBORATED 的主张进 sandbox 做"严苛测试"实测;UNFALSIFIABLE 降级的不浪费 sandbox 算力;须 oracle 的诚实残余记成本。

---

## v3 → 对抗轮 改装对照(供执行者快速对齐)

| 维度 | v3(全景地图轮) | 本轮(求真对抗轮) |
|------|----|----|
| 阶段 | deep-insight→creative→convergence | **stress-test(赢条件已翻转)** |
| 赢条件 | 全景地图绘成 | **三桶:BROKEN/CORROBORATED/UNFALSIFIABLE** |
| 对存活的态度 | N/A | **存活非目标;主动求碎;攻不动=最坏(UNFALSIFIABLE)** |
| skill | 现成 SOP | **自建 7 求真 skill;弃 FMEA;import 2 保留** |
| 产出 | 全景地图 | **FalsificationLedger(改/降/残余,无 resilience 分无 hardening)** |
| sandbox | 推迟 | **非循环性先攻(相1 前置闸);完整设计仍推迟下一轮** |
| 奥卡姆美学 | 收敛偏好溶卡动作 | **elegance-trap-probe 把"优雅"变可证伪判据(EARNED vs DECORATIVE)** |
