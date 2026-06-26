# Stage 3 — 定稿判定(convergence)

> Created: 2026-06-07 20:13
> Topic: 抗体选择算子学习 — 验证方案对抗式简化 / Stage 3 定稿判定
> Phase: convergence (feasibility-assessment staged-gate + steel-manning winner-stress-testing)

## Plan Context

对 Stage 2 saturation 出的 vN 做最终可行性判定 + 终极对抗,确认"最小且非循环"且没为简化砍掉真承重的东西。loop 之外的独立终检,用没参与 loop 的视角再审。

## Expected Input(已就位)

- vN = v3(Stage 2 r4 末定稿候选)= Spike0 + P07玩具SDE + CV三子检验 + P16零泄漏 + CS声明
- 完整 state ledger(r1-r4 复活/冗余清单)
- 5 条 Stage4 必验条件 C1-C5
- 真冗余清单 9 件(P01/P02/P04/P05/P06原/P20外壳/P14独立/P08独立/P10)

## Stage 3 Completion Criteria

- [ ] staged-gate 出 GO/KILL/RECYCLE 明确裁决
- [ ] steel-manning 出 ACCEPT/REJECT/REVISE
- [ ] 复活终检:真冗余9件逐项"确认可砍/需复活"判定表
- [ ] 产出定稿方案 v_final + 判定表

## Backtrack 条件

- staged-gate=KILL → 回 Stage 2 放宽 saturation 续跑
- steel-manning 复活承重件 → 回 Stage 2 重纳跑一轮
- =RECYCLE/REVISE → 局部修订 vN 重跑本 stage

---

## 1. staged-gate-evaluation(可行性 gate)

用"可执行验证方案"的 gate 标准审 vN:数据可得、判据明确、三不变量全绿、工程量最小。逐项 gate。

**Gate 1 — 数据可得性**:
- Spike0 + CV 需 CR9114 Source data 1(65536×3 −logK_D),CC-BY gold OA 直接下载。✅
- P07 需玩具数据(自造低维 SDE,无外部依赖)。✅
- N3 baseline 需 Phillips pairwise epistasis 模型(原文 source data 系数)。✅
- 裁决:**PASS**。所有数据开源即得,无 DUA、无公司数据依赖。

**Gate 2 — 判据明确性**:
- I1:CV-Ⅲ cross-condition Spearman 显著 + 打败 N3 baseline。✅ 明确。
- I2:P07 玩具 SDE 唯一恢复 f_toy(相关性/排序)+ gating① 一致性。✅ 明确。
- I3:CV-Ⅱ 多次置换 null 分布 p<0.05 + CV-Ⅰ 跨抗原方向一致率。✅ 明确。
- 裁决:**PASS**。每个判据可量化(Spearman/p值/一致率),非"显著好"式模糊。但具体阈值待 Stage 4 预注册(C1-C5)。

**Gate 3 — 三不变量全绿**:
- I1🟢/I2🟢/I3🟢,均带 Stage 4 必验条件 C1-C5。
- 裁决:**PASS(有条件)**。三者绿,条件都是"实验设计层面可落地"(数据预注册、λmin 实测、置换次数),非"方法成立性存疑"。这是 GO 而非 RECYCLE 的关键判断——条件不质疑方法能不能成立,只要求实验设计时把参数定死。

**Gate 4 — 工程量最小**:
- vN 5 核心件,经 4 轮对抗 + resurrection 证明砍不动。零逼真仿真器、零手搓 f*。
- 裁决:**PASS**。这是 loop 的直接产物,最小性有对抗背书。

**Gate 5 — 可操作化(外部执行者零追问)**:
- Spike0/CV/P16 操作化细节已在 r1-r3 附录给出(数据 schema、censored loss、CV 三子检验规格、留出策略)。
- P07 玩具 SDE 规格已给(低维 + 已知 f_toy/σ_toy + 反推 + gating①)。
- 待 Stage 4 补:各判据的具体数值阈值、玩具 SDE 的精确维度/参数、运行环境依赖。
- 裁决:**PASS(条件:Stage 4 补阈值与环境细节)**。

### staged-gate 总裁决:**GO**

vN 通过全部 5 个 gate(Gate 3、5 带"Stage 4 落地条件")。GO 理由:数据开源即得、判据可量化、三不变量绿、工程最小、可操作化路径清晰。所有"条件"都是 Stage 4 实验设计层面的参数定死,非方法成立性的疑问——这正是 GO(进 Stage 4 实验设计)而非 KILL(方法不成立)或 RECYCLE(需大改重跑)的判断依据。

