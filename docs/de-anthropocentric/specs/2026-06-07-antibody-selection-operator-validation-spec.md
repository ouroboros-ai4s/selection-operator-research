# Research Spec: 抗体选择算子学习 — 验证方案的对抗式简化

> Generated: 2026-06-07
> North Star: 学习抗体亲和力成熟背后的 condition-dependent 选择算子 f(seq,cond)——一个突变算子已知、选择算子未知的反问题——并用一套对抗式简化 loop 把验证方案从工程堆砌收敛到最小且非循环的可执行内核。
> Scope: 5 stages (其中 Stage 2 为迭代循环), estimated 4-7 sessions
> Source: de-anthropocentric-research-engine

## 背景定论(spec 的地基,执行时不再质疑)

- **问题内核已收敛,不动**:SDE 反问题 `dX = ∇f(X,c)·dt + σ_SHM·dW`,σ(SHM 突变算子)已知,f(选择算子)未知。f = condition-dependent 能量场,∇f = 推动群体的力场。
- **最接近范式已确认**:SDE drift estimation (known diffusion) × interventional identification × mean-field population dynamics × neural f。文献空白已验证(COSINE/WFABC/Bayes-PD/GC-SBI/MPL/PyR0 均缺一角)。
- **本 spec 只攻击「验证方案」,不攻击「问题定义」。** loop 的产物是一份最小、非循环、可执行的验证方案,不是一个新的问题定义。
- **用户核心批判(loop 的靶心)**:手搓 f* 是循环论证——要学的就是那个不知道原理的算子,有本事搓出像样的 f* 就不用学它了。「算法能反推出我自己编的 f*」什么都不证明。整个老方案用工程量制造虚假信心。要简洁明了。
- **被攻击的初始 artifact v0**:`context/2026-06-07-3layers-plan.md`(老三层验证方案)+ `context/2026-06-07-northstar-and-loop-design.md`(候选精简脊柱:Spike0 CR9114直接监督拟合 → Spike1 玩具SDE反推 → 真实多条件验证)。

## 三个不变量(每轮必查,绿灯才放行;优先级 I1 > I2 > I3)

| # | 不变量 | 倒下条件 | 优先级 |
|---|---|---|---|
| I1 | 验证非循环性 | 找不到用「方法没见过且非手搓」的真值检验 f 的路径 | 最高靠山 |
| I2 | 可辨识性前提 | gradient-flow SDE 唯一恢复定理前提在离散序列空间/本数据形态下不成立 | 第二 |
| I3 | 条件依赖真新颖性 | 打乱 cond 标签性能不掉 → f(seq,cond) 退化成 f(seq) | 第三 |

**I1 是最高靠山**:任一轮只要「验证仍在自证」未解决,不准往下走,直接 backtrack 重做该轮 ideation。

## Global Context Protocol

- 每个 stage 开始:`context-init`,按 `context/<engine-phase>-<campaign>-antibody-selop.md` 命名。
- 每个 strategy 完成后:`context-checkpoint`(≥500 行,硬约束不可跳过)。
- Stage 2 循环特殊规则:**每一轮迭代结束都 checkpoint 一次**,文件名追加轮次 `...-loop-rN.md`,记录该轮:攻击维度、三不变量红绿状态、被砍/被复活部件、产出的方案版本号 v(n)。
- 跨 stage 的 artifact 版本号连续递增(v0=老方案,v1,v2... vN=定稿)。

## Global Execution Rules

- 预算偏差 ±10% 内自主,超出需在 checkpoint 说明。
- **backtrack 需用户确认**——除 Stage 2 内部循环的 backtrack(那是 loop 的正常机制,自主)。
- Stage 2 全自主跑到 saturation,不在轮间停顿等用户确认(用户已授权"全自主到饱和")。
- ideation 激进度 = 玩具级:逼真仿真器、手搓 f* 族、任何"为逼真而逼真"的工程默认砍掉,保留必须通过 resurrection 证明承重。
- **中文汇报(强制)**:每个 Stage 结束后、以及 Stage 2 内每个子步骤(2a/2b/2c/2d)结束后,都要用中文向用户简洁明了汇报一次。汇报 ≤8 行,只讲"这步做了什么 + 关键结论 + 三不变量红绿 + 下一步动向",不复述过程、不贴长表。这是面向用户的同步,与 context-checkpoint(面向 session 恢复的 ≥500 行存档)是两件事,不可互相替代。

