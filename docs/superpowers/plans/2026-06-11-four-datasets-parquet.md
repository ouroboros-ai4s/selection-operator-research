# 四个数据集分别落地为 Parquet — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 MAGMA-seq、Engelhart 2022、S5F 三个数据集各自下载/处理成本地 parquet(CR9114 家族已完成,仅核验),每个配一个展示 schema 的 ipynb。

**Architecture:** 每个数据集自成一个 sibling 目录,内部照搬 `cr9114/` 的 `src/schema.py`(配置常量)+ `src/utils.py`(build/validate)+ `tests/explore_*.ipynb` 三件套。各数据集保持原生单位/列名/符号,本轮不跨集统一。

**Tech Stack:** Python 3、pandas、pyarrow、openpyxl(读 xlsx);CR9114 已用 daft 不动。无 git(一次性代码)。

> **关于 git:** 用户明确本批为一次性代码,全程不提交 git。每个 Task 的收尾步骤是"跑出 parquet 并 ipynb 核验",不是 commit。

> **执行顺序与依赖:** Phase 0(CR9114 核验,无新代码)→ Phase 1(MAGMA,数据已在本地)→ Phase 2(Engelhart,需先下载)→ Phase 3(S5F,需先导出,取数有风险)。Engelhart 与 S5F 的"先探明再写 build"步骤是刻意的:其缺失记号/导出格式未经核实,必须先看真实数据。

---

## 文件结构

| 文件 | 职责 |
|---|---|
| `magma-seq/src/schema.py` | MAGMA 配置:源 xlsx 路径、5 个数据 sheet 名、列改名映射、抗体→抗原映射常量 |
| `magma-seq/src/build.py` | 读 MOESM6 各 sheet → 拼接 → 选列/改名/填 antigen → 写 parquet;附结构 validate |
| `magma-seq/tests/explore_magma.ipynb` | read_parquet → info/head/describe/抗体·抗原计数 |
| `magma-seq/tests/test_magma.py` | 结构断言:dtype、抗体/抗原取值集合、关键列非全空 |
| `engelhart/src/download.py` | 从 GitHub/Zenodo 下载 antibody_dataset_1 CSV 到 `datasets/` |
| `engelhart/src/schema.py` | Engelhart 配置:CSV 路径、列清单、缺失记号(探明后填) |
| `engelhart/src/build.py` | 读 CSV → 选列/类型 → 写 parquet;附结构 validate |
| `engelhart/tests/explore_engelhart.ipynb` | 展示 schema |
| `engelhart/tests/test_engelhart.py` | 结构断言 |
| `engelhart/README.md` | 显著标注 CC-BY-NC-SA 非商用 |
| `s5f/src/export_s5f.R` 或 `s5f/src/build.py` | 从 HH_S5F 导出 1024 行 5-mer 表 → parquet(取数路径实现时定) |
| `s5f/tests/explore_s5f.ipynb` | 展示 schema |
| `s5f/tests/test_s5f.py` | 断言 1024 行、4 个 sub_* 概率行和≈1、自身项=0 |

---

## Phase 0 — CR9114 家族核验(无新代码)

### Task 0: 核验已有两个 parquet 仍匹配固化真值

**Files:**
- 只读:`cr9114/src/utils.py`、`cr9114/src/schema.py`、`cr9114/tests/test_build.py`

- [ ] **Step 1: 跑现有断言测试**

Run: `cd g:/OUROBOROS-AI4S/cr9114 && python -m pytest tests/test_build.py -v`
Expected: 3 个测试全 PASS(test_cr9114_schema_and_rows、test_cr6261_backfill_and_null、test_validate_cr9114_counts)。

- [ ] **Step 2: 确认 parquet 文件在盘且可读**

Run: `cd g:/OUROBOROS-AI4S/cr9114 && python -c "import pandas as pd; print(pd.read_parquet('datasets/cr9114').shape); print(pd.read_parquet('datasets/cr6261').shape)"`
Expected: `(65536, 11)` 和 `(2048, 8)`。

- [ ] **Step 3: 核验展示 ipynb 可跑**

Run: `cd g:/OUROBOROS-AI4S/cr9114 && jupyter nbconvert --to notebook --execute --inplace tests/explore_datasets.ipynb`
Expected: 无报错执行完成。若 jupyter 不可用则手工 `python` 跑其首个 read_parquet cell 等价命令。

若以上任一失败 → 回报,不擅自重建已完成的数据。