**非 KILL 理由**:无任何 gate 失败;三不变量无红灯。
**非 RECYCLE 理由**:vN 无需结构性修改;5 条 Stage4 条件是落地参数化,非方案缺陷。

---

## 2. steel-manning / winner-stress-testing(pre-mortem:假设 vN 执行失败)

用没参与 loop 的视角,假设 vN 在 Stage 4 执行后失败了,倒推最可能的失败模式。这是 loop 可能漏掉的盲区扫描。

**失败模式 FM1(致命候选):gating① 实测显示 PLM 空间动力学非梯度流**。
- 情景:Stage 4 跑 P07 玩具 SDE 的 gating① 检验,发现"静态拟合取梯度"与"轨迹反推 drift"系统性偏离(drift 显著有旋)。
- 后果:r2 的"完备区静态=动力学"裁决在真实 PLM 空间不成立 → Spike0 学的静态地形 ≠ 动力学选择算子 → 核心 claim 受损。
- loop 漏了吗?→ 没漏,但 loop 用"思想实验级"推演,真实数值留 Stage 4。这是 C3 条件的风险。
- 缓解:r2 已备弱化退路——若非严格梯度流,T2(Lavenant)只要求 drift 可估(不要求势函数),vN 可降级 claim 为"学到 drift 场"而非"学到势函数 f"。CV 验证(用 Kd 排序)对此稳健(排序不依赖严格势)。所以 FM1 不致命,触发 claim 降级而非方案推翻。
- 严重度:中(claim 降级,非方案死)。

**失败模式 FM2:gating② a(x) 在 PLM 空间退化(λmin≈0)**。
- 情景:Stage 4 实测 a(x)=σσᵀ 推前到 PLM 空间后秩亏,λmin 接近 0。
- 后果:T2 唯一性论证失效 → I2 可辨识性在真实表征空间不可达。
- loop 漏了吗?→ 没漏,这是 C2 条件,Stage 0 就标了。
- 缓解:Stage 0 附录 A 备了处置——换更低维表征使 J 满秩 / 加各向同性正则 εI / 只在非退化子流形声明可辨识。
- 严重度:中(有处置路径,但可能需换表征)。

**失败模式 FM3(loop 可能真漏的):CR9114 的 −logK_D 与选择压 f 的对应被破坏**。
- 情景:Spike0 假设 −logK_D 地形单调对应选择势 f。但真实亲和力成熟中,选择不只看结合强度——还有表达量、稳定性、聚集倾向、polyreactivity 等"可开发性"压力。CR9114 只测结合 Kd,漏了这些。如果真实选择压里结合只占一部分,那 Spike0 学的"Kd 地形"≠"选择算子 f"。
- loop 漏了吗?→ **部分漏了**。r2 附录 r2-A 提了"−logK_D 与 f 单调对应可能非线性",但只考虑了结合自由能的非线性,**没考虑"选择压含结合以外的维度"**。这是 steel-manning 新发现的盲区。
- 缓解:CS 声明须扩展——明确"vN 验证的是'结合亲和力驱动的选择'这一选择压分量,其他分量(表达/稳定性/可开发性)未覆盖"。这不推翻 vN(结合确是亲和力成熟的主选择压,Phillips 数据就是为此),但需诚实标注 claim 范围。
- 严重度:低-中(claim 范围收窄,非方案死;但必须补进 CS)。

**失败模式 FM4:N3 baseline 太强,CV-Ⅲ 打不赢**。
- 情景:Phillips 的 pairwise epistasis 模型本身已很强(CR9114 数据上 pairwise 解释力高),f̂ 难显著超越。
- 后果:CV-Ⅲ 的"打败 baseline"判据不过 → I1 机制鉴别力存疑。
- loop 漏了吗?→ 没漏,N3 是 r1 主动引入的强 baseline。
- 缓解:若 f̂ 打不赢 pairwise,说明 CR9114 的选择结构主要是 pairwise(高阶 epistasis 弱),那 f̂ 该聚焦它能超越的地方——cross-antigen 泛化(pairwise 模型逐抗原拟合,跨抗原泛化弱)。CV-Ⅲ 的 cross-condition 设计正好针对此。所以 FM4 触发"换对照角度"(比泛化而非比拟合),非失败。
- 严重度:低(有应对)。