## Global Backtrack Conditions

- Stage 0 补检索若发现"非循环验证根本无解之文献证据" → 回 Stage 0 扩大检索,或上报用户问题可能 ill-posed。
- Stage 2 saturation 后若 Stage 3 staged-gate 判 KILL → 回 Stage 2 续跑(放宽 saturation 阈值)。
- Stage 3 若 steel-manning 复活了一个被 loop 砍掉的承重部件 → 回 Stage 2 重纳该部件再跑一轮。
- Stage 4 实验设计若发现定稿方案不可操作化 → 回 Stage 2 或 Stage 3。

---

## Stage 0: 聚焦补充检索(knowledge-acquisition)

**Objective**: 只为夯实两个不变量的弹药——为 I1 找到"非循环验证"的现有范式(别人怎么验证学到的算子/奖励/势函数不靠自证),为 I2 确认"已知扩散 SDE drift 估计的可辨识性定理"在离散序列空间的成立条件。不做泛泛文献综述。

**Expected Input**: 背景定论中已确认的范式空白与数据源(COSINE/WFABC/SDE drift/IRL/gradient-flow SDE identifiability/CR9114/Hanke 等)。5-28 对话已做过广域调研,本 stage 是**靶向补缺**,不是重做。

**Focus Areas**:
1. 非循环验证范式:inverse RL / system identification / SBI 领域如何在"无真值 reward/drift"时验证恢复正确性(held-out 预测、独立测量对照、cross-condition 泛化等)。
2. 可辨识性定理边界:gradient-flow SDE 唯一恢复(arXiv:2505.21770)+ SDE drift estimation(arXiv:2602.17830)+ interventional CRL(arXiv:2406.05937)的前提假设,逐条对照本问题(离散序列/表征空间连续化/σ已知程度)是否满足。
3. CR9114 作为"直接测量的 f(seq,cond)"的可用性细节:数据规模、变体×抗原矩阵完备度、能否直接做监督拟合。

**Recommended Combination**: knowledge-acquisition → literature-survey(主)+ baseline-establishment(仅 CR9114 数据可用性部分)

**Completion Criteria**(全部量化):
- I1 弹药:至少找到 **3 个**非循环验证范式的具体先例(注明论文 + 它们用什么独立信号验证)。
- I2 弹药:对 **3 条**可辨识性定理逐条产出"前提满足/不满足/需额外假设"的判定表。
- CR9114:确认数据可访问性 + 矩阵维度(变体数 × 抗原数)+ 是否适合直接监督拟合,产出 1 段可用性结论。

**Backtrack Condition**: if 三个范式先例中无一能迁移到本问题(全部依赖本问题拿不到的真值)→ 这是 I1 可能无解的早期警报,上报用户,暂停进 Stage 1。

**Execution Steps**:
- [x] context-init: `context/knowledge-acquisition-literature-survey-antibody-selop.md`
- [x] literature-survey:聚焦 I1 非循环验证范式(snowball + 引用追踪)
- [x] literature-survey:聚焦 I2 可辨识性定理前提对照
- [x] baseline-establishment:CR9114 数据可用性核查
- [x] 产出三张结论表(I1 先例表 / I2 定理判定表 / CR9114 可用性)
- [x] context-checkpoint(≥500 行)
- [x] **中文汇报**:Stage 0 收尾,≤8 行(I1/I2 弹药命中数 + CR9114 可用性结论 + 是否触发 backtrack)

---

## Stage 1: 循环装载(LOOP SETUP)

**Objective**: 把初始 artifact v0、三不变量、种子攻击队列固化为 Stage 2 循环的明确输入。这是一次性 setup,不迭代。

**Expected Input**: Stage 0 的三张结论表 + v0 方案文件(老三层 + 候选精简脊柱)。

**Focus Areas**:
1. 装载待攻击 artifact v0:明确列出老方案的**每一个部件**(逼真仿真器、手搓 f* 族、L1/L2/L3 三层 gate、零泄漏检查、SVD 条件秩诊断…),每个部件标注"承重假设"和"工程成本"两个属性,供 loop 逐一审判。
2. 固化种子攻击队列(下方顺序,按"塌了全完"的依赖序)。
3. 把 Stage 0 的 I1/I2 弹药挂到对应攻击维度上,作为 critic 的初始证据库。

