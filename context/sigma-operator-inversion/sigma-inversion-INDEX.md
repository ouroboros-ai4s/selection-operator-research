# σ 反演承重结论 INDEX(跨 stage 汇总)

> spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md
> 用途:跨 stage 的承重结论(可辨识等价类、零空间刻画、FalsificationLedger)汇总,便于续 background。
> 执行模式:岔口1=B(可达性+报告数字+小 smoke)/ 岔口2=A(stage 闸口暂停)。

## Stage 进度

| Stage | 名称 | 状态 | context 文件 |
|---|---|---|---|
| 1 | knowledge-acquisition | ✅ 完成(闸 PASS) | sigma-inversion-ka-knowledge.md |
| 2 | deep-insight 可辨识性闸 | ✅ 完成(闸 PASS) | sigma-inversion-identifiability.md |
| 3 | hypothesis-formation | ✅ 完成(闸 PASS) | sigma-inversion-hypotheses.md |
| 4 | creative-ideation 造算子 | ✅ 完成(闸 PASS) | sigma-inversion-operator-design.md |
| 5 | convergence 选配置 | ✅ 完成(闸 PASS,ACCEPT w/ REVISE) | sigma-inversion-convergence.md |
| 6 | stress-test 自建证伪套 | ✅ 完成(闸 PASS,Ledger 出) | sigma-inversion-falsification.md |
| 7 | experiment-execution 闭环设计 | ✅ 完成(闸 PASS,六环+2真实轴+第四路) | sigma-inversion-experiment-design.md |

## Stage 1 承重结论(已锁)

**数学骨架(外部铁证 Evo-PU arXiv:2605.06879,原文核对一致):**
`P(O_X=1)=p_a·[1−∏_{y∈Y(x)}(1−p_o·p_e)]`

**四分量接口(全部开源可达,已核验):**
- p_a 功能性 ← CR9114/CR6261 本地 parquet(65536×11 / 2048×8),答案全知。
- p_e 突变可达 ← S5F(本地 1024×6,核验=published HH_S5F)/ Thrifty(netam),装法 `P(y'→y)=(1−exp(−λ·r_i))·CSP_i`。
- σ₁ 生成/tolerance ← OLGA P_gen(human_B_heavy 实跑 Pgen 成功,无 IGoR 编译)+ SONIA Q=P_post/P_gen。
- p_o 监测 ← OAS BType/BSource/Isotype 协变量(HF 镜像 ConvergeBio/oas-unpaired)。

**★核心新认知(交 Stage 2):** Evo-PU 类先验 `[1−∏(1−p_o·p_e)]` 数学等同 birth-death **非灭绝条件因子** → 用 ascertainment 同余类统一刻画可辨识性,四分量是同一生成-存活-采样过程的投影,非拼接模块(与 selop 元发现同构)。

**可辨识性铁证:** ① Bakis-Minin(2508.09519)λ/μ/ρ 非联合可辨,固定 ρ 解,净率 λ−μ 稳;② Louca-Pennell(Nature 2020,同余式 verbatim 见 2604.17926)唯一可辨=PDR `r_p=λ−μ+(1/λ)dλ/dτ`。

**零空间已识别两源(交 Stage 2 落成维度):**
1. p_o 的 single-study 格子(OAS 中只单 study 支撑的 (BType,BSource,Isotype) 组合,结构性不可辨)。
2. fitness-scale(φ 尺度,ρ 不固定则不可辨)。

**承重假设清单(交 Stage 2 negate,≥3):** H-A2 SHM out-of-frame→in-frame 迁移 / H-A3 元数据非混杂 / H-A6 abundance≠affinity 红线(PMC5337809,prevalence 不可当 fitness)优先级最高。

**非循环资产(交 Stage 6/7):** p_e 两 kernel(S5F syn-fit vs Thrifty out-of-frame-fit,已证抓不同过程)/ σ₂ 两源(CR9114 K_D vs DeWitt GC-replay)→ σ_gen≠σ_inf 有料可落。

