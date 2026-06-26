# Research Spec: 选择算子正面突破(侦察→发散→收敛)

> Generated: 2026-06-11
> North Star: 在一个 φ/f 为已知真值的合成进化沙盒里,通过 AI 辅助的深度文献侦察与理论构造,系统性地猎取当前"选择算子"理论的全部缺陷,生成多条正面突破路径并收敛,目标是把"序列→适应度的选择算子如何被科学地刻画与恢复"这一问题从理论上彻底解决,而非再做一次数据拟合。
> Scope: 3 相(+起手/收尾),session 数不预设(saturation 驱动)
> Source: de-anthropocentric-research-engine
> 骨架: docs/de-anthropocentric/specs/DRAFT-selop-frontal-breakthrough-skeleton.md
> 关键改装: 相1 用自建 mechanism-gap-hunting 引擎替换 gap-analysis(实现规格 GitHub issue #23 / ISSUE-mechanism-gap-hunting.md)
> 执行约定(2026-06-11 确认): mechanism-gap-hunting 暂未做成独立 skill,本轮按 issue #23 的设计**内联编排**——直接调用已存在的 8 个 SOP(assumption-audit/assumption-surfacing、dialectical-reformulation/abstraction-laddering、five-whys-drilling、current-reality-tree、failure-mode-analysis/failure-clustering)并在每序注入 issue #23 规定的 meta-prompt(求挡路卡点而非文献空白),不先停下来建 skill;skill 化留待下一轮。

## 本轮定位(一句话,贯穿全 spec)

本轮交付物是一张**全景地图**——当前 φ/f 理论的卡点全集 × 多条突破角度,分好组、标好可行性、画出覆盖面。"地图"约束的是产出的**呈现形态**,不是砍流程:三相该做的环节质量照常做满。对抗(stress-test)与 sandbox 实验设计(DIY-4)推迟到下一轮。

## 锚定对象(不动的地基,继承自 v2 背景文件)

f = φ∘a。a(序列→亲和力,−logK_D)已知可测可回归,非科学空白。φ(亲和力→适应度)是真未知层,长着地板/天花板/竞争相对/随机四个非线性特征,体内 assay 测不出。∘ 编码单通道因果"适应度⊥序列|表型"。M(突变,SHM/S5F)已知;已知 M 把 f 从完全不可辨识压缩到"仅可辨识到单调变换+全局尺度 N_e+加性常数"。物理容器是离散态连续时间随机过程(CTMC),Q(s→s')=μ(s→s')·P_fix(Δf);连续 embedding-SDE 非严格极限,不采用。

## 三条必须正面撞的已知裂缝(侦察相的种子,非全集)

1. φ 的"竞争相对"是群体级特征,而 f(s) 写成单序列函数——算子形式能否容纳群体依赖?可能最深。
2. "f 只可辨识到单调变换+尺度"是真理论上限,还是只是 CoSiNE/DASM 这类现有方法的上限?二者天差地别,直接决定突破空间。
3. ∘ 的单通道假设在多维表型(亲和力/稳定性/表达/polyreactivity)下是否仍成立。

---

## Global Context Protocol

- 本 Phase 的 context 已就绪:North Star + ResearchBrief 落于 `context/selection-operator-v2/2026-06-11-21-03-northstar-frontal-breakthrough.md`,INDEX 于同目录 `INDEX.md`。
- **每相起手** context-init(载入/创建该相 context 文件;相0 已有,登记即可)。
- **每个 strategy 完成后** context-checkpoint(硬性,≥500 行,追加 evidence + 产出到该相 context 文件)。
- **硬目录约定(2026-06-11 确认)**:本轮所有 context-init 与 context-checkpoint 文件**一律写入 `context/selection-operator-v2/`**,不落在 `context/` 根目录;INDEX 也用该目录下的 `INDEX.md`。
- **一相一 context 文件**,命名 `context/selection-operator-v2/<timestamp>-<相名>.md`。
- 所有 prose 段落单行成段,无段内换行(继承骨架与 context-init 规约)。

## Global Execution Rules

- 每相 strategy 组合按本 spec 给定;CC 可在 ±10% 内自主增减子代理/迭代轮次,超出须回报。
- **completion 由 saturation-detection 驱动,不以 session 数或时长封顶**(用户定:不设上限)。
- 工具现实:biorxiv MCP 为主力检索之一,大量使用;取不到原文退 AI 摘要;brave-search(web-search/web-research)、literature-engine、alphaxiv 并用补盲区;广度侦察用 subagent-spawning 并行铺开。
- 硬约束(来自 memory,不可违背):全原创(禁止"现成工具套新域");架构限 Transformer/Mamba/Diffusion,图仅作 attention bias,无独立 GNN/CNN/RNN;AI4S 求真非发表;200 年雄心为真,compute 为首选验证路径但非硬约束(非 compute 路径不淘汰,记成本),绝不主动缩小问题。
- backtrack 须用户确认后执行。

## Global Backtrack Conditions

- 相2 发现某突破角度依赖的文献/卡点在相1 未覆盖 → 回相1 补侦察。
- 相3 收敛发现卡点全集存在重大遗漏层(三层之外的真卡点)→ 回相1 重定位。
- 任一相发现锚定对象本身(f=φ∘a / CTMC 容器)被某卡点根本性动摇 → 暂停,回报用户,可能触发 North Star 再审视(超本轮范围)。

---

## 相0 · 起手(登记)

- **Objective**: 确认本 Phase context 已就绪,登记本 spec 为产物,不做实质研究。
- **Expected Input**: North Star + ResearchBrief(已落盘);本 spec 文件本身。
- **Focus Areas**: 仅核对 context 文件与 INDEX 存在且内容为最新模式转变版本。
- **Recommended Combination**: context-management → context-init(幂等:已存在则登记返回路径)。
- **Completion Criteria**: context 文件路径确认存在;INDEX 中本 Phase 行存在。
- **Backtrack Condition**: 无。
- **Execution Steps**:
  - [x] context-init(幂等检查 `context/selection-operator-v2/2026-06-11-21-03-northstar-frontal-breakthrough.md`)
  - [x] 确认 INDEX.md 行存在

---

## 相1 · 侦察(穷举猎缺陷,非择优)

> 相内顺序为**串行依赖**:1a 文献先铺全 → 1b 引擎在其产出上猎卡点 → 1c/1d 补料。1c/1d 可在 1b 进行中并行启动(不依赖 1b 完成)。

- **Objective**: 穷举式猎取当前 φ/f 理解里的**全部**机制卡点(非择优),覆盖理论层 / 辨识层 / 容器层三层,产出带 evidence 的卡点全集,不排序、不淘汰(除伪卡点过滤)。
- **Expected Input**: 锚定对象(f=φ∘a / 已知 M / 单调+尺度可辨识 / CTMC 容器);三条已知裂缝作为侦察种子;verified 参考清单(CR9114/Phillips 2021、Matsen-Victora SBI arXiv:2508.09871、CoSiNE arXiv:2602.18982、DASM eLife 2026、DeWitt 2025、Eigen/Crow-Kimura/Halpern-Bruno、Ethier-Nagylaki 1989/Chalub-Souza 2011)。
- **Focus Areas**:
  - 理论层:φ 统一形态是否缺失 / 群体相对性能否写进单序列 f / ∘ 单通道是否成立。
  - 辨识层:已知 M 下 f 是否真只到单调+尺度,还是仅现有方法的上限。
  - 容器层:离散 CTMC 是否就是正确数学对象。
  - 工具现实:biorxiv 主力,subagent 并行铺广度;取不到原文退 AI 摘要。
- **Recommended Combination**(四子阶段):
  - **1a** knowledge-acquisition / literature-survey → deep-survey(定向深挖 φ 形态/可辨识性/CTMC)+ snowball(种子 CoSiNE/DASM/Matsen-Victora/DeWitt 前后向引文追链)+ narrative-review(理论驱动读法,带三层问题读)。
  - **1b** ★mechanism-gap-hunting(自建引擎,替 gap-analysis;实现规格 issue #23;**本轮内联编排执行**:直接调下列已存在 SOP + 注入 issue #23 meta-prompt,不先建 skill)→ 四工序:① 卡点症状抽取(assumption-audit / assumption-surfacing:猎"we assume/cannot be measured/as a first step/unknown/for simplicity"等承重让步措辞,记 E)② 三层定位(dialectical-reformulation + abstraction-laddering)③ 根因下钻(five-whys-drilling + current-reality-tree,TOC 充分因,挖到满足挡路性)④ 挡路验真(failure-mode-analysis / failure-clustering:验"是否真阻碍进展",滤"伪装成卡点的可发表点")。
  - **1c** deep-insight / boundary-analysis → validity-envelope-mapping(给现有方法/容器画有效边界:扩散极限在哪失效、CTMC 在哪还成立——产"可攻区 vs 死区"底图供相2)。
  - **1d** deep-insight / problem-reformulation → dominant-idea-escape(跳出"f=φ∘a on CTMC"主导范式,产"如果换个对象会怎样"的越界假设供相2)。
- **Completion Criteria**(saturation 驱动):
  - 1a:文献覆盖三层种子问题,snowball 连续 2 轮无新种子论文(saturation-detection)。
  - 1b:卡点猎取连续 N=2 轮无新卡点入全集(saturation);每条卡点格式完整 `[层] 卡点名 | E:原文+出处 | S:症状 | W:根因机制 | 验真:挡路性如何满足`;三层每层至少各有卡点被检视过(允许某层结论为"该层无真卡点",但须显式记录而非遗漏)。
  - 1c:可攻区/死区底图覆盖 1b 全集涉及的方法与容器。
  - 1d:至少产出 1 条越界假设(跳出主导范式的重构问题对象设想)。
- **Backtrack Condition**: 若 1b 三层定位发现大量症状落入"疑似越界"(三层之外),→ 提示可能需在相1 内新增层或回 North Star 审视容器抽象(须用户确认)。
- **Execution Steps**:
  - [x] context-init(创建 `context/selection-operator-v2/<ts>-recon.md`)
  - [x] 1a literature-survey(deep-survey + snowball + narrative-review);子代理并行
  - [x] context-checkpoint(1a 文献全集 + 三层问题初步证据)
  - [ ] 1b mechanism-gap-hunting 四工序(在 1a 产出上;穷举不排序)
  - [ ] context-checkpoint(卡点全集,E→S→W 格式;伪卡点留档)
  - [ ] 1c boundary-analysis / validity-envelope-mapping(可与 1b 并行)
  - [ ] 1d problem-reformulation / dominant-idea-escape(可与 1b 并行)
  - [ ] context-checkpoint(底图 + 越界假设)

---

## 相2 · 发散(每缺口生多角度,不强行收一条)

> 相1→相2 路由:卡点全集 × 三条发散路**全展开**(不按层预筛),每缺口每路用 saturation-detection 判停,去重/收束推到相3。本相只管穷尽生成,不评判优劣。

- **Objective**: 对相1 卡点全集中的每个卡点,生成多条独立的突破角度(理论候选 / 方法候选),不强行收成一条;穷尽覆盖,防组合爆炸靠 saturation 而非预筛。
- **Expected Input**: 相1 卡点全集(三层 × E→S→W);1c 可攻区/死区底图(指示哪些方向是死区,避免在死区生角度);1d 越界假设(作为额外发散种子)。
- **Focus Areas**:
  - 每个卡点至少经三条发散路检视:炸假设 / 重构数学形态 / 跨域取经。
  - cross-domain 取经域**锁定四域**:群体遗传学 / 统计物理 / 反问题 / 最优传输,非泛泛跨域。
  - 角度须落到"理论候选"或"方法候选",方法候选须隐含可在 sandbox 验证的形态(为相3 可行性判定铺垫),但本相不展开验证设计。
  - 死区底图标记的方向(如 embedding-SDE 强选择区)不再投入发散精力,显式记"已知死区,跳过"。
- **Recommended Combination**: creative-ideation →
  - assumption-destruction(sacred-cow-hunting 猎"亲和力=适应度代理""仅单调可辨识"等不容置疑信念 + axiom-negation 悬置公理开新解空间);
  - structural-deconstruction(component-surgery 对 f=φ∘a 做加/减/拆/并手术 + function-trimming 砍零件看功能是否保留);
  - cross-domain-discovery(design-by-analogy + analogical-transfer,锁四域结构映射);
  - perspective-forcing(temporal-projection 5yr/50yr/500yr 视角,呼应 200 年雄心)。
- **Completion Criteria**(saturation 驱动):
  - 每个卡点的突破角度达饱和(连续 2 轮无新角度,saturation-detection per 卡点 per 路);
  - 三层卡点都被发散过(无某层卡点被整体跳过);
  - 四个取经域都被 cross-domain 实际触及(不是只取最顺手的一两个);
  - 越界假设(1d)至少被一条发散路接住、生成对应角度。
- **Backtrack Condition**: 若某突破角度依赖的机制/文献在相1 未覆盖 → 回相1 补侦察(须用户确认)。
- **Execution Steps**:
  - [ ] context-init(创建 `context/selection-operator-v2/<ts>-divergence.md`)
  - [ ] assumption-destruction(逐卡点炸承重假设);子代理并行
  - [ ] context-checkpoint
  - [ ] structural-deconstruction(重构 f 数学形态)
  - [ ] context-checkpoint
  - [ ] cross-domain-discovery(锁四域取经)
  - [ ] context-checkpoint
  - [ ] perspective-forcing(时间投射补角度)
  - [ ] context-checkpoint(每卡点→多角度全集,标注来源路与所属层)

---

## 相3 · 收敛(多角度→全景地图,流程做满)

> 产出定位=**地图**,但 feasibility / portfolio / steel-manning 全保留、照常做好。"地图"约束呈现形态(分好组、标好可行性、画出覆盖面),不砍流程。

- **Objective**: 把相2 的多角度全集收敛成一张全景地图——按突破方向归类、标注可行性、画出覆盖面;每条保留的角度带"它若成立需在 sandbox 验什么"的判据草案(非完整实验设计)。
- **Expected Input**: 相2 每卡点→多角度全集(带来源路与层标注);相1 底图与越界假设。
- **Focus Areas**:
  - 裁判换**求真四轴**:{消灭真缺口? 可验证(compute 优先)? 打过基线(CoSiNE/DASM 类)? 辨识诚实(不偷换 a 冒充 f、不越过单调+尺度上限谎称恢复绝对刻度)?};**硬删"新颖性/可发表度"轴**。
  - compute 为**首选非硬约束**:非 compute 验证路径不淘汰,只记成本(staged-gate 记录,不 kill)。
  - portfolio 用 diversity-maximization 保覆盖面,不收成单条;保留多突破方向的组合。
  - steel-manning 轻量:只对地图里**求真四轴得分最低的 ≤3 条已保留候选**做自检,**不展开完整对抗**(对抗推迟下一轮)。
- **Recommended Combination**: convergence →
  - feasibility-assessment(staged-gate-evaluation 判可验证性+落地代价,compute 优先记成本 + constraint-drilling 标注哪些步骤须 compute、哪些可放宽);
  - multi-criteria-scoring(★求真四轴打分,硬删新颖性轴);
  - portfolio-optimization(diversity-maximization 按突破方向归类、保覆盖面);
  - steel-manning(轻量自检,winner-stress-testing 仅限四轴得分最低的 ≤3 条已保留候选)。
- **Completion Criteria**(地图绘制完成):
  - 相2 全部角度都被四轴评过(无遗漏);
  - 地图按突破方向分组,每组覆盖面与所攻卡点层显式标注;
  - 每条保留角度带 sandbox 验证判据草案(验什么 / 用什么基线 / 单调恢复度与辨识上限吻合度如何量);
  - 被四轴判出局的角度留档(注明出局轴),不静默丢弃;
  - 全景地图能回答"当前 φ/f 理论有哪些卡点、各有哪些突破方向、哪些方向 compute 可验、覆盖面有无空洞"。
- **Backtrack Condition**: 若收敛发现卡点全集存在三层之外的重大遗漏层 → 回相1 重定位(须用户确认)。
- **Execution Steps**:
  - [ ] context-init(创建 `context/selection-operator-v2/<ts>-convergence.md`)
  - [ ] feasibility-assessment(粗判可行性,compute 优先记成本)
  - [ ] context-checkpoint
  - [ ] multi-criteria-scoring(求真四轴,删新颖性)
  - [ ] context-checkpoint
  - [ ] portfolio-optimization / diversity-maximization(归类、保覆盖面)
  - [ ] steel-manning 轻量自检(仅四轴得分最低 ≤3 条)
  - [ ] context-checkpoint(全景地图 + 出局角度留档)

---

## 相收尾 · 落盘交棒

- **Objective**: 三相结果固化,交下一轮(对抗 + sandbox 设计)。
- **Recommended Combination**: context-management → context-checkpoint。
- **Completion Criteria**: 全景地图 + 卡点全集 + 多角度全集 + 出局留档 全部落盘;INDEX 更新;下一轮入口(对抗推迟项、DIY-4 sandbox 设计待办)显式列出。
- **Execution Steps**:
  - [ ] context-checkpoint(三相汇总)
  - [ ] 更新 INDEX.md
  - [ ] 列出下一轮待办:stress-test 对抗、experiment-execution / DIY-4 sandbox 合成世界设计

---

## 推迟到下一轮(本轮不展开)

- **stress-test**:对收敛后的候选做完整对抗(multiagent-debate / red-teaming / counterfactual-probing)。
- **experiment-execution / ★DIY-4**:wet-lab 全部重构为 digital-evolution-sandbox 合成世界设计——扫 φ 形态(地板/天花板/竞争/随机)、扫 M、扫 N_e;基线 CoSiNE/DASM 类;指标=单调恢复度+辨识上限吻合度;constraint-analysis 只留 compute 相关(但 compute 为首选非硬约束)。
- sandbox 现有草图:`context/digital-evolution-sandbox/2026-06-11-16-10-design.md`(Knobs/Cell/World + step 三件事),下一轮在此之上正式设计。
