# Auto cache-bust for installed users

The app already ships a custom service worker (`public/sw.js`) that powers offline caching and background dose reminders. Installed users are stuck on the old `peptide-tracker-v5` cache, which still holds the old HTML, old `manifest.json`, and old icon files — so even after we bumped icons to `?v=3` and the cache to `v6`, returning users keep seeing the old "Ride The Tide" name and logo until they manually reinstall.

This plan adds an automatic update path so the next time an installed user opens the app, the new service worker takes over, old caches are wiped, and the page reloads once with the fresh icon and name.

## What changes

1. **`public/sw.js` — make it update-friendly**
   - Bump `CACHE_NAME` to `peptide-tracker-v7` so the new SW evicts every previous cache during `activate` (the existing activate handler already deletes any cache whose name doesn't match).
   - Add a `message` listener that calls `self.skipWaiting()` when the page sends `{ type: 'SKIP_WAITING' }`, so the new worker can take control immediately instead of waiting for every tab to close.
   - Change the fetch strategy for icon/manifest assets (`/favicon.png`, `/icon-192.png`, `/icon-512.png`, `/manifest.json`, `/logo-animated.png`, any `apple-touch-icon*`) to **network-first with cache fallback**. Today they hit the cache-first branch, which is why the old icon survives even after the cache name bumps. All other images keep cache-first behavior for performance.
   - Leave the dose-reminder IndexedDB code, push handling, and navigation network-first behavior untouched.

2. **`src/services/pushScheduler.ts` — auto-apply the new worker**
   - After `navigator.serviceWorker.register('/sw.js', …)`, call `registration.update()` to force an update check on every app load (the registration already uses `updateViaCache: 'none'`, so the browser will revalidate the SW file).
   - Attach an `updatefound` listener: when a new worker reaches the `installed` state **and** `navigator.serviceWorker.controller` exists (meaning this isn't a first install), post `{ type: 'SKIP_WAITING' }` to the waiting worker.
   - Add a one-shot `controllerchange` listener that reloads the page exactly once (guarded by a module-level flag so it can't loop).
   - First-time installs are unaffected — no controller exists yet, so no reload fires.

## Why this is safe

- The kill-switch / unregister path from the PWA skill is not appropriate here because the SW is load-bearing for background dose reminders (per project memory). We keep the worker and only change how it updates.
- Network-first for icons and the manifest only affects a handful of small files; if the network fails, the cached copy still serves, so offline behavior is preserved.
- The reload guard prevents update loops: `controllerchange` reloads at most once per page load.
- Lovable preview is unaffected — the existing registration path already only runs in the deployed app context via `pushScheduler`.

## User-visible result

Next time an already-installed user opens the app:
1. The browser fetches the new `sw.js` (no HTTP cache thanks to `updateViaCache: 'none'`).
2. The new worker installs, the client tells it to skip waiting, and it activates — wiping the old `peptide-tracker-v6` cache.
3. The page reloads once automatically.
4. The fresh `manifest.json` and icon files load from the network, so the home-screen icon and splash refresh on the next OS-level refresh (iOS/Android still cache the home-screen icon at install time, so the in-app icon and name update immediately, while the home-screen tile may still need an OS refresh on some devices — this is an OS limitation we cannot bypass from the web).

No code changes outside `public/sw.js` and `src/services/pushScheduler.ts`.