---

## Phase 1 — MAGMA-seq(数据已在本地 `supp_raw/`)

> **真实表头**(已核 MOESM6):README sheet 跳过。5 个数据 sheet 列集**不一致**:
> - 全部含:`Variant, Kd, Fmax, Success, LL, Rijk, Concentrations, sorted fractions, ER, Avg_counts, X^2_red_min, 95% CI low, 95% CI high, n, Ab`
> - 能量列名歧义:`all_barcodes_4A8_CC121`/`4A8_CC121_combined` 用 `ddg`;`all_barcodes_222-1C06`/`all_barcodes_319-345`/`topbinHA_rep2` 用 `dg`。统一改名为 `ddg`。
> - `Barcode` 仅 3 个 barcode-level sheet 有 → 丢弃(本轮要 collapsed variant 级)。本轮只取 variant-level:用 `4A8_CC121_combined`(非 barcode)+ `topbinHA_rep2`(多抗体)+ 是否含 222-1C06/319-345 见 Step 1 探明。

### Task 1: 探明真实行数与各 sheet 抗体取值

**Files:**
- 只读:`magma-seq/supp_raw/MOESM6_ESM.xlsx`

- [ ] **Step 1: 实算每个数据 sheet 的真实行数 + Ab 列去重值**

Run:
```bash
cd g:/OUROBOROS-AI4S && python -c "
import pandas as pd, sys, io
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
xl=pd.ExcelFile('magma-seq/supp_raw/MOESM6_ESM.xlsx')
for sn in xl.sheet_names:
    if sn=='README': continue
    df=xl.parse(sn)
    abs_=sorted(set(str(x) for x in df['Ab'].dropna())) if 'Ab' in df else []
    print(sn, 'rows=',len(df), 'Ab=',abs_)
"
```
Expected: 打印每个数据 sheet 的真实行数与抗体集合。**记录输出**——它定 Task 3 测试的预期抗体集合,并核对 spec 的抗体→抗原映射。

### Task 2: 写 `magma-seq/src/schema.py` 配置常量

**Files:**
- Create: `magma-seq/src/schema.py`

- [ ] **Step 1: 写配置**

```python
"""MAGMA-seq MOESM6 → parquet 的配置常量。"""
from __future__ import annotations

SRC_XLSX = "supp_raw/MOESM6_ESM.xlsx"
OUT_DIR = "datasets/magma_seq"

# 取 variant-level sheet(非 barcode 级)。barcode 级冗余,本轮不取。
# 若 Task1 发现 222-1C06/319-345 仅有 barcode 级,则也纳入并在 build 丢 Barcode 列。
DATA_SHEETS = [
    "4A8_CC121_combined",
    "all_barcodes_222-1C06",
    "all_barcodes_319-345",
    "topbinHA_rep2",
]

# 能量列名归一: 任一存在即改名 ddg
ENERGY_SRC = ("ddg", "dg")

# 保留列(源名)→ 输出名。Barcode 等其余列丢弃。
KEEP = {
    "Variant": "variant",
    "Ab": "antibody",
    "Kd": "Kd_nM",
    "Fmax": "Fmax",
    "Success": "success",
    "Avg_counts": "avg_counts",
    "95% CI low": "ci_low",
    "95% CI high": "ci_high",
    "n": "n",
}

# 抗体 → 抗原(据 MAGMA 论文; Task1 输出核对后定稿)
AB_TO_ANTIGEN = {
    "4A8": "S1", "CC12.1": "S1",
    "CR6261": "HA", "222-1C06": "HA", "319-345": "HA",
    "Ab_2-7": "HA", "Ab_2-17": "HA",
    "1G01": "N2", "1G04": "N2",
}
```

### Task 3: 写 `magma-seq/src/build.py`

**Files:**
- Create: `magma-seq/src/build.py`

- [ ] **Step 1: 写 build + validate**

