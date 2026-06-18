### Replace app icon with uploaded South African flag bars image

1. **Icon files**
   - Copy the uploaded image from `user-uploads://` to `public/icon-512.png` (source, 512x512)
   - Resize it to `public/icon-192.png` (192x192)
   - Resize it to `public/favicon.png` (64x64)

2. **index.html cache-bust**
   - Bump all icon `href`s and manifest link from `?v=2` to `?v=3`

3. **manifest.json cache-bust**
   - Bump all icon `src`s and shortcut icon from `?v=2` to `?v=3`

4. **sw.js cache eviction**
   - Bump `CACHE_NAME` from `peptide-tracker-v5` to `peptide-tracker-v6`
   - Ensure static asset list references version-busted paths so the new icons are cached

**Note:** Already-installed PWA users may need to remove and re-add the app to see the new icon on iOS/Android.