**失败模式 FM5:玩具 SDE 与真实问题差距过大,P07 验证无迁移力**。
- 情景:P07 玩具(低维 + 简单 f_toy)验证了"反推 well-posed",但真实 PLM 高维空间的可辨识性可能完全不同,玩具结论不迁移。
- loop 漏了吗?→ 部分。P07 的角色是"数学适定性的存在性验证"(证明在理想设定下反推 work),不是"真实空间的可辨识性保证"。
- 缓解:这正是 gating②(C2)要在真实 PLM 空间实测 λmin 的原因——P07 玩具验"原理上可辨识",C2 验"真实空间是否满足前提"。两者配合。CS 须标注"P07 验的是原理适定性,真实空间可辨识性依赖 C2 实测"。
- 严重度:低(P07 角色本就是原理验证,C2 补真实空间)。

### steel-manning 总裁决:**REVISE**(轻度修订,非 REJECT)

vN 方案本身成立(无致命失败模式),但 pre-mortem 发现 **1 个 loop 部分遗漏的盲区(FM3:选择压含结合以外维度)** + 几个需在 CS 声明中明确的边界(FM1 claim 降级退路、FM5 P07 角色)。这些都通过**扩展 CS 诚实声明**解决,不动 vN 的 5 核心件结构。

**REVISE 具体项**:
- R-1(FM3):CS 扩展——明确 vN 验证"结合亲和力驱动的选择分量",其他选择压(表达/稳定性/可开发性/polyreactivity)未覆盖,留作 claim 边界。
- R-2(FM1):CS 补——若 gating① 实测非梯度流,claim 从"学势函数 f"降级为"学 drift 场 ∇f",CV 排序判据对此稳健。
- R-3(FM5):CS 补——P07 验"原理适定性",真实空间可辨识性依赖 C2(gating② λmin)实测。

这些是 CS 声明的扩展(诚实边界更完整),非方案结构修订。REVISE 后 vN 结构不变,CS 更诚实。

---

## 3. 复活终检(真冗余 9 件逐项独立复核)

用没参与 loop 的视角,对 Stage 2 砍掉的 9 件逐项问:它其实承重吗?有没有 loop 局部视角误判?特别留意 steel-manning 的 FM3(选择压含结合以外维度)是否让某个被砍件重新承重。

| # | 被砍件 | loop 砍除理由 | 独立复核:其实承重吗? | 终检裁决 |
|---|---|---|---|---|
| P01 | 手搓 f* 族 | 循环论证病灶(I1零证据力) | 否。FM3 也不救它——选择压多维不等于"要手搓 f*";真值仍应来自外部测量(扩展 CR9114 或多维 assay),非手搓 | 确认可砍 |
| P02 | IGoR naive 库 | 逼真度对三不变量零贡献 | 否。naive 库逼真度与可辨识性/非循环/条件依赖无关 | 确认可砍 |
| P04 | DIMSIM/SLiM | 逼真演化模拟零贡献,可辨识测试由P07替 | 否。即便 FM1(非梯度流),补的也是"真实轨迹"非"逼真仿真"(后者仍内部真值,I1零证据力) | 确认可砍 |
| P05 | 多时间点轨迹生成 | 时序是部署野心(R5),内部生成 | 否。FM1 若需轨迹,应用真实 phage panning(P09 Hanke,外部真值),非合成轨迹。r1附录r1-G已预判此点 | 确认可砍 |
| P06 | 比对f*度量(原形态) | 比对手搓f*=循环 | 否。度量意图已转 P07(玩具SDE自恢复),原形态确循环 | 确认可砍(功能在P07) |
| P20 | 三层gate外壳 | 流程仪式,意图已化入三不变量 | 否。三不变量各有专属组件验证,"层"无独立功能 | 确认可砍(意图保留) |
| P14 | 剥突变独立性 | Spike0静态无突变多产混淆 | 否。CR9114静态Kd确无频率/计数混淆;P14功能在P07轨迹反推内保留 | 确认可砍(功能在P07) |
| P08 | 边界扫描独立性 | 玩具SDE参数化重跑 | 否。功能并入P07,独立列无额外价值 | 确认可砍(功能在P07) |
| P10 | SVD秩诊断 | 对nested DMS错误指标 | 否。秩≠条件依赖(nested在epistasis差异);CV-Ⅰ更对题。FM3也不救它(秩诊断与选择压维度无关) | 确认可砍 |