```python
"""MOESM6 各 sheet → 统一 MAGMA parquet。"""
from __future__ import annotations
from pathlib import Path
import pandas as pd
from src.schema import SRC_XLSX, OUT_DIR, DATA_SHEETS, ENERGY_SRC, KEEP, AB_TO_ANTIGEN


def build(base: Path) -> pd.DataFrame:
    xl = pd.ExcelFile(Path(base) / SRC_XLSX)
    parts = []
    for sn in DATA_SHEETS:
        df = xl.parse(sn)
        # 能量列归一为 ddg
        e = next((c for c in ENERGY_SRC if c in df.columns), None)
        sub = df[list(KEEP)].rename(columns=KEEP)
        sub["ddg"] = df[e] if e else pd.NA
        sub["source_sheet"] = sn
        parts.append(sub)
    out = pd.concat(parts, ignore_index=True)
    out["antibody"] = out["antibody"].astype(str)
    out["antigen"] = out["antibody"].map(AB_TO_ANTIGEN)
    cols = ["antibody", "variant", "antigen", "Kd_nM", "Fmax", "ddg",
            "ci_low", "ci_high", "n", "avg_counts", "success", "source_sheet"]
    return out[cols]


def validate(df: pd.DataFrame) -> None:
    assert df["antigen"].notna().all(), \
        f"未映射抗体: {sorted(df.loc[df.antigen.isna(),'antibody'].unique())}"
    assert df["variant"].notna().all(), "variant 有空"
    assert (df["Kd_nM"].dropna() > 0).all(), "Kd 应为正 nM"


def main(base: Path) -> None:
    df = build(base)
    validate(df)
    out = Path(base) / OUT_DIR
    out.mkdir(parents=True, exist_ok=True)
    df.to_parquet(out / "data.parquet", index=False)
    print(f"rows={len(df)} antibodies={sorted(df.antibody.unique())}")
    print(f"antigens={df.antigen.value_counts().to_dict()}")
    print(f"dtypes=\n{df.dtypes}")


if __name__ == "__main__":
    import sys
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
```

- [ ] **Step 2: 跑 build 产出 parquet**

Run: `cd g:/OUROBOROS-AI4S/magma-seq && python -m src.build`
Expected: 打印 rows=、antibodies=(应含 CR6261 等)、antigens=(S1/HA/N2 计数)、dtypes。`datasets/magma_seq/data.parquet` 生成。若 `validate` 报"未映射抗体" → 据 Task1 实测把该抗体补进 `AB_TO_ANTIGEN`。

### Task 4: 写 `magma-seq/tests/test_magma.py` 结构断言

**Files:**
- Create: `magma-seq/tests/test_magma.py`

- [ ] **Step 1: 写测试**

```python
from pathlib import Path
import pandas as pd
from src.build import build, validate

BASE = Path(__file__).resolve().parents[1]

def test_build_structure():
    df = build(BASE)
    assert list(df.columns) == ["antibody", "variant", "antigen", "Kd_nM",
        "Fmax", "ddg", "ci_low", "ci_high", "n", "avg_counts", "success", "source_sheet"]
    assert len(df) > 0
    validate(df)  # 抗原全映射 / variant 非空 / Kd 为正

def test_antigens_in_known_set():
    df = build(BASE)
    assert set(df["antigen"].unique()) <= {"S1", "HA", "N2"}

def test_cr6261_present():
    df = build(BASE)
    assert "CR6261" in set(df["antibody"])  # topbinHA_rep2 含 CR6261
```

- [ ] **Step 2: 跑测试**

Run: `cd g:/OUROBOROS-AI4S/magma-seq && python -m pytest tests/test_magma.py -v`
Expected: 3 个 PASS。

### Task 5: 写 `magma-seq/tests/explore_magma.ipynb`

**Files:**
- Create: `magma-seq/tests/explore_magma.ipynb`

- [ ] **Step 1: 建 notebook,4 个 cell**

Cell 1(load):
```python
import pandas as pd
df = pd.read_parquet("../datasets/magma_seq/data.parquet")
df.shape
```
Cell 2(schema):`df.info(); df.head(10)`
Cell 3(describe):`df.describe(include="all")`
Cell 4(关键计数):
```python
print(df["antibody"].value_counts())
print(df["antigen"].value_counts())
print("Kd_nM null:", df["Kd_nM"].isna().sum())
```

- [ ] **Step 2: 执行核验**

Run: `cd g:/OUROBOROS-AI4S/magma-seq && jupyter nbconvert --to notebook --execute --inplace tests/explore_magma.ipynb`
Expected: 无报错,各 cell 有输出。**人工核验闸**:行数、抗体分布、抗原分布眼检合理。

---

## Phase 2 — Engelhart 2022(需先下载,CC-BY-NC-SA 非商用)

### Task 6: 下载 antibody_dataset_1 并探明结构

**Files:**
- Create: `engelhart/src/download.py`
- Create: `engelhart/README.md`

- [ ] **Step 1: 写 README 标注许可**

