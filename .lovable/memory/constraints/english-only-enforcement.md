---
name: English-only UI (no multi-language i18n)
description: All UI copy is English. No multi-language switcher or browser language detection. ZAR currency + SA-flavored English copy is allowed.
type: constraint
---
The application is English-only. Specifically:

- No German, French, or any non-English UI strings.
- No multi-language i18n switcher.
- No automatic browser language detection.
- The locale folder under `src/i18n/locales/` stays English-only.

**Allowed (narrowed from the old hardcoded rule):**
- ZAR currency formatting (R4.99, R49) and "Prices in ZAR" copy.
- 🇿🇦 South African trust badges and "Built in South Africa" / "South African Owned" English copy.
- Country-specific CTAs and trust pillars in English.

The rule restricts **language**, not **country/currency context**.
