# Stage 7 — experiment-execution:闭环验证设计(纯开源+部分合成,禁纯沙盒)

> Created: 2026-06-13 23:45
> Topic: 从幸存者观测→反演 σ→重建隐藏景观→比完备真值→残差反馈→量化零空间
> Phase: Stage 7 / experiment-execution(★只做设计不实跑)
> Spec: docs/de-anthropocentric/specs/2026-06-13-sigma-operator-inversion-spec.md

## Plan Context

**Objective:** 设计一个闭环验证:从幸存者采样的观测 → 反演 σ → 重建隐藏功能景观 → 比组合完备真值 → 残差反馈 refine,并量化 irreducible 零空间。

**Expected Input(已核验):** Stage 5 配置 + Stage 6 FalsificationLedger(尤其 circular-audit 的非循环要求)+ Stage 2 零空间刻画。

**资源红线(全程):** 真值与协变量全部锚在实测开源数据;唯一合成 = 独立参数化的幸存者采样算子。**禁纯沙盒世界。**

**Focus Areas:**
1. experiment-design:闭环六环(真值/合成/反演/重建/比对/反馈),σ_gen≠σ_inf 破循环。
2. 真实交叉验证:DeWitt GC-replay(σ₂真值)+ OAS(p_o(x,m)协变量)。
3. constraint-analysis:零空间实证(可恢复率/dim R_irr)。
4. 资源/迁移风险写明(≥3 caveat)。

**Completion Criteria(硬闸):**
- ① 真值/合成/反演/重建/比对/反馈六环齐全,每环锚定具体开源数据或明确独立合成算子;
- ② 循环风险被 Stage 6 矩阵判 PASS（σ_gen≠σ_inf 写死);
- ③ ≥1 真实数据交叉验证轴(GC-replay 或 OAS)有具体落地步骤;
- ④ 零空间量化指标(可恢复率/dim R_irr)有可计算定义;
- ⑤ ≥3 条 caveat 显式写明。**不含任何纯合成沙盒世界**。

**Backtrack Condition:** if 设计无法去循环(σ_gen 与 σ_inf 必然耦合)→ 回 Stage 4;if 完备真值不足以暴露零空间 → 回 Stage 2。

## 继承的硬约束(Stage 6 交办,闭环设计必须带)
- circular-audit CONDITIONAL GREEN:**4 对抗真值硬性入设计**——① non-sigmoid/non-monotone 选择;② 真 OAS 监测+未知 single-study 格子;③ 非 SHM 可达性;④ σ 部分可被动力学吸收。
- ★C1 必须加 non-SHM 对抗真值,否则闭环 PASS 零证据力。
- 破循环主力 = σ_gen/σ_inf 分量层独立参数化(非双 kernel;双 kernel 同 SHM family 仅 PARTIAL)。
- C3 已 BROKEN 降级:σ₁ 锚 = "弱选择 baseline + 偏差项",非 selection-free。
- C5(H-A3)最危险:若闭环 OAS 检验 BROKEN → ε 越界回 Stage 2(需用户确认)。
- 三桥 N_eff≈1.3:须设计判别第四路(自底向上纯统计,对 π·S 形盲)。

---
## Checkpoint 1: experiment-design(闭环六环 + 独立 σ_gen/σ_inf 破循环)

### Objective
设计闭环验证六环,每环锚具体开源数据或明确独立合成算子;σ_gen≠σ_inf 写死;带 Stage 6 的 4 对抗真值。只做设计不实跑。

### 闭环六环(主轴)

**环 1 — 真值(GROUND TRUTH,纯开源,答案全知)**
- 源:真实 CR9114(2¹⁶=65536 完备 K_D 景观,本地 parquet)/ CR6261(2¹¹,本地)。
- φ_true = DMS 实测 K_D(H1/H3/B 三抗原),回溯 germline 已知。
- **非合成**:这是实测开源真值,不是沙盒造的。

**环 2 — 幸存者采样(σ_gen,唯一允许的合成,独立参数化 A)**
- σ_gen = 独立参数化的幸存者采样算子,从完备景观制造"被观测子集"。
- 三臂(分量层独立,破循环主力):
  - 选择臂:σ₂_gen 用**参数化 A**(对抗真值①:non-sigmoid/non-monotone,如硬阈值 step 或双相)。
  - 监测臂:p_o_gen 用**真 OAS 经验 study 分布**(对抗真值②,非合成 cell-state 模型)+ 注入未知 single-study 格子。
  - 可达臂:p_e_gen 用 S5F **或对抗真值③ non-SHM(flat/motif-scrambled)**。
