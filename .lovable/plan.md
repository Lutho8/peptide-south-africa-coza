
## 1. "Buy Peptides" CTA — solid sparkle treatment

Replace the current gradient (`from-orange-500 via-pink-500 to-primary`) with a **solid bold orange** (`bg-orange-500`, `hover:bg-orange-600`) and add a continuous sparkle effect to catch the eye.

- New shared button class (added to `src/index.css`): `.btn-sparkle` — solid `bg-orange-500`, white text, strong `shadow-orange-500/40`, subtle pulse-glow, and a moving shimmer sweep (`::before` with a translating white gradient, 2.5s infinite).
- Add two animated `Sparkles` icons (top-right + bottom-left of the button) with staggered `animate-pulse` / rotate via Framer Motion.
- Apply to every "Buy Peptides" button: `HeroSection.tsx`, `CTASection.tsx`, `LandingHeader.tsx`, `LandingFooter.tsx`, `Welcome.tsx`, `LiveQnA.tsx`.

## 2. Fix "Start Tracking Free" routing

Currently `handleQnaCta` in `HeroSection.tsx` (and the matching button in `CTASection.tsx`) routes to `/live-qna`. Change behavior:

- **Logged out:** open the `AuthModal` in sign-up mode (call `onSignInClick` with a `defaultTab: 'signup'` prop) instead of navigating to Q&A.
- **Logged in:** navigate to `/` (Dashboard / HomeScreen) and auto-trigger the new onboarding tour.
- Rename the secondary Q&A entry point to a smaller text link ("Join the monthly Q&A →") so it stays accessible but stops hijacking the primary CTA.
- Keep `captureLead` analytics, but change `source` to `hero_signup_cta` / `activityType: 'signup_intent'`.

Apply to: `HeroSection.tsx`, `CTASection.tsx` (its "Get Started Free" button already calls `onSignInClick` — verify and make consistent).

## 3. Pre-signup "Dashboard Preview" section

Add a new landing section `src/components/landing/DashboardPreview.tsx` inserted between `HeroSection` and `BentoFeatures` in `LandingPage.tsx`. Shows a clean annotated screenshot-style mockup of the real Dashboard (Today's Doses, Body Composition, Reminders, Quick Actions) with callout chips ("Log a dose in 2 taps", "See adherence weekly", "Reminders that follow you"). Ends with a single sparkle "Create Free Account" CTA that opens `AuthModal`. Purpose: show the value before the sign-up wall.

## 4. Guided in-app onboarding tour (logged-in)

Replace the static `WelcomeGuide` card with an **interactive 5-step spotlight tour** that fires on first dashboard visit after signup.

- New file: `src/components/onboarding/DashboardTour.tsx` — lightweight tour using `framer-motion` (no new dependency). Each step renders a dimmed overlay with a cut-out highlight around a target element, a tooltip ("Step X of 5"), and Next/Skip buttons.
- Target elements via `data-tour="..."` attributes added to existing components:
  1. `data-tour="welcome-header"` → "This is your Dashboard. Everything lives here."
  2. `data-tour="todays-doses"` (`TodaysDoses.tsx`) → "Log today's peptide doses with one tap."
  3. `data-tour="quick-actions"` (`QuickActions.tsx`) → "Jump to Cycles, Bloodwork, Inventory."
  4. `data-tour="bottom-nav"` (`BottomNav.tsx`) → "Tap **Home** any time to return to your Dashboard."
  5. `data-tour="profile-avatar"` → "Your profile, settings, and sign-out live here."
- Trigger: on mount in `HomeScreen.tsx` when `localStorage['rtd-dashboard-tour-done'] !== 'true'` AND user is authenticated. Also expose a "Replay tour" button in `SettingsScreen.tsx` and inside the existing `WelcomeGuide`.
- Persists completion; "Skip" also marks done.

## 5. Persistent "Back to Home/Dashboard" affordance

- Ensure `BottomNav.tsx` Home tab is clearly labeled and always visible across screens (verify on modals/sub-routes).
- Add a top-left "← Dashboard" breadcrumb chip in `AppHeader.tsx` that appears on any route other than `/` and routes back to `/`.
- Add the same affordance inside full-screen modals (DoseTrackerModal, BloodworkModal, etc.) — a clear "Close → Dashboard" close button label.

## 6. Onboarding polish

- After successful signup in `AuthModal.tsx`, redirect to `/` and set `localStorage['rtd-dashboard-tour-done'] = ''` so the tour fires.
- Update `WelcomeGuide.tsx` copy to: "New here? Take the 60-second tour →" as the primary action, with the existing 4 quick-start cards as secondary.

## Technical notes

- All colors via Tailwind tokens / existing palette — no new HSL variables required (orange-500 is already used).
- Sparkle shimmer keyframe added to `tailwind.config.ts` (`shimmer-sweep`) and `index.css`.
- Tour overlay uses `position: fixed` + `getBoundingClientRect()` of `[data-tour]` targets; recalculates on resize and step change.
- No backend changes. No new dependencies.

## Out of scope

- Backend/auth schema, RLS, edge functions.
- Capacitor native changes.
- Memory updates (will follow once approved if needed).
