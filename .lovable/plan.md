# Activate peptide-south-africa.co.za Email Sending

Now that DNS is verified, switch the project's sending infrastructure to the new domain and stand up the three mailboxes.

## 1. Confirm domain status
- Call domain status check on `notify.peptide-south-africa.co.za` to confirm `active` before flipping any defaults. Abort if not active.

## 2. Provision shared email infrastructure (if not already present)
- Ensure pgmq queues, RPC wrappers, `process-email-queue`, send log, suppression list, unsubscribe tokens, and pg_cron job exist for the new domain. Re-run infra setup; it is idempotent.

## 3. Scaffold app (transactional) email function
- Scaffold the transactional email Edge Function + unsubscribe + suppression handlers if not already present.
- `SENDER_DOMAIN` = `notify.peptide-south-africa.co.za`
- `FROM_DOMAIN` (display) = `peptide-south-africa.co.za`
- Default From: `Peptide South Africa <contact@peptide-south-africa.co.za>`

## 4. Branded templates
- Read brand tokens from `src/index.css` and existing templates, then create three minimal React Email templates under `supabase/functions/_shared/transactional-email-templates/`:
  - `contact-form-confirmation` — replies from `contact@`
  - `support-request-confirmation` — replies from `support@`
  - `privacy-request-confirmation` — replies from `privacy@`
- Register all three in `registry.ts`.
- Body background `#ffffff`; brand accent `#3B82F6`; Cape Town footer line.

## 5. Branded unsubscribe page
- Add a React route at the unsubscribe path returned by the scaffold tool, wired to `handle-email-unsubscribe` (GET validate / POST confirm) using the existing UI shadcn primitives.

## 6. Deploy
- Deploy `process-email-queue`, `send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`, and (if present) `auth-email-hook`.

## 7. Verification
- Send one test app email to each mailbox (contact/support/privacy) via `send-transactional-email` and confirm `email_send_log.status = 'sent'`.
- Walk through every UI mailto: link (Privacy, Terms, Disclaimer, Footer, SupportSheet) to confirm all already point at the new domain.

## What you still need to do manually
Mailbox forwarding is **not** managed by Lovable. In Cloud → Emails → Manage Domains for `peptide-south-africa.co.za`, set up forwarding rules:
- `contact@peptide-south-africa.co.za` → your primary inbox
- `support@peptide-south-africa.co.za` → your primary inbox
- `privacy@peptide-south-africa.co.za` → your primary inbox

## Out of scope
- Decommissioning the old `notify.www.ridethetide.info` sender (leave parallel for now).
- Marketing/newsletter templates (not supported).
- Android native rebuild / store re-publish.

## Technical details
- Tools used: `email_domain--check_email_domain_status`, `email_domain--setup_email_infra`, `email_domain--scaffold_transactional_email`, `supabase--deploy_edge_functions`.
- Sender FQDN must be the delegated subdomain; root domain is display-only.
- Idempotency keys for verification sends prefixed `verify-<mailbox>-<timestamp>`.
