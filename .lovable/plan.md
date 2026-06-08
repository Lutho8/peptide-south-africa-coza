## Bloodwork Results Enhancement

Add three new sections above the existing biomarker panel in `BloodworkResults.tsx`, plus a stack-builder cart that replaces the static "Buy this stack" CTA in `ProtocolSections.tsx`. All link to https://www.ridethetide.site/ with UTM tracking.

### 1. System Dashboard (6 cards at top)
New component `SystemDashboard.tsx`. Six health systems mapped from biomarker categories:

| Card | Sourced from biomarker categories |
|---|---|
| Hormones | hormone, thyroid |
| Metabolic | metabolic |
| Cardiovascular | lipid |
| Liver | liver |
| Kidney | kidney |
| Immune & Inflammation | inflammation |

Each card shows: icon, system name, status pill (Optimal / Watch / Action — derived from worst biomarker status in the group), count of flagged markers, and a sparkline-style ring. Click a card → scrolls to / filters the biomarker panel by that category. Rendered as a responsive grid (3 cols desktop, 2 mobile).

### 2. Pattern Detection
New component `PatternDetection.tsx` + pure helper `src/lib/bloodwork/patterns.ts`. Helper takes `ResultBiomarker[]` and returns matched patterns from a rules table, e.g.:

- **Immune Dysregulation + Metabolic Stress** — high CRP/WBC + high fasting glucose/HbA1c/insulin
- **Androgen Decline** — low total/free testosterone + high SHBG
- **Cardiometabolic Risk** — high ApoB/LDL + low HDL + high triglycerides
- **Thyroid Slowdown** — high TSH + low free T3/T4
- **Liver Strain** — high ALT/AST/GGT
- **Inflammation-Driven Fatigue** — high hs-CRP + low ferritin/vit D

UI: stacked cards under the dashboard. Each shows pattern name, plain-English explanation, the contributing biomarkers as chips, and a "View suggested stack" button that jumps to the matching peptides in the stack builder.

### 3. Stack Builder Cart
New component `StackBuilder.tsx` replacing the single buy-link in `ProtocolSections.tsx`'s Peptide Stack section. Behavior:

- Each `StackPeptideCard` gets a checkbox / "Add" toggle.
- Selected peptides accumulate in a sticky bottom cart bar (count + names).
- Cart has primary CTA **"Buy Stack on RideTheTide"** → opens `https://www.ridethetide.site/shop?utm_source=app&utm_medium=bloodwork&utm_campaign=stack&items=<slug,slug>` in new tab.
- Fires `captureLead` (`source: 'bloodwork_stack_buy'`, payload includes selected peptide slugs + matched patterns) before navigation, reusing the existing CRM hook.
- Empty-state CTA: "Select peptides to build your stack" with a "Select all recommended" shortcut.

### 4. Onboarding / Purchase Nudge Improvements
- Add a one-time **results onboarding overlay** (3 tooltips: "Here's your system view" → "These are your patterns" → "Build & buy your stack"). Stored in `localStorage` (`rtd_bloodwork_onboarded_v1`).
- After results render, a slide-in toast appears at 8s if no peptide has been added to the cart: "Ready to start? Shop your protocol on RideTheTide →".
- The existing "Download PDF" button stays; add a secondary **"Shop my stack"** button next to it in the header that scrolls to the cart.

### Wiring
- `BloodworkResults.tsx` mounts: `<SystemDashboard>`, `<PatternDetection>`, then the existing biomarker panel, insights, and `<ProtocolSections>` (which now renders `<StackBuilder>`).
- Selected-peptide state lifts to `BloodworkResults` via a `StackCartProvider` (React context in `src/components/bloodwork/StackCartContext.tsx`) so the sticky cart, header button, and protocol-section cards all share it.
- All shop links use the canonical `https://www.ridethetide.site/shop` (per project memory — apex is broken, always use `www`).

### Technical notes (files touched)
- New: `src/components/bloodwork/SystemDashboard.tsx`, `PatternDetection.tsx`, `StackBuilder.tsx`, `StackCartBar.tsx`, `StackCartContext.tsx`, `BloodworkOnboarding.tsx`
- New: `src/lib/bloodwork/patterns.ts`, `src/lib/bloodwork/systems.ts`
- Edit: `src/components/bloodwork/BloodworkResults.tsx` (mount new sections, header CTA, provider)
- Edit: `src/components/bloodwork/ProtocolSections.tsx` (replace single buy CTA with `<StackBuilder>`)
- Edit: `src/components/bloodwork/StackPeptideCard.tsx` (add `selectable` + `selected` props with checkbox)

No DB or edge-function changes. No new dependencies. Pure presentation + client logic.
