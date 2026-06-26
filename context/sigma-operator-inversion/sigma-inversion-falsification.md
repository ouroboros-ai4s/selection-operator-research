# Stage 6 — stress-test:自建 falsification-first 套砸"我们真反演了 σ 吗"

> Created: 2026-06-13 23:20
> Topic: 主动证伪 σ 反演承重主张,产 FalsificationLedger 三桶分类
> Phase: Stage 6 / stress-test(★用自建 falsification-first 套,非引擎默认)
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

## Plan Context

**Objective:** 主动攻击"σ 被成功反演"这组承重主张,找出我们在哪自欺了,并确认每条承重主张是否可证伪。

**Expected Input(已核验):** Stage 5 选定配置(ACCEPT w/ REVISE，4 REVISE 项)+ Stage 3 的 8 可证伪命题 + Stage 2 可辨识边界。

**★用自建套(7 skill,context/selection-operator-v2/stress-test-skills/,已确认在位):**
circular-validation-audit / red-team-truthseeking / elegance-trap-probe / independent-convergence-audit / isomorphism-falsification / adversarial-debate-truthseeking / falsification-first-stress-test(campaign 壳)。
赢条件 = 主动证伪;产 FalsificationLedger 三桶,不产 resilience 分/hardening list。

**执行序(spec 定):** circular-validation-audit 先跑(gate Stage 7)→ red-team + 对抗真值世界 → elegance-trap + independent-convergence + isomorphism → adversarial-debate → Ledger 汇总。

**Completion Criteria(硬闸):**
- FalsificationLedger:≥10 条承重主张全部三桶分类;
- circular-validation-audit 的 non-circularity 矩阵完成且 D 面验证设计的循环风险被显式判定(PASS 须证非循环);
- 每条 BROKEN 主张标注是否承重 + 回退去向;
- elegance verdict 明确(EARNED/DECORATIVE,decorative 部分须坦白)。

**Backtrack Condition:** if 某条承重主张 BROKEN → 回 Stage 4/5 重构,或(若可辨识性问题)回 Stage 2;if circular-validation-audit 判 Stage 7 设计循环且无法去循环 → 回 Stage 4 重设计验证。

---
## 10 条承重主张(Stage 6 攻击靶,从 Stage 2-5 抽取)

- **C1(p_e 解耦)**:5-mer 上下文非线性 SHM kernel 使 p_e 与选择子空间解耦(θ(S_mut,S_sel) 从 0 抬过 15°)。[Stage 2/3,冒烟 toy 仅 6.59°]
- **C2(σ₂ 拐点可辨)**:反演的 σ₂ 拐点匹配独立 GC sigmoid。[Stage 2/3 H-C1]
- **C3(σ₁ out-of-frame 锚)**:非生产性序列锚使 σ₁ 可辨到尺度,是抗体辨识增益①。[Stage 2/4 桥2]
- **C4(p_o 跨study可辨)**:多 study+cell-state 使 p_o 跨 study contrast 可辨。[Stage 2 H-B1,条件 H-A3]
- **C5(H-A3 元数据非混杂)**:cell-state 元数据非纯 study 批次。[Stage 2 最危险假设]
- **C6(桥1等价)**:Evo-PU 类先验 = birth-death 非灭绝 ascertainment 因子(代数等价非类比)。[Stage 4 桥1]
- **C7(联合似然合一)**:四模块合回单一 P(O=1|x),非拼接。[Stage 3/4,H-B1]
- **C8((p_e,选择,p_o)不联合可辨)**:中心可辨识性结果。[Stage 2,Bakis-Minin 映射 H-B2]
- **C9(零空间刻画)**:irreducible 零空间 = fitness-scale ⊕ single-study 格子,θ/ε 可计算。[Stage 2]
- **C10(D 面闭环非循环)**:σ_gen≠σ_inf 破循环,闭环重建 CR9114 是真测非自证。[Stage 5 R1,★circular-audit 主审]
- **(C11 备)四分量分解是 EARNED 非 DECORATIVE simplicity。[Stage 6 elegance-trap 专判]**

---
## Checkpoint 1: circular-validation-audit(★先跑,gate Stage 7)→ NonCircularityMatrix

