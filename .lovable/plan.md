## Goal

Replace the landing's "Your Peptide Protocol — Research to Results in 4 steps" (`HowItWorks`) and "Everything you need to research, track, and optimize" (`BentoFeatures`) sections with an interactive, on-brand **PWA Install Journey** that mirrors the three reference screenshots, and reuse the same flow as a step in post-signup onboarding.

## New landing block: `PWAInstallJourney`

Single new component at `src/components/landing/PWAInstallJourney.tsx` containing 3 stacked sub-sections, all using existing semantic tokens (`bg-background`, `text-foreground`, `text-primary` = Ride The Tide blue #3B82F6) plus glassmorphism cards (`glass-card`, `border-border/50`) and Framer Motion entrance animations consistent with `BloodworkHero` / `BentoFeatures`.

### 1. Hero — "Get Ride The Tide on Your Phone"
- Chip: `Smartphone` icon + "Progressive Web App"
- Headline: **"Get Ride The Tide on `<span text-primary>`Your Phone`</span>`"** (display font, large)
- Subline: "Install directly to your home screen. No app store needed."
- Two **disabled-looking** store buttons (App Store / Google Play) rendered as muted glass cards with a small "Unavailable" badge — visually echo screenshot 1.
- Caption: "Not available in app stores — and that's by design." (links to section 2)
- Primary live CTA: **"Install in 30 seconds →"** (smooth scrolls to section 3). On mobile, if `usePWAInstall().isInstallable` is true, shows a sparkle "Install Now" button that calls `install()`.

### 2. "Not on the App Store. By design."
- Three short paragraphs adapted to Ride The Tide voice:
  1. "We built a fully native app first. Apple and Google asked us to strip the safety engine, peptide interaction warnings, and dosing logic to pass review. Every removal made the app safer for them and less useful for you."
  2. "The peptide apps that made it through review did so by removing what matters. That's not what this community needs."
  3. "A PWA lets us ship the real product — the depth this research space deserves — without permission from a review board that doesn't understand it yet."
- Accent line in primary blue: **"Small initial friction. Exponential gains."**
- 5 benefit cards in a 2-col responsive grid (last one full-width), using lucide icons:
  - `WifiOff` — **Works offline** — Core dose tracking & references without internet
  - `Monitor` — **Full-screen** — No browser bar, feels like a native app
  - `RefreshCw` — **Auto-updates** — Always the latest version, no store waits
  - `Smartphone` — **Same experience** — Identical on iPhone and Android
  - `ShieldCheck` (wide) — **No gatekeeping** — Safety engine, interaction warnings and dosing logic live free and fully here

### 3. "Install in 30 seconds" — interactive tabs
- Auto-detect platform via `navigator.userAgent` to default the active tab (iOS / Android).
- Tab switcher: **iOS (Safari)** with `Apple`-style icon, **Android (Chrome)** with `Chrome`/Play icon. Animated underline using Framer Motion `layoutId`.
- Animated step list inside a glass card. Numbered circles in primary blue, staggered fade-in on tab change.
  - **iOS — Safari only**
    1. Open `ridethetide.info` in Safari
    2. Tap the Share icon (box with arrow ↑)
    3. Scroll and tap **"Add to Home Screen"** ➕
    4. Tap **"Add"** to confirm
  - **Android — Chrome**
    1. Open `ridethetide.info` in Chrome
    2. Tap the ⋮ menu (top-right)
    3. Tap **"Install app"** / **"Add to Home Screen"**
    4. Tap **"Install"** to confirm
- If `usePWAInstall().isInstallable`, swap the Android list footer for a live **"Install Now"** sparkle button that triggers the native prompt.
- Footer link: "Already installed? Open the app →" (deep link to `/`).

## Landing wiring

In `src/components/landing/LandingPage.tsx`:
- Remove `HowItWorks` import + render and `BentoFeatures` lazy import + render.
- Insert lazy-loaded `PWAInstallJourney` in their place (between `HeroSection` and `Testimonials`).
- Leave existing Suspense placeholders pattern intact.

Files `HowItWorks.tsx` and `BentoFeatures.tsx` stay on disk (not deleted) in case other routes import them — confirmed they're only used by `LandingPage` and `index.ts`; we'll prune `index.ts` exports of the two.

## Post-signup onboarding reuse

Add a single new step to the post-registration flow so new accounts immediately see how to install:
- New component `src/components/onboarding/InstallAppStep.tsx` — a condensed, single-screen version of section 3 (tabs + 4 steps + live install button when available) plus a "Skip for now" link.
- Trigger: after successful signup in `AuthContext` / `AuthModal`, set `localStorage['rtd-install-prompt-pending'] = '1'`. On `Index`/dashboard mount, if pending and `!isInstalled` (from `usePWAInstall`), show `InstallAppStep` as a full-screen modal (Framer Motion fade/slide). Dismiss clears the flag. Then continue to the existing `DashboardTour`.
- On desktop, skip automatically (only useful on phones), but keep a "Show install guide" entry in `SettingsScreen` so users can replay it.

## Brand & motion

- Colors: primary `#3B82F6` for accents, headlines/text via `text-foreground` / `text-muted-foreground`, glassmorphism (`backdrop-blur`, `border-border/50`, `bg-card/40`).
- Typography: existing display heading classes; keep the "Your Phone" gradient highlight using `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`.
- Motion: staggered `whileInView` fades for cards, `layoutId` underline on tab switch, subtle pulse on the live "Install Now" sparkle button (reuse `.btn-sparkle`).
- Icons: lucide-react only; small Ride The Tide wordmark chip in the hero corner for brand presence.

## Out of scope

- No changes to `vite-plugin-pwa` config, service worker, or manifest.
- No backend/auth schema changes.
- No copy changes to other landing sections.
- No new dependencies.
