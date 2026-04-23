---
name: No paid flows or vendor surfaces
description: Free-access app — no PayPal, no €9.99 membership, no vendor lists, no finnrick.com references. Booking is mailto-only.
type: constraint
---
The app is fully free-access. Do not re-introduce:

- Paid memberships, subscriptions, PayPal flows, or any €/$ pricing surfaces.
- The `user_memberships` table, the `has_active_membership` function, or trial-grant triggers — all dropped.
- Vendor lists, vendor ratings, vendor cards, or finnrick.com references anywhere in the UI.

The 1:1 consultation booking is a `mailto:webinars@fintiba.com` link — no payment step.

`useMembership` is a stub that always returns `{ hasMembership: true }` for backward compatibility.