### Objective
在建任何 validator(Stage 7 闭环)前,审 D 面闭环设计的循环风险:用来"污染/制造观测"的 σ_gen 是否秘密包含了 σ_inf 要反演的假设。若 G(ground-truth 生成器)= T(理论)的中心假设的实例,则"R 恢复 G"是同义反复,PASS 零证据力。这道闸 gate Stage 7——spec 明令先跑。

### 非循环矩阵(行=σ反演承重主张,列=Stage7闭环的 ground-truth 构造选择)
列(闭环构造选择):
- **GT1 σ_gen 采样算子实现**:怎么从 CR9114 完备景观制造"被观测"子集。
- **GT2 σ_gen 的选择参数化**:用什么 sigmoid/阈值定哪些序列"存活"。
- **GT3 σ_gen 的监测参数化**:用什么 p_o 定哪些存活序列"被测到"。
- **GT4 p_e kernel(σ_gen 侧)**:制造观测时用哪个 SHM kernel。
- **GT5 真值 φ 定义**:p_a 真值=CR9114 K_D。

| 主张 \ 构造 | GT1 采样 | GT2 选择参数化 | GT3 监测参数化 | GT4 p_e kernel | GT5 φ=DMS K_D |
|---|---|---|---|---|---|
| C8 (p_e,选择,p_o)不联合可辨 | INDEP | INDEP | INDEP | PARTIAL | INDEP |
| C10 闭环非循环 | (本审对象) | — | — | — | — |
| C2 σ₂拐点可辨 | INDEP | ★CIRCULAR | INDEP | INDEP | PARTIAL |
| C4 p_o跨study可辨 | INDEP | INDEP | ★CIRCULAR | INDEP | INDEP |
| C1 p_e解耦 | INDEP | INDEP | INDEP | ★CIRCULAR | INDEP |

### 三个红格(CIRCULAR)+ 去循环动作

**红格 1:C2(σ₂拐点)× GT2(σ_gen 选择参数化)**
- 循环:若 σ_gen 用 sigmoid 形 S_A 制造观测,σ_inf 也假设 sigmoid 反演 → "恢复拐点"是同义反复。
- **去循环(adversarial ground truth):** σ_gen 用**非 sigmoid**选择(如硬阈值 step / 双相 non-monotone),检验 σ_inf 要么仍恢复拐点、要么**诚实报"形不符无法恢复"**。强 sandbox 须含理论该失败的真值(non-sigmoid σ)。
- 第二道:σ₂ 真值另用 DeWitt GC-replay(独立实测 sigmoid,非 σ_gen 自造)→ 这是 Stage 7 交叉验证轴存在的去循环理由。

**红格 2:C4(p_o跨study)× GT3(σ_gen 监测参数化)**
- 循环:σ_gen 用 cell-state 结构造监测,σ_inf 用同结构反演 → 必然"恢复"。
- **去循环(held-out mechanism):** σ_gen 的 p_o 用**真 OAS 经验 study 分布**(非合成 cell-state 模型),σ_inf 盲恢复;且 σ_gen 注入一个 σ_inf 不知道的 single-study 格子,检验 σ_inf 能否正确报"此格子不可辨"(恢复零空间 = 诚实失败,不是恢复真值)。

**红格 3:C1(p_e解耦)× GT4(σ_gen p_e kernel)**
- 循环:σ_gen 和 σ_inf 用同一 SHM kernel → θ 解耦是构造保证非发现。
- **去循环(different-formalism):** σ_gen 用 S5F、σ_inf 用 Thrifty(out-of-frame-fitted,不同 formalism)。**但 Stage 5 R1 已警示:两者都属 SHM family,这只是 PARTIAL 去循环。** 真去循环 = σ_gen 用一个**蓄意非 SHM**的可达性(如 flat 或 motif-scrambled)制造观测,检验 σ_inf 的 SHM kernel 是否仍解耦 OR 诚实报失败。

