# Better error visibility + graceful import-failure fallback

## Goals
1. When any screen (Daily Log included) crashes, capture the error with stack + route so you can review it later without needing Vite's red overlay.
2. If a lazy-loaded UI module fails to import (the exact class of bug that hid Daily Log), show a friendly inline retry card instead of letting the failure cascade.
3. Everything tuned for mobile: small footprint, readable on narrow screens, no horizontal scroll, large tap targets.

## What I'll build

### 1. Client error log (local, no backend changes)
- New `src/lib/errorLog.ts`:
  - `logClientError(error, context)` writes `{ id, timestamp, route, userAgent, message, stack, componentStack?, context }` into `localStorage` under `peptide-sa:error-log` (ring buffer, last 50).
  - `getClientErrors()` / `clearClientErrors()` helpers.
  - Also `console.error`s a single grouped entry so it's visible in DevTools.
- New `src/lib/installGlobalErrorHandlers.ts`, called once from `src/main.tsx`:
  - `window.addEventListener('error', ...)` and `'unhandledrejection'` → `logClientError`.
  - Captures `ChunkLoadError` / failed dynamic imports explicitly with a `kind: 'import'` tag.

### 2. Upgraded `ErrorBoundary`
- Extend `src/components/ui/ErrorBoundary.tsx`:
  - `componentDidCatch` now calls `logClientError` with the component stack and current `location.pathname`.
  - Detect import/chunk failures (`error.name === 'ChunkLoadError'` or message contains `Failed to fetch dynamically imported module` / `Importing a module script failed`). In that case render a distinct "Couldn't load this section" card with **Retry** and **Reload app** buttons. Retry clears the boundary; Reload does `window.location.reload()` to refetch the chunk.
  - Mobile-first fallback: full-width card, `px-4 py-10`, stacked buttons on `sm:` and below, `min-h-11` tap targets, `text-base` body, no fixed widths.

### 3. Per-section isolation so one bad import doesn't blank the app
- Already wrapping screens with `ErrorBoundary` in `src/pages/Index.tsx`. Add the same wrap around the global app shell pieces that currently sit outside any boundary:
  - In `src/App.tsx`, wrap `<Toaster />`, `<Sonner />`, and the router outlet in a top-level `ErrorBoundary` with `fallbackTitle="App shell failed to load"` so a single missing UI primitive (e.g. the past `@/components/ui/toaster` resolution failure) renders the friendly card instead of a blank screen.
  - Inside `Index.tsx`, also wrap each modal mount (`BodyCompositionModal`, `DoseTrackerModal`, etc.) once in a lightweight boundary so a modal crash doesn't kill the active tab.

### 4. In-app error log viewer (so you can read errors without the overlay)
- New `src/components/debug/ErrorLogPanel.tsx`: list of recent entries (time, route, message, expandable stack), "Copy all" and "Clear" buttons. Mobile layout: stacked cards, monospace stack in a `max-h-60 overflow-auto` block, `text-xs` on phones.
- Surface it from `SettingsScreen` as a new row "Diagnostics → Recent errors" (already the natural place; no new nav). Badge with the count when >0.

### 5. Mobile polish
- Fallback card: `w-full max-w-md mx-auto`, `gap-3`, `rounded-2xl`, icon 40px, headline `text-lg`, body `text-sm`, buttons `h-11 w-full sm:w-auto`.
- Respect `env(safe-area-inset-bottom)` on the fallback's button row when it appears as a full-screen replacement.
- Error log panel uses the existing settings scroll container, no new fixed positioning.

## Out of scope
- No backend table / edge function for remote error shipping (keep it local-only for now; can add a Cloud table later if you want cross-device visibility).
- No changes to `DailyLogScreen` itself — today's failure was a Vite resolution issue, not a logic bug. This plan makes the next occurrence visible and non-blocking.

## Files touched
- add: `src/lib/errorLog.ts`, `src/lib/installGlobalErrorHandlers.ts`, `src/components/debug/ErrorLogPanel.tsx`
- edit: `src/components/ui/ErrorBoundary.tsx`, `src/App.tsx`, `src/main.tsx`, `src/pages/Index.tsx`, `src/screens/SettingsScreen.tsx`