**文献:** 64 search-level / 20 full-text(超 40/10 闸)。

## 可辨识性地图(Stage 2 产出后填)

**★Stage 2 完成(闸 PASS,2026-06-13)。context: sigma-inversion-identifiability.md(355 行,3 策略 + 1 冒烟)。**

**Governing variable 锁定(problem-reformulation):** = 线性化观测映射 Φ 的秩/谱(按 4 分量分解的联合可辨识性),**不是**预测精度。推翻 4 个隐藏支配变量(精度=成功/数据=代表性采样/更多数据→更好恢复/σ=nuisance)。与 selop 元发现同构。

**σ 可辨识性地图(四分量逐个打标):**
| 分量 | 标签 | 数学依据 | 解锁约束 |
|---|---|---|---|
| p_a 功能性 | 可辨识到单调变换 | 类先验乘性因子逐点可定;尺度与 σ₂ 耦合 | DMS 绝对 K_D(CR9114) |
| σ₂ 亲和 sigmoid | 仅 contrast 可辨(拐点辨,斜率耦合) | sigmoid 斜率与 p_a 尺度同余 | DeWitt GC-replay 独立 sigmoid |
| σ₁ 生成/tolerance | 可辨识到尺度 | out-of-frame 锚 P_gen,Q 形状可定 | 非生产性序列(OAS 内含) |
| p_o 监测 | 跨study contrast可辨*/single-study irreducible | 多 study=多 ρ 分离;单 study 混淆 | 多 study + cell-state 元数据 |
（*p_o contrast 可辨带星号 = 条件可辨,前提 H-A3 元数据非混杂,未证实)

**中心结果:** (p_e 可达, 选择存活, p_o 监测) 三者**不联合可辨**(Bakis-Minin λ/μ/ρ 映射 H-B2)。可辨="pulled"contrast。**抗体两处辨识性增益:** ① out-of-frame 序列锚 σ₁;② 多 study+cell-state 锚 p_o —— 本 spec 不退化成 Louca-Pennell 纯同余困境的根因。

**零空间可计算定义(硬闸,真数据坐实):**
- θ = 三子空间(S_mut/S_sel/S_obs)主夹角。阈:<15° 不可辨 / >45° 可辨 / 15–45° 弱可辨需外部约束。
- ε = dim R_irr/dim 全谱,τ=1e-3。阈:<0.1 零空间小 / >0.5 触发 Backtrack / 0.1–0.5 诚实标注可推进。
- **真 CR9114 实测(65094 行):θ(S_sel,干净元数据)=89.2°✓可辨;θ(S_sel,abundance≈affinity)=36.5°(H-A6 negate 方向验证);★θ(S_mut,S_sel)=0.0° = (p_e,选择)在裸突变计数下完全不可辨的真实例;ε=0.056。**

**★Stage 2 升级认知(回写 Stage 4):** p_e **必须**用 SHM-kernel 序列特异可达性(S5F/Thrifty),**不能**用裸突变计数——后者 θ=0 与选择完全混淆。"用 SHM kernel"从工程选择升级为辨识性必需。

**零空间两主来源(落成维度):** ① p_o single-study 格子(dim=OAS 单 study 支撑组合数,待 Stage 7 数);② fitness-scale(dim=1,p_a 尺度⊕σ₂ 斜率⊕σ₁ 归一共享)。

**承重假设敏感性(6 条 negate,超 ≥3 闸,致命性排序):**
1. H-A3 元数据非混杂 — 最危险,无数据兜底,决定 p_o,ε 可越界 → Stage 7 OAS 检验。
2. H-B2 birth-death↔σ 映射 — 高,外部铁证全靠它,但有路径②(σ 自身 Jacobian θ)兜底。
3. H-A6 abundance≠affinity — 致命方向但实测 ρ=0.6 证伪反假设,红线守住,稳健。
4. H-B1 四分量=单一投影 — 中,Stage 4 须给联合似然证明,否则降级拼接。
5. H-A2 SHM 迁移 — 中,注偏差不翻结构,两 kernel(S5F/Thrifty)探针缓解。
6. H-B3 线性化点 — 低-中,锁 germline-rooted 防幸存者污染。


