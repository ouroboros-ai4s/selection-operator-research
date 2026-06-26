# 三线推进 Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `G:\OUROBOROS-AI4S\presentation\three-track-progress\` 建一个 Astro 5.x 静态站,12 页技术 wiki blog 长文(scrollable,左右键 + 触底再滚切页),介绍 OUROBOROS-AI4S 三条研究线(DES / selop-v3 / σ 反演)。

**Architecture:** Astro 5.x + MDX content collection + 单一动态路由 `[slug].astro` 共享 `Chapter.astro` 布局;`astro-rehype-mermaid` + `remark-math/rehype-katex` 构建期渲完图与公式,零运行时;只一份客户端 `nav.ts` 处理键盘/滚轮/触屏翻页与 ViewTransitions。

**Tech Stack:** Astro 5.x · `@astrojs/mdx` · `astro-rehype-mermaid` · `remark-math` · `rehype-katex` · `katex`(CSS)· Shiki(Astro 内置)· 纯 CSS(无 Tailwind)

## Global Constraints

以下条款逐字源自 spec,每个任务的需求隐式包含本节。

- **目录:** 全站根 = `G:\OUROBOROS-AI4S\presentation\three-track-progress\`,与 `digital-evolution-sandbox/` 平级。
- **Astro 版本:** 5.x。
- **输出模式:** `output: 'static'`(纯静态,无 SSR)。
- **MDX 内容路径:** `src/content/pages/NN-slug.mdx`(NN = 01..12,顺序固定)。
- **布局:** 单一 `Chapter.astro`,所有 12 页共用。
- **路由:** `src/pages/[slug].astro` 一个动态路由 + `src/pages/index.astro` 重定向到 `/01-overview`。
- **配色:** Monet 睡莲 5 色,**不引入第六色**:
  ```css
  --c1:#6B8E9B; --c2:#89A894; --c3:#A6C0B5; --c4:#C3B1BD; --c5:#D8A4CA;
  ```
- **主题:** academic-dark 单主题,背景 `#0a0a0f`,不做亮/暗切换。
- **正文最大宽度:** `800px` 居中。
- **侧栏宽:** 桌面 `240px`;`< 1024px` 折汉堡。
- **进度条:** 顶部 `3px`,色 `--c1`,反映当前页内滚动比例(非 12 页全局)。
- **翻页输入:** `←` / `→` 任何时候可用;`Home` / `End` 跳首末;触底后**再触发一次** `wheel` 跳下一页;触屏左/右滑翻页。
- **触底判定:** `scrollTop + clientHeight >= scrollHeight - 4`。
- **触底再滚静默期:** 判定后 ≥ 100ms 才接受下一次 `wheel`。
- **路由切换:** Astro `<ClientRouter />`(ViewTransitions API)。
- **图示:** Mermaid `flowchart` / `stateDiagram` / `sequenceDiagram` / `block-beta`;少数表达不出的手写 SVG。
- **公式:** KaTeX,行内 `$...$`,块级 `$$...$$`,构建期渲完。
- **代码块:** Shiki,主题 `github-dark-default`。
- **中文字体链:** `'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif`。
- **等宽字体链:** `'Fira Code', 'Cascadia Code', Consolas, monospace`。
- **术语处理:** 行业通用术语首次出现就近补注一句;后续不再注。
- **自创概念处理:** R_irr / FalsificationLedger / 诚实骨架 / 红皇后混战 / Φ 算子零空间 / 北极星 A+D / 三非循环铁律 等首次使用必须先解释一段。
- **内容真源:** 写正文时**必须从 `G:\OUROBOROS-AI4S\context\` 与 `G:\OUROBOROS-AI4S\digital-evolution-sandbox\context\` 取细节**,CLAUDE.md 只做骨架对照;两者冲突以 context 文件为准。
- **总字数估算:** ~16,800 字;膨胀阈值 25k 字,超过则停下重审密度。
- **每页默认密度:** 800-1500 字。
- **运行时 JS 目标:** ≤ 5KB(只放 `nav.ts` 编译产物)。
- **不做:** Tailwind / `<Term>` / `<Concept>` 组件 / 术语字典 / hover 浮层 / 部署 / `@media print` / 术语表页 / 参考文献页 / 亮主题。

## Task Index

- T1 — Astro 项目脚手架与依赖
- T2 — `astro.config.mjs` + content collection schema
- T3 — `global.css`(Monet 5 色 + reset + base typography)
- T4 — `Chapter.astro` + `Sidebar.astro` + `ProgressBar.astro` + `PageNav.astro`
- T5 — `nav.ts`(键盘 + 触底再滚 + 触屏)+ `[slug].astro` + `index.astro`
- T6 — P1 三线树形结构 MDX
- T7 — P2 DES 是什么 + 已建成 MDX
- T8 — P3 DES 核心机制 MDX
- T9 — P4 DES 9-spec 路线图 MDX
- T10 — P5 f=σ∘φ∘a 详解 MDX
- T11 — P6 selop-v3 诚实骨架 MDX
- T12 — P7 引擎 6 决议 + A/B + 7 约束 MDX
- T13 — P8 问题 A + HARD-GATE MDX
- T14 — P9 σ 数学骨架 MDX
- T15 — P10 σ Stage 1-4 MDX
- T16 — P11 σ Stage 5-7 MDX
- T17 — P12 Ledger + C5 + 数据 + 下一步 MDX
- T18 — 构建 + 12 页人工清单 + 终态提交

---

### Task 1: Astro 项目脚手架与依赖

**Files:**
- Create: `presentation/three-track-progress/package.json`
- Create: `presentation/three-track-progress/.gitignore`
- Create: `presentation/three-track-progress/tsconfig.json`
- Create: `presentation/three-track-progress/public/favicon.svg`

**Interfaces:**
- Consumes: 无(根任务)
- Produces: 可跑 `npm install` 与 `npm run dev`(虽然此时还没内容,但脚手架与依赖锁定)

- [ ] **Step 1: 在 OUROBOROS-AI4S 根下建目录**

Run(PowerShell):
```powershell
New-Item -ItemType Directory -Path 'G:\OUROBOROS-AI4S\presentation\three-track-progress\public' -Force
```

Expected: 目录创建成功,无报错。

- [ ] **Step 2: 写 `package.json`**

文件:`presentation/three-track-progress/package.json`

```json
{
  "name": "three-track-progress",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "astro-rehype-mermaid": "^1.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0",
    "katex": "^0.16.0"
  }
}
```

ponytail:版本范围用 `^`,以装包时拿到最新兼容版;若 `astro-rehype-mermaid` 与 Astro 5 起冲突,见 R3 减缓(回退运行时 mermaid.js)。

- [ ] **Step 3: 写 `.gitignore`**

文件:`presentation/three-track-progress/.gitignore`

```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 4: 写 `tsconfig.json`**

文件:`presentation/three-track-progress/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", ".astro/types.d.ts"]
}
```

- [ ] **Step 5: 写 `public/favicon.svg`**

文件:`presentation/three-track-progress/public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#6B8E9B"/><circle cx="16" cy="16" r="6" fill="#D8A4CA"/></svg>
```

- [ ] **Step 6: 装依赖**

Run(在 `presentation/three-track-progress/` 内):
```powershell
npm install
```

Expected: 无 error;`node_modules/` 与 `package-lock.json` 出现。warning 可忽略。

- [ ] **Step 7: 冒烟 dev 不报错(此时无 src 内容会报缺路由,接受)**

Run:
```powershell
npm run dev
```

Expected: 起得来 Astro 服务,可能因无 `src/pages/` 报 404 提示,**只要进程没崩**就过。`Ctrl+C` 停。

- [ ] **Step 8: 提交**

Run(在 OUROBOROS-AI4S 根):
```powershell
git add presentation/three-track-progress/package.json presentation/three-track-progress/.gitignore presentation/three-track-progress/tsconfig.json presentation/three-track-progress/public/favicon.svg
git commit -m "feat(presentation): scaffold Astro project for three-track-progress"
```

---

### Task 2: `astro.config.mjs` + content collection schema

**Files:**
- Create: `presentation/three-track-progress/astro.config.mjs`
- Create: `presentation/three-track-progress/src/content/config.ts`
- Create: `presentation/three-track-progress/src/content/pages/.gitkeep`(占位防空目录)

**Interfaces:**
- Consumes: T1 装好的依赖
- Produces:
  - `getCollection('pages')` 返回 `{ slug, data: { order, title, chapter } }[]`
  - Mermaid / KaTeX / MDX 全可在 MDX 里直接用

- [ ] **Step 1: 写 `astro.config.mjs`**

文件:`presentation/three-track-progress/astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeMermaid from 'astro-rehype-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMermaid, rehypeKatex],
    shikiConfig: {
      theme: 'github-dark-default'
    }
  }
});
```

ponytail:不开 `wrap`、不开 `langs` 白名单——Shiki 默认带绝大多数语言,真用到再加。

- [ ] **Step 2: 写 `src/content/config.ts`**

文件:`presentation/three-track-progress/src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number().int().min(1).max(12),
    title: z.string(),
    chapter: z.enum(['ch1', 'ch2', 'ch3', 'ch4', 'ch5'])
  })
});

export const collections = { pages };
```

