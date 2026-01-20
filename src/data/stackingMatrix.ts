import { Peptide, peptides } from './peptides';

export type CompatibilityLevel = 'synergistic' | 'compatible' | 'caution' | 'avoid';

export interface StackingInteraction {
  peptideId1: string;
  peptideId2: string;
  compatibility: CompatibilityLevel;
  notes: string;
  timing?: string;
}

// Comprehensive stacking interaction database
export const stackingInteractions: StackingInteraction[] = [
  // Synergistic combinations (work great together)
  {
    peptideId1: 'ipamorelin',
    peptideId2: 'cjc1295',
    compatibility: 'synergistic',
    notes: 'Classic GH stack. CJC-1295 amplifies GH pulse amplitude while Ipamorelin triggers release. Together they provide superior GH elevation.',
    timing: 'Take together 30 min before bed on empty stomach'
  },
  {
    peptideId1: 'bpc157',
    peptideId2: 'tb500',
    compatibility: 'synergistic',
    notes: 'Healing stack. BPC-157 works locally while TB-500 provides systemic healing. Together they accelerate injury recovery dramatically.',
    timing: 'Can inject at same time, different sites preferred'
  },
  {
    peptideId1: 'ss31',
    peptideId2: 'motsc',
    compatibility: 'synergistic',
    notes: 'Mitochondrial optimization stack. SS-31 stabilizes electron transport chain while MOTS-c activates AMPK. Enhanced energy production.',
    timing: 'Morning dosing recommended for both'
  },
  {
    peptideId1: 'epitalon',
    peptideId2: 'ghkcu',
    compatibility: 'synergistic',
    notes: 'Anti-aging stack. Epitalon targets telomeres while GHK-Cu activates regenerative genes. Comprehensive longevity approach.',
    timing: 'Can be used in same protocol, different mechanisms'
  },
  {
    peptideId1: 'ta1',
    peptideId2: 'bpc157',
    compatibility: 'synergistic',
    notes: 'Immune-healing stack. TA1 optimizes immune function while BPC-157 reduces inflammation and promotes tissue repair.',
    timing: 'TA1 morning, BPC-157 any time near injury'
  },
  {
    peptideId1: 'semax',
    peptideId2: 'ss31',
    compatibility: 'synergistic',
    notes: 'Cognitive-energy stack. Semax enhances BDNF and neuroplasticity while SS-31 provides mitochondrial support for brain energy.',
    timing: 'Morning dosing for optimal cognitive benefits'
  },
  
  // Compatible combinations (safe together, additive benefits)
  {
    peptideId1: 'retatrutide',
    peptideId2: 'ipamorelin',
    compatibility: 'compatible',
    notes: 'Metabolic-GH stack. Retatrutide handles fat loss and appetite while GH secretagogues support muscle preservation.',
    timing: 'Retatrutide weekly, Ipam daily before bed'
  },
  {
    peptideId1: 'retatrutide',
    peptideId2: 'cjc1295',
    compatibility: 'compatible',
    notes: 'Can be combined for enhanced body recomposition. GH support helps maintain muscle during caloric deficit.',
    timing: 'Retatrutide morning, CJC before bed'
  },
  {
    peptideId1: 'bpc157',
    peptideId2: 'ghkcu',
    compatibility: 'compatible',
    notes: 'Healing plus regeneration. Both support tissue repair through different mechanisms. GHK-Cu adds collagen synthesis.',
    timing: 'Can be used simultaneously'
  },
  {
    peptideId1: 'ta1',
    peptideId2: 'epitalon',
    compatibility: 'compatible',
    notes: 'Immune plus longevity. TA1 for immune optimization, Epitalon for telomere support. Different pathways, complementary goals.',
    timing: 'TA1 ongoing, Epitalon in cycles'
  },
  {
    peptideId1: 'semax',
    peptideId2: 'bpc157',
    compatibility: 'compatible',
    notes: 'Cognitive plus healing. Semax for mental performance, BPC-157 for physical recovery. No interference.',
    timing: 'Semax morning intranasal, BPC anytime'
  },
  {
    peptideId1: 'tb500',
    peptideId2: 'ghkcu',
    compatibility: 'compatible',
    notes: 'Systemic healing plus regeneration. TB-500 for inflammation, GHK-Cu for cellular regeneration.',
    timing: 'Can combine in same protocol'
  },
  {
    peptideId1: 'motsc',
    peptideId2: 'retatrutide',
    compatibility: 'compatible',
    notes: 'Dual metabolic support. MOTS-c enhances exercise benefits while Retatrutide manages appetite and metabolism.',
    timing: 'MOTS-c pre-workout, Reta weekly'
  },
  {
    peptideId1: 'epitalon',
    peptideId2: 'ss31',
    compatibility: 'compatible',
    notes: 'Telomere plus mitochondrial longevity. Two pillars of cellular aging addressed simultaneously.',
    timing: 'Can run concurrently'
  },
  {
    peptideId1: 'ipamorelin',
    peptideId2: 'bpc157',
    compatibility: 'compatible',
    notes: 'GH support plus healing. GH aids recovery, BPC-157 accelerates tissue repair. Complementary for athletes.',
    timing: 'Ipam before bed, BPC during day'
  },
  
  // Caution combinations (use with care, monitor closely)
  {
    peptideId1: 'retatrutide',
    peptideId2: 'motsc',
    compatibility: 'caution',
    notes: 'Both affect glucose metabolism. Monitor blood sugar closely. May enhance hypoglycemic effects.',
    timing: 'Separate dosing, careful monitoring'
  },
  {
    peptideId1: 'ipamorelin',
    peptideId2: 'retatrutide',
    compatibility: 'caution',
    notes: 'GH can affect insulin sensitivity. When combined with GLP-1 agonists, monitor glucose carefully.',
    timing: 'Monitor fasting glucose, adjust as needed'
  },
  {
    peptideId1: 'cjc1295',
    peptideId2: 'retatrutide',
    compatibility: 'caution',
    notes: 'Similar to Ipam - GH effects on glucose. Watch for hypoglycemia especially with exercise.',
    timing: 'Careful glucose monitoring required'
  },
  {
    peptideId1: 'semax',
    peptideId2: 'epitalon',
    compatibility: 'caution',
    notes: 'Both affect neurological pathways. May enhance effects. Start with lower doses of each.',
    timing: 'Introduce one at a time, monitor response'
  },
  
  // Avoid combinations (potential negative interactions)
  {
    peptideId1: 'ta1',
    peptideId2: 'semax',
    compatibility: 'caution',
    notes: 'TA1 modulates immune response, Semax affects ACTH pathways. Theoretical HPA axis considerations.',
    timing: 'Separate by several hours if using both'
  },
];

