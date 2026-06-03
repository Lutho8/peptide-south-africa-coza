import { InjectionSite, InjectionZone, INJECTION_SITES } from './sites';

export interface RotationEntry {
  site: InjectionSite;
  date: string;
}

const STORAGE_KEY = 'injection-rotation-history';
const SITE_STATE_KEY = 'injection-site-states';

function loadHistory(): RotationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RotationEntry[];
    // Validate dates
    return parsed
      .filter((e) => e.site && e.date && !isNaN(new Date(e.date).getTime()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

function saveHistory(history: RotationEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

interface SiteState {
  disabled?: boolean;
  lastUsed?: string;
  injured?: boolean;
}

function loadSiteStates(): Record<string, SiteState> {
  try {
    const raw = localStorage.getItem(SITE_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSiteStates(states: Record<string, SiteState>) {
  localStorage.setItem(SITE_STATE_KEY, JSON.stringify(states));
}

/**
 * Get sites filtered by optional zone preference and injury status.
 */
export function getSitesByZone(zone: InjectionZone): InjectionSite[] {
  return INJECTION_SITES.filter((s) => s.zone === zone);
}

/**
 * Get the next suggested injection site based on rotation logic.
 * Least-recently-used, prefer different zone from last, respect disabled/injured.
 */
export function getNextSite(
  preferredZones?: InjectionZone[],
  excludeInjured = true
): InjectionSite {
  const history = loadHistory();
  const states = loadSiteStates();
  const now = new Date().getTime();

  // Build candidates
  let candidates = INJECTION_SITES.filter((site) => {
    const state = states[site.id];
    if (state?.disabled) return false;
    if (excludeInjured && state?.injured) return false;
    if (preferredZones && preferredZones.length > 0) {
      return preferredZones.includes(site.zone);
    }
    return true;
  });

  if (candidates.length === 0) {
    // Fallback: return first available site
    candidates = INJECTION_SITES.filter((s) => !states[s.id]?.disabled);
    if (candidates.length === 0) {
      return INJECTION_SITES[0];
    }
  }

  // Get last used zone
  const lastEntry = history[0];
  const lastZone = lastEntry?.site.zone;

  // Score candidates: LRU first, then zone variety bonus
  const scored = candidates.map((site) => {
    const state = states[site.id];
    const lastUsed = state?.lastUsed ? new Date(state.lastUsed).getTime() : 0;
    const hoursSinceUse = lastUsed ? (now - lastUsed) / 3600000 : Infinity;
    const isRecent = hoursSinceUse < 48;

    // Base score: hours since use (higher = better)
    let score = hoursSinceUse;

    // Bonus: different zone from last (avoid same spot)
    if (lastZone && site.zone !== lastZone) {
      score += 48; // 2-day equivalent bonus
    }

    // Penalty: recently used
    if (isRecent) {
      score -= 168; // 1 week penalty
    }

    // Penalty: same side as last (alternate sides)
    if (lastEntry && site.side === lastEntry.site.side && site.zone === lastZone) {
      score -= 24;
    }

    return { site, score, hoursSinceUse };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored[0].site;
}

/**
 * Mark a site as used (adds to history and updates lastUsed)
 */
export function markSiteUsed(siteId: string): InjectionSite {
  const site = INJECTION_SITES.find((s) => s.id === siteId);
  if (!site) throw new Error(`Site not found: ${siteId}`);

  const now = new Date().toISOString();
  const updatedSite = { ...site, lastUsed: now };

  // Update history
  const history = loadHistory();
  history.unshift({ site: updatedSite, date: now });
  // Keep max 100 entries
  if (history.length > 100) history.length = 100;
  saveHistory(history);

  // Update site state
  const states = loadSiteStates();
  states[siteId] = { ...states[siteId], lastUsed: now };
  saveSiteStates(states);

  return updatedSite;
}

/**
 * Toggle a site's disabled state
 */
export function toggleSiteDisabled(siteId: string): boolean {
  const states = loadSiteStates();
  const current = states[siteId]?.disabled ?? false;
  states[siteId] = { ...states[siteId], disabled: !current };
  saveSiteStates(states);
  return !current;
}

/**
 * Mark/unmark a site as injured
 */
export function toggleSiteInjured(siteId: string): boolean {
  const states = loadSiteStates();
  const current = states[siteId]?.injured ?? false;
  states[siteId] = { ...states[siteId], injured: !current };
  saveSiteStates(states);
  return !current;
}

/**
 * Get rotation history (most recent first)
 */
export function getRotationHistory(limit = 20): RotationEntry[] {
  return loadHistory().slice(0, limit);
}

/**
 * Get all site states
 */
export function getAllSiteStates(): Record<string, SiteState> {
  return loadSiteStates();
}

/**
 * Check if a site is available (not disabled, not injured, not recently used)
 */
export function isSiteAvailable(siteId: string): boolean {
  const states = loadSiteStates();
  const state = states[siteId];
  if (state?.disabled || state?.injured) return false;
  if (state?.lastUsed) {
    const hoursSince = (Date.now() - new Date(state.lastUsed).getTime()) / 3600000;
    if (hoursSince < 48) return false;
  }
  return true;
}

/**
 * Get site status: 'available' | 'recent' | 'disabled' | 'injured'
 */
export function getSiteStatus(siteId: string): 'available' | 'recent' | 'disabled' | 'injured' {
  const states = loadSiteStates();
  const state = states[siteId];
  if (state?.disabled) return 'disabled';
  if (state?.injured) return 'injured';
  if (state?.lastUsed) {
    const hoursSince = (Date.now() - new Date(state.lastUsed).getTime()) / 3600000;
    if (hoursSince < 48) return 'recent';
  }
  return 'available';
}

/**
 * Clear all rotation history (use with caution)
 */
export function clearRotationHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
