## Plan: Fix OAuth sign-in + Bloodwork CTAs

Two distinct bugs. Both fixed in one pass.

---

### 1. Google / Apple sign-in does not work

**Root cause.** `src/contexts/AuthContext.tsx` calls `supabase.auth.signInWithOAuth` directly. This project already has the Lovable-managed OAuth shim (`src/integrations/lovable/index.ts` + `@lovable.dev/cloud-auth-js`), which is the supported path on Lovable Cloud. The raw Supabase call needs the provider configured in the dashboard and proper redirect URLs — on Lovable Cloud projects this is the wrong call and silently fails / loops.

Apple is also gated behind a hardcoded `APPLE_SIGNIN_ENABLED = false` in `AuthModal.tsx`, so the Apple button is never rendered.

**Changes**
- Update `AuthContext.signInWithOAuth` to call `lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin })` and handle the `{ redirected, error, tokens }` result per the managed-OAuth contract. Keep the existing signature so `AuthModal` doesn't change shape.
- Re-run `supabase--configure_social_auth` with `providers: ["google", "apple"]` so both managed providers are wired up on the backend.
- Flip `APPLE_SIGNIN_ENABLED = true` in `AuthModal.tsx` so the Apple button renders.
- Keep the existing root-path `handleRootOAuthCallback` for backward compatibility, but stop relying on it as the primary path (managed flow sets the session directly).

---

### 2. "Run Baseline" / "Run Deep Decode" don't push results

**What's happening.** `runScan` in `BloodworkPage.tsx` swallows several failure modes:
- File-size error sets `error` but `progress` is never started, so the `ScanError` panel renders without context and the user sees no transition.
- `mapScanError` returns an empty string for aborts, which causes the catch branch to reset progress silently — any non-Error throw (e.g. a JSON-parse failure inside the function) can fall into a path where `running` clears but the user sees nothing happen.
- The `analyze-lab-report` edge function failures only surface their `fnError.message`, which for non-2xx responses from `supabase.functions.invoke` is the generic `"Edge Function returned a non-2xx status code"` — invisible to the user.

DB/storage are fine (`lab-reports` bucket exists, `lab_reports` table + RLS in place).

**Changes**
- In `BloodworkPage.runScan`:
  - When the edge function returns `fnError`, also pull `data?.error` / `data?.message` from the response body and include it in the thrown message, so the wizard's `ScanError` panel shows the real reason (quota, parse failure, etc.).
  - Always `progress.start()` before any early-return validation (file size) so the status panel actually mounts.
  - Treat empty `mapScanError` results as a generic "Scan was cancelled or failed silently — please retry" instead of resetting with no UI.
- In `supabase/functions/analyze-lab-report/index.ts`: ensure every error path returns `{ error: <human message> }` with a 200 (or include the body on non-2xx) so the client can surface it. No business-logic change.
- Add `console.error` breadcrumbs around upload / insert / invoke so failures show up in the browser console for future debugging.

---

### Files touched

- `src/contexts/AuthContext.tsx` — swap to `lovable.auth.signInWithOAuth`.
- `src/components/auth/AuthModal.tsx` — enable Apple button.
- `src/pages/BloodworkPage.tsx` — surface edge-function errors, fix early-return UX, add breadcrumbs.
- `supabase/functions/analyze-lab-report/index.ts` — normalize error responses.
- Backend: call `supabase--configure_social_auth` with `["google","apple"]`.

No DB migrations, no new dependencies, no UI redesign.
