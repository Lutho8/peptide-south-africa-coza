# Fix Mobile App Name & Logo (PWA Install Branding)

The manifest text and `<title>` already say "Peptide South Africa", but the installed app on phones still shows "Ride The Tide" with the old wave logo. Two root causes:

1. **iOS home-screen label is missing**: `index.html` has no `apple-mobile-web-app-title`, so iOS may fall back to a cached/legacy name.
2. **Icon PNGs are visually unchanged**: `public/favicon.png`, `public/icon-192.png`, and `public/icon-512.png` still render the old Ride The Tide wave artwork. The manifest references them, so installs pick up the old logo no matter what name we set.
3. **Service worker + installed PWA cache** the manifest and icons aggressively — even after we ship new files, returning installs need a cache-bust to pick them up.

## Changes

### 1. `index.html` — add iOS app name + version-busted icons
- Add `<meta name="apple-mobile-web-app-title" content="Peptide SA" />`
- Add `<meta name="application-name" content="Peptide SA" />`
- Append `?v=2` to all icon `href`s and to the manifest link so iOS/Android refetch.

### 2. `public/manifest.json` — bump icon URLs
- Append `?v=2` to each `icons[].src` and the shortcut icon so Android/Chrome regenerate the WebAPK with the new artwork.

### 3. Regenerate the three icon PNGs with the Peptide South Africa mark
Replace the existing files (same paths so no other code changes needed):
- `public/favicon.png` (32×32)
- `public/icon-192.png` (192×192, maskable-safe — subject inside center 80% safe zone)
- `public/icon-512.png` (512×512, maskable-safe)

Artwork direction: Peptide South Africa monogram on the established brand background (`#3B82F6` primary, deep navy `#0F172A` backdrop) — a clean stylized "P" / molecular dot motif, centered, with generous padding so Android's maskable circle/squircle crop doesn't clip it. No wave, no "RTT", no "Ride The Tide" wordmark.

### 4. Service worker cache bump
- In `public/sw.js`, bump the cache version constant (e.g. `peptide-sa-v2`) so the old cached manifest/icons are evicted on next visit. Existing kill-switch / activate logic stays as-is.

## What the user will see
- Fresh installs immediately show "Peptide SA" with the new icon.
- Users who already installed the old PWA: on next launch the SW updates, then iOS/Android refresh the home-screen icon within a launch or two (iOS sometimes requires remove + re-add — we'll note this).

## Out of scope
- No changes to in-app UI, routing, or the `ridethetide.info` custom domain.
- Native Capacitor icons/splash (separate asset pipeline) — only touch if you want me to follow up.

## Confirm before I build
- OK to generate a new icon based on the description above (blue/navy monogram, no wave)? Or do you want to upload your own square logo PNG to use instead?
