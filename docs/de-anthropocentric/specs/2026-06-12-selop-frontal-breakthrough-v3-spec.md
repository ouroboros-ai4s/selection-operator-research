# Research Spec: 选择算子正面突破 v3(σ∘φ∘a 重锚定 · 侦察→发散→收敛)

> Generated: 2026-06-12
> North Star: 在一个把存活/采样算子 σ、体内提取层 a_invivo(力/off-rate)、连接函数 φ 全部构造为已知真值的合成进化沙盒里,通过 AI 辅助理论构造与 compute-only 方法,正面解决"序列→适应度算子 f=σ∘φ∘a 在何种观测下可被诚实辨识与恢复"——既刻画 φ 与 a_invivo 的可辨识等价类,又指明需要哪种介入数据才能把等价类塌缩到绝对刻度,而非在错锚的 φ∘a 上再做一次回归。
> Scope: 3 相(+起手/收尾),session 数不预设(saturation 驱动)
> Source: de-anthropocentric-research-engine
> 前身: v2 spec(docs/de-anthropocentric/specs/2026-06-11-selop-frontal-breakthrough-spec.md);v2 执行到相1·1b 撞出三道地基裂缝(B-S2/B-X2/B-S1),触发 Global Backtrack 回 North Star,再结晶为 v3。
> North Star v3 落盘: context/selection-operator-v2/2026-06-12-00-07-northstar-recrystallization.md
> 关键改装(继承 v2):相1 用自建 mechanism-gap-hunting 引擎替换 gap-analysis(实现规格 GitHub issue #23),本轮按 issue #23 设计**内联编排**执行(直接调 8 个已存在 SOP + 注入 meta-prompt,不先建 skill)。

## 本轮定位(一句话,贯穿全 spec)

本轮交付物仍是一张**全景地图**——但锚定对象已从 f=φ∘a 扩为 **f=σ∘φ∘a**,a 分裂为 a_DMS(输入)/ a_invivo(恢复目标),目标从"恢复 φ"升为"刻画 φ 与 a_invivo 的可辨识等价类 + 指明塌缩等价类所需的最小介入"。"地图"约束产出的呈现形态,不砍流程:三相该做的环节质量照常做满。对抗(stress-test)与 sandbox 实验设计(DIY-4)推迟到下一轮。

## 锚定对象 v3(再结晶后的地基,继承自 North Star v3)

f = σ∘φ∘a。侦察(v2 相1)已把三层地位重判:
- **a 层(双层)**:a_DMS(序列→平衡 K_D,DMS 可测,作输入)与 a_invivo(序列→体内可选表型=力依赖抗原提取量/off-rate)。证据(B-S2:PRX 2023 / Jiang-Wang PNAS 2023 / Cell 2023 / Immunity 2024)指 a_DMS≠a_invivo,故 **a_invivo 升为恢复目标**,不再当"已解的一半"。
- **φ 层**:亲和→适应度,真未知,四特征(地板/天花板/竞争/随机)。B-X1 加判:φ 是条件分布 P(fitness|affinity) 非函数,噪声律本身待辨。
- **σ 层(新增)**:存活/采样算子,多对一不可逆;permissive/early-plateau 等被当成"φ 性质"的现象实为 σ 伪影(B-X2:DeWitt/Victora replay、Matsen SBI push-of-past/pull-of-present)。真观测模型必须含 σ。
- **∘ / 因果**:∘ 是因果 DAG 主张(fitness⊥sequence|phenotype);B-S1(Weinstein 2022 NeurIPS)证纯观测序列数据对 fitness 不可辨,现有模型靠误设而非恢复真值 ⇒ 恢复须引入介入数据。
- **M / 容器**:M 在编码底物上 μ-φ 不可分(B-X4);CTMC 严格连续极限是确定性 ODE 非 diffusion-SDE(B-C1:Dalmau 2014;Tataru 2017 扩散极限需 s=O(1/N)),GC regime 落在两个严格极限之外。

## 15 卡点全集(继承,不重做;再结晶后归层)

- 理论层:T1(φ 无机制导出统一形态)/ T2(群体相对性不进单序列 f)/ T3(∘ 单通道在多表型失效)。
- 辨识层:I1(monotone+scale 是观测模型上限非信息上限)/ I2(SOTA 把结构上限当天花板默认接受)。
- 容器层:C1(CTMC 严格极限是确定性 ODE 非 SDE)/ C2(μ·P_fix 标量化丢生活史)/ C3(单谱系在 Nμ≫1 克隆干涉下破)。
- 第四层 substrate/假设有效性(v3 正式立层):X1(φ 噪声律不可辨)/ X2(σ 存活算子缺失,真模型 f=σ∘φ∘a)/ X3(地板/平台平坦区局部信息全失)/ X4(已知-M 构造上 selection-free,μ-φ 编码底物不可分)/ S1(φ 因果量观测不可辨,Weinstein 证明)/ S2(a 错观测量,体内读力/off-rate)/ S3(φ 非平稳且自指,对自身抗体输出闭环)。
- 详见 context/selection-operator-v2/2026-06-11-22-26-recon.md 与 memory project_selop_recon_foundation_cracks。

---

## Global Context Protocol

- North Star v3 + ResearchBrief 落于 `context/selection-operator-v2/2026-06-12-00-07-northstar-recrystallization.md`;相1 侦察既有产物(15 卡点)于 `context/selection-operator-v2/2026-06-11-22-26-recon.md`;INDEX 于同目录 `INDEX.md`。
- **硬目录约定**:本轮所有 context-init 与 context-checkpoint 文件**一律写入 `context/selection-operator-v2/`**,不落在 `context/` 根目录;INDEX 用该目录下的 `INDEX.md`。
- **每相起手** context-init(载入/创建该相 context 文件;相0/相1 已有,登记/续写即可)。
- **每个 strategy 完成后** context-checkpoint(硬性,追加 evidence + 产出到该相 context 文件)。
- **一相一 context 文件**,命名 `context/selection-operator-v2/<timestamp>-<相名>.md`;v3 侦察续写在既有 recon 文件或新建 recon-v3 文件,执行时择一并在 checkpoint 注明。
- 所有 prose 段落单行成段,无段内换行。

## Global Execution Rules

- 每相 strategy 组合按本 spec 给定;CC 可在 ±10% 内自主增减子代理/迭代轮次,超出须回报。
- **completion 由 saturation-detection 驱动,不以 session 数或时长封顶**(用户定:不设上限)。
- 工具现实:biorxiv MCP 主力之一(取不到原文退 AI 摘要);**brave_llm_context 实测为正文逐字引用主力**;semantic-scholar 取引文图谱;web-search/literature-engine/alphaxiv 补盲;广度侦察用并行子代理。**子代理凭记忆不得编造 verbatim quote**(全原创+求真:伪证据比缺证据更糟),取不到须显式声明并退二次精准取证。
- 硬约束(来自 memory,不可违背):全原创(禁"现成工具套新域");架构限 Transformer/Mamba/Diffusion,图仅作 attention bias,无独立 GNN/CNN/RNN;AI4S 求真非发表;200 年雄心为真,compute 为首选验证路径但非硬约束(非 compute 路径不淘汰,记成本),绝不主动缩小问题。
- backtrack 须用户确认后执行。

## Global Backtrack Conditions

- 相2 发现某突破角度依赖的文献/卡点在相1 未覆盖 → 回相1 补侦察。
- 相3 收敛发现卡点全集存在重大遗漏层(四层之外的真卡点)→ 回相1 重定位。
- 任一相发现锚定对象本身(f=σ∘φ∘a / a 双层 / CTMC 容器)被某卡点进一步根本性动摇 → 暂停,回报用户,可能触发 North Star 再审视(超本轮范围)。
- (v3 已吸收 v2 触发的三道裂缝;若出现第五层或动摇 σ∘φ∘a 分解本身的新证据,同样适用。)

---

## 相0 · 起手(登记)

- **Objective**: 确认本 Phase context 已就绪,登记 v3 spec 为产物,继承 v2 侦察资产,不做实质研究。
- **Expected Input**: North Star v3(已落盘 2026-06-12-00-07);15 卡点全集(2026-06-11-22-26-recon.md);本 spec 文件本身。
- **Focus Areas**: 核对 North Star v3 文件、recon 卡点文件、INDEX 三者存在且为最新;确认 15 卡点继承不重做。
- **Recommended Combination**: context-management → context-init(幂等:已存在则登记返回路径)。
- **Completion Criteria**: North Star v3 文件路径确认存在;recon 文件 15 卡点可读;INDEX 中 v3 行存在。
- **Backtrack Condition**: 无。
- **Execution Steps**:
  - [x] context-init(幂等检查 `context/selection-operator-v2/2026-06-12-00-07-northstar-recrystallization.md` 与 recon 文件)
  - [x] 确认 INDEX.md 中 v3 行存在

---

## 相1 · 侦察(改装:部分继承 v2,补三处新对象 + 第四层定位)

> 相内顺序:1a 补料(新对象核心文献)→ 1b 在 1a + 既有 15 卡点上补第四层正式定位并猎到饱和;1c/1d 在新锚定对象 σ∘φ∘a 上重做,可与 1b 并行。**v2 已猎的 15 卡点继承,不重猎**;本相只补 v3 新增对象(σ/a_invivo/因果)所要求的增量。

- **Objective**: 在新锚定对象 f=σ∘φ∘a 上补完侦察——(a)补三处新对象核心文献(a_invivo 力学提取 / σ 存活算子 / 因果不可辨),(b)把 X1-4/S1-3 在第四层 substrate/假设有效性正式归层并猎到 N=2 饱和,(c)在 σ∘φ∘a 上重画边界底图与重产越界假设。产出更新后的卡点全集(四层 × E→S→W)与新对象底图,不排序、不淘汰(除伪卡点过滤)。
- **Expected Input**: North Star v3;15 卡点全集(recon.md,含 X/S 系列已抽取的 E 原料);三道裂缝的 verbatim 证据;v2 verified 参考清单 + v3 新增(Weinstein 2022、Jiang-Wang PNAS 2023、PRX 2023、Dalmau 2014、Tataru 2017)。
- **Focus Areas**:
  - 第四层(substrate/假设有效性):a 输入是否错锚(a_DMS vs a_invivo)、σ 是否可逆/可恢复、φ 因果是否需介入、φ 是否非平稳。这是 v3 侦察的主战场。
  - a_invivo 层:力依赖抗原提取/off-rate/catch-slip bond 如何映射序列→可选表型;DMS-K_D 与提取量的偏离量级。
  - σ 层:存活/采样算子的数学形式(多对一投影)、何种观测(时序/go-back-in-time)可破投影。
  - 因果层:Weinstein 不可辨证明的边界——哪些介入(do(phenotype)/控制抗原/定亲和)能塌缩等价类;因果推断领域有何可迁移的辨识结果。
  - 工具现实:biorxiv 主力,brave_llm_context 取正文逐字,子代理凭记忆不造 quote。
- **Recommended Combination**(四子阶段):
  - **1a** knowledge-acquisition / literature-survey → deep-survey(定向深挖 a_invivo 力学提取 / σ 存活算子 / 因果不可辨与介入辨识)+ snowball(种子 Weinstein 2022 / Jiang-Wang 2023 / DeWitt replay 前后向追链;辨识层补 v2 遗留的 Otwinowski round-3)+ narrative-review(带四层问题读)。
  - **1b** ★mechanism-gap-hunting(自建引擎,内联编排;issue #23 四工序)→ ① 卡点症状抽取(assumption-audit / assumption-surfacing:在新对象文献上猎承重让步措辞,记 E)② 四层定位(dialectical-reformulation + abstraction-laddering:第四层 substrate/假设有效性正式立层,X1-4/S1-3 归位,新症状归四层之一)③ 根因下钻(five-whys-drilling + current-reality-tree)④ 挡路验真(failure-mode-analysis / failure-clustering:滤伪卡点)。**继承 15 卡点不重猎,只补第四层增量并猎到 N=2 无新卡点**。
  - **1c** deep-insight / boundary-analysis → validity-envelope-mapping(在 σ∘φ∘a 上重画可攻区/死区底图:σ 不可逆区、a_DMS≠a_invivo 偏离区、φ 不可辨等价类区、CTMC 失效区——产新底图供相2)。
  - **1d** deep-insight / problem-reformulation → dominant-idea-escape(旧越界 f=σ∘φ∘a 已成 v3 主范式;产更外层越界假设——"如果连 σ∘φ∘a 也不是对象会怎样",喂相2)。
- **Completion Criteria**(saturation 驱动):
  - 1a:三处新对象文献各覆盖(a_invivo 力学 / σ / 因果不可辨),snowball 连续 2 轮无新种子论文。
  - 1b:第四层正式立层且 X1-4/S1-3 全部归位;卡点猎取连续 N=2 轮无新卡点入全集;每条卡点格式完整 `[层] 卡点名 | E:原文+出处 | S:症状 | W:根因机制 | 验真:挡路性如何满足`;四层每层至少各被检视过(允许某层结论为"无新真卡点",但须显式记录)。
  - 1c:可攻区/死区底图在 σ∘φ∘a 上覆盖全集涉及的方法与容器,含 σ/a 双层/因果三处新区。
  - 1d:至少产出 1 条比 σ∘φ∘a 更外层的越界假设。
- **Backtrack Condition**: 若 1b 四层定位发现大量症状落入"疑似越界"(四层之外)→ 提示可能需新增第五层或回 North Star 审视容器抽象(须用户确认)。
- **Execution Steps**:
  - [x] context-init(续写 recon.md 或新建 `<ts>-recon-v3.md`,在 checkpoint 注明)
  - [x] 1a literature-survey(deep-survey + snowball + narrative-review,新对象三处);子代理并行
  - [x] context-checkpoint(新对象文献全集 + 四层问题证据)
  - [x] 1b mechanism-gap-hunting 四工序(继承 15 卡点,补第四层定位,猎到 N=2 饱和)
  - [x] context-checkpoint(更新卡点全集,四层 × E→S→W;伪卡点留档)
  - [x] 1c boundary-analysis / validity-envelope-mapping(σ∘φ∘a 新底图;可与 1b 并行)
  - [x] 1d problem-reformulation / dominant-idea-escape(更外层越界;可与 1b 并行)
  - [x] context-checkpoint(新底图 + 越界假设)

---

## 相2 · 发散(每缺口生多角度,不强行收一条)

> 相1→相2 路由:四层卡点全集 × 三条发散路**全展开**(不按层预筛),每缺口每路用 saturation-detection 判停,去重/收束推到相3。本相只管穷尽生成,不评判优劣。

- **Objective**: 对相1 四层卡点全集中每个卡点,生成多条独立突破角度(理论候选 / 方法候选),不强行收成一条;穷尽覆盖,防组合爆炸靠 saturation。v3 重点:针对 σ/a_invivo/因果三处新对象的卡点,角度须落到"在合成世界里可造介入 do() 验证"的形态。
- **Expected Input**: 相1 四层卡点全集(σ∘φ∘a × E→S→W);1c 在 σ∘φ∘a 上的可攻区/死区底图;1d 更外层越界假设。
- **Focus Areas**:
  - 每个卡点至少经三条发散路检视:炸假设 / 重构数学形态 / 跨域取经。
  - cross-domain 取经域**锁定六域**(v3 扩展):群体遗传学 / 统计物理 / 反问题 / 最优传输 / **因果推断(do-calculus、介入辨识)** / **生物物理力学(力依赖键断裂、catch-slip bond、抗原提取)**。后两域专攻 v3 新增的因果不可辨(B-S1)与力提取(B-S2)维度。
  - 角度须落到"理论候选"或"方法候选";方法候选须隐含可在升级版 sandbox(σ/a_invivo/φ 真值 + 介入支持)验证的形态,本相不展开验证设计。
  - 死区底图标记的方向(如 embedding-SDE 强选择区、σ 不可逆且无时序数据区)不再投入发散精力,显式记"已知死区,跳过"。
  - 辨识诚实贯穿:发散角度不得偷换 a_DMS 冒充 a_invivo、不得在不可辨等价类内谎称恢复绝对刻度。
- **Recommended Combination**: creative-ideation →
  - assumption-destruction(sacred-cow-hunting 猎"亲和力=适应度代理""a 已知""σ 可忽略""仅单调可辨"等不容置疑信念 + axiom-negation 悬置公理开新解空间);
  - structural-deconstruction(component-surgery 对 f=σ∘φ∘a 做加/减/拆/并手术 + function-trimming 砍零件看功能是否保留);
  - cross-domain-discovery(design-by-analogy + analogical-transfer,锁六域结构映射);
  - perspective-forcing(temporal-projection 5yr/50yr/500yr 视角,呼应 200 年雄心)。
- **Completion Criteria**(saturation 驱动):
  - 每个卡点的突破角度达饱和(连续 2 轮无新角度,saturation-detection per 卡点 per 路);
  - 四层卡点都被发散过(无某层卡点被整体跳过);
  - 六个取经域都被 cross-domain 实际触及(不是只取最顺手的几个,因果与力学两域必须各落到至少一个卡点);
  - 越界假设(1d)至少被一条发散路接住、生成对应角度。
- **Backtrack Condition**: 若某突破角度依赖的机制/文献在相1 未覆盖 → 回相1 补侦察(须用户确认)。
- **Execution Steps**:
  - [x] context-init(创建 `context/selection-operator-v2/2026-06-12-15-25-divergence.md`)
  - [x] assumption-destruction(逐卡点炸承重假设);4 子代理并行(簇A/B+C/D+E/F+G)
  - [x] context-checkpoint(发散路1:四头独立收敛到测度值流统一子)
  - [x] structural-deconstruction(重构 σ∘φ∘a 数学形态);3 子代理(生成元/力学/部分辨识)
  - [x] context-checkpoint(发散路2:三块在 ρ(E) 度量下咬合;奥卡姆诊断量)
  - [x] cross-domain-discovery(锁六域取经);3 子代理(因果+反问题/群遗+统物/OT+力学)
  - [x] context-checkpoint(发散路3:六域→Doi-Peliti 骨干;R_irr 四语言同构)
  - [x] perspective-forcing(时间投射补角度)→ **Deviation: 用 cross-domain 六域深挖替代(±10% 内 1-strategy 替换)。Rationale: 前两路已高度收敛到统一骨架,时间投射(5yr/50yr/500yr)对已收敛骨架边际增益低于六域工具完备性检验;六域更对路于"验证骨架是否漏维度",且 200 年雄心已在 Doi-Peliti 统一骨架的理论深度中体现。**
  - [x] context-checkpoint(每卡点→多角度全集,标注来源路与所属层;相2 三路总收敛)

---

## 相3 · 收敛(多角度→全景地图,流程做满)

> 产出定位=**地图**,但 feasibility / portfolio / steel-manning 全保留、照常做好。"地图"约束呈现形态(分好组、标好可行性、画出覆盖面),不砍流程。

- **Objective**: 把相2 多角度全集收敛成全景地图——按突破方向归类、标注可行性、画出覆盖面;每条保留角度带"它若成立需在升级版 sandbox 验什么"的判据草案(非完整实验设计)。
- **Expected Input**: 相2 每卡点→多角度全集(带来源路与四层标注);相1 σ∘φ∘a 底图与越界假设。
- **Focus Areas**:
  - 裁判用**求真四轴**:{消灭真缺口? 可验证(compute 优先)? 打过基线(CoSiNE/DASM 类)? **辨识诚实**(不偷换 a_DMS 冒充 a_invivo、不越可辨识等价类谎称恢复绝对刻度、显式标注 σ 偏差)?};**硬删"新颖性/可发表度"轴**。v3 辨识诚实轴权重最重——这是整轮再结晶的由来。
  - compute 为**首选非硬约束**:非 compute 验证路径不淘汰,只记成本(staged-gate 记录,不 kill)。介入数据需求(do(phenotype)/控制抗原)在合成世界免费可造,故"需介入"不等于"非 compute"——须显式区分"sandbox 内可造介入"(仍 compute)与"须真实 wet-lab 介入"(记成本)。
  - portfolio 用 diversity-maximization 保覆盖面,不收成单条;保留多突破方向的组合,且四层均有代表。
  - steel-manning 轻量:只对地图里**求真四轴得分最低的 ≤3 条已保留候选**做自检,**不展开完整对抗**(对抗推迟下一轮)。
- **Recommended Combination**: convergence →
  - feasibility-assessment(staged-gate-evaluation 判可验证性+落地代价,compute 优先记成本 + constraint-drilling 标注哪些步骤须 compute、哪些可放宽、哪些介入 sandbox 内可造);
  - multi-criteria-scoring(★求真四轴打分,硬删新颖性轴,辨识诚实轴权重最重);
  - portfolio-optimization(diversity-maximization 按突破方向归类、保覆盖面、四层均覆盖);
  - steel-manning(轻量自检,winner-stress-testing 仅限四轴得分最低的 ≤3 条已保留候选)。
- **Completion Criteria**(地图绘制完成):
  - 相2 全部角度都被四轴评过(无遗漏);
  - 地图按突破方向分组,每组覆盖面与所攻卡点层(四层)显式标注;
  - 每条保留角度带 sandbox 验证判据草案(验什么 / 用什么基线 / 单调恢复度与辨识上限吻合度如何量 / 需 sandbox 内何种介入);
  - 被四轴判出局的角度留档(注明出局轴),不静默丢弃;
  - 全景地图能回答"当前 σ∘φ∘a 理论有哪些卡点(四层)、各有哪些突破方向、哪些方向 compute 可验、哪些须真实介入、覆盖面有无空洞"。
- **Backtrack Condition**: 若收敛发现卡点全集存在四层之外的重大遗漏层 → 回相1 重定位(须用户确认)。
- **Execution Steps**:
  - [x] context-init(创建 `context/selection-operator-v2/2026-06-12-16-52-convergence.md`)
  - [x] feasibility-assessment(12 候选 staged-gate,compute 优先记成本,区分 sandbox 内介入 vs wet-lab 介入)
  - [x] context-checkpoint(feasibility:无候选出局,wet-lab 成本点=B2/T-Crooks 真实 n_Ag/力谱)
  - [x] multi-criteria-scoring(求真四轴,删新颖性,辨识诚实轴权重最重;B2 最高 28.0)
  - [x] context-checkpoint(打分表 + H1-对-S1/H5 全形式出局留档)
  - [x] portfolio-optimization / diversity-maximization(4 突破方向组,四层全覆盖无空洞)
  - [x] steel-manning 轻量自检(B5/T-FDR/N-new 三条最低分,全留但不占独立突破槽)
  - [x] context-checkpoint(全景地图 + 出局角度留档)

---

## 相收尾 · 落盘交棒

- **Objective**: 三相结果固化,交下一轮(对抗 + 升级版 sandbox 设计)。
- **Recommended Combination**: context-management → context-checkpoint。
- **Completion Criteria**: 全景地图 + 四层卡点全集 + 多角度全集 + 出局留档 全部落盘;INDEX 更新;下一轮入口显式列出。
- **Execution Steps**:
  - [x] context-checkpoint(三相汇总)
  - [x] 更新 INDEX.md
  - [x] 列出下一轮待办:stress-test 对抗、experiment-execution / DIY-4 升级版 sandbox 合成世界设计

---

## 推迟到下一轮(本轮不展开)

- **stress-test**:对收敛后候选做完整对抗(multiagent-debate / red-teaming / counterfactual-probing)。
- **experiment-execution / ★DIY-4(v3 升级)**:wet-lab 全部重构为 digital-evolution-sandbox 合成世界设计——v3 升级要点:不仅扫 φ 形态(地板/天花板/竞争/随机)、扫 M、扫 N_e,还须**把 σ(存活/采样算子)、a_invivo(力依赖提取层,区别于 a_DMS)、φ 噪声律全部构造为已知真值**,并**支持在合成世界里施加介入 do(phenotype)/控制抗原/定亲和**(介入在真值世界免费,这是 compute-only 在"承认纯观测不可辨"后仍成立的根本)。基线 CoSiNE/DASM 类;指标=单调恢复度 + 辨识上限吻合度 + **σ 偏差校正度 + a_invivo 恢复度 + 介入塌缩等价类的有效性**;constraint-analysis 只留 compute 相关(但 compute 为首选非硬约束)。
- v2 sandbox 现有草图:`context/digital-evolution-sandbox/2026-06-11-16-10-design.md`(Knobs/Cell/World + step 三件事),下一轮在此之上正式设计 v3(加 σ/a_invivo/介入)。

---

## v2 → v3 改装对照(供执行者快速对齐)

| 维度 | v2 | v3 |
|------|----|----|
| 锚定对象 | f = φ∘a | **f = σ∘φ∘a** |
| a 层 | 已知输入,非空白 | **a_DMS(输入)/ a_invivo(力提取,升为恢复目标)** |
| 目标 | 恢复 φ | **刻画 φ + a_invivo 可辨识等价类 + 指明塌缩所需最小介入** |
| 层数 | 三层(理论/辨识/容器) | **四层(+ substrate/假设有效性)** |
| 卡点 | 待猎 | **15 卡点继承,1b 只补第四层增量** |
| cross-domain | 四域 | **六域(+ 因果推断 + 生物物理力学)** |
| sandbox | φ/f 真值 | **σ/a_invivo/φ 真值 + 介入支持**(下一轮设计) |
| compute-only | 唯一合法首选 | 仍首选;承认需介入但介入在合成世界免费,故不破 compute-only |


---