注意:`order` 用 1..12,**用于排序**;`chapter` 用于侧栏分组。

- [ ] **Step 3: 占位 `.gitkeep`**

文件:`presentation/three-track-progress/src/content/pages/.gitkeep`(空文件)

- [ ] **Step 4: 构建冒烟**

Run:
```powershell
npm run build
```

Expected: 报「Collection "pages" is empty」或类似提示但**不抛 syntax / 模块加载错**就过。若插件版本不兼容,记下报错,按 R3 减缓(临时移 `rehypeMermaid` 出 `rehypePlugins`,留 `remark-math`+`rehype-katex`)。

- [ ] **Step 5: 提交**

```powershell
git add presentation/three-track-progress/astro.config.mjs presentation/three-track-progress/src/content/config.ts presentation/three-track-progress/src/content/pages/.gitkeep
git commit -m "feat(presentation): astro config + pages collection schema"
```

---

### Task 3: `global.css`(Monet 5 色 + reset + base typography)

**Files:**
- Create: `presentation/three-track-progress/src/styles/global.css`

**Interfaces:**
- Consumes: 无
- Produces: 全站 CSS 变量(`--c1..--c5` / `--bg` / `--text` / `--font-sans` / `--font-mono`);布局类 `.layout`(grid)/ `.sidebar` / `.article` / `.page-nav` / `.progress-bar` 的基础样式。

- [ ] **Step 1: 写 `global.css`**

文件:`presentation/three-track-progress/src/styles/global.css`

```css
:root {
  --c1: #6B8E9B;
  --c2: #89A894;
  --c3: #A6C0B5;
  --c4: #C3B1BD;
  --c5: #D8A4CA;
  --bg: #0a0a0f;
  --text: #e8e8e8;
  --muted: #9a9aa6;
  --border: rgba(166, 192, 181, 0.18);
  --code-bg: rgba(195, 177, 189, 0.08);
  --font-sans: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Cascadia Code', Consolas, monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-sans); line-height: 1.75; }

a { color: var(--c1); text-decoration: none; border-bottom: 1px dashed var(--c3); }
a:hover { color: var(--c2); border-bottom-color: var(--c2); }

h1 { font-size: 2.2rem; line-height: 1.25; margin: 0 0 1.2rem; color: var(--text); }
h2 { font-size: 1.55rem; line-height: 1.3; margin: 2.2rem 0 1rem; color: var(--c1); border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; }
h3 { font-size: 1.2rem; margin: 1.6rem 0 0.6rem; color: var(--c2); }

p { margin: 0 0 1rem; }
ul, ol { margin: 0 0 1rem 1.4rem; }
li { margin-bottom: 0.4rem; }
strong { color: var(--c5); }
em { color: var(--c2); font-style: normal; }

blockquote { margin: 1.2rem 0; padding: 0.8rem 1.2rem; border-left: 3px solid var(--c4); background: rgba(195, 177, 189, 0.05); color: var(--muted); }

code { font-family: var(--font-mono); font-size: 0.92em; padding: 0.1em 0.35em; background: var(--code-bg); border-radius: 3px; color: var(--c3); }
pre { margin: 1.2rem 0; padding: 1rem 1.2rem; background: rgba(20, 20, 28, 0.7); border-radius: 6px; overflow-x: auto; }
pre code { padding: 0; background: none; color: inherit; }

/* KaTeX inline contrast */
.katex { color: var(--text); }
.katex-display { margin: 1.2rem 0; overflow-x: auto; }

/* Mermaid SVG fit */
.mermaid, svg.mermaid { display: block; max-width: 100%; height: auto; margin: 1.2rem auto; }
.mermaid-wrap { overflow-x: auto; margin: 1.2rem 0; }

/* Layout shell */
.layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.sidebar { border-right: 1px solid var(--border); padding: 1.5rem 1rem; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.article-wrap { display: flex; flex-direction: column; min-height: 100vh; }
.article { flex: 1; max-width: 800px; width: 100%; margin: 0 auto; padding: 3rem 2rem 2rem; overflow-y: auto; }
.page-nav { border-top: 1px solid var(--border); padding: 1rem 2rem; max-width: 800px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
.page-nav .prev, .page-nav .next { color: var(--muted); }
.page-nav .next.ready { color: var(--c5); font-weight: 600; }
.page-nav .hint { color: var(--c2); font-size: 0.85rem; }

/* Progress bar */
.progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--c1); width: 0; z-index: 9999; transition: width 0.1s linear; }

/* Sidebar items */
.sidebar h4 { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 1rem 0 0.4rem; }
.sidebar a { display: block; padding: 0.35rem 0.6rem; border-radius: 4px; border-bottom: none; color: var(--text); font-size: 0.93rem; }
.sidebar a:hover { background: rgba(107, 142, 155, 0.12); }
.sidebar a.current { color: var(--c5); font-weight: 600; background: rgba(216, 164, 202, 0.08); }
.sidebar a.current::before { content: '● '; color: var(--c5); }

/* Mobile */
@media (max-width: 1023px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: fixed; top: 0; left: 0; right: 0; height: auto; max-height: 70vh; transform: translateY(-100%); transition: transform 0.25s; z-index: 1000; background: var(--bg); }
  .sidebar.open { transform: translateY(0); }
  .article { padding: 2rem 1rem 1rem; }
  .menu-toggle { display: block; position: fixed; top: 0.6rem; left: 0.6rem; z-index: 1001; background: var(--c1); color: var(--bg); border: 0; padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.9rem; }
}
@media (min-width: 1024px) {
  .menu-toggle { display: none; }
}
```

ponytail:不拆 `prose.css`,一文件搞定;`@import` KaTeX CSS 在 layout 里直接引,不在这里。

- [ ] **Step 2: 提交**

```powershell
git add presentation/three-track-progress/src/styles/global.css
git commit -m "feat(presentation): global.css with Monet 5-color palette + base layout"
```

---

### Task 4: 布局与子组件(`Chapter.astro` + `Sidebar.astro` + `ProgressBar.astro` + `PageNav.astro`)

**Files:**
- Create: `presentation/three-track-progress/src/layouts/Chapter.astro`
- Create: `presentation/three-track-progress/src/components/Sidebar.astro`
- Create: `presentation/three-track-progress/src/components/ProgressBar.astro`
- Create: `presentation/three-track-progress/src/components/PageNav.astro`

**Interfaces:**
- Consumes:
  - `global.css` 全局样式
  - `getCollection('pages')` 排序后的 12 项
- Produces:
  - `<Chapter title order chapter prevSlug prevTitle nextSlug nextTitle>` 包裹 MDX 内容,负责渲染壳 + 引入 ViewTransitions + 引入 `nav.ts`
  - 子组件分别渲染左栏、进度条、页底翻页脚
- 命名约定:`pages` 集合按 `order` 升序排序;`prevSlug` / `nextSlug` 在首/末分别为 `null`

- [ ] **Step 1: `ProgressBar.astro`**

文件:`presentation/three-track-progress/src/components/ProgressBar.astro`

```astro
---
// 当前页内滚动比例进度条;由 nav.ts 的滚动监听写宽度
---
<div id="progress-bar" class="progress-bar"></div>
```

- [ ] **Step 2: `Sidebar.astro`**

文件:`presentation/three-track-progress/src/components/Sidebar.astro`

```astro
---
import { getCollection } from 'astro:content';
const { currentSlug } = Astro.props as { currentSlug: string };
const all = (await getCollection('pages')).sort((a, b) => a.data.order - b.data.order);
const chapters: Record<string, { label: string; items: typeof all }> = {
  ch1: { label: 'Ch.1 项目全景', items: [] },
  ch2: { label: 'Ch.2 DES 沙盒', items: [] },
  ch3: { label: 'Ch.3 选择算子框架', items: [] },
  ch4: { label: 'Ch.4 selop-v3 (φ)', items: [] },
  ch5: { label: 'Ch.5 σ 反演', items: [] }
};
for (const p of all) chapters[p.data.chapter].items.push(p);
---
<aside class="sidebar" id="sidebar">
  {Object.entries(chapters).map(([key, ch]) => (
    <section>
      <h4>{ch.label}</h4>
      {ch.items.map(p => (
        <a href={`/${p.slug}`} class={p.slug === currentSlug ? 'current' : ''}>
          P{p.data.order}. {p.data.title}
        </a>
      ))}
    </section>
  ))}
</aside>
```

注:`current` 高亮用纯 CSS(`global.css` 已写)。

- [ ] **Step 3: `PageNav.astro`**

文件:`presentation/three-track-progress/src/components/PageNav.astro`

```astro
---
const { prevSlug, prevTitle, nextSlug, nextTitle } = Astro.props as {
  prevSlug: string | null;
  prevTitle: string | null;
  nextSlug: string | null;
  nextTitle: string | null;
};
---
<footer class="page-nav" id="page-nav"
  data-prev={prevSlug ?? ''}
  data-next={nextSlug ?? ''}>
  <span class="prev">
    {prevSlug ? <a href={`/${prevSlug}`}>← {prevTitle}</a> : <span>—</span>}
  </span>
  <span class="hint" id="bottom-hint" hidden>继续下滚进入 ↓</span>
  <span class="next" id="next-link">
    {nextSlug ? <a href={`/${nextSlug}`}>{nextTitle} →</a> : <span>—</span>}
  </span>
</footer>
```

