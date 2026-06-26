# ResearchBrief — 抗体 Repertoire 观测算子 σ 的彻底反演

> Created: 2026-06-13 17:10
> Phase: North Star Crystallization (warm-start) → 完成,hard-gate 产物
> Resource floor: 开源数据 + 纯算力沙盒(无湿实验、无公司数据假设)
> 关系: 与现 selop(另一 CC 推 φ 树-SBI)正交互补,非内耗

## ★ North Star(一句话)

**彻底拿下抗体 repertoire 的观测算子 σ:把「我们看到的序列 = 真实功能景观经过『存活/选择/采样』投影后的像」这个等式整个拆开——用开源数据把 σ 的完整算子形式钉死(SHM 算子作突变可达 p_e、非生产性序列作 selection-free baseline、cell-state 元数据作采样通道、亲和力 sigmoid 作选择核),刻画它哪部分可辨识、哪部分是永远丢失的 irreducible 零空间,并在组合完备 DMS(CR9114/CR6261,答案全知)上验证「从幸存者采样能把真实功能景观恢复到哪、哪里注定恢复不了」。**

## 它要彻底解决的问题(不是拆 paper,是突破一个算子)

A/B/C/D 不是四个独立课题,是**同一个算子 σ 的四个面**,必须一起拿下才叫"彻底":
- **A = 突变可达分量 p_e**:什么 SHM 路径可能产生我们看到的序列(已知 hotspot-aware 算子,非通用 kernel)
- **B = 采样/监测通道 p_o(x,m)**:序列经哪条 cell-state 通道(naive/memory/plasma, blood/spleen, isotype)被测到
- **C = 选择复合 σ₁∘σ₂**:generation/tolerance σ₁(从非生产性序列估)与亲和力 σ₂(sigmoid)的复合
- **D = 反卷积验证**:在答案全知的 CR9114 完备景观上,证明从幸存者采样真能反演 σ,并量化 irreducible 零空间

**判据(与 selop 同纪律):** 目标是反演整个观测算子 + 诚实标出零空间,不是造更好的预测器。逆问题 + 非平凡零空间 + 诚实残余。

## 核心数学骨架(Evo-PU,arXiv:2605.06879,已是外部铁证)