### 复活终检裁决:**9 件全部确认可砍,无误砍,无复活**。

关键复核点——steel-manning 的 FM3(选择压含结合以外维度)是否让任何被砍件复活?**否**。FM3 的处置是"CS 声明收窄 claim 范围(只覆盖结合驱动的选择)",而非"复活仿真器/手搓f*"。如果未来要覆盖其他选择压维度(表达/稳定性),需要的是**更多维度的外部测量数据**(如 open-alphaseq 的表达量、稳定性 assay),不是任何一个被砍的内部真值生产件。所以 FM3 不触发复活,只触发"未来数据扩展方向"(进 CS 与 Stage4 公司数据缺口标注)。

P04/P05 的潜在回升(r1附录r1-G 标记的"分支B需轨迹"情形)复核:即便 FM1 成立需要真实轨迹,补的也是真实 phage panning(P09 Hanke,外部真值,对I1有贡献),绝非合成轨迹(P04/P05,内部真值,I1零贡献)。所以 P04/P05 确认不复活。

### Stage 3 完成判据复核

- [x] staged-gate:**GO**(5 gate 全过,Gate3/5 带 Stage4 落地条件)
- [x] steel-manning:**REVISE**(轻度,3 项 CS 扩展 R-1/R-2/R-3,不动结构)
- [x] 复活终检:真冗余 9 件全部确认可砍,无误砍,无复活
- [ ] 产出 v_final + 判定表

### Backtrack 检查

- staged-gate=KILL?→ 否,是 GO。不触发。
- steel-manning 复活承重件?→ 否,REVISE 是 CS 扩展非复活。不触发回 Stage 2。
- =RECYCLE/REVISE?→ steel-manning=REVISE,但 REVISE 项是 CS 声明扩展(局部修订),**在本 stage 内完成,不需回 Stage 2**(REVISE 未动 5 核心件结构,只扩展诚实声明)。

**结论:不触发任何 backtrack。** REVISE 在本 stage 内通过扩展 CS 完成,产出 v_final。

---

## 4. v_final 定稿方案 + 判定表

**v_final = vN + CS 扩展(R-1/R-2/R-3)**。5 核心件结构不变,CS 诚实声明扩展为更完整的边界。

### v_final 完整规格

**主干 — Spike0**:CR9114(65536 变体×3抗原 −logK_D)→ censored 回归拟合 f̂(seq,cond)。梯度流下 f̂=选择势函数,∇f̂=驱动力(完备区静态=动力学,系 gating① 实测 C3)。

**适定性 — P07 玩具 SDE**:低维玩具(已知 f_toy+σ_toy)→ 前向 gradient-flow SDE → population 边际 → 反推验唯一恢复 + gating① 一致性 + 边界扫描 + σ扣突变。验 I2 数学适定性(原理级,真实空间可辨识性依赖 C2)。

**验证 — CV 三子检验**:CV-Ⅰ 跨抗原一致性 / CV-Ⅱ 打乱对照(多次置换+p值)/ CV-Ⅲ cross-condition 预测+N3 baseline。验 I1(CV-Ⅲ)+ I3(CV-Ⅱ/Ⅰ)。

**前提 — P16 零泄漏**:留出抗原/突变组合未进训练。

**诚实 — CS 覆盖声明(扩展版)**:
- 严格验证区:CR9114 完备 16 位点 × 3 抗原。
- 选择压维度边界(R-1/FM3 新增):vN 验证"**结合亲和力驱动的选择分量**";其他选择压(表达量/稳定性/可开发性/polyreactivity)未覆盖,需更多维度外部测量数据(如 open-alphaseq),留 claim 边界。
- claim 形态退路(R-2/FM1):若 gating① 实测非梯度流,claim 从"学势函数 f"降级为"学 drift 场 ∇f";CV 排序判据对此稳健。
- 可辨识性层次(R-3/FM5):P07 验"原理适定性",真实 PLM 空间可辨识性依赖 C2(gating② λmin 实测)。
- 外推区:一般抗体/真实免疫时序=待验假设,需公司数据(轴T时序、跨campaign)。
- 数值精度 limitation:f̂ 学 −logK_D 作 f 代理,梯度方向可靠、精确数值受单调非线性+σ各向异性影响。

