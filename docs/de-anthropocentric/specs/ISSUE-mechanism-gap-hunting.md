# New skill: `mechanism-gap-hunting` — a truth-seeking replacement for `gap-analysis`

## Why this issue exists

`gap-analysis` (the deep-insight campaign) is built for **paper publishing**: every one of its
SOPs — `gap-keyword-extraction`, `concept-matrix-construction`, `egm-construction`,
`gap-typology-classification` (Miles 7-type), `ahrq-reason-classification`,
`cross-database-verification`, `false-gap-filtering` — answers one question:
*"what part of this field has nobody published yet?"* It equates **gap = literature white-space**.

For truth-seeking research (AI4S, not publication-driven) this is the wrong question.
A heavily-published direction can be exactly where scientific progress is stuck; an unpublished
white-space can be irrelevant. **Literature white-space ≠ mechanism blocker.** The two must be decoupled.

`mechanism-gap-hunting` is a new campaign-level skill that **reuses real deep-insight SOPs** but
rewires them into a pipeline that hunts *the specific link where scientific progress is actually
blocked* — and injects new per-stage directives the originals don't have.

> **This is a DIY pipeline of existing parts, not new primitives.** Every SOP named below already
> exists in the repo. What's new is (a) the cross-campaign assembly order and (b) the injected
> meta-prompt on each stage. Do not invent new SOP files — import the existing ones.

---

## What to build