观测似然(= selop 的 σ∘φ∘a 写成"被观测概率"):
```
P(观测到 x) = p_a(x;θ) · [ 1 − ∏_{y∈Y(x)} (1 − p_o · p_e(y;α)) ]
              └ 功能性 φ ┘   └────── 监测σ × 突变可达a ──────┘
```
- p_e(y;α) = 1 − exp(−Σ_{y'∈D_Y} P(y'→y)·α·c(y'))  —— Evo-PU 用两常数 P(转换)=2.6e-5 / P(颠换)=1.4e-7
- p_o = 单个全局标量(Evo-PU 的致命弱点之一)
- 训练 = 最大化 log-likelihood(对 D_X 观测项 + 补集 D'_X),用高 emergence 概率的单点突变子近似补集

**Evo-PU 的两个自陈失败原因(在病毒上 work、ProteinGym 上 fail):**
① 全局标量 p_o 抓不住异质监测;② 无 prevalence 数据 → 假设等 prevalence。

**抗体把这两个弱点翻成强项(这就是本课题的存在理由):**
| Evo-PU 项 | 病毒(弱) | 抗体(强) |
|---|---|---|
| p_e | 两常数核苷酸 kernel | 已知 SHM 算子 S5F/Thrifty/EPAM(hotspot-aware,开源参数);祖先=germline 谱系,距离=SHM 加权非 flat Hamming |
| p_o/σ | 隐藏全局标量 | 可观测复合:(1)非生产性序列 Pgen/Ppost 给 selection-free baseline σ₁ +(2)DMS 亲和力 sigmoid σ₂ +(3)OAS 记录的 cell-state 元数据 |
| p_a 真值 | 弱 | 组合完备 DMS:CR9114 2^16 / CR6261 2^11,每个中间体都测了,零幸存者污染 |

## 关键数据集(全开源,纯算力可攻)

| 数据集 | 内容 | ID/访问 | 在本课题的角色 |
|---|---|---|---|
| CR9114/CR6261 DMS | 组合完备 K_D 景观(2^16 / 2^11 全中间体,回溯到 germline) | eLife 71393;用户已有 parquet(cr9114 65536×11, cr6261 2048×8) | **答案钥匙**:p_a 功能性真值 + 反卷积验证靶 |
| DeWitt GC-replay | 52–119 平行 GC,单细胞 BCR + DMS 亲和力景观 + 7 时点 bulk;**自称低亲和力宽容/plateau 是幸存者伪影** | bioRxiv 2025.06.02.656870 / Cell S0092-8674(26)00572-6;Zenodo 15022130 | σ₂ 亲和力 sigmoid 真值 + "伪影"命名来源 |
| OAS | ~2.4B unpaired/~1.5M paired BCR,cell-source/sort-gate/isotype/study 元数据 | Olsen/Deane pro.4205;HF Parquet 镜像 | 真实 repertoire + 异质监测 p_o(x,m) 的协变量来源 |
| SHM 算子 | S5F(Yaari/Kleinstein 2013)、Thrifty(eLife 105471)、EPAM(bioRxiv 2025.06.16.659977) | matsengrp/* 开源 | p_e 突变可达 kernel |
| 非生产性/out-of-frame | selection-free baseline 通道 | OAS 内含;Sheng GSSP PMC5424261 | σ₁ generation/tolerance 估计 |
| Pgen/Ppost 工具 | IGoR / OLGA / SONIA / soNNia | Mora-Walczak,PLoS Comput Biol 1008394 | σ₁ 的 selection-bias 校正机制 |

## 与现 selop(另一 CC)的关系:正交互补,不内耗

- 现 selop 推 **φ**(亲和→适应度 link),走树-SBI(同 Matsen/Victora arXiv:2508.09871/2508.09519)。
- 本课题推 **p_a**(功能性)并把 **σ**(存活/采样投影)当主对象去**反演**,走 survivorship-PU(站 Evo-PU 肩上)。
- selop 把 σ 当"承认存在的 irreducible 障碍";本课题把 σ 当"要正面反演的算子",且抗体是它唯一每项可观测的领域。
- 两条共享同一元发现(观测=投影复合,逆问题有非平凡零空间),互为对方的对照/补强。

## 已知障碍 / 风险(写进 spec 时要正面处理)

1. **可辨识性**:p_a / σ₁ / σ₂ 三者联合是否可辨?(Bakis/Minin 已标 λ/μ/ρ 非辨识,固定 ρ 才解)→ 必须先定可辨识等价类,import Louca-Pennell(Nature 2020)同余类机制。
2. **循环风险(D 面)**:用来"污染"模拟的 σ = 你要矫正的 σ → 必须用独立 σ 做污染、另一独立 σ 做矫正,否则自证。
3. **加性景观假设**:CR9114 DMS 真值本身是加性外推模型;SHM 模型在 out-of-frame 上拟合,迁移到 in-frame selected context 未验。
4. **元数据混杂**:OAS cell-state = study = 测序协议高度纠缠,p_o(x,m) 可能只学到 study identity 而非真监测。
5. **abundance ≠ affinity 红线**(PMC5337809):repertoire 丰度对亲和力近零信息,prevalence 不可当 fitness 代理。

## 关键术语

survivorship bias(幸存者偏差)/ PU learning(正-未标学习)/ class prior(类先验,此处序列依赖)/ SHM 体细胞超突变 / Pgen-Ppost(生成-后选择概率)/ selection-free baseline(非生产性序列)/ emergence(突变涌现)/ surveillance(监测/采样)/ identifiability(可辨识性)/ irreducible null space(不可约零空间)/ DMS 深度突变扫描 / combinatorially complete landscape(组合完备景观)。

## 下一步(Phase 2)

North Star + ResearchBrief 已就位(hard-gate 通过)。下一步交给 **writing-specs**(先 load skill-index 看全 arsenal),把"彻底反演 σ"拆成可执行 spec。**Phase 2 不由本 session 自动进入,待用户确认。**