**可选 — P09 Hanke**:开源探索性扩展(多条件),非核心;亦是 FM1 若需真实轨迹时的外部真值来源(非合成轨迹)。

### Stage 3 判定表

| 判定项 | 裁决 | 依据 |
|---|---|---|
| staged-gate | **GO** | 5 gate 全过(数据可得/判据明确/三不变量绿/工程最小/可操作化);条件均为 Stage4 落地参数 |
| steel-manning | **REVISE(轻度)** | 5 失败模式无致命;FM3 揭示选择压维度盲区 → CS 扩展 R-1/R-2/R-3,不动结构 |
| 复活终检 | **9件全确认可砍** | 无误砍无复活;FM3 不救任何被砍件(需的是多维外部数据非内部生产件) |
| backtrack | **不触发** | 非 KILL、REVISE 在本 stage 内完成、未复活承重件 |
| 三不变量 | **I1🟢/I2🟢/I3🟢** | 全绿,带 5 条 Stage4 必验条件 C1-C5 |
| **总裁决** | **GO → Stage 4** | v_final 定稿,进实验设计 |

### Stage4 必验条件汇总(C1-C5,Stage 3 确认须被 Stage 4 接住)

- C1(I1):CV-Ⅲ cross-condition 预测须显著打败 N3 baseline。
- C2(I2):gating② a(x) 在 PLM 空间 λmin > 正下界,实测。
- C3(I2):静态=动力学限 CR9114 完备覆盖区(gating① 实测确认)。
- C4(I3):CV-Ⅱ 打乱多次随机置换 null 分布 + p 值量化。
- C5(I1):CS 覆盖范围声明(含 R-1 选择压维度边界 / R-2 claim形态退路 / R-3 可辨识性层次)+ 数值精度 limitation。

### Stage 3 完成判据

- [x] staged-gate GO/KILL/RECYCLE → **GO**
- [x] steel-manning ACCEPT/REJECT/REVISE → **REVISE(轻度,CS 扩展)**
- [x] 复活终检真冗余逐项判定表 → 9 件全确认可砍
- [x] 产出 v_final + 判定表 → 完成

Stage 3 完成。v_final 定稿,GO 进 Stage 4 实验设计。

---

## Checkpoint: Stage 3 定稿判定完成(GO + REVISE轻度;v_final 定稿;9件无误砍)

### Objective

Stage 3 是 loop 之外的独立终检,用没参与对抗循环的视角对 Stage 2 saturation 出的 vN 做三件事:staged-gate 可行性裁决(GO/KILL/RECYCLE)、steel-manning pre-mortem(假设失败倒推盲区,ACCEPT/REJECT/REVISE)、复活终检(对砍掉的 9 件逐项独立复核有无误砍)。目的是确认 vN 确实"最小且非循环"且没为简化砍掉真承重的东西,产出 v_final。

### Process Summary

staged-gate:5 个 gate(数据可得/判据明确/三不变量绿/工程最小/可操作化)逐项审,全 PASS(Gate3/5 带 Stage4 落地条件)→ GO。steel-manning:假设 vN 失败,倒推 5 个失败模式 FM1-FM5,无致命,FM3 揭示 loop 部分遗漏的盲区(选择压含结合以外维度)→ REVISE(轻度,3 项 CS 扩展)。复活终检:9 件真冗余逐项独立复核,全部确认可砍、无误砍、无复活(特别验证 FM3 不救任何被砍件)。产出 v_final = vN + CS 扩展(R-1/R-2/R-3)。backtrack 不触发。

### Key Findings

**发现 1(staged-gate GO,条件是落地参数非方法疑问)**:vN 通过全部 5 gate。关键判断是 Gate3——三不变量"有条件绿"该判 GO 还是 RECYCLE?判 GO,因为 5 条 Stage4 条件(C1-C5)都是"实验设计层面把参数定死"(预注册阈值、实测 λmin、置换次数),不质疑方法能否成立。如果条件是"方法可能根本不可辨识"那才该 RECYCLE/KILL;但 C1-C5 是"成立的方法在实验中怎么把参数填实",属 Stage4 正常工作。这个区分是 Stage 3 最重要的判断。

