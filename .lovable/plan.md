# Final Paywall Sweep + WhatsApp Number

## 1. Bake in WhatsApp number
Replace `[YOUR_NUMBER]` with `491624747159` (international, no `+`) in:
- `src/components/global/WhatsAppFab.tsx` — `wa.me/491624747159?text=...`
- `src/components/landing/LandingFooter.tsx` — Network column WhatsApp link

Also ripgrep for any other `[YOUR_NUMBER]` / `YOUR_NUMBER` occurrences and replace.

## 2. Final "Go Premium" / paywall copy sweep
Ripgrep the codebase for residual paywall language and remove or replace with "Shop Protocols → ridethetide.site" where it was a CTA, or delete outright where it was a lock label:
- `Go Premium`, `Upgrade`, `Unlock Premium`, `Premium Member`, `Subscribe`, `Pricing`, `Paywall`, `Teaser`, `isPremium`, `hasPremium` (UI-text only — keep stub hook return values intact)
- Common suspects to check: `src/components/**`, `src/screens/**`, `src/pages/**`, nav menus, settings screens, bloodwork upsells, AI agent upsells, dashboard banners, empty states, toast messages, route guards.
- Remove any lock icons (🔒 / Lock from lucide) wrapping feature entries.
- Remove `/pricing` route entry if still registered in `App.tsx`; redirect to `/` if linked anywhere.

## 3. Memory updates
Update `mem://index.md` Core + add/update files:
- Core: add "No paywalls; every feature free for registered users. Shop CTA → ridethetide.site." and "Based in Cape Town, South Africa (was Johannesburg/Germany — do not revert)."
- Update `mem://features/access-model` to reflect free-for-all + cross-property shop link.
- New `mem://features/cross-property-network` — RTD Research Peptides (ridethetide.site), Cape Town Peptide Club (capetownpeptideclub.co.za), WhatsApp +491624747159, UTM convention `utm_source=tracker&utm_medium=<surface>&utm_campaign=<name>`.
- Update `mem://design/branding-ride-the-tide` — Cape Town locale, ZA-WC geo (-33.9249, 18.4241).
- Remove/retire `mem://features/access-model`'s old trial/admin paywall language; keep membership-automation file but note paywalls are stubbed permissive.

## 4. Verify
- Ripgrep confirms zero `[YOUR_NUMBER]`, zero user-facing `Go Premium` / `Upgrade to Premium`, zero `Johannesburg`, zero `Germany`/`Deutsch` in UI strings.
- Preview `/`, `/welcome`, `/dashboard`, `/bloodwork` for stray lock icons or upsell banners.

## Out of scope
Capacitor, i18n, Supabase schema, auth, route structure, tracker features.
