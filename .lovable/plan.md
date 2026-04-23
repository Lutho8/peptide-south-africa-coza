

## Plan: Diagnose the actual dev server failure first

Before designing new infrastructure, I need to flag something important: the three requested features (startup health check, auto-restart with backoff, log-tail UI) describe **dev-server / sandbox daemon behavior** — that layer is owned by the Lovable platform itself, not by your project's source code. Nothing you add to `src/`, `vite.config.ts`, or a Vite plugin can supervise the daemon that *runs* Vite, restart it, or render UI when Vite is down (the UI can't render if the dev server isn't up).

So the practical path forward is two-part: **(A) actually fix the current crash**, and **(B) add the lightweight pieces that *are* in your control** to make future failures easier to diagnose.

### A. Diagnose & fix the current "Process exited with code 1" crash

The earlier `rm -rf node_modules && bun install` recovery is a symptom-fix, not a root cause. The crash returned, which means something in the repo is making Vite exit on boot. I'll investigate in this order once we switch to default mode:

1. Read `/tmp/dev-server-logs/dev-server.log` (last 200 lines + grep for `error|failed|Cannot find|SyntaxError`) to get the actual Vite/esbuild stack trace.
2. Check the most recently edited files for syntax/import errors:
   - `src/components/doses/InsulinNeedleGuide.tsx` (last large edit)
   - `src/components/biomarkers/BiomarkerInsights.tsx`
   - `src/contexts/AuthContext.tsx`
   - `src/services/pushScheduler.ts`
3. Run `bunx tsc --noEmit` to surface type/parse errors that crash Vite's transform pipeline.
4. Verify `node_modules/vite/package.json` and `node_modules/esbuild/bin/esbuild` exist; reinstall only if missing.
5. Apply the targeted fix (most likely a syntax error in one of the recently edited files — that's the typical cause of "exit 1" loops after a feature edit).

### B. In-repo diagnostics you *can* own

These are the parts of your three requests that make sense at the project level:

1. **Startup sanity check script** — `scripts/check-dev-env.mjs`:
   - Verifies `node_modules/vite/package.json` and `node_modules/esbuild` exist.
   - Verifies `@vitejs/plugin-react-swc` resolves.
   - Prints actionable remediation (`rm -rf node_modules && bun install`) when something is missing.
   - Wired into `package.json` as a `predev` script so `bun run dev` runs it first and fails fast with a clear message instead of a generic "exit 1".

2. **Vite boot-error logger plugin** — small inline plugin in `vite.config.ts`:
   - Hooks `configResolved` and `buildStart` to log a one-line "Vite booted OK at <time>" marker.
   - Wraps the config in a try/catch so any boot-time throw is logged with file + line before the process exits, making the dev-server log far more useful.

3. **In-app "dev server unhealthy" surface** — **not feasible**. If Vite is down, the React app isn't running, so there's no UI to render the link in. The correct surface for that is the Lovable platform's existing build-error panel (which is already what you're seeing). I'll skip this rather than build something that can't work.

4. **Auto-restart with exponential backoff** — **not feasible from inside the repo**. The sandbox daemon already restarts the process (you can see `restarts=5` in the error). Backoff policy lives in the platform supervisor, not in your code. I'll skip this.

### What I'll deliver

```text
1. Read dev-server.log + recently-edited files, identify the real crash, and fix it.
2. scripts/check-dev-env.mjs                   ← preflight check, actionable output
3. package.json                                ← add "predev": "node scripts/check-dev-env.mjs"
4. vite.config.ts                              ← add boot-logger plugin with try/catch
```

### Honest scope note

I'm explicitly **not** going to fabricate a "daemon restart with exponential backoff" or a "log-tail link in the UI" — those would be theater. Fixing the real boot crash + adding the preflight check is what will actually stop this from recurring. If you want platform-level supervisor changes, that's a Lovable support request, not a code change.

