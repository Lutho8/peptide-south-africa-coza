## Plan

### 1. Comparison page `/bpc-157-vs-tb-500`

Create `src/pages/comparisons/Bpc157VsTb500.tsx`. Standalone page (not using `GoalPage`) so it can host the comparison table layout.

Structure:
- **SEO head** — title "BPC-157 vs TB-500: Research Comparison | Peptide South Africa", meta description, canonical `https://peptide-south-africa.co.za/bpc-157-vs-tb-500`
- **JSON-LD** — `Article` schema + `BreadcrumbList`
- **Hero** — H1 "BPC-157 vs TB-500 Research Comparison", tagline
- **Side-by-side comparison table** — rows: Mechanism, Half-life, Dosing range, Best research use case, Onset timeline, Administration, Stack synergy. Uses `Table` shadcn component, responsive (stacks on mobile)
- **Long-form research content** (~450 words across 4 sections: Origin & structure, Mechanistic differences, When researchers reach for which, Why they're studied together)
- **Two big CTA cards** linking to `/peptides/bpc-157` and `/peptides/tb-500` entity pages
- SAHPRA disclaimer block + research disclaimer

### 2. "Research by Goal" dropdown in `AppHeader`

Add a new dropdown button between the Logo block and the Shop/Support block in `src/components/layout/AppHeader.tsx`. Uses shadcn `DropdownMenu`, matches existing pill-button styling (`rounded-xl bg-card/95 backdrop-blur border border-border shadow-md`). Items link to all 6 goal pages plus the new comparison page as a 7th item:

- Weight Loss → `/weight-loss-peptides-south-africa`
- Healing → `/healing-peptides-south-africa`
- Anti-Aging → `/anti-aging-peptides-south-africa`
- Cognitive → `/cognitive-peptides-south-africa`
- Growth Hormone → `/growth-hormone-peptides-south-africa`
- Libido (PT-141) → `/libido-peptides-south-africa`
- — divider —
- BPC-157 vs TB-500 → `/bpc-157-vs-tb-500`

Hidden on the very narrowest mobile (`hidden sm:flex`) to keep room for the logo, since the header already collapses the logo text below `sm`. Mobile users still reach these pages via the BottomNav / SupportSheet — flag this in the closing message.

### 3. Wire up

- `src/App.tsx` — add lazy import + route for the comparison page above the catch-all
- `scripts/generate-sitemap.ts` — append `/bpc-157-vs-tb-500` (priority 0.8, monthly)

### Files

- create `src/pages/comparisons/Bpc157VsTb500.tsx`
- edit `src/components/layout/AppHeader.tsx`
- edit `src/App.tsx`
- edit `scripts/generate-sitemap.ts`

### Out of scope (re-flag)

`HashRouter` — these URLs still resolve as `/#/bpc-157-vs-tb-500`. Hash routes index poorly. Pre-existing; not addressed.