// Get compatibility between two peptides
export function getCompatibility(peptideId1: string, peptideId2: string): StackingInteraction | null {
  if (peptideId1 === peptideId2) return null;
  
  return stackingInteractions.find(
    interaction => 
      (interaction.peptideId1 === peptideId1 && interaction.peptideId2 === peptideId2) ||
      (interaction.peptideId1 === peptideId2 && interaction.peptideId2 === peptideId1)
  ) || null;
}

// Get all interactions for a specific peptide
export function getPeptideInteractions(peptideId: string): StackingInteraction[] {
  return stackingInteractions.filter(
    interaction => 
      interaction.peptideId1 === peptideId || interaction.peptideId2 === peptideId
  );
}

// Get compatibility color
export function getCompatibilityColor(level: CompatibilityLevel): string {
  switch (level) {
    case 'synergistic':
      return 'bg-green-500';
    case 'compatible':
      return 'bg-blue-500';
    case 'caution':
      return 'bg-yellow-500';
    case 'avoid':
      return 'bg-red-500';
    default:
      return 'bg-muted';
  }
}

export function getCompatibilityBgColor(level: CompatibilityLevel): string {
  switch (level) {
    case 'synergistic':
      return 'bg-green-500/20';
    case 'compatible':
      return 'bg-blue-500/20';
    case 'caution':
      return 'bg-yellow-500/20';
    case 'avoid':
      return 'bg-red-500/20';
    default:
      return 'bg-muted/20';
  }
}

export function getCompatibilityLabel(level: CompatibilityLevel): string {
  switch (level) {
    case 'synergistic':
      return 'Synergistic';
    case 'compatible':
      return 'Compatible';
    case 'caution':
      return 'Use Caution';
    case 'avoid':
      return 'Avoid';
    default:
      return 'Unknown';
  }
}

// Build full compatibility matrix for all peptides
export function buildCompatibilityMatrix(): Map<string, Map<string, StackingInteraction | null>> {
  const matrix = new Map<string, Map<string, StackingInteraction | null>>();
  
  peptides.forEach(p1 => {
    const row = new Map<string, StackingInteraction | null>();
    peptides.forEach(p2 => {
      if (p1.id === p2.id) {
        row.set(p2.id, null);
      } else {
        row.set(p2.id, getCompatibility(p1.id, p2.id));
      }
    });
    matrix.set(p1.id, row);
  });
  
  return matrix;
}

// Get recommended stacks based on a peptide
export function getRecommendedStacks(peptideId: string): { peptide: Peptide; interaction: StackingInteraction }[] {
  const interactions = getPeptideInteractions(peptideId);
  const synergistic = interactions.filter(i => i.compatibility === 'synergistic');
  
  return synergistic.map(interaction => {
    const otherPeptideId = interaction.peptideId1 === peptideId 
      ? interaction.peptideId2 
      : interaction.peptideId1;
    const peptide = peptides.find(p => p.id === otherPeptideId)!;
    return { peptide, interaction };
  }).filter(item => item.peptide);
}
