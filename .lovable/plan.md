# Q&A → NocoBase Lead Capture: Test Definition + Zoom & Admin Wiring

## Why nothing is showing up in NocoBase today

The edge function logs show the live `NOCOBASE_API_URL` secret is literally:

```
https://[your-nocobase-domain]/api
```

That placeholder fails at `new URL(...)` before any HTTP call goes out. The real base URL is `https://a-zr3nluc60rf.v13.demo.nocobase.com/api`. This is the single biggest blocker — every Q&A submit is silently failing today.

---

## The Acceptance Test (the "definition of done")

We will use this exact end-to-end test to confirm the system works. Both of us should agree on it before changes go in.

**Test name:** Q&A modal submission creates a NocoBase lead

**Steps:**
1. Open `https://peptide-mastery.lovable.app/live-qa` in a fresh incognito window (no prior session).
2. Click **Reserve My Spot**.
3. In the modal, enter:
   - First name: `Test`
   - Email: `qa-test+<timestamp>@ridethetide.info` (unique each run)
   - Check the consent box
   - Optionally check "I'm also interested in Premium"
4. Submit.

**Expected results (all must pass):**
- ✅ UI shows the "What happens next" confirmation card (already implemented).
- ✅ A new row appears in the NocoBase **leads** collection within 5 seconds with: `email`, `firstName=Test`, `source=qa_modal`, `planInterest=undecided` (or `premium` if checked), `leadStatus=nurturing` (because qa_signup = 15 pts, but if combined with premium intent, status escalates), `leadScore≥15`.
- ✅ A new row appears in the NocoBase **activities** collection with `activityType=qa_signup`, `pageUrl` set, and a `leadEmail` reference back to the lead.
- ✅ Submitting the same email a second time **updates** the existing lead (no duplicate row), bumps `leadScore`, and adds a second activity row.
- ✅ Edge function logs (`nocobase-sync`) show no errors for the request.
- ✅ Admin notification email arrives at `lutho.kote@relicom.de` within 1 minute summarising the new lead.

If any of those six checks fail, the feature is not done.

---

## What we will change

### 1. Fix the broken NocoBase URL (the actual blocker)

Update the `NOCOBASE_API_URL` Supabase secret from the placeholder to:

```
https://a-zr3nluc60rf.v13.demo.nocobase.com/api
```

No code change needed — only the secret value. After updating, the existing `nocobase-sync` function will start working immediately. We will then run the acceptance test above to confirm.

### 2. Make `lutho.kote@relicom.de` the admin recipient for all lead activity

Add a small notification step inside `supabase/functions/nocobase-sync/index.ts` so that whenever a lead is captured or activity logged, an email is sent to `lutho.kote@relicom.de` summarising:
- Lead email + name
- Source (e.g. `qa_modal`)
- Plan interest
- Activity type + page URL
- Current lead score and status
- Direct link to the lead record in NocoBase

Implementation:
- Define a constant `ADMIN_EMAIL = 'lutho.kote@relicom.de'` at the top of the function.
- Send the email via the existing **Resend** integration (already used elsewhere in the project for transactional mail). If Resend isn't yet configured for this project we'll add the `RESEND_API_KEY` secret.
- Wrap the send in `try/catch` so a failed email never blocks the NocoBase write.

### 3. Connect Zoom for live Q&A sessions

The Q&A copy already promises "Zoom link will be emailed 24 hours before the session." Today that link is manual. To make it automatic and admin-controlled by `lutho.kote@relicom.de`:

**Option A — Recommended: connect Zoom via Lovable's standard Zoom-style flow using the connector gateway**
There is currently no first-party Zoom connector in the standard connector list, so we will use a per-account API token approach:

1. In your Zoom account (signed in as `lutho.kote@relicom.de`), create a **Server-to-Server OAuth app** in the Zoom Marketplace.
2. Copy the **Account ID**, **Client ID**, and **Client Secret**.
3. Add three Supabase secrets: `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`.
4. Create a new edge function `zoom-create-meeting` that:
   - Exchanges the client credentials for a short-lived access token.
   - Creates a recurring monthly Zoom webinar (1st Saturday, 7 PM CET) under the host `lutho.kote@relicom.de`.
   - Returns the join URL, registration URL, and meeting ID.
5. Store the resulting meeting metadata in a new Supabase table `live_qa_sessions` (date, zoom_join_url, zoom_meeting_id, host_email).
6. The Q&A registration flow then:
   - Pulls the next session's Zoom URL from `live_qa_sessions`.
   - Includes it in the confirmation email and the `.ics` calendar file (replacing the current "link will be sent later" placeholder).
   - Mirrors the registration into NocoBase as today.

If you'd rather skip the Zoom API and just keep emailing a static link manually, tell me and I'll drop step 3 — but the lead capture + admin email parts still ship.

---

## Files & infra touched

- **Secret update (no code):** `NOCOBASE_API_URL` → real URL.
- **Edited:** `supabase/functions/nocobase-sync/index.ts` — add admin email notification.
- **New (if Zoom approved):** `supabase/functions/zoom-create-meeting/index.ts`, table `live_qa_sessions`, secrets `ZOOM_ACCOUNT_ID` / `ZOOM_CLIENT_ID` / `ZOOM_CLIENT_SECRET`, plus `RESEND_API_KEY` if not already set.
- **Edited (if Zoom approved):** `src/pages/LiveQnA.tsx` — read next-session Zoom URL from DB and inject into the `.ics` and confirmation card.

## Order of operations

1. You approve this plan.
2. I update the `NOCOBASE_API_URL` secret to the real value.
3. I add the admin-email notification to `nocobase-sync` and deploy.
4. We run the acceptance test together. ✅ = NocoBase lead capture is officially "working."
5. Then we tackle the Zoom integration (needs your Zoom Server-to-Server OAuth credentials and Resend API key — I'll request them via the secrets prompt at that point, not now).

---

## Two things I need from you before step 5

- Confirm you want the **automated Zoom webinar creation** (Option A) vs. continuing to email a static Zoom link manually.
- Confirm `lutho.kote@relicom.de` is the Zoom host account (so meetings are created under it).
