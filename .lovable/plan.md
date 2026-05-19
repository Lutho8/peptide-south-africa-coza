## Plan

### 1. Make the Supabase SECURITY linter a hard build gate

Update `scripts/security-lint-check.ts` and `package.json` so the build fails on any new SECURITY warning, with no silent skips.

**New behavior (strict mode):**
- Run order on every build: `generate-sitemap.ts` → `security-lint-check.ts` → `vite build` (via `prebuild`).
- Resolution order for lint results:
  1. Supabase Management API (`/v1/projects/{ref}/database/lints`) when `SUPABASE_ACCESS_TOKEN` is set.
  2. `supabase db lint --level warning --schema public` if the Supabase CLI is on PATH.
  3. **No fallback to "skip".** If neither source is available, exit non-zero with a clear message:
     > "Security linter gate cannot run. Set SUPABASE_ACCESS_TOKEN or install the Supabase CLI. Build aborted."
- Filter findings to `category = SECURITY` and `level ∈ {WARN, ERROR}`.
- Compare against `scripts/security-lint-allowlist.json` (array of finding `name`+`cache_key`). Anything not in the allowlist → exit 1 and print a table of offending findings + remediation links.
- Exit 0 only when the resulting list is empty.
- Single escape hatch for true emergencies: `LOVABLE_SKIP_SECURITY_LINT=1` env var, which prints a loud warning. Not set anywhere by default.

**Wire-up:**
- `package.json` `prebuild`: `tsx scripts/generate-sitemap.ts && tsx scripts/security-lint-check.ts`.
- Add `lint:security` script for manual runs.
- `README.md`: short section on the gate, how to add a finding to the allowlist, and how to obtain `SUPABASE_ACCESS_TOKEN`.

**Allowlist seed:** start empty. The 15 existing warnings are being fixed in the parallel security-hardening work, so the gate starts clean.

### 2. Hide the "Edit with Lovable" badge on production

Call `publish_settings--set_badge_visibility` with `hide_badge: true`. Requires user approval and a Pro+ plan; if the plan check fails, surface the message and stop.

### Files touched
- `scripts/security-lint-check.ts` (rewrite — strict mode, no skip fallback)
- `scripts/security-lint-allowlist.json` (new, `[]`)
- `package.json` (`prebuild`, `lint:security`)
- `README.md` (docs section)

### Open question
None — proceeding with strict mode and empty allowlist on approval.
