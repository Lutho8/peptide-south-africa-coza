## Goal

Tighten the install journey to be platform-accurate, persistent across returns, offline-aware, and instrumented so we can see where users drop off.

## 1. Platform detection & CTA state machine

New helper `src/lib/pwaInstall.ts`:

- `detectPlatform()` → `'ios' | 'ios-non-safari' | 'android-chrome' | 'android-other' | 'desktop'`
  - iOS via `/iPad|iPhone|iPod/`; "non-Safari" when `CriOS|FxiOS|EdgiOS` matches.
  - Android via `/Android/`; "chrome" when `Chrome/` present and `SamsungBrowser|EdgA|OPR|UCBrowser` absent.
- `isStandalone()` → `display-mode: standalone` or iOS `navigator.standalone`.
- `getInstallCtaState({ isInstallable, isInstalled, platform })` returns a discriminated union used by both the landing journey and the onboarding modal:
  - `installed` — show "Installed on this device" badge, hide steps.
  - `native-prompt` — Android Chrome + `beforeinstallprompt` available → show **Install Now** sparkle button (preferred path).
  - `manual-android-chrome` — Chrome but no prompt yet → show "Tap ⋮ → Install app" steps and a retry button that re-checks `isInstallable`.
  - `manual-android-other` — Samsung/Firefox/etc. → show "Add to Home screen" wording (not "Install app"), plus a "Best in Chrome" hint with a one-tap intent link `intent://ridethetide.info#Intent;scheme=https;package=com.android.chrome;end`.
  - `manual-ios-safari` — show the four Safari steps.
  - `manual-ios-non-safari` — show a warning card: "Add to Home Screen only works in Safari on iOS" plus a "Copy link & open in Safari" button.
  - `desktop` — show a "Open this page on your phone" card with a QR code (use existing `qrcode` if present, otherwise a lightweight inline `<canvas>` generator — to be confirmed in build; fall back to plain URL if no lib).

## 2. Refined iOS Safari steps + screenshots

Update `PWAInstallJourney.tsx` and `InstallAppStep.tsx` iOS copy to match the current Safari flow exactly:

1. Open `ridethetide.info` in **Safari** (not Chrome / in-app browser).
2. Tap the **Share** button (square with up arrow) in the bottom tab bar (or top-right on iPad).
3. Scroll and tap **"Add to Home Screen"**.
4. Edit the name if you'd like, then tap **"Add"** in the top-right.

Platform-specific screenshots:

- Generate two on-brand illustrated guides (not real-device captures, to avoid Apple/Google trademark issues) via `imagegen--generate_image`, `transparent_background: false`, saved to `src/assets/install-ios.png` and `src/assets/install-android.png`. Style: dark `#0F172A` background, primary `#3B82F6` accents, glassmorphism phone frame with the four numbered call-outs aligned to each step. Reuse the brand palette and SF-style typography hints from `mem://design/branding-ride-the-tide`.
- Render as a responsive 2-col layout on the landing (steps left, illustration right). On the onboarding modal, render the illustration above the steps on mobile.
- Use `loading="lazy"` and explicit width/height to avoid CLS.

## 3. Saved onboarding progress checklist

New store at `src/lib/onboardingProgress.ts` backed by `localStorage` under `rtd-onboarding-progress` (versioned JSON, namespaced by `user.id` when available, falls back to `anon`):

```ts
type OnboardingStepId =
  | 'account_created'
  | 'install_viewed'
  | 'install_attempted'
  | 'install_completed'
  | 'profile_setup'
  | 'first_dose_logged'
  | 'dashboard_tour';
```

- API: `getProgress()`, `markStep(id, meta?)`, `isComplete(id)`, `subscribe(cb)` (custom event `rtd-onboarding-progress` for cross-component sync).
- `install_completed` is set automatically on first launch when `isStandalone()` returns true (i.e. user came back via the home-screen icon) — this is what "marks the install steps complete after the user returns to the app" means in practice.
- `install_attempted` is set when:
  - Android: `beforeinstallprompt.prompt()` resolves (regardless of outcome — outcome stored in meta).
  - iOS: user taps the "I've added it" confirmation button (new affordance, see below).
- The `appinstalled` event in `usePWAInstall` also flips `install_completed`.

UI:

- New compact `OnboardingChecklist.tsx` rendered (a) at the bottom of the landing install journey for signed-in users, (b) on the dashboard `HomeScreen` above `WelcomeGuide` until all steps are complete, and (c) inside `InstallAppStep` modal. Shows 4–6 items with `Check`/`Circle` icons, progress bar, and "X of Y complete". Auto-collapses when 100%.
- Add an "I've added it to my Home Screen" confirm button at the bottom of the iOS steps so users without `beforeinstallprompt` can self-report completion.

