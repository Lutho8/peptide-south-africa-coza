## 1. Dual-route dosing on peptides

Extend each affected peptide's `dosing` field so it can carry per-route AND per-sex tables, while remaining backward-compatible with the current flat `{ beginner / intermediate / advanced / athlete }` shape.

New optional shape (added alongside the existing flat shape):

```ts
dosing: {
  // legacy flat fields kept for fallback
  beginner: string; intermediate: string; advanced: string; athlete: string;

  routes?: {
    intranasal?: DoseTable;
    subcutaneous?: DoseTable;
  };
}

type DoseTable = {
  beginner:     { male: string; female: string; notes?: string };
  intermediate: { male: string; female: string; notes?: string };
  advanced:     { male: string; female: string; notes?: string };
  athlete:      { male: string; female: string; notes?: string };
  frequency: string;           // e.g. "1× daily, morning"
  cycleDays: string;           // e.g. "14–30 on / 14 off"
  sourceNotes?: string;        // latest reference summary
}
```

Peptides updated with both routes (from an audit of `administration:` fields):
- Selank
- Semax
- N-Acetyl Selank Amidate (NA-Selank)
- N-Acetyl Semax Amidate (NA-Semax)
- DSIP (already flagged "Subcutaneous or intranasal")
- Oxytocin
- PT-141 (verify — commonly SC + intranasal)
- Kisspeptin-10 (verify — SC + intranasal)
- Epithalon / N-Acetyl Epitalon Amidate (SC + intranasal variants)
- VIP (intranasal + SC in research use)
- P21 (intranasal + SC in research use)

Dose values sourced from current peer-reviewed and research-community references (2024–2026); each peptide's `sourceNotes` will summarize provenance. Female values default to 80–85% of male dose where sex-specific data is thin, with an explicit `notes` caveat, matching the app's existing "research-only" framing.

Example (Selank):

```text
Intranasal:  Beginner 250 mcg/day M / 200 mcg/day F
             Intermediate 500 mcg/day M / 400 mcg/day F
             Advanced 750 mcg/day M / 600 mcg/day F
             Athlete 500 mcg 2×/day M / 400 mcg 2×/day F
Subcutaneous: Beginner 100 mcg/day M / 80 mcg/day F
              Intermediate 200 mcg/day M / 160 mcg/day F
              Advanced 300 mcg/day M / 250 mcg/day F
              Athlete 200 mcg 2×/day M / 160 mcg 2×/day F
```

Similar tables added for Semax and each peptide above. All values remain in **mg/IU/units**, never mcg-only in UI (mcg used only for intranasal micro-doses where clinically standard; UI will render both mcg and mg equivalents).

## 2. Dashboard Dosing Schedule surfaces

- `RecommendedDoseDisplay`, `DosingReference`, `DosageScreen`, `PeptideEntityPage`, and `EditStackModal` read the new `dosing.routes` when present.
- Add a **Route toggle** (Intranasal / Subcutaneous) that appears only when both routes exist for the selected peptide.
- Add a **Sex indicator** driven by `profile.sex` (Male / Female / Not set → shows male column with note).
- The existing experience-tier segmented control (Beginner / Intermediate / Advanced / Athlete) drives the row lookup.
- Fallback: if `dosing.routes` is missing, behavior is unchanged.

## 3. "Last dose" reminder in Daily Log

In `DailyLogScreen`, above the day's entry list, render a compact `LastDoseRecall` card per peptide currently in the user's active stack:

```text
┌─ Selank ─────────────────────────────┐
│ Last dose: 250 mcg intranasal        │
│ Yesterday, 08:12 · 22 h 40 m ago     │
│ Next due (schedule): today ~08:00    │
│ [Log same again]  [Edit]             │
└──────────────────────────────────────┘
```

Data source:
- Pull last entry from `useDailyDoses` filtered by `peptideId`, sorted desc.
- Compute "next due" from the peptide's `frequency` + `cycleProgress` (already in `src/lib/cycleProgress.ts`).
- "Log same again" pre-fills the Add-Dose modal with the previous dose/unit/route/time = now.

Mobile: card is 44px+ touch targets, horizontally scrollable when >2 active peptides, matches existing glassmorphism style.

## 4. Files to edit

- `src/data/peptides.ts` — add `dosing.routes` to Semax (and any others in this file).
- `src/data/peptidesExpanded.ts` — add `dosing.routes` to Selank, DSIP, Oxytocin, PT-141, Kisspeptin, Epithalon variants, VIP, P21.
- `src/data/peptidesNewCatalog.ts` — NA-Selank, NA-Semax.
- `src/components/dosage/RecommendedDoseDisplay.tsx` — route/sex-aware lookup + toggle.
- `src/components/doses/DosingReference.tsx` — respect selected route.
- `src/components/modals/EditStackModal.tsx` — persist `route` per StackItem alongside `experienceLevel`.
- `src/screens/DosageScreen.tsx` and `src/pages/PeptideEntityPage.tsx` — render both route tables when present.
- `src/screens/DailyLogScreen.tsx` — insert new `LastDoseRecall` list.
- `src/components/doses/LastDoseRecall.tsx` — new component.
- `src/hooks/useDailyDoses.ts` — expose `getLastDoseByPeptide(peptideId)`.

No schema/RLS changes required; `route` is stored client-side on the StackItem and daily dose entry (already free-form JSON).

## 5. Out of scope

- No changes to bloodwork, notifications infrastructure, or cycle reminder scheduler beyond reading `dosing.routes` when computing next dose text.
- No new AI calls; dosing data is static.
