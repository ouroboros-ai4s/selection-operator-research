# North Star — 选择算子问题的正面突破(AI 辅助科学发现模式)

> Created: 2026-06-11 21:03
> Topic: 从"采数据训模型预测 f"转向"AI 作为研究者正面构造理论 + compute-only 可验证方法",目标彻底消灭选择算子问题
> Phase: North Star Crystallization (hot-start, 模式转变 re-crystallization)

## Plan Context

本 Phase 的任务不是重新定义问题对象——f=φ∘a 这个对象在 v2 背景文件(2026-06-11-20-35-problem-restatement-selop.md)里已经稳定且经过确认。本 Phase 改变的是攻击模式(mode of attack)。旧模式是"获取数据→训练模型→预测 f",这条路已被证明在开源静态数据上结构性死亡:DMS 这类快照物理上只含 a(亲和力地形)而不含 φ(亲和力→适应度的连接层),在其上回归学到的几乎就是 a,碰不到真正未知的 φ。新模式是把 AI 当作研究者本身,让它通过深度文献侦察与第一性原理,正面构造关于 φ 与可辨识性的理论,并发明只靠算力就能验证的 AI/ML 方法。验证基底锁定为 digital-evolution-sandbox——一个 φ/f 由构造给定为真值的合成进化世界;这是 laptop 上唯一能严格回答"某方法把 φ 恢复到什么程度、是否吻合可辨识性理论所允许的上限"的基底,因为真实世界拿不到 φ 的 ground truth,而合成世界可以随手造出来。本 Phase 只走侦察→发散→收敛三步,对抗(stress-test)推迟到下一轮。本 Phase 产出 North Star + ResearchBrief 作为 hard gate,确认后进入 Phase 2 由 writing-specs 生成正式 Research Spec;但在 writing-specs 之前,必须先对 skill 体系做一次 DIY 改装(这套引擎原本是论文流水线,内部到处用"新颖性/可发表度"当裁判,而我们的判据是求真),改装方案另行详细规划。

## North Star(一句话)

在一个 φ/f 为已知真值的合成进化沙盒里,通过 AI 辅助的深度文献侦察与理论构造,系统性地猎取当前"选择算子"理论的全部缺陷,生成多条正面突破路径并收敛,目标是把"序列→适应度的选择算子如何被科学地刻画与恢复"这一问题从理论上彻底解决,而非再做一次数据拟合。

## ResearchBrief

### ① 锚定对象(不动的地基,继承自 v2 背景文件)

f = φ∘a。a(序列→亲和力,−logK_D)已知、可测、可回归,不是科学空白。φ(亲和力→适应度)是真正未知、真正有科学价值的那一层,长着地板(阈值)、天花板(饱和)、竞争相对(群体级)、随机四个非线性特征,体内 assay 测不出。∘ 编码单通道因果假设"适应度⊥序列|表型"。M(突变算子,SHM/S5F/EPAM)已知;已知 M 把 f 从完全不可辨识压缩到"可辨识但仅到单调变换+全局尺度 N_e+加性常数"。物理上诚实的数学容器是离散态连续时间随机过程(CTMC),单谱系尺度 Q(s→s')=μ(s→s')·P_fix(Δf);连续 embedding-SDE 不是该过程的严格极限,不采用。

### ② 模式转变(本 Phase 唯一新增)

旧:采数据→训模型→预测 f。已证结构性死亡——开源静态数据物理上不含 φ。
新:AI 作为研究者,正面构造理论 + 发明 compute-only 可验证的方法。验证基底 = digital-evolution-sandbox(f/φ 为构造真值的世界)。这是 laptop 上唯一能严格检验"方法把 φ 恢复到何种程度、是否触及可辨识性理论上限"的基底。

### ③ 任务结构(用户确认的攻法:不预押注,穷举猎缺陷)