```markdown
# Engelhart 2022 AlphaSeq Antibody Dataset (本地处理)

源: github.com/mit-ll/AlphaSeq_Antibody_Dataset (Zenodo 10.5281/zenodo.7783546)
论文: Engelhart et al 2022, Sci Data, DOI 10.1038/s41597-022-01779-4

**许可: CC-BY-NC-SA 4.0 — 非商用 (NonCommercial)。**
仅供方法学研究,不得进入任何商用流程(含 Click.mAb. 商用管线)。
`Pred_affinity` = log10(Kd, nM),越低 = 结合越强(非 pKd,符号不翻转)。
```

- [ ] **Step 2: 写下载脚本(探多个候选路径)**

```python
"""下载 Engelhart antibody_dataset_1 CSV。"""
from pathlib import Path
import urllib.request

BASE = Path(__file__).resolve().parents[1] / "datasets"
RAW = "https://raw.githubusercontent.com/mit-ll/AlphaSeq_Antibody_Dataset/main/antibody_dataset_1/"
# 候选文件名(repo 未列全, 逐个试)
CANDIDATES = ["MITLL_AAlphaBio_Ab_Binding_dataset.csv",
              "antibody_dataset_1.csv", "data.csv"]

def main():
    BASE.mkdir(parents=True, exist_ok=True)
    for fn in CANDIDATES:
        try:
            urllib.request.urlretrieve(RAW + fn, BASE / fn)
            print("OK:", fn)
            return
        except Exception as e:
            print("miss:", fn, e)
    raise SystemExit("全部候选失败 → 手工到 GitHub/Zenodo 确认文件名后回填 CANDIDATES")

if __name__ == "__main__":
    main()
```

- [ ] **Step 3: 跑下载**

Run: `cd g:/OUROBOROS-AI4S/engelhart && python src/download.py`
Expected: 打印 OK:<文件名>,CSV 落 `datasets/`。**若全 miss** → 浏览器打开 repo `antibody_dataset_1/` 目录确认真实文件名,回填 `CANDIDATES` 重跑。这是已知风险(spec 风险 3)。

- [ ] **Step 4: 探明真实列与缺失记号**

Run:
```bash
cd g:/OUROBOROS-AI4S/engelhart && python -c "
import pandas as pd, glob
f=glob.glob('datasets/*.csv')[0]
df=pd.read_csv(f)
print('cols:',list(df.columns)); print('rows:',len(df))
print('Pred_affinity NaN:', df.filter(like='affinity').isna().sum().to_dict())
print(df.head(3).to_string())
"
```
Expected: 打印真实列名、行数、affinity 缺失计数与样例。**记录输出**——定 Task 7 的列清单与缺失处理(spec 风险 2)。

### Task 7: 写 `engelhart/src/schema.py` + `build.py`

**Files:**
- Create: `engelhart/src/schema.py`
- Create: `engelhart/src/build.py`

- [ ] **Step 1: 写 schema.py(列清单据 Task6 Step4 实测回填)**

```python
"""Engelhart antibody_dataset_1 → parquet 配置。"""
from __future__ import annotations

OUT_DIR = "datasets/engelhart"
# 预期列(据 README; Task6 实测后核对修正)
EXPECT_COLS = ["POI", "Sequence", "HC", "LC",
    "CDRH1", "CDRH2", "CDRH3", "CDRL1", "CDRL2", "CDRL3",
    "Target", "Assay", "Replicate", "Pred_affinity"]
```

- [ ] **Step 2: 写 build.py(忠实保留,缺失记号保持原生 → NaN)**

```python
"""Engelhart CSV → parquet。忠实照搬, 缺失保持 NaN, 符号不翻转。"""
from __future__ import annotations
from pathlib import Path
import glob
import pandas as pd
from src.schema import OUT_DIR, EXPECT_COLS


def build(base: Path) -> pd.DataFrame:
    csv = glob.glob(str(Path(base) / "datasets" / "*.csv"))[0]
    df = pd.read_csv(csv)
    # 只取存在的预期列(实测列名可能略异, 交集保序)
    cols = [c for c in EXPECT_COLS if c in df.columns]
    return df[cols]


def validate(df: pd.DataFrame) -> None:
    assert "Pred_affinity" in df.columns, "缺 affinity 列"
    assert "Sequence" in df.columns, "缺 Sequence 列"
    assert len(df) > 0, "空表"


def main(base: Path) -> None:
    df = build(base)
    validate(df)
    out = Path(base) / OUT_DIR
    out.mkdir(parents=True, exist_ok=True)
    df.to_parquet(out / "data.parquet", index=False)
    print(f"rows={len(df)} cols={list(df.columns)}")
    print(f"targets={df['Target'].value_counts().to_dict() if 'Target' in df else 'n/a'}")
    print(f"affinity NaN={df['Pred_affinity'].isna().sum()}")


if __name__ == "__main__":
    import sys
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
```

