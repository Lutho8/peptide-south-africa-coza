// Builds a deep-link to the Peptide South Africa shop with consistent UTM tagging.
// Per project rules, always use the www subdomain — the apex is broken.

export interface StackLinkItem {
  slug: string;
  name?: string;
}

export interface StackLinkOptions {
  campaign?: string;
  medium?: string;
  patternIds?: string[];
}

const SHOP_BASE = 'https://peptide-south-africa.com/shop';

export function buildStackLink(items: StackLinkItem[], opts: StackLinkOptions = {}): string {
  const campaign = opts.campaign ?? 'stack_v2';
  const medium = opts.medium ?? 'bloodwork';
  const params = new URLSearchParams({
    utm_source: 'rtdinfo',
    utm_medium: medium,
    utm_campaign: campaign,
    items: items.map((i) => i.slug).join(','),
  });
  if (opts.patternIds && opts.patternIds.length) {
    params.set('patterns', opts.patternIds.join(','));
  }
  // Return path on the app so post-purchase activation can rehydrate the cart.
  params.set('return_to', '/bloodwork?stack_activated=1');
  return `${SHOP_BASE}?${params.toString()}`;
}
