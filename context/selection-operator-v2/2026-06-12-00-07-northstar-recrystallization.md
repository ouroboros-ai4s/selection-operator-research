# North Star 再结晶 — 选择算子(侦察撞出地基裂缝后)

> Created: 2026-06-12 00:07
> Topic: 相1 侦察撞出三道动摇锚定对象 f=φ∘a 的裂缝(B-S2 a 错观测量 / B-X2 缺 σ 存活算子 / B-S1 φ 因果不可辨),触发 North Star 再审视并重定攻击对象+模式
> Phase: North Star Crystallization (re-crystallization, hot-start)

## Plan Context

本次再结晶由 executing-specs 的 Global Backtrack 触发:相1·1b mechanism-gap-hunting 猎到 15 条真卡点,其中三条根本性动摇了上一版 North Star 的锚定对象 f=φ∘a 与 compute-only 观测路径(B-S2/B-X2/B-S1)。用户裁决暂停回 North Star 再审。本次任务不是重新探索领域(领域刚深度侦察过),而是在已知三道裂缝与 15 卡点全集之上,重定攻击对象(锚定对象是否扩为 f=σ∘φ∘a、a 是否区分 DMS/in-vivo)与攻击模式(纯观测是否够,还是必须刻画可辨识等价类+指明所需介入)。actor-profiling / landscape / obstacle 均已就绪(见 [[project_selop_recon_foundation_cracks]] 与上一版 north-star 文件),核心待决=direction-narrowing。

## 继承的地基(上一版,部分待审)

f=φ∘a;a=序列→亲和(−logK_D)上一版称已知可测——**本次受 B-S2 质疑**。φ=亲和→适应度,真未知层,四特征(地板/天花板/竞争/随机)。∘ 单通道因果——**受 B-S1/B-T3 质疑**。M(SHM/S5F)已知——**受 B-X4 质疑(编码底物上 μ-φ 不可分)**。CTMC 容器——**受 B-C1/B-X2 质疑(严格极限是确定性 ODE;真模型缺 σ)**。

## 三道地基裂缝(再结晶的核心输入,verbatim 证据见 recon 文件)

- **B-S2**:体内选择读力依赖抗原提取/off-rate,非 DMS 平衡 K_D(PRX 2023;Jiang-Wang PNAS 2023;Cell 2023/Immunity 2024 体内分辨不出克隆间亲和差)⇒ a_DMS≠a_invivo,"已解的一半"可能没解。
- **B-X2**:真观测模型 f=σ∘φ∘a,σ=存活/采样算子(多对一不可逆);permissive/early-plateau 实为 survivorship 假象(DeWitt/Victora replay;Matsen SBI)。
- **B-S1**:φ 因果量,Weinstein 2022 证明 fitness 从纯观测序列数据不可辨,现有模型靠误设而非恢复真值 ⇒ 突破杠杆须"换观测量/引入介入"而非"换模型"。

## 三个候选收敛方向(待用户拍)

1. **扩对象**:f=σ∘φ∘a,a 区分 a_DMS/a_invivo(力学/动力学观测量);保留 compute-only sandbox,但 sandbox 须把 σ 与错锚构造进真值世界。
2. **改目标**:承认 B-S1 纯观测不可辨,North Star 从"恢复 φ"改为"刻画 φ 的可辨识等价类 + 指明需何种介入数据才能塌缩它";仍 compute-only 可验,目标更诚实。
3. **维持原 North Star**:三裂缝降级为侦察发现的风险,作下一轮对抗相输入,本轮按原 spec 收尾出地图。

## 待结晶产物

North Star(一句话)+ ResearchBrief(结构化),用户确认后为 hard gate。

---

# ☑ 用户裁决(direction-narrowing,2026-06-12)

- **收敛方向 = 两者合并**:锚定对象扩为 f=σ∘φ∘a 且 a 双层;目标同时改为诚实的可辨识刻画 + 介入需求。
- **a 层 = a_invivo 也成恢复目标**:课题从"恢复一个算子 φ"升为"同时刻画 a(平衡 K_D→力/off-rate 提取量的映射)与 φ"。最大野心,符合"绝不主动缩小问题"。
- **compute-only 仍成立**(自行推定,写进 brief):承认纯观测不可辨、需介入数据 → 但 sandbox 是构造真值世界,介入 do(phenotype) 在合成世界免费可造,无需 wet-lab。

---

# North Star v3(再结晶,待确认)

## North Star(一句话)

在一个把存活/采样算子 σ、体内提取层 a_invivo(力/off-rate)、连接函数 φ 全部构造为已知真值的合成进化沙盒里,通过 AI 辅助理论构造与 compute-only 方法,正面解决"序列→适应度算子 f=σ∘φ∘a 在何种观测下可被诚实辨识与恢复"这一问题——既刻画 φ 与 a_invivo 的可辨识等价类,又指明需要哪种介入数据(do(phenotype)/控制抗原/定亲和)才能把等价类塌缩到绝对刻度,而非在错锚的 φ∘a 上再做一次回归。