- [ ] **Step 4: `Chapter.astro` 主布局**

文件:`presentation/three-track-progress/src/layouts/Chapter.astro`

```astro
---
import 'katex/dist/katex.min.css';
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';
import Sidebar from '../components/Sidebar.astro';
import ProgressBar from '../components/ProgressBar.astro';
import PageNav from '../components/PageNav.astro';

const { title, slug, prevSlug, prevTitle, nextSlug, nextTitle } = Astro.props;
---
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} | 三线推进</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <ClientRouter />
</head>
<body>
  <ProgressBar />
  <button class="menu-toggle" id="menu-toggle" aria-label="菜单">☰</button>
  <div class="layout">
    <Sidebar currentSlug={slug} />
    <div class="article-wrap">
      <main class="article" id="article">
        <slot />
      </main>
      <PageNav
        prevSlug={prevSlug}
        prevTitle={prevTitle}
        nextSlug={nextSlug}
        nextTitle={nextTitle}
      />
    </div>
  </div>
  <script src="../scripts/nav.ts"></script>
</body>
</html>
```

注:`<ClientRouter />` 让翻页走 ViewTransitions;`<script>` 引 `nav.ts`,Astro 默认编译/打包它。

- [ ] **Step 5: 构建冒烟**

Run:
```powershell
npm run build
```

Expected: 报「无内容」或路由空,但不报 TS / 模板语法错;若 `import 'katex/dist/katex.min.css'` 报模块找不到,确认 T1 的 `katex` 已装。

- [ ] **Step 6: 提交**

```powershell
git add presentation/three-track-progress/src/layouts presentation/three-track-progress/src/components
git commit -m "feat(presentation): Chapter layout + sidebar + page nav + progress bar"
```

---

### Task 5: `nav.ts` 客户端交互 + `[slug].astro` 动态路由 + `index.astro` 重定向

**Files:**
- Create: `presentation/three-track-progress/src/scripts/nav.ts`
- Create: `presentation/three-track-progress/src/pages/[slug].astro`
- Create: `presentation/three-track-progress/src/pages/index.astro`

**Interfaces:**
- Consumes:
  - `Chapter.astro` 布局(由动态路由套用)
  - `getCollection('pages')`(动态路由列出 12 路径并算 prev/next)
  - DOM 元素 id:`#progress-bar` / `#article` / `#page-nav` / `#next-link` / `#bottom-hint` / `#menu-toggle` / `#sidebar`
- Produces:
  - 12 个静态路由 `/01-overview` … `/12-sigma-ledger`
  - `/` 重定向到 `/01-overview`
  - 翻页交互:`←` / `→` / `Home` / `End` / 触底再滚 / 触屏左右滑 / 汉堡

- [ ] **Step 1: 写 `src/scripts/nav.ts`**

文件:`presentation/three-track-progress/src/scripts/nav.ts`

```ts
function init() {
  const article = document.getElementById('article');
  const bar = document.getElementById('progress-bar');
  const nav = document.getElementById('page-nav');
  const nextLink = document.getElementById('next-link');
  const hint = document.getElementById('bottom-hint');
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');

  if (!article || !nav) return;

  const prevSlug = nav.dataset.prev || '';
  const nextSlug = nav.dataset.next || '';
  let atBottom = false;
  let lastBottomTouch = 0;

  function go(slug: string) {
    if (!slug) return;
    window.location.href = `/${slug}`;
  }

  function update() {
    const h = article!.scrollHeight - article!.clientHeight;
    const ratio = h > 0 ? article!.scrollTop / h : 0;
    if (bar) bar.style.width = `${Math.min(100, ratio * 100)}%`;
    const bottom = article!.scrollTop + article!.clientHeight >= article!.scrollHeight - 4;
    if (bottom !== atBottom) {
      atBottom = bottom;
      if (atBottom) {
        lastBottomTouch = performance.now();
        nextLink?.classList.add('ready');
        hint?.removeAttribute('hidden');
      } else {
        nextLink?.classList.remove('ready');
        hint?.setAttribute('hidden', '');
      }
    }
  }

  article.addEventListener('scroll', update, { passive: true });
  update();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(nextSlug); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(prevSlug); }
    else if (e.key === 'Home') { e.preventDefault(); window.location.href = '/01-overview'; }
    else if (e.key === 'End') { e.preventDefault(); window.location.href = '/12-sigma-ledger'; }
    else if (e.key === 'Escape') { sidebar?.classList.remove('open'); }
  });

  article.addEventListener('wheel', (e) => {
    if (!atBottom) return;
    if (e.deltaY <= 0) return;
    if (performance.now() - lastBottomTouch < 100) return;
    e.preventDefault();
    go(nextSlug);
  }, { passive: false });

  let touchX = 0;
  let touchY = 0;
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchX = t.clientX; touchY = t.clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) go(nextSlug); else go(prevSlug);
    }
  }, { passive: true });

  toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
}

document.addEventListener('astro:page-load', init);
```

ponytail:不抽 helper、不拆模块,一文件 < 80 行;`astro:page-load` 让 ViewTransitions 切页后重新绑定。

- [ ] **Step 2: 写 `src/pages/[slug].astro`**

文件:`presentation/three-track-progress/src/pages/[slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import Chapter from '../layouts/Chapter.astro';

export async function getStaticPaths() {
  const all = (await getCollection('pages')).sort((a, b) => a.data.order - b.data.order);
  return all.map((entry, i) => ({
    params: { slug: entry.slug },
    props: {
      entry,
      prev: i > 0 ? all[i - 1] : null,
      next: i < all.length - 1 ? all[i + 1] : null
    }
  }));
}

const { entry, prev, next } = Astro.props;
const { Content } = await entry.render();
---
<Chapter
  title={entry.data.title}
  slug={entry.slug}
  prevSlug={prev?.slug ?? null}
  prevTitle={prev ? `P${prev.data.order}. ${prev.data.title}` : null}
  nextSlug={next?.slug ?? null}
  nextTitle={next ? `P${next.data.order}. ${next.data.title}` : null}
>
  <Content />
</Chapter>
```

- [ ] **Step 3: 写 `src/pages/index.astro` 重定向**

文件:`presentation/three-track-progress/src/pages/index.astro`

```astro
---
return Astro.redirect('/01-overview');
---
```

- [ ] **Step 4: 临时占位 MDX 让构建过**

文件:`presentation/three-track-progress/src/content/pages/01-overview.mdx`

```mdx
---
order: 1
title: 三线树形结构
chapter: ch1
---

# 三线树形结构

(占位,T6 替换)
```

- [ ] **Step 5: 构建冒烟**

Run:
```powershell
npm run build
```

Expected: 生成 `dist/01-overview/index.html` + `dist/index.html`(重定向到 `/01-overview`);构建无错。

- [ ] **Step 6: 本地预览**

Run:
```powershell
npm run preview
```

打开 `http://localhost:4321/`,确认自动跳 `/01-overview`,看到「(占位,T6 替换)」字样。按 `→` 不该跳(还没下一页)。`Ctrl+C` 停。

- [ ] **Step 7: 提交**

```powershell
git add presentation/three-track-progress/src/scripts presentation/three-track-progress/src/pages presentation/three-track-progress/src/content/pages/01-overview.mdx
git commit -m "feat(presentation): dynamic [slug] route + nav.ts (keyboard/wheel/touch)"
```

---

### Task 6: P1 三线树形结构 MDX

**Files:**
- Create / 覆盖: `presentation/three-track-progress/src/content/pages/01-overview.mdx`

**Interfaces:**
- Consumes: T5 的路由 + T4 的布局;Sidebar 会读 `chapter: ch1`
- Produces: `/01-overview` 可访问,Mermaid 树形图渲出,自创概念已解释

**真源 context 文件(必读后落笔):**
- `G:\OUROBOROS-AI4S\CLAUDE.md`(树形图 + 三线关系段)
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\` 任一引用「兄弟分支」「元发现」的文件
- `G:\OUROBOROS-AI4S\context\sigma-inversion-INDEX.md`

**必出现元素清单(写作时逐项打勾):**

- frontmatter `order: 1` / `title: 三线树形结构` / `chapter: ch1`
- H1 标题
- 「树形定位」段:点明 root = `f = σ ∘ φ ∘ a`(KaTeX 行内 `$f = \sigma \circ \varphi \circ a$`)
- **首次出现的自创概念解释:** `R_irr`(残余不可约空间)+ `兄弟分支 / 树外独立线` + `元发现`(三者各一段)
- **首次出现的术语注:** SHM / DMS / 生发中心 / Evo-PU(出现时就近括号一句)
- **Mermaid 树形图**(改写自 CLAUDE.md 顶部):

  ` ```mermaid `
  ` graph TD `
  `     Root["f = σ ∘ φ ∘ a (锚定对象)"] `
  `     Root --> Selop["selop-v3 — 正面推 φ"] `
  `     Root --> Sigma["σ 反演 — 正面推 σ + 副产 p_a"] `
  `     Root -.->|"a_invivo 归 R_irr"| AIrr["(a)"] `
  `     DES["Digital Evolution Sandbox (树外独立线·纯数据记录器)"] `
  ` ``` `
- **`block-beta` 三线职责对照矩阵**(三栏:支线 / 推什么 / 不研究什么)
- 段落「为什么不内耗」:共享元发现(观测=投影复合 + 逆问题有非平凡零空间),selop 把 σ 当障碍推 φ / σ 反演把 σ 当主对象拆;DES 不锚 f
- 段落「阅读顺序提示」:Ch.2(DES)→ Ch.3(框架)→ Ch.4(selop-v3)→ Ch.5(σ),可按兴趣跳
- 字数 ~1200(术语注 / 概念解释不算膨胀)
- 文末**不**写「下一页:...」(由 PageNav 组件渲染)

- [ ] **Step 1: 起 dev,写一段查一段**

Run:
```powershell
npm run dev
```
浏览器开 `http://localhost:4321/01-overview`,Vite 热重载边写边看。

