# Activate peptide-south-africa.com Email Sending

User chose the already-verified `www.peptide-south-africa.com` domain (shared across the Shop + App ecosystem). No DNS wait required.

## 1. Switch project sender domain
- Move the project from `www.ridethetide.info` → `www.peptide-south-africa.com` (verified, ready).
- Confirm `active` before flipping defaults.

## 2. Provision shared email infrastructure (idempotent)
- Ensure pgmq queues, RPC wrappers, `process-email-queue`, send log, suppression list, unsubscribe tokens, and pg_cron job exist.

## 3. Scaffold app (transactional) email function
- Scaffold `send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression` if not present.
- `SENDER_DOMAIN` = `notify.peptide-south-africa.com` (or whatever the scaffold returns for the verified subdomain)
- `FROM_DOMAIN` (display) = `peptide-south-africa.com`
- Default From: `Peptide South Africa <contact@peptide-south-africa.com>`

## 4. Update all UI mailto: links from `.co.za` → `.com`
Sweep these files and replace:
- `contact@peptide-south-africa.co.za` → `contact@peptide-south-africa.com`
- `privacy@peptide-south-africa.co.za` → `privacy@peptide-south-africa.com`
- `support@peptide-south-africa.co.za` → `support@peptide-south-africa.com`

Affected files: `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`, `src/pages/Disclaimer.tsx`, `src/components/landing/LandingFooter.tsx`, `src/components/support/SupportSheet.tsx`, plus any other matches found via ripgrep.

## 5. Branded templates
Create three React Email templates under `supabase/functions/_shared/transactional-email-templates/`, registered in `registry.ts`:
- `contact-form-confirmation` — reply-to `contact@peptide-south-africa.com`
- `support-request-confirmation` — reply-to `support@peptide-south-africa.com`
- `privacy-request-confirmation` — reply-to `privacy@peptide-south-africa.com`

Body `#ffffff`, accent `#3B82F6`, footer line "Built in Cape Town 🇿🇦".

## 6. Branded unsubscribe page
- React route at the unsubscribe path returned by the scaffold tool, wired to `handle-email-unsubscribe`.

## 7. Verification
- Send one test app email per mailbox via `send-transactional-email`, check `email_send_log.status = 'sent'`.

## What you still need to do manually
In Cloud → Emails → Manage Domains for `peptide-south-africa.com`, add forwarding:
- `contact@` → your inbox
- `support@` → your inbox
- `privacy@` → your inbox

## Out of scope
- Decommissioning the old `notify.www.ridethetide.info` sender — leave parallel.
- Adding `peptide-south-africa.co.za` as a sender (skipped per user choice).
- Marketing/newsletter templates (not supported).

## Memory update
Update `mem://design/branding-peptide-south-africa` to record that mailboxes use `@peptide-south-africa.com` (shop+app shared ecosystem), not `.co.za`.
