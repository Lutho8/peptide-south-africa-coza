// Feature flags for landing sections. Toggle off to safely disable
// without touching imports. Add new keys here as sections are added.
export const LANDING_SECTIONS = {
  pwaJourney: true,
  testimonials: true,
  whyFreeBand: true,
  researchTools: true,
  featuredPeptides: true,
  peptideCategories: true,
  blog: true,
  safetyDisclaimer: true,
  faq: true,
  cta: true,
  // HowItWorks was previously referenced in JSX without import — kept off
  // until properly re-imported & wired.
  howItWorks: false,
} as const;

export type LandingSectionKey = keyof typeof LANDING_SECTIONS;
