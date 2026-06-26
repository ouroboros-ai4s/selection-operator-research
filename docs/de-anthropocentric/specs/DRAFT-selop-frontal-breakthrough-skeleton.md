# Research Spec 草稿 — 选择算子正面突破(侦察→发散→收敛)

> Created: 2026-06-11 21:03 · DRAFT(骨架,不含方法细节)
> North Star: 2026-06-11-21-03-northstar-frontal-breakthrough.md
> 本轮三相,对抗(stress-test)推迟。每个节点标注:【搜】检索 /【理】处理整理 /【析】分析推理 /【判】裁决收敛。
> 标 ★DIY 的是相对论文流水线的改装点,需另行细化。

```
选择算子正面突破/
│
├── 相0 · 起手(context 已就绪,本相只做登记)
│   └── context-init ........................【理】North Star 已落盘,本 spec 即产物
│
├── 相1 · 侦察(穷举猎缺陷,非择优)──[KA + Deep-Insight]
│   │   ▸ 相内顺序:literature-survey 先铺全文献 → 机制卡点引擎在其产出上猎卡点(串行依赖)
│   │
│   ├── literature-survey/ ..................【搜】把 φ/f 文献铺全
│   │   ├── deep-survey .....................【搜】定向深挖 φ 形态 / 可辨识性 / CTMC 容器
│   │   ├── snowball/ .......................【搜】从种子论文滚雪球
│   │   │   ├── seed-selection .............【理】锁种子:CoSiNE / DASM / Matsen-Victora SBI / DeWitt
│   │   │   └── citation-chaining ..........【搜】前后向引文追链
│   │   ├── narrative-review ...............【析】理论驱动读法,带着三层问题读
│   │   ├── define-search-protocol ........【理】★工具现实:biorxiv MCP 主力 + brave/alphaxiv 并用
│   │   ├── paper-research / paper-search ..【搜】biorxiv 取全文;取不到退 AI 摘要
│   │   ├── web-research ...................【搜】brave 补盲区
│   │   └── gap-identification ............【析】标出文献"没说/说不清"的地方
│   │
│   ├── ★★机制卡点猎取引擎/ ..............【析】★★绕开 gap-analysis 文献学骨架,自建(见 §引擎设计)
│   │   │                                     不用 Miles/AHRQ/EGM/关键词空白抽取那套
│   │   ├── 卡点症状抽取(problem-reformulation:assumption-audit)
│   │   │   └── 找论文里承重的让步措辞 ......【析】"我们假设/无法测量/作为第一步/尚不清楚"
│   │   ├── 三层定位(problem-reformulation:dialectical-reformulation)
│   │   │   └── 把症状钉到 理论/辨识/容器 ..【析】每个卡点必须落到三层之一
│   │   ├── 根因下钻(insight:five-whys-drilling + current-reality-tree)
│   │   │   └── 症状→机制根因 ..............【析】TOC 充分因逻辑,挖到"去掉它问题前进一步"为止
│   │   ├── 挡路验真(boundary-analysis:failure-mode-analysis)
│   │   │   └── 验"是否真阻碍进展" .........【判】非"是否真空白";滤掉伪装成卡点的可发表点
│   │   └── ★DIY-1: 不排序 .................【判】★穷举全集直接进发散相,prioritization 整步跳过
│   │
│   ├── boundary-analysis/ ................【析】(引擎只猎卡点;此节点补"边界地图",不重复猎取)
│   │   └── validity-envelope-mapping ....【析】给现有方法/容器画有效边界:扩散极限在哪失效、
│   │                                        CTMC 在哪还成立——为发散相提供"可攻区 vs 死区"底图
│   │
│   └── problem-reformulation/ ............【析】(引擎用其 SOP 猎卡点;此节点单做一件事:重审问题对象)
│       └── dominant-idea-escape .........【析】跳出"f=φ∘a on CTMC"这个主导范式本身,
│                                            产出"如果换个对象会怎样"的越界假设,喂发散相
│   ─────────────────────────────────────────────────
│   相1 产出:缺陷全集(三层 × E→S→W,每个 symptom 带 evidence),不排序
│
├── 相2 · 发散(每缺口生多角度,不强行收一条)──[Creative-Ideation]
│   │   ▸ 相1→相2 路由(A1 定):卡点全集 × 三条发散路全展开(不按层预筛),
│   │     每缺口每路用 saturation-detection 判停(角度饱和即止,防组合爆炸),
│   │     去重/收束推到相3 portfolio,本相只管穷尽生成
│   │
│   ├── assumption-destruction/ ...........【析】把相1的承重假设逐个炸开
│   │   ├── sacred-cow-hunting ...........【析】猎"亲和力=适应度代理""仅单调可辨识"等不容置疑信念
│   │   └── axiom-negation ...............【析】悬置公理,开新解空间
│   │
│   ├── structural-deconstruction/ .......【析】重构选择算子的数学形态
│   │   ├── component-surgery ............【析】对 f=φ∘a 做 加/减/拆/并 手术
│   │   └── function-trimming ............【析】砍掉某零件看功能是否保留
│   │
│   ├── ★DIY-2: cross-domain-discovery/ ..【析】★取经域锁定,非泛泛跨域
│   │   ├── design-by-analogy ............【析】群体遗传学 / 统计物理 / 反问题 / 最优传输
│   │   └── analogical-transfer ..........【析】结构映射,把机制搬过来
│   │
│   └── perspective-forcing/ .............【析】换视角补角度
│       └── temporal-projection ..........【析】5yr/50yr/500yr 视角(呼应 200 年雄心)
│   ─────────────────────────────────────────────────
│   相2 产出:每个缺口 → 多条独立突破角度(理论候选 / 方法候选)
│
├── 相3 · 收敛(多角度→可执行候选)──[Convergence]
│   │
│   ├── feasibility-assessment/ ..........【判】每候选可验证性 + 落地代价
│   │   ├── staged-gate-evaluation .......【判】优先 sandbox/compute 可验;非 compute 路径不淘汰,记成本
│   │   └── constraint-drilling ..........【析】★compute 为首选而非硬约束:标注哪些步骤须 compute、哪些可放宽
│   │
│   ├── ★DIY-3: multi-criteria-scoring ...【判】★换裁判轴(承重改装)
│   │   └── 求真四轴:{消灭真缺口? 可验证(compute优先)? 打过基线? 辨识诚实?}
│   │       ★硬删/降级"新颖性·可发表度"轴
│   │
│   ├── portfolio-optimization/ ..........【判】保多角度,不收成单条
│   │   └── diversity-maximization .......【判】覆盖不同突破方向,留组合
│   │
│   └── steel-manning(轻量)..............【判】只做候选自检,完整对抗推迟下一轮
│   ─────────────────────────────────────────────────
│   相3 产出:收敛后的方法/理论候选组合 + 各自的 sandbox 验证判据
│
└── 相收尾
    └── context-checkpoint ...............【理】三相结果落盘,交下一轮(对抗 + sandbox 设计)

═══════════════════════════════════════════════════════
验证基底(贯穿,下一轮才正式设计):
  digital-evolution-sandbox —— φ/f 构造真值的合成世界
  指标:单调恢复度 + 辨识上限吻合度;基线:CoSiNE / DASM 类
  ★compute 为首选验证路径,非唯一合法路径——非 compute 验证记录成本,不直接否决
  ★DIY-4: experiment-execution 的 wet-lab 全部重构为合成世界设计(本轮不展开)
═══════════════════════════════════════════════════════
```