- [ ] **Step 2: 替换 T5 的占位 01-overview.mdx 为真正文**

按上述「必出现元素清单」逐项写,保持密度紧凑(800-1500 字 / 此页 ~1200)。Mermaid 块用 fenced ` ```mermaid ` 直接写。

- [ ] **Step 3: 浏览器逐项核对**

清单 9 项,每项点头才算过。Mermaid 图渲出、KaTeX 行内符号渲对、自创概念都有就近解释段。

- [ ] **Step 4: 构建检查**

Run:
```powershell
npm run build
```
Expected: 路由 `/01-overview/index.html` 生成,无 warning(Mermaid / KaTeX 都过)。

- [ ] **Step 5: 提交**

```powershell
git add presentation/three-track-progress/src/content/pages/01-overview.mdx
git commit -m "feat(presentation): P1 三线树形结构 + 阅读指南"
```

---

### Task 7: P2 DES 是什么 + 已建成 MDX

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/02-des-intro.mdx`

**Interfaces:**
- Consumes: T6 的概念解释积累(R_irr / 元发现 等已介绍);此页不重复解释
- Produces: `/02-des-intro` 路由,Sidebar `ch2` 高亮

**真源 context 文件(必读后落笔):**
- `G:\OUROBOROS-AI4S\digital-evolution-sandbox\context\2026-06-11-16-10-design.md`(全貌)
- `G:\OUROBOROS-AI4S\digital-evolution-sandbox\context\2026-06-20-numerical-round-protocol.md`
- `G:\OUROBOROS-AI4S\digital-evolution-sandbox\context\2026-06-20-22-00-descaffold-unified-primitive.md`

**必出现元素清单:**

- frontmatter `order: 2` / `title: DES 是什么 + 已建成` / `chapter: ch2`
- 自创概念解释(首次):`红皇后混战`(段落:每代都在跑步维持原位,频率依赖,无外部 fixed fitness)
- 自创概念解释(首次):`验收之眼`(viz web app 的命名;一行注即可)
- 术语注:fixation / parquet / WS(WebSocket)/ tick(出现时就近)
- 段落「这条线是什么」:忠实采全过程时序原始数据;**本身不内建学习器**;f=φ∘a 已判否,不反推 φ
- 段落「与 selop-v3 的区别」:**带旁路真值的靶场不在这里**,在 selop-v3 引擎
- **`flowchart` 4 阶段 tick 流程图**(节点:快照 → 对抗 → 繁衍含突变 → K 墙仲裁;边带「同阵营不互斗」「跨阵营对抗中和」标注)
- 段落「关键数字」:128² grid · K=64 · ~15.8ms/tick · 首批 4 parquet ~837MB · 285 引擎 + 146 web 测试绿 · PR#2 合并 main `ebfe881`
- 段落「数据 schema」:每行 `(tick, cell_x, cell_y, strain, count, faction)`,每 tick 全量快照
- 段落「初批结局」:无 fixation / 四阵营共存 / 末态各贴 0.25(选择信号 ≈ 0,因四阵营全同条)
- **`block-beta` 系统三层架构**(引擎 / 记录器 / web 验收)
- 字数 ~1400

- [ ] **Step 1: 写 MDX**

按清单逐项填。同序列 count 5675→1 这种证据值得单段引用,作为「f 不是标量」的实证铺垫(下一页 P3 会深入)。

- [ ] **Step 2: 浏览器核对**

逐项打勾 + 4 阶段 tick 图渲对、`block-beta` 三层不被裁切。

- [ ] **Step 3: 构建 + 提交**

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/02-des-intro.mdx
git commit -m "feat(presentation): P2 DES 是什么 + 已建成"
```

---

### Task 8: P3 DES 核心机制 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/03-des-mechanism.mdx`

**Interfaces:**
- Consumes: T7 已铺「红皇后混战」「同序列上下文异果」事实
- Produces: `/03-des-mechanism`;此页定下 reframe 结论(f 是上下文函数)供 Ch.3 P5 引用

**真源:**
- `digital-evolution-sandbox\context\2026-06-20-22-00-descaffold-unified-primitive.md`(统一基元)
- `digital-evolution-sandbox\context\2026-06-11-16-10-design.md`(三 meta + BB0)

**必出现元素清单:**

- frontmatter `order: 3` / `title: 核心机制(地基 / 基元 / 模板 / schema)` / `chapter: ch2`
- 自创概念解释(首次):`三条 meta 地基`、`BB0 模板`、`统一基元`、`上位 κ 同通道族自协同`、`backbone vs 插槽 唯一别 = locked / mutable`
- 段落「三条 meta 地基」逐条:① 进化无目标 ② 红皇后频率依赖混战 ③ 表型=序列的固定函数(严禁手写「谁强」)
- 段落「统一基元」:`formula(x, i) → 输出束` 一阶函数;五类 F繁衍 / P突变 / Z对抗;backbone 锁死 vs 插槽可突变
- 段落「上位规则」:κ 同通道族自协同 `量·(1+κ)^{n_same}`(κ=0)
- 段落「结局常数」:μ / z_max / δ / p_max / α / κ / β **锁死 registry,永不进 CLI/config**(列原因:防手调)
- 段落「BB0 模板」:16 位 / 6 插槽 / 10 locked;默认局四阵营全同条仅 faction 不同;viz 起放开为「同模板结构」,锁死位/骨架/插槽位置/调色板全同仅 6 插槽取值可不同(过 `validate_bb0_layout` 守门),默认路径回退全同条字节级不变
- 段落「为什么放开起始基因型 ≠ 破无私货」:四阵营仍同模板、同固定 G→P,无手写「谁强」系数
- 段落「reframe(已锁)」:**f 不是标量 f(序列)→ 适应度,而是上下文函数 f(株,局部上下文)→ 该株此 tick 增减**;证据 = 同序列 count 5675→1 都有
- **`block-beta` 单一基元结构图**(formula / 输入 / 输出束 / locked-mutable 区分)
- **`flowchart` BB0 模板 16 位 layout 示意**(10 locked + 6 插槽,色 `--c4` 标 locked、`--c5` 标插槽)
- 字数 ~1500

- [ ] **Step 1-3: 写 / 看 / 提交**

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/03-des-mechanism.mdx
git commit -m "feat(presentation): P3 DES 核心机制 (三 meta + 统一基元 + BB0 + reframe)"
```

---

### Task 9: P4 全 68 基元 9-spec 路线图 MDX

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/04-des-roadmap.mdx`

**Interfaces:**
- Consumes: T8 已铺「统一基元」「结局常数锁 registry」「BB0」概念
- Produces: `/04-des-roadmap`

**真源:**
- `digital-evolution-sandbox\docs\superpowers\specs\2026-06-24-s0-*.md` 至 `2026-06-24-s8-*.md`
- `digital-evolution-sandbox\docs\superpowers\plans\2026-06-24-s0-*.md` 至 `2026-06-24-s8-*.md`
- memory `project_des_unify_and_68_roadmap.md` / `project_des_spec_review_rulings.md`

**必出现元素清单:**

- frontmatter `order: 4` / `title: 全 68 基元 9-spec 路线图` / `chapter: ch2`
- 段落「目标」:registry 6→68;并统一 `src/` + `webapp/` 为一系统、保两种运行(CLI 给 AI 批量产数据 / web 给人手动看)
- 段落「纪律」:游戏设计已终,凡需「新增概念」必是实现者理解错——只补 registry 数据行 + 复用既有机制,不发明玩法
- 段落 / 列表「9 spec 实现序」:S0→S6→S1→S2→S4→S5→S3→S7→S8,每行一句作用(直引 CLAUDE.md 对应段落)
- 段落「评审两裁定」:① 谱重录基线(全 68 affinity 谱才是设计,6 字母残缺截断,长全后 RE-RECORD fixtures)② 多 P 混合归 S8(`Σpᵢqᵢ/Σpᵢ` 取代 dominant_p)
- 段落「实现进度」:**S0 ✓(2026-06-25,commits a631656..7704b5b,push origin/main,165 passed)**;下一闸 S6;S6/S1/S2/S4/S5/S3/S7/S8 待
- 段落「未碰的独立闸」:非对称角色系统(per-faction K / 突变率 / 机制)独立 HARD-GATE 未碰
- **`flowchart` 9 spec 依赖序与横切关系**(S0 ✓ 标已完成 / S6 标横切地基 / S8 标合流终点)
- **`block-beta` 9-spec 在系统中的位置**(S0 入口层 / S6 粒度层 / S1-S5 表达力层 / S7-S8 终态)
- 字数 ~1400

