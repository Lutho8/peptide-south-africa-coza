import type { ResultBiomarker } from '@/components/bloodwork/BloodworkResults';

export type SystemKey = 'hormones' | 'metabolic' | 'cardiovascular' | 'liver' | 'kidney' | 'immune';
export type SystemStatus = 'optimal' | 'watch' | 'action';

export interface SystemSummary {
  key: SystemKey;
  label: string;
  icon: string; // lucide icon name reference
  categories: string[]; // biomarker.category values
  total: number;
  flagged: number; // non-normal count
  critical: number;
  status: SystemStatus;
}

const DEFS: { key: SystemKey; label: string; icon: string; categories: string[] }[] = [
  { key: 'hormones', label: 'Hormones', icon: 'Sparkles', categories: ['hormone', 'thyroid'] },
  { key: 'metabolic', label: 'Metabolic', icon: 'Flame', categories: ['metabolic'] },
  { key: 'cardiovascular', label: 'Cardiovascular', icon: 'HeartPulse', categories: ['lipid'] },
  { key: 'liver', label: 'Liver', icon: 'Droplet', categories: ['liver'] },
  { key: 'kidney', label: 'Kidney', icon: 'Filter', categories: ['kidney'] },
  { key: 'immune', label: 'Immune & Inflammation', icon: 'Shield', categories: ['inflammation'] },
];

export function summarizeSystems(biomarkers: ResultBiomarker[]): SystemSummary[] {
  return DEFS.map((def) => {
    const items = biomarkers.filter((b) => def.categories.includes((b.category || '').toLowerCase()));
    const flagged = items.filter((b) => b.status !== 'normal').length;
    const critical = items.filter((b) => b.status === 'critical').length;
    const status: SystemStatus = critical > 0 ? 'action' : flagged > 0 ? 'watch' : 'optimal';
    return {
      key: def.key,
      label: def.label,
      icon: def.icon,
      categories: def.categories,
      total: items.length,
      flagged,
      critical,
      status,
    };
  });
}