## §引擎设计:机制卡点猎取(替换 gap-analysis,最终态)

> 本节是最终设计,不是草稿。writing-specs 直接照此实现,不再"待精炼"。
> 原 gap-analysis campaign 整体**不调用**——它的每个 SOP(gap-keyword-extraction、
> Miles 7-type、AHRQ 4-reason、EGM/concept-matrix、cross-database-verification、
> false-gap-filtering)都在回答"领域里还有哪块没人发表",这是论文学问题。
> 本课题求真,改用下面四工序的自建引擎,零件全部取自 deep-insight 的
> problem-reformulation / insight / boundary-analysis(真实 SOP,非杜撰)。

### 为什么不能用原版(一句话锁死)
文献空白 ≠ 机制卡点。被反复发表的方向可能正是科学卡死处;无人问津的空白可能根本不挡路。
原版把"缺口"等价于"空白",本引擎把"缺口"重定义为"挡路的那一环"。两者必须脱钩。

### 缺口的最终定义(注入所有工序)
缺口 = 阻碍"序列→适应度算子被科学地刻画与恢复"向前推进的那一具体环节。
成立判据三条,缺一不可:
1. **挡路性**:去掉它,问题实质前进一步(不是"补上它,文献多一篇")。
2. **三层可归属**:必须落到 理论刻画层 / 可辨识性层 / CTMC 容器层 之一,落不进的不是本课题的卡点。
3. **可溯源 evidence**:E→S→W(Evidence→Symptom→Weakness),symptom 必须指回具体论文/数据。

### 四工序流水线(每序=真实 SOP + 注入指令)

**工序① 卡点症状抽取** — SOP: assumption-audit / assumption-surfacing
注入:不找"future work / 尚待研究"这类发表性空白。只找论文作者**承重的让步措辞**——
"we assume / we must assume a selection model"、"cannot be measured (in vitro)"、
"as a first step"、"the relationship … is unknown"、"for simplicity / we approximate"。
每条让步 = 一个候选症状,记下原文 + 出处(E)。

**工序② 三层定位** — SOP: dialectical-reformulation / abstraction-laddering
注入:把每个症状钉到三层之一并写明卡在该层的什么——
理论层(φ 统一形态缺失 / 群体相对性无法写进单序列 f / ∘ 单通道是否成立)、
辨识层(已知 M 下 f 是否真只到单调+尺度,还是仅现有方法的上限)、
容器层(离散 CTMC 是否就是正确数学对象)。落不进三层的症状标记"疑似越界",不丢,另存。

**工序③ 根因下钻** — SOP: five-whys-drilling + current-reality-tree
注入:对每个已定位症状连续追"为什么这挡路",用 TOC 充分因逻辑(current-reality-tree)
连成症状→机制根因链,挖到根因满足"挡路性"判据(去掉它问题前进一步)才停。
产出每个卡点的 S→W(Symptom→Weakness)段。

**工序④ 挡路验真** — SOP: failure-mode-analysis / failure-clustering
注入:验真标准是"该机制是否真阻碍进展",**不是**"是否跨库确认为空白"。
专门滤一类伪装:看着是卡点、实为可发表点(novelty 包装)——若一个"缺口"补上后
只增加发表性、不推进 φ/f 的刻画或恢复,判为伪卡点,移出全集(但留档可复查)。

### 穷举而非择优(与 DIY-1 联动,最终态)
四工序只产出**卡点全集**,不打分、不排序、不淘汰(除工序④的伪卡点过滤)。
排序是择优逻辑,与"彻底消灭问题"冲突。gap-prioritization 整步跳过,全集直接进发散相。

### 引擎产出物(交付格式锁定)
卡点全集,每条形如:
`[层:理论/辨识/容器] 卡点名 | E:原文+出处 | S:症状 | W:根因机制 | 验真:挡路性判据如何满足`
