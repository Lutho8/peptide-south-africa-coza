

# Navigation, Peptide Content & Animated Logo Enhancement Plan

## Overview
This plan addresses three key requirements:
1. **Member Navigation to Hero**: Allow authenticated members to return to the public landing page/hero section
2. **Peptide Content Enhancement**: Populate peptide data to match the depth found on peptibase.dev/compare
3. **Animated Logo GIF**: Create a continuously spinning animated logo that serves as both site logo and favicon

---

## Part 1: Member Navigation to Hero Section

### Current Problem
Currently, authenticated members are locked into the dashboard view (`Index.tsx` lines 113-115) with no way to access the public landing page. The logo click only resets to the dashboard home tab.

### Solution
Add a "View Public Site" navigation option and update logo behavior for members.

**Files to update:**
- `src/pages/Index.tsx`
  - Add state `showLandingPage` to toggle between dashboard and landing page
  - Modify `handleLogoClick` to show landing page for members
  - Add a floating "Back to Dashboard" button when viewing landing page as member
- `src/components/layout/AppHeader.tsx`
  - Add visual indicator for members that clicking returns to public view
- `src/components/landing/LandingHeader.tsx`
  - Add "My Dashboard" link for authenticated users

### Implementation Details
```text
+---------------------------+
|  Index.tsx State Machine  |
+---------------------------+
       |
       v
[isLoading?] --yes--> Show Loader
       |
       no
       v
[!user?] --yes--> Show LandingPage (public)
       |
       no (member)
       v
[showLandingPage?] --yes--> Show LandingPage + "Back to Dashboard" FAB
       |
       no
       v
Show Dashboard (current behavior)
```

---

## Part 2: Peptide Content Population (peptibase.dev Parity)

### Current State
The existing `src/data/peptides.ts` contains 15 peptides with comprehensive data including:
- Molecular weight, half-life, longevity score
- Mechanism of action (detailed, research-grade)
- Benefits (general + athlete-specific)
- Dosing protocols (4 tiers: beginner, intermediate, advanced, athlete)
- Expected results timeline (4 phases)
- Janoshik testing verification
- Supplier information
- Research references (PubMed IDs)

### Gap Analysis vs. peptibase.dev/compare
The peptibase.dev comparison page shows additional fields that should be added:

| Field | Current Status | Action Required |
|-------|---------------|-----------------|
| Legal Status | Missing | Add field |
| Amino Acid Sequence | Missing | Add field |
| Bioavailability | Missing | Add field |
| Storage Requirements | Missing | Add field |
| Clinical Trial Status | Missing | Add field |
| FDA Approval Status | Implicit only | Add explicit field |
| Synergy Ratings | Partial (in stackingMatrix.ts) | Integrate into UI |
| Precautions/Warnings | Partial (in risks) | Enhance |

### Solution

**File to update: `src/data/peptides.ts`**
Extend the `Peptide` interface with new optional fields:

```typescript
export interface Peptide {
  // ...existing fields...
  
  // New fields for peptibase.dev parity
  aminoAcidSequence?: string;
  bioavailability?: string;
  storageRequirements?: string;
  legalStatus?: {
    usa: 'research-only' | 'prescription' | 'approved' | 'banned';
    eu: string;
    australia: string;
  };
  clinicalStatus?: 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'approved';
  fdaApproved?: boolean;
  fdaApprovalYear?: number;
  warnings?: string[];
  notableStudies?: Array<{
    title: string;
    year: number;
    finding: string;
    doi?: string;
  }>;
}
```

**Files to update for display:**
- `src/components/modals/PeptideDetailModal.tsx`
  - Add new sections for Legal Status, Clinical Trials, Amino Acid Sequence
  - Add "Notable Studies" expandable section
  - Add storage requirements info card
- `src/components/landing/PeptideCompare.tsx`
  - Add new comparison rows for the additional fields
  - Match peptibase.dev table structure

**Sample data enhancement for GHK-Cu:**
```typescript
{
  id: 'ghkcu',
  name: 'GHK-Cu',
  // ...existing fields...
  
  // New fields
  aminoAcidSequence: 'Gly-His-Lys-Cu',
  bioavailability: 'High (subcutaneous), Moderate (topical)',
  storageRequirements: 'Store at -20 degrees C, protect from light, stable 2 years lyophilized',
  legalStatus: {
    usa: 'research-only',
    eu: 'Cosmetic ingredient (topical), Research (injectable)',
    australia: 'Schedule 4 (prescription)'
  },
  clinicalStatus: 'phase2',
  fdaApproved: false,
  warnings: [
    'Monitor copper levels with extended use',
    'Discontinue if skin irritation occurs',
    'Not recommended during pregnancy'
  ],
  notableStudies: [
    {
      title: 'GHK-Cu effects on gene expression in human fibroblasts',
      year: 2014,
      finding: 'Upregulated 32% of human genes involved in wound healing',
      doi: '10.1016/j.gene.2014.02.016'
    }
  ]
}
```

