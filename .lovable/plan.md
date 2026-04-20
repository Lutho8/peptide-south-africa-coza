

## Plan: Renpho pairing guide + BT sync status pill

Two small UX additions to make the Renpho scale connection feel reliable and discoverable.

### 1. "How to pair my Renpho" collapsible (`src/components/settings/BluetoothScaleConnection.tsx`)

Add a `Collapsible` (already available at `src/components/ui/collapsible.tsx`) below the connection button that walks first-time users through the pairing dance.

- Trigger: ghost-styled row with `HelpCircle` icon + label **"How to pair my Renpho scale"** + chevron that rotates on open.
- Content: numbered 3-step list with brief, friendly copy:
  1. **Open the Renpho app** on your phone and **forget / unpair** the scale from it (Bluetooth scales only talk to one device at a time).
  2. **Step on the scale** so the display lights up — it should now be in pairing mode.
  3. **Tap "Connect Scale" above** and pick your scale from the browser's Bluetooth chooser.
- Add a small troubleshooting hint at the bottom: *"Still not showing? Toggle Bluetooth off/on in your phone settings, then try again."*
- Keep the existing iOS notice and supported-brand list intact.

### 2. "Connected to Renpho ✓" status pill (`src/components/modals/BodyCompositionModal.tsx`)

Show a live sync confirmation in the modal header when a Bluetooth-sourced entry exists in the last 24h.

- Compute `recentBtEntry = history.find(h => h.source === 'renpho' && (Date.now() - new Date(h.date).getTime()) < 24*60*60*1000)`.
- If present, render a small pill next to the `DialogTitle`:
  - Style: `bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-full px-2 py-0.5 text-xs`
  - Content: `<Bluetooth size={10} />` + **"Connected to Renpho ✓"**
- If absent, no pill (avoids noise for manual-entry users).
- Place it inline with the title via a flex wrapper so it sits to the right of "Body Composition".

### Files touched

```text
src/components/settings/BluetoothScaleConnection.tsx  ← Renpho pairing collapsible
src/components/modals/BodyCompositionModal.tsx        ← header sync pill
```

No new dependencies. `Collapsible`, `Bluetooth`, `HelpCircle`, and `ChevronDown` are all already imported across the codebase.

