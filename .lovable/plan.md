

## Plan: Goal-tuned stack picker, profile re-edit, and AI prompt verification

Three tightly-related improvements that lean on the goals collected in the Profile Setup wizard:

### 1. Goal-aware EditStackModal (`src/components/modals/EditStackModal.tsx`)

Highlight peptides/blends that match the user's saved goals so a new member intuitively picks what aligns with their priorities.

- Read `profile.goals` from `getUserProfile()` on open.
- Add a small `goalToCategories` map (in `src/data/entitySlugs.ts` or a new `src/data/goalMap.ts`) e.g.:
  - `Fat Loss` → `weight-loss`, `metabolic`
  - `Muscle Gain` → `gh-secretagogue`
  - `Recovery & Healing` → `healing`, `immune`
  - `Longevity` → `longevity`, `anti-aging`
  - `Cognitive Edge` → `cognitive`
  - `Energy & Performance` → `gh-secretagogue`, `metabolic`
  - `Sleep Quality` → `gh-secretagogue`
  - `Metabolic Health` → `metabolic`, `weight-loss`
- In the Select dropdown, split `availablePeptides` into:
  - **"Recommended for your goals"** group (matches user goal categories) — shown first, with a small `Sparkles` icon and pulse-tinted background.
  - **All other peptides / blends** — existing groups below.
- Add a one-line helper banner above the Select: `"Tuned to: Fat Loss, Recovery"` chips, mirroring the style already used in `AIAgentPanel`.
- If the user has no goals yet, show a soft inline CTA: *"Complete your profile to see recommended peptides"* linking to Settings.

### 2. Edit Profile shortcut in Settings (`src/screens/SettingsScreen.tsx`)

Let users re-run the wizard anytime to refresh goals, weight, experience.

- Add a new card in the existing **Profile** section: `"Update goals & body stats"` button.
- Clicking opens `<ProfileSetupWizard open={...} onComplete={...} />` (same component already used in `Index.tsx`).
- After completion, refresh local `profile` state via `getUserProfile()` so the avatar/age/activity line updates immediately.
- Wizard already pushes to Supabase via `useProfileSync`, so cross-device sync is automatic.

### 3. Verify AI references the goals chips

Audit only — no UI build, but confirm the wiring works end-to-end:

- `MyStackScreen.tsx` already passes `userGoals={profile.goals}` to both `AIAgentPanel` modes (`recommend` + `optimize`). ✓
- `usePeptideAI.ts` forwards `userProfile.goals` in the body. ✓
- `peptide-ai-agent/index.ts` injects `Goals: ${userProfile.goals?.join(", ")}` into BOTH the recommend and optimize prompts. ✓

The pipeline is intact. To make the AI **explicitly cite** goals (so users see them echoed back), tighten the system prompts:

- In `recommend` system prompt, add: *"Begin your response by acknowledging the user's selected goals verbatim, then explain how each recommendation maps to those goals."*
- In `optimize` system prompt, add: *"Reference the user's stated goals throughout your analysis. For each suggestion, name which goal it advances."*

This guarantees the chips shown in the UI ("Tuned to: Fat Loss, Recovery") appear in the AI output, closing the loop.

### Files touched

```text
src/components/modals/EditStackModal.tsx   ← goal-grouped Select + chips
src/screens/SettingsScreen.tsx             ← Edit Profile card + wizard mount
src/data/goalMap.ts                        ← NEW: goal → category map (small)
supabase/functions/peptide-ai-agent/       ← prompt tightening (recommend + optimize)
  index.ts
```

No DB migrations. No new dependencies. ProfileSetupWizard, useProfileSync, and AIAgentPanel are reused as-is.

