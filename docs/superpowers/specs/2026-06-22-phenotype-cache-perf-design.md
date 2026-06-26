
## 2. 必须保全的契约(锁定于 design.md + 测试)

任何重写必须**逐字**保全以下语义(否则污染 ground truth):

1. **表型 = 序列的固定函数(design.md 红线 1.3,L74):** `phenotype(sequence)` 是序列的纯函数,不读 world-state / 邻居 / tick(registry.py L56-58,v1 κ=0)。重建策略**绝不可**改变任一字段的值。
2. **结构性 faction-blind(design.md L30/L32):** `phe[sid]` gather 路径任何 kernel 中禁出现 faction 索引。`faction` 在 `phenotype_cache.py` / `phenotype()` 中根本不出现 —— 重写不得触碰 sid↔faction 正交。
3. **输出契约字节级不变:** `phenotype_arrays` 返回 10 个张量的 dict,key = `f / p_leave / z_raw / p_x / prey_mask / feature_mask / period / dir_bits / repro_period / anta_period`,各 shape `[n]`、各自 dtype、在 `device` 上。kernel 经 `phe[sid]` 只读 gather。**key / dtype / shape / 每行语义 / 第 0 行哨兵值全部不变**(哨兵行:period/repro_period/anta_period = 1,其余 = 0 —— 见 phenotype_cache.py L55-60)。
4. **确定性:** 不引入新 RNG、不改变任何掷点、不引入会破坏跨种子复现的 device-sync。

**设计审计裁定(subagent):** 重建策略**不是** design 对象 —— design 只约束表型的**值**(序列纯函数 + 结构 faction-blind),对"缓存怎么建"完全沉默(循环 vs 向量化 vs 增量追加纯属实现细节)。两个候选方案对 design 均 CLEAN。

## 3. 方案对比(3 路 subagent 已审)

### 方案 B — 向量化全量重建(每字段一发 `torch.tensor`)【推荐,ponytail 选定】

**核心:** 仍每 tick 重建全部 n 行,但消掉逐元素同步:CPU 侧 python list comprehension 攒齐一整列,再**一发** `torch.tensor(list, dtype=…, device=…)` 灌进 GPU。10 字段 = 10 发 H2D 拷贝,而非 10n 发标量写。

```python
def phenotype_arrays(self, device):
    if not self._arrays_dirty and self._cached_device == device and self._cached_arrays is not None:
        return self._cached_arrays
    rows = self._id_to_phe                       # rows[0] = None 哨兵
    def col(field, default, dtype):
        vals = [default] + [getattr(p, field) for p in rows[1:]]
        return torch.tensor(vals, dtype=dtype, device=device)
    result = {
        "f": col("f", 0.0, torch.float32), "p_leave": col("p_leave", 0.0, torch.float32),
        "z_raw": col("z_raw", 0.0, torch.float32), "p_x": col("p_x", 0.0, torch.float32),
        "prey_mask": col("prey_mask", 0, torch.int64), "feature_mask": col("feature_mask", 0, torch.int64),
        "period": col("period", 1, torch.int64), "dir_bits": col("dir_bits", 0, torch.int64),
        "repro_period": col("repro_period", 1, torch.int64), "anta_period": col("anta_period", 1, torch.int64),
    }
    self._cached_arrays = result; self._cached_device = device; self._arrays_dirty = False
    return result
```

- **成本:** ~1080ms/tick → ~10-20ms/tick(n=万级),稳稳低于 arb 的 123ms 地板,跑批可行。每 tick = 一个 list-comp + 一次 H2D 拷贝;**不重算 `phenotype()`**(对象早 mint 在 `_id_to_phe`)。
- **复杂度:** O(n) python/tick;整跑 O(T·N)。128² 下每 tick 重拷只占整批墙钟 ~2-3%(GPU kernel 本体 ~220s,B 的开销几秒)。
- **风险:** 零别名(每次返回**全新**张量,与现状一致);零新依赖;字节级等价。
- **设计审计:** CLEAN。**ponytail:** 选定(理由见下)。

### 方案 A — 增量追加(常驻 buffer + 容量翻倍)【淘汰】

维护常驻 GPU 数组,只追加自上次以来 mint 的新 strain 行,返回 `[:n]` 切片。理论整跑 O(N_final),sub-ms/tick,可扩到 512²。

