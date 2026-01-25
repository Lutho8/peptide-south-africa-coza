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
    mechanism: 'A 28-amino acid immunomodulating polypeptide that stimulates both innate and adaptive immune responses. Activates Toll-like receptors and downstream signaling pathways. Restores immune homeostasis and enhances T-cell function, dendritic cell maturation, and cytokine production.',
    benefits: [
      'Enhanced immune function via TLR activation',
      'Improved vaccine response',
      'Anti-viral properties (HIV, hepatitis)',
      'Reduced inflammation',
      'Synergistic with chemotherapy for anti-tumor response'
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
      week5_8: 'Significant immune optimization, enhanced CD8+ T-cell response',
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
    references: ['PMID: 28106477', 'PMID: 36812669'],
    contraindications: ['Organ transplant recipients', 'Autoimmune conditions requiring immunosuppression']
  },
  {
    id: 'epitalon',
    name: 'Epitalon',
    shortName: 'Epithalon',
    category: 'longevity',
    molecularWeight: '390.35 Da',
    halfLife: '10-15 minutes',
    longevityScore: 10,
    mechanism: 'A naturally occurring tetrapeptide that induces telomerase enzyme activity by upregulating hTERT mRNA expression. Promotes dose-dependent telomere length extension in normal human epithelial and fibroblast cells. Regulates melatonin production and circadian rhythm.',
    benefits: [
      'Telomere lengthening via hTERT upregulation',
      'Improved sleep quality',
      'Enhanced melatonin production',
      'Anti-aging effects at cellular level',
      'Telomerase activation for longevity'
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
    frequency: 'Daily (10-day cycle, 2-3 cycles per year)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep onset, vivid dreams',
      week3_4: 'Deeper sleep, better recovery',
      week5_8: 'Enhanced energy and vitality',
      longTerm: 'Cellular rejuvenation, telomere maintenance'
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
    references: ['PMID: 40908429', 'PMID: 16388879']
  },
  {
    id: 'semax',
    name: 'Semax',
    shortName: 'Semax',
    category: 'cognitive',
    molecularWeight: '813.93 Da',
    halfLife: '10-15 minutes',
    longevityScore: 7,
    mechanism: 'A synthetic heptapeptide comprising the ACTH (4-7) fragment with a C-terminal Pro-Gly-Pro tripeptide. Targets µ-opioid receptors, regulates USP18 and deubiquitination of FTO protein. Inhibits pyroptosis and decreases oxidative stress in neuronal cells. Modulates BDNF and enhances neuroplasticity.',
    benefits: [
      'Enhanced cognitive function',
      'Improved memory and learning',
      'Neuroprotection via µ-opioid receptor modulation',
      'Reduced anxiety and oxidative stress',
      'Promotes functional recovery after neurological injury'
    ],
    athleteBenefits: [
      'Better focus during training',
      'Improved mind-muscle connection',
      'Enhanced reaction time',
      'Neuroprotective during high-stress training'
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
      longTerm: 'Sustained neuroprotection, reduced neuroinflammation'
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
    references: ['PMID: 40692165', 'PMID: 17459469']
  },
  {
    id: 'ss31',
    name: 'SS-31 (Elamipretide)',
    shortName: 'SS-31',
    category: 'longevity',
    molecularWeight: '639.88 Da',
    halfLife: '2-4 hours',
    longevityScore: 9,
    mechanism: 'A mitochondria-targeted tetrapeptide that binds with high affinity to cardiolipin on the inner mitochondrial membrane. Inhibits cytochrome c peroxidase activity, preventing cardiolipin peroxidation and protecting mitochondrial cristae structure. Accelerates ATP recovery and reduces oxidative damage. Translationally upregulates frataxin protein levels in a dose-dependent manner.',
    benefits: [
      'Mitochondrial cristae protection',
      'Enhanced ATP production and recovery',
      'Reduced oxidative stress via cardiolipin binding',
      'Cellular rejuvenation',
      'Improved aconitase and respiratory chain activity',
      'Restored mitochondrial morphology'
    ],
    athleteBenefits: [
      'Improved endurance capacity',
      'Faster ATP regeneration after exertion',
      'Enhanced recovery between sets',
      'Better mitochondrial membrane potential'
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
      week3_4: 'Noticeable endurance gains, improved NAD+/NADH ratio',
      week5_8: 'Significant performance enhancement',
      longTerm: 'Mitochondrial biogenesis, sustained cristae protection'
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
    references: ['PMID: 23813215', 'DOI: 10.1038/s41598-017-10320-2']
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    shortName: 'Reta',
    category: 'metabolic',
    molecularWeight: '4112 Da',
    halfLife: '6 days',
    longevityScore: 8,
    mechanism: 'A novel unimolecular triple agonist of the glucose-dependent insulinotropic polypeptide (GIP), glucagon-like peptide 1 (GLP-1), and glucagon (GCG) receptors. Promotes satiety, enhances insulin sensitivity, increases energy expenditure via glucagon receptor activation, and significantly reduces liver fat.',
    benefits: [
      'Significant fat loss (up to 24.2% at 48 weeks)',
      'Improved metabolic health',
      'Enhanced insulin sensitivity and lipid metabolism',
      'Appetite regulation',
      '86% relative reduction in liver fat (MASLD)',
      'Normal liver fat achieved in 85%+ of participants'
    ],
    athleteBenefits: [
      'Body recomposition',
      'Improved energy partitioning',
      'Better nutrient utilization',
      'Enhanced metabolic flexibility'
    ],
    risks: [
      'GI side effects initially (nausea, diarrhea)',
      'Possible muscle loss without resistance training',
      'Requires gradual dose titration'
    ],
    dosing: {
      beginner: '1mg weekly',
      intermediate: '4mg weekly',
      advanced: '8-12mg weekly',
      athlete: '4-8mg weekly'
    },
    frequency: 'Once weekly',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced appetite, possible GI adjustment',
      week3_4: 'Noticeable weight loss begins',
      week5_8: 'Significant fat reduction, liver fat normalization',
      longTerm: 'Metabolic optimization, up to 24% weight reduction at 48 weeks'
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
    references: ['DOI: 10.1038/s41591-024-03018-2', 'DOI: 10.1038/s41421-024-00700-0']
  },
  {
    id: 'bpc157',
    name: 'BPC-157',
    shortName: 'BPC',
    category: 'healing',
    molecularWeight: '1419.53 Da',
    halfLife: '24 hours',
    longevityScore: 8,
    mechanism: 'Gastric pentadecapeptide that promotes angiogenesis, modulates nitric oxide pathways, and accelerates tissue repair through multiple growth factor pathways. Demonstrates potential benefits in tendon and muscle repair in preclinical studies.',
    benefits: [
      'Accelerated wound healing',
      'Tendon and ligament repair',
      'Gut healing and cytoprotection',
      'Anti-inflammatory effects',
      'Potential muscle repair support'
    ],
    athleteBenefits: [
      'Faster injury recovery',
      'Joint and connective tissue support',
      'Reduced inflammation from training',
      'Local injection near injury site enhances effects'
    ],
    risks: [
      'Limited human clinical trial data',
      'Possible interaction with blood thinners',
      'Case series data only - no controlled human trials'
    ],
    dosing: {
      beginner: '250mcg daily',
      intermediate: '500mcg daily',
      advanced: '500mcg 2x daily',
      athlete: '500mcg daily (systemic) or local injection'
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
    references: ['PMID: 41476424', 'PMID: 30915550']
  },
  {
    id: 'tb500',
    name: 'TB-500',
    shortName: 'TB-500',
    category: 'healing',
    molecularWeight: '4963 Da',
    halfLife: '7-14 days',
    longevityScore: 7,
    mechanism: 'Synthetic derivative of Thymosin Beta-4 (TB-4). Promotes angiogenesis, cell migration, and tissue repair through actin-binding properties. Demonstrated tissue repair benefits in preclinical models.',
    benefits: [
      'Systemic healing support',
      'Promotes angiogenesis',
      'Reduced inflammation',
      'Improved flexibility',
      'Hair growth promotion'
    ],
    athleteBenefits: [
      'Full-body recovery support',
      'Joint mobility improvement',
      'Synergistic with BPC-157 for comprehensive healing'
    ],
    risks: [
      'Possible fatigue initially',
      'Limited human orthopaedic data',
      'Banned in competitive sports'
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
      week3_4: 'Reduced chronic inflammation, enhanced angiogenesis',
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
    references: ['PMID: 41476424', 'PMID: 25290457']
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    shortName: 'Ipam',
    category: 'gh-secretagogue',
    molecularWeight: '711.85 Da',
    halfLife: '2 hours',
    longevityScore: 8,
    mechanism: 'A highly selective pentapeptide growth hormone secretagogue that mimics GHRP-6 but with superior selectivity. Stimulates GH release via ghrelin receptor pathway without releasing ACTH, cortisol, or prolactin even at high doses.',
    benefits: [
      'Increased GH release (selective)',
      'Improved body composition',
      'Enhanced recovery',
      'Better sleep quality',
      'No cortisol or prolactin elevation'
    ],
    athleteBenefits: [
      'Muscle growth support',
      'Fat loss enhancement',
      'Faster recovery between sessions',
      'Improved muscle tension (with CJC-1295)'
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
      athlete: '200mcg before bed (combine with CJC-1295)'
    },
    frequency: 'Daily (before bed)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep, recovery',
      week3_4: 'Fat loss begins, muscle fullness',
      week5_8: 'Noticeable body recomposition',
      longTerm: 'Sustained GH optimization without hormonal disruption'
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
    references: ['PMID: 9849822', 'PMID: 41476424']
  },
  {
    id: 'cjc1295',
    name: 'CJC-1295 (no DAC)',
    shortName: 'CJC',
    category: 'gh-secretagogue',
    molecularWeight: '3367.97 Da',
    halfLife: '30 minutes (no DAC) / 5.8-8.1 days (with DAC)',
    longevityScore: 8,
    mechanism: 'A long-acting GHRH analog that produces dose-dependent increases in mean plasma GH concentrations (2-10 fold for 6+ days) and IGF-I levels (1.5-3 fold for 9-11 days). After multiple doses, IGF-I remains elevated for up to 28 days. Synergistic with GHRP peptides.',
    benefits: [
      'Enhanced GH pulse amplitude (2-10x)',
      'Sustained IGF-1 elevation (9-11 days per injection)',
      'Body composition improvement',
      'Anti-aging effects',
      'Cumulative effect with repeated dosing'
    ],
    athleteBenefits: [
      'Synergistic with Ipamorelin for enhanced GH secretion',
      'Enhanced recovery and muscle tension',
      'Improved performance markers'
    ],
    risks: [
      'Flushing sensation',
      'Water retention',
      'Requires fasted administration'
    ],
    dosing: {
      beginner: '100mcg before bed (30µg/kg)',
      intermediate: '200mcg before bed (60µg/kg)',
      advanced: '200mcg 2x daily',
      athlete: '200mcg before bed with Ipamorelin'
    },
    frequency: 'Daily (before bed)',
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Enhanced sleep quality, GH elevation',
      week3_4: 'Improved recovery and energy, IGF-1 sustained',
      week5_8: 'Body composition changes',
      longTerm: 'Sustained GH optimization, cumulative IGF-1 benefits'
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
    references: ['PMID: 16352683', 'PMID: 41476424']
  },
  {
    id: 'ghkcu',
    name: 'GHK-Cu',
    shortName: 'GHK-Cu',
    category: 'longevity',
    molecularWeight: '403.92 Da',
    halfLife: '4-6 hours',
    longevityScore: 9,
    mechanism: 'Copper peptide complex that activates regenerative genes, promotes collagen synthesis, and provides potent antioxidant and anti-inflammatory effects. Shows promise in wound healing and tissue regeneration in preclinical studies.',
    benefits: [
      'Skin rejuvenation',
      'Wound healing',
      'Anti-aging gene activation',
      'Collagen synthesis',
      'Anti-inflammatory properties'
    ],
    athleteBenefits: [
      'Connective tissue support',
      'Skin health optimization',
      'Systemic regeneration',
      'Recovery support'
    ],
    risks: [
      'Copper toxicity at high doses',
      'Skin discoloration possible',
      'No clinical musculoskeletal data yet'
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
      week3_4: 'Enhanced healing markers, reduced inflammation',
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
    references: ['PMID: 41476424', 'PMID: 30681787']
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
