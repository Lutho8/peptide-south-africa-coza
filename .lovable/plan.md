# Fix: Daily Log failed to load

## Root cause

The Daily Log screen itself is fine. The whole app is being covered by a Vite error overlay:

```
[plugin:vite:import-analysis]
Failed to resolve import "@/components/ui/toaster" from "src/App.tsx"
```

Verification:
- `src/components/ui/toaster.tsx` exists on disk (24 lines, valid `Toaster` export).
- `src/App.tsx` imports it via the correct alias.
- `tsconfig` paths and `vite.config` alias for `@` are unchanged.

This is a stale Vite import-analysis error from an earlier moment when the file was briefly missing/renamed. The dev server cached the failure and hasn't re-resolved the now-existing module. The overlay sits on top of every route, which is why Daily Log (and any other tab) renders the generic "failed to load" fallback after you dismiss it.

## Fix

1. Restart the Vite dev server so it re-runs import analysis against the current file tree. No code change needed — the source is already correct.
2. After restart, load `/` and click Daily Log to confirm the overlay is gone and the screen renders normally.
3. If the overlay returns, re-check `src/components/ui/toaster.tsx` for accidental deletion or rename and restore it.

## Why no code edits

The user's reported symptom is a runtime/build-cache issue, not a logic bug in `DailyLogScreen.tsx` or `useDailyDoses`. Editing those would not clear the Vite overlay.