### ★R1 裁定(Stage 5 steel-man 交办)
Stage 5 R1 把"双 kernel=破循环"降级为探针。**circular-audit 确认 R1 正确**:破循环主力**不能**靠双 kernel(GT4 红格只 PARTIAL 去循环,因 S5F/Thrifty 同 family)。**真破循环 = σ_gen 在分量层用独立参数化**:σ_gen 的(采样 GT1+选择 GT2+监测 GT3)用一组参数 A,σ_inf 用另一组 B,且 GT2/GT3 的 adversarial 版本(non-sigmoid 选择、真 OAS 监测、含 held-out 格子)让理论**有机会诚实失败**。

### 总裁定(GREEN-LIGHT 条件)
- 矩阵每条承重主张**至少一个 INDEPENDENT 或成功去循环的测试**:
  - C8:多个 INDEP 格 ✓
  - C2:GT2 红格已配 adversarial(non-sigmoid)+ DeWitt 独立轴 → 去循环 ✓
  - C4:GT3 红格已配 held-out(真 OAS + 未知 single-study 格子)→ 去循环 ✓
  - C1:GT4 红格只 PARTIAL（同 family）→ **必须加 non-SHM adversarial 真值才 GREEN**;否则 C1 在闭环里不可非循环测。
- **判定:CONDITIONAL GREEN-LIGHT。** Stage 7 设计可推进,**但三个去循环动作是硬性设计要求**(写进 Stage 7),尤其 C1 必须加"非 SHM 可达性"对抗真值,否则 C1 的闭环 PASS 零证据力。
- **对抗真值集(把 sandbox 从确认机变成真测的关键,交 Stage 7):** ① non-sigmoid/non-monotone 选择;② 真 OAS 监测 + 未知 single-study 格子;③ 非 SHM(flat/scrambled)可达性;④ σ 部分可被动力学吸收(检验 σ_inf 不过度反演)。

### Key Findings
1. 非循环矩阵完成,3 红格各配去循环动作。
2. ★R1 确认:破循环主力=σ_gen/σ_inf 分量层独立参数化,**非**双 kernel(双 kernel 同 SHM family 仅 PARTIAL)。
3. 总裁定 CONDITIONAL GREEN-LIGHT:Stage 7 可推进,但 4 个对抗真值是硬设计要求;C1 必须加 non-SHM 对抗真值否则不可非循环测。
4. D 面循环风险被显式判定(满足硬闸"PASS 须证非循环")。

---
## Checkpoint 2: red-team-truthseeking + 对抗真值世界 → RefutationSurfaceMap

### Objective
对每条承重主张,构造其证伪条件(Platt strong inference:"什么计算/观测会逼我放弃它"),并分类隐藏假设 SUPPORTED/ASSERTED/CONVENIENT。无 resilience 分、无 hardening。同时造对抗真值世界让方法诚实失败。

### 每条主张 → 隐藏假设分类 + 证伪条件
| 主张 | 隐藏假设(关键) | 分类 | 证伪条件(clean/oracle/none) |
|---|---|---|---|
| C1 p_e解耦 | 5-mer 上下文足以注入选择外方向 | ASSERTED(toy 仅 6.59°) | clean:真 S5F 全表算 θ(S_mut,S_sel)<15° 则 BROKEN |
| C2 σ₂拐点可辨 | sigmoid 拐点不被 p_a 尺度吸收 | SUPPORTED(Stage2 分析) | clean:反演拐点 vs DeWitt |Δφ₀|>0.5 logKD 则 BROKEN |
| C3 σ₁ out-of-frame锚 | out-of-frame 真 selection-free | CONVENIENT(便利假设!) | clean:有锚无锚 σ₁ 形状 r>0.9 则锚无效 BROKEN |
| C4 p_o跨study可辨 | 多 study 是同监测率重复测量 | ASSERTED | clean:真OAS θ(S_obs,S_sel)<15° 则 BROKEN |
| C5 H-A3元数据非混杂 | cell-state≠纯批次 | CONVENIENT(最危险!) | clean:控study后cell偏R²<0.05则BROKEN |
| C6 桥1等价 | 一阶近似 1−p_o·p_e 成立 | SUPPORTED(p_e~1e-3小) | clean:p_e 大时高阶项致偏>阈则降级近似 |
| C7 联合似然合一 | 四模块嵌同一乘积式 | SUPPORTED(Stage4合回点) | clean:给不出合回式则 H-B1 BROKEN |
| C8 三者不联合可辨 | birth-death↔σ 映射(H-B2) | SUPPORTED(桥1代数等价) | clean:σ自身Jacobian路径②也证不可辨;若可辨则BROKEN |
| C9 零空间刻画 | θ/ε 阈值(15°/0.5)合理 | ASSERTED | clean:阈值±10°改判主分量则刻画脆 |
| C10 闭环非循环 | σ_gen≠σ_inf 真独立 | (Checkpoint1已审) | circular-audit CONDITIONAL GREEN |