**种子攻击队列**:
```
R1  非循环性 (I1)       ← 无解则后面全空中楼阁,先打
R2  仿真器必要性         ← CR9114 本身是直接测的 f(seq,cond),能否直接监督拟合、彻底不要仿真器?
R3  可辨识性 (I2)       ← 若必须有合成步,玩具SDE vs 逼真仿真器哪个够?
R4  条件依赖 (I3)
R5  OOD→公司数据迁移     ← 关乎部署不关乎方法成立,排最后
```

**Recommended Combination**: deep-insight → assumption-audit(用于拆解 v0 每个部件的承重假设;这是一次性 setup,不进入迭代)

**Completion Criteria**:
- v0 部件清单完成,**每个部件**都有(承重假设, 工程成本)二元标注。
- 种子队列 5 项就位,每项挂上 Stage 0 对应弹药。
- 产出 loop 的"初始状态账本"(state ledger):当前方案版本 v0、待攻击队列、三不变量初始状态(全部未验)。

**Backtrack Condition**: if v0 部件无法清晰拆解(部件间耦合到无法独立审判)→ 回 Stage 0 补"方法分解"视角。

**Execution Steps**:
- [x] context-init: `context/loop-setup-antibody-selop.md`
- [x] assumption-audit:拆解 v0 每个部件的承重假设
- [x] 标注每部件(承重假设, 工程成本)
- [x] 固化种子队列 + 挂载弹药
- [x] 产出初始 state ledger
- [x] context-checkpoint
- [x] **中文汇报**:Stage 1 收尾,≤8 行(v0 部件清单条数 + 种子队列就位情况 + 三不变量初始状态全未验)

---

## Stage 2: 对抗式简化循环(ADVERSARIAL SIMPLIFICATION LOOP)★核心

**Objective**: 迭代地"攻击 → 提炼张力 → 生成简化候选 → 抢救被砍部件",每一轮把验证方案蜕掉一层不承重的工程,同时保证三不变量不塌,直到 saturation。这是整个 spec 的核心,**不是线性 stage 而是一个循环**——executing-specs 反复跑 2a→2b→2c→2d 直到饱和判据满足。

**Expected Input**: Stage 1 的 state ledger(v0 部件清单 + 种子队列 + 三不变量初始状态)+ Stage 0 弹药库。

**Focus Areas**:
- 每轮聚焦种子队列里**最高优先级的未决维度**;三不变量 I1/I2/I3 每轮都查(I1 红灯则该轮强制 backtrack)。
- ideation 玩具级激进:默认砍重工程,逼复活机制证明其承重。
- 增量攻击只打"上轮被动过的部件",不重复审判已确认的部件(除非新证据出现)。

**每一轮的四个子动作(2a→2b→2c→2d)**:

### 2a — 攻击 + 不变量体检(stress-test)
- **Recommended Combination**: stress-test → multiagent-debate (critic-defender-judge)
- critic 攻击队列最高未决维度;defender 必须用 Stage 0 弹药 + 当前方案版本应战;judge 出红绿裁决。
- **强制**:无论本轮主攻哪个维度,都要对 I1/I2/I3 三不变量各跑一次快速体检。I1 用 critic-defender-judge 专项(defender 必须拿出非循环验证路径,critic 证明它仍在自证)。
- 产出:本轮 DebateVerdict + 三不变量红绿状态。
- **中文汇报(2a)**:≤6 行——本轮主攻哪个维度、judge 红绿裁决、I1/I2/I3 三体检结果。

### 2b — 张力提炼(deep-insight)
- **Recommended Combination**: deep-insight → problem-reformulation (tension-mining)
- 从 2a 的对抗结果抽出本轮的**核心张力**(通常是"科学野心 ⟂ 非循环可验证性 ⟂ 最小工程量"三者中某两者的当轮具体冲突)。
- 产出:1 条精确表述的核心张力 + 它卡在哪个部件上。
- **中文汇报(2b)**:≤4 行——本轮核心张力一句话 + 卡在哪个部件。

