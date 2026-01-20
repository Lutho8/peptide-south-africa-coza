export type PeptideCategory = 'immune' | 'longevity' | 'cognitive' | 'metabolic' | 'healing' | 'gh-secretagogue';

export interface Peptide {
  id: string;
  name: string;
  shortName: string;
  category: PeptideCategory;
  molecularWeight?: string;
  halfLife?: string;
  longevityScore: number;
  mechanism: string;
  benefits: string[];
  athleteBenefits: string[];
  risks: string[];
  dosing: {
    beginner: string;
    intermediate: string;
    advanced: string;
    athlete: string;
  };
  frequency: string;
  administration: string;
  expectedResults: {
    week1_2: string;
    week3_4: string;
    week5_8: string;
    longTerm: string;
  };
  janoshikTested: boolean;
  janoshikPurity?: number;
  janoshikDate?: string;
  supplier: {
    name: string;
    productCode: string;
    price: number;
    stock: 'in-stock' | 'low-stock' | 'out-of-stock';
  };
  interactions?: string[];
  contraindications?: string[];
  references?: string[];
}

export const peptides: Peptide[] = [
  {
    id: 'ta1',
    name: 'Thymosin Alpha-1',
    shortName: 'TA1',
    category: 'immune',
    molecularWeight: '3108 Da',
    halfLife: '2 hours',
    longevityScore: 8,
    mechanism: 'Modulates immune response by enhancing T-cell function, dendritic cell maturation, and cytokine production. Restores immune homeostasis.',
    benefits: [
      'Enhanced immune function',
      'Improved vaccine response',
      'Anti-viral properties',
      'Reduced inflammation'
    ],
    athleteBenefits: [
      'Faster recovery from illness',
      'Reduced training-related immune suppression',
      'Better adaptation to high training loads'
    ],
    risks: [
      'Injection site reactions',
      'Rare allergic reactions'
    ],
    dosing: {
      beginner: '0.8mg 2x/week',
      intermediate: '1.0mg 3x/week',
      advanced: '1.5mg 3x/week',
      athlete: '1.5mg 3x/week'
    },
    frequency: '3x weekly',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved energy, reduced minor illness duration',
      week3_4: 'Notable immune resilience, better recovery',
      week5_8: 'Significant immune optimization',
      longTerm: 'Sustained immune function improvement'
    },
    janoshikTested: true,
    janoshikPurity: 99.2,
    janoshikDate: '2024-10-15',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TA1-5MG',
      price: 45,
      stock: 'in-stock'
    },
    references: ['PMID: 28917894', 'PMID: 29376476']
  },
  {
    id: 'epitalon',
    name: 'Epitalon',
    shortName: 'Epithalon',
    category: 'longevity',
    molecularWeight: '390.35 Da',
    halfLife: '10-15 minutes',
    longevityScore: 10,
    mechanism: 'Activates telomerase, the enzyme responsible for lengthening telomeres. Regulates melatonin production and circadian rhythm.',
    benefits: [
      'Telomere lengthening',
      'Improved sleep quality',
      'Enhanced melatonin production',
      'Anti-aging effects'
    ],
    athleteBenefits: [
      'Better recovery through improved sleep',
      'Cellular regeneration',
      'Long-term tissue health'
    ],
    risks: [
      'May affect sleep patterns initially',
      'Limited long-term human data'
    ],
    dosing: {
      beginner: '5mg daily for 10 days',
      intermediate: '10mg daily for 10 days',
      advanced: '10mg daily for 20 days',
      athlete: '10mg daily for 10 days'
    },
    frequency: 'Daily (10-day cycle)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep onset, vivid dreams',
      week3_4: 'Deeper sleep, better recovery',
      week5_8: 'Enhanced energy and vitality',
      longTerm: 'Cellular rejuvenation, anti-aging benefits'
    },
    janoshikTested: true,
    janoshikPurity: 98.7,
    janoshikDate: '2024-09-22',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'EPI-50MG',
      price: 85,
      stock: 'in-stock'
    },
    references: ['PMID: 12374906', 'PMID: 16388879']
  },
  {
    id: 'semax',
    name: 'Semax',
    shortName: 'Semax',
    category: 'cognitive',
    molecularWeight: '813.93 Da',
    halfLife: '10-15 minutes',
    longevityScore: 7,
    mechanism: 'ACTH analog that modulates BDNF, enhances neuroplasticity, and provides neuroprotection through melanocortin receptor activation.',
    benefits: [
      'Enhanced cognitive function',
      'Improved memory and learning',
      'Neuroprotection',
      'Reduced anxiety'
    ],
    athleteBenefits: [
      'Better focus during training',
      'Improved mind-muscle connection',
      'Enhanced reaction time'
    ],
    risks: [
      'Nasal irritation',
      'Possible headaches initially'
    ],
    dosing: {
      beginner: '300mcg daily intranasal',
      intermediate: '600mcg daily intranasal',
      advanced: '900mcg daily intranasal',
      athlete: '600mcg daily intranasal'
    },
    frequency: 'Daily',
    administration: 'Intranasal spray',
    expectedResults: {
      week1_2: 'Increased mental clarity, focus',
      week3_4: 'Improved memory consolidation',
      week5_8: 'Enhanced cognitive performance',
      longTerm: 'Sustained neuroprotection'
    },
    janoshikTested: true,
    janoshikPurity: 99.5,
    janoshikDate: '2024-11-01',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SEM-30MG',
      price: 55,
      stock: 'in-stock'
    },
    references: ['PMID: 19429082', 'PMID: 17459469']
  },
  {
    id: 'ss31',
    name: 'SS-31 (Elamipretide)',
    shortName: 'SS-31',
    category: 'longevity',
    molecularWeight: '639.88 Da',
    halfLife: '2-4 hours',
    longevityScore: 9,
    mechanism: 'Targets mitochondrial cardiolipin, stabilizing electron transport chain and reducing ROS production. Enhances ATP synthesis.',
    benefits: [
      'Mitochondrial optimization',
      'Enhanced energy production',
      'Reduced oxidative stress',
      'Cellular rejuvenation'
    ],
    athleteBenefits: [
      'Improved endurance capacity',
      'Faster ATP regeneration',
      'Enhanced recovery between sets'
    ],
    risks: [
      'Injection site reactions',
      'Possible initial fatigue'
    ],
    dosing: {
      beginner: '2.5mg daily',
      intermediate: '5mg daily',
      advanced: '10mg daily',
      athlete: '5mg daily'
    },
    frequency: 'Daily',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Subtle energy improvements',
      week3_4: 'Noticeable endurance gains',
      week5_8: 'Significant performance enhancement',
      longTerm: 'Mitochondrial biogenesis'
    },
    janoshikTested: true,
    janoshikPurity: 98.9,
    janoshikDate: '2024-10-28',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SS31-50MG',
      price: 120,
      stock: 'low-stock'
    },
    references: ['PMID: 24336218', 'PMID: 27208394']
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    shortName: 'Reta',
    category: 'metabolic',
    molecularWeight: '4112 Da',
    halfLife: '6 days',
    longevityScore: 8,
    mechanism: 'Triple agonist targeting GLP-1, GIP, and glucagon receptors. Promotes satiety, enhances insulin sensitivity, and increases energy expenditure.',
    benefits: [
      'Significant fat loss',
      'Improved metabolic health',
      'Enhanced insulin sensitivity',
      'Appetite regulation'
    ],
    athleteBenefits: [
      'Body recomposition',
      'Improved energy partitioning',
      'Better nutrient utilization'
    ],
    risks: [
      'GI side effects initially',
      'Possible muscle loss without resistance training',
      'Requires gradual dose titration'
    ],
    dosing: {
      beginner: '0.5mg weekly',
      intermediate: '1mg weekly',
      advanced: '2mg weekly',
      athlete: '2mg weekly'
    },
    frequency: 'Weekly',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced appetite, possible GI adjustment',
      week3_4: 'Noticeable weight loss begins',
      week5_8: 'Significant fat reduction',
      longTerm: 'Metabolic optimization, sustained weight management'
    },
    janoshikTested: true,
    janoshikPurity: 99.1,
    janoshikDate: '2024-11-10',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'RETA-10MG',
      price: 195,
      stock: 'in-stock'
    },
    references: ['NCT04881760', 'PMID: 37385275']
  },
  {
    id: 'bpc157',
    name: 'BPC-157',
    shortName: 'BPC',
    category: 'healing',
    molecularWeight: '1419.53 Da',
    halfLife: '24 hours',
    longevityScore: 8,
    mechanism: 'Gastric pentadecapeptide that promotes angiogenesis, modulates nitric oxide, and accelerates tissue repair through multiple growth factor pathways.',
    benefits: [
      'Accelerated wound healing',
      'Tendon and ligament repair',
      'Gut healing',
      'Anti-inflammatory effects'
    ],
    athleteBenefits: [
      'Faster injury recovery',
      'Joint and connective tissue support',
      'Reduced inflammation from training'
    ],
    risks: [
      'Limited human clinical data',
      'Possible interaction with blood thinners'
    ],
    dosing: {
      beginner: '250mcg daily',
      intermediate: '500mcg daily',
      advanced: '500mcg 2x daily',
      athlete: '500mcg daily'
    },
    frequency: 'Daily',
    administration: 'Subcutaneous injection (near injury site if applicable)',
    expectedResults: {
      week1_2: 'Reduced pain and inflammation',
      week3_4: 'Accelerated healing visible',
      week5_8: 'Significant tissue repair',
      longTerm: 'Complete recovery support'
    },
    janoshikTested: true,
    janoshikPurity: 99.3,
    janoshikDate: '2024-10-05',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'BPC-5MG',
      price: 42,
      stock: 'in-stock'
    },
    references: ['PMID: 27282919', 'PMID: 30915550']
  },
  {
    id: 'tb500',
    name: 'TB-500',
    shortName: 'TB-500',
    category: 'healing',
    molecularWeight: '4963 Da',
    halfLife: '7-14 days',
    longevityScore: 7,
    mechanism: 'Synthetic fraction of Thymosin Beta-4. Promotes cell migration, angiogenesis, and reduces inflammation through actin-binding properties.',
    benefits: [
      'Systemic healing support',
      'Reduced inflammation',
      'Improved flexibility',
      'Hair growth promotion'
    ],
    athleteBenefits: [
      'Full-body recovery support',
      'Joint mobility improvement',
      'Synergistic with BPC-157'
    ],
    risks: [
      'Possible fatigue initially',
      'Limited human trials'
    ],
    dosing: {
      beginner: '2.5mg 2x/week',
      intermediate: '5mg 2x/week',
      advanced: '5mg 3x/week',
      athlete: '5mg 2x weekly'
    },
    frequency: '2x weekly',
    administration: 'Subcutaneous or intramuscular injection',
    expectedResults: {
      week1_2: 'General well-being improvement',
      week3_4: 'Reduced chronic inflammation',
      week5_8: 'Enhanced tissue repair',
      longTerm: 'Sustained healing benefits'
    },
    janoshikTested: true,
    janoshikPurity: 98.5,
    janoshikDate: '2024-09-18',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TB5-10MG',
      price: 65,
      stock: 'in-stock'
    },
    references: ['PMID: 20831796', 'PMID: 25290457']
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    shortName: 'Ipam',
    category: 'gh-secretagogue',
    molecularWeight: '711.85 Da',
    halfLife: '2 hours',
    longevityScore: 8,
    mechanism: 'Selective growth hormone secretagogue that stimulates GH release via ghrelin receptor without affecting cortisol or prolactin levels.',
    benefits: [
      'Increased GH release',
      'Improved body composition',
      'Enhanced recovery',
      'Better sleep quality'
    ],
    athleteBenefits: [
      'Muscle growth support',
      'Fat loss enhancement',
      'Faster recovery between sessions'
    ],
    risks: [
      'Water retention possible',
      'Numbness/tingling initially',
      'May increase appetite'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg before bed',
      advanced: '300mcg before bed',
      athlete: '200mcg before bed'
    },
    frequency: 'Daily (before bed)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep, recovery',
      week3_4: 'Fat loss begins, muscle fullness',
      week5_8: 'Noticeable body recomposition',
      longTerm: 'Sustained GH optimization'
    },
    janoshikTested: true,
    janoshikPurity: 99.4,
    janoshikDate: '2024-11-05',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'IPAM-5MG',
      price: 38,
      stock: 'in-stock'
    },
    references: ['PMID: 10372583', 'PMID: 9849822']
  },
  {
    id: 'cjc1295',
    name: 'CJC-1295 (no DAC)',
    shortName: 'CJC',
    category: 'gh-secretagogue',
    molecularWeight: '3367.97 Da',
    halfLife: '30 minutes',
    longevityScore: 8,
    mechanism: 'Modified GHRH analog that stimulates pulsatile GH release. Synergistic with GHRP peptides for enhanced GH secretion.',
    benefits: [
      'Enhanced GH pulse amplitude',
      'Improved IGF-1 levels',
      'Body composition improvement',
      'Anti-aging effects'
    ],
    athleteBenefits: [
      'Synergistic with Ipamorelin',
      'Enhanced recovery',
      'Improved performance markers'
    ],
    risks: [
      'Flushing sensation',
      'Water retention',
      'Requires fasted administration'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg before bed',
      advanced: '200mcg 2x daily',
      athlete: '200mcg before bed'
    },
    frequency: 'Daily (before bed)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Enhanced sleep quality',
      week3_4: 'Improved recovery and energy',
      week5_8: 'Body composition changes',
      longTerm: 'Sustained GH optimization'
    },
    janoshikTested: true,
    janoshikPurity: 99.0,
    janoshikDate: '2024-10-20',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'CJC-5MG',
      price: 42,
      stock: 'in-stock'
    },
    references: ['PMID: 16352683', 'PMID: 17018654']
  },
  {
    id: 'ghkcu',
    name: 'GHK-Cu',
    shortName: 'GHK-Cu',
    category: 'longevity',
    molecularWeight: '403.92 Da',
    halfLife: '4-6 hours',
    longevityScore: 9,
    mechanism: 'Copper peptide complex that activates regenerative genes, promotes collagen synthesis, and provides potent antioxidant effects.',
    benefits: [
      'Skin rejuvenation',
      'Wound healing',
      'Anti-aging gene activation',
      'Collagen synthesis'
    ],
    athleteBenefits: [
      'Connective tissue support',
      'Skin health optimization',
      'Systemic regeneration'
    ],
    risks: [
      'Copper toxicity at high doses',
      'Skin discoloration possible'
    ],
    dosing: {
      beginner: '1mg daily',
      intermediate: '2mg daily',
      advanced: '3mg daily',
      athlete: '2mg daily'
    },
    frequency: 'Daily',
    administration: 'Subcutaneous injection or topical',
    expectedResults: {
      week1_2: 'Improved skin quality',
      week3_4: 'Enhanced healing markers',
      week5_8: 'Visible anti-aging effects',
      longTerm: 'Sustained regenerative benefits'
    },
    janoshikTested: true,
    janoshikPurity: 99.1,
    janoshikDate: '2024-09-30',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'GHKCU-50MG',
      price: 58,
      stock: 'in-stock'
    },
    references: ['PMID: 28822553', 'PMID: 30681787']
  },
  {
    id: 'motsc',
    name: 'MOTS-c',
    shortName: 'MOTS-c',
    category: 'longevity',
    molecularWeight: '2174.51 Da',
    halfLife: '6-8 hours',
    longevityScore: 9,
    mechanism: 'Mitochondrial-derived peptide that activates AMPK, enhances glucose uptake, and promotes metabolic homeostasis and exercise mimetic effects.',
    benefits: [
      'Metabolic optimization',
      'Exercise mimetic effects',
      'Improved insulin sensitivity',
      'Mitochondrial function'
    ],
    athleteBenefits: [
      'Enhanced endurance',
      'Better energy utilization',
      'Improved metabolic flexibility'
    ],
    risks: [
      'Limited human data',
      'Possible hypoglycemia'
    ],
    dosing: {
      beginner: '5mg weekly',
      intermediate: '10mg weekly',
      advanced: '10mg 3x/week',
      athlete: '10mg weekly'
    },
    frequency: 'Weekly',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved energy levels',
      week3_4: 'Enhanced exercise capacity',
      week5_8: 'Metabolic improvements',
      longTerm: 'Sustained metabolic health'
    },
    janoshikTested: true,
    janoshikPurity: 98.8,
    janoshikDate: '2024-11-08',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MOTS-10MG',
      price: 145,
      stock: 'low-stock'
    },
    references: ['PMID: 25738459', 'PMID: 30559430']
  }
];

export const getCategoryColor = (category: PeptideCategory): string => {
  const colors: Record<PeptideCategory, string> = {
    'immune': 'bg-immune',
    'longevity': 'bg-longevity',
    'cognitive': 'bg-cognitive',
    'metabolic': 'bg-metabolic',
    'healing': 'bg-healing',
    'gh-secretagogue': 'bg-gh'
  };
  return colors[category];
};

export const getCategoryGradient = (category: PeptideCategory): string => {
  const gradients: Record<PeptideCategory, string> = {
    'immune': 'category-immune',
    'longevity': 'category-longevity',
    'cognitive': 'category-cognitive',
    'metabolic': 'category-metabolic',
    'healing': 'category-healing',
    'gh-secretagogue': 'category-gh'
  };
  return gradients[category];
};

export const getCategoryLabel = (category: PeptideCategory): string => {
  const labels: Record<PeptideCategory, string> = {
    'immune': 'Immune',
    'longevity': 'Longevity',
    'cognitive': 'Cognitive',
    'metabolic': 'Metabolic',
    'healing': 'Healing',
    'gh-secretagogue': 'GH-Secretagogue'
  };
  return labels[category];
};