- [ ] **Step 3: 跑 build**

Run: `cd g:/OUROBOROS-AI4S/engelhart && python -m src.build`
Expected: 打印 rows=(约 71384 量级有效 + 缺失行)、cols=、targets=(1 真实 + 3 对照)、affinity NaN 计数。`datasets/engelhart/data.parquet` 生成。

### Task 8: 写 `engelhart/tests/test_engelhart.py` + `explore_engelhart.ipynb`

**Files:**
- Create: `engelhart/tests/test_engelhart.py`
- Create: `engelhart/tests/explore_engelhart.ipynb`

- [ ] **Step 1: 写测试**

```python
from pathlib import Path
from src.build import build, validate

BASE = Path(__file__).resolve().parents[1]

def test_has_core_cols():
    df = build(BASE)
    for c in ["Sequence", "Target", "Replicate", "Pred_affinity"]:
        assert c in df.columns
    validate(df)

def test_nonempty():
    df = build(BASE)
    assert len(df) > 1000  # 量级检查
```

- [ ] **Step 2: 跑测试**

Run: `cd g:/OUROBOROS-AI4S/engelhart && python -m pytest tests/test_engelhart.py -v`
Expected: 2 个 PASS。

- [ ] **Step 3: 建 ipynb(4 cell:load/info+head/describe/Target+affinity 分布),执行核验**

Cell 内容同 Task5 模式,路径改 `../datasets/engelhart/data.parquet`,计数 cell 打印 `df["Target"].value_counts()` 与 `df["Pred_affinity"].describe()`。
Run: `cd g:/OUROBOROS-AI4S/engelhart && jupyter nbconvert --to notebook --execute --inplace tests/explore_engelhart.ipynb`
Expected: 无报错,**人工核验闸**。

---

## Phase 3 — S5F(突变算子 M,需导出,取数有风险)

### Task 9: 取得 HH_S5F 的 1024 行 5-mer 表

**Files:**
- Create: `s5f/src/export_s5f.R`(路径1)或落地一个 `s5f/datasets/raw/` 文本文件(路径2)

- [ ] **Step 1: 探 R 是否可用**

Run: `Rscript --version 2>&1; echo "---"; Rscript -e 'requireNamespace("shazam")' 2>&1`
Expected: 判定 R + shazam 是否在。**决定走路径1还是路径2/3。**

- [ ] **Step 2a(路径1,R 可用): 写 export_s5f.R**

```r
library(shazam)
m <- HH_S5F
# mutability: 命名向量(1024 fivemer)
mut <- data.frame(fivemer=names(m@mutability), mutability=as.numeric(m@mutability))
# substitution: 4 x 1024 矩阵(行=A/C/G/T, 列=fivemer)
sub <- as.data.frame(t(m@substitution))
sub$fivemer <- rownames(sub)
df <- merge(mut, sub, by="fivemer")
# merge 后列序 = fivemer, mutability, 然后 substitution 的 4 列(原顺序 A/C/G/T)
colnames(df) <- c("fivemer","mutability","sub_A","sub_C","sub_G","sub_T")
write.csv(df, "datasets/raw/s5f_raw.csv", row.names=FALSE)
cat("rows:", nrow(df), "\n")
```
Run: `cd g:/OUROBOROS-AI4S/s5f && mkdir -p datasets/raw && Rscript src/export_s5f.R`
Expected: `datasets/raw/s5f_raw.csv`,1024 行。**注意**:`@substitution` 槽的行列方向与列名顺序需以实际 `str(HH_S5F)` 为准,Step 跑出后核对四列确为 A/C/G/T 概率。

- [ ] **Step 2b(路径2,无 R): 找包内随附数据或 Immcantation 文本版**

Run: 搜索已安装包数据 / 从 Immcantation 发布资源下载 S5F 文本。若下到 `.rda`,用 `pyreadr` 读:`pip install pyreadr; python -c "import pyreadr; print(pyreadr.read_r('HH_S5F.rda').keys())"`。
Expected: 得到含 mutability + substitution 的文本/对象 → 落 `datasets/raw/s5f_raw.csv`(同 2a 列)。