本轮只做三步,对抗推迟:
- **侦察相(comprehensive,非择优)**:穷举式猎取当前 φ/f 理解里的全部薄弱点,不只挑最可攻的。覆盖三层——理论层(φ 的统一刻画是否缺失、群体相对性能否被算子形式表达、∘ 单通道假设是否成立)、辨识层(已知 M 下 f 的可辨识边界是否真到极限,还是只是现有方法的上限)、容器层(CTMC 抽象本身是否就是正确对象)。采用 E→S→W 节点记法,symptom 必带 evidence。
- **发散相**:每个缺口生成多条独立突破角度,不强行收成一条。
- **收敛相**:多角度收敛到可执行的方法/理论候选。
终极判据:候选能否在 sandbox 中击败基线(CoSiNE/DASM 类)并触及理论允许的辨识上限。
用户原话定性:目标是"通过 AI 协助的科学发现彻底解决这个问题",不是择优修补。

### ④ 硬约束(来自 memory,不可违背)

全原创——禁止"现成工具套新域",要发明问题本身所要求的新方法。架构限 Transformer/Mamba/Diffusion;图仅作 attention bias(AF3 风格),无独立 GNN/CNN/RNN。AI4S 求真,非发表导向。200 年尺度雄心为真,当前 compute-only 是临时约束,绝不主动缩小问题。

### ⑤ 工具现实

biorxiv MCP 是主力检索工具之一,要大量使用(取不到原文时才退);与 brave-search(web-search/web-research)、literature-engine、alphaxiv 并用,各补盲区。广度侦察用并行子代理铺开。

### ⑥ 关键张力(已知的、侦察要正面撞的三条裂缝)

- φ 的"竞争相对"是群体级特征,而 f(s) 写成单序列函数——算子形式能否容纳群体依赖?可能是最深的裂缝。
- "f 只可辨识到单调变换+尺度"是否真是理论上限,还是只是 CoSiNE/DASM 这类现有方法的上限?二者天差地别,直接决定突破有没有空间。
- ∘ 的单通道假设(适应度⊥序列|表型)在多维表型(亲和力/稳定性/表达/polyreactivity)下是否仍成立。

### ⑦ 流水线 DIY(writing-specs 之前必须先敲定,本文件仅记录待决,不锁死)

引擎原为论文流水线,需改装四个承重点:
- DIY-1:侦察相是否完全跳过 gap-prioritization(穷举不排序)——倾向跳过,待用户拍。
- DIY-2:cross-domain 取经域锁定群体遗传学/统计物理/反问题与最优传输,非泛泛跨域。
- DIY-3(最重要):收敛裁判换轴——{消灭真缺口?sandbox 可验?打过基线?辨识诚实?},硬删或降级"新颖性/可发表度"轴。待用户拍。
- DIY-4(改装最大):experiment-execution 的 wet-lab 全部重构为 sandbox 合成世界设计(扫 φ 形态/M/N_e;基线 CoSiNE/DASM;指标=单调恢复度+辨识上限吻合度);constraint-analysis 只留 compute-only。

### 关键参考(verified,继承自 v1/v2 深挖)

- CR9114:Phillips 2021 eLife,65536×3 组合完备 −logK_D DMS(=a 的完备地形,非 f)。
- Matsen/Victora SBI:arXiv:2508.09871(原话 affinity↔fitness 关系未知、fitness 体外不可测)。
- CoSiNE:ICML 2026 arXiv:2602.18982;DASM:eLife 2026(Matsen/Song,选离散 CTMC 容器,recover f(s) 但把条件平均掉)。
- DeWitt 2025 GC-replay(证推断 fitness 地形≠原始 affinity 地形)。
- 容器理论:Eigen 1971 quasispecies / Crow-Kimura;Halpern-Bruno 速率;Ethier-Nagylaki 1989、Chalub-Souza 2011(扩散极限严格性边界)。

### 关键术语

选择算子 f / 连接函数 φ / 亲和力地形 a / 复合 ∘ / 突变算子 M / 可辨识性(单调+尺度)/ 反问题 / 离散 CTMC 容器 / digital-evolution-sandbox(合成真值世界)/ E→S→W 记法。