- **σ_gen 参数 A 对 σ_inf 完全保密**(held-out mechanism)。

**环 3 — 反演(σ_inf,参数化 B,独立于 A)**
- σ_inf = Stage 4 算子(M_a 代数反解 + M_e S5F 5-mer + M_sel OLGA σ₁+sigmoid σ₂ + M_o 分层 GLM)。
- **参数化 B ≠ A**:σ_inf 不知道 σ_gen 用了 non-sigmoid 选择 / non-SHM 可达 / 哪个 single-study 格子。
- σ_inf 从环 2 的观测子集反演 (p̂_e, σ̂₁, σ̂₂, p̂_o, p̂_a)。

**环 4 — 重建隐藏景观**
- 用反演的 σ̂_inf 去卷积观测,重建 φ̂(隐藏功能景观估计)。
- 重建只在 Stage 2 可辨自由度上做;irreducible 方向输出"恢复不了"标注。

**环 5 — 比对完备真值**
- φ̂ vs φ_true(环1)。指标:去尺度后 Spearman ρ(序可辨,绝对值不可——Stage2 p_a 单调可辨)。
- **三类诚实检验:**
  - 可辨方向:ρ 应高(>0.8,H-D1 判据)。
  - irreducible 方向:ρ 应≈0(恢复不了 = 正确;若高反而是 Stage2 刻画错,H-D2)。
  - 对抗真值方向:σ_inf 应**诚实报失败**(non-SHM 真值下 p_e 解耦失效时,报"无法解耦"而非硬解)。

**环 6 — 残差反馈 refine(闭环,非一次性)**
- 残差 = φ̂−φ_true 分解到(可辨方向 / irreducible 方向 / 对抗方向)。
- 可辨方向残差 → 反馈调 σ_inf 参数化 B(refine)。
- irreducible/对抗方向残差 → **不 refine**(那是零空间/诚实失败,refine 它=拟合幸存者噪声)。
- 迭代到可辨方向残差收敛;循环非一次性。

### 破循环写死(满足硬闸②)
- σ_gen(参数 A,non-sigmoid 选择 + 真 OAS 监测 + 可选 non-SHM 可达)≠ σ_inf(参数 B,Stage 4 算子)。
- Stage 6 circular-audit 矩阵判定:三红格(C1/C2/C4)各有去循环动作落进 σ_gen 的对抗真值臂 → **PASS**。
- C1 的 non-SHM 对抗真值已入环 2 可达臂(满足 Stage 6 硬要求)。

### 4 对抗真值落位(Stage 6 交办,逐条入环 2)
| 对抗真值 | 落位 | 检验什么 |
|---|---|---|
| ① non-sigmoid 选择 | 环2 选择臂 | C2 σ₂ 拐点恢复是否真(非构造保证) |
| ② 真 OAS 监测+未知 single-study | 环2 监测臂 | C4/C5 p_o 可辨 + 零空间格子诚实识别 |
| ③ non-SHM 可达 | 环2 可达臂 | C1 p_e 解耦是否真(否则报失败) |
| ④ σ 部分可吸收 | 环2 额外配置 | σ_inf 不过度反演(对应 CA1) |

### Key Findings
1. 闭环六环齐全,每环锚开源数据(环1/5 CR9114,环2 真OAS分布)或明确独立合成(环2 σ_gen 参数A)。
2. σ_gen≠σ_inf 分量层独立写死,4 对抗真值逐条入环2,C1 non-SHM 真值到位。
3. 残差反馈区分可辨/irreducible/对抗三方向——只 refine 可辨方向,不拟合零空间。
4. circular-audit 矩阵 PASS 条件全满足。

---
## Checkpoint 2: 真实交叉验证轴 + 判别第四路(证明不只在合成采样上 work)

### Objective
闭环六环用 σ_gen 合成采样验证"方法自洽"。但须证方法在**真实幸存者数据**上也站得住(非只合成)。两条真实交叉验证轴 + 一条判别第四路(回应 Stage 6 N_eff≈1.3)。

