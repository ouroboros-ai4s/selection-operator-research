# Design: 四个数据集分别落地为 Parquet

> Date: 2026-06-11
> Source: brainstorming (superpowers)
> 上游: `project_open_datasets_survey`(数据集调研)、`project_cr9114_data`(CR9114 已完成)
> 下游: writing-plans(实现计划)

## 目标

把选择算子课题用到的四个开源数据集,**各自独立**地下载并处理成本地 parquet,每个配一个展示其内部 schema 的 ipynb。本轮**刻意不做跨数据集统一**——先让每个数据集以原生形态干净落盘,看到真实 parquet 后再决定如何合并成一个图数据集(留待下一轮)。

四个数据集在最终 `f=φ∘a` 主方程中的角色(本轮仅作背景,不在 schema 中体现):
- **a(亲和力,节点量)**:CR9114 家族、MAGMA-seq、Engelhart 三个亲和力数据集喂这里。
- **M(突变算子,边量)**:S5F 喂这里。

本轮把它们当四个独立资源处理,各保留**原始单位、原始列名、原始符号约定**,不强行对齐。

**非目标**:跨数据集 schema 统一;符号/单位归一(pKd 化);图(节点表+边表)的物化;HF 上传。这些都留到下一轮,基于本轮产出的真实 parquet 再设计。

## 现状

- **CR9114 / CR6261 已完成**:`cr9114/datasets/{cr9114,cr6261}/` 下已有 parquet,`cr9114/tests/explore_datasets.ipynb` 可展示。本轮**只核验**,不重做。
- **MAGMA-seq**:原始 supplementary 已下载到 `magma-seq/supp_raw/`(MOESM6_ESM.xlsx = 核心 per-variant Kd 表,6 sheet)。需补 `src/` + `datasets/` + ipynb。
- **Engelhart 2022**:未下载,需从 GitHub/Zenodo 取。
- **S5F**:未取,需从 SHazaM 的 `HH_S5F` 对象导出(唯一有取数风险者)。

## 目录布局

每个数据集自成一个 sibling 目录(与 org 镜像结构一致),内部统一照搬 `cr9114/` 已验证的模式。

```
OUROBOROS-AI4S/
├── cr9114/      # 已完成: src/ datasets/{cr9114,cr6261}/ tests/explore_datasets.ipynb
├── magma-seq/   # 数据在 supp_raw/; 补 src/ + datasets/magma_seq/ + tests/explore_magma.ipynb
├── engelhart/   # 新建: 下载 + src/ + datasets/ + tests/explore_engelhart.ipynb
└── s5f/         # 新建: 导出 + src/ + datasets/ + tests/explore_s5f.ipynb
```

每个目录内部:
- `src/` — 处理脚本(参照 cr9114 的 `schema.py` 配置常量 + `utils.py` build/validate 分工)
- `datasets/` — 原始文件 + 输出 parquet 子目录
- `tests/` — 展示 schema 的 ipynb(+ 可选 build 断言测试)

## 各数据集处理

### §1 CR9114 家族(已完成,仅核验)

不重做。本轮动作:跑一次 `cr9114/src/utils.py` 的 `validate`,确认两个 parquet 仍匹配 `schema.EXPECTED`(cr9114 65536 行、cr6261 2048 行,删失/缺失计数固化值)。确认 `tests/explore_datasets.ipynb` 能 load 并展示。已有,无新代码。

### §2 MAGMA-seq

**源**:`magma-seq/supp_raw/MOESM6_ESM.xlsx`(= Supplementary Data 4,per-variant Kd 表)。6 个 sheet:1 个 README sheet + 5 个数据 sheet(`all_barcodes_4A8_CC121`、`4A8_CC121_combined`、`all_barcodes_222-1C06`、`all_barcodes_319-345`、`topbinHA_rep2`)。

**输出**:`magma-seq/datasets/magma_seq/` 一个 parquet。每行 = 一个(抗体 × 变体 × 抗原)测量。

**列**(忠实照搬 MOESM6,仅清洗类型与列名):
- `antibody` — 母本抗体名(CR6261 / 4A8 / CC12.1 / 1G01 / 1G04 / 222-1C06 / 319-345 / Ab_2-7 / Ab_2-17 等,源 `Ab` 列)
- `variant` — 原始突变串,保留密码子(如 `Ab>VH:M59I-ATC;...|VL:...`,源 `Variant` 列,原样存)
- `antigen` — 抗原标签(S1 / HA / N2),由抗体→抗原映射固化常量填(见下)
- `Kd_nM` — 绝对解离常数(nM,源 `Kd`,原样,**越低越强**,不取对数不翻转)
- `Fmax`、`ddg`(kcal/mol,源 ddg/dg)、`ci_low` / `ci_high`(源 95% CI)、`n`、`avg_counts`、`success`(源 Success)、`source_sheet`(来自哪个 sheet,溯源用)

**抗体→抗原映射**(固化进 `src/schema.py` 常量,据 MAGMA 论文):S1 ↔ {4A8, CC12.1};HA ↔ {CR6261(stem), 222-1C06, 319-345, Ab_2-7, Ab_2-17};N2 ↔ {1G01, 1G04}。实现时以各 sheet 实际出现的抗体为准核对。

**注意**:`topbinHA_rep2` sheet 含多抗体混合(CR6261=388 变体等),需按行的 `Ab` 列拆分抗体身份,不能假设一个 sheet 一个抗体。