**发现 2(steel-manning 找到 loop 真漏的盲区 FM3)**:这是 Stage 3 独立视角的价值兑现。loop 四轮都在"结合亲和力 = 选择"的隐含假设下运作(因为 CR9114 测的就是结合 Kd),没人质疑"选择压是否只有结合"。steel-manning 从"假设失败"倒推,发现:真实亲和力成熟的选择压可能含表达量、稳定性、可开发性、polyreactivity 等结合以外的维度,CR9114 只测结合 Kd 漏了这些。如果真实选择里结合只占一部分,Spike0 学的"Kd 地形"≠完整"选择算子 f"。这不推翻 vN(结合确是亲和力成熟的主选择压,Phillips 数据正为此),但必须在 CS 诚实标注 claim 只覆盖"结合驱动的选择分量"。这是 loop 局部视角(盯着 CR9114 数据)看不到、独立终检才能发现的盲区。

**发现 3(REVISE 而非 REJECT,且在本 stage 内完成)**:5 个失败模式全部有缓解路径,无一致命——FM1(非梯度流)有 claim 降级退路(学 drift 不学势,CV 排序稳健)、FM2(λmin 退化)有换表征/正则处置、FM3(选择压多维)收窄 claim 范围、FM4(baseline 太强)换比泛化、FM5(玩具不迁移)P07 本就是原理验证 C2 补真实空间。所以 REVISE 是轻度的——3 项都是扩展 CS 诚实声明(R-1/R-2/R-3),不动 5 核心件结构。这让 REVISE 在 Stage 3 内完成,不触发回 Stage 2。

**发现 4(9 件复活终检无误砍,FM3 不触发复活)**:最关键的复核是"FM3 这个新盲区会不会让某个被砍件复活"。答案是否——FM3 的处置是"未来用更多维度外部测量数据(表达/稳定性 assay)",需要的是新数据,不是任何被砍的内部真值生产件(手搓 f*/仿真器)。所以 FM3 触发"未来数据扩展方向",不触发"复活仿真器"。同理 P04/P05 即便 FM1 成立需轨迹,补的也是真实 panning(外部真值)非合成轨迹(内部真值)。9 件全确认可砍。

### v_final 相对 vN 的变化

仅 CS 诚实声明扩展(3 项):R-1 选择压维度边界(只覆盖结合驱动选择)、R-2 claim 形态退路(非梯度流则学 drift)、R-3 可辨识性层次(P07 原理级 + C2 真实空间)。5 核心件结构零变化。v_final 比 vN 诚实边界更完整,方案本体不变。

### Decisions Made

1. **staged-gate 判 GO**。理由:5 gate 全过,条件是 Stage4 落地参数非方法疑问。
2. **steel-manning 判 REVISE(轻度)**。理由:无致命失败模式,FM3 盲区通过 CS 扩展解决,不动结构。
3. **REVISE 在本 stage 内完成,不回 Stage 2**。理由:REVISE 项是 CS 声明扩展(局部修订),未动核心件,未复活承重件。
4. **9 件全确认可砍**。理由:独立复核无误砍,FM3 不救任何被砍件(需新数据非旧冗余)。
5. **产出 v_final = vN + CS 扩展**。GO 进 Stage 4。

### Open Questions(交 Stage 4)

1. **5 条 Stage4 必验条件 C1-C5 操作化**:每条须落地为可执行实验步骤 + 数值阈值。
2. **FM3 的 CS 标注如何在实验设计体现**:Stage 4 须明确"vN 验证结合驱动选择",并把"其他选择压维度"列入"开源不可达/公司数据或多维assay"缺口。
3. **打乱条件标签对照的具体设计(spec Stage4 要求 ≥1 个)**:= CV-Ⅱ,Stage 4 给置换次数 N、null 分布构造、p 值阈值。
4. **玩具 SDE 的精确规格**:维度、f_toy 形式、σ_toy、时间点数、反推方法。
5. **开源可达 vs 公司数据不可替代清单**:Stage 4 须产出。

### Deviation from Spec

无偏差。Stage 3 按 convergence → staged-gate-evaluation + steel-manning(winner-stress-testing)执行,产出 GO/REVISE + 复活终检判定表 + v_final。steel-manning=REVISE 按 spec 在本 stage 内局部修订(spec: "=RECYCLE/REVISE → 局部修订 vN 后重跑本 stage";此处 REVISE 是 CS 扩展,修订后无需重跑对抗,因结构未变——在本 stage 内完成判定)。

### 附录 S3-A:失败模式→缓解登记册(FM1-FM5,交 Stage 4 设计防护)

