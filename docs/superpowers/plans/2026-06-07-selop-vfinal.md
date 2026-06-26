# 抗体选择算子 v_final 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 CR9114 上学习条件依赖选择算子 f̂(seq,cond),并用三道非循环验证关 + 玩具SDE可辨识性证明其成立。

**Architecture:** Python/PyTorch 包 `selop/`,6 模块。冻结 ESM-2 编码抗体与抗原序列 → 可训练 head 输出标量 f̂ → Tobit censored 回归拟合 → verify/ 三关 + toysde/ 消费 f̂。f̂ 是唯一可微打分函数,所有下游消费它。

**Tech Stack:** Python 3.10+, PyTorch, fair-esm (ESM-2), numpy/scipy/scikit-learn, pytest。

> 上游 spec: `docs/superpowers/specs/2026-06-07-selop-implementation-design.md`
> 架构约束: Transformer/Mamba head,graph 作 attention bias,无独立 GNN/CNN/RNN。

---

## 文件结构

```
selop/
├── __init__.py
├── data/
│   ├── __init__.py
│   ├── loader.py        # CR9114 CSV 加载 → 四元组
│   ├── variant.py       # Variant: 16位二值 ↔ 重链序列重建
│   ├── censoring.py     # floor 标记(6/7 按抗原)
│   └── splits.py        # P16 留出划分 + 零泄漏断言
├── repr/
│   ├── __init__.py
│   └── esm_encoder.py   # 冻结 ESM-2,encode_antibody/antigen,磁盘缓存
├── model/
│   ├── __init__.py
│   └── fhat.py          # f̂ = head(emb_ab, emb_ag) → 标量,可微
├── train/
│   ├── __init__.py
│   ├── tobit_loss.py    # Tobit censored loss
│   └── trainer.py       # S1 训练循环
├── verify/
│   ├── __init__.py
│   ├── result.py        # VerdictResult 数据类
│   ├── identifiability.py  # S2b gating② λmin
│   ├── cv_consistency.py   # S3-Ⅰ
│   ├── cv_shuffle.py       # S3-Ⅱ 200置换
│   ├── cv_crosscond.py     # S3-Ⅲ + N3 baseline
│   └── n3_baseline.py      # 序列相似度 + pairwise epistasis
├── toysde/
│   ├── __init__.py
│   ├── sde.py           # gradient-flow SDE 前向(Euler-Maruyama)
│   ├── recover.py       # 反推 f̂_toy
│   └── gating.py        # gating① 余弦一致性
└── report/
    ├── __init__.py
    └── cs_statement.py  # S4 CS声明 + 判定汇总
tests/                   # 镜像 selop/ 结构
```

---

### Task 0: 工程初始化

**Files:**
- Create: `pyproject.toml`, `selop/__init__.py`, `tests/__init__.py`, `.gitignore`

- [ ] **Step 1: 初始化 git 与包结构**

```bash
cd g:/OUROBOROS-AI4S
git init
mkdir -p selop/data selop/repr selop/model selop/train selop/verify selop/toysde selop/report tests
```

- [ ] **Step 2: 写 pyproject.toml**

```toml
[project]
name = "selop"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = ["torch", "fair-esm", "numpy", "scipy", "scikit-learn", "pandas"]

[project.optional-dependencies]
dev = ["pytest"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

- [ ] **Step 3: 写 .gitignore 与空 __init__.py**

```
# .gitignore
__pycache__/
*.pyc
.pytest_cache/
data/cache/
*.pt
```

```bash
touch selop/__init__.py tests/__init__.py
for d in data repr model train verify toysde report; do touch selop/$d/__init__.py; done
```

- [ ] **Step 4: 验证可导入 + 提交**

Run: `python -c "import selop"`
Expected: 无报错

```bash
git add -A
git commit -m "chore: scaffold selop package"
```

---

### Task 1: Variant — 16 位二值 ↔ 重链序列重建

**Files:**
- Create: `selop/data/variant.py`
- Test: `tests/data/test_variant.py`

CR9114 变体 = germline 重链序列 + 16 个 somatic 突变位点的某个二值组合(0=germline 态,1=突变态)。Variant 把 16 位二值向量重建为完整氨基酸序列。16 位点的 (位置, germline aa, somatic aa) 来自 Phillips 2021 图1A(执行时从论文/source data 填入常量表;此处用占位常量表结构,真实值在 Step 3 注释标明来源)。

- [ ] **Step 1: 写失败测试**

```python
# tests/data/test_variant.py
from selop.data.variant import Variant, GERMLINE_SEQ, MUTATION_SITES

def test_all_zero_is_germline():
    v = Variant(bits=[0]*16)
    assert v.to_sequence() == GERMLINE_SEQ

def test_single_mutation_changes_one_position():
    v = Variant(bits=[1] + [0]*15)
    seq = v.to_sequence()
    pos, gl_aa, som_aa = MUTATION_SITES[0]
    assert seq[pos] == som_aa
    assert GERMLINE_SEQ[pos] == gl_aa
    # 其余位点不变
    assert seq[:pos] == GERMLINE_SEQ[:pos]

def test_bits_length_must_be_16():
    import pytest
    with pytest.raises(ValueError):
        Variant(bits=[0]*15)

def test_roundtrip_bits_preserved():
    bits = [1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1]
    assert Variant(bits=bits).bits == bits
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/data/test_variant.py -v`
Expected: FAIL — `ModuleNotFoundError: selop.data.variant`

- [ ] **Step 3: 写最小实现**

```python
# selop/data/variant.py
from dataclasses import dataclass

# CR9114 germline 重链序列(占位:执行时从 Phillips 2021 / Dreyfus 2012 填真实序列)
GERMLINE_SEQ = "Q" * 120  # TODO执行时替换为真实CR9114 germline VH序列

# 16 个 somatic 突变位点: (序列索引0-based, germline氨基酸, somatic氨基酸)
# 来源: Phillips 2021 eLife 71393 图1A,IMGT编号转0-based索引
MUTATION_SITES = [(i, "Q", "A") for i in range(16)]  # TODO执行时替换为真实16位点

@dataclass
class Variant:
    bits: list[int]

    def __post_init__(self):
        if len(self.bits) != 16:
            raise ValueError(f"bits 必须长度16,得到{len(self.bits)}")

    def to_sequence(self) -> str:
        seq = list(GERMLINE_SEQ)
        for bit, (pos, gl, som) in zip(self.bits, MUTATION_SITES):
            if bit == 1:
                seq[pos] = som
        return "".join(seq)
