# Plan

## 1. Fix the failing build (this project)

`package.json` only defines `dev`, `build`, `lint`, `preview`. The pipeline runs `build:dev`, which doesn't exist — that's the cause of the `Script not found "build:dev"` failure.

Add a `build:dev` script:

```json
"build": "tsc && vite build",
"build:dev": "vite build --mode development",
```

No other code or config changes needed for this fix.

## 2. About the Daily Log / Run Baseline / Onboarding requests — wrong codebase

I re-scanned the repository as you asked. This project is `peptide-south-africa-site` — a **marketing site** with these pages only:

```
Home, About, Blogs, BlogPost, Contact, FAQs, FAQPage,
HowItWorks, Pricing, Privacy, Terms, Returns, Hipaa,
PharmacyStandards, ResearchVsPrescribed, PeptideDatabase,
PeptideTherapy, Longevity, Recovery, WeightLoss, Assessment,
ProductSemaglutide / Tirzepatide / Sermorelin / NAD / Glutathione,
peptides/* and programs/*
```

There is **no** `DailyLog`, `BloodworkWizard`, `BloodworkPage`, `OnboardingScreen`, `runScan`, `Run Baseline`, or `Run Deep Decode` source anywhere in `src/`. Searches for `DailyLog`, `Onboarding`, `Bloodwork`, `Baseline`, `DeepDecode` all return zero hits. `package.json` has no Supabase client, no Capacitor, no Framer-only tracker deps — just the marketing-site stack (react-router, swiper, framer-motion, lucide, tailwind).

The screenshot's domain `peptide-south-africa.co.za` is listed under this project's custom domains, but the app actually being served at that URL (the tracker PWA with Daily Log, Bloodwork wizard, onboarding, service worker, Lovable Cloud auth) is built and deployed from a **different Lovable project** — the Peptide / Ride The Tide tracker repo. That's where `BloodworkWizard.tsx`, `BloodworkPage.tsx`, the onboarding gate, and the Daily Log screen actually live, and that's the only place those bugs can be fixed.

## 3. What I need from you

Switch to the tracker project and re-send the request there. Once I'm in that codebase I'll:

- Add detailed prerequisite-aware error toasts on Run Baseline / Run Deep Decode (auth, file, plan, network — each with a concrete fix hint).
- Investigate and fix the Daily Log "failed to load" error (likely a failing query/hook on the dashboard screen).
- Fix the onboarding loop so recognized users with `onboarding_completed = true` skip the flow on every load (persist + guard the route).

I can't make those changes from this marketing-site repo no matter how I edit it — the files don't exist here.

## Technical details

- Build fix is a one-line `package.json` change; no lockfile or dependency change.
- The custom domain pointing at this project but serving the tracker app is a deployment/DNS detail in the other project's publish settings, not something to fix in source here.