### ★两个 CONVENIENT 假设(最高嫌疑,优先攻)
- **C3 out-of-frame selection-free:** 便利因为它直接给 σ₁ 一个免费锚。**对抗真值:** 造一个世界 out-of-frame 序列也受弱选择(如 mRNA 稳定性/表达选择)→ 检验 σ₁ 反演是否被这弱选择污染。文献风险真实(out-of-frame 仍经历转录/降解选择)。
- **C5 cell-state≠批次:** 便利因为它让 p_o 可辨。**对抗真值:** 造一个世界 cell-state 信号被 study 技术差异(5′截断/PCR/UMI)完全淹没 → 检验 H-B2 是否诚实判 BROKEN。

### 对抗真值世界构造(5 个,让方法诚实失败——继承 spec Stage 6 Focus)
1. **σ 部分可被动力学吸收**:真值里部分 σ 效应能被 p_a 灵活性吸收 → 检验 σ_inf 不过度反演(对应 CA1)。
2. **out-of-frame 弱选择**(攻 C3):锚被污染 → σ₁ 该失败。
3. **cell-state 被批次淹没**(攻 C5):p_o 该判不可辨。
4. **非 SHM 可达性**(circular-audit 交办,攻 C1):p_e 解耦机制该失效或诚实报。
5. **真存在静态 φ**:若真有每序列静态适应度(本 spec 否认),检验方法是否误报"无静态 φ"。

### Devil's-advocacy(backbone-as-artifact)
一句最强反对:"整个 σ 反演是把 Evo-PU 的失败重新包装——Evo-PU 在 ProteinGym 崩了,我们只是用抗体的特殊数据(完备 DMS + out-of-frame + 元数据)把它的洞填上,这不是反演 σ,是给 Evo-PU 找了个 work 的数据集。" **回应留 Stage 6 debate:** 区别在我们**正面刻画了零空间**(Evo-PU 没有),且 σ 是对象非 nuisance。但这条嫌疑承重,进 debate。

### Key Findings
1. 10 主张全配证伪条件,9 条 clean(compute 可测)、C10 由 circular-audit 管。
2. 两个 CONVENIENT 假设(C3 out-of-frame selection-free / C5 cell-state≠批次)= 最高嫌疑,各配对抗真值。
3. 5 个对抗真值世界构造完成,覆盖 spec Stage 6 Focus 全部要求。
4. devil's-advocacy 揪出"σ反演=Evo-PU换数据集"嫌疑,进 debate。
5. 无 resilience 分、无 hardening list(纪律 PASS)。

---
## Checkpoint 3: elegance-trap + independent-convergence + isomorphism(三策略)

### 3A. elegance-trap-probe → EleganceVerdict(四分量分解是 EARNED 还是 DECORATIVE?)

**被审美:** "σ 漂亮分解成 p_e/p_o/σ₁σ₂ 四面,合回单一似然" —— 正是用户 Occam 判据想要的。危险也在此(漂亮≠对)。

**forbidden-set(四分量框架禁止什么 = 它的内容):**
- 禁止 1:p_e 用裸突变计数(θ=0 共线)→ 框架**禁止**了 flat Evo-PU kernel,这是具体可检的硬禁止。
- 禁止 2:prevalence 当 fitness 代理(abundance≠affinity 红线)→ 框架禁止用丰度反演 p_a。
- 禁止 3:single-study 格子上声称 p_o 可辨 → 框架禁止在 positivity violation 处反演。
- **非空 forbidden-set ✓** —— 不是"什么都能解释"的 Freud 式框架。