### 2c — 简化候选生成(creative-ideation)
- **Recommended Combination**: creative-ideation → assumption-destruction(主)+ systematic-enumeration(辅,确保不漏掉更简的可能)
- 针对 2b 的张力,生成消解它的简化候选方案 v(n+1)。玩具级激进:优先"砍掉/替换为玩具版/合并"类操作。
- 产出:方案 v(n+1) + 明确列出"本轮砍了/换了/并了哪些部件"。
- **中文汇报(2c)**:≤6 行——v(n+1) 版本号 + 砍了/换了/并了哪些部件。

### 2d — 抢救被砍部件(stress-test)
- **Recommended Combination**: stress-test → counterfactual-probing (necessity-sufficiency + factor-removal)
- 对 2c 中**每一个被砍/被换的部件**做 resurrection:站在该部件那边论证它其实承重(necessity-sufficiency 判它是不是 load-bearing wall;factor-removal 验证砍掉后三不变量是否塌)。
- 抢救成功(证明承重)→ 复活该部件,v(n+1) 回滚这一项。抢救失败 → 确认真冗余,砍除生效。
- 产出:本轮存活的 v(n+1) + 复活清单 + 真冗余清单。
- **中文汇报(2d)**:≤6 行——本轮存活方案版本号 + 复活了哪些部件 + 确认真冗余哪些 + 本轮 saturation 三判据当前状态。

**Completion Criteria(saturation 判据,三条同时满足才退出循环)**:
1. **连续 2 轮**抢救不出新的承重部件(2d 复活清单连续两轮为空)。
2. 三不变量 I1/I2/I3 在最新方案上**全绿**。
3. 砍不动了:最新一轮 2c 无法再生成"砍掉后仍全绿"的简化候选。

**轮数预算**: 预计 3-6 轮收敛。**硬下限 3 轮**(防早停),**软上限 8 轮**(超过则在 checkpoint 报告为何不收敛,可能需用户介入或回 Stage 0)。

**Backtrack Condition**:
- 轮内:if I1 红灯 → 该轮强制重做 2c(自主,不需用户确认)。
- 跨 stage:if 8 轮仍不饱和 → 上报用户,可能问题定义或不变量设定有误。

**Execution Steps(每一轮重复)**:
- [x] context-init / 续写: `context/adversarial-loop-antibody-selop-rN.md`(r1-r4 完成)
- [x] 2a multiagent-debate:攻击最高未决维度 + I1/I2/I3 三体检
- [x] 2b tension-mining:抽本轮核心张力
- [x] 2c assumption-destruction + systematic-enumeration:生成 v(n+1)
- [x] 2d counterfactual-probing:抢救被砍部件,定稿本轮存活方案
- [x] 更新 state ledger(版本号、队列、三不变量状态、复活/冗余清单)
- [x] context-checkpoint(每轮一次)
- [x] **中文汇报**:本轮(rN)收尾,≤8 行(本轮版本号 v(n)→v(n+1)、砍/换/并/复活摘要、三不变量红绿、saturation 三判据进度、是否再开一轮)
- [x] 检查 saturation 三判据 → 不满足则回到 2a 开下一轮;满足则进 Stage 3(r4 末 3/3 满足)

---

## Stage 3: 定稿判定(convergence)

**Objective**: 对 Stage 2 收敛出的最小方案 vN 做最终可行性判定 + 终极对抗,确认它确实是"最小且非循环"且没有为了简化而砍掉真正承重的东西。这是 loop 之外的独立终检——用没参与 loop 的视角再审一遍。

**Expected Input**: Stage 2 的 vN(saturation 后的存活方案)+ 完整 state ledger(全部轮次的复活/冗余清单)。

**Focus Areas**:
1. staged-gate:vN 是否满足"可执行验证方案"的 gate 标准(数据可得、判据明确、三不变量全绿、工程量最小)。
2. steel-manning / winner-stress-testing:对 vN 做 pre-mortem——假设 vN 在执行中失败,最可能因为什么?有没有 loop 漏掉的失败模式?
3. **复活终检**:重新审视所有"真冗余清单"里被砍的部件,确认没有一个其实是承重的(loop 内可能因局部视角误判)。若发现误砍 → backtrack Stage 2。

