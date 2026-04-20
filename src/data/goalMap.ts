import type { PeptideCategory } from '@/data/peptides';

/**
 * Maps user-selected goals (from ProfileSetupWizard) to peptide categories.
 * Used to highlight relevant peptides in EditStackModal and other pickers.
 *
 * Goal IDs come from src/components/onboarding/ProfileSetupWizard.tsx
 * Categories come from src/data/peptides.ts (PeptideCategory)
 */
export const goalToCategories: Record<string, PeptideCategory[]> = {
  'fat-loss': ['weight-loss', 'metabolic'],
  'muscle-gain': ['gh-secretagogue'],
  'recovery': ['healing', 'immune'],
  'longevity': ['longevity'],
  'cognitive': ['cognitive'],
  'energy': ['gh-secretagogue', 'metabolic'],
  'sleep': ['gh-secretagogue'],
  'metabolic': ['metabolic', 'weight-loss'],
};

export const goalLabels: Record<string, string> = {
  'fat-loss': 'Fat Loss',
  'muscle-gain': 'Muscle Gain',
  'recovery': 'Recovery & Healing',
  'longevity': 'Longevity',
  'cognitive': 'Cognitive Edge',
  'energy': 'Energy & Performance',
  'sleep': 'Sleep Quality',
  'metabolic': 'Metabolic Health',
};

/**
 * Build the set of peptide categories matching a user's goals.
 */
export function getCategoriesForGoals(goals: string[] | undefined): Set<PeptideCategory> {
  const set = new Set<PeptideCategory>();
  if (!goals?.length) return set;
  for (const goal of goals) {
    const cats = goalToCategories[goal];
    if (cats) cats.forEach(c => set.add(c));
  }
  return set;
}

/**
 * Resolve goal IDs to display labels. Falls back to the raw goal string
 * if it's already a label (legacy profiles).
 */
export function getGoalLabels(goals: string[] | undefined): string[] {
  if (!goals?.length) return [];
  return goals.map(g => goalLabels[g] ?? g);
}