- [ ] **Step 1-3:** 同 T6-T8 模式;构建 + 提交。

```powershell
git add presentation/three-track-progress/src/content/pages/04-des-roadmap.mdx
git commit -m "feat(presentation): P4 全 68 基元 9-spec 路线图"
```

---

### Task 10: P5 f = σ ∘ φ ∘ a 详解 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/05-f-formula.mdx`

**Interfaces:**
- Consumes: T6 已介绍 R_irr + 兄弟分支
- Produces: `/05-f-formula`;此页定义 σ 四分量(p_e / p_o / σ₁σ₂ / D),P9 不再重新介绍

**真源:**
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\2026-06-13-16-49-sandbox-design.md`(活文档)
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\2026-06-13-16-27-northstar-round3.md`
- `G:\OUROBOROS-AI4S\context\sigma-inversion-INDEX.md`
- memory `project_selop_recon_foundation_cracks.md`
- arXiv 2605.06879 Evo-PU(只需引用公式)

**必出现元素清单:**

- frontmatter `order: 5` / `title: f = σ ∘ φ ∘ a 详解` / `chapter: ch3`
- 段落「这不是个一开始就有的公式」:v1 (f=φ∘a) 被三裂缝推翻 → v3 重建
- 自创概念解释(首次):`三裂缝`(Weinstein 2022)
- 术语注:K_D / in-vivo / in-vitro / abundance ≠ affinity
- 段落「三模块」逐条:**a**(亲和,K_D 物理量)/ **φ**(适应度 link,生发中心内非单调,T-help 瓶颈 + 频率依赖 + 克隆干涉)/ **σ**(存活与采样的复合投影)
- 段落「复合方向」:右→左(序列 → a → φ → σ → 你看到的数据)
- 段落「v1 三裂缝」逐条:① a 错观测量(in-vitro K_D ≠ in-vivo a_invivo)② 缺 σ 存活算子(abundance ≠ affinity,PMC5337809)③ φ 因果不可辨
- 段落「a 拆两半」:p_a(σ 反演 D 闭环副产)+ a_invivo(R_irr,wet-lab 才能测,公认不研究)
- 段落「σ 进一步拆四分量」:p_e 突变可达 / p_o(x,m) 监测 / σ₁∘σ₂ 选择复合 / D 反卷积闭环
- **KaTeX 块级公式**(Evo-PU 主公式,原文核对):`$$P(O=1 \mid x) = p_a \cdot \left[ 1 - \prod_{y \in Y(x)} (1 - p_o \cdot p_e) \right]$$`,注明来源 arXiv:2605.06879
- **`flowchart` v1 → v3 三裂缝推翻演化**
- **`block-beta` 三模块输入输出契约**(序列 → a → φ → σ → parquet)
- **手写 SVG「四漏斗箭头图」**:B 细胞 → 三生物漏斗(p_e / σ₁σ₂ / p_o)→ parquet;D 反向反卷积箭头;沿用 `--c1..--c5`
  - 注:SVG 写在 MDX 中 `<svg viewBox="..." xmlns="http://www.w3.org/2000/svg">...</svg>`,色用 `var(--c1)` 等
- 字数 ~1500

- [ ] **Step 1: 先把 KaTeX 公式块单独写进 MDX,构建验渲对**

构建后看 `dist/05-f-formula/index.html`,确认公式以 `<span class="katex">...</span>` 渲出,非 `$$...$$` 原文。

- [ ] **Step 2: 写手写 SVG 四漏斗图**

ponytail:viewBox `0 0 800 360`,5 个矩形 + 3 条箭头线 + 1 条反向虚线;不用 anime.js、不用动画。

- [ ] **Step 3: 浏览器核对 + 提交**

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/05-f-formula.mdx
git commit -m "feat(presentation): P5 f=σ∘φ∘a 详解 (Evo-PU + 三裂缝 + 四漏斗 SVG)"
```

---

### Task 11: P6 selop-v3 诚实骨架 + 北极星 + 三子项目 MDX

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/06-selop-skeleton.mdx`

**Interfaces:**
- Consumes: T10 的 f 三模块已铺好;此页只讲 selop-v3 自己怎么推 φ
- Produces: `/06-selop-skeleton`;定义「诚实骨架 5 部分」「北极星 A+D」「三子项目」供后两页(P7 / P8)沿用

**真源:**
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\2026-06-13-16-49-sandbox-design.md`
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\2026-06-13-16-27-northstar-round3.md`
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\INDEX.md`
- `G:\OUROBOROS-AI4S\docs\de-anthropocentric\specs\2026-06-12-selop-frontal-breakthrough-v3-spec.md`

**必出现元素清单:**

- frontmatter `order: 6` / `title: selop-v3 诚实骨架 + 北极星 + 三子项目` / `chapter: ch4`
- 段落「v3 不是 18 补丁、也不是 1 原理统一」(开门见山反两个 elegance-trap)
- 自创概念解释(首次):`诚实骨架`、`挣来的简约 vs 装饰简约`、`北极星 A+D`、`elegance-trap`
- 自创概念解释(首次,延伸):`Φ 算子零谱 = Noether 对称轨道`(R_irr 的具体形)、`适用包络`
- 术语注:Price 方程 / N_e 标度 / Noether 对称
- 段落「诚实骨架 5 部分」逐条:1 EARNED 动力学原理(锚两条框架无关硬禁止:Price 协方差 / 噪声-N_e 标度)+ 2 正交独立支柱(σ / 辨识)+ 1 残余 R_irr + 1 显式适用包络
- 段落「为什么单一骨架统一三层是 elegance-trap 已降级」:骨架只生成通道 1 动力学,σ 与辨识是独立支柱
- 段落「北极星 A+D」:先沙盒跑出 P1/P2「设计了但未实测」的预测(A);终点收在 wet-lab 最小介入(D 推迟到沙盒做完);**此为工程实现轮 → 走 brainstorming → writing-plans**
- 段落「三子项目依赖序」:**引擎(1/3)→ 恢复模型(2/3)→ 基线(3/3)**;引擎产出契约 = 后两者的输入接口
- 段落「⚠ 此 selop-v3 沙盒 ≠ DES」(显著加粗,防混淆)
- **`block-beta` 诚实骨架 5 部分组成**(动力学原理 / σ 支柱 / 辨识支柱 / R_irr / 适用包络)
- **`flowchart` 三子项目依赖序与契约接口**(引擎 → 恢复模型 → 基线,标契约接口)
- 字数 ~1300

- [ ] **Step 1-3:** 写 / 核 / 提交

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/06-selop-skeleton.mdx
git commit -m "feat(presentation): P6 selop-v3 诚实骨架 + 北极星 + 三子项目"
```

---

### Task 12: P7 引擎 6 决议 + A/B 层 + 7 条对抗约束 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/07-selop-engine.mdx`

**Interfaces:**
- Consumes: T11 的「三子项目」已介绍,本页深入第 1 个(引擎)
- Produces: `/07-selop-engine`;定义「A 层 / B 层 / 三非循环铁律 / 5 对抗真值世界 / 判别第四路」供 P8 引用

**真源:**
- `G:\OUROBOROS-AI4S\context\selop-v3-engine\2026-06-13-16-58-engine-init.md`(主文件,6 决议 + 32 条技术 checkpoint)
- `G:\OUROBOROS-AI4S\context\selection-operator-v3\2026-06-13-16-49-sandbox-design.md`

**必出现元素清单:**

- frontmatter `order: 7` / `title: 引擎 6 决议 + A/B 层 + 7 条对抗约束` / `chapter: ch4`
- 段落「底线」:不许怎么简单怎么来 / 不许交付好验证但没用的 MVP / 须建在真实开源数据上(适度合成,非随意过简模拟)
- 自创概念解释(首次):`A 层 / B 层`、`三非循环铁律`、`旁路真值`、`5 对抗真值世界`、`判别第四路`
- 术语注:agent-based / catch-bond / Bell-Evans / Victora-Nussenzweig / Gerrish-Lenski / Diffusion 的 score = ∇log μ_t / FV drift / 测度流
- 段落「6 决议」逐条(列表):① 分辨率=甲(生发中心忠实 agent-based)② 引擎 = A 层逼真环境 + B 层三物理真值算子 ③ 算子=因果驱动律非事后标签 ④ A 层用开源数据经「多视图对角整合 / 共享隐空间还原」搭厚 ⑤ 拼接欠定 → 只支撑 A 层逼真度 + 保真度闸门,绝不碰 B 层真值 ⑥ 拼接非唯一性转化为 P1 鲁棒性 stress test
- 段落「三算子物理落地」:a_invivo → catch-bond(Bell-Evans)/ σ → T-help 瓶颈竞争(Victora-Nussenzweig)/ φ → 频率依赖 + 克隆干涉(Gerrish-Lenski);选生发中心是因为只有它让三算子物理上彼此独立
- 段落「架构约束」:只用 Transformer / Mamba / Diffusion,图作 attention bias,不用独立 GNN / CNN / RNN
- 段落「陷阱(必须放显著位置)」:A 层 Diffusion 的 score = ∇log μ_t = FV drift 与 B 层测度流骨架同源 → **A 层 Diffusion 只许生成可观测统计量,绝不当 B 层真值源**
- 段落「7 条对抗约束」逐条:① 三非循环铁律(引擎个体级 · 绝不实现测度流 PDE 当真值源 / σ-φ 噪声-a_invivo 走涌现+记录非手写 / do() 真个体级介入非改方程参数)② 5 个对抗性真值世界(σ 部分可吸收 / 外加噪声 / 非 ΔG-catch-bond / 三通道强共线 / 真存在静态 φ)③ 首验命名预测 P1(克隆干涉 Nμ≫1 区富集比-φ 非单调)+ P2 ④ 命题①须先定阈值(三子空间主夹角 θ + dim R_irr/dim 全谱 ε)否则不可证伪 ⑤ 判别第四路(自底向上从 CR9114 / CR6261 DMS,对测度流盲,纯统计视角)⑥ 适用包络内外分测 ⑦ B5 奥卡姆诊断(最小介入优化子模性 vs 三子空间直和度)
- 段落「A/B 严格责任隔离 = 防自欺命根子」:算子是因果驱动律(导演)非事后标签;带旁路真值的合成引擎是逻辑必需(非偷懒)的验证路径
- **`block-beta` A/B 层架构**(A 数据厚搭 / B 三算子,中间画严格边界)
- **`flowchart` 三算子的物理对应关系**(算子 → 物理机制 → 文献)
- 字数 ~1500