### §3 Engelhart 2022

**源**(需下载,本地无):GitHub `mit-ll/AlphaSeq_Antibody_Dataset` 的 `antibody_dataset_1`(亦有 Zenodo 10.5281/zenodo.7783546)。**许可 CC-BY-NC-SA 4.0 = 非商用**,在 `engelhart/README` 与本 spec 显著标注;鉴于用户 Click.mAb. 实习语境,此数据仅供方法研究,不得进入商用流程。

**输出**:`engelhart/datasets/engelhart/` 一个 parquet。每行 = 一个(scFv 变体 × assay × replicate)测量(replicate 为行,非列)。

**列**(忠实照搬 CSV):`POI`、`Sequence`(全长 scFv AA)、`HC`、`LC`、`CDRH1` `CDRH2` `CDRH3` `CDRL1` `CDRL2` `CDRL3`、`Target`(1 真实 SARS-CoV-2 抗原肽 + 3 阴性对照)、`Assay`(1/2)、`Replicate`(1/2/3)、`Pred_affinity`(**log10 Kd(nM),越低越强**,原样存,不翻转)。

**缺失编码未定**:71384/104972 变体才有 ≥1 个有效 `Pred_affinity`,缺失测量在 CSV 里的具体记号(空串 / NA / 缺行)未经核实——实现时第一步先下载真实 CSV、用 pandas 探明缺失记号,再决定如何在 parquet 中表示(保持原样或统一为 null,实现时确认)。

### §4 S5F(突变算子 M)

**源**(需导出,本地无):SHazaM R 包的 `HH_S5F` 对象(Yaari 2013)。这是四者中**唯一有取数风险**的。

**输出**:`s5f/datasets/s5f/` 一个 parquet。1024 行,每行 = 一个 5-mer(DNA,4^5=1024,非 5^5)。

**列**:`fivemer`(5 个核苷酸,中心碱基 = 被突变位)、`mutability`(该 5-mer 中心碱基被 SHM 靶向的概率,非归一标量)、`sub_A` `sub_C` `sub_G` `sub_T`(中心碱基突变为各碱基的概率,自身那项 = 0,三项非零)。

**取数路径(实现时按序尝试,记录实际所用)**:
1. R 环境直出:`library(shazam); write.csv(HH_S5F@...)` 导出 mutability + substitution 两张表后合并。
2. 无 R 时:找 SHazaM 包内随附的数据文件(`.rda` / `.tsv`)直接解析,或从 Immcantation 发布资源下载文本版。
3. 两条都不通则在 spec/README 记录为阻塞项并回报,不臆造数值。

## 数据流(每个数据集统一三段)

```
原始文件(csv/xlsx/R对象)
   └─[src 处理脚本: 读取 → 选列/改名/类型 → 派生列]→ daft/pandas DataFrame
        └─[validate: 行数/计数断言(有固化真值的)]→ 写 parquet
             └─ tests/explore_*.ipynb: read_parquet → info/head/describe/关键计数
```

工具沿用 cr9114 已验证栈:`daft`(已用)或 `pandas`+`pyarrow`。MAGMA/Engelhart 用 pandas+openpyxl 读、pyarrow 写即可,无需 daft。每个 `src/` 自带配置常量(抗原映射、列名、floor 等),与处理逻辑分离,照搬 cr9114 的 `schema.py`/`utils.py` 二分。

## 错误处理与边界

- **下载失败**(Engelhart/S5F):记录所尝试 URL/路径与失败原因,作为阻塞项回报,不静默跳过、不伪造数据。
- **缺失/删失记号**:每个数据集**保持原生表示**(MAGMA 的 Kd 检测限语义本轮不解读;Engelhart 缺失记号先探明再忠实保留;CR9114 已有的 null/censored 不变)。本轮不统一删失编码。
- **Windows 非法路径**:仅 magma-seq 仓库代码有(已用 sparse-checkout 处理过),数据文件无此问题。
- **中文输出乱码**:ipynb 内 print 用 utf-8;不在 CLI 用 GBK 管道抽取。

## 测试

- 有固化真值者(CR9114 家族)`validate` 断言行数/删失/缺失计数。
- MAGMA/Engelhart/S5F 无外部真值,测试 = 结构断言:行数在预期量级(S5F=1024;Engelhart scFv 数与论文一致量级;MAGMA 各 sheet 变体数)、关键列非全空、dtype 正确、抗体/抗原取值落在已知集合内。
- 每个 ipynb 跑通即为人工核验闸:能 load、能展示、数字眼检合理。

## 待解风险(实现时正面处理,不臆造)

1. **S5F 取数**:R 环境可用性未知。按 §4 三条路径依次尝试,失败则回报阻塞。
2. **Engelhart 缺失记号**:CSV 实际缺失 token 未核实,下载后第一步探明。
3. **Engelhart CSV 确切文件名/路径**:repo 树未列全,下载时确认。
4. **MAGMA 抗体→抗原映射**:以各 sheet 实际 `Ab` 列取值为准核对固化映射,发现不符则修正常量。

## 范围边界(本轮明确不做)

跨数据集统一 schema;符号/单位归一(pKd);图(节点+边)物化;HF 上传;CR9114 重做。这些待本轮四个真实 parquet 产出后,下一轮基于实物再设计。

