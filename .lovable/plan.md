
# Peptide South Africa — Unified Rebrand & Mobile-First Pass

Full rebrand of the tracker app from **Ride The Tide → Peptide South Africa**, repointing the canonical domain to **peptide-south-africa.co.za**, the shop CTA to **peptide-south-africa.com**, and fixing the mobile chrome (WhatsApp FAB blocking Results, safe-area, tap targets).

This plan is Phase 1: identity + mobile chrome + SEO repoint. Backend tables, edge functions, and email-queue infra stay untouched (their *content* is rebranded; their *names* are not).

---

## 1. Brand identity swap

**Logos & icons**
- Upload the two attached logos as Lovable Assets:
  - `src/assets/peptide-sa-mark.png.asset.json` (circular icon, mobile)
  - `src/assets/peptide-sa-lockup.png.asset.json` (horizontal lockup)
- Replace `public/favicon.png`, `public/icon-192.png`, `public/icon-512.png` with the circular mark.
- Update `src/components/ui/AnimatedLogo.tsx` to render the new mark + "PEPTIDE / SOUTH AFRICA" wordmark. Keep the 8s slow-spin / 0.5s click-spin behavior.

**Color tokens (`src/index.css`)**
- Keep primary `#3B82F6` (matches blue stripe) as core brand blue.
- Add semantic SA-flag accent tokens: `--sa-green #2E7D32`, `--sa-yellow #FBC02D`, `--sa-red #E53935`, `--sa-navy #0F1B3D` (typography). Wire into `tailwind.config.ts`.
- Headings shift to deep navy (`--sa-navy`) for the "credible / data-rich" Cronometer-ish feel.

**Copy / naming**
- All user-visible "Ride The Tide" / "RTD" → "Peptide South Africa" / "PSA".
- Tagline: "South Africa's free peptide protocol tracker."
- Capacitor: `appId: za.co.peptidesa.app`, `appName: Peptide South Africa` (`capacitor.config.ts`, `android/app/src/main/res/values/strings.xml`, `MainActivity` package path note: leave Java package as-is to avoid Android rebuild churn; only the user-visible `appName` + `appId` strings change).
- PWA `public/manifest.json`: name, short_name, description, theme_color stays `#3B82F6`.
- `index.html`: `<title>`, meta description, OG tags, canonical → `https://peptide-south-africa.co.za`.
- README, STORE_LISTING, RELEASE_GUIDE: rebrand text only (no behavior change).

**Memory updates** (rules — applied to every future turn)
- Rewrite `mem://index.md` Core block: brand = Peptide South Africa, canonical = `https://peptide-south-africa.co.za`, shop = `https://peptide-south-africa.com`, club = `https://capetownpeptideclub.co.za` (kept), WhatsApp `+491624747159` (kept).
- Rewrite `mem://design/branding-ride-the-tide` → `mem://design/branding-peptide-south-africa`.
- Update `mem://features/cross-property-network` with new domain triplet + UTM conventions (`utm_source=psa_app`).

---

## 2. Domain & SEO repoint

- `index.html`: canonical, og:url, twitter:url → `https://peptide-south-africa.co.za`.
- `scripts/generate-sitemap.ts`: `BASE_URL = "https://peptide-south-africa.co.za"`.
- `public/robots.txt`: update `Sitemap:` directive.
- `src/lib/shop/buildStackCartLink.ts` + `src/lib/bloodwork/stackLink.ts`: `STORE_BASE = "https://peptide-south-africa.com"`, UTM source `psa_app`.
- Every hardcoded `ridethetide.info` / `ridethetide.site` string across `src/`, `public/llms.txt`, `public/sitemap.xml`, JSON-LD blocks → repointed.
- Add a brief 301 note to README for the old `ridethetide.info` host (DNS-level redirect is outside the app; user handles at registrar).
- After the rebrand lands, trigger an SEO rescan so Google Search Console gets a fresh signal on the new canonical (user clicks Rescan in the SEO tab).

