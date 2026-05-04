# Memory: index.md
Updated: today

# Project Memory

## Core
English-only UI; no multi-language i18n. ZAR currency + 🇿🇦 SA copy allowed.
Hard paywall (PaywallScreen) is first screen on every cold start (web/PWA/native). Browse Free → limited preview (3 peptides, research tools locked).
Two-tier access: Free + Premium (R4.99/mo or R49/yr, ZAR). Web → Tagadapay; native → Google Play Billing (SKU pending).
1:1 consultation = Premium-gated entitlement (mailto webinars@fintiba.com).
No vendor surfaces (no vendor lists, ratings, or finnrick.com references).
Brand: Ride The Tide. Primary #3B82F6. Glassmorphism, luxury Framer Motion.
Peptides for research only; require safety disclaimers (not FDA approved).
Dosing strictly in mg, IU, or units (U-40). NEVER use mcg.
Biometrics in KG only. No AI body fat estimation (visual only).
Supabase with permissive RLS. Deployed as PWA and native via Capacitor.
Compare tool is forbidden; use Blends & Stacks instead.

## Memories
- [Hard paywall](mem://features/hard-paywall) — First-launch PaywallScreen, teaser mode, Play Billing on native
- [Premium tier allowed](mem://features/premium-tier-allowed) — Paid Premium tier permitted; vendor surfaces still forbidden
- [Payment provider Tagadapay](mem://features/payment-provider-tagadapay) — Tagadapay only; Stripe/Paddle/Paystack skipped; live wiring deferred
- [Access model](mem://features/access-model) — Free + Premium two-tier, admin auto-Premium
- [Consultation booking](mem://features/consultation-booking) — Premium-gated, mailto to webinars@fintiba.com
- [Stacking matrix](mem://features/stacking-matrix) — Compatibility matrix (Synergistic, Compatible, Caution, Avoid) for 21+ pairs
- [Bloodwork tracking](mem://features/bloodwork-tracking) — Tracking for 20+ biomarkers with gender-specific optimal ranges
- [Inventory management](mem://features/inventory-management) — 28-day expiration logic from reconstitution date
- [Cycle protocols](mem://features/cycle-protocols) — Protocol categorization, MOTS-c inclusion, specific biomarker tracking
- [Biometrics & scale sync](mem://features/biometrics-and-scale-sync) — KG-only validation, 1.75m BMI fallback, Web Bluetooth API integration
- [Dose reminders](mem://features/dose-reminders-system) — Background scheduler via Service Worker/IndexedDB, 5/10/30m snooze
- [Home gesture interactions](mem://features/home-screen-gesture-interactions) — Swipe right 80px to mark dose taken
- [Native mobile support](mem://technical/native-mobile-support) — Capacitor configuration for iOS/Android
- [AI peptide agent](mem://features/ai-peptide-agent-system) — Multi-modal agent using Gemini 1.5 Flash
- [Luxury animations](mem://design/luxury-animations) — Premium Framer Motion transitions, shimmer sweeps, 3D flip-reveals
- [DB security hardening](mem://constraints/database-security-hardening) — pgcrypto encryption, search_path on SECURITY DEFINER functions
- [Branding](mem://design/branding-ride-the-tide) — Ride The Tide visual identity, #3B82F6, logo usage
- [OAuth authentication](mem://features/oauth-authentication) — Google and Apple Sign-In
- [Technical data schema](mem://features/peptide-technical-data-schema) — Amino acid sequences, half-lives, Janoshik COA structure
- [Animated logo](mem://design/animated-logo-behavior) — 8-second spin, 0.5-second fast spin on click
- [Legal compliance](mem://features/legal-compliance-pages) — Compliance standards modeled after peptibase.dev
- [Admin access control](mem://constraints/admin-access-control) — Hardcoded admin access for lutho.kote@relicom.de
- [React stability](mem://technical/react-runtime-stability) — Vite react aliasing, service worker JS cache exclusions
- [English enforcement](mem://constraints/english-only-enforcement) — English-only UI; ZAR/SA copy allowed
- [Membership automation](mem://technical/membership-automation) — DEPRECATED — superseded by `subscriptions` table
- [Mobile PWA optimization](mem://design/mobile-pwa-and-ux-optimization) — updateViaCache: none, 44px touch targets
- [DB access policy](mem://constraints/database-access-policy) — Permissive RLS configuration
- [Research tools alignment](mem://constraints/research-tools-alignment) — Blends & Stacks supersedes Compare tool
- [Performance benchmarks](mem://constraints/performance-benchmarks) — FCP < 1.5s, TTI < 2.5s via code-splitting
- [Cycle safety alerts](mem://features/cycle-safety-alerts) — 15% or 7-day warnings, overdue alerts
- [Transformation data](mem://technical/transformation-data-integrity) — (user_id, date) unique constraints for upserts
- [Admin label maker](mem://features/admin-label-maker) — Vial label formatting and QR code data structure
- [Live Q&A system](mem://features/live-qna-system) — 1st Saturday Q&A (lutho.kote@relicom.de), 15s scroll popup
- [Onboarding & performance](mem://features/onboarding-and-performance-ux) — content-visibility: auto usage
- [Member stack blends](mem://features/member-stack-blends) — Purple flask iconography for blends
- [Dosage standard](mem://features/dosage-unit-standardization) — Dosing in mg, IU, units only (no mcg)
- [Blend-aware tools](mem://features/blend-aware-dosing-tools) — Concentration rules for high-mass blends (e.g. KLOW 80mg/3mL)
- [Dose logging feedback](mem://features/dose-logging-feedback) — Vibration API, specific UI success animations
- [Reconstitution UX](mem://features/reconstitution-experience) — 10-50 units volume constraints, 6-step animated guide
- [Body scanner scope](mem://features/body-scanner-scope) — Visual comparison only, strictly no AI body fat estimation