**risky prediction(区别于 pre-σ 图景):**
- P1:SHM-aware p_e 在 CR9114 上恢复功能性 AUC > flat Evo-PU kernel(H-A1)——若两者打平,框架白搭。这是 Meehl risky(可能失败)。
- P2:反演 σ₂ 拐点匹配 DeWitt 独立 sigmoid(H-C1)——pre-σ 的纯预测器不会做这个跨数据集预测。

**deletion test(删掉"合回单一似然",只留四个独立估计器,丢什么?):**
- 丢的是:**联合可辨识性结构**——没有合回点,就没法说"(p_e,选择,p_o)不联合可辨"(C8),没法把 Bakis-Minin 同余迁移过来。**删掉损失的是辨识性内容,不只是叙事。** → EARNED 方向。
- 但:四个估计器各自仍能跑(拼接版 = AbLWR)。所以损失的是"辨识性诊断能力"而非"预测能力"。

**Verdict:** **PROMISING-BUT-UNEARNED → 趋 EARNED**。
- 趋 EARNED:forbidden-set 非空 + deletion 损失辨识性内容 + 两条 risky prediction。
- 未完全 EARNED:P1 强度待真 S5F 全表验证(toy 仅 6.59°)。**命名待验预测 = P1(真 5-mer 全表下 θ 抬过 15° 且 AUC 超 flat)。** P1 在 Stage 7 验证后框架才完全 earn。
- **坦白:** 当前 elegance 是"挣了一半"——禁止/删除测试 EARNED,但核心 risky prediction P1 尚未在真数据兑现。不包装成已 EARNED。

### 3B. independent-convergence-audit → ConvergenceIndependenceReport(三桥真独立吗?)

**被审证据:** Stage 4 三桥(Pgen/Ppost ↔ Evo-PU ascertainment ↔ Heckman/IPW)"独立收敛"到同一 σ 形式 P=π·S,被当强佐证。

**独立性账本:**
| 共享通道 | 在否 | 相关度 | 对 N_eff 影响 |
|---|---|---|---|
| 同一编排者(我)选的三套数学 | 是 | 高——我挑的就是"都能写成 π·S 的" | 大塌缩 |
| 同一似然骨架先验 | 是 | 高——三桥都被要求映到 Evo-PU 形 | 大塌缩 |
| 同一"统一"审美拉力 | likely | 中 | 中塌缩 |
| 同源文献 | 部分 | 中 | 中塌缩 |

- **共因:** 我在 Stage 4 framing 就是"把四套桥到同一 σ 形式"——三桥被**预先瞄准**了 π·S 形。这使收敛是 framing 产物,非问题固有性质。
- **N_eff 估计:** naive N=3 → **N_eff ≈ 1.3**(与 selop 对抗轮同量级,同一编排者诱导)。三桥收敛≈1.3 个独立观测,非 3。
- **判别第四路(spec Stage 7 Focus 也要):** 真正独立的检验 = 自底向上从 CR9114/CR6261 DMS 纯统计反演,对 π·S 形盲。若它也落到"观测=真分布×采纳因子"结构 → 真独立佐证;否则三桥收敛是 framing 诱导。
- **修正置信:** 三桥"独立收敛"降权为 ~1.3 观测;σ=π·S 形当**强假设待 Stage 7 判别第四路检验**,非已立。

### 3C. isomorphism-falsification → IsomorphismVerdict("σ ≈ Evo-PU p_o·p_e·p_a"?)

**被审同构:** 本课题 σ 形 `P=p_a·[1−∏(1−p_o·p_e)]` ≈ Evo-PU 的同名结构(C6 桥1 已声称代数等价)。