---

## 3. Mobile-first chrome fixes

**WhatsApp FAB → Support menu (Option B)**
- Delete `src/components/global/WhatsAppFab.tsx` from the global render tree (remove from `App.tsx`).
- Add a `Support` entry inside `SettingsScreen.tsx` and a compact "Help" icon button in `AppHeader.tsx` (top-right) that opens a `SupportSheet` with:
  - WhatsApp chat → `wa.me/491624747159`
  - Book consultation → existing booking flow
  - Email support → `mailto:`
- Result: bottom-right is fully clear, the Results tab is tappable.

**Safe-area + viewport**
- `BottomNav.tsx` already has `env(safe-area-inset-bottom)`; audit `Welcome.tsx` and modals to swap `h-screen` → `h-dvh` where a keyboard could open (bloodwork entry, dose log).
- Confirm `<meta name="viewport" content="... viewport-fit=cover">` in `index.html`.

**Tap targets**
- Sweep `BottomNav`, `AppHeader`, icon-only Buttons (audit `size="icon"` variants) → enforce `min-h-11 min-w-11`. Add `aria-label` where missing.

**Touch feedback**
- Global utility class `active:scale-[0.97] active:brightness-95 transition` applied to primary buttons/cards via shadcn Button variant tweak.

**Swipe gestures** (lightweight, no new deps)
- `DailyLogScreen` and `TransformationScreen`: wire `onTouchStart/Move/End` to swipe-left/right between dates/tabs. ~30 LoC each, no library.

**Offline-first** — already covered by the existing service worker + IndexedDB dose/bloodwork queue. Audit only; no rework.

**Top-right "Shop" button**
- Add a small `Shop` button in `AppHeader.tsx` next to the new Help button → opens `https://peptide-south-africa.com/?utm_source=psa_app&utm_medium=header&utm_campaign=shop_nav`.

---

## 4. Out of scope (call out, defer)

- Renaming the Android Java package (`info.ridethetide.app` → `za.co.peptidesa.app`) requires a full native rebuild + Play Store re-publish. **Leave the Java package as-is**; only user-facing strings + Capacitor `appId` change. Document in `RELEASE_GUIDE.md`.
- Email domain stays `notify.www.ridethetide.info` for this turn — switching it requires new DNS delegation on `peptide-south-africa.co.za` and 24–72h propagation. Will be a follow-up turn once DNS is ready.
- Supabase project ref, table names, edge function slugs — unchanged.
- "Critical Bug Fixes (P0)" section in your message was cut off — please paste the list and I'll fold it in as Phase 1.5.

---

## Technical notes

- **Files created**: `src/components/support/SupportSheet.tsx`, two `.asset.json` pointers.
- **Files deleted from render**: `WhatsAppFab` import removed from `App.tsx` (file itself can stay for reference, or be deleted).
- **Files edited** (high-level): `index.html`, `public/manifest.json`, `public/robots.txt`, `public/llms.txt`, `public/sitemap.xml`, `scripts/generate-sitemap.ts`, `capacitor.config.ts`, `android/.../strings.xml`, `src/index.css`, `tailwind.config.ts`, `src/components/ui/AnimatedLogo.tsx`, `src/components/layout/AppHeader.tsx`, `src/components/layout/BottomNav.tsx`, `src/App.tsx`, `src/pages/Welcome.tsx`, `src/screens/SettingsScreen.tsx`, `src/screens/DailyLogScreen.tsx`, `src/screens/TransformationScreen.tsx`, `src/lib/shop/buildStackCartLink.ts`, `src/lib/bloodwork/stackLink.ts`, plus a sweep of remaining `ridethetide.info|site` string references.
- **Memory**: rewrites to `mem://index.md`, `mem://design/branding-*`, `mem://features/cross-property-network`.
- **No DB migrations** in this phase.

Approve to ship Phase 1, and please paste the truncated **P0 bug list** so I can sequence it next.
