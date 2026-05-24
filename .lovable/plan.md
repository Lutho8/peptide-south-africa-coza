## Plan

### 1. Soften the security linter gate (unblock builds)

Confirmed from the workspace screenshot: this plan does not expose Build Secrets, so `SUPABASE_ACCESS_TOKEN` cannot be injected at build time. The current strict-mode behavior in `scripts/security-lint-check.ts` will keep aborting every production build. We'll switch to **soft mode when no signal is available**, while keeping **strict mode when either signal is present** so the gate still has teeth in CI/local with a token.

**New resolution behavior:**
1. `SUPABASE_ACCESS_TOKEN` present → call Management API, enforce strict (fail on offending findings).
2. Else if Supabase CLI on PATH → run `supabase db lint`, enforce strict.
3. Else → print a loud yellow WARNING banner explaining the gate is disarmed and **exit 0** so the build proceeds.
4. Hard-failure escape hatches preserved:
   - `LOVABLE_SKIP_SECURITY_LINT=1` still bypasses (loud red banner).
   - New `LOVABLE_SECURITY_LINT_STRICT=1` forces the old behavior (exit 1 when no signal available) — useful in GitHub Actions where we *do* want the gate to break the pipeline if the token is missing.

**Wording of the warn-and-pass banner** (printed in yellow, not red):
> ⚠ Security linter gate is running in soft mode. No SUPABASE_ACCESS_TOKEN and no Supabase CLI detected — findings cannot be checked this build. Add the token in Workspace Settings → Build Secrets, or run `bun run lint:security` locally with the CLI. Build will proceed.

**Docs:** update the README "Security linter gate" section to describe the three modes (strict-token, strict-cli, soft-warn) and the two env-var escape hatches.

**Files touched**
- `scripts/security-lint-check.ts` — replace the hard-fail branch with a soft-mode warning, gated by `LOVABLE_SECURITY_LINT_STRICT`.
- `README.md` — short update to the gate docs.

### 2. Phone-number login entry screen (matches reference)

Build a new entry screen used as the **first thing unauthenticated users see** before reaching the app, modeled exactly on the reference screenshot:

- Header card: "Login with phone number" + compliance subtext ("Due to regulatory changes in this industry, we now require an account login to access product information and continue browsing.")
- Phone field with country-code dropdown (default DE +49; include common EU/US/UK/ZA/AU codes) and a numeric phone input
- Big primary "Send Code" button (full-width, brand blue `#3B82F6`)
- Compliance checkbox + long-form research-use-only disclaimer (the exact text from the screenshot, reused as the canonical research disclaimer already present in the project)
- After "Send Code": switch to a 6-digit OTP input screen with "Resend code" + "Change number" affordances

**Auth wiring (Supabase phone OTP):**
- Use `supabase.auth.signInWithOtp({ phone })` to send the code, then `supabase.auth.verifyOtp({ phone, token, type: 'sms' })` to verify.
- Phone provider must be enabled in Lovable Cloud auth settings; this requires a Twilio/MessageBird SMS provider. **Open question below** — we need the user's choice/credentials before sign-in actually works. The UI ships either way; if the provider isn't configured the "Send Code" call will surface a clear "SMS provider not configured" toast.
- The compliance checkbox must be ticked before "Send Code" is enabled; checkbox state is stored alongside the user on first verify (new `profiles.research_use_acknowledged_at` timestamp via migration).

**Routing & gating:**
- New route `/welcome` rendering the phone-login screen.
- `AuthContext` / route guard: if user is unauthenticated and the current path is not in a small public allowlist (`/welcome`, `/disclaimer`, `/privacy`, `/terms`, `/coa/*`), redirect to `/welcome`.
- Existing Google/Apple OAuth from `AuthModal` is preserved as a secondary "Or continue with" row beneath the phone form (keeps the existing memory'd OAuth flow intact).
- Admin email (`lutho.kote@relicom.de`) and the trial email continue to work via OAuth — no regression to the hardcoded admin path.

**Design:**
- Reuses the existing brand tokens (`#3B82F6` primary, glass cards, luxury Framer Motion fade/slide), per project memory. No new colors.
- Mobile-first; 44px touch targets; the form fits inside one viewport on phones without scrolling for the primary action.

**Files touched / created**
- `src/pages/Welcome.tsx` (new) — phone + OTP screens, country-code dropdown, compliance checkbox.
- `src/components/auth/PhoneLoginForm.tsx` + `OtpVerifyForm.tsx` (new, split for clarity).
- `src/contexts/AuthContext.tsx` — add `signInWithPhone`, `verifyPhoneOtp` helpers; expose `researchAcknowledged`.
- `src/App.tsx` — register `/welcome` and add the unauth redirect guard.
- `src/components/auth/AuthModal.tsx` — minor: link "Use phone instead" to `/welcome`.
- Migration: add `research_use_acknowledged_at timestamptz` column to `profiles`; permissive RLS already covers it per project memory.

### Technical notes
- Country list lives in a small `src/data/countryCodes.ts` (ISO code, dial code, flag emoji). Kept short (~25 entries) to stay snappy on mobile.
- Phone normalization to E.164 happens client-side before the Supabase call (`+<dial><digits>`).
- OTP input uses the existing `InputOTP` shadcn component; 6 digits, auto-submit on completion.
- No paywall logic touched — free-access model is preserved.

### Open questions
1. **SMS provider** — Lovable Cloud's phone auth needs an SMS sender. Do you want to plug in **Twilio** (most common, you'd provide Account SID / Auth Token / Messaging Service SID), or skip SMS and keep the screen as Google/Apple-only for now? I'll ship the UI either way; this only affects whether "Send Code" works on day one.
2. **Replace or coexist?** Should `/welcome` fully **replace** the current landing page for logged-out users, or sit alongside it (landing remains public, "Sign in" buttons route to `/welcome`)? Reference screenshot implies *replace* — I'll go with replace unless you say otherwise.