**Recommended Combination**: convergence → feasibility-assessment (staged-gate-evaluation) + steel-manning (winner-stress-testing)

**Completion Criteria**:
- staged-gate 出 GO/KILL/RECYCLE 明确裁决。GO 才能进 Stage 4。
- steel-manning 出 ACCEPT/REJECT/REVISE。REVISE 列出具体修订项。
- 复活终检:对真冗余清单逐项确认,产出"确认可砍 / 需复活"判定表。

**Backtrack Condition**:
- if staged-gate = KILL → 回 Stage 2 放宽 saturation 续跑。
- if steel-manning 复活了被砍的承重部件 → 回 Stage 2 重纳该部件跑一轮。
- if = RECYCLE/REVISE → 局部修订 vN 后重跑本 stage。

**Execution Steps**:
- [x] context-init: `context/convergence-feasibility-antibody-selop.md`
- [x] staged-gate-evaluation:vN 的 GO/KILL/RECYCLE
- [x] winner-stress-testing:vN 的 pre-mortem
- [x] 复活终检:真冗余清单逐项复核
- [x] 产出定稿方案 v_final + 判定表
- [x] context-checkpoint
- [x] **中文汇报**:Stage 3 收尾,≤8 行(staged-gate GO/KILL/RECYCLE + steel-manning ACCEPT/REJECT/REVISE + 复活终检是否有误砍 + 是否触发 backtrack)

---

## Stage 4: 实验设计(experiment-execution,仅 design)

**Objective**: 把定稿的最小非循环验证方案 v_final 写成可执行的实验设计——变量、对照、判据、数据源、判定 gate。**仅到 design,不跑实验**(引擎边界 + 用户两阶段策略:先开源验证方案成型,公司 OOD 留入职后)。

**Expected Input**: Stage 3 的 v_final + 判定表。

**Focus Areas**:
1. 把 v_final 的每个验证步骤操作化:用什么数据(CR9114 / Hanke / phage-seq / 玩具SDE,取决于 loop 砍剩什么)、学什么 f 参数化、什么 loss、什么判据。
2. 明确每步的"非循环验证 gate":这一步用什么"方法没见过的独立信号"判对错(I1 的落地)。
3. 打乱条件标签对照实验设计(I3 的落地)。
4. 数据轴覆盖与不可替代缺口标注:开源能跑通什么、什么必须留给公司数据(轴 T 体内时序 / 跨 campaign 泛化)。

**Recommended Combination**: experiment-execution → experiment-design

**Completion Criteria**:
- 每个验证步骤都有完整的(数据源, 表征, loss, 判据, 非循环 gate)五元组。
- 至少 1 个打乱条件标签的对照实验设计(验 I3)。
- 产出"开源可达 vs 公司数据不可替代"的清单。
- 整份实验设计每一步都标明:输入文件/数据 accession、运行环境/依赖、预期产出物、判定阈值——即外部执行者无需追问上下文即可逐条照做(以"零开放性追问"为验收标准)。

**Backtrack Condition**: if 某验证步骤无法操作化(找不到对应数据或判据)→ 回 Stage 3 或 Stage 2 重审该步骤是否真的承重。

**Execution Steps**:
- [x] context-init: `context/experiment-design-antibody-selop.md`
- [x] experiment-design:逐步骤操作化 v_final
- [x] 设计打乱条件标签对照(I3)
- [x] 标注开源可达 vs 公司数据缺口
- [x] 产出可执行实验设计文档
- [x] context-checkpoint
- [x] **中文汇报**:Stage 4 收尾,≤8 行(每个验证步骤五元组是否齐 + 打乱条件标签对照设计要点 + 开源可达 vs 公司数据缺口清单 + 全程定稿提示)

---

## 收口:这份 spec 跑完会得到什么

一份**最小、非循环、可执行**的抗体选择算子验证方案 + 配套实验设计。它砍掉了老三层方案里"用工程量制造虚假信心"的部分(逼真仿真器、手搓 f* 族等——除非它们在 loop 中被证明承重),保留了三个不可省的硬核验证关(非循环性 I1 / 可辨识性 I2 / 条件依赖 I3)。全程不依赖公司数据即可跑通方法验证;公司数据的不可替代价值(轴 T 体内时序、跨 campaign 泛化)被明确标注留给入职后。
