# Plan: Robust Landing + PWA Install Verification

## 1. PWA Install Verification Step

**New component:** `src/components/pwa/InstallVerification.tsx`
- Runs after user attempts install (or on demand from `PWAInstallJourney`).
- Checks, per platform:
  - `isStandalone()` true → ✅ Installed
  - Service worker registered + `controller` active → ✅ Offline runtime ready
  - Cache populated (`useOfflineReadiness` status === `ready`, `cachedAssets > 0`) → ✅ Offline assets cached
  - Network offline simulation: fetch `/offline.html` from cache → ✅ Offline fallback verified
- iOS-specific: detects `navigator.standalone`; if Safari but not standalone after attempt → show "Tap Share → Add to Home Screen" troubleshooting card.
- Android-specific: if `beforeinstallprompt` never fired → show "Open in Chrome / enable Site Settings → Install" troubleshooting with `chromeIntentUrl()` deep link.
- Generic troubleshooting accordion: HTTPS check, browser support, storage quota, "Clear cache & retry" button (unregisters SW + reloads).
- Emits analytics: `install_verification_started`, `install_verification_passed`, `install_verification_failed` (with reason code).

**Integration:** Append as final step in `PWAInstallJourney.tsx` and `InstallAppStep.tsx` after install CTA.

## 2. Safe Section Loading in LandingPage

**New util:** `src/components/landing/SafeSection.tsx`
- Wraps children in `ErrorBoundary` + `Suspense`.
- Accepts `name`, `component` (lazy ref or eager), `enabled` flag.
- If component resolves to `undefined`/`null` (failed export), logs once and renders nothing instead of crashing.

**Feature flags:** `src/lib/landingSections.ts`
```ts
export const LANDING_SECTIONS = {
  pwaJourney: true,
  testimonials: true,
  howItWorks: false, // off until re-imported
  ...
};
```

**LandingPage.tsx changes:**
- Wrap each section in `<SafeSection name="..." enabled={LANDING_SECTIONS.x}>`.
- For `HowItWorks` specifically: lazy-import with try/catch fallback. Only render if the module exports the symbol AND the flag is on.
- Remove any direct JSX reference to symbols not imported at the top of the file.

## 3. LandingPage ErrorBoundary

- Reuse existing `src/components/ui/ErrorBoundary.tsx`.
- Wrap entire `<main>` in `LandingPage.tsx` with `<ErrorBoundary fallbackTitle="The landing page hit a snag">`.
- Friendly recovery UI: brand-styled card with logo, "Reload" + "Go to dashboard" buttons, plus a hidden details panel for the error message (dev only).
- Each lazy section additionally wrapped in its own `SafeSection` boundary so one bad section doesn't take down the whole page.

## 4. Pre-build Static Check

**New script:** `scripts/check-landing-symbols.mjs`
- Parses `src/components/landing/LandingPage.tsx` with a lightweight regex/AST pass.
- Extracts every JSX identifier starting with a capital letter (`<Foo`).
- Verifies each is either imported at the top of the file OR defined locally.
- Fails (`process.exit(1)`) with a clear "Undefined component: HowItWorks" message listing the offending line.

**Wire-up:**
- Add npm script `"check:landing": "node scripts/check-landing-symbols.mjs"`.
- Add `"prebuild": "npm run check:landing && tsc --noEmit -p tsconfig.app.json"` so undefined components and TS errors block `vite build`.
- Note: Lovable preview won't run prebuild, but the boundary + safe sections cover that path; the static check protects published builds.

## Files

**New**
- `src/components/pwa/InstallVerification.tsx`
- `src/components/landing/SafeSection.tsx`
- `src/lib/landingSections.ts`
- `scripts/check-landing-symbols.mjs`

**Edited**
- `src/components/landing/LandingPage.tsx` — ErrorBoundary wrap, SafeSection per section, feature-flagged HowItWorks
- `src/components/landing/PWAInstallJourney.tsx` — append InstallVerification step
- `src/components/onboarding/InstallAppStep.tsx` — append InstallVerification
- `src/lib/analytics.ts` — add verification event names (no breaking change)
- `package.json` — `check:landing` + `prebuild` scripts

## Out of scope
- No backend/RLS changes.
- No redesign of existing install journey visuals — only appends verification step.
- No changes to service worker (`public/sw.js`).