把 steel-manning 的 5 失败模式整理成登记册,Stage 4 实验设计须为每条设计探测/缓解,避免执行时被打懵。

| FM | 失败情景 | 触发信号(Stage4监测) | 严重度 | 缓解动作 | 落地条件 |
|---|---|---|---|---|---|
| FM1 | PLM空间非梯度流(drift有旋) | gating①检验:drift Jacobian不对称/有旋显著 | 中 | claim降级"学势f"→"学drift场∇f";CV排序判据稳健 | C3/R-2 |
| FM2 | a(x)在PLM空间退化λmin≈0 | gating②实测λmin接近0 | 中 | 换低维表征/加εI正则/限非退化子流形 | C2 |
| FM3 | 选择压含结合以外维度 | f̂在held-out上系统偏离(尤其表达/稳定性相关变体) | 低-中 | CS收窄claim为"结合驱动选择分量";未来加多维assay数据 | C5/R-1 |
| FM4 | N3 baseline(pairwise epistasis)太强难超越 | CV-Ⅲ同抗原内f̂不显著优于pairwise | 低 | 改比cross-antigen泛化(pairwise逐抗原拟合,泛化弱) | C1 |
| FM5 | 玩具SDE结论不迁移真实空间 | P07玩具verify过但真实空间可辨识性存疑 | 低 | P07定位为原理验证;真实空间靠C2(λmin)实测补 | C2/R-3 |

**登记册用法**:Stage 4 每个验证步骤须标注它监测哪个 FM 的触发信号,以及触发后执行哪个缓解。这把 pre-mortem 从"想了一遍风险"变成"实验里有探测器 + 预案"。

### 附录 S3-B:v_final 就绪度评估(Stage 4 操作化前的清单)

v_final 进 Stage 4 前,逐组件评估"操作化就绪度"——哪些已有完整规格、哪些待 Stage 4 补。

| 组件 | 已就绪(前序 stage 给) | Stage4 待补 |
|---|---|---|
| Spike0 | 数据schema(附录r1-D/r2附录)、censored loss思路、CR9114字段字典(Stage0附录G) | 模型架构具体选型、censored loss精确形式、floor阈值(回查source data)、训练超参 |
| P07玩具SDE | 检验方案(Stage0附录A、r1附录r1-I、r2 2a) | 玩具维度/f_toy形式/σ_toy、时间点数、反推算法、gating①一致性度量、边界扫描参数 |
| CV-Ⅰ | 跨抗原一致性规格(r3附录r3-A) | 一致率阈值预注册、定性扫描的可视化方案 |
| CV-Ⅱ | 打乱对照+多次置换(r3附录r3-A) | 置换次数N、null分布构造、p值阈值、性能度量选型 |
| CV-Ⅲ | cross-condition+N3规格(r1附录r1-D、r3附录r3-A) | N3 baseline具体实现(Phillips系数复现)、Spearman阈值、留出方案细节 |
| P16零泄漏 | 留出策略(按抗原+按突变组合) | 具体留出比例、泄漏检查清单 |
| CS声明 | 扩展版(R-1/R-2/R-3 + Stage0/r2边界) | 每条limitation的精确措辞、覆盖范围量化 |

**就绪度总结**:v_final 的"做什么、为什么"已完全就绪(前序 stage 充分);Stage 4 的工作是"怎么做"的参数化(阈值、维度、超参、留出比例),即把 5 条必验条件 C1-C5 落地为可照做的步骤。这正是 Stage 4 的职责(experiment-design,仅 design 不执行)。

### 附录 S3-C:Stage 3 一句话总结(交 Stage 4)

Stage 3 独立终检:**staged-gate GO**(5 gate 全过,条件是 Stage4 落地参数非方法疑问)+ **steel-manning REVISE 轻度**(5 失败模式无致命,FM3 揭示"选择压含结合以外维度"盲区→CS 扩展 R-1/R-2/R-3,不动结构)+ **复活终检 9 件全确认可砍**(无误砍,FM3 不救任何被砍件)。**v_final = vN + CS 扩展**,5 核心件结构不变,诚实边界更完整。backtrack 不触发。GO 进 Stage 4:把 v_final 操作化为可执行实验设计,落地 5 条必验条件 C1-C5,产出开源可达 vs 公司数据缺口清单。

Stage 3 完成。