## 4. Offline-ready status badge

The existing service worker (`public/sw.js`) currently kills caches. Plan stays read-only on SW behaviour — only surface what's already true:

- New hook `useOfflineReadiness()` returns `{ status: 'unknown' | 'caching' | 'ready' | 'unsupported', cachedAssets, lastUpdated }`.
  - `status: 'ready'` when `navigator.serviceWorker.controller` is non-null AND at least one cache in `caches.keys()` matches `/^workbox|rtd-/`.
  - `status: 'caching'` while a registration is `installing` or `waiting`.
  - `status: 'unsupported'` when no `serviceWorker` API (older iOS Safari versions) — show an honest "Offline cache unavailable on this browser" note.
  - `lastUpdated` from a `localStorage` timestamp updated on `controllerchange`.
- New `OfflineReadyBadge.tsx` pill with `WifiOff`/`Wifi`/`CloudCheck` icons and live status. Inserted into:
  - `PWAInstallJourney` hero (next to the "Progressive Web App" chip).
  - `InstallAppStep` modal footer.
  - `SettingsScreen` near the existing "Storage" area as a passive status.
- Brief explanation card under section 2 (next to the existing benefit grid): **"What works offline"** — list (Dose tracker, peptide profiles, bloodwork drafts, reminders) vs **"Needs internet"** (sync, AI agent, COA upload). Copy reflects what the app actually ships; no new caching code.

## 5. Analytics events

Lightweight, vendor-neutral wrapper so we can ship today and bind to GA4 / PostHog later without rewriting call sites:

- New `src/lib/analytics.ts` exposing `track(event: string, props?: Record<string, unknown>)`.
  - Pushes to `window.dataLayer` if present (GTM-ready).
  - Calls `window.posthog?.capture` if present.
  - Always emits a `CustomEvent('rtd-analytics', { detail })` on `window` (lets us tail in DevTools).
  - In dev (`import.meta.env.DEV`) also `console.debug('[analytics]', event, props)`.
  - No new dependency.

Events fired from the install journey + onboarding modal:

| Event | When |
|---|---|
| `install_journey_viewed` | `PWAInstallJourney` first enters viewport (`whileInView`, `once: true`) |
| `install_modal_opened` | `InstallAppStep` mounts with `open=true` |
| `install_platform_detected` | On mount, props: `{ platform, isInstallable, isStandalone }` |
| `install_tab_switched` | User toggles iOS/Android tab, props: `{ from, to }` |
| `install_step_viewed` | Each numbered step's first reveal (IntersectionObserver per step) — props: `{ platform, step }` |
| `install_prompt_attempted` | Android `install()` invoked — props: `{ trigger: 'hero' | 'steps' | 'modal' }` |
| `install_prompt_outcome` | `beforeinstallprompt` userChoice resolves — props: `{ outcome }` |
| `install_self_reported` | iOS "I've added it" tap |
| `install_completed` | `appinstalled` event OR first `isStandalone()` launch (deduped via `onboardingProgress`) |
| `install_modal_skipped` | User clicks Skip/X |
| `onboarding_step_completed` | Any `markStep` call — props: `{ step, total, completed }` |
| `onboarding_completed` | When all checklist items reach complete |

All call sites batched through `track()` so swapping providers is a single-file change.

## File touch list

New:
- `src/lib/analytics.ts`
- `src/lib/pwaInstall.ts`
- `src/lib/onboardingProgress.ts`
- `src/hooks/useOfflineReadiness.ts`
- `src/components/onboarding/OnboardingChecklist.tsx`
- `src/components/pwa/OfflineReadyBadge.tsx`
- `src/assets/install-ios.png` (generated)
- `src/assets/install-android.png` (generated)

Edited:
- `src/components/landing/PWAInstallJourney.tsx` (platform state machine, screenshots, badge, analytics, checklist)
- `src/components/onboarding/InstallAppStep.tsx` (same state machine, iOS confirm button, analytics)
- `src/hooks/usePWAInstall.ts` (fire `install_attempted` / `install_completed`, expose `userChoice`)
- `src/screens/HomeScreen.tsx` (render `OnboardingChecklist` above `WelcomeGuide` until complete)
- `src/screens/SettingsScreen.tsx` (passive `OfflineReadyBadge`)
- `src/pages/Index.tsx` (mark `install_completed` on standalone launch)

## Out of scope

- No changes to service worker caching strategy or `vite-plugin-pwa` config.
- No new analytics SDK dependency — just the wrapper.
- No backend table for onboarding progress (localStorage only; can be promoted to Supabase later).
- No App Store / Play Store work — PWA-only by brand decision.