### 真实轴 1 — DeWitt GC-replay(σ₂ sigmoid 真值,落地步骤)
- 数据:DeWitt GC-replay(bioRxiv 2025.06.02.656870 / Cell;Zenodo 15022130)。52–119 平行 GC,单细胞 BCR + DMS 亲和力景观 + 7 时点 bulk。自称低亲和力宽容/plateau 是幸存者伪影。
- **角色:σ₂ 真值锚 + 真实幸存者交叉验证。** DeWitt 的真实 GC 亲和力 sigmoid 是**独立测的** σ₂(非 σ_gen 自造)→ 去循环第二道(circular-audit C2 红格的独立轴)。
- **落地步骤:**
  1. 从 Zenodo 15022130 取 GC 单细胞 BCR + 配对 DMS 亲和力。
  2. 拟合真实 GC 的亲和力→存活 sigmoid,取拐点 φ₀_DeWitt。
  3. 在 CR9114 闭环上反演 σ̂₂,取 φ̂₀。
  4. **H-C1 判据:|φ̂₀ − φ₀_DeWitt| > 0.5 log K_D → BROKEN。**
  5. 额外:DeWitt 自称的"plateau=幸存者伪影"是本课题 σ 投影的**真实世界实例**——检验 σ_inf 能否把 plateau 识别为采样伪影而非真景观平台。

### 真实轴 2 — OAS(p_o(x,m) 协变量,落地步骤)★承载最危险 C5
- 数据:OAS ~2.4B unpaired / ~1.5M paired BCR + BType/BSource/Isotype/study 元数据(HF 镜像 ConvergeBio/oas-unpaired)。
- **角色:真实异质监测 p_o(x,m) 协变量 + H-A3/C5 检验场。**
- **落地步骤:**
  1. 取 OAS 子集,提 (BType,BSource,Isotype,study) 元数据格子。
  2. 数 single-study 格子(= 零空间第一主来源 dim,Stage 2 交办的实测)。
  3. 拟合分层 GLM(study 固定 + cell-state 随机)。
  4. **H-B2/C5 判据:控 study 固定效应后,cell-state 对 p_o 偏 R² < 0.05 → H-A3 BROKEN → p_o 不可辨 → ε 重算,若越 0.5 触发回 Stage 2(需用户确认)。**
  5. **H-B1 判据:跨 study 重复格子 θ(S_obs,S_sel) < 15° → p_o 全 irreducible BROKEN。**

### 判别第四路(回应 Stage 6 N_eff≈1.3,对 π·S 形盲)
- 三桥 N_eff≈1.3(framing 诱导)。第四路 = **自底向上纯统计**,对"观测=真分布×采纳因子"形**盲**。
- **设计:** 直接从 CR9114/CR6261 DMS 数据做无监督统计(如对观测序列分布做非参密度估计 + 残差结构分析),不预设 σ=π·S 形。
- **判别:** 若第四路也自发落到"观测分布 = 景观 × 某采纳因子"结构 → 三桥收敛是问题固有性质(真独立佐证,N_eff 上修)。若落到别处 → 三桥收敛是 framing 诱导(N_eff 维持 1.3,σ=π·S 降级为假设)。
- 这是 Stage 6 independent-convergence-audit 的"判别第四路"落地。

### 三轴关系
- 合成闭环(六环)= 方法自洽性 + 零空间可控性(答案全知)。
- DeWitt 轴 = σ₂ 在真实幸存者上的去循环检验。
- OAS 轴 = p_o 在真实异质监测上的检验(最危险 C5 的判决场)。
- 第四路 = 三桥独立性的判别(防 framing 自欺)。
- 四者合起来:既证方法在合成上自洽,又证在真实数据上不塌,又防自己 framing 诱导。

### Key Findings
1. 两条真实交叉验证轴(DeWitt σ₂ / OAS p_o)各有具体落地步骤 + 定量 BROKEN 判据(满足硬闸③)。
2. OAS 轴是最危险 C5 的判决场:偏 R²<0.05 → 回 Stage 2(需用户确认)路径写定。
3. 判别第四路落地,回应 N_eff≈1.3,防三桥 framing 自欺。
4. DeWitt 的"plateau=幸存者伪影"是 σ 投影的真实世界实例,检验 σ_inf 识别伪影能力。

---
## Checkpoint 3: constraint-analysis(零空间实证指标 + 资源/迁移 caveat)

### Objective
在完备景观上定量给出"反演能恢复到哪、哪部分 σ 注定恢复不了"——把 Stage 2 理论零空间刻画落成可测残差;逐条写资源/迁移风险 caveat(≥3)。

### 零空间实证指标(把 Stage 2 θ/ε 落成可测残差)

**指标 1 — 可恢复率(recoverable fraction)**
- 定义:可恢复率 = 1 − (φ̂ 在可辨方向上的残差能量)/(φ_true 在可辨方向上的总能量)。
- 可计算:在环 5 比对时,把残差投影到 Stage 2 的可辨子空间(θ>45° 方向)与 irreducible 子空间分别算。
- 期望:可辨方向可恢复率→高;irreducible 方向→0(恢复不了是对的)。

