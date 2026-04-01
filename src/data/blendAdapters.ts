// Adapts PeptideBlend data to work with the peptide stack/dose/cycle system
import { Peptide, PeptideCategory } from './peptides';
import { peptideBlends, peptideStacks, PeptideBlend } from './peptideBlends';

const categoryMap: Record<string, PeptideCategory> = {
  'Healing & Regeneration': 'healing',
  'Weight Management': 'weight-loss',
  'Metabolic Health': 'metabolic',
  'Anti-Aging & Longevity': 'longevity',
  'Longevity & Telomere': 'longevity',
  'Neuro-Healing': 'cognitive',
  'Cognitive Enhancement': 'cognitive',
  'Immune Support': 'immune',
  'Growth Hormone': 'gh-secretagogue',
  'Skin & Hair': 'skin-hair',
};

function mapCategory(blendCategory: string): PeptideCategory {
  return categoryMap[blendCategory] || 'healing';
}

export function blendToPeptide(blend: PeptideBlend): Peptide {
  const typicalDose = blend.quickstart.typicalDose || blend.dosingTable[0]?.dailyDose || 'See protocol';
  
  return {
    id: blend.id,
    name: blend.shortName,
    shortName: blend.shortName,
    category: mapCategory(blend.category),
    longevityScore: 7,
    mechanism: blend.howItWorks,
    benefits: blend.benefits.slice(0, 5),
    athleteBenefits: blend.benefits.slice(0, 3),
    risks: blend.sideEffects.slice(0, 3),
    dosing: {
      beginner: typicalDose,
      intermediate: typicalDose,
      advanced: typicalDose,
      athlete: typicalDose,
    },
    frequency: blend.dosingFrequency.split('.')[0],
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Initial adaptation; subtle improvements beginning',
      week3_4: 'Noticeable effects emerging from synergistic components',
      week5_8: 'Full protocol benefits realized',
      longTerm: 'Sustained benefits with proper cycling',
    },
    janoshikTested: false,
    supplier: {
      name: 'Research Supplier',
      productCode: blend.id,
      price: 0,
      stock: 'in-stock',
    },
    cycleProtocol: {
      minDays: 28,
      maxDays: blend.dosingTable.length > 1 ? 56 : 28,
      breakDays: 14,
      restartAdvice: 'Allow a 2-4 week break before restarting the blend protocol.',
      breakAdvice: ['Monitor progress during break', 'Maintain nutrition and lifestyle factors'],
    },
  };
}

export const allBlendsAsPeptides: Peptide[] = [
  ...peptideBlends.map(blendToPeptide),
  ...peptideStacks.map(blendToPeptide),
];

// Combined list of all individual peptides + blends for selection UIs
import { peptides } from './peptides';

export interface SelectablePeptide {
  id: string;
  name: string;
  shortName: string;
  category: PeptideCategory;
  isBlend: boolean;
  components?: string[];
  blendData?: PeptideBlend;
}

export function getAllSelectablePeptides(): SelectablePeptide[] {
  const individualPeptides: SelectablePeptide[] = peptides.map(p => ({
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    category: p.category,
    isBlend: false,
  }));

  const blendPeptides: SelectablePeptide[] = [...peptideBlends, ...peptideStacks].map(b => ({
    id: b.id,
    name: `${b.shortName} (${b.type === 'blend' ? 'Blend' : 'Stack'})`,
    shortName: b.shortName,
    category: mapCategory(b.category),
    isBlend: true,
    components: b.components,
    blendData: b,
  }));

  return [...individualPeptides, ...blendPeptides];
}

// Find a peptide OR blend by ID
export function findPeptideOrBlend(id: string): Peptide | null {
  const individual = peptides.find(p => p.id === id);
  if (individual) return individual;
  
  const blend = [...peptideBlends, ...peptideStacks].find(b => b.id === id);
  if (blend) return blendToPeptide(blend);
  
  return null;
}

// Find the raw blend data by ID
export function findBlendData(id: string): PeptideBlend | null {
  return [...peptideBlends, ...peptideStacks].find(b => b.id === id) || null;
}