---

## Part 3: Animated Logo GIF with Spinning Effect

### Current State
- Static PNG logo at `src/assets/logo-icon.png` (wave/tide design)
- Favicon uses static `public/favicon.png`
- No animated logo component exists

### Solution Overview
Create an animated spinning logo that:
1. Continuously rotates with a slow "tide" motion (360 degrees per 8 seconds)
2. Spins faster with a glow effect when clicked
3. Serves as both site logo and animated favicon
4. Is accessible and respects reduced motion preferences

### Implementation Approach
Use Framer Motion for the component animation (smoother than CSS-only, already in project).

**Files to create:**
- `src/components/ui/AnimatedLogo.tsx` - Reusable animated logo component
- `public/logo-animated.gif` - Generated animated GIF for favicon (using AI image generation)

**Files to update:**
- `index.html` - Update favicon references
- `public/manifest.json` - Update PWA icons
- `src/components/landing/LandingHeader.tsx` - Replace static logo with AnimatedLogo
- `src/components/layout/AppHeader.tsx` - Replace static logo with AnimatedLogo

### AnimatedLogo Component Design

```typescript
interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';      // 24px, 40px, 56px
  showText?: boolean;              // Show "Ride The Tide" text
  onClick?: () => void;            // Navigation handler
  className?: string;
}
```

Features:
- **Continuous rotation**: Slow 360 degree spin (8 second duration, infinite loop)
- **Click acceleration**: When clicked, spin speed increases to 0.5 seconds for one full rotation
- **Glow effect**: Subtle accent-colored glow on hover and click
- **Reduced motion**: Respects `prefers-reduced-motion` media query
- **Accessibility**: Proper aria-labels and keyboard navigation

### Animation CSS (to add to index.css)

```css
@keyframes logo-spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes logo-spin-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-logo-slow {
  animation: logo-spin-slow 8s linear infinite;
}

.animate-logo-fast {
  animation: logo-spin-fast 0.5s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-logo-slow,
  .animate-logo-fast {
    animation: none;
  }
}
```

### Animated GIF Favicon
Generate an animated GIF version of the wave logo using AI image generation:
- 64x64 pixel size (favicon compatible)
- Smooth 360 degree rotation
- Seamless loop
- Optimized file size (<100KB)

---

## Technical Summary

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/ui/AnimatedLogo.tsx` | Reusable spinning logo component |
| `public/logo-animated.gif` | Animated favicon/logo GIF |

### Files to Update
| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add `showLandingPage` state for member navigation |
| `src/components/layout/AppHeader.tsx` | Use AnimatedLogo, add "View Public Site" logic |
| `src/components/landing/LandingHeader.tsx` | Use AnimatedLogo, add "My Dashboard" for members |
| `src/data/peptides.ts` | Extend Peptide interface with new fields |
| `src/components/modals/PeptideDetailModal.tsx` | Display new peptide data fields |
| `src/components/landing/PeptideCompare.tsx` | Add new comparison rows |
| `index.html` | Update favicon to animated GIF |
| `public/manifest.json` | Update PWA icon references |
| `src/index.css` | Add logo animation keyframes |

### User Experience Flow

**For Members:**
1. Member logs in → Sees dashboard
2. Clicks animated logo → Navigates to public landing page (hero visible)
3. Floating "Back to Dashboard" button available
4. Can browse public content while authenticated
5. "My Dashboard" link in header returns to member area

**For Logo Animation:**
1. Page loads → Logo begins slow continuous spin
2. User hovers → Subtle glow appears
3. User clicks → Logo spins fast (1 rotation), glow intensifies, then navigates
4. Animation respects user's motion preferences

---

## Performance & Accessibility Notes

- Use `will-change: transform` for GPU acceleration on logo
- Lazy load the animated GIF favicon after initial page paint
- Provide static fallback for browsers not supporting animated favicons
- All animations are decorative - no information loss without them
- Proper focus states and keyboard navigation maintained