**指标 2 — dim R_irr(零空间维度,实测)**
- 定义:dim R_irr = (single-study 格子数,OAS 实测)+ 1(fitness-scale)。
- 可计算:OAS 轴步骤2 数 single-study 格子;fitness-scale 固定 1 维。
- ε = dim R_irr / dim 全谱,τ=1e-3。**ε > 0.5 → 零空间吃掉主要自由度 → 回 Stage 2(需用户确认)。**

**指标 3 — θ 实测敏感带(非单点)**
- Stage 6 C9 定:阈值 15°/45° 是 ASSERTED,须报敏感带。
- 可计算:在真 S5F 全表 + 真 OAS 上重算 θ(S_mut,S_sel) / θ(S_obs,S_sel),报 [θ−10°, θ+10°] 带内的标签是否翻转。
- 这把 Stage 2 的 toy θ(6.59°/89.2°/0°)升级为真数据敏感带。

**指标 4 — 对抗真值诚实失败率**
- 定义:在 4 对抗真值下,σ_inf 正确报"无法恢复"的比例。
- 期望:高(σ_inf 在 non-SHM/non-sigmoid/淹没监测下应诚实失败,非硬解)。
- 这是"方法不自欺"的正面量化——σ_inf 知道自己什么时候不该反演。

### 资源/迁移风险 caveat(逐条写明,Stage 6 REVISE 全收纳)
1. **C-1(SHM out-of-frame→in-frame 迁移,H-A2):** S5F/Thrifty 在 out-of-frame 训练,迁移到 in-frame p_e 有风险(in-frame 受选择反馈)。缓解:S5F/Thrifty 双 kernel 差异作偏差探针;但**双 kernel 同 SHM family,只 PARTIAL 去循环**(Stage 6 确认)——真去循环靠环2 non-SHM 对抗真值。
2. **C-2(加性 DMS 真值本身是模型,Stage 6 R2):** CR9114 加性 K_D 是 DMS 拟合,真景观有上位。Stage 3/6 的 θ 结论是加性下界,真景观上位待真 CR9114(含部分上位信号)复测。不藏。
3. **C-3(OAS 元数据=study 混杂,最危险 C5/H-A3):** cell-state 可能被 study 技术差异(5′截断/PCR/UMI)淹没。这是整个 p_o 可辨性的命门;OAS 轴步骤4 的偏 R²<0.05 即判 BROKEN，回 Stage 2。已显式标注为最大风险敞口。
4. **C-4(σ₁ out-of-frame 锚已 BROKEN 降级,Stage 6 C3):** out-of-frame 受 mRNA/表达弱选择,非纯 selection-free。σ₁ 锚 = "弱选择 baseline + 偏差项";辨识增益①减弱不消失。
5. **C-5(σ₁/σ₂ 真值 model-based,Stage 6 R4):** OLGA P_gen 是 IGoR 生成模型、CR9114 K_D 是平衡常数(a_DMS≠a_invivo,继承 selop)。σ₁/σ₂ "可辨"依赖这些 model 真值正确,Stage 7 caveat。
6. **C-6(abundance≠affinity 红线,全程):** prevalence 不可当 fitness 代理(PMC5337809 ρ=0.6)。闭环用 DMS K_D 做 p_a 真值,绝不用丰度。守门。

### 闭环验证完整性自检(对照硬闸)
- ① 六环齐全 + 每环锚定 ✓(Checkpoint1)
- ② 循环风险 PASS,σ_gen≠σ_inf 写死 ✓(Checkpoint1 + Stage6 矩阵)
- ③ ≥1 真实交叉验证轴有落地步骤 ✓(DeWitt + OAS 两轴,Checkpoint2)
- ④ 零空间量化指标可计算定义 ✓(可恢复率/dim R_irr/θ敏感带/诚实失败率,本 checkpoint)
- ⑤ ≥3 caveat ✓(写了 6 条)
- 不含纯合成沙盒 ✓(真值=实测 CR9114,协变量=真 OAS,唯一合成=σ_gen 采样算子)

### Key Findings
1. 四个零空间实证指标(可恢复率/dim R_irr/θ敏感带/对抗诚实失败率)全可计算,把 Stage 2 理论落成可测残差。
2. 6 条 caveat 写明,Stage 6 全部 REVISE(R1-R4)+ BROKEN(C3)+ 最危险(C5)收纳,无藏。
3. 五项硬闸全满足,不含纯合成沙盒。
4. ε>0.5 → 回 Stage 2 的路径写定;最大风险敞口 C5(OAS 偏 R²)显式标注。