- [ ] **Step 1: 写主体(6 决议 + A/B 层 + 三算子)**

ponytail:列表用 markdown 有序列表,不做 `<ol class="...">` 自定义样式;段落浓度高就保留。

- [ ] **Step 2: 写 7 条对抗约束(必须每条对得上 spec)**

每条带定量阈值的就写阈值(θ / ε / N_e 等)。

- [ ] **Step 3: 写两张图 + 构建核对 + 提交**

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/07-selop-engine.mdx
git commit -m "feat(presentation): P7 引擎 6 决议 + A/B + 三算子 + 7 对抗约束"
```

---

### Task 13: P8 问题 A 共享隐空间还原 + HARD-GATE MDX

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/08-selop-bone.mdx`

**Interfaces:**
- Consumes: T12 已介绍 A 层「多视图对角整合 / 共享隐空间还原」(决议 ④);本页深入该机制本身
- Produces: `/08-selop-bone`;明确标 selop-v3 当前处于「HARD-GATE 未批不进实现」

**真源:**
- `G:\OUROBOROS-AI4S\context\selop-v3-engine\2026-06-13-16-58-engine-init.md`(32 条技术 checkpoint 中关于「共享隐空间还原」段)

**必出现元素清单:**

- frontmatter `order: 8` / `title: 最硬骨头:共享隐空间还原 + HARD-GATE` / `chapter: ch4`
- 自创概念解释(首次):`原创共享隐空间还原`、`预训练先验`、`欠定解`、`异步事件驱动 tick`
- 术语注:ESM / AntiBERTy / IgLM / MOFA / GLUE / 突变效应嵌入 / 结构嵌入
- 段落「问题 A 是什么」:原创共享隐空间还原机制;**不套 MOFA/GLUE**,用 ESM / AntiBERTy / IgLM / 突变效应 / 结构嵌入把各数据集嵌同一隐空间,以预训练先验约束欠定解
- 段落「四风险」逐条:① 隐空间不天然对齐 ② 预训练偏置渗进 A 层 ③ 缺口维度怎么生成 ④ 表征会否泄漏 φ(每条单段,带缓解策略)
- 段落「问题 C 次硬」:tick 事件顺序(属真值定义,倾向异步事件驱动)
- 段落「context 与 spec 入口」:`context/selop-v3-engine/2026-06-13-16-58-engine-init.md`(6 决议 + 32 条);spec `docs/de-anthropocentric/specs/2026-06-12-selop-frontal-breakthrough-v3-spec.md`
- 段落「HARD-GATE 现状」(强调):**卡在引擎「共享隐空间还原机制」设计(问题 A),设计未批不进实现**
- **`flowchart` 多个开源数据集 → 共享隐空间的还原过程**(各数据集 → 各 PLM 嵌入 → 共享隐空间 → A 层逼真环境)
- **Mermaid 表 / 手写 SVG 四风险与对应缓解策略对照**(两栏:风险 / 缓解)
- 字数 ~1000(HARD-GATE 故意短)

- [ ] **Step 1-3:** 写 / 核 / 提交

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/08-selop-bone.mdx
git commit -m "feat(presentation): P8 最硬骨头 + 四风险 + HARD-GATE"
```

---

### Task 14: P9 σ 反演数学骨架 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/09-sigma-math.mdx`

**Interfaces:**
- Consumes: T10 已写过 Evo-PU 主公式 + σ 四分量定义;本页**深入数学**,不重复定义,只展开和算子角色
- Produces: `/09-sigma-math`;定义「执行模式岔口 1=B / 岔口 2=A」「副产品 p_a 身份」

**真源:**
- `G:\OUROBOROS-AI4S\context\sigma-inversion-INDEX.md`(跨 stage 汇总入口)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-ka-knowledge.md`(stage 1)
- `G:\OUROBOROS-AI4S\docs\de-anthropocentric\specs\2026-06-13-sigma-operator-inversion-spec.md`
- memory `project_sigma_operator_direction.md`

**必出现元素清单:**

- frontmatter `order: 9` / `title: σ 反演数学骨架 (Evo-PU + σ 四分量)` / `chapter: ch5`
- 段落「站外部铁证 Evo-PU 肩上补它的抗体洞」:核心纪律 = **反演整个观测算子 + 诚实标零空间**,不是造更好的功能预测器
- **KaTeX 块级公式**(重述 Evo-PU 主公式,本页是 σ 线的入口):`$$P(O=1 \mid x) = p_a \cdot \left[ 1 - \prod_{y \in Y(x)} (1 - p_o \cdot p_e) \right]$$`
- 段落「σ 四分量(展开)」:A 突变可达 p_e(SHM 5-mer 上下文)/ B 监测 p_o(x, m)(study 偏 + cell 偏)/ C 选择复合 σ₁ ∘ σ₂(out-of-frame 锚 + sigmoid 拐点)/ D 反卷积闭环
- 段落「四面必须合回单一似然才叫『彻底』」(粗体强调)
- 段落「执行模式(用户拍)」:岔口 1 = B(可达性验证 + 报告数字 + 小 smoke,非全管线 / 非 OAS 全量下载);岔口 2 = A(每 stage 闸口暂停汇报后再推进);中文简洁汇报
- 段落「副产品身份」:p_a 是 D 闭环结果而非另起目标;a_invivo 不研究归 R_irr
- 段落「与 selop-v3 的关系」:共享元发现(观测=投影复合 + 逆问题有非平凡零空间);selop 把 σ 当障碍推 φ,本线把 σ 当主对象拆开,正交互补不内耗
- **手写 SVG 四漏斗箭头图**(P5 已画过的可复用,但建议本页画 σ 视角的版本:p_e / σ₁ / σ₂ / p_o 四漏斗 + D 反向反卷积箭头粗体)
- **`block-beta` 四分量与外部铁证 Evo-PU 的对照**(两栏:Evo-PU 原版 / σ 反演本课题扩展)
- 字数 ~1500

- [ ] **Step 1-3:** 写 / 核 / 提交;特别核对公式 LaTeX 字符与 P5 完全一致(避免两页同一公式出微差)

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/09-sigma-math.mdx
git commit -m "feat(presentation): P9 σ 反演数学骨架 (Evo-PU + 四分量展开)"
```

---

### Task 15: P10 σ 反演 Stage 1-4 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/10-sigma-stage1-4.mdx`

**Interfaces:**
- Consumes: T14 已铺 σ 四分量与 Evo-PU 公式;本页讲怎么 7 stage 走过来
- Produces: `/10-sigma-stage1-4`;定义「governing variable = Φ 的秩 / 谱」「θ(S_mut, S_sel) = 0.0°」「攻击序 A→C→B→D」「桥 1/2/3」

