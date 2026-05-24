# Fix Shop CTA

## Problem
- Apex `https://ridethetide.site` returns an invalid response (likely SSL/redirect issue). The working host is `https://www.ridethetide.site` (already used in `StackPeptideCard.tsx`).
- Button copy says "Shop Protocols" — should be "Shop Peptides".

## Changes

### 1. Standardize URL to `https://www.ridethetide.site`
Replace every `https://ridethetide.site` with `https://www.ridethetide.site` (preserve any query strings / UTM params) in:
- `src/components/landing/LandingHeader.tsx` (`SHOP_URL` const)
- `src/components/landing/CTASection.tsx`
- `src/components/landing/FAQSection.tsx`
- `src/components/landing/LandingFooter.tsx`
- `src/components/home/ReorderWidget.tsx`
- `src/pages/Welcome.tsx`
- `src/pages/BloodworkPage.tsx`, `src/pages/LiveQnA.tsx`
- `src/components/bloodwork/ProtocolSections.tsx`
- `src/components/modals/PeptideDetailModal.tsx`
- `src/screens/MyStackScreen.tsx`
- any remaining matches found by `rg "https://ridethetide\.site"`

Leave canonical SEO hostname (`ridethetide.info`) untouched — only the shop links change.

### 2. Rename CTA copy "Shop Protocols" → "Shop Peptides"
Update every user-facing instance (button label, mobile menu, footer link, arrow suffix variants like "Shop Protocols →"):
- `LandingHeader.tsx` (desktop + mobile)
- `CTASection.tsx`
- `HeroSection.tsx`
- `LandingFooter.tsx`
- `Welcome.tsx`
- any other matches from `rg "Shop Protocols"`

Keep `ReorderWidget`'s "Shop Now" and other distinct copy as-is.

### 3. Memory
Update `mem://index.md` Core rule: replace "Shop Protocols → ridethetide.site" with "Shop Peptides → www.ridethetide.site".
Update `mem://features/cross-property-network` shop URL + CTA label.

## Out of scope
DNS/SSL on the apex domain (user's hosting concern), other branding, route changes.