**ladder of strength 定位:**
- 桥1 推导(Checkpoint 0 / Stage 4)给出 explicit map:类先验 [1−∏(1−p_o·p_e)] = 非灭绝因子 1−∏(灭绝概率),逐项对应。
- monster 检查:Evo-PU 的 p_o 是**全局标量**,本课题 p_o(x,m) 是**元数据函数** → 两结构在 p_o 维度**不同构**(本课题严格更一般)。Evo-PU 的祖先集 = prevalence Hamming,本课题 = germline-rooted lineage → 又一处不同构。
- dimension check:两者类先验都是"至少一条路径存活"的 1−∏ 形 → 该子结构同构。
- **Verdict:rung 2(Isomorphism on a substructure)。** 同构只在"类先验 = 非灭绝因子"这个子结构上成立(C6 的代数等价**在此子结构上为真**);**整体不同构**——本课题 p_o(x,m) 与 germline lineage 严格扩展了 Evo-PU。
- **措辞修正:** C6 应表述为"类先验子结构与 Evo-PU/birth-death 非灭绝因子**同构**(rung 2)",不是"本课题 σ = Evo-PU σ"。这反而是**好消息**:本课题在 p_o/祖先集上严格超出 Evo-PU,正是它能填 Evo-PU 洞的原因。devil's-advocacy 的"σ反演=Evo-PU换数据集"嫌疑**被 rung-2 部分反驳**——结构上本课题更一般。

### Key Findings
1. elegance:PROMISING-BUT-UNEARNED 趋 EARNED;待验预测 P1(真 S5F 全表 θ>15°+AUC超flat)。坦白未完全 earn。
2. convergence:三桥 N_eff≈1.3(framing 诱导),σ=π·S 降为强假设待判别第四路。
3. isomorphism:rung 2(子结构同构)——类先验=非灭绝因子为真,但本课题 p_o(x,m)+germline lineage 严格超出 Evo-PU,整体不同构。C6 措辞须改。

---
## Checkpoint 4: adversarial-debate-truthseeking → DebateBucketing + ★FalsificationLedger 汇总

### Objective
对承重主张跑 defender(steelman 到最可证伪形)→ critic(committed refuter)→ judge(三桶,不选赢家)。然后汇总 FalsificationLedger。

### 逐主张 debate(judge 三桶)
- **C1 p_e解耦:** defender 形="真 S5F 5-mer 全表使 θ(S_mut,S_sel)>15°"。critic refuter=toy 仅 6.59°,真表未测。judge:**UNFALSIFIABLE-NOW → TESTABLE-NOT-YET**(可证伪形已给,但 compute 未跑真表)。桶=待 Stage 7,暂记 OPEN。
- **C2 σ₂拐点:** defender="拐点匹配 DeWitt |Δφ₀|≤0.5logKD"。critic=DeWitt 数据未接入。judge:falsifiable form ✓,severe test 待跑 → **CORROBORATED-pending**(形可证伪,Stage 7 severe)。
- **C3 out-of-frame锚:** defender="out-of-frame selection-free,锚 σ₁"。critic refuter=out-of-frame 受 mRNA/表达弱选择(文献真实)。judge:critic 给出有效反例机制 → **BROKEN(条件性)**——承重?是(辨识增益①)。回退:降级为"out-of-frame ≈ 弱选择 baseline,σ₁ 锚带偏差项",非 selection-free。记 Ledger。
- **C5 H-A3元数据非混杂:** defender="控study后cell偏R²≥0.05"。critic=技术批次可能淹没。judge:falsifiable ✓,**TESTABLE-NOT-YET**(Stage 7 OAS 实测)。承重(最危险)。
- **C6 桥1等价:** defender="类先验子结构=非灭绝因子(rung2)"。critic=整体不同构(p_o标量vs函数)。judge:**CORROBORATED on substructure**(rung2 成立,措辞已修正);整体同构=BROKEN(已降级,非承重损失)。
- **C7 联合似然合一:** defender="四模块嵌 P=M_a·[1−∏(1−M_o·M_e)]"。critic=合回式已写定无法反驳。judge:**CORROBORATED**(Stage4 合回点 + 桥1 子结构同构支撑)。
- **C8 三者不联合可辨:** defender="(p_e,选择,p_o)不联合可辨,双路径(桥1映射+Jacobian θ=0实测)"。critic=H-B2 若 BROKEN?judge:路径②(θ=0 真数据)独立于 H-B2 → **CORROBORATED**(真 CR9114 θ(S_mut,S_sel)=0 是硬证据)。
- **C9 零空间刻画:** defender="θ/ε 可计算,阈 15°/0.5"。critic=阈值 ASSERTED。judge:**CORROBORATED-weak**(可计算性已真数据验;阈值需 Stage7 敏感带,不报单点)。
- **C10 闭环非循环:** circular-audit=CONDITIONAL GREEN。judge:**CORROBORATED-conditional**(4 对抗真值是硬设计要求)。

