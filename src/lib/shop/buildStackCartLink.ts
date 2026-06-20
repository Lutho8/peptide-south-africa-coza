// Deep-link helper: turn the user's active stack into a one-click cart URL
// on the Peptide South Africa store. Always use www subdomain (apex is broken).
//
// The store accepts a comma-separated list of slugs via ?items=... and
// we tag UTMs so downstream analytics can attribute the source.

import { topPeptidesSlugs } from '@/data/entitySlugs';

const STORE_BASE = 'https://peptide-south-africa.com';

// Reverse map: peptide id → store slug
const idToSlug: Record<string, string> = Object.entries(topPeptidesSlugs).reduce(
  (acc, [slug, id]) => {
    acc[id] = slug;
    return acc;
  },
  {} as Record<string, string>,
);

export interface CartStackItem {
  peptideId: string;
  name?: string;
}

export interface BuildCartLinkOptions {
  campaign?: string;
  medium?: string;
}

/**
 * Build a deep-link to the Peptide South Africa store cart preloaded with the
 * user's current stack. Items without a known store slug fall back to the
 * peptide id as a search hint.
 */
export function buildStackCartLink(
  items: CartStackItem[],
  opts: BuildCartLinkOptions = {},
): string {
  const slugs = items
    .map((i) => idToSlug[i.peptideId] ?? slugify(i.name ?? i.peptideId))
    .filter(Boolean);

  const params = new URLSearchParams({
    utm_source: 'tracker',
    utm_medium: opts.medium ?? 'my_stack',
    utm_campaign: opts.campaign ?? 'buy_stack',
    items: slugs.join(','),
  });

  return `${STORE_BASE}/cart/add?${params.toString()}`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