- [ ] **Step 2c(两路皆不通): 回报阻塞**

记录所尝试命令与失败原因到 `s5f/README.md`,**不臆造任何数值**,回报用户。Phase 3 暂停,Phase 0-2 不受影响。

### Task 10: 写 `s5f/src/build.py` 规整为 parquet

**Files:**
- Create: `s5f/src/build.py`

- [ ] **Step 1: 写 build + validate**

```python
"""s5f_raw.csv → 规整 parquet。"""
from __future__ import annotations
from pathlib import Path
import pandas as pd

OUT_DIR = "datasets/s5f"
SUBS = ["sub_A", "sub_C", "sub_G", "sub_T"]
BASES = {"sub_A": "A", "sub_C": "C", "sub_G": "G", "sub_T": "T"}


def build(base: Path) -> pd.DataFrame:
    df = pd.read_csv(Path(base) / "datasets/raw/s5f_raw.csv")
    df["fivemer"] = df["fivemer"].astype(str).str.upper()
    return df[["fivemer", "mutability"] + SUBS]


def validate(df: pd.DataFrame) -> None:
    assert len(df) == 1024, f"应 1024 行(4^5), 实 {len(df)}"
    assert df["fivemer"].str.len().eq(5).all(), "fivemer 须 5 nt"
    # 中心碱基(第3位)对应的 sub 列应为 0
    for _, r in df.iterrows():
        center = r["fivemer"][2]
        col = f"sub_{center}"
        if pd.notna(r[col]):
            assert abs(r[col]) < 1e-6, f"{r['fivemer']} 自身替换 {col} 应=0"
    # 非全空的替换行, 四项和应≈1
    s = df[SUBS].dropna(how="all").sum(axis=1)
    assert ((s - 1).abs() < 1e-3).all() or (s.abs() < 1e-6).all(), "替换概率行和应≈1或全0"


def main(base: Path) -> None:
    df = build(base)
    validate(df)
    out = Path(base) / OUT_DIR
    out.mkdir(parents=True, exist_ok=True)
    df.to_parquet(out / "data.parquet", index=False)
    print(f"rows={len(df)} dtypes=\n{df.dtypes}")
    print(df.head())


if __name__ == "__main__":
    import sys
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
```

- [ ] **Step 2: 跑 build**

Run: `cd g:/OUROBOROS-AI4S/s5f && python -m src.build`
Expected: rows=1024,parquet 生成。若 `validate` 报中心碱基/行和断言失败 → 说明 R 导出的列方向/顺序错了,回 Task9 Step2a 据实际 `@substitution` 方向修正,**不放宽断言**。

### Task 11: 写 `s5f/tests/test_s5f.py` + `explore_s5f.ipynb`

**Files:**
- Create: `s5f/tests/test_s5f.py`
- Create: `s5f/tests/explore_s5f.ipynb`

- [ ] **Step 1: 写测试**

```python
from pathlib import Path
from src.build import build, validate

BASE = Path(__file__).resolve().parents[1]

def test_1024_and_invariants():
    df = build(BASE)
    assert len(df) == 1024
    validate(df)  # 5nt / 中心项=0 / 行和≈1
```

- [ ] **Step 2: 跑测试**

Run: `cd g:/OUROBOROS-AI4S/s5f && python -m pytest tests/test_s5f.py -v`
Expected: PASS。

- [ ] **Step 3: 建 ipynb(load/info+head/describe/mutability 分布),执行核验**

路径 `../datasets/s5f/data.parquet`;计数 cell 打印 `df["mutability"].describe()` 与 `df.head(10)`。
Run: `cd g:/OUROBOROS-AI4S/s5f && jupyter nbconvert --to notebook --execute --inplace tests/explore_s5f.ipynb`
Expected: 无报错,**人工核验闸**。

---

## 完成标准

- `magma-seq/datasets/magma_seq/data.parquet`、`engelhart/datasets/engelhart/data.parquet`、`s5f/datasets/s5f/data.parquet` 三个 parquet 落盘(S5F 若取数阻塞则记录回报)。
- CR9114 家族两个已有 parquet 核验通过。
- 四个 `explore_*.ipynb` 各自能 load 并展示 schema。
- 各 `test_*.py` 结构断言通过。
- 全程无 git 操作。


