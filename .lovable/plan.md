## Fix 1 — Bloodwork "Scan interrupted" error

**Root cause:** `supabase/functions/analyze-lab-report/index.ts` line 235 references an undefined variable `imageBase64` when building the AI request. The download step assigns the file bytes to `base64`, but the fetch body still uses the old name. Every scan throws `ReferenceError: imageBase64 is not defined`, which the client maps to "Couldn't reach the AI service."

Additional issue: PDFs are sent as `image_url`, which the AI gateway rejects. PDFs must use the `file` content type per the multimodal input spec.

**Changes to `supabase/functions/analyze-lab-report/index.ts`:**
- Replace `imageBase64` with `base64`.
- Branch on `resolvedMime`: for `application/pdf`, send `{ type: "file", file: { filename, file_data: "data:application/pdf;base64,..." } }`; for images, keep the `image_url` block.

Redeploy the function; retest via the Bloodwork wizard.

## Fix 2 — Experience-level segmented control in Add-to-Stack

**Where:** `src/components/modals/EditStackModal.tsx` (the Add-to-Stack form on My Stack).

**Changes:**
1. Extend `StackItem` with an optional `experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'athlete'` (already supported on `ActiveStackItem` in storage; propagate through `onSave`).
2. In the "Add Peptide" form, add a 4-way segmented control (Beginner / Intermediate / Advanced / Athlete) above the Dose/Frequency inputs. Default = the user's profile experience (`getUserProfile().experience`) or `intermediate`.
3. When the peptide is selected OR the tier changes, auto-populate the `Dose` and `Frequency` inputs from `peptide.dosing[tier]` (parsed via existing `doseParser` to split "dose" vs "frequency"). User can still edit manually.
4. Persist `experienceLevel` on the stack item so downstream dosing recommendations, PK sim, and reminder scheduling use the chosen tier (existing `ActiveStackItem.experienceLevel` field already flows through `scheduleCycleReminders` / `RecommendedDoseDisplay`).
5. Show the tier as a small badge on each existing stack row so users can see/change per-peptide tier inline.

**Files touched:**
- `src/components/modals/EditStackModal.tsx` — UI + state + auto-fill logic.
- `src/screens/MyStackScreen.tsx` — pass `experienceLevel` through the `onSave` handler into `setActiveStack`.
- `src/services/storage.ts` — already has `experienceLevel` on `ActiveStackItem`; no schema change needed.

No backend or data-model migration required.