**真源:**
- `G:\OUROBOROS-AI4S\context\sigma-inversion-ka-knowledge.md`(S1)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-identifiability.md`(S2)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-hypotheses.md`(S3)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-operator-design.md`(S4)

**必出现元素清单:**

- frontmatter `order: 10` / `title: σ 反演 Stage 1-4 (知识 / 可辨识 / 假设 / 算子)` / `chapter: ch5`
- 自创概念解释(首次):`governing variable`、`ascertainment 同余类`、`Φ 算子秩 / 谱`、`σ 可辨识地图`、`攻击序 A→C→B→D`、`桥 1/2/3`
- 术语注:S5F kernel / HH_S5F / OLGA Pgen / IGoR / Bakis-Minin / Heckman exclusion restriction / IPW positivity / sigmoid / SONIA / netam-Thrifty
- 段落「S1 知识到可建模级」:64 search / 20 full-text;三冒烟过(S5F = 已发表 HH_S5F / SHM kernel 破 flat-Hamming 1.60 log / OLGA Pgen 端到端,无需 IGoR 编译);★ 新认知 = Evo-PU 类先验 `[1−∏(1−p_o·p_e)]` 数学等同 birth-death 非灭绝条件因子 → 用 ascertainment 同余类统一刻画可辨识性
- 段落「S2 可辨识闸(最前置)」:**governing variable 锁死 = 线性化观测映射 Φ 的秩 / 谱**(非预测精度);σ 可辨识地图(列表):p_a 可辨到单调变换 / σ₂ 仅 contrast(拐点辨斜率耦合)/ σ₁ 可辨到尺度(out-of-frame 锚)/ p_o 跨 study contrast 可辨 + single-study irreducible
- 段落「中心结果」(强调):**(p_e, 选择, p_o) 不联合可辨**(Bakis-Minin λ/μ/ρ 映射)
- 段落「★ 真 CR9114(65094 行)实测 θ(S_mut, S_sel)=0.0°」:= 裸突变计数与选择完全混淆的硬实例 → **p_e 必须用 5-mer 上下文非线性 kernel**(从工程选择升级为辨识性必需)
- 段落「零空间两源」:single-study 格子 + fitness-scale(1 维);6 承重假设 negate
- 段落「S3 假设」:8 可证伪命题(每条带定量 BROKEN 阈值),攻击序 **A→C→B→D** 依赖驱动;防 paper 化护栏 verbatim 置顶,0 条以可发表性为存在理由
- 段落「S4 造算子」:四模块合回单一似然(占不同因子位非拼接)—— M_e S5F 5-mer / M_o 分层 GLM / M_sel OLGA+SONIA+sigmoid / M_a 代数反解;**★ 桥 1 完整数学等价:Evo-PU 类先验 = birth-death 非灭绝 ascertainment 因子**(把 H-B2 从类比升为代数等价);桥 2:out-of-frame = Heckman exclusion restriction;桥 3:single-study = IPW positivity violation
- **`flowchart` Stage 1-4 之间的承重关系**(S1 →〔闸〕S2 → S3 假设 → S4 算子)
- **`block-beta` 四模块组合方式**(非拼接,占不同因子位:M_e × M_o × M_sel × M_a → 联合似然)
- 字数 ~1500

- [ ] **Step 1-3:** 写 / 核 / 提交。θ=0° 这种实测值必须从 context 文件原文核对一次,不抄 CLAUDE.md 摘要。

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/10-sigma-stage1-4.mdx
git commit -m "feat(presentation): P10 σ Stage 1-4 (知识/可辨识/假设/算子)"
```

---

### Task 16: P11 σ 反演 Stage 5-7 MDX(★ 1500 字)

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/11-sigma-stage5-7.mdx`

**Interfaces:**
- Consumes: T15 已铺 4 模块 + 桥 1/2/3 + 可辨识地图
- Produces: `/11-sigma-stage5-7`;定义「ACCEPT WITH REVISE 4 条」「FalsificationLedger 三桶」「六环闭环验证」

**真源:**
- `G:\OUROBOROS-AI4S\context\sigma-inversion-convergence.md`(S5)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-falsification.md`(S6)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-experiment-design.md`(S7)
- `G:\OUROBOROS-AI4S\context\selection-operator-v2\stress-test-skills\` 7 skill 文件路径

**必出现元素清单:**

- frontmatter `order: 11` / `title: σ 反演 Stage 5-7 (收敛 / 证伪套 / 六环验证)` / `chapter: ch5`
- 自创概念解释(首次):`ACCEPT WITH REVISE`、`feasibility 真测`、`FalsificationLedger 三桶`、`CONDITIONAL GREEN-LIGHT`、`σ_gen / σ_inf 分量层独立`、`六环闭环验证`
- 术语注:多准则 21/25 / 可发表性轴 / 双 kernel 同 SHM family / DeWitt GC-replay
- 段落「S5 收敛 verdict = ACCEPT WITH REVISE」:feasibility 真测(OLGA ✓ / CR9114 ✓ / 核心栈 ✓ 可即跑;SONIA / netam-Thrifty 未装但 S7 才硬需);多准则 21/25(禁可发表性轴)
- 段落「4 REVISE」逐条:R1 破循环主力 = σ_gen / σ_inf 分量层独立(非双 kernel)/ R2 加性 = toy 简化 / R3 p_o 带星号 / R4 σ₁σ₂ model-based
- 段落「S6 自建证伪套」:7 skill 在 `context/selection-operator-v2/stress-test-skills/`(非引擎默认);**赢条件翻转为主动证伪**,产 FalsificationLedger 三桶(**无 resilience 分 / 无 hardening**)
- 段落「circular-validation-audit 先跑 = CONDITIONAL GREEN-LIGHT」:4 对抗真值硬性入设计(non-sigmoid 选择 / 真 OAS 监测 + 未知 single-study 格子 / 非 SHM 可达 / σ 部分可吸收);确认 R1(双 kernel 同 SHM family 仅 PARTIAL 去循环,真破循环靠 σ_gen / σ_inf 分量层独立)
- 段落「S7 闭环验证设计(只设计不实跑)」:六环 —— 真值实测 CR9114 → σ_gen 采样唯一合成参数 A → σ_inf 反演参数 B≠A → 重建 → 比对分可辨 / irreducible / 对抗三方向 → 残差只 refine 可辨方向
- 段落「2 真实交叉验证轴」:DeWitt GC-replay = σ₂ 真值锚 / OAS = p_o 协变量 + 最危险 C5 判决场
- 段落「判别第四路」:纯统计对 π · S 形盲,判 N_eff ≈ 1.3
- 段落「4 零空间实证指标」:可恢复率 / dim R_irr / θ 敏感带 / 对抗诚实失败率
- 段落「6 caveat;五项硬闸全 PASS,不含纯合成沙盒」
- **`flowchart` 六环闭环验证流程**(真值采样 → 反演 → 重建 → 比对 → 残差,残差只 refine 可辨方向那条箭头要特别标)
- **`block-beta` FalsificationLedger 三桶分类结构**(CORROBORATED / BROKEN / TESTABLE-NOT-YET / PROMISING-UNEARNED;注 P12 才填具体)
- 字数 ~1500

- [ ] **Step 1-3:** 写 / 核 / 提交

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/11-sigma-stage5-7.mdx
git commit -m "feat(presentation): P11 σ Stage 5-7 (收敛/证伪套/六环)"
```

---

### Task 17: P12 FalsificationLedger + C5 命门 + 开源数据 + 下一步 MDX

**Files:**
- Create: `presentation/three-track-progress/src/content/pages/12-sigma-ledger.mdx`

**Interfaces:**
- Consumes: T16 已介绍 FalsificationLedger 三桶 + 六环;本页填具体 11 主张归类
- Produces: `/12-sigma-ledger`;明确标 σ 线「spec 到设计为止,要真跑须另起 executing-specs」

**真源:**
- `G:\OUROBOROS-AI4S\context\sigma-inversion-falsification.md`(11 主张详)
- `G:\OUROBOROS-AI4S\context\sigma-inversion-INDEX.md`(终态 Research Design + Ledger 总表)
- memory `project_sigma_operator_direction.md`

**必出现元素清单:**

- frontmatter `order: 12` / `title: FalsificationLedger + C5 命门 + 开源数据 + 下一步` / `chapter: ch5`
- 自创概念解释(首次):`同构修正 rung2`、`N_eff(三桥 framing 诱导)`
- 术语注:H-B2 / Bakis-Minin / Louca-Pennell / abundance≠affinity PMC5337809 / Zenodo 15022130 / ConvergeBio/oas-unpaired
- 段落「11 主张三桶分类」(必须 11 条全列):
  - **CORROBORATED(6):** C8 (p_e, 选择, p_o) 不联合可辨(真 CR9114 θ=0 硬证 + 双路径抗 H-B2 BROKEN)/ C7 联合似然合一 / C6 桥 1(rung2 子结构同构)/ C2 σ₂ 拐点(pending)/ C9 零空间可计算(weak)/ C10 闭环非循环(conditional)
  - **BROKEN(1,条件性已降级不致命):** C3 out-of-frame selection-free → 受 mRNA / 表达弱选择 → σ₁ 锚降级「弱选择 baseline + 偏差项」,辨识增益减弱不消失,不回退
  - **TESTABLE-NOT-YET(3,押 S7):** C1 p_e 解耦(真 S5F 全表,toy 仅 6.59° < 15°)/ C4 p_o 跨 study / **★ C5 H-A3 元数据非混杂(最危险,BROKEN 则 ε 越界回 S2 需用户确认)**
  - **PROMISING-UNEARNED(1):** C11 四分量 elegance → 待验预测 P1(真表 θ > 15° + AUC 超 flat)兑现才 EARNED,坦白未完全 earn