## FalsificationLedger(Stage 6 产出后填)

**Stage 3 命题集(待 Stage 6 三桶分类,verbatim 候选):** 8 条可证伪命题,四面各 ≥1,每条带定量 BROKEN 判据。攻击序 A(p_e)→C(σ₁σ₂)→B(p_o)→D(反卷积),依赖驱动非可发表性。
- H-A1 SHM-kernel AUC > flat Evo-PU kernel(ΔAUC≤0 或 CI 含 0 则 BROKEN)
- H-A2 SHM 抬 θ(S_mut,S_sel) 离 0(真 S5F 全表下仍 <15° 则 BROKEN)— ★本 stage 冒烟:toy 邻位近似得 6.59°,方向对强度 NOT-YET,公平检验须真 5-mer 表+完整似然
- H-C1 反演 σ₂ 拐点匹配 DeWitt GC sigmoid(|Δφ₀|>0.5 log K_D 则 BROKEN)
- H-C2 out-of-frame 锚 σ₁ 必需(有锚无锚 r>0.9 则锚无效 BROKEN)
- H-B1 多 study 使 p_o 跨 study contrast 可辨(θ(S_obs,S_sel)<15° 则 BROKEN)
- H-B2 元数据非混杂(控 study 后 cell-state 偏 R²<0.05 则 H-A3 BROKEN)
- H-D1 闭环重建景观(系统偏差 Spearman ρ<0.8 或残差落可辨方向 则 BROKEN)
- H-D2 零空间实证(irreducible 方向反而恢复 > 理论上界 则 Stage 2 刻画错)
- 联合似然合回:四面对应 P=p_a·[1−∏(1−p_o·p_e)] 各项,形式可合回(Stage 4 缝合验证)。
- success criteria 全 = σ 反演质量,0 可发表性。护栏 PASS。

**★Stage 6 FalsificationLedger 裁定(2026-06-13,自建 7-skill 套):** 11 主张全三桶。
- **CORROBORATED(6):** C2 σ₂拐点(pending)/C6 桥1(rung2 子结构同构)/C7 联合似然合一/C8 三者不联合可辨(★真CR9114 θ=0硬证+双路径抗H-B2)/C9 零空间可计算(weak,阈值需敏感带)/C10 闭环非循环(conditional)。
- **BROKEN(1,条件性已降级不致命):** C3 out-of-frame selection-free → critic 给出 mRNA/表达弱选择反例 → 降级"弱选择baseline+偏差项",辨识增益①减弱不消失,不回退。
- **TESTABLE-NOT-YET(3,押 Stage7):** C1 p_e解耦(真S5F全表)/C4 p_o跨study(OAS)/★C5 H-A3元数据非混杂(最危险,BROKEN则ε越界回Stage2需用户确认)。
- **PROMISING-UNEARNED(1):** C11 四分量 elegance → 待验预测 P1(真表 θ>15°+AUC超flat)兑现才 EARNED,坦白未完全 earn。
- **circular-audit:CONDITIONAL GREEN-LIGHT** —— Stage7 可推进,4 对抗真值硬性入设计(①non-sigmoid选择②真OAS监测+未知single-study格子③非SHM可达性④σ部分可吸收);C1 必须加 non-SHM 对抗真值否则闭环 PASS 零证据力。
- **N_eff≈1.3**(三桥 framing 诱导,σ=π·S 降为强假设待判别第四路)。
- 无 resilience 分/无 hardening/无"通过"总判。

## 最终 Research Design(Stage 7 产出后填)

