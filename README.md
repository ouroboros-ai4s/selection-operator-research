# selection-operator

🚧 Work in progress — design archive, no runnable code yet

In antibody affinity maturation, "higher affinity" does not equal "reproduces more in the germinal center." Between them sits a selection operator, `f = σ ∘ φ ∘ a`. This repo studies how to invert it, along two orthogonal lines:

- **φ simulation-based inference** — build a fake world (a germinal-center simulator) whose ground truth is known, forward-generate "sequence → fate" data, then inversely recover φ (the affinity-to-fitness translation) and check it against the bypass-recorded truth.
- **σ analytic inversion** — take the survival/sampling projection σ as the primary object, decompose its four components and fold them back into a single likelihood, honestly marking the null space that the data cannot resolve in principle.

Currently this is a design and feasibility archive (`context/`, `docs/`); both lines are parked at the design gate. `presentations/` is a walkthrough app covering the three-line progress.