- 段落「同构修正」:C6 从「本课题 σ = Evo-PU σ」降为 rung2(类先验=非灭绝因子为真,但 p_o(x, m) + germline lineage 严格超出 Evo-PU,整体不同构)—— 反而部分反驳「σ 反演 = Evo-PU 换数据集」嫌疑;**N_eff ≈ 1.3**(三桥 framing 诱导,σ = π·S 降为强假设待第四路)
- 段落「最大未决风险敞口 = C5」:p_o 可辨性命门,完全押 Stage 7 OAS 实测(控 study 后 cell 偏 R² < 0.05 即 BROKEN)
- 段落「关键开源数据(全本地或可达)」:CR9114 / CR6261 完备 K_D parquet(答案钥匙,已有)/ DeWitt GC-replay(Zenodo 15022130,σ₂ 真值)/ OAS(ConvergeBio / oas-unpaired,p_o 协变量)/ S5F 本地(已验=HH_S5F)/ OLGA(σ₁ 已装可跑)
- 段落「关键 paper」:Evo-PU arXiv:2605.06879 / Bakis-Minin 2508.09519 / Louca-Pennell Nature 2020 / abundance≠affinity PMC5337809
- 段落「下一步(交还用户)」:本 spec 到设计为止(Stage 7 只设计不实跑);最小可行核(M_a + S5F + OLGA + GLM + CR9114)现在就能跑,三缺口(SONIA / Thrifty / OAS 全量)Stage 7 才硬需;context 主入口 `context/sigma-inversion-INDEX.md`
- 段落「未经用户确认不进实现」(强调)
- **`block-beta` Ledger 三桶 + 11 主张归类矩阵**(横轴:桶名;纵轴:C1..C11)
- **`flowchart` C5 押注链**(p_o 可辨性 → OAS 实测 → 控 study 后 cell 偏 R² → BROKEN 阈值 → 回 Stage 2)
- 字数 ~1400

- [ ] **Step 1-3:** 写 / 核 / 提交

```powershell
npm run build
git add presentation/three-track-progress/src/content/pages/12-sigma-ledger.mdx
git commit -m "feat(presentation): P12 Ledger + C5 命门 + 开源数据 + 下一步"
```

---

### Task 18: 终态验收(构建干净 + 12 页人工清单)+ 终态提交

**Files:**
- 验收清单不写入 repo;过完一遍如有微调,直接改对应 MDX / CSS / nav.ts

**Interfaces:**
- Consumes: T1-T17 全部交付物
- Produces: 一个干净构建 `dist/`,12 路由全可加载,人工清单全过;最终一次「整页一遍走过」的版本提交

**自动验收(必过):**

- [ ] **Step 1: 全量构建**

Run:
```powershell
npm run build
```

Expected:
- 进程 exit code 0
- `dist/` 下出现 12 个路由目录(`01-overview/index.html` … `12-sigma-ledger/index.html`)+ `dist/index.html`(重定向)+ `_astro/` 静态资源
- 无 `[ERROR]` / `[WARN]` 关于 Mermaid / KaTeX / MDX 解析的输出

若任一项 fail,定位到具体 MDX,按报错信息改;别绕开。

- [ ] **Step 2: 起 preview 服务**

Run:
```powershell
npm run preview
```

打开 `http://localhost:4321/`。

**人工清单(在浏览器中过一遍,每项打勾才算过):**

- [ ] **Step 3:** `/` 自动跳 `/01-overview`
- [ ] **Step 4:** 12 页都能加载,每页侧栏当前页高亮(粉紫圆点)跟随
- [ ] **Step 5:** `→` 翻下一页(从 P1 一路按到 P12,再按一次不动)
- [ ] **Step 6:** `←` 翻上一页(从 P12 倒回 P1)
- [ ] **Step 7:** `Home` 跳 P1,`End` 跳 P12(任何页测一次)
- [ ] **Step 8:** 触底再滚一次能跳下一页(在 P3 / P5 / P7 / P10 这种长页测;普通滚不跳,要触底+第二次 wheel 才跳;<100ms 内连滚不重复跳)
- [ ] **Step 9:** Mermaid 图全渲对(P1 树形 / P2 4 阶段 / P3 BB0 / P4 9-spec 依赖 / P5 v1→v3 / P6 诚实骨架 + 三子项目 / P7 A/B + 三算子 / P8 隐空间 + 四风险 / P9 Evo-PU 对照 / P10 Stage 1-4 / P11 六环 + 三桶 / P12 三桶矩阵 + C5 押注),节点不被切,长图加 `overflow-x: auto` 横向能滚
- [ ] **Step 10:** KaTeX 公式不溢出页宽(P5 / P9 主公式;P10 / P11 行内 θ / ε / R² 阈值);`$$...$$` 块级居中、非原文显示
- [ ] **Step 11:** Monet 5 色都出现(`--c1` 顶进度条 + 标题色 / `--c2` em / `--c3` code 文字色 / `--c4` 边框 / `--c5` 当前页粉紫 + strong),无突兀色
- [ ] **Step 12:** 移动端检查:Chrome DevTools 切 `iPhone 12` 视口(< 1024px),`☰` 汉堡显示,点开侧栏滑下,`Esc` 关闭;正文全宽
- [ ] **Step 13:** 触屏左滑 / 右滑翻页(DevTools 触屏模拟模式)
- [ ] **Step 14:** 自创概念抽样查 5 处(R_irr / 红皇后混战 / 诚实骨架 / FalsificationLedger / governing variable),每个都在**首次出现**那页有就近一段解释
- [ ] **Step 15:** 字数抽样:`P3 / P5 / P7 / P10 / P11` 5 个 ★ 页用浏览器选全文复制 → 字数 ≈ 1500;**全 12 页累计 ≤ 25k**(R2 阈值)
- [ ] **Step 16:** **冲突检查:**抽样 3 处对照 context 文件实际内容(`θ=0.0°` / `165 passed` / `commits a631656..7704b5b`),**有冲突时以 context 文件为准**改 MDX,把冲突点记入 spec 附录(若发生)
- [ ] **Step 17:** 终态提交(若 step 3-16 改了任何文件)

```powershell
git add presentation/three-track-progress/
git commit -m "chore(presentation): final acceptance fixes after manual walk-through"
```

若 step 3-16 全过未改任何文件,则跳过此提交。

- [ ] **Step 18: 收尾确认**

`Ctrl+C` 停 preview;`git log --oneline | head -25` 看 commit 序列(T1-T17 应有 17 个 feat + 可选 chore),确认 12 页 MDX 全在 main 分支。

---

## Self-Review

**1. Spec coverage 检查:**

| Spec 章节 | 覆盖任务 |
|---|---|
| §1 项目结构 | T1 / T2 / T4(目录树全部对应) |
| §2 全局布局与导航 | T3 / T4 / T5(布局壳 + 子组件 + 客户端 nav) |
| §3 内容编写规则 | Global Constraints + 每个内容任务的「必出现元素清单」 |
| §4 P1-P12 每页内容设计 | T6-T17 一一对应 |
| §5 Astro 配置与构建期插件 | T1(依赖)+ T2(`astro.config.mjs`) |
| §6 验收 | T18(自动 + 人工清单 14 项) |
| §7.1 风险 R1-R5 | R1 见 T6-T17 必带图节点 ≤ 8 + `overflow-x: auto`(T3 已配);R2 见 T18 step 15;R3 见 T1 step 7 + T2 step 4 fallback;R4 见 T5 step 1 `nav.ts` 的 100ms 静默 + 触底+再滚双判;R5 见 T18 step 16 |
| §7.2 Out-of-Scope | Global Constraints 末段「不做」清单 |

**2. Placeholder scan:** 通读 plan,无 TODO / TBD / "fill in later" / "实现合适的 X" 类占位语;每个 Step 要么是有 code block / 命令的执行步骤,要么是有清单的核对步骤。

**3. Type / 命名一致性核查:**
- `currentSlug`(Sidebar prop)在 T4 / T5 一致
- `prevSlug` / `nextSlug` / `prevTitle` / `nextTitle`(PageNav / Chapter)四处一致
- DOM id `#progress-bar` / `#article` / `#page-nav` / `#next-link` / `#bottom-hint` / `#menu-toggle` / `#sidebar` 在 T3 / T4 / T5 三处一致
- collection schema 字段 `order` / `title` / `chapter` 在 T2 schema / T4 Sidebar / T5 dynamic route / T6-T17 frontmatter 七处一致
- chapter 枚举 `ch1..ch5` 在 T2 schema / T4 Sidebar / T6-T17 frontmatter 一致(spec §1 标的是 4 章但 P1 单成 ch1 / P2-4 ch2 / P5 ch3 / P6-8 ch4 / P9-12 ch5,共 5 个 chapter key,与 spec §4 的 Ch.1-Ch.5 标题对应 — 一致)

**4. Ambiguity check:**
- 「触底再滚」语义:T5 `nav.ts` 已写明 `atBottom` flag + 第二次 `wheel` + 100ms 静默,无歧义
- 「字数」单位:Global Constraints 已统一为「中文字符数」;T18 step 15 用浏览器复制法估
- Mermaid 在 800px 宽放不下:T3 `.mermaid-wrap { overflow-x: auto }` 兜底;T18 step 9 显式核对

无未决歧义,无修改。

---

## 执行交接

**Plan complete and saved to** `docs/superpowers/plans/2026-06-25-tri-track-presentation.md`.

两种执行方式选一:

**1. Subagent-Driven(推荐)** — 每个 Task 派一个 fresh subagent,我两阶段 review;迭代快、上下文不污染。**REQUIRED SUB-SKILL:** `superpowers:subagent-driven-development`

**2. Inline Execution** — 在本会话里走 `superpowers:executing-plans`,batch 执行 + checkpoint 暂停 review。

选哪条?

