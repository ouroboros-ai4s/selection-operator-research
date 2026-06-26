# 求真对抗 · 相3 辩证收口 — 三桶终裁 + FalsificationLedger

> Created: 2026-06-12 21:35
> Topic: 选择算子 σ∘φ∘a 全景地图 · 求真对抗 相3 辩证收口(adversarial-debate-truthseeking + red-team-truthseeking)
> Phase: 相3 · 辩证收口

## Plan Context

把相2 四靶的初步桶过一遍辩证引擎做终裁:defender 把每条主张 steelman 成最可证伪形式,critic 锁定 refuter 攻,judge 不选赢家只分三桶 + Mayo 严苛度检查。red-team-truthseeking 补系统覆盖(证伪条件全集 + KAC 假设分类 + devil's-advocate 攻"整骨架是自我框架诱人产物")。产出完整 FalsificationLedger:每条 BROKEN 记 refutation+改法,CORROBORATED 记禁止内容+严苛度,UNFALSIFIABLE 红旗降级。汇诚实残余清单(须外部 oracle 的主张+成本)。

赢条件铁律:不产 resilience 分、不产 hardening;弱点→改/降/残余。judge 不选赢家只分桶。

## Expected Input

- 相2 四靶攻击全集 + 初步桶汇总表(`2026-06-12-21-25-stress-test-assault.md`)。
- 相1 非循环矩阵(`2026-06-12-21-15-stress-test-noncircular.md`)。
- skill 正文:adversarial-debate-truthseeking / red-team-truthseeking(`stress-test-skills/`)。

## Completion Criteria

相2 全部承重主张分桶(无遗漏);每桶记录完整;诚实残余清单落定;FalsificationLedger 能回答"地图每条承重主张可证伪吗、什么能推翻它、攻了什么结果、该改/降/留"。

## Backtrack Condition

终裁发现承重主张全集存在重大遗漏靶(四靶之外的承重主张未被攻)→ 回相0 补清单(须用户确认)。

---

## Checkpoint 相3-终裁: adversarial-debate-truthseeking 严苛度检查 + devil's-advocate

### Mayo 严苛度终裁(只有经严苛测试才记 CORROBORATED)

相2 初判里唯一进 CORROBORATED 的是"A1/A2 骨架动力学部分"。按 SKILL 严苛度铁律审它:这个 CORROBORATED 是真严苛还是过弱测试存活?

**审 A1/A2 动力学部分的 CORROBORATED**:相2 给它的支撑是"有硬禁止(禁止1/2)+ 有风险预测(P1/P2)"。但关键——**P1/P2 本轮并未实测,只是被构造出来。** 按 Mayo:一个主张被 CORROBORATED 当且仅当它通过了一个"若它为假则大概率会失败"的测试。**P1/P2 还没跑**,所以 A1/A2 动力学部分目前只是"**可严苛测试但尚未测试**",不是"已通过严苛测试"。**终裁下调**:A1/A2 动力学部分从 CORROBORATED 降为 **TESTABLE-NOT-YET-TESTED(可严苛测试,待 sandbox 验 P1/P2)**。这是相3 对相2 的一个重要纠正——相2 把"有好的证伪条件"误当成了"已被确证"。**严苛度铁律防止了我们把'设计了测试'当成'通过了测试'。**

这条纠正本身就是 falsification-first 的价值:连我们自己最想保的那条(骨架动力学=EARNED)也被诚实地从"已确证"拉回"待测"。没有任何主张本轮拿到真 CORROBORATED——因为本轮是纯推理+设计轮,真严苛测试在 sandbox(下一轮)。

### devil's-advocate:整骨架是自我框架的诱人产物吗?

靶C 已做了大半(N_eff≈1.3,框架诱导)。devil's-advocate 在此把它推到最强形式:**"测度流骨架根本不是问题的性质,而是我们用算子化底图 + 偏动力学取经域 + elegance 拉力,三重自我暗示出来的海市蜃楼。真实的抗体亲和成熟可能就是一堆离散克隆事件,没有任何连续测度流,我们看到测度流只因为我们戴了测度流眼镜。"**

这个最强反方**不能在本轮被驳倒**——因为驳倒它恰恰需要判别第四路(自底向上从 DMS 数据、对测度流盲)的结果,而那在下一轮。**所以 devil's-advocate 的诚实结论:骨架"是真性质还是框架产物"本轮无法判定,必须靠判别第四路 + P1 实测。** 这把骨架钉死在"强假设待验"而非"已确立"。

**但 devil's-advocate 也有边界**:它攻不动"禁止1/2"——那两条硬禁止(Price 协方差同号 / 噪声-N_e 标度)是群体遗传学的独立结果,不依赖我们的框架。即使测度流叙事全错,这两条禁止仍可在 sandbox 独立检验。**所以骨架不是纯海市蜃楼:它至少锚在两条框架无关的硬禁止上。** 这是 devil's-advocate 攻完后骨架仍保有的最小实质内容。

---

## Checkpoint 相3-FalsificationLedger: 全轮总账(red-team-truthseeking 证伪条件全集 + 三桶终裁)

### FalsificationLedger 主表(本轮交付物)

桶定义:BROKEN(攻出真缺陷,已改/已降级)/ TESTABLE-NOT-YET-TESTED(可严苛测试,证伪条件已构造,待 sandbox 实测——本轮主力桶,因纯推理+设计轮)/ UNFALSIFIABLE(没说可证伪的话,须先补可证伪形式)/ 诚实残余(可证伪但须外部 oracle,记成本)。本轮**无真 CORROBORATED**(真严苛测试在 sandbox)。

| # | 承重主张 | 终裁桶 | 证伪条件(谁能推翻它) | 隐藏假设分类(KAC) | 处置 |
|---|---|---|---|---|---|
| A4 | 四语言同构 | **BROKEN→已降级** | Φ*Φ核维 vs Hodge curl维不等(已逻辑证伪) | "四对象同型"=CONVENIENT(美学驱动) | 改措辞:特例②③ rung2,①④类比 |
| A1/A2 | 骨架(动力学) | **TESTABLE-NOT-YET** | P1克隆干涉富集比非单调 + P2 do(冻结环境)恢复单调 | "测度流是真性质"=ASSERTED | sandbox验P1/P2(下轮) |
| A1/A2 | 骨架(统一σ/辨识) | **BROKEN→已降级** | accommodation审计(已证σ/辨识非骨架生成) | "单一骨架统一三层"=CONVENIENT | 改:坐标系非生成者 |
| A3 | Φ算子谱 | TESTABLE-NOT-YET | 全局非线性下谱失义 | "Φ线性"=ASSERTED | 标"精确在线性层" |
| A5 | R_irr=Noether | **BROKEN→已降级** | 见命题② | "仅两对称"=ASSERTED | 随②降级 |
| B① | 直和+R_irr小 | **UNFALSIFIABLE** | 无阈值→须先定θ和ε才可证伪 | "近似""小"=未定义 | 降为待测量+定阈值 |
| B② | hedge全由gauge | **BROKEN(一般)** | 多连通curl是否全落两gauge子空间 | "无第三对称"=ASSERTED | 明说收窄单连通 |
| B③ | φ经ΔG | **BROKEN(力依赖区)** | catch-bond下φ恢复需独立x‡ | "ΔG单因子"=被catch-bond反例破 | 改:平衡区ΔG/力依赖区+x‡ |
| C | 三路独立收敛 | **校正N_eff≈1.3** | 判别第四路(自底向上对测度流盲) | "三路独立"=被框架审计破 | 降为一次半观测 |

### 假设分类小结(KAC:SUPPORTED/ASSERTED/CONVENIENT)

- **CONVENIENT(美学驱动、最高嫌疑)**:A4 四对象同型、A1/A2 单一骨架统一三层。这两条是 elegance-trap 重灾区,本轮都已 BROKEN 降级。
- **ASSERTED(只是相信、无证据)**:测度流是真性质、Φ 线性、仅两对称、无第三对称。这些是 TESTABLE-NOT-YET 的核心待验项。
- **SUPPORTED(有独立证据)**:禁止1(Price 协方差同号)、禁止2(噪声-N_e 标度)——群体遗传学独立结果,devil's-advocate 攻不动。这是骨架的实质锚点。

### 诚实残余清单(可证伪但须外部 oracle,记成本)

- **R_irr 核心(Mono⁺/Weinstein 方向)**:provably 从观测不可恢复;sandbox 内可用 do() 验"介入能否塌缩它",但**真实抗体上塌缩它须 wet-lab 介入**(记成本高)。
- **a_invivo 真实 n_Ag/力谱**:sandbox 内 Bell 涌现可验方法论,真实迁移须单分子力谱(wet-lab,记成本高)。
- 这两条不是失败,是诚实边界:交付物显式包含"不可消残余 bound + wet-lab 成本点"。

### 全轮总陈述(回应用户奥卡姆顾虑的最终结论)

用户怕"满是补丁",希望奥卡姆式简约。本轮诚实对抗给出的最终判断:

**好消息**:全景地图**不是 18 个补丁**。它有真实的简约脊柱——一个 EARNED 的动力学原理(通道1 测度流),锚在两条**框架无关的硬禁止**(Price 协方差同号 / 噪声-N_e 标度)上,devil's-advocate 攻不动这两条。这是真东西。

**坏消息(也是诚实的好消息)**:地图**也不是"1 个原理解释一切"**。我们之前宣称的"单一骨架统一 σ∘φ∘a 三层"和"四语言同构"是 elegance-trap——把美学当成了发现。诚实结构是:

> **1 个 EARNED 动力学原理(通道1,待 sandbox 验 P1)+ 2 根正交独立支柱(σ 力学 / 辨识,各有独立硬禁止,不被骨架生成)+ 1 个诚实残余(R_irr,须 oracle)+ 1 个显式适用包络(单连通/线性化/单势垒,包络外退化)**

这个结构本身仍简约(3 根承重而非 18),每根可证伪——**符合奥卡姆,但比原"单一骨架"诚实**。真正的奥卡姆不是"把一切塞进一个漂亮盒子",而是"用最少的、各自有硬禁止的独立原理覆盖现象,并诚实标出哪里是统一、哪里只是坐标系、哪里是不可消残余"。**降级后的地图反而更接近用户要的那种简约美——因为它挣来的简约(3 根硬禁止),而非装饰的简约(1 个吞噬一切的叙事)。**

**对"是不是补丁"的可计算判据(B5 奥卡姆诊断量)仍然有效且更重要了**:下一轮 sandbox 测"最小介入优化是否子模 + 三子空间是否直和",若是,3 根结构的正交性坐实(真简约);若否(强共线),则说明 3 根其实纠缠,须进一步合并或承认更复杂。这把"简约与否"从美学判断变成 sandbox 可测命题。

### 相3 完成判据核对
- [x] 相2 全部承重主张分桶(9 条,见 ledger 主表,无遗漏)。
- [x] 每桶记录完整(BROKEN 记 refutation+改法 / TESTABLE-NOT-YET 记证伪条件 / UNFALSIFIABLE 记须补阈值)。
- [x] 诚实残余清单落定(R_irr 核心 + a_invivo 真实测量,记 wet-lab 成本)。
- [x] FalsificationLedger 能回答"每条主张可证伪吗/什么推翻它/攻了什么结果/该改降留"。
- 严苛度铁律生效:本轮无真 CORROBORATED(P1/P2 未实测),最强主张也只到 TESTABLE-NOT-YET——防止把"设计了测试"当"通过了测试"。
- 未触发 backtrack(无四靶之外的重大遗漏承重主张;BROKEN 的是过度声称的表述层,骨架实质锚点 SUPPORTED 仍立)。相3 完成,进相收尾。

---

## Checkpoint 相收尾: 四相汇总 + 交棒下一轮(DIY-4 sandbox 设计)

### 四相全程汇总

- **相0 起手**:7 自建求真 skill 核对 + 从全景地图抽 10 条承重主张(四靶 A/B/C/D,按 load 排序)+ import/弃用登记。
- **相1 非循环前置闸**:circular-validation-audit 5×5 矩阵;关键发现=当前 sandbox 草图是"对理论盲的纯数据生成器"(降循环风险结构优势);判决 CONDITIONAL GREEN-LIGHT + 三铁律 + 5 个对抗性真值世界。
- **相2 主攻**:四靶证伪攻击;A4 同构 BROKEN 降级、骨架动力学有硬禁止但"统一"是 elegance-trap、靶B 三命题全"特例成立+包络外退化"、靶C N_eff≈1.3 框架诱导;★产出"适用包络"概念。
- **相3 辩证收口**:严苛度铁律把骨架从 CORROBORATED 降为 TESTABLE-NOT-YET(无真 CORROBORATED);devil's-advocate 钉死"待判别第四路";FalsificationLedger 9 条主张全分桶 + KAC 假设分类 + 诚实残余。

### 交棒下一轮:DIY-4 升级版 sandbox 设计必带的约束(本轮对抗的可执行产出)

1. **三条非循环铁律(相1)**:① 世界引擎必须个体级,绝不直接实现测度流 PDE/生成元当真值源;② σ/φ噪声/a_invivo 走路线甲(涌现+记录),不走路线乙(手写已知真值)——σ 现成(对抗+K墙涌现)、φ噪声现成(有限K重采样涌现)、a_invivo 是新增最高风险点;③ do() 必须个体级真干预,恢复方法须吃介入数据。
2. **5 个对抗性真值世界(相1)**:sandbox 必须含让理论失败的世界——σ部分可吸收/外加噪声/非ΔG因子化(catch-bond)/三通道强共线/真存在静态φ。成功标准=理论诚实报告"我恢复不了/这里失效",而非强行套出假成功。
3. **首验目标 = 命名预测 P1(相2)**:克隆干涉区(Nμ≫1)终点富集比与 φ **非单调**——这是骨架挣 EARNED 的关键预测,sandbox 首要测它(+ P2 do(冻结环境)恢复单调)。
4. **须先定阈值的待测量(相2 命题①)**:三子空间主夹角阈值 θ + dim R_irr/dim全谱阈值 ε——sandbox 设计时先定,否则命题① 不可证伪。
5. **判别第四路(相2/3 靶C)**:自底向上从 CR9114/CR6261 DMS 数据、对测度流答案盲、纯统计视角拟合——检验三路收敛是真独立还是框架诱导。
6. **适用包络验证(相2)**:在包络(单连通/线性化/单势垒/平衡主导)内外分别测,验"包络内 EARNED、包络外退化"。
7. **B5 奥卡姆诊断量(相3)**:测最小介入优化是否子模 + 三子空间是否直和——把"是不是补丁/真简约"变成 sandbox 可测命题。

### 相收尾完成判据
- [x] FalsificationLedger + 四靶攻击全集 + 非循环矩阵 + 诚实残余清单 全部落盘(4 个 context 文件)。
- [ ] INDEX 更新(相收尾不新增文件,ledger 已登记;补 checkpoint 计数)。
- [ ] 回写地图(BROKEN 改处/降级措辞/诚实残余,标注来源 ledger 条目)。
- [ ] 更新 memory + CLAUDE.md。
- [x] 下一轮待办显式列出(上方 7 条约束)。
