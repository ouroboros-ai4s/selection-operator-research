# North Star + 对抗式简化 Loop 设计 (writing-specs 输入)

> 本文档 = Phase 1 crystallization 的 checkpoint。固化 North Star、ResearchBrief、
> 以及用户已拍板的「对抗式简化 loop」三项关键决策。下一步交给 writing-specs 编码成正式 Research Spec。

## North Star(一句话)

学习抗体亲和力成熟背后的 condition-dependent 选择算子 f(seq, cond)——一个突变算子已知、
选择算子未知的反问题——并用一套「对抗式简化 loop」把验证方案从工程堆砌收敛到
**最小且非循环**的可执行内核。

## 问题内核(先验定论,loop 不再吵)

- SDE 反问题:`dX = ∇f(X,c)·dt + σ_SHM·dW`,σ(SHM 突变算子)已知,f(选择算子)未知。
- f = condition-dependent 能量场;∇f = 推动群体的力场/velocity。
- 最接近范式 = SDE drift estimation (known diffusion) × interventional identification
  × mean-field population dynamics × neural parameterization of f。文献空白已确认。
- **问题定义本身已收敛,不动。loop 只攻击「验证方案」,不攻击「问题定义」。**

## 用户核心批判(loop 的靶心)

「手搓 f* 是循环论证——我们要学的就是那个不知道原理的算子,有本事搓出像样的 f* 就不用学它了。
『算法能反推出我自己编的 f*』什么都不证明。整个老方案是用工程量制造虚假信心。我要简洁明了。」

→ 这命中的根问题:既然永远拿不到真值算子,**凭什么说自己学对了?**
→ loop 的本质 = validation 硬化 loop:一边逼问「这验证是不是又在自证」,一边蜕掉不承重的工程。

## 三项已拍板决策

1. **不变量优先级:I1 非循环性 = 最高靠山。**
   任一轮只要「验证仍在自证」未解决,不准往下走。
2. **简化激进度:玩具级。**
   逼真仿真器(IGoR→EPAM→DIMSIM/SLiM + 手搓 f* 族)默认砍掉;要保留必须通过 resurrection 证明承重。
3. **终止条件:饱和即停。**
   连续 2 轮抢救不出新承重部件 AND 全不变量绿灯 AND 砍不动 → 自动 GO 定稿。

## Loop 攻击维度

### 不变量(每轮必查,绿灯才放行)

| # | 维度 | 倒下条件 | 主攻技能 |
|---|---|---|---|
| I1 | 验证非循环性(最高) | 找不到用「方法没见过且非手搓」的真值检验 f 的路径 | critic-defender-judge |
| I2 | 可辨识性前提 | gradient-flow SDE 唯一恢复定理前提在离散序列空间/本数据形态下不成立 | boundary-probing / necessity-sufficiency |
| I3 | 条件依赖真新颖性 | 打乱 cond 标签性能不掉 → f(seq,cond) 退化成 f(seq) | factor-removal |

### 增量攻击(只打上轮 ideation 动过的部件)

- 对被砍/被换部件做 resurrection-advocacy + necessity-sufficiency。
- 扛过 = 确认可砍;扛不过 = 复活。这是「安全简化」的机制:删了再派人抢救,抢救失败才算真冗余。

### 种子攻击队列(按依赖序,塌了全完的排前)

```
R1  非循环性 (I1)          ← 无解则后面全空中楼阁,先打
R2  仿真器必要性            ← CR9114 本身是直接测的 f(seq,cond),能否直接监督拟合、彻底不要仿真器?
R3  可辨识性 (I2)          ← 若必须有合成步,玩具SDE vs 逼真仿真器哪个够?
R4  条件依赖 (I3)
R5  OOD→公司数据迁移        ← 关乎部署不关乎方法成立,排最后
```

### 控制结构

```
   [stress-test] 取队列最高未决维度 + 查全部不变量
        │ surfaced tensions
        ▼
   [deep-insight] tension-mining 抽核心张力
        │
        ▼
   [creative-ideation] 生成消解张力的简化候选 (玩具级激进)
        │ scheme v(n+1)
        ▼
   [stress-test] resurrection-advocacy 抢救被砍部件 ──┐ (循环回 stress-test)
        │                                            │
        ▼ saturation-detection 满足 →                │
   [convergence] staged-gate GO → 定稿
```

## 核心张力(loop 反复消解)

科学野心(完整后验 / foundation model / 200yr) ⟂ 非循环可验证性 ⟂ 最小工程量。
用户「自娱自乐」批判 = 此张力当前失衡的症状。简化与硬化是同一动作的两面。

## 候选精简脊柱(待 loop 检验,非定稿)

```
Spike 0  CR9114 直接监督拟合 f(seq,cond)   零仿真器,几天,验证函数类能否表示真实条件依赖地形
Spike 1  玩具 SDE 反推(若 R2/R3 证明必需)  已知f+已知σ→轨迹→能否反推f,真正的可辨识性测试
验证      Hanke/phage-seq 真实多条件 + CR9114 当裁判,打乱条件标签对照
```

## 下一步

进 writing-specs:把上述 loop 编码为可执行 campaign 序列(stress-test / deep-insight /
creative-ideation / convergence 四 phase 的 backtrack 环),产出 Research Spec 存
docs/de-anthropocentric/specs/。然后用户在新 session 用 executing-specs 跑。