**淘汰理由(ponytail 三条):**
1. **A 在优化已推迟的场景。** A 唯一真优势(总拷贝量省)只在 512² 咬人;当前 128²/T=450,B 的开销才整批 ~2-3%。为省这点提前上常驻 buffer + 容量翻倍 + 扩容重分配 = YAGNI(ladder 第 1 级:推测性需求,跳过)。
2. **别名隐患是判死点。** A 返回指向同一可变 buffer 的**视图**;现状返回**全新张量**,kernel 手滑就地写也污染不了。A 一旦被 `phe["f"] *= …` 之类写到,就跨 tick 静默污染数据,且所有 shape/dtype 检查查不出。为 2% 提速埋数据污染雷 —— 本项目最怕的"看着合理、悄悄污染 ground truth"。
3. **"B 偷偷浪费"是反的。** B 不重算 `phenotype()`,只重读属性 + 重拷 [n] 数组,没有偷偷的真功要省。

### 决议

**采用方案 B。** 三路独立:性能工程师推 A 但承认 B 是"可接受的最小改动 fallback"且两者都把 phe 开销压到远低于 123ms;设计审计判 A/B 均 CLEAN;ponytail 判 B 并以"别名数据污染雷 + 给推迟场景提前造机器"反驳 A。B 是唯一同时满足"解决当前可行性 + 零污染风险 + 最小改动 + 不碰 design 红线"的方案。512² 的 A 留注释推迟。

## 4. 实现范围

**只改一处:** `src/des/phenotype_cache.py` 的 `StrainTable.phenotype_arrays` 方法体(L44-83 的 python 标量循环换成 §3 的向量化列构建)。

- `StrainTable` 其余方法(`get_or_mint` / `sequence_of` / `phenotype_of` / `__len__` / dirty-flag 缓存机制)**不动**。
- `Engine._refresh_phe` 调用点、调用契约**不动** —— 同样的 dict、同样的 key/dtype/shape。
- 引擎其它部分、kernels、reproduction、antagonism、arbitration、recorder、world、registry **全部不动**(引擎冻结纪律)。
- 留一行注释:`# ponytail: 全量重建,O(T·N) 重拷。到 512² 若 profiler 说它真疼,再升级成增量追加(方案 A)。`

## 5. 验证策略

### 5.1 强制 de-risk 闸门(字节级等价证明)

新增一个等价测试(`tests/test_phenotype_arrays.py`):对一张小 strain 表(含若干 BB0 突变后代),断言向量化输出与**逐字段闭式期望值**(对每个 sid 取 `table.phenotype_of(sid).<field>` 拼成的参考列;旧标量循环此时已删除,故参考值独立构造而非调已删代码)**逐元素相等**,含:
- 10 个字段全部 `torch.equal`(值 + dtype 一致)。
- 第 0 行哨兵:`period/repro_period/anta_period == 1`,其余字段 `== 0`。
- shape `[n]` 对每字段一致。

**理由:** 这是静默污染数据的路径(本项目被 B1/B2/B3 烧过)。等价测试过 = 证明 B 字节级等价于现有正确实现,可直接发。**强制非可选**,作为永久回归守卫留下。

### 5.2 既有测试套(必须全绿)

全套件(99 测试,含仲裁矩闸门 + 性能优化轮新增)在 `-W error` 下零 warning、零回归。

### 5.3 性能验收

修 `run_batch.py` 的 phase_probe 计时桶 bug(把 `_refresh_phe()` 移出 arb 计时,单列一个 `phe` 桶),复跑 `--phase-probe`;确认 phe 桶从 ~1080ms 降到 ≲20ms 量级,arb 仍 ≤123ms。然后小步 `--probe` 估整批墙钟回到可行区间。

### 5.4 环境(铁律)

- 解释器 **`D:/anaconda3/envs/basic/python.exe`**(torch 2.10+cu128 / CUDA True / RTX 5080);裸 `python` 是另一个 cpu-only torch,**永远用显式 basic 路径**。
- imports 经 `PYTHONPATH=src`,repo root 运行;**不 pip/conda install**。

## 6. YAGNI / 显式排除

- **不**做增量追加 / 常驻 buffer / 容量翻倍(方案 A)—— 512² 时再单独处理,留注释标明升级路径。
- **不**改任何表型值、字段、缓存失效逻辑(dirty flag)、调用契约。
- **不**碰 registry 的 `phenotype()` 纯函数。
- **不**做泛化或可配置化 —— 只换 `phenotype_arrays` 的数组构建方式。

## 7. 风险

**头号风险:** 向量化列构建若某字段 default 值 / dtype 写错,会产生看似合理但错误的哨兵行或类型(静默污染)。**最便宜的 de-risk = §5.1 的字节级等价闸门**(对小表逐元素比对旧实现,30 行换一个完整周期的代价)。

## 8. 杂项

- `scripts/diag_arb_sections.py` / `scripts/diag_arb_curve.py`(本轮诊断产物,untracked)— 实现轮决定保留(归入诊断工具)还是删除。
- `run_batch.py` phase_probe 计时桶 bug 的修复纳入本轮 §5.3(小、纯诊断脚本、不碰引擎)。
