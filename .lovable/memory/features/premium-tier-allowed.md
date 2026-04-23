---
name: Premium tier allowed
description: Paid Premium tier (Tagadapay, ZAR) is permitted. Vendor surfaces remain forbidden.
type: feature
---
The previous "no paid surfaces" rule is **reversed for Premium only**.

Allowed:
- Free + Premium two-tier model. Premium = R4.99/month or R49/year (ZAR).
- `subscriptions` table, `has_active_subscription()` helper, Premium-gated UI.
- 1:1 consultation booking is a **Premium entitlement** (mailto to webinars@fintiba.com).
- ZAR pricing copy and 🇿🇦 trust badges in English.

Still forbidden:
- Vendor lists, vendor ratings, vendor cards, finnrick.com references.
- Stripe / Paddle / Paystack — payment provider is Tagadapay only.
- Multi-language i18n (English-only stays).

`useMembership` is now real DB-backed: returns `hasPremium = true` when an admin role exists OR a `subscriptions` row has status `active`/`trialing` and is not expired.
