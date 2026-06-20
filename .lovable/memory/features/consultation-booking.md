---
name: Consultation booking — Premium-gated
description: 1:1 consultation calls are a Premium entitlement. Booking is mailto to webinars@fintiba.com.
type: feature
---
1-hour 1:1 Zoom consultations are **gated behind Premium membership**.

Implementation in `src/components/booking/BookCallSection.tsx`:
- Reads `useMembership().hasPremium`.
- If Premium: shows "Book Premium 1:1 Call" → opens `mailto:webinars@fintiba.com` with a "Premium member" subject + body.
- If not Premium: shows disabled "Available with Premium" button + an "Upgrade to Premium — from R4.99/month" CTA that scrolls to `/#pricing`.

No payment is collected inside the app for the call itself — the Premium subscription unlocks eligibility, scheduling happens by email.
