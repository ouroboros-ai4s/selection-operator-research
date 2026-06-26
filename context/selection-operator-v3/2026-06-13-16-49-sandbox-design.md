# Design — 选择算子验证沙盒 (Round 3 工程实现)

> Created: 2026-06-13 16:49
> 性质: 工程实现 (造引擎 + 训恢复模型 + 跑对抗实验), 非纯 research
> 流程: superpowers:brainstorming 边聊边维护 → 最终成完整 design → writing-plans 排实现
> 起点: 对抗轮降级后的诚实骨架 (1 EARNED 动力学原理 + 2 正交支柱 σ/辨识 + 1 残余 R_irr + 1 适用包络)
> 关联: context/selection-operator-v3/2026-06-13-16-27-northstar-round3.md (方向结晶 + 真实数据基底约束)

## 状态图例
🔴 未讨论 / 🟡 brainstorming 中 / 🟢 已锁定

---

## 0. 一句话目标

把对抗轮留下的"待验骨架"放上测试台:造一个个体级模拟引擎(真实数据基底 + 合成机制化算子),训练恢复模型从幸存者序列时序反推 φ/σ/a_invivo,用一组对抗性实验把每条主张从 TESTABLE-NOT-YET 翻成 CORROBORATED 或 BROKEN,并划出适用包络。终点 (D 段, 留到验完再定) = 投影成一个 wet-lab 可行的最小介入。

---

## 1. 要造的三样东西 (待 brainstorm 细化)  🔴

1. **个体级模拟引擎** — agent-based;喂真实 a_DMS 地形 + 真实 SHM 谱;挂合成 φ/σ/a_invivo 机制规则;跑出涌现真值并记录。
2. **恢复模型** — 吃幸存者序列时序,吐 φ/σ/a_invivo 恢复;架构限 Diffusion/Transformer/Mamba。
3. **基线** — CoSiNE/DASM 类,比原理性超越。

## 2. 真实数据基底 (角色已分, 数据集待确认)  🔴

- a_DMS 亲和地形 = CR9114 (2¹⁶) / CR6261, 本地已有 parquet。
- 突变算子 M = S5F/SHM 已发表模型。
- 种群尺度 N/μ/轮次 = 校准真实 repertoire (待查可得性)。
- 保真度校准: 模拟统计量须对真实数据, 对不上不许用。

## 3. 两个验证 regime  🔴

- Regime 1 合成真值: 5 对抗真值世界 + P1/P2 + θ/ε + B5。
- Regime 2 真实数据: P1 真实时序 / 判别第四路 / 包络检查。

## 4. 待解决的开放问题 (brainstorm 队列)

- [ ] 真实时序/repertoire 数据到底拿得到什么?(决定 Regime 2 形态)
- [ ] 5 个对抗真值世界各自怎么造?
- [ ] 恢复模型具体架构与训练目标?
- [ ] 基线怎么实现/对比口径?
- [ ] 保真度校准对哪些统计量、判据是什么?
- [ ] θ/ε 阈值怎么定?
- [ ] do() 介入在个体级引擎里怎么实现?
- [ ] 工程规模/算力预算/分阶段?

---

## 决议记录 (brainstorm 产出, 逐条追加)

(空)
