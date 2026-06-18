---
name: Peptide South Africa branding
description: Peptide South Africa visual identity — SA-flag color accents, circular mark + horizontal lockup, navy typography, mobile-first chrome
type: design
---
Brand = **Peptide South Africa**. Canonical domain `https://peptide-south-africa.co.za`. Shop CTA → `https://peptide-south-africa.com` (UTM source `psa_app`).

## Logo system
- Circular mark — `src/assets/peptide-sa-mark.jpg.asset.json` (CDN). Used in `AnimatedLogo`, favicon, PWA icons.
- Horizontal lockup — `src/assets/peptide-sa-lockup.jpg.asset.json`. Used in landing hero, marketing emails.
- Animated behavior preserved: 8 s slow rotate, 0.5 s fast rotate on click. `prefers-reduced-motion` aware.

## Colors
- Primary `#3B82F6` (matches blue stripe of mark) — unchanged.
- SA accent tokens (`index.css`): `--sa-green #2E7D32`, `--sa-yellow #FBC02D`, `--sa-red #E53935`, `--sa-navy #0F1B3D`.
- Headings shift toward deep navy for the "data-rich / credible" tone (think Cronometer).

## Typography lockup
Wordmark renders two lines: **PEPTIDE** (foreground, bold) over **SOUTH AFRICA** (smaller, tracked 0.18em, muted-foreground). Never invert.

## Legacy
"Ride The Tide" / `ridethetide.info` / `ridethetide.site` are fully retired. Do not re-introduce. The Android Java package (`info.ridethetide.app`) and the email-queue subdomain (`notify.www.ridethetide.info`) are intentionally kept for OTA + DNS continuity; users never see them.
