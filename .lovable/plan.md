## Plan

Three new goal pages using the existing `GoalPage` shared component (same pattern as weight-loss / healing / anti-aging). All IDs verified in catalog: `semax`, `selank`, `dsip`, `ipamorelin`, `cjc1295`, `pt141`.

### Files

**Create**
- `src/pages/goals/CognitivePeptidesSA.tsx` — slug `cognitive-peptides-south-africa`, H1 "Cognitive Peptides South Africa", cards: `semax`, `selank`, `dsip`. Research paragraphs: BDNF/NGF upregulation (Semax), GABAergic anxiolysis without sedation (Selank), delta-sleep induction & neuroprotection (DSIP).
- `src/pages/goals/GrowthHormonePeptidesSA.tsx` — slug `growth-hormone-peptides-south-africa`, H1 "Growth Hormone Peptides South Africa", cards: `ipamorelin`, `cjc1295`. Research paragraphs: selective GHRP mechanism without cortisol/prolactin spike (Ipamorelin), GHRH analog half-life extension via DAC (CJC-1295), pulsatile-restoration rationale for stacking the two.
- `src/pages/goals/LibidoPeptidesSA.tsx` — slug `libido-peptides-south-africa`, H1 "PT-141 South Africa", cards: `pt141`. Research paragraphs: melanocortin MC4R agonism (central, not vascular like PDE5 inhibitors), Phase 3 / Vyleesi context, dose timing and known nausea/flush side-effect profile.

All pages use the existing `GoalPage` component, so they automatically get: SEOHead + CollectionPage JSON-LD, breadcrumbs, badge, card grid with auto-links to `/peptides/:slug` entity pages, SAHPRA disclaimer block, research disclaimer.

**Edit**
- `src/App.tsx` — add 3 lazy imports + 3 `<Route>` entries above the catch-all.
- `scripts/generate-sitemap.ts` — append the 3 paths to `staticEntries` (priority 0.9, monthly). Sitemap regenerates on next `predev`/`prebuild`.

### Out of scope (re-flagging)

App still uses `HashRouter`, so these resolve as `/#/cognitive-peptides-south-africa` — Google indexes hash routes poorly. Same pre-existing caveat; not addressed here.