**Stage 4-5 选定配置(待 Stage 7 落成闭环):**
- 合回点:`P(O=1|x)=M_a·[1−∏(1−M_o·M_e)]`(四模块占不同因子位,非拼接)。
- M_e=S5F 5-mer 非线性 kernel(+Thrifty 第二 kernel,需装);M_o=分层 GLM(study固定+cell随机);M_sel=OLGA σ₁(+SONIA,需装)+ 单调 sigmoid σ₂(只反演拐点);M_a=代数反解 O/类先验。
- 祖先集=germline-rooted clonal lineage,SHM 加权距离(非 flat Hamming)。
- ★桥1完整等价:Evo-PU 类先验=birth-death 非灭绝 ascertainment 因子(把 H-B2 从类比升为代数等价)。桥2:out-of-frame=Heckman exclusion restriction。桥3:single-study=IPW positivity violation。

**Feasibility 实测:** 最小核(M_a+M_e-S5F+M_sel-OLGA+M_o-GLM+CR9114)全绿可跑;三缺口(SONIA/Thrifty/OAS全量)非阻塞,Stage 7 才硬需。

**多准则打分:** 21/25(可辨识5/合一5/非循环4/可行4/鲁棒3)。最弱维=H-A3 押后 Stage 7。无可发表性轴。

**Steel-man verdict:** ACCEPT WITH REVISE。4 条 REVISE 带进 Stage 6/7:
- R1 破循环主力=σ_gen/σ_inf 分量层独立(非双 kernel)→ Stage 6 circular-validation-audit 严审。
- R2 加性=toy 简化,上位待 Stage 7 真景观复测。
- R3 p_o contrast 可辨全程带星号,H-B2 BROKEN 则坦白降级(可能触发 Stage 2 Backtrack)。
- R4 σ₁(OLGA)/σ₂(DMS K_D)真值本身 model-based,Stage 7 caveat。

**★Stage 7 闭环验证设计(全 spec 终产物,只设计不实跑):**
- **闭环六环:** 环1真值(实测 CR9114/CR6261 完备 K_D)→ 环2 σ_gen 幸存者采样(唯一合成,参数A,带4对抗真值)→ 环3 σ_inf 反演(Stage4 算子,参数B≠A)→ 环4 重建 φ̂ → 环5 比对(去尺度 Spearman,分可辨/irreducible/对抗三方向)→ 环6 残差反馈(只 refine 可辨方向,不拟合零空间)。
- **破循环写死:** σ_gen(non-sigmoid选择+真OAS监测+可选non-SHM可达,参数A保密)≠ σ_inf(参数B);C1 non-SHM 对抗真值入环2(满足 circular-audit 硬要求)。
- **2 真实交叉验证轴:** ① DeWitt GC-replay(Zenodo 15022130)= σ₂ 真值锚,|Δφ₀|>0.5logKD 则 H-C1 BROKEN;② OAS(ConvergeBio/oas-unpaired)= p_o 协变量 + 最危险 C5 判决场,控study后cell偏R²<0.05 则 H-A3 BROKEN→ε越界回Stage2(需用户确认)。
- **判别第四路:** 自底向上纯统计(对 π·S 形盲)判三桥 N_eff≈1.3 是否 framing 诱导。
- **零空间实证指标(4 个可计算):** 可恢复率 / dim R_irr(=single-study格子数+1)/ θ 实测敏感带 / 对抗诚实失败率。ε>0.5 → 回 Stage2。
- **6 条 caveat:** SHM迁移/加性DMS=模型/OAS=study混杂(命门)/out-of-frame弱选择(C3降级)/σ₁σ₂ model-based/abundance≠affinity红线。
- **5 项硬闸全 PASS,不含纯合成沙盒。**

---
## ★全 spec 执行完成(2026-06-13,7 stage 全 PASS)

7 stage 顺序执行完毕,每 stage Completion Criteria 硬闸 PASS,无强制 Backtrack 触发。最大未决风险敞口 = C5(H-A3 元数据非混杂),押 Stage 7 OAS 实测,BROKEN 则回 Stage 2(需用户确认)。下一步 = executing-specs 真跑闭环(本 spec 只到设计)。
