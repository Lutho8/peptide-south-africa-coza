---
name: Payment provider — Tagadapay
description: Tagadapay is the chosen payment processor for Premium. Stripe/Paddle/Paystack explicitly skipped. Live wiring deferred.
type: feature
---
**Provider:** Tagadapay (chosen by user). Currency: **ZAR**.

**Status:** UI shipped, live API wiring deferred until credentials provided.

**To wire:** request via `secrets--add_secret` in the secure modal:
- `TAGADAPAY_API_KEY`
- `TAGADAPAY_WEBHOOK_SECRET`
- `TAGADAPAY_PRICE_MONTHLY` (R4.99/month price ID)
- `TAGADAPAY_PRICE_ANNUAL` (R49/year price ID)

**Then build:**
1. Edge function `tagadapay-checkout` → returns hosted checkout URL.
2. Edge function `tagadapay-webhook` → upserts `subscriptions` row on subscription/payment events. Service-role writes only.
3. Replace stub body in `src/lib/billing.ts` `startCheckout()` with fetch + redirect.
4. Replace stub body in `openCustomerPortal()` with billing-portal call.

**Explicitly NOT used:** Stripe, Paddle, Paystack. Do not re-suggest them.
