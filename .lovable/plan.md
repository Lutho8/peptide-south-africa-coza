## Goal
Make returning mobile/PWA and desktop users see **Peptide South Africa** and the new app icon immediately, instead of stale Ride The Tide branding.

## Plan
1. **Force a new PWA metadata version**
   - Bump all favicon, app icon, and manifest query versions from `v=3` to a new version.
   - Add/confirm `/favicon.ico` handling so browsers that request the default ICO path cannot fall back to an old Ride The Tide icon.
   - Keep manifest name/short name as Peptide South Africa / Peptide SA.

2. **Strengthen the installed-app update path**
   - Bump the service worker cache name again so old caches are evicted.
   - Make `/`, `/index.html`, `/manifest.json`, favicon, and icon files network-first for returning users.
   - Keep the existing one-shot auto-reload flow so already-installed users refresh once when the new worker activates.

3. **Purge old cached brand assets safely**
   - Delete prior app-shell caches and older icon/manifest responses when the new service worker activates.
   - Preserve reminder/notification IndexedDB behavior.

4. **Clean remaining visible old brand references**
   - Remove user-visible Ride The Tide labels in setup scripts/docs where they can confuse packaging.
   - Keep the Android package id `info.ridethetide.app` unchanged internally only, because changing it would break native app continuity and require a new app-store identity.

5. **Native Android icon/name alignment**
   - Verify Android resource strings stay `Peptide South Africa`.
   - Update/repoint launcher icon resources if current native icon files are still old.

## Technical notes
- Installed PWA app names/icons are aggressively cached by iOS/Android. The best immediate web fix is versioned manifest/icon URLs plus service-worker cache eviction and auto-refresh; some launchers may still require the OS to re-read metadata after opening the app once.
- Native Android package/applicationId can still contain `ridethetide` internally without being user-visible; changing it is not safe for current installed native users.