# Bloodwork UX Redesign Plan

## Problems with the current design

1. **Cognitive overload** — hero, form (4 sections), and two tier cards all visible at once. Users don't know where to start.
2. **Two competing CTAs** ("Baseline" vs "Deep Decode") shown before the user has even uploaded a file.
3. **Weak hierarchy** — numbered "01/02/03" labels appear in both hero and form, blurring what's instructional vs interactive.
4. **Underline inputs + dashed dropzone + pill goals** mix three different visual languages.
5. **Hero "01/02/03 steps"** are decorative — they don't reflect the actual flow state.
6. **Submit area is sticky on the right but disabled by default** with a tiny gray hint — users miss why nothing happens.
7. Mobile: the right sidebar stacks below a long form, so the CTA is buried.

## Proposed flow — guided 4-step wizard

Replace the all-at-once form with a horizontal stepper. One focused step on screen at a time. The hero collapses into a slim title bar after step 1.

```text
[ 1 Upload ] ── [ 2 About you ] ── [ 3 Goals ] ── [ 4 Review & scan ]
```

- Step indicator is sticky at top (under page header), shows progress and lets users jump back.
- Each step has: a clear question, the input, and a single primary "Continue" button (disabled until valid).
- Step 4 is the only place the **scan tier choice** appears — as two equal cards with a recommended badge.

### Step content

1. **Upload** — Big, friendly dropzone (cleaner: solid border, subtle gradient on hover, file-type chips). Below: "Sample report" link to show what good input looks like. Privacy reassurance line ("Encrypted · deleted after analysis").
2. **About you** — Age + Sex as proper labeled fields (not underline-only). Optional skip link ("Skip — use general ranges").
3. **Goals** — Pill grid with icons per goal, max 3 selectable, with helper text "Pick up to 3 — your protocol focuses here." Peptide history Yes/No with conditional textarea here too (it's about *you*, not the lab).
4. **Review & scan** — Two-column summary card on top (file, age/sex, goals). Below it, the two tier cards side-by-side. "Deep Decode" gets a "Recommended" ribbon. One CTA per card. Disclaimer below.

## Visual cleanup

- Replace the dashed dropzone with a soft solid border + tinted background; success state shows a thumbnail/icon + filename + "Replace" link.
- Unify form inputs to use proper Label + Input/Select components (drop the underline-only style).
- Replace mono "01 — TITLE" eyebrows with simple step headings ("Step 1 of 4 · Upload bloodwork").
- Tier cards: equal weight, single primary action, "Recommended" badge on Deep Decode. Show what's *different* (biomarker count, follow-ups) as a small comparison row instead of long paragraphs.
- Progress/scan-running state takes over the whole right panel as a centered, larger card so it's unmistakable.
- Error state inline with the step that caused it (instead of replacing the tier cards silently).

## Mobile

- Stepper compresses to "Step 2 of 4 · About you" + dots.
- CTA pinned to bottom of viewport on each step (`sticky bottom-0`) so users always see it.
- Tier cards stack vertically on step 4; sticky CTA hides on this step.

## Results screen polish (light pass)

- Add a sticky summary header showing health score + scan type while the user scrolls long results.
- "Run another scan" becomes a proper outline button at top-right, not a small text link.

## Technical changes (frontend only)

- New file `src/components/bloodwork/BloodworkWizard.tsx` — owns step state (`1 | 2 | 3 | 4`), wraps existing `ScanForm` fields split across steps.
- Refactor `ScanForm.tsx` into smaller step components: `StepUpload.tsx`, `StepAbout.tsx`, `StepGoals.tsx`, `StepReview.tsx` (re-using existing `ScanFormState` type — no logic change).
- New `BloodworkStepper.tsx` — sticky stepper with click-to-jump for completed steps.
- Trim `BloodworkHero.tsx` to a slim header used only on step 1; remove duplicated 01/02/03 marketing block (the wizard itself is the flow now).
- Update `ScanTierCards.tsx` — equal cards, "Recommended" ribbon, comparison row, no sticky positioning (lives inside step 4).
- `BloodworkPage.tsx` — replace the `ScanForm` + sidebar grid layout with `<BloodworkWizard>`. All scan logic, premium gate, edge function calls, and result rendering remain unchanged.

No backend changes, no new dependencies, no data model changes.