```

注:`GERMLINE_SEQ` 与 `MUTATION_SITES` 是占位常量,执行时按注释从 Phillips 2021 source data 替换为真实值。测试用占位常量自洽,不依赖真实值。

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/data/test_variant.py -v`
Expected: PASS(4 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/data/variant.py tests/data/test_variant.py
git commit -m "feat: Variant 16-bit to sequence reconstruction"
```

---

### Task 2: censoring — 检测限 floor 标记

**Files:**
- Create: `selop/data/censoring.py`
- Test: `tests/data/test_censoring.py`

检测限 floor 按抗原不同。**实测值(已从 source data `fig1-data1-v3.csv` 的 mean 列最小值确认)**:H1 floor=7.0、H3 floor=6.0、fluB(B) floor=6.0 —— 与早期占位猜测相反(H1 反而更高)。低于 floor 的 −logKD 标记为 censored(无可测结合)。

- [ ] **Step 1: 写失败测试**

```python
# tests/data/test_censoring.py
from selop.data.censoring import mark_censored, FLOORS

def test_floors_per_antigen_defined():
    assert set(FLOORS.keys()) == {"H1", "H3", "B"}

def test_below_floor_is_censored():
    assert mark_censored(value=5.0, antigen="H1") is True   # floor=7

def test_above_floor_not_censored():
    assert mark_censored(value=9.0, antigen="H1") is False

def test_at_floor_is_censored():
    assert mark_censored(value=FLOORS["H1"], antigen="H1") is True

def test_unknown_antigen_raises():
    import pytest
    with pytest.raises(KeyError):
        mark_censored(value=8.0, antigen="H5")
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/data/test_censoring.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/data/censoring.py
# floor 值: 已从 source data fig1-data1-v3.csv 的 {h1,h3,fluB}_mean 最小值核实。
# H1=7.0, H3=6.0, B(fluB)=6.0(注意 H1 反而最高,与早期占位猜测相反)。
FLOORS = {"H1": 7.0, "H3": 6.0, "B": 6.0}

def mark_censored(value: float, antigen: str) -> bool:
    floor = FLOORS[antigen]
    return value <= floor
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/data/test_censoring.py -v`
Expected: PASS(5 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/data/censoring.py tests/data/test_censoring.py
git commit -m "feat: per-antigen detection floor censoring"
```

---

### Task 3: splits — P16 留出划分 + 零泄漏断言

**Files:**
- Create: `selop/data/splits.py`
- Test: `tests/data/test_splits.py`

P16 零泄漏:按抗原留出 B(B 完全不进训练,供 S3-Ⅲ cross-condition)+ 按突变组合随机留出 20%(供同抗原 held-out)。构造后强制断言 train/heldout 无交集。

- [ ] **Step 1: 写失败测试**

```python
# tests/data/test_splits.py
from selop.data.splits import make_splits

def _toy_records():
    # (variant_id, antigen) 组合;3 变体 × 3 抗原
    return [(vid, ag) for vid in range(100) for ag in ("H1","H3","B")]

def test_heldout_antigen_B_not_in_train():
    s = make_splits(_toy_records(), heldout_antigen="B", geno_frac=0.2, seed=0)
    train_antigens = {ag for (_, ag) in s.train}
    assert "B" not in train_antigens

def test_geno_holdout_fraction():
    s = make_splits(_toy_records(), heldout_antigen="B", geno_frac=0.2, seed=0)
    heldout_genos = {vid for (vid, _) in s.heldout_genotype}
    assert abs(len(heldout_genos)/100 - 0.2) < 0.05

def test_no_overlap_train_vs_heldout():
    s = make_splits(_toy_records(), heldout_antigen="B", geno_frac=0.2, seed=0)
    assert s.train.isdisjoint(s.heldout_antigen)
    assert s.train.isdisjoint(s.heldout_genotype)

def test_deterministic_with_seed():
    a = make_splits(_toy_records(), "B", 0.2, seed=42)
    b = make_splits(_toy_records(), "B", 0.2, seed=42)
    assert a.train == b.train
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/data/test_splits.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/data/splits.py
import random
from dataclasses import dataclass

@dataclass
class Splits:
    train: set
    heldout_antigen: set
    heldout_genotype: set

def make_splits(records, heldout_antigen: str, geno_frac: float, seed: int) -> Splits:
    rng = random.Random(seed)
    geno_ids = sorted({vid for (vid, _) in records})
    n_hold = int(round(len(geno_ids) * geno_frac))
    held_genos = set(rng.sample(geno_ids, n_hold))

    heldout_antigen_set, heldout_geno_set, train = set(), set(), set()
    for (vid, ag) in records:
        if ag == heldout_antigen:
            heldout_antigen_set.add((vid, ag))
        elif vid in held_genos:
            heldout_geno_set.add((vid, ag))
        else:
            train.add((vid, ag))

    s = Splits(train, heldout_antigen_set, heldout_geno_set)
    # 零泄漏断言(P16)
    assert s.train.isdisjoint(s.heldout_antigen)
    assert s.train.isdisjoint(s.heldout_genotype)
    return s
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/data/test_splits.py -v`
Expected: PASS(4 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/data/splits.py tests/data/test_splits.py
git commit -m "feat: P16 zero-leakage splits"
```

---

### Task 4: Tobit censored loss

**Files:**
- Create: `selop/train/tobit_loss.py`
- Test: `tests/train/test_tobit_loss.py`

L = Σ_未截断 (f̂−y)²/σ² + Σ_截断 max(0, f̂−floor)²/σ²。σ=0.047。截断项只罚"预测高于 floor"。

- [ ] **Step 1: 写失败测试**

```python
# tests/train/test_tobit_loss.py
import torch
from selop.train.tobit_loss import tobit_loss

def test_uncensored_is_mse_scaled():
    pred = torch.tensor([8.0]); y = torch.tensor([8.5])
    cen = torch.tensor([False]); floor = torch.tensor([7.0])
    loss = tobit_loss(pred, y, cen, floor, sigma=1.0)
    assert torch.isclose(loss, torch.tensor(0.25), atol=1e-5)

def test_censored_pred_below_floor_no_penalty():
    # 截断样本,预测低于floor → 不罚(模型正确认为弱结合)
    pred = torch.tensor([5.0]); y = torch.tensor([7.0])
    cen = torch.tensor([True]); floor = torch.tensor([7.0])
    loss = tobit_loss(pred, y, cen, floor, sigma=1.0)
    assert torch.isclose(loss, torch.tensor(0.0), atol=1e-5)

def test_censored_pred_above_floor_penalized():
    # 截断样本,预测高于floor → 罚 (pred-floor)²
    pred = torch.tensor([9.0]); y = torch.tensor([7.0])
    cen = torch.tensor([True]); floor = torch.tensor([7.0])
    loss = tobit_loss(pred, y, cen, floor, sigma=1.0)
    assert torch.isclose(loss, torch.tensor(4.0), atol=1e-5)

def test_sigma_scaling():
    pred = torch.tensor([8.0]); y = torch.tensor([8.5])
    cen = torch.tensor([False]); floor = torch.tensor([7.0])
    loss = tobit_loss(pred, y, cen, floor, sigma=0.5)
    assert torch.isclose(loss, torch.tensor(1.0), atol=1e-5)  # 0.25/0.25
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/train/test_tobit_loss.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/train/tobit_loss.py
import torch

def tobit_loss(pred, y, censored, floor, sigma=0.047):
    """Tobit censored 回归 loss(均值)。
    未截断: (pred-y)²/σ²;截断: max(0, pred-floor)²/σ²。"""
    uncens = ~censored
    se = torch.zeros_like(pred)
    se[uncens] = (pred[uncens] - y[uncens]) ** 2
    over = torch.clamp(pred[censored] - floor[censored], min=0.0)
    se_cen = over ** 2
    total = se.sum() + se_cen.sum()
    n = pred.shape[0]
    return total / (sigma ** 2) / n
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/train/test_tobit_loss.py -v`
Expected: PASS(4 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/train/tobit_loss.py tests/train/test_tobit_loss.py
git commit -m "feat: Tobit censored loss"
```

---

### Task 5: VerdictResult — 标准化判定结构

**Files:**
- Create: `selop/verify/result.py`
- Test: `tests/verify/test_result.py`

- [ ] **Step 1: 写失败测试**

```python
# tests/verify/test_result.py
from selop.verify.result import VerdictResult

def test_pass_when_metric_beats_threshold():
    r = VerdictResult(invariant="I3", metric=0.04, threshold=0.05,
                      direction="below", triggered_FM=None)
    assert r.passed is True   # p=0.04 < 0.05

def test_fail_sets_no_auto_fm():
    r = VerdictResult(invariant="I1", metric=0.3, threshold=0.5,
                      direction="above", triggered_FM="FM4")
    assert r.passed is False
    assert r.triggered_FM == "FM4"

def test_direction_above():
    r = VerdictResult(invariant="I3", metric=0.8, threshold=0.7,
                      direction="above", triggered_FM=None)
    assert r.passed is True
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/verify/test_result.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/verify/result.py
from dataclasses import dataclass

@dataclass
class VerdictResult:
    invariant: str          # "I1"/"I2"/"I3"
    metric: float
    threshold: float
    direction: str          # "above"=metric须>threshold; "below"=须<
    triggered_FM: str | None

    @property
    def passed(self) -> bool:
        if self.direction == "above":
            return self.metric > self.threshold
        return self.metric < self.threshold
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/verify/test_result.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/verify/result.py tests/verify/test_result.py
git commit -m "feat: VerdictResult"
```

---

### Task 6: cv_shuffle — S3-Ⅱ 打乱对照置换检验(I3 核心)

**Files:**
- Create: `selop/verify/cv_shuffle.py`
- Test: `tests/verify/test_cv_shuffle.py`

把 (变体,抗原,y) 的抗原列随机置换 N=200 次построить null 分布,真实模型的留出性能须落 p<0.05 尾部。本任务实现**置换检验统计逻辑**(传入一个 `fit_and_score(records)→float` 回调,与具体模型解耦,便于单测)。

- [ ] **Step 1: 写失败测试**

```python
# tests/verify/test_cv_shuffle.py
import random
from selop.verify.cv_shuffle import shuffle_permutation_test

def test_condition_dependent_signal_gives_low_p():
    # 构造真有条件依赖的假打分器: 分数=f(变体)+大权重*抗原
    rng = random.Random(0)
    records = [(vid, ag, None) for vid in range(60) for ag in ("H1","H3","B")]
    ag_effect = {"H1": 0.0, "H3": 5.0, "B": 10.0}
    def fit_and_score(recs):
        # 真模型: 用上抗原 → 打乱后score与y相关性崩
        import numpy as np
        preds = np.array([vid*0.01 + ag_effect[ag] for (vid, ag, _) in recs])
        truth = np.array([vid*0.01 + ag_effect[ag] for (vid, ag, _) in recs])
        # spearman 近似: 用 -mse 当性能(越大越好)
        return -float(((preds-truth)**2).mean())
    res = shuffle_permutation_test(records, fit_and_score, n_perm=200, seed=1)
    assert res.metric < 0.05      # p 值
    assert res.invariant == "I3"
    assert res.passed is True

def test_no_condition_dependence_gives_high_p():
    # 假模型完全不看抗原 → 打乱无影响 → p 大
    records = [(vid, ag, None) for vid in range(60) for ag in ("H1","H3","B")]
    def fit_and_score(recs):
        import numpy as np
        preds = np.array([vid*0.01 for (vid, ag, _) in recs])  # 忽略抗原
        truth = np.array([vid*0.01 for (vid, ag, _) in recs])
        return -float(((preds-truth)**2).mean())
    res = shuffle_permutation_test(records, fit_and_score, n_perm=200, seed=1)
    assert res.metric > 0.05
    assert res.passed is False
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/verify/test_cv_shuffle.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/verify/cv_shuffle.py
import random
from selop.verify.result import VerdictResult

def shuffle_permutation_test(records, fit_and_score, n_perm=200, seed=0,
                             alpha=0.05):
    """records: list[(vid, antigen, y)]。fit_and_score(records)->float 性能(越大越好)。
    打乱 antigen 列 n_perm 次построить null;p = (#null≥real + 1)/(n_perm + 1)。"""
    rng = random.Random(seed)
    real = fit_and_score(records)
    antigens = [ag for (_, ag, _) in records]
    ge = 0
    for _ in range(n_perm):
        shuffled_ag = antigens[:]
        rng.shuffle(shuffled_ag)
        perm = [(vid, ag, y) for (vid, _, y), ag in zip(records, shuffled_ag)]
        if fit_and_score(perm) >= real:
            ge += 1
    p = (ge + 1) / (n_perm + 1)
    return VerdictResult(invariant="I3", metric=p, threshold=alpha,
                         direction="below", triggered_FM=None)
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/verify/test_cv_shuffle.py -v`
Expected: PASS(2 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/verify/cv_shuffle.py tests/verify/test_cv_shuffle.py
git commit -m "feat: S3-II shuffle permutation test (I3)"
```

---

### Task 7: n3_baseline + cv_crosscond — S3-Ⅲ cross-condition + N3(I1 核心)

**Files:**
- Create: `selop/verify/n3_baseline.py`, `selop/verify/cv_crosscond.py`
- Test: `tests/verify/test_cv_crosscond.py`

S3-Ⅲ:f̂ 预测留出抗原 B 的 Kd 排序,须 (1) Spearman 显著>0,(2) bootstrap CI 高于 N3 baseline。先实现 N3(序列相似度 + pairwise epistasis 的预测向量传入)+ bootstrap CI 比较逻辑(与具体模型解耦:传入 f̂ 预测、N3 预测、真值)。

- [ ] **Step 1: 写失败测试**

```python
# tests/verify/test_cv_crosscond.py
import numpy as np
from selop.verify.cv_crosscond import crosscond_verdict, s3iii_passed

def test_fhat_beats_n3_passes():
    rng = np.random.default_rng(0)
    truth = rng.normal(size=200)
    fhat = truth + rng.normal(scale=0.3, size=200)   # 强相关
    n3   = truth + rng.normal(scale=1.5, size=200)   # 弱相关
    res = crosscond_verdict(fhat, n3, truth, n_boot=500, seed=0)
    assert res.invariant == "I1"
    assert s3iii_passed(res) is True           # 显著>0 且 beats N3

def test_fhat_not_better_than_n3_triggers_fm4():
    rng = np.random.default_rng(1)
    truth = rng.normal(size=200)
    fhat = truth + rng.normal(scale=1.5, size=200)
    n3   = truth + rng.normal(scale=0.3, size=200)   # n3 更强
    res = crosscond_verdict(fhat, n3, truth, n_boot=500, seed=0)
    assert s3iii_passed(res) is False
    assert res.triggered_FM == "FM4"

def test_fhat_no_signal_fails():
    rng = np.random.default_rng(2)
    truth = rng.normal(size=200)
    fhat = rng.normal(size=200)   # 无信号
    n3   = rng.normal(size=200)
    res = crosscond_verdict(fhat, n3, truth, n_boot=500, seed=0)
    assert s3iii_passed(res) is False
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/verify/test_cv_crosscond.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/verify/n3_baseline.py
import numpy as np

def seq_similarity_baseline(train_X, train_y, test_X):
    """最近邻(汉明相似)baseline: 用最相似训练变体的 y 作预测。"""
    preds = []
    for x in test_X:
        sims = (train_X == x).sum(axis=1)
        preds.append(train_y[sims.argmax()])
    return np.array(preds)

def pairwise_epistasis_baseline(coeffs, test_X):
    """Phillips pairwise epistasis 模型: 载入系数线性预测。
    coeffs: dict 含 'intercept','main'(16,),'pair'(16,16)。"""
    out = []
    for x in test_X:
        v = coeffs["intercept"] + coeffs["main"] @ x
        v += x @ coeffs["pair"] @ x
        out.append(v)
    return np.array(out)
```

```python
# selop/verify/cv_crosscond.py
import numpy as np
from scipy.stats import spearmanr
from selop.verify.result import VerdictResult

def _boot_spearman(pred, truth, n_boot, rng):
    n = len(truth); out = np.empty(n_boot)
    for b in range(n_boot):
        idx = rng.integers(0, n, n)
        out[b] = spearmanr(pred[idx], truth[idx]).correlation
    return out

def crosscond_verdict(fhat_pred, n3_pred, truth, n_boot=500, seed=0, alpha=0.05):
    """I1: fhat 在留出抗原上 Spearman 显著>0 且 bootstrap CI 高于 N3。"""
    rng = np.random.default_rng(seed)
    rho, p = spearmanr(fhat_pred, truth)
    f_boot = _boot_spearman(fhat_pred, truth, n_boot, rng)
    n_boot_arr = _boot_spearman(n3_pred, truth, n_boot, rng)
    # f̂ 显著>0: 2.5% 分位 > 0
    sig_pos = np.percentile(f_boot, 2.5) > 0
    # f̂ 高于 N3: (f_boot - n3_boot) 的 2.5% 分位 > 0
    beats_n3 = np.percentile(f_boot - n_boot_arr, 2.5) > 0
    # FM4 仅当"有信号但输给 N3"
    fm = "FM4" if (sig_pos and not beats_n3) else None
    res = VerdictResult(invariant="I1", metric=float(rho), threshold=0.0,
                        direction="above", triggered_FM=fm)
    # 把组合判定挂在 metric 之外的属性,供 s3iii_passed 读取
    res.sig_pos = bool(sig_pos)       # type: ignore[attr-defined]
    res.beats_n3 = bool(beats_n3)     # type: ignore[attr-defined]
    return res

def s3iii_passed(res) -> bool:
    """S3-Ⅲ 通过 = f̂ 显著>0 且 bootstrap CI 高于 N3。"""
    return bool(getattr(res, "sig_pos", False) and getattr(res, "beats_n3", False))
```

注:`crosscond_verdict` 在 VerdictResult 上附加 `sig_pos`/`beats_n3` 两个布尔(VerdictResult 是普通 dataclass,可动态赋属性;若用 `frozen=True` 则改为返回 `(res, passed)` 元组)。`s3iii_passed(res)` 是 S3-Ⅲ 的权威通过判定,调用方(report)用它而非 `res.passed`。

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/verify/test_cv_crosscond.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/verify/n3_baseline.py selop/verify/cv_crosscond.py tests/verify/test_cv_crosscond.py
git commit -m "feat: S3-III cross-condition + N3 baseline (I1)"
```

---

### Task 8: cv_consistency — S3-Ⅰ 跨抗原一致性

**Files:**
- Create: `selop/verify/cv_consistency.py`
- Test: `tests/verify/test_cv_consistency.py`

固定变体扫抗原,f̂ 跨抗原变化方向与实测 −logKD 变化方向的一致率 > 0.7。

- [ ] **Step 1: 写失败测试**

```python
# tests/verify/test_cv_consistency.py
import numpy as np
from selop.verify.cv_consistency import consistency_verdict

def test_aligned_directions_pass():
    # fhat 与 truth 跨抗原变化方向一致
    fhat = {("v1","H1"):1.0, ("v1","H3"):2.0, ("v1","B"):0.5}
    truth = {("v1","H1"):3.0, ("v1","H3"):5.0, ("v1","B"):1.0}
    res = consistency_verdict(fhat, truth, antigens=["H1","H3","B"])
    assert res.passed is True   # 所有 pairwise 方向一致

def test_anti_aligned_fails():
    fhat = {("v1","H1"):2.0, ("v1","H3"):1.0, ("v1","B"):3.0}
    truth = {("v1","H1"):1.0, ("v1","H3"):2.0, ("v1","B"):0.5}
    res = consistency_verdict(fhat, truth, antigens=["H1","H3","B"])
    assert res.passed is False

def test_invariant_is_I3():
    fhat = {("v1","H1"):1.0, ("v1","H3"):2.0, ("v1","B"):0.5}
    truth = {("v1","H1"):3.0, ("v1","H3"):5.0, ("v1","B"):1.0}
    res = consistency_verdict(fhat, truth, antigens=["H1","H3","B"])
    assert res.invariant == "I3"
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/verify/test_cv_consistency.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/verify/cv_consistency.py
import numpy as np
from itertools import combinations
from selop.verify.result import VerdictResult

def consistency_verdict(fhat, truth, antigens, threshold=0.7):
    """对每个变体的每对抗原,比较 fhat 差与 truth 差的符号是否一致。一致率>threshold。"""
    variants = {vid for (vid, _) in fhat}
    agree, total = 0, 0
    for vid in variants:
        for a, b in combinations(antigens, 2):
            df = fhat[(vid,a)] - fhat[(vid,b)]
            dt = truth[(vid,a)] - truth[(vid,b)]
            if dt == 0:
                continue
            total += 1
            if np.sign(df) == np.sign(dt):
                agree += 1
    rate = agree / total if total else 0.0
    return VerdictResult(invariant="I3", metric=rate, threshold=threshold,
                         direction="above", triggered_FM=None)
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/verify/test_cv_consistency.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/verify/cv_consistency.py tests/verify/test_cv_consistency.py
git commit -m "feat: S3-I cross-antigen consistency (I3)"
```

---

### Task 9: toysde — 玩具 SDE 前向 + 反推 + gating①(S2,I2)

**Files:**
- Create: `selop/toysde/sde.py`, `selop/toysde/gating.py`
- Test: `tests/toysde/test_sde.py`, `tests/toysde/test_gating.py`

玩具:d=3,f_toy(x,c)=−½xᵀAx+b_c·x(A 正定,b_c 条件依赖),σ_toy。Euler-Maruyama 前向 → population 边际。gating①:静态梯度 vs 轨迹 drift 余弦一致性。

- [ ] **Step 1: 写失败测试(SDE 前向)**

```python
# tests/toysde/test_sde.py
import numpy as np
from selop.toysde.sde import grad_f_toy, euler_maruyama, A_DEFAULT

def test_grad_f_toy_is_neg_Ax_plus_b():
    x = np.array([1.0, 2.0, 3.0]); b = np.array([0.5, 0.0, 0.0])
    g = grad_f_toy(x, b, A=np.eye(3))
    np.testing.assert_allclose(g, -x + b)

def test_euler_maruyama_drifts_toward_minimum():
    # f=-½xᵀx (A=I, b=0), 梯度流应把粒子拉向原点
    rng = np.random.default_rng(0)
    x0 = np.array([10.0, 10.0, 10.0])
    traj = euler_maruyama(x0, b=np.zeros(3), A=np.eye(3), sigma=0.1,
                          dt=0.01, n_steps=500, rng=rng)
    assert np.linalg.norm(traj[-1]) < np.linalg.norm(x0)  # 向原点漂移

def test_trajectory_shape():
    rng = np.random.default_rng(0)
    traj = euler_maruyama(np.zeros(3), np.zeros(3), np.eye(3), 0.1, 0.01, 100, rng)
    assert traj.shape == (101, 3)  # 含初始点
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/toysde/test_sde.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/toysde/sde.py
import numpy as np

A_DEFAULT = np.diag([2.0, 1.5, 1.0])

def grad_f_toy(x, b, A):
    """∇f, f(x)=-½xᵀAx + b·x → ∇f = -Ax + b。"""
    return -A @ x + b

def euler_maruyama(x0, b, A, sigma, dt, n_steps, rng):
    """gradient-flow SDE: dX = ∇f·dt + σ dW。返回 (n_steps+1, d) 轨迹。"""
    d = len(x0)
    traj = np.empty((n_steps + 1, d)); traj[0] = x0; x = x0.copy()
    for t in range(n_steps):
        drift = grad_f_toy(x, b, A)
        x = x + drift * dt + sigma * np.sqrt(dt) * rng.normal(size=d)
        traj[t + 1] = x
    return traj
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/toysde/test_sde.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 写 gating① 失败测试**

```python
# tests/toysde/test_gating.py
import numpy as np
from selop.toysde.gating import cosine_consistency

def test_identical_fields_cosine_one():
    g = np.array([[1.0,0,0],[0,1,0],[0,0,1]])
    assert abs(cosine_consistency(g, g) - 1.0) < 1e-6

def test_orthogonal_fields_cosine_zero():
    a = np.array([[1.0,0,0]]); b = np.array([[0.0,1,0]])
    assert abs(cosine_consistency(a, b)) < 1e-6

def test_anti_parallel_negative():
    a = np.array([[1.0,0,0]]); b = np.array([[-1.0,0,0]])
    assert cosine_consistency(a, b) < 0
```

- [ ] **Step 6: 跑测试确认失败**

Run: `pytest tests/toysde/test_gating.py -v`
Expected: FAIL

- [ ] **Step 7: 写 gating① 实现**

```python
# selop/toysde/gating.py
import numpy as np

def cosine_consistency(grad_static, drift_dyn):
    """gating①: 静态梯度场 vs 动力学 drift 场 的平均余弦相似度。
    两者 shape (N, d)。返回逐点余弦的均值。"""
    gs = np.asarray(grad_static); dd = np.asarray(drift_dyn)
    num = (gs * dd).sum(axis=1)
    den = np.linalg.norm(gs, axis=1) * np.linalg.norm(dd, axis=1)
    mask = den > 1e-12
    return float((num[mask] / den[mask]).mean())
```

- [ ] **Step 8: 跑测试 + 提交**

Run: `pytest tests/toysde/ -v`
Expected: PASS(6 passed)

```bash
git add selop/toysde/ tests/toysde/
git commit -m "feat: toy SDE forward + gating-I cosine (S2/I2)"
```

---

### Task 10: identifiability — S2b gating② λmin

**Files:**
- Create: `selop/verify/identifiability.py`
- Test: `tests/verify/test_identifiability.py`

a(x)=J·Σ_seq·Jᵀ 的最小特征值 λmin > 1e-3·median(λ) → C2 满足;否则触发 FM2。本任务实现椭圆性判定逻辑(传入 Jacobian J 与 Σ_seq,与 ESM 解耦)。

- [ ] **Step 1: 写失败测试**

```python
# tests/verify/test_identifiability.py
import numpy as np
from selop.verify.identifiability import ellipticity_verdict

def test_full_rank_passes():
    J = np.eye(5); Sigma = np.eye(5)   # a=I, λ 全=1, λmin=1>1e-3
    res = ellipticity_verdict(J, Sigma)
    assert res.invariant == "I2"
    assert res.passed is True
    assert res.triggered_FM is None

def test_rank_deficient_triggers_fm2():
    J = np.diag([1.0,1.0,0.0,0.0,0.0]); Sigma = np.eye(5)  # 秩亏 λmin=0
    res = ellipticity_verdict(J, Sigma)
    assert res.passed is False
    assert res.triggered_FM == "FM2"
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/verify/test_identifiability.py -v`
Expected: FAIL

- [ ] **Step 3: 写最小实现**

```python
# selop/verify/identifiability.py
import numpy as np
from selop.verify.result import VerdictResult

def ellipticity_verdict(J, Sigma, rel_floor=1e-3):
    """gating②: a = J Σ Jᵀ 的 λmin > rel_floor·median(λ)?"""
    a = J @ Sigma @ J.T
    eig = np.linalg.eigvalsh(a)
    lam_min = float(eig.min())
    thr = rel_floor * float(np.median(eig))
    passed = lam_min > thr
    return VerdictResult(invariant="I2", metric=lam_min, threshold=thr,
                         direction="above", triggered_FM=None if passed else "FM2")
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/verify/test_identifiability.py -v`
Expected: PASS(2 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/verify/identifiability.py tests/verify/test_identifiability.py
git commit -m "feat: S2b ellipticity gating-II lambda_min (I2)"
```

---

### Task 11: esm_encoder — 冻结 ESM-2 编码 + 缓存

**Files:**
- Create: `selop/repr/esm_encoder.py`
- Test: `tests/repr/test_esm_encoder.py`

ESM-2 是重型外部依赖,用集成测试(标记 slow)+ 接口契约测试,不做纯 TDD。encode_antibody/encode_antigen 返回固定维向量,结果按序列哈希缓存到磁盘。

- [ ] **Step 1: 写接口契约测试(mock ESM,不下载真模型)**

```python
# tests/repr/test_esm_encoder.py
import numpy as np
from selop.repr.esm_encoder import EsmEncoder

class _FakeESM:
    """返回确定性向量,避免测试下载 ESM-2。"""
    embed_dim = 8
    def embed(self, seq: str) -> np.ndarray:
        h = sum(ord(c) for c in seq) % 997
        rng = np.random.default_rng(h)
        return rng.normal(size=self.embed_dim)

def test_same_sequence_same_embedding(tmp_path):
    enc = EsmEncoder(backend=_FakeESM(), cache_dir=tmp_path)
    a = enc.encode_antibody("ACDEF")
    b = enc.encode_antibody("ACDEF")
    np.testing.assert_array_equal(a, b)

def test_cache_hit_avoids_recompute(tmp_path):
    calls = {"n": 0}
    class Counting(_FakeESM):
        def embed(self, seq):
            calls["n"] += 1
            return super().embed(seq)
    enc = EsmEncoder(backend=Counting(), cache_dir=tmp_path)
    enc.encode_antibody("ACDEF"); enc.encode_antibody("ACDEF")
    assert calls["n"] == 1   # 第二次命中缓存

def test_antigen_uses_same_backend(tmp_path):
    enc = EsmEncoder(backend=_FakeESM(), cache_dir=tmp_path)
    v = enc.encode_antigen("MKTAYIAK")
    assert v.shape == (8,)
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/repr/test_esm_encoder.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/repr/esm_encoder.py
import hashlib, numpy as np
from pathlib import Path

class Esm2Backend:
    """真实 ESM-2(fair-esm)。延迟加载避免 import 即下载。"""
    def __init__(self, model_name="esm2_t33_650M_UR50D"):
        import esm, torch
        self.model, alphabet = esm.pretrained.__dict__[model_name]()
        self.model.eval()
        for p in self.model.parameters():
            p.requires_grad_(False)   # 冻结
        self.bc = alphabet.get_batch_converter()
        self.torch = torch
        self.embed_dim = self.model.embed_dim
        self._layer = self.model.num_layers
    def embed(self, seq: str) -> np.ndarray:
        _, _, toks = self.bc([("x", seq)])
        with self.torch.no_grad():
            out = self.model(toks, repr_layers=[self._layer])
        rep = out["representations"][self._layer][0, 1:len(seq)+1].mean(0)
        return rep.cpu().numpy()

class EsmEncoder:
    def __init__(self, backend, cache_dir):
        self.backend = backend
        self.cache_dir = Path(cache_dir); self.cache_dir.mkdir(parents=True, exist_ok=True)
    def _cached(self, seq):
        key = hashlib.sha1(seq.encode()).hexdigest()
        f = self.cache_dir / f"{key}.npy"
        if f.exists():
            return np.load(f)
        v = self.backend.embed(seq); np.save(f, v); return v
    def encode_antibody(self, seq): return self._cached(seq)
    def encode_antigen(self, seq): return self._cached(seq)
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/repr/test_esm_encoder.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/repr/esm_encoder.py tests/repr/test_esm_encoder.py
git commit -m "feat: frozen ESM-2 encoder with disk cache"
```

---

### Task 12: fhat — f̂ = head(emb_ab, emb_ag) → 标量,可微

**Files:**
- Create: `selop/model/fhat.py`
- Test: `tests/model/test_fhat.py`

冻结 ESM 之上的可训练 head(Transformer encoder layer + MLP)。抗体 emb ⊕ 抗原 emb → 标量。须对输入 emb 可微(供 ∇f̂)。

- [ ] **Step 1: 写失败测试**

```python
# tests/model/test_fhat.py
import torch
from selop.model.fhat import Fhat

def test_output_is_scalar_per_item():
    m = Fhat(ab_dim=8, ag_dim=8, hidden=16)
    ab = torch.randn(4, 8); ag = torch.randn(4, 8)
    out = m(ab, ag)
    assert out.shape == (4,)

def test_differentiable_wrt_antibody_input():
    m = Fhat(ab_dim=8, ag_dim=8, hidden=16)
    ab = torch.randn(1, 8, requires_grad=True); ag = torch.randn(1, 8)
    y = m(ab, ag); y.backward()
    assert ab.grad is not None
    assert ab.grad.abs().sum() > 0   # 非零梯度(供 ∇f̂)

def test_antigen_conditioning_changes_output():
    torch.manual_seed(0)
    m = Fhat(ab_dim=8, ag_dim=8, hidden=16)
    ab = torch.randn(1, 8)
    out_a = m(ab, torch.randn(1, 8)); out_b = m(ab, torch.randn(1, 8))
    assert not torch.allclose(out_a, out_b)   # 换抗原→输出变(条件依赖前提)
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/model/test_fhat.py -v`
Expected: FAIL

- [ ] **Step 3: 写最小实现**

```python
# selop/model/fhat.py
import torch, torch.nn as nn

class Fhat(nn.Module):
    """f̂(ab_emb, ag_emb)→标量。冻结ESM外的可训练head。
    架构: 拼接 → Transformer encoder layer(self-attn over [ab,ag] 两token) → MLP。"""
    def __init__(self, ab_dim, ag_dim, hidden=256, nhead=4):
        super().__init__()
        self.ab_proj = nn.Linear(ab_dim, hidden)
        self.ag_proj = nn.Linear(ag_dim, hidden)
        layer = nn.TransformerEncoderLayer(d_model=hidden, nhead=nhead,
                                           dim_feedforward=hidden*2, batch_first=True)
        self.enc = nn.TransformerEncoder(layer, num_layers=2)
        self.out = nn.Sequential(nn.Linear(hidden, hidden), nn.GELU(),
                                 nn.Linear(hidden, 1))
    def forward(self, ab_emb, ag_emb):
        ab = self.ab_proj(ab_emb); ag = self.ag_proj(ag_emb)
        seq = torch.stack([ab, ag], dim=1)        # (B,2,hidden)
        h = self.enc(seq).mean(dim=1)             # 池化两 token
        return self.out(h).squeeze(-1)            # (B,)
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/model/test_fhat.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/model/fhat.py tests/model/test_fhat.py
git commit -m "feat: Fhat differentiable scoring head"
```

---

### Task 13: trainer — S1 训练循环 + ∇f̂ 接口

**Files:**
- Create: `selop/train/trainer.py`
- Test: `tests/train/test_trainer.py`

训练循环消费 Tobit loss。提供 `grad_fhat(model, ab, ag)` 返回 ∇f̂(对抗体 emb,供 gating① 与 S2b)。训练收敛性用 smoke 测(能在合成数据上降 loss),不做精确断言。

- [ ] **Step 1: 写测试(过拟合小数据 smoke + 梯度接口)**

```python
# tests/train/test_trainer.py
import torch
from selop.model.fhat import Fhat
from selop.train.trainer import train_epoch, grad_fhat

def test_train_epoch_reduces_loss_on_tiny_data():
    torch.manual_seed(0)
    m = Fhat(ab_dim=8, ag_dim=8, hidden=16)
    ab = torch.randn(32, 8); ag = torch.randn(32, 8)
    y = torch.randn(32); cen = torch.zeros(32, dtype=torch.bool)
    floor = torch.full((32,), 6.0)
    opt = torch.optim.Adam(m.parameters(), lr=1e-2)
    l0 = train_epoch(m, ab, ag, y, cen, floor, opt, sigma=1.0)
    for _ in range(20):
        ln = train_epoch(m, ab, ag, y, cen, floor, opt, sigma=1.0)
    assert ln < l0   # loss 下降(smoke)

def test_grad_fhat_returns_input_gradient():
    m = Fhat(ab_dim=8, ag_dim=8, hidden=16)
    ab = torch.randn(3, 8); ag = torch.randn(3, 8)
    g = grad_fhat(m, ab, ag)
    assert g.shape == (3, 8)   # ∇f̂ 对抗体 emb
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/train/test_trainer.py -v`
Expected: FAIL — `ImportError: cannot import train_epoch`

- [ ] **Step 3: 写最小实现**

```python
# selop/train/trainer.py
import torch
from selop.train.tobit_loss import tobit_loss

def train_epoch(model, ab, ag, y, censored, floor, optimizer, sigma=0.047):
    model.train(); optimizer.zero_grad()
    pred = model(ab, ag)
    loss = tobit_loss(pred, y, censored, floor, sigma=sigma)
    loss.backward(); optimizer.step()
    return float(loss.item())

def grad_fhat(model, ab, ag):
    """∇f̂ 对抗体 emb(供 gating① / S2b)。返回 (B, ab_dim)。"""
    model.eval()
    ab = ab.clone().requires_grad_(True)
    out = model(ab, ag).sum()
    out.backward()
    return ab.grad.detach()
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/train/test_trainer.py -v`
Expected: PASS(2 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/train/trainer.py tests/train/test_trainer.py
git commit -m "feat: S1 train loop + grad_fhat interface"
```

---

### Task 14: loader — CR9114 CSV → 四元组

**Files:**
- Create: `selop/data/loader.py`
- Test: `tests/data/test_loader.py`

加载 CR9114 source data CSV(`fig1-data1-v3.csv`),产出 `(Variant, antigen, −logKD, is_censored)`。**真实列名(已核实)**:基因型为 `genotype`(16 位二进制字符串)或 `pos1..pos16` 列;抗原 −logKD 取 `h1_mean / h3_mean / fluB_mean`(另有 `*_repa/b/c` 三重复与 `*_sem`)。loader 用可配置列映射,单测仍用合成 CSV(列名任意),真实加载时传入实际列名。

- [ ] **Step 1: 写失败测试(合成 CSV)**

```python
# tests/data/test_loader.py
import pandas as pd
from selop.data.loader import load_cr9114

def test_loads_quadruples(tmp_path):
    csv = tmp_path / "cr9114.csv"
    # 16 位点列 m0..m15 + 三抗原 logKD 列
    row = {f"m{i}": 0 for i in range(16)}
    row.update({"H1": 9.0, "H3": 5.0, "B": 8.0})  # H3=5 低于floor7→censored
    pd.DataFrame([row]).to_csv(csv, index=False)
    recs = load_cr9114(csv)
    # 1 变体 × 3 抗原 = 3 条
    assert len(recs) == 3
    by_ag = {ag: (v, y, c) for (v, ag, y, c) in recs}
    assert by_ag["H3"][2] is True    # censored
    assert by_ag["H1"][2] is False
    assert by_ag["H1"][1] == 9.0

def test_variant_bits_parsed(tmp_path):
    csv = tmp_path / "c.csv"
    row = {f"m{i}": (1 if i == 0 else 0) for i in range(16)}
    row.update({"H1": 9.0, "H3": 9.0, "B": 9.0})
    pd.DataFrame([row]).to_csv(csv, index=False)
    recs = load_cr9114(csv)
    v = recs[0][0]
    assert v.bits[0] == 1

def test_dict_antigen_cols_maps_real_columns(tmp_path):
    # 真实加载路径: antigen_cols 为 dict{抗原: 实际列名}
    csv = tmp_path / "real.csv"
    row = {f"pos{i}": 0 for i in range(1, 17)}
    row.update({"h1_mean": 9.0, "h3_mean": 5.0, "fluB_mean": 8.0})  # h3=5<floor6→censored
    pd.DataFrame([row]).to_csv(csv, index=False)
    recs = load_cr9114(csv, bit_cols=[f"pos{i}" for i in range(1, 17)],
                       antigen_cols={"H1": "h1_mean", "H3": "h3_mean", "B": "fluB_mean"})
    by_ag = {ag: (v, y, c) for (v, ag, y, c) in recs}
    assert by_ag["H3"][2] is True     # 5.0 ≤ floor(H3)=6 → censored
    assert by_ag["H1"][2] is False    # 9.0 > floor(H1)=7
    assert by_ag["B"][1] == 8.0
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/data/test_loader.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: 写最小实现**

```python
# selop/data/loader.py
import pandas as pd
from selop.data.variant import Variant
from selop.data.censoring import mark_censored

# 合成测试用的默认列名;真实 CR9114(fig1-data1-v3.csv)用下方 REAL_* 常量。
BIT_COLS = [f"m{i}" for i in range(16)]
ANTIGEN_COLS = ["H1", "H3", "B"]

# 真实 CR9114 source data 列映射(已核实):
REAL_BIT_COLS = [f"pos{i}" for i in range(1, 17)]          # pos1..pos16
REAL_ANTIGEN_COLS = {"H1": "h1_mean", "H3": "h3_mean", "B": "fluB_mean"}

def load_cr9114(csv_path, bit_cols=BIT_COLS, antigen_cols=ANTIGEN_COLS):
    """antigen_cols 可为 list[str](列名==抗原名)或 dict{抗原: 列名}。"""
    df = pd.read_csv(csv_path)
    ag_map = antigen_cols if isinstance(antigen_cols, dict) else {a: a for a in antigen_cols}
    recs = []
    for _, r in df.iterrows():
        bits = [int(r[c]) for c in bit_cols]
        v = Variant(bits=bits)
        for ag, col in ag_map.items():
            y = float(r[col])
            recs.append((v, ag, y, mark_censored(y, ag)))
    return recs
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/data/test_loader.py -v`
Expected: PASS(2 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/data/loader.py tests/data/test_loader.py
git commit -m "feat: CR9114 CSV loader"
```

---

### Task 15: report — S4 CS 声明 + 判定汇总

**Files:**
- Create: `selop/report/cs_statement.py`
- Test: `tests/report/test_cs_statement.py`

汇总各 VerdictResult,输出全绿判定 + 触发的 FM + CS 声明文本(含固定的 R-1/R-2/R-3 边界 + 动态 FM 缓解)。

- [ ] **Step 1: 写失败测试**

```python
# tests/report/test_cs_statement.py
from selop.verify.result import VerdictResult
from selop.report.cs_statement import compile_report

def _vr(inv, passed, fm=None):
    # 构造 pass/fail 的 VerdictResult
    return VerdictResult(inv, metric=1.0 if passed else 0.0,
                         threshold=0.5, direction="above", triggered_FM=fm)

def test_all_green_reports_success():
    results = {"S2": _vr("I2",True), "S2b": _vr("I2",True),
               "S3-I": _vr("I3",True), "S3-II": _vr("I3",True),
               "S3-III": _vr("I1",True)}
    rep = compile_report(results)
    assert rep["all_green"] is True
    assert rep["triggered_FMs"] == []

def test_failure_collects_fm():
    results = {"S2": _vr("I2",True), "S2b": _vr("I2",True),
               "S3-I": _vr("I3",True), "S3-II": _vr("I3",True),
               "S3-III": _vr("I1",False,"FM4")}
    rep = compile_report(results)
    assert rep["all_green"] is False
    assert "FM4" in rep["triggered_FMs"]

def test_cs_statement_contains_fixed_boundaries():
    rep = compile_report({"S3-III": _vr("I1",True)})
    text = rep["cs_statement"]
    assert "R-1" in text and "R-2" in text and "R-3" in text
    assert "结合" in text   # R-1 选择压维度边界
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pytest tests/report/test_cs_statement.py -v`
Expected: FAIL

- [ ] **Step 3: 写最小实现**

```python
# selop/report/cs_statement.py
FM_MITIGATION = {
    "FM1": "PLM空间非梯度流 → claim降级'学drift场∇f';CV排序判据稳健。",
    "FM2": "a(x)退化λmin≈0 → 换低维表征/加εI正则/限非退化子流形。",
    "FM3": "选择压含结合以外维度 → CS收窄claim为'结合驱动选择分量'。",
    "FM4": "N3太强 → 改比cross-antigen泛化(pairwise跨抗原泛化弱)。",
    "FM5": "玩具SDE不迁移 → P07定位原理验证;真实空间靠S2b λmin补。",
}
CS_FIXED = (
    "CS覆盖范围诚实声明:\n"
    "严格验证区=CR9114完备16位点×3抗原。\n"
    "R-1 选择压维度边界:仅验证'结合亲和力驱动的选择分量';"
    "表达/稳定性/可开发性/polyreactivity 等未覆盖。\n"
    "R-2 claim形态退路:若gating①非梯度流,claim从'学势函数f'降为'学drift场∇f'。\n"
    "R-3 可辨识性层次:P07验原理适定性,真实PLM空间可辨识性依赖S2b λmin实测。\n"
    "外推区(一般抗体/体内时序)=待验假设,需公司数据。"
)

def compile_report(results: dict):
    all_green = all(r.passed for r in results.values())
    fms = sorted({r.triggered_FM for r in results.values() if r.triggered_FM})
    mitigations = [FM_MITIGATION[f] for f in fms if f in FM_MITIGATION]
    text = CS_FIXED + ("\n触发缓解:\n" + "\n".join(mitigations) if mitigations else "")
    return {"all_green": all_green, "triggered_FMs": fms,
            "cs_statement": text,
            "per_gate": {k: v.passed for k, v in results.items()}}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pytest tests/report/test_cs_statement.py -v`
Expected: PASS(3 passed)

- [ ] **Step 5: 提交**

```bash
git add selop/report/cs_statement.py tests/report/test_cs_statement.py
git commit -m "feat: S4 CS statement + verdict compilation"
```

---

### Task 16: 端到端 smoke(合成数据贯通全流程)

**Files:**
- Test: `tests/test_e2e_smoke.py`

用合成小数据(假 ESM backend + 合成 CR9114)贯通 S1→S3→S4,确认管线无接口断裂。不验科学结论(那需真实 ESM + 真实数据),只验"全流程能跑通且产出 report"。

- [ ] **Step 1: 写 e2e smoke 测试**

```python
# tests/test_e2e_smoke.py
import numpy as np, torch
from selop.model.fhat import Fhat
from selop.train.trainer import train_epoch
from selop.verify.cv_shuffle import shuffle_permutation_test
from selop.report.cs_statement import compile_report
from selop.verify.result import VerdictResult

def test_pipeline_runs_end_to_end():
    torch.manual_seed(0); rng = np.random.default_rng(0)
    # 合成: 60变体×3抗原, y 真有条件依赖
    ag_idx = {"H1":0,"H3":1,"B":2}
    ab = torch.randn(180, 8); ag = torch.randn(180, 8)
    recs = [(vid, a, None) for vid in range(60) for a in ("H1","H3","B")]
    y = torch.tensor([0.01*vid + [0,5,10][ag_idx[a]] for (vid,a,_) in recs]).float()
    cen = torch.zeros(180, dtype=torch.bool); floor = torch.full((180,), 6.0)
    m = Fhat(8,8,16); opt = torch.optim.Adam(m.parameters(), 1e-2)
    for _ in range(5):
        train_epoch(m, ab, ag, y, cen, floor, opt, sigma=1.0)
    # S3-II 用一个简单 fit_and_score 贯通
    def fit_and_score(rs):
        idx = {("H1"):0,"H3":1,"B":2}
        preds = np.array([0.01*vid + [0,5,10][idx[a]] for (vid,a,_) in rs])
        truth = np.array([0.01*vid + [0,5,10][idx[a]] for (vid,a,_) in rs])
        return -float(((preds-truth)**2).mean())
    vr = shuffle_permutation_test(recs, fit_and_score, n_perm=50, seed=0)
    rep = compile_report({"S3-II": vr})
    assert "cs_statement" in rep
    assert isinstance(rep["all_green"], bool)
```

- [ ] **Step 2: 跑测试**

Run: `pytest tests/test_e2e_smoke.py -v`
Expected: PASS(1 passed)

- [ ] **Step 3: 跑全套测试**

Run: `pytest -v`
Expected: 全部 PASS

- [ ] **Step 4: 提交**

```bash
git add tests/test_e2e_smoke.py
git commit -m "test: end-to-end pipeline smoke"
```

---

## 真实数据执行清单(代码完成后,非 TDD 步骤)

**数据已下载**: `g:\OUROBOROS-AI4S\datasets\cr9114\`(eLife 71393 source data,CC-BY)。
- 主表 = `fig1-data1-v3.csv`(65536 行 × 16 pos × H1/H3/fluB,已核实组合完备)。
- N3 系数 = `fig2-data1-v3.csv`(epistasis Coefficient,H1/H3/FluB,Intercept+main+pair)。
- `fig1-data2`/`fig2-data2` = CR6261 姊妹抗体(9 位点,非主线);`fig5-data*` = 演化路径模拟;`supp1-3.xlsx` = 补充材料(16 位点位置定义/germline 序列候选)。

代码与单测全绿后,在真实数据上跑(需算力):
- [x] ~~下载 CR9114 source data CSV~~ 已完成。
- [x] ~~核实各抗原 floor~~ 已核实:**H1=7.0, H3=6.0, B=6.0**(已填入 `censoring.py`)。
- [x] ~~核实 CSV 列名~~ 已核实:`genotype`/`pos1..pos16` + `h1_mean/h3_mean/fluB_mean`(已填入 `loader.py` 的 REAL_* 常量)。
- [ ] 从 `supp*.xlsx` 拆出 16 位点 (pos, germline_aa, somatic_aa) 与 germline VH 序列 → 填 `variant.py` 的 `MUTATION_SITES`/`GERMLINE_SEQ`(唯一剩余未填真值的常量)。
- [ ] 载 `fig2-data1-v3.csv` epistasis 系数 → N3 pairwise baseline(注意 Term 列含位置编号,需映射到 16 位点索引)。
- [ ] 安装 fair-esm,用 Esm2Backend 编码全 65536 抗体 + 3 抗原(缓存 ~335MB)。
- [ ] 跑 S1 训练 f̂ → S2b λmin → S2 玩具SDE → S3 三关 → S4 report。
- [ ] 检查 5 条必验条件 C1-C5,记录触发的 FM。