A new skill directory `mechanism-gap-hunting/` at the same level as `gap-analysis/`, with execution
type **campaign** (it's a strategy book, like gap-analysis — CC reads and orchestrates, not a rigid script).

### `SKILL.md` frontmatter (target)

```yaml
---
name: mechanism-gap-hunting
description: Mechanism-Gap Hunting Campaign — hunt the specific link where scientific progress is BLOCKED, not where literature is empty. Truth-seeking replacement for gap-analysis. 4 stages over reused deep-insight SOPs, with injected per-stage directives. Exhaustive (no prioritization/ranking).
execution: campaign
used-by: deep-insight
---
```

### Core definition (goes in the body, injected into every stage)

> **Gap = the specific link blocking "sequence→fitness operator being scientifically characterized
> and recovered" from moving forward.** Three admission criteria, all required:
> 1. **Blocking**: removing it advances the problem materially (NOT "filling it adds a paper").
> 2. **Layer-attributable**: must land in one of — theory layer / identifiability layer / container layer.
>    (These three layers are the project's, see References; keep them parameterizable so the skill
>    is reusable on other problems by swapping the layer set.)
> 3. **Traceable evidence**: E→S→W (Evidence→Symptom→Weakness); the symptom must point back to a
>    specific paper/dataset.

---

## The 4-stage pipeline (reused SOPs + injected directives)

Each stage = an **existing** SOP/strategy (verified present in `deep-insight-index.md`) plus a
**new injected instruction** that overrides its default publication-oriented behavior.

### Stage ① Blocker-symptom extraction
- **Reuse**: `assumption-audit` (strategy) → `assumption-surfacing` (sop)
- **Inject**: Do NOT collect "future work / remains to be studied" (publication white-space).
  Collect only the authors' **load-bearing concessions** — phrases like
  `we (must) assume`, `cannot be measured (in vitro)`, `as a first step`,
  `the relationship … is unknown`, `for simplicity / we approximate`.
  Each concession = one candidate symptom; record verbatim quote + citation (this is **E**).

### Stage ② Three-layer localization
- **Reuse**: `dialectical-reformulation` (strategy) + `abstraction-laddering` (sop)
- **Inject**: Pin each symptom to exactly one layer and state what is stuck there.
  (Project layers: theory = φ's unified form / population-relativity not expressible as single-sequence f /
  ∘ single-channel assumption; identifiability = is f really only recoverable up to monotone+scale, or is
  that just current methods' ceiling; container = is discrete CTMC the right mathematical object at all.)
  Symptoms that fit no layer → tag "suspected out-of-scope", keep in a side list, do NOT discard.

### Stage ③ Root-cause drilling
- **Reuse**: `five-whys-drilling` (sop) + `current-reality-tree` (sop)
- **Inject**: For each localized symptom, drill "why does this block progress" with TOC
  sufficient-cause logic (current-reality-tree), chaining symptom→mechanism root cause.
  Stop only when the root cause satisfies the **Blocking** criterion (removing it advances the problem).
  Output the S→W (Symptom→Weakness) segment per blocker.

### Stage ④ Block-verification (truth filter)
- **Reuse**: `failure-mode-analysis` (strategy) → `failure-clustering` (sop)
- **Inject**: Verification standard = "does this mechanism truly impede progress",
  NOT "is it confirmed empty across databases". Specifically filter one disguise:
  things that look like blockers but are actually **publishable points wearing novelty packaging** —
  if filling a "gap" only increases publishability without advancing φ/f characterization or recovery,
  mark it a pseudo-blocker, remove from the set (keep archived for audit).

---

## Hard rule: exhaustive, not selective

The campaign produces a **complete blocker set** — no scoring, no ranking, no elimination
(except Stage ④'s pseudo-blocker filter). Ranking is selection logic and conflicts with the goal of
*fully resolving* the problem. **`gap-prioritization` is skipped entirely**; the full set flows
straight to the downstream divergence phase.

> Implementation note: this is the opposite of gap-analysis, whose `gap-prioritization` strategy and
> `multi-criteria-scoring` SOP are central. In `mechanism-gap-hunting` they must NOT appear.

---

## Output format (lock this)

Each blocker emitted as:

```
[layer: theory/identifiability/container] <blocker name>
  | E: verbatim quote + citation
  | S: symptom
  | W: root-cause mechanism
  | verify: how the Blocking criterion is satisfied
```

---

## SOP reuse checklist (all verified present — do NOT recreate)

| Stage | Reused skill | Type | Original home campaign |
|-------|--------------|------|------------------------|
| ① | `assumption-audit` / `assumption-surfacing` | strategy / sop | insight |
| ② | `dialectical-reformulation` / `abstraction-laddering` | strategy / sop | problem-reformulation |
| ③ | `five-whys-drilling` + `current-reality-tree` | sop + sop | insight |
| ④ | `failure-mode-analysis` / `failure-clustering` | strategy / sop | boundary-analysis |

Import these via the same mechanism gap-analysis uses (subagent SOPs spawned via
`subagent-spawning/spawn-agent`; imports listed in SKILL.md).

---

## Implementation steps (for when I build the skill)

1. `mkdir mechanism-gap-hunting/` next to `gap-analysis/`.
2. Write `SKILL.md` with the frontmatter above + body containing: Design Philosophy (strategy-book,
   same as gap-analysis), the Core Definition, the 4-stage routing table, the exhaustive-not-selective
   rule, the output format, and the SOP reuse checklist.
3. Decide whether each stage needs its own thin wrapper SOP (`prompt.md` carrying the injected
   directive) or whether the injection lives inline in the campaign SKILL.md. **Recommendation**:
   inline in the campaign body (the injected directives are short and stage-specific; a strategy-book
   campaign is the right altitude), and call the reused SOPs directly — avoids duplicating SOP files.
4. Keep the three layers (theory/identifiability/container) **parameterizable** so the skill generalizes
   beyond the selection-operator problem.
5. Register `used-by: deep-insight`. Do not wire it to replace gap-analysis automatically — it's a
   sibling the spec chooses explicitly.

---

## Reference / provenance

- Origin: selection-operator "frontal breakthrough" spec draft
  (`docs/de-anthropocentric/specs/DRAFT-selop-frontal-breakthrough-skeleton.md`), §引擎设计.
- Three project layers come from the selection-operator problem restatement (f=φ∘a; M known;
  identifiability up to monotone+scale; discrete CTMC container).
- Design principle this serves: AI4S truth-seeking, not publication-driven (standing constraint).
