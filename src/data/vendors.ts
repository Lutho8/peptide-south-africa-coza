export type VendorRating = 'A' | 'A-B' | 'A-C' | 'A-D' | 'A-E';

export interface Vendor {
  name: string;
  rating: VendorRating;
  products: number;
  tests: number;
  avgScore: number;
  url: string;
}

export const allVendors: Vendor[] = [
  { name: 'Paradigm Peptide', rating: 'A', products: 2, tests: 14, avgScore: 9.1, url: 'https://www.finnrick.com/vendors/paradigm-peptide' },
  { name: 'Trusted Peptide', rating: 'A', products: 1, tests: 2, avgScore: 10.0, url: 'https://www.finnrick.com/vendors/trusted-peptide' },
  { name: 'Risynth Bio', rating: 'A', products: 2, tests: 8, avgScore: 9.1, url: 'https://www.finnrick.com/vendors/risynth-bio' },
  { name: 'Orbitrex Peptides', rating: 'A', products: 3, tests: 13, avgScore: 9.0, url: 'https://www.finnrick.com/vendors/orbitrex-peptides' },
  { name: 'NUPEPS Peptides', rating: 'A', products: 2, tests: 4, avgScore: 9.0, url: 'https://www.finnrick.com/vendors/nupeps-peptides' },
  { name: 'Aavant Research', rating: 'A', products: 2, tests: 11, avgScore: 8.8, url: 'https://www.finnrick.com/vendors/aavant-research' },
  { name: 'PeptiAtlas', rating: 'A', products: 1, tests: 4, avgScore: 8.8, url: 'https://www.finnrick.com/vendors/peptiatlas' },
  { name: 'Peptide Partners', rating: 'A-C', products: 5, tests: 38, avgScore: 8.4, url: 'https://www.finnrick.com/vendors/peptide-partners' },
  { name: 'Peptide Technologies', rating: 'A-B', products: 3, tests: 11, avgScore: 8.3, url: 'https://www.finnrick.com/vendors/peptide-technologies' },
  { name: 'Amino Asylum', rating: 'A-B', products: 4, tests: 22, avgScore: 8.2, url: 'https://www.finnrick.com/vendors/amino-asylum' },
  { name: 'BioTech Peptides', rating: 'A-B', products: 6, tests: 30, avgScore: 8.1, url: 'https://www.finnrick.com/vendors/biotech-peptides' },
  { name: 'Core Peptides', rating: 'A-B', products: 3, tests: 15, avgScore: 8.0, url: 'https://www.finnrick.com/vendors/core-peptides' },
  { name: 'Swiss Chems', rating: 'A-C', products: 7, tests: 42, avgScore: 7.9, url: 'https://www.finnrick.com/vendors/swiss-chems' },
  { name: 'Limitless Life', rating: 'A-C', products: 4, tests: 19, avgScore: 7.8, url: 'https://www.finnrick.com/vendors/limitless-life' },
  { name: 'Atomik Labz', rating: 'A-C', products: 9, tests: 38, avgScore: 7.7, url: 'https://www.finnrick.com/vendors/atomik-labz' },
  { name: 'PureRawz', rating: 'A-C', products: 8, tests: 45, avgScore: 7.6, url: 'https://www.finnrick.com/vendors/purerawz' },
  { name: 'Chemyo', rating: 'A-C', products: 5, tests: 28, avgScore: 7.5, url: 'https://www.finnrick.com/vendors/chemyo' },
  { name: 'Polaris Peptides', rating: 'A-D', products: 9, tests: 97, avgScore: 7.3, url: 'https://www.finnrick.com/vendors/polaris-peptides' },
  { name: 'Xcel Peptides', rating: 'A-D', products: 6, tests: 35, avgScore: 7.1, url: 'https://www.finnrick.com/vendors/xcel-peptides' },
  { name: 'Peptide Sciences', rating: 'A-E', products: 10, tests: 113, avgScore: 6.8, url: 'https://www.finnrick.com/vendors/peptide-sciences' },
  { name: 'Direct Peptides', rating: 'A-D', products: 4, tests: 20, avgScore: 7.0, url: 'https://www.finnrick.com/vendors/direct-peptides' },
  { name: 'Evolve Clinics', rating: 'A-C', products: 3, tests: 16, avgScore: 7.8, url: 'https://www.finnrick.com/vendors/evolve-clinics' },
  { name: 'Titan Peptides', rating: 'A-B', products: 5, tests: 25, avgScore: 8.0, url: 'https://www.finnrick.com/vendors/titan-peptides' },
  { name: 'Pinnacle Peptides', rating: 'A-C', products: 6, tests: 32, avgScore: 7.4, url: 'https://www.finnrick.com/vendors/pinnacle-peptides' },
];

export const ratingColor: Record<VendorRating, string> = {
  'A': 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400',
  'A-B': 'bg-teal-500/15 text-teal-600 border-teal-500/25 dark:text-teal-400',
  'A-C': 'bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400',
  'A-D': 'bg-orange-500/15 text-orange-600 border-orange-500/25 dark:text-orange-400',
  'A-E': 'bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400',
};

export function getScoreColor(score: number): string {
  if (score >= 9) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 7.5) return 'text-teal-600 dark:text-teal-400';
  if (score >= 6) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}