## ResearchBrief

### ① 锚定对象(再结晶后,扩展版)
f = σ∘φ∘a。三层各自的地位被侦察重判:
- **a 层(双层)**:a_DMS(序列→平衡 K_D,DMS 可测,作输入)与 a_invivo(序列→体内可选表型 = 力依赖抗原提取量/off-rate)。B-S2 证据指 a_DMS≠a_invivo,故 **a_invivo 升为恢复目标**,不再当"已解"。
- **φ 层**:亲和→适应度,真未知,四特征(地板/天花板/竞争/随机)。B-X1 加判:φ 是条件分布非函数,噪声律本身待辨。
- **σ 层(新增)**:存活/采样算子,多对一不可逆;permissive/early-plateau 等"φ 性质"实为 σ 伪影(B-X2)。真观测模型必须含 σ。
- **∘ / 因果**:∘ 是因果 DAG 主张,B-S1(Weinstein 2022)证纯观测不可辨 → 恢复须引入介入。
- **M / 容器**:M 在编码底物上 μ-φ 不可分(B-X4);CTMC 严格连续极限是确定性 ODE 非 SDE(B-C1),GC regime 落在两个严格极限之外。

### ② 模式转变(本次再结晶的核心)
旧 v2:AI 正面构造理论 + compute-only 恢复 φ(在 f=φ∘a 上)。
新 v3:**承认纯观测对 φ/a_invivo 不可辨(有证明)**,把目标从"恢复"改为"刻画可辨识等价类 + 设计塌缩它所需的最小介入"。攻击对象从 φ∘a 扩为 σ∘φ∘a。验证基底仍 = digital-evolution-sandbox,但 sandbox 升级:σ、a_invivo(力学提取层)、φ 噪声律全部构造为真值,且支持在合成世界里施加介入 do(phenotype)/控制抗原/定亲和——介入在真值世界免费,这正是 compute-only 仍成立的原因。

### ③ 任务结构(本次方向)
- 仍三步:侦察→发散→收敛(对抗推迟)。侦察相 1a/1b 已完成(15 卡点全集),再结晶后 **1b 需补第四层 substrate/假设有效性的定位**,1c/1d 在新锚定对象上重做(旧锚定对象下做无意义)。
- 终极判据(求真四轴,继承 v2 并强化辨识诚实轴):消灭真缺口?compute 可验?打过基线(CoSiNE/DASM)?**辨识诚实**(不偷换 a_DMS 冒充 a_invivo、不越可辨识等价类谎称恢复绝对刻度、显式标注 σ 偏差)?

### ④ 硬约束(继承,不可违背)
全原创,禁现成工具套新域;架构限 Transformer/Mamba/Diffusion,图仅作 attention bias,无独立 GNN/CNN/RNN;AI4S 求真非发表;200 年雄心为真,compute 首选非硬约束(非 compute 路径不淘汰,记成本),绝不主动缩小问题。

### ⑤ 工具现实
biorxiv MCP 主力之一(取不到退 AI 摘要);brave_llm_context 实测为正文逐字引用主力;semantic-scholar 取引文图谱;广度侦察用并行子代理。

### ⑥ 已侦察的卡点资产(继承,不重做)
15 真卡点全集(T1-3/I1-2/C1-3/X1-4/S1-3),三层已饱和 + 第四层涌现;见 [[project_selop_recon_foundation_cracks]] 与 recon 文件。

### 关键参考(verified,继承)
CR9114/Phillips 2021;Matsen-Victora SBI 2508.09871;CoSiNE 2602.18982;DASM eLife 2026;DeWitt 2025 replay;Weinstein 2022(NeurIPS,fitness 不可辨证明);Jiang-Wang PNAS 2023 / PRX 2023(力学提取);Otwinowski 2018(global epistasis 辨识);Dalmau 2014(Moran→Eigen 确定性极限);Tataru 2017(扩散极限 s=O(1/N) 条件)。

### 关键术语
存活算子 σ / 体内提取层 a_invivo(力/off-rate)/ 平衡 a_DMS / 连接函数 φ / 可辨识等价类 / 介入 do(phenotype) / 塌缩等价类 / digital-evolution-sandbox(σ/a_invivo/φ 真值)/ E→S→W。

---

# ☑ CHECKPOINT — North Star v3 用户确认(hard gate 通过,2026-06-12)

- 用户确认 North Star v3 + ResearchBrief,含两点自行推定(compute-only 仍成立;辨识诚实轴强化)。
- 用户指示:spec 沿用 v2 老形式,配 σ∘φ∘a 新内容(=改装 v2 spec 而非从零写)。
- 转 Phase 2:skill-index → writing-specs 生成 v3 spec。
- 后续影响:15 卡点全集继承不重做;1b 补第四层定位、1c/1d 在新锚定对象上重做;sandbox 升级(σ/a_invivo/φ 真值 + 介入支持)。