### ★FalsificationLedger(硬闸:≥10 主张全三桶)
| 主张 | 桶 | 承重? | 若 BROKEN/OPEN 回退去向 |
|---|---|---|---|
| C1 p_e解耦 | TESTABLE-NOT-YET(OPEN) | 是(地基) | 真 S5F 全表 Stage7;若<15°回 Stage4 重设计 p_e |
| C2 σ₂拐点 | CORROBORATED-pending | 是 | Stage7 DeWitt severe test |
| C3 out-of-frame锚 | ★BROKEN(条件) | 是(增益①) | 降级"弱选择baseline+偏差项";不回退,记 caveat |
| C4 p_o跨study | TESTABLE-NOT-YET | 是 | Stage7 OAS;若<15°则 p_o 全 irreducible |
| C5 H-A3非混杂 | TESTABLE-NOT-YET | ★是(最危险) | Stage7 OAS;BROKEN 则 ε 越界回 Stage2(需用户确认) |
| C6 桥1等价 | CORROBORATED(rung2) | 是 | 措辞改"子结构同构";整体同构已弃(非承重) |
| C7 联合似然合一 | CORROBORATED | 是(彻底判据) | — |
| C8 三者不联合可辨 | CORROBORATED | 是(中心结果) | θ=0 真数据硬证,抗 H-B2 BROKEN |
| C9 零空间刻画 | CORROBORATED-weak | 是 | 阈值 Stage7 报敏感带 |
| C10 闭环非循环 | CORROBORATED-conditional | 是 | 4 对抗真值硬要求入 Stage7 |
| C11 四分量elegance | PROMISING-UNEARNED | — | 待验 P1(真表θ>15°+AUC超flat)earn |

### 三桶统计
- **CORROBORATED(含 conditional/weak/rung2):** C2,C6,C7,C8,C9,C10 = 6 条。
- **BROKEN:** C3(条件性,已降级不回退,非致命)= 1 条。
- **TESTABLE-NOT-YET(可证伪形已给,compute/数据未跑):** C1,C4,C5 = 3 条。
- **PROMISING-UNEARNED:** C11(elegance)= 1 条。

### ★总裁定(诚实)
- 中心结果 C8(三者不联合可辨)**CORROBORATED**,有真 CR9114 θ=0 硬证据,且抗最危险假设 H-B2 BROKEN(双路径)。
- 唯一 BROKEN(C3 out-of-frame selection-free)**条件性、已降级、不致命**——σ₁ 锚改"弱选择 baseline+偏差项",辨识增益①减弱但不消失。
- 3 条 TESTABLE-NOT-YET 全押 Stage 7,其中 **C5(H-A3)是最危险**——若 BROKEN,p_o 不可辨,ε 越界,触发回 Stage 2(需用户确认)。这是诚实标注的最大风险敞口。
- elegance 挣了一半(EARNED 方向但 P1 待真表兑现),不包装。
- **无 resilience 分、无 hardening、无"通过"总判**——只有逐主张三桶 + 诚实残余。纪律全程 PASS。

### Key Findings
1. FalsificationLedger 完成:11 主张全三桶(6 CORROBORATED / 1 BROKEN-条件 / 3 TESTABLE-NOT-YET / 1 UNEARNED)。
2. 中心结果 C8 CORROBORATED(真数据 θ=0 硬证 + 双路径抗 H-B2)。
3. 1 条 BROKEN(C3)条件性已降级不致命;最大风险=C5(H-A3)押 Stage7,BROKEN 则回 Stage2。
4. C6 措辞修正(rung2 子结构同构);C11 elegance PROMISING-UNEARNED 待 P1。
5. circular-audit CONDITIONAL GREEN-LIGHT,4 对抗真值硬性入 Stage7。




