---
name: Access model
description: Two-tier — Free (forever) + Premium (Tagadapay, ZAR). Admin role auto-grants Premium.
type: feature
---
The app uses a two-tier access model:

- **Free** (forever, no card): full peptide database, calculators, stack/blend builder, COA verification, protocol tracking, monthly group Q&A.
- **Premium** (R4.99/month or R49/year, ZAR via Tagadapay): everything in Free + 1:1 expert calls, AI bloodwork insights, advanced cycle planning, priority WhatsApp/email support.

Source of truth: `subscriptions` table. `useMembership` exposes `hasPremium`. Admin email `lutho.kote@relicom.de` always returns `hasPremium = true` via `has_role(_, 'admin')`.

The previous "free-access-only, no paywalls" model is superseded.
