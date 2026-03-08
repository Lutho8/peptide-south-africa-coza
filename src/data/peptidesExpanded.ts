import { Peptide } from './peptides';

/**
 * Expanded Peptide Database
 * Additional research-based peptides sourced from peer-reviewed literature
 * and industry catalogs (thepeptidecatalog.com, PubMed, etc.)
 */
export const expandedPeptides: Peptide[] = [
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    shortName: 'Sema',
    category: 'weight-loss',
    molecularWeight: '4113.58 Da',
    halfLife: '~7 days',
    longevityScore: 9,
    mechanism: 'GLP-1 receptor agonist that reduces appetite, slows gastric emptying, and improves insulin sensitivity. Acts on hypothalamic appetite centers to produce sustained satiety. FDA-approved for type 2 diabetes (Ozempic) and weight management (Wegovy).',
    benefits: [
      '15-20% body weight reduction in clinical trials',
      'Improved glycemic control',
      'Cardiovascular risk reduction (SELECT trial)',
      'Reduced appetite and cravings',
      'Improved insulin sensitivity'
    ],
    athleteBenefits: [
      'Body recomposition support',
      'Improved metabolic flexibility',
      'Better nutrient partitioning',
      'Reduced visceral fat'
    ],
    risks: [
      'GI side effects (nausea, vomiting, diarrhea)',
      'Potential muscle loss without resistance training',
      'Pancreatitis risk (rare)',
      'Thyroid C-cell tumor risk (animal studies)'
    ],
    dosing: {
      beginner: '0.25mg weekly (4 weeks)',
      intermediate: '0.5-1.0mg weekly',
      advanced: '1.7-2.4mg weekly',
      athlete: '0.5-1.0mg weekly'
    },
    frequency: 'Once weekly',
    recommendedDuration: '16-68 weeks with gradual dose titration',
    cycleProtocol: {
      minDays: 112,
      maxDays: 476,
      breakDays: 56,
      restartAdvice: 'Taper down before stopping. Restart at lowest dose after break.',
      breakAdvice: [
        'Maintain high-protein diet (1.6-2.2g/kg) to preserve lean mass',
        'Continue structured resistance training',
        'Monitor weight and metabolic markers during break',
        'Focus on behavioral strategies for appetite management'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced appetite, possible GI adjustment',
      week3_4: 'Noticeable weight loss begins (2-3%)',
      week5_8: 'Significant fat reduction (5-8%)',
      longTerm: '15-20% total body weight reduction'
    },
    janoshikTested: true,
    janoshikPurity: 99.051,
    janoshikDate: '2025-04-01',
    janoshikCOA: [
      {
        taskNumber: '#61142',
        verifyKey: '4UW2EUE83VR6',
        sampleName: 'Semaglutide 10mg',
        measuredAmount: '10.73 mg',
        purity: '99.051%',
        testDate: '01 APR 2025',
        manufacturer: 'https://zztai-tech.com',
      },
    ],
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SEMA-5MG',
      price: 85,
      stock: 'in-stock'
    },
    references: ['PMID: 33567185', 'PMID: 37385275'],
    aminoAcidSequence: 'Modified GLP-1 (7-37) analog with C18 fatty diacid',
    bioavailability: 'High (subcutaneous), ~1% (oral)',
    storageRequirements: 'Store at 2-8°C, protect from light, do not freeze',
    legalStatus: {
      usa: 'prescription',
      eu: 'Prescription (EMA approved)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2017,
    warnings: [
      'Contraindicated with personal/family history of MTC',
      'Monitor for pancreatitis symptoms',
      'Dose titration required to minimize GI side effects'
    ],
    notableStudies: [
      {
        title: 'STEP 1 Trial - Semaglutide for Weight Management',
        year: 2021,
        finding: '14.9% mean body weight reduction vs 2.4% placebo at 68 weeks',
        doi: '10.1056/NEJMoa2032183'
      }
    ]
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    shortName: 'Tirz',
    category: 'weight-loss',
    molecularWeight: '4813.45 Da',
    halfLife: '~5 days',
    longevityScore: 9,
    mechanism: 'First-in-class dual GIP/GLP-1 receptor agonist. Combines glucose-dependent insulinotropic polypeptide and glucagon-like peptide 1 receptor agonism for superior metabolic effects. FDA-approved for type 2 diabetes (Mounjaro) and weight management (Zepbound).',
    benefits: [
      '20-25% body weight reduction in trials',
      'Superior to GLP-1-only medications',
      'Improved glycemic control (HbA1c reduction)',
      'Reduced cardiovascular risk factors',
      'Improved lipid profiles'
    ],
    athleteBenefits: [
      'Superior body recomposition',
      'Enhanced insulin sensitivity',
      'Improved metabolic flexibility',
      'Significant visceral fat reduction'
    ],
    risks: [
      'GI side effects during titration',
      'Potential muscle loss',
      'Injection site reactions',
      'Gallbladder events (rare)'
    ],
    dosing: {
      beginner: '2.5mg weekly (4 weeks)',
      intermediate: '5-10mg weekly',
      advanced: '10-15mg weekly',
      athlete: '5-10mg weekly'
    },
    frequency: 'Once weekly',
    recommendedDuration: '24-72 weeks with dose titration every 4 weeks',
    cycleProtocol: {
      minDays: 168,
      maxDays: 504,
      breakDays: 56,
      restartAdvice: 'Taper dose before stopping. Restart at 2.5mg after break.',
      breakAdvice: [
        'Maintain caloric deficit with high-protein diet',
        'Increase exercise volume during break',
        'Monitor metabolic markers (HbA1c, lipids)',
        'Focus on sustainable lifestyle habits'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Appetite suppression begins, mild GI adjustment',
      week3_4: 'Consistent weight loss pattern emerging',
      week5_8: 'Significant body composition changes',
      longTerm: '20-25% total body weight reduction'
    },
    janoshikTested: true,
    janoshikPurity: 99.787,
    janoshikDate: '2025-04-01',
    janoshikCOA: [
      {
        taskNumber: '#55576',
        verifyKey: 'VUHTNG6CHEGP',
        sampleName: 'Tirzepatide 10mg',
        measuredAmount: '10.66 mg',
        purity: '99.486%',
        testDate: '09 JAN 2025',
        manufacturer: 'https://zztai-tech.com/',
      },
      {
        taskNumber: '#61140',
        verifyKey: 'X818BNESWL23',
        sampleName: 'Tirzepatide 60mg',
        measuredAmount: '61.85 mg',
        purity: '99.787%',
        testDate: '01 APR 2025',
        manufacturer: 'https://zztai-tech.com',
      },
      {
        taskNumber: '#66345',
        verifyKey: 'PB7DIYP5JS8W',
        sampleName: 'Tirzepatide 20mg',
        measuredAmount: '20.90 mg',
        purity: '99.451%',
        testDate: '28 MAY 2025',
        manufacturer: 'https://zztai-tech.com/',
      },
    ],
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TIRZ-10MG',
      price: 165,
      stock: 'in-stock'
    },
    references: ['PMID: 35658024', 'PMID: 37840095'],
    aminoAcidSequence: 'Modified 39-amino acid peptide with C20 fatty diacid',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, do not freeze',
    legalStatus: {
      usa: 'prescription',
      eu: 'Prescription (EMA approved)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2022,
    warnings: [
      'Contraindicated with MEN 2 or family history of MTC',
      'Dose titration required',
      'Monitor for signs of pancreatitis'
    ],
    notableStudies: [
      {
        title: 'SURMOUNT-1 Trial',
        year: 2022,
        finding: '22.5% weight loss at highest dose vs 3.1% placebo',
        doi: '10.1056/NEJMoa2206038'
      }
    ]
  },
  {
    id: 'pt141',
    name: 'PT-141 (Bremelanotide)',
    shortName: 'PT-141',
    category: 'hormonal',
    molecularWeight: '1025.18 Da',
    halfLife: '~2.7 hours',
    longevityScore: 5,
    mechanism: 'Melanocortin receptor agonist (MC3R/MC4R) that works centrally in the brain to increase sexual desire. Unlike PDE5 inhibitors, it acts on the nervous system rather than vascular system. FDA-approved as Vyleesi for hypoactive sexual desire disorder (HSDD) in premenopausal women.',
    benefits: [
      'Increased sexual desire and arousal',
      'Works centrally in the brain (not vascular)',
      'Effective in both men and women',
      'FDA-approved for HSDD in women',
      'Does not require sexual stimulation to work'
    ],
    athleteBenefits: [
      'Improved libido during intense training phases',
      'Counteracts hormone-related low desire',
      'No cardiovascular interference'
    ],
    risks: [
      'Nausea (most common, ~40%)',
      'Flushing and headache',
      'Transient blood pressure changes',
      'Skin hyperpigmentation with repeated use'
    ],
    dosing: {
      beginner: '0.5mg as needed',
      intermediate: '1.0mg as needed',
      advanced: '1.75mg as needed',
      athlete: '1.0mg as needed'
    },
    frequency: 'As needed (max once every 24 hours)',
    recommendedDuration: 'As needed; no cycling required',
    cycleProtocol: {
      minDays: 1,
      maxDays: 90,
      breakDays: 14,
      restartAdvice: 'Use as needed. Limit to max 8 doses per month.',
      breakAdvice: [
        'Monitor for skin pigmentation changes',
        'Address underlying hormonal causes if persistent',
        'Check blood pressure regularly',
        'Maintain overall hormonal health with sleep and nutrition'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Increased sexual desire within 45 min of injection',
      week3_4: 'Consistent response pattern established',
      week5_8: 'Sustained efficacy with as-needed dosing',
      longTerm: 'Reliable pro-sexual effects'
    },
    janoshikTested: true,
    janoshikPurity: 99.0,
    janoshikDate: '2024-10-18',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'PT141-10MG',
      price: 42,
      stock: 'in-stock'
    },
    references: ['PMID: 27045258', 'PMID: 30698602'],
    aminoAcidSequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'prescription',
      eu: 'Not approved (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2019,
    warnings: [
      'Nausea occurs in ~40% of users',
      'Limit to max 8 doses per month',
      'Monitor blood pressure',
      'May cause skin darkening with repeated use'
    ],
    notableStudies: [
      {
        title: 'RECONNECT Trial - Bremelanotide for HSDD',
        year: 2019,
        finding: 'Significant improvement in sexual desire and distress scores vs placebo',
        doi: '10.1097/AOG.0000000000003093'
      }
    ]
  },
  {
    id: 'hexarelin',
    name: 'Hexarelin',
    shortName: 'Hex',
    category: 'gh-secretagogue',
    molecularWeight: '887.04 Da',
    halfLife: '~70 minutes',
    longevityScore: 7,
    mechanism: 'One of the most potent growth hormone releasing peptides (GHRPs), acting on the ghrelin/GHS receptor. Produces strong GH pulses with notable cardioprotective effects. More potent than GHRP-6 but with greater effects on cortisol and prolactin.',
    benefits: [
      'Strongest GH release among GHRPs',
      'Cardioprotective properties',
      'Improved body composition',
      'Enhanced recovery and healing',
      'Neuroprotective effects'
    ],
    athleteBenefits: [
      'Maximum GH secretion for muscle growth',
      'Cardiac function support during intense training',
      'Superior fat loss',
      'Enhanced recovery capacity'
    ],
    risks: [
      'Elevated cortisol and prolactin',
      'Rapid desensitization with continuous use',
      'Water retention',
      'Increased appetite'
    ],
    dosing: {
      beginner: '100mcg 2x/day',
      intermediate: '200mcg 2x/day',
      advanced: '300mcg 3x/day',
      athlete: '200mcg 2x/day'
    },
    frequency: '2-3x daily',
    recommendedDuration: '8-12 weeks with cycling to prevent desensitization',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 28,
      restartAdvice: 'Must cycle off to prevent receptor desensitization. Take 4-week break between cycles.',
      breakAdvice: [
        'Switch to a milder GHRP like Ipamorelin during breaks if GH support needed',
        'Monitor prolactin levels — consider P5P (active B6) supplementation',
        'Track cortisol with morning saliva tests',
        'Maintain intense training to stimulate natural GH release'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Strong GH pulse response, improved sleep',
      week3_4: 'Noticeable recovery enhancement, body composition changes',
      week5_8: 'Significant muscle fullness and fat loss',
      longTerm: 'Sustained body recomposition with proper cycling'
    },
    janoshikTested: true,
    janoshikPurity: 98.9,
    janoshikDate: '2024-10-22',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'HEX-5MG',
      price: 35,
      stock: 'in-stock'
    },
    references: ['PMID: 9220477', 'PMID: 11397842'],
    aminoAcidSequence: 'His-D-2-Me-Trp-Ala-Trp-D-Phe-Lys-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Desensitization occurs faster than other GHRPs',
      'Elevated prolactin may require management',
      'Monitor cortisol levels with extended use'
    ],
    notableStudies: [
      {
        title: 'Hexarelin cardioprotective effects',
        year: 2001,
        finding: 'Demonstrated significant cardioprotective properties independent of GH release',
        doi: '10.1016/S0196-9781(00)00307-4'
      }
    ]
  },
  {
    id: 'mazdutide',
    name: 'Mazdutide',
    shortName: 'Mazd',
    category: 'weight-loss',
    molecularWeight: '~4500 Da',
    halfLife: '~6 days',
    longevityScore: 8,
    mechanism: 'Dual GLP-1/glucagon receptor agonist developed by Innovent Biologics. Combines GLP-1-mediated appetite suppression with glucagon receptor-driven energy expenditure and hepatic fat reduction. Designed to leverage complementary metabolic pathways for enhanced weight loss.',
    benefits: [
      'Significant weight loss (up to 14-18% in trials)',
      'Dual mechanism: appetite + energy expenditure',
      'Liver fat reduction',
      'Improved glycemic control',
      'Enhanced lipid profiles'
    ],
    athleteBenefits: [
      'Body recomposition support',
      'Enhanced metabolic rate via glucagon activation',
      'Improved insulin sensitivity',
      'Visceral fat reduction'
    ],
    risks: [
      'GI side effects (nausea, diarrhea)',
      'Potential muscle loss',
      'Dose-dependent adverse events',
      'Limited long-term safety data'
    ],
    dosing: {
      beginner: '3mg weekly',
      intermediate: '4.5mg weekly',
      advanced: '6-9mg weekly',
      athlete: '4.5mg weekly'
    },
    frequency: 'Once weekly',
    recommendedDuration: '24-48 weeks with dose titration',
    cycleProtocol: {
      minDays: 168,
      maxDays: 336,
      breakDays: 56,
      restartAdvice: 'Taper before discontinuation. Restart at lowest dose.',
      breakAdvice: [
        'Maintain caloric deficit with high-protein diet',
        'Continue resistance training to preserve lean mass',
        'Monitor metabolic markers during break',
        'Consider lifestyle interventions for weight maintenance'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Appetite reduction, possible GI adjustment',
      week3_4: 'Consistent weight loss pattern',
      week5_8: 'Significant fat loss and metabolic improvement',
      longTerm: '14-18% total body weight reduction'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MAZD-10MG',
      price: 175,
      stock: 'low-stock'
    },
    references: ['PMID: 37952132'],
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, do not freeze',
    legalStatus: {
      usa: 'research-only',
      eu: 'Clinical trial phase',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase3',
    fdaApproved: false,
    warnings: [
      'Currently in clinical trials',
      'GI side effects common during titration',
      'Monitor for hypoglycemia in diabetic patients'
    ],
    notableStudies: [
      {
        title: 'Mazdutide Phase 2 in obesity',
        year: 2023,
        finding: 'Achieved up to 14.4% weight loss at 24 weeks',
        doi: '10.1016/S2213-8587(23)00255-1'
      }
    ]
  },
  {
    id: 'cerebrolysin',
    name: 'Cerebrolysin',
    shortName: 'Cere',
    category: 'cognitive',
    molecularWeight: 'Mixed (peptide fraction <10 kDa)',
    halfLife: '~6 hours',
    longevityScore: 8,
    mechanism: 'Porcine brain-derived peptide preparation containing low-molecular-weight neurotrophic peptides and free amino acids that mimic the action of endogenous neurotrophic factors (BDNF, CNTF, NGF). Promotes neuroplasticity, neurogenesis, and neuroprotection through multimodal mechanisms.',
    benefits: [
      'Enhanced neuroplasticity and neurogenesis',
      'Neuroprotection against excitotoxicity',
      'Improved cognitive function in dementia',
      'Stroke recovery acceleration',
      'Traumatic brain injury support'
    ],
    athleteBenefits: [
      'Enhanced cognitive performance',
      'Concussion recovery support',
      'Improved memory consolidation',
      'Neuroprotection during high-impact training'
    ],
    risks: [
      'Dizziness and headache',
      'Injection site pain',
      'Allergic reactions (rare)',
      'Agitation in some patients'
    ],
    dosing: {
      beginner: '5ml daily IM',
      intermediate: '10ml daily IM/IV',
      advanced: '20-30ml daily IV',
      athlete: '10ml daily IM'
    },
    frequency: 'Daily for 10-20 day cycles',
    recommendedDuration: '10-20 day cycles, 2-4 cycles per year',
    cycleProtocol: {
      minDays: 10,
      maxDays: 20,
      breakDays: 60,
      restartAdvice: 'Run 2-4 cycles per year with 2-3 month intervals between cycles.',
      breakAdvice: [
        'Continue cognitive training and mentally stimulating activities',
        'Support neuroplasticity with omega-3 fatty acids and phosphatidylserine',
        'Maintain regular aerobic exercise for endogenous BDNF production',
        'Track cognitive metrics to assess sustained benefits'
      ]
    },
    administration: 'Intramuscular or intravenous injection',
    expectedResults: {
      week1_2: 'Improved mental clarity and focus',
      week3_4: 'Enhanced memory and cognitive processing',
      week5_8: 'Sustained cognitive improvement',
      longTerm: 'Neuroprotection and neuroplastic gains'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'CERE-5ML',
      price: 95,
      stock: 'low-stock'
    },
    references: ['PMID: 23652997', 'PMID: 17242539'],
    bioavailability: 'High (IM/IV)',
    storageRequirements: 'Store at 2-8°C, protect from light, use immediately once opened',
    legalStatus: {
      usa: 'research-only',
      eu: 'Approved in some EU countries (prescription)',
      australia: 'Not registered'
    },
    clinicalStatus: 'approved',
    fdaApproved: false,
    warnings: [
      'Not FDA-approved but used clinically in 40+ countries',
      'IV administration requires medical supervision',
      'Contraindicated in epilepsy and severe renal impairment'
    ],
    notableStudies: [
      {
        title: 'Cerebrolysin in Alzheimer\'s disease',
        year: 2011,
        finding: 'Significant improvement in cognitive function and global clinical outcomes',
        doi: '10.1159/000321973'
      }
    ]
  },
  {
    id: 'aod9604',
    name: 'AOD-9604',
    shortName: 'AOD',
    category: 'weight-loss',
    molecularWeight: '1815.08 Da',
    halfLife: '~6 hours',
    longevityScore: 6,
    mechanism: 'Modified fragment (176-191) of human growth hormone that mimics GH\'s lipolytic effects without affecting blood sugar or promoting growth. Stimulates lipolysis and inhibits lipogenesis through a mechanism distinct from full-length GH.',
    benefits: [
      'Targeted fat metabolism',
      'No effect on blood sugar or growth',
      'No IGF-1 elevation',
      'Anti-inflammatory properties (cartilage)',
      'GRAS status from FDA for food use'
    ],
    athleteBenefits: [
      'Targeted fat loss without muscle impact',
      'Safe for long-term body composition use',
      'No interference with GH axis',
      'Joint/cartilage support'
    ],
    risks: [
      'Mild injection site irritation',
      'Headache (uncommon)',
      'Limited clinical efficacy data for weight loss'
    ],
    dosing: {
      beginner: '250mcg daily',
      intermediate: '300mcg daily',
      advanced: '500mcg daily',
      athlete: '300mcg daily'
    },
    frequency: 'Daily (fasted, morning)',
    recommendedDuration: '12-24 weeks',
    cycleProtocol: {
      minDays: 84,
      maxDays: 168,
      breakDays: 28,
      restartAdvice: 'Resume after 4-week break if continued fat loss desired.',
      breakAdvice: [
        'Maintain fasted morning cardio',
        'Continue caloric deficit with high-protein diet',
        'Monitor body composition changes',
        'Support fat metabolism with L-carnitine and green tea extract'
      ]
    },
    administration: 'Subcutaneous injection (abdominal)',
    expectedResults: {
      week1_2: 'Subtle metabolic changes',
      week3_4: 'Mild fat loss acceleration',
      week5_8: 'Moderate body composition improvement',
      longTerm: 'Gradual fat reduction'
    },
    janoshikTested: true,
    janoshikPurity: 98.7,
    janoshikDate: '2024-10-10',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'AOD-5MG',
      price: 35,
      stock: 'in-stock'
    },
    references: ['PMID: 11713213'],
    aminoAcidSequence: 'Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe',
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'GRAS for food; Schedule 4 injectable'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Limited evidence for weight loss efficacy in humans',
      'Best combined with diet and exercise',
      'Not a replacement for GLP-1 therapies'
    ]
  },
  {
    id: 'selank',
    name: 'Selank',
    shortName: 'Selank',
    category: 'cognitive',
    molecularWeight: '751.85 Da',
    halfLife: '~3 minutes (active metabolites persist hours)',
    longevityScore: 7,
    mechanism: 'Synthetic neuropeptide derived from tuftsin (an immunomodulatory peptide) with a stabilizing Pro-Gly-Pro sequence. Modulates GABA, serotonin, dopamine, and norepinephrine systems. Provides anxiolytic effects without sedation and enhances BDNF expression for cognitive enhancement.',
    benefits: [
      'Anxiolytic without sedation or dependency',
      'Enhanced memory and cognitive function',
      'Immunomodulatory properties',
      'BDNF and enkephalin upregulation',
      'Mood stabilization'
    ],
    athleteBenefits: [
      'Reduced competition anxiety',
      'Improved focus without drowsiness',
      'Better stress adaptation',
      'Enhanced immune function during training'
    ],
    risks: [
      'Nasal irritation',
      'Fatigue (rare)',
      'Limited Western clinical data'
    ],
    dosing: {
      beginner: '250mcg daily intranasal',
      intermediate: '500mcg daily intranasal',
      advanced: '750mcg daily intranasal',
      athlete: '500mcg daily intranasal'
    },
    frequency: 'Daily',
    recommendedDuration: '14-30 days per cycle',
    cycleProtocol: {
      minDays: 14,
      maxDays: 30,
      breakDays: 14,
      restartAdvice: 'Resume after 2-week break. Can alternate with Semax.',
      breakAdvice: [
        'Continue stress management practices (meditation, breathing)',
        'Support GABAergic function with magnesium and L-theanine',
        'Maintain regular sleep schedule',
        'Track anxiety and mood metrics'
      ]
    },
    administration: 'Intranasal spray',
    expectedResults: {
      week1_2: 'Reduced anxiety, improved calm focus',
      week3_4: 'Enhanced memory and cognitive resilience',
      week5_8: 'Sustained anxiolytic and nootropic effects',
      longTerm: 'Improved stress resilience'
    },
    janoshikTested: true,
    janoshikPurity: 99.1,
    janoshikDate: '2024-10-25',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SEL-5MG',
      price: 48,
      stock: 'in-stock'
    },
    references: ['PMID: 18577768', 'PMID: 19004361'],
    aminoAcidSequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
    bioavailability: 'High (intranasal)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 12 months reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'approved',
    fdaApproved: false,
    warnings: [
      'Approved in Russia, not FDA-approved',
      'May interact with benzodiazepines',
      'Monitor for paradoxical anxiety (rare)'
    ]
  },
  {
    id: 'dsip',
    name: 'DSIP',
    shortName: 'DSIP',
    category: 'cognitive',
    molecularWeight: '848.82 Da',
    halfLife: '~7 minutes (effects last hours)',
    longevityScore: 6,
    mechanism: 'Delta Sleep-Inducing Peptide — a 9-amino acid neuropeptide that promotes slow-wave delta sleep, modulates corticotropin and LH release, inhibits somatostatin activity, and reduces stress-induced metabolic disruption. Acts on multiple neuroendocrine pathways.',
    benefits: [
      'Improved slow-wave (delta) sleep',
      'Reduced sleep latency',
      'Stress hormone modulation',
      'Pain modulation (met-enkephalin interaction)',
      'LH release modulation'
    ],
    athleteBenefits: [
      'Enhanced deep sleep for recovery',
      'Cortisol reduction during overtraining',
      'Improved GH secretion via deep sleep',
      'Better stress adaptation'
    ],
    risks: [
      'Daytime drowsiness if dosed incorrectly',
      'Tolerance with prolonged use',
      'Limited clinical data'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg before bed',
      advanced: '300mcg before bed',
      athlete: '200mcg before bed'
    },
    frequency: 'Daily (before bed)',
    recommendedDuration: '14-30 days per cycle',
    cycleProtocol: {
      minDays: 14,
      maxDays: 30,
      breakDays: 14,
      restartAdvice: 'Cycle off after 30 days to prevent tolerance.',
      breakAdvice: [
        'Maintain sleep hygiene practices',
        'Use magnesium glycinate and L-theanine as natural sleep aids',
        'Avoid blue light 2 hours before bed',
        'Continue consistent sleep/wake schedule'
      ]
    },
    administration: 'Subcutaneous or intranasal',
    expectedResults: {
      week1_2: 'Faster sleep onset, deeper sleep',
      week3_4: 'Improved sleep architecture, better recovery',
      week5_8: 'Sustained sleep quality improvement',
      longTerm: 'Reset of healthy sleep patterns'
    },
    janoshikTested: true,
    janoshikPurity: 98.5,
    janoshikDate: '2024-09-28',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'DSIP-5MG',
      price: 38,
      stock: 'in-stock'
    },
    references: ['PMID: 2549236'],
    aminoAcidSequence: 'Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu',
    bioavailability: 'Moderate (subcutaneous/intranasal)',
    storageRequirements: 'Store at -20°C, protect from light, stable 2 years lyophilized',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Limited human safety data',
      'May cause excessive sleepiness',
      'Not recommended for daytime use'
    ]
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    shortName: 'Serm',
    category: 'gh-secretagogue',
    molecularWeight: '3357.93 Da',
    halfLife: '~10-20 minutes',
    longevityScore: 7,
    mechanism: 'The native GHRH(1-29) fragment — the first 29 amino acids of natural growth hormone-releasing hormone. Stimulates the pituitary gland to produce GH in a physiological, pulsatile pattern. The longest-studied GHRH analog with an established clinical track record.',
    benefits: [
      'Physiological GH release pattern',
      'Improved sleep quality',
      'Enhanced recovery and repair',
      'Anti-aging effects',
      'Longest clinical safety record among GHRH peptides'
    ],
    athleteBenefits: [
      'Natural GH pulse amplification',
      'Improved recovery between sessions',
      'Better sleep-dependent recovery',
      'Synergistic with GHRPs'
    ],
    risks: [
      'Injection site reactions',
      'Flushing/warmth sensation',
      'Headache (uncommon)',
      'Desensitization with continuous use'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg before bed',
      advanced: '300mcg before bed',
      athlete: '200mcg before bed (with Ipamorelin)'
    },
    frequency: 'Daily (before bed)',
    recommendedDuration: '3-6 months continuous, or 5 days on/2 days off',
    cycleProtocol: {
      minDays: 90,
      maxDays: 180,
      breakDays: 28,
      restartAdvice: 'Resume after 4-week break. Can be used long-term with cycling.',
      breakAdvice: [
        'Maintain sleep hygiene for natural GH secretion',
        'Continue resistance training',
        'Support with natural GH boosters (arginine, deep sleep)',
        'Monitor IGF-1 levels before restart'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep quality',
      week3_4: 'Better recovery, increased energy',
      week5_8: 'Body composition improvements begin',
      longTerm: 'Sustained anti-aging benefits'
    },
    janoshikTested: true,
    janoshikPurity: 99.0,
    janoshikDate: '2024-10-08',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SERM-5MG',
      price: 38,
      stock: 'in-stock'
    },
    references: ['PMID: 9520101'],
    aminoAcidSequence: 'Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'prescription',
      eu: 'Prescription in some countries',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 1997,
    warnings: [
      'Previously FDA-approved (withdrawn for commercial reasons, not safety)',
      'Requires fasted administration',
      'Less potent than CJC-1295'
    ]
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    shortName: 'Tesa',
    category: 'gh-secretagogue',
    molecularWeight: '5135.87 Da',
    halfLife: '~26-38 minutes',
    longevityScore: 8,
    mechanism: 'The only FDA-approved GHRH analog, using the full 44 amino acid GHRH sequence with a trans-3-hexenoic acid modification for stability. Produces physiological GH pulses that specifically target visceral abdominal fat. FDA-approved for HIV lipodystrophy (Egrifta).',
    benefits: [
      'FDA-approved GHRH analog',
      'Specific visceral fat reduction',
      'Improved body composition',
      'Cognitive enhancement (shown in aging studies)',
      'Reduced liver fat'
    ],
    athleteBenefits: [
      'Targeted belly fat reduction',
      'Preserved lean mass',
      'Physiological GH release',
      'Cognitive performance support'
    ],
    risks: [
      'Injection site reactions',
      'Joint pain/arthralgia',
      'Peripheral edema',
      'Increased IGF-1 levels'
    ],
    dosing: {
      beginner: '1mg daily',
      intermediate: '2mg daily',
      advanced: '2mg daily',
      athlete: '2mg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '12-26 weeks',
    cycleProtocol: {
      minDays: 84,
      maxDays: 182,
      breakDays: 28,
      restartAdvice: 'Resume after 4-week break. Monitor IGF-1 levels.',
      breakAdvice: [
        'Maintain abdominal-targeted exercise',
        'Continue caloric management',
        'Track waist circumference and visceral fat',
        'Support with natural GH-promoting activities'
      ]
    },
    administration: 'Subcutaneous injection (abdominal)',
    expectedResults: {
      week1_2: 'GH elevation, improved sleep',
      week3_4: 'Early visceral fat changes',
      week5_8: 'Measurable visceral fat reduction',
      longTerm: 'Significant body composition improvement'
    },
    janoshikTested: true,
    janoshikPurity: 99.456,
    janoshikDate: '2025-05-28',
    janoshikCOA: [
      {
        taskNumber: '#66349',
        verifyKey: 'D3J54TA1BX6Q',
        sampleName: 'Tesamorelin 10mg',
        measuredAmount: '10.35 mg',
        purity: '99.456%',
        testDate: '28 MAY 2025',
        manufacturer: 'https://zztai-tech.com/',
      },
    ],
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TESA-2MG',
      price: 125,
      stock: 'in-stock'
    },
    references: ['PMID: 22058376', 'PMID: 26102161'],
    aminoAcidSequence: 'trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, use within 14 days reconstituted',
    legalStatus: {
      usa: 'prescription',
      eu: 'Not widely available',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2010,
    warnings: [
      'Monitor IGF-1 levels during treatment',
      'Contraindicated in active malignancy',
      'May cause fluid retention'
    ]
  },
  {
    id: 'mk677',
    name: 'MK-677 (Ibutamoren)',
    shortName: 'MK-677',
    category: 'gh-secretagogue',
    molecularWeight: '528.67 Da',
    halfLife: '~24 hours',
    longevityScore: 7,
    mechanism: 'Oral growth hormone secretagogue that mimics ghrelin to stimulate GH and IGF-1 release. Unlike injectable peptides, it is taken orally with a long duration of action. Acts as a non-peptide agonist of the ghrelin receptor (GHS-R1a).',
    benefits: [
      'Oral administration (no injections)',
      'Sustained GH and IGF-1 elevation',
      'Improved sleep quality',
      'Enhanced muscle mass and recovery',
      'Increased bone density'
    ],
    athleteBenefits: [
      'Convenient oral dosing',
      'Improved sleep-dependent recovery',
      'Enhanced body composition',
      'Sustained anabolic environment'
    ],
    risks: [
      'Significant appetite increase',
      'Water retention and bloating',
      'Insulin resistance with long-term use',
      'Elevated blood glucose',
      'Lethargy'
    ],
    dosing: {
      beginner: '10mg daily (oral)',
      intermediate: '15-20mg daily',
      advanced: '25mg daily',
      athlete: '15mg daily'
    },
    frequency: 'Daily (oral, before bed)',
    recommendedDuration: '8-16 weeks, or 5 days on/2 days off for extended use',
    cycleProtocol: {
      minDays: 56,
      maxDays: 112,
      breakDays: 28,
      restartAdvice: 'Take 4-week break to restore insulin sensitivity. Monitor fasting glucose.',
      breakAdvice: [
        'Monitor fasting glucose and insulin levels',
        'Reduce carbohydrate intake during break',
        'Continue resistance training',
        'Use berberine or chromium for insulin sensitization if needed'
      ]
    },
    administration: 'Oral',
    expectedResults: {
      week1_2: 'Increased appetite, improved sleep',
      week3_4: 'Enhanced recovery, muscle fullness',
      week5_8: 'Noticeable body composition changes',
      longTerm: 'Sustained GH elevation and anabolic effects'
    },
    janoshikTested: true,
    janoshikPurity: 99.3,
    janoshikDate: '2024-11-08',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MK677-25MG',
      price: 45,
      stock: 'in-stock'
    },
    references: ['PMID: 9349662', 'PMID: 18981481'],
    bioavailability: 'High (oral)',
    storageRequirements: 'Store at room temperature, protect from moisture',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research compound)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'May worsen insulin resistance',
      'Monitor blood glucose regularly',
      'Strong appetite stimulation — manage caloric intake',
      'May elevate prolactin'
    ]
  },
  {
    id: 'ghrp2',
    name: 'GHRP-2',
    shortName: 'GHRP-2',
    category: 'gh-secretagogue',
    molecularWeight: '817.97 Da',
    halfLife: '~25-30 minutes',
    longevityScore: 7,
    mechanism: 'Potent synthetic hexapeptide that stimulates growth hormone release through the ghrelin receptor (GHS-R). One of the strongest GHRPs available, producing significant GH pulses with moderate effects on cortisol, prolactin, and appetite.',
    benefits: [
      'Potent GH secretion',
      'Improved body composition',
      'Enhanced recovery',
      'Better sleep quality',
      'Appetite stimulation (useful for hardgainers)'
    ],
    athleteBenefits: [
      'Strong GH pulse for muscle growth',
      'Fat loss enhancement',
      'Synergistic with GHRH peptides',
      'Improved recovery capacity'
    ],
    risks: [
      'Moderate cortisol and prolactin elevation',
      'Appetite increase',
      'Water retention',
      'Desensitization possible'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg 2x/day',
      advanced: '300mcg 2-3x/day',
      athlete: '200mcg 2x/day (with CJC-1295)'
    },
    frequency: '2-3x daily',
    recommendedDuration: '8-12 weeks',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 28,
      restartAdvice: 'Take 4-week break between cycles. Monitor prolactin.',
      breakAdvice: [
        'Consider P5P (active B6) for prolactin management',
        'Maintain fasted training for natural GH release',
        'Track body composition changes during break',
        'Support with quality sleep and resistance training'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Increased appetite, improved sleep',
      week3_4: 'Enhanced recovery, GH elevation measurable',
      week5_8: 'Body composition improvements',
      longTerm: 'Sustained anabolic support'
    },
    janoshikTested: true,
    janoshikPurity: 99.1,
    janoshikDate: '2024-10-15',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'GHRP2-5MG',
      price: 32,
      stock: 'in-stock'
    },
    references: ['PMID: 9220477'],
    aminoAcidSequence: 'D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'May elevate cortisol and prolactin',
      'Use with caution in diabetics',
      'Banned by WADA'
    ]
  },
  {
    id: 'ghrp6',
    name: 'GHRP-6',
    shortName: 'GHRP-6',
    category: 'gh-secretagogue',
    molecularWeight: '873.01 Da',
    halfLife: '~15-60 minutes',
    longevityScore: 6,
    mechanism: 'The original growth hormone releasing peptide — a synthetic hexapeptide that strongly stimulates GH release through the ghrelin receptor. Known for significant appetite stimulation within 20-30 minutes, making it popular for bulking phases.',
    benefits: [
      'Strong GH release',
      'Significant appetite stimulation',
      'Improved recovery',
      'Cytoprotective properties',
      'Neuroprotective effects'
    ],
    athleteBenefits: [
      'Ideal for hardgainers needing appetite boost',
      'Strong anabolic GH pulse',
      'Synergistic with GHRH peptides',
      'Enhanced nutrient partitioning'
    ],
    risks: [
      'Intense hunger (can impair dieting)',
      'Cortisol and prolactin elevation',
      'Water retention',
      'Possible blood sugar spikes'
    ],
    dosing: {
      beginner: '100mcg before bed',
      intermediate: '200mcg 2x/day',
      advanced: '300mcg 3x/day',
      athlete: '200mcg 2-3x/day'
    },
    frequency: '2-3x daily (fasted)',
    recommendedDuration: '8-12 weeks',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 28,
      restartAdvice: 'Take 4-week break. Manage appetite changes during transition.',
      breakAdvice: [
        'Gradually reduce caloric intake to avoid rebound fat gain',
        'Manage prolactin with P5P supplementation',
        'Continue resistance training',
        'Monitor blood glucose'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Dramatic appetite increase, improved sleep',
      week3_4: 'Weight gain, enhanced recovery',
      week5_8: 'Muscle fullness and body composition changes',
      longTerm: 'Significant mass gains with proper nutrition'
    },
    janoshikTested: true,
    janoshikPurity: 98.8,
    janoshikDate: '2024-10-12',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'GHRP6-5MG',
      price: 28,
      stock: 'in-stock'
    },
    references: ['PMID: 9220477'],
    aminoAcidSequence: 'His-D-Trp-Ala-Trp-D-Phe-Lys-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Extreme appetite stimulation — not suitable for dieting',
      'Elevates cortisol more than Ipamorelin',
      'Banned by WADA'
    ]
  },
  {
    id: 'cjc1295dac',
    name: 'CJC-1295 with DAC',
    shortName: 'CJC-DAC',
    category: 'gh-secretagogue',
    molecularWeight: '3647.28 Da',
    halfLife: '6-8 days',
    longevityScore: 7,
    mechanism: 'Long-acting GHRH analog with Drug Affinity Complex (DAC) that binds to albumin, extending half-life to 6-8 days. Provides sustained GH elevation rather than pulsatile release, allowing for less frequent dosing compared to CJC-1295 without DAC.',
    benefits: [
      'Extended half-life (6-8 days)',
      'Less frequent dosing (1-2x/week)',
      'Sustained GH and IGF-1 elevation',
      'Improved body composition',
      'Anti-aging effects'
    ],
    athleteBenefits: [
      'Convenient dosing schedule',
      'Sustained anabolic environment',
      'Enhanced recovery over longer periods',
      'Body recomposition'
    ],
    risks: [
      'Non-pulsatile GH release (less physiological)',
      'Water retention',
      'Potential pituitary desensitization',
      'Head rush/flushing after injection'
    ],
    dosing: {
      beginner: '1mg weekly',
      intermediate: '2mg weekly',
      advanced: '2mg 2x/week',
      athlete: '2mg weekly'
    },
    frequency: '1-2x weekly',
    recommendedDuration: '8-12 weeks',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 28,
      restartAdvice: 'Take 4-week break between cycles. Monitor IGF-1.',
      breakAdvice: [
        'Track IGF-1 normalization during break',
        'Maintain training intensity',
        'Support with quality sleep',
        'Consider switching to non-DAC CJC-1295 for pulsatile release'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Improved sleep, sustained GH elevation',
      week3_4: 'Enhanced recovery and energy',
      week5_8: 'Noticeable body composition changes',
      longTerm: 'Sustained anabolic and anti-aging effects'
    },
    janoshikTested: true,
    janoshikPurity: 98.9,
    janoshikDate: '2024-10-20',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'CJCDAC-2MG',
      price: 48,
      stock: 'in-stock'
    },
    references: ['PMID: 16352683'],
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Non-pulsatile GH release may be less physiological',
      'Monitor for pituitary desensitization',
      'May cause sustained water retention'
    ]
  },
  {
    id: 'll37',
    name: 'LL-37',
    shortName: 'LL-37',
    category: 'immune',
    molecularWeight: '4493.33 Da',
    halfLife: '~4-6 hours',
    longevityScore: 7,
    mechanism: 'Human cathelicidin antimicrobial peptide with broad-spectrum activity. Disrupts microbial membranes, modulates immune responses, promotes wound healing, and exhibits anti-biofilm properties. Part of the innate immune defense system.',
    benefits: [
      'Broad-spectrum antimicrobial activity',
      'Anti-biofilm properties',
      'Immunomodulation',
      'Wound healing acceleration',
      'Anti-inflammatory effects'
    ],
    athleteBenefits: [
      'Enhanced immune defense',
      'Faster wound healing',
      'Protection against training-related infections',
      'Anti-inflammatory support'
    ],
    risks: [
      'Injection site reactions',
      'Possible autoimmune activation',
      'Limited clinical data for injectable use',
      'May cause local inflammation'
    ],
    dosing: {
      beginner: '50mcg daily',
      intermediate: '100mcg daily',
      advanced: '200mcg daily',
      athlete: '100mcg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-8 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 21,
      restartAdvice: 'Resume for specific immune challenges. Not for long-term continuous use.',
      breakAdvice: [
        'Support immune function with zinc, vitamin D, and vitamin C',
        'Maintain gut health with probiotics',
        'Monitor inflammatory markers',
        'Continue healthy lifestyle practices'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Enhanced immune response',
      week3_4: 'Improved wound healing',
      week5_8: 'Sustained antimicrobial defense',
      longTerm: 'Strengthened innate immunity'
    },
    janoshikTested: true,
    janoshikPurity: 98.3,
    janoshikDate: '2024-10-30',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'LL37-5MG',
      price: 72,
      stock: 'low-stock'
    },
    references: ['PMID: 23778903'],
    aminoAcidSequence: 'Leu-Leu-Gly-Asp-Phe-Phe-Arg-Lys-Ser-Lys-Glu-Lys-Ile-Gly-Lys-Glu-Phe-Lys-Arg-Ile-Val-Gln-Arg-Ile-Lys-Asp-Phe-Leu-Arg-Asn-Leu-Val-Pro-Arg-Thr-Glu-Ser',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light, stable 2 years lyophilized',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'May exacerbate autoimmune conditions',
      'Pro-inflammatory at high doses',
      'Limited human safety data for systemic use'
    ]
  },
  {
    id: 'kpv',
    name: 'KPV',
    shortName: 'KPV',
    category: 'immune',
    molecularWeight: '342.43 Da',
    halfLife: '~2-3 hours',
    longevityScore: 7,
    mechanism: 'Tripeptide (Lys-Pro-Val) derived from alpha-melanocyte-stimulating hormone (α-MSH). Possesses potent anti-inflammatory and antimicrobial properties without the pigmentation effects of its parent molecule. Reduces pro-inflammatory cytokines (TNF-α, IL-6) and modulates NF-κB signaling.',
    benefits: [
      'Potent anti-inflammatory without pigmentation',
      'Gut health and IBD support',
      'Antimicrobial properties',
      'Wound healing promotion',
      'Skin condition relief'
    ],
    athleteBenefits: [
      'Reduced systemic inflammation from training',
      'Gut health support (common issue in endurance athletes)',
      'Faster wound healing',
      'Anti-inflammatory recovery support'
    ],
    risks: [
      'Limited human clinical data',
      'Possible GI discomfort (oral)',
      'Mild injection site reactions'
    ],
    dosing: {
      beginner: '200mcg daily (oral or SC)',
      intermediate: '500mcg daily',
      advanced: '500mcg 2x daily',
      athlete: '500mcg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-12 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 84,
      breakDays: 14,
      restartAdvice: 'Resume for flare-ups or inflammatory episodes.',
      breakAdvice: [
        'Continue anti-inflammatory diet (omega-3s, turmeric)',
        'Maintain gut health with probiotics and prebiotics',
        'Monitor inflammatory markers (CRP, ESR)',
        'Support with glutamine for gut lining repair'
      ]
    },
    administration: 'Subcutaneous injection or oral capsules',
    expectedResults: {
      week1_2: 'Reduced inflammation markers',
      week3_4: 'Improved gut health symptoms',
      week5_8: 'Sustained anti-inflammatory effects',
      longTerm: 'Improved inflammatory resilience'
    },
    janoshikTested: true,
    janoshikPurity: 99.0,
    janoshikDate: '2024-11-01',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'KPV-10MG',
      price: 45,
      stock: 'in-stock'
    },
    references: ['PMID: 15780975'],
    aminoAcidSequence: 'Lys-Pro-Val',
    bioavailability: 'Moderate (oral), High (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light, stable 2 years lyophilized',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Limited human clinical trial data',
      'May interact with immunosuppressive medications',
      'Monitor for allergic reactions'
    ]
  },
  {
    id: 'vip',
    name: 'VIP (Vasoactive Intestinal Peptide)',
    shortName: 'VIP',
    category: 'immune',
    molecularWeight: '3325.86 Da',
    halfLife: '~1-2 minutes (IV)',
    longevityScore: 6,
    mechanism: 'A 28-amino acid neuropeptide with broad immunomodulatory, neuroprotective, and vasodilatory effects. Central to the Shoemaker protocol for CIRS (Chronic Inflammatory Response Syndrome) and mold illness. Regulates circadian rhythm and has pulmonary vasodilatory properties.',
    benefits: [
      'CIRS/mold illness treatment (Shoemaker protocol)',
      'Immunomodulation and anti-inflammation',
      'Pulmonary vasodilation',
      'Circadian rhythm regulation',
      'Neuroprotection'
    ],
    athleteBenefits: [
      'Improved pulmonary function',
      'Anti-inflammatory recovery',
      'Circadian rhythm optimization',
      'Environmental toxin resilience'
    ],
    risks: [
      'Hypotension (vasodilation)',
      'Flushing and diarrhea',
      'Short half-life requiring nasal delivery',
      'Limited commercial availability'
    ],
    dosing: {
      beginner: '50mcg intranasal 4x/day',
      intermediate: '100mcg intranasal 4x/day',
      advanced: '200mcg intranasal 4x/day',
      athlete: '100mcg intranasal 4x/day'
    },
    frequency: '4x daily (intranasal)',
    recommendedDuration: '30-90 days (per Shoemaker protocol)',
    cycleProtocol: {
      minDays: 30,
      maxDays: 90,
      breakDays: 30,
      restartAdvice: 'Follow Shoemaker protocol guidance. Resume based on MSH and VIP levels.',
      breakAdvice: [
        'Continue environmental mold avoidance',
        'Support with omega-3s and cholestyramine if indicated',
        'Monitor inflammatory markers (MMP-9, TGF-β1)',
        'Maintain clean indoor air quality'
      ]
    },
    administration: 'Intranasal spray',
    expectedResults: {
      week1_2: 'Improved respiratory function',
      week3_4: 'Reduced CIRS symptoms',
      week5_8: 'Significant inflammatory marker improvement',
      longTerm: 'Normalized VIP levels and immune regulation'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'VIP-1MG',
      price: 85,
      stock: 'low-stock'
    },
    references: ['PMID: 20626275'],
    aminoAcidSequence: 'His-Ser-Asp-Ala-Val-Phe-Thr-Asp-Asn-Tyr-Thr-Arg-Leu-Arg-Lys-Gln-Met-Ala-Val-Lys-Lys-Tyr-Leu-Asn-Ser-Ile-Leu-Asn-NH2',
    bioavailability: 'Moderate (intranasal)',
    storageRequirements: 'Store at -20°C, protect from light, prepare fresh for nasal use',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'May cause hypotension — monitor blood pressure',
      'Very short half-life requires frequent dosing',
      'Best used under Shoemaker protocol guidance'
    ]
  },
  {
    id: 'thymulin',
    name: 'Thymulin',
    shortName: 'Thymulin',
    category: 'immune',
    molecularWeight: '857.97 Da',
    halfLife: '~30 minutes',
    longevityScore: 7,
    mechanism: 'A 9-amino acid zinc-dependent peptide naturally produced by thymic epithelial cells. Requires zinc for biological activity. Plays essential roles in T-cell differentiation, immune regulation, and neuroendocrine function. Levels decline significantly with age, linked to immune senescence.',
    benefits: [
      'T-cell differentiation and maturation',
      'Immune system rejuvenation',
      'Zinc-dependent immune activation',
      'Anti-aging immune support',
      'Hair follicle support (via Wnt pathway)'
    ],
    athleteBenefits: [
      'Enhanced immune resilience',
      'Reduced training-related immune suppression',
      'Anti-aging immune benefits',
      'Recovery support'
    ],
    risks: [
      'Requires adequate zinc status',
      'Limited clinical data',
      'Short half-life'
    ],
    dosing: {
      beginner: '1mg daily',
      intermediate: '2mg daily',
      advanced: '5mg daily',
      athlete: '2mg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-8 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 21,
      restartAdvice: 'Resume after 3-week break. Ensure adequate zinc supplementation.',
      breakAdvice: [
        'Supplement with zinc (30mg daily) to maintain thymulin activity',
        'Support thymus function with vitamin A and selenium',
        'Continue immune-supporting lifestyle practices',
        'Monitor immune markers during break'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Enhanced immune response markers',
      week3_4: 'Improved T-cell function',
      week5_8: 'Sustained immune rejuvenation',
      longTerm: 'Age-related immune function improvement'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'THYM-5MG',
      price: 55,
      stock: 'low-stock'
    },
    references: ['PMID: 3321414'],
    aminoAcidSequence: 'pGlu-Ala-Lys-Ser-Gln-Gly-Gly-Ser-Asn',
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at -20°C with zinc, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Inactive without zinc cofactor',
      'Limited human clinical data',
      'Monitor zinc levels'
    ]
  },
  {
    id: 'foxo4dri',
    name: 'FOXO4-DRI',
    shortName: 'FOXO4',
    category: 'longevity',
    molecularWeight: '~4800 Da',
    halfLife: '~2-4 hours',
    longevityScore: 9,
    mechanism: 'D-retro-inverso peptide that selectively eliminates senescent (zombie) cells by disrupting the FOXO4-p53 interaction. This senolytic mechanism triggers apoptosis specifically in damaged cells while sparing healthy ones. Based on the landmark 2017 Cell paper by Baar et al.',
    benefits: [
      'Selective senescent cell elimination',
      'Anti-aging at cellular level',
      'Improved tissue function',
      'Reduced age-related inflammation (inflammaging)',
      'Enhanced stem cell function'
    ],
    athleteBenefits: [
      'Tissue rejuvenation',
      'Reduced chronic inflammation',
      'Improved recovery capacity with aging',
      'Longevity optimization'
    ],
    risks: [
      'Very limited human data',
      'Potential off-target effects on healthy cells',
      'Extremely expensive',
      'Experimental compound'
    ],
    dosing: {
      beginner: '2mg/kg every other day for 3 doses',
      intermediate: '5mg/kg every other day for 3 doses',
      advanced: '10mg/kg every other day for 3 doses',
      athlete: '5mg/kg every other day for 3 doses'
    },
    frequency: 'Every other day for 3 doses per cycle',
    recommendedDuration: '1 week per cycle, 2-4 cycles per year',
    cycleProtocol: {
      minDays: 5,
      maxDays: 7,
      breakDays: 90,
      restartAdvice: 'Run 2-4 short cycles per year. Allow 3 months between cycles for senescent cell clearance.',
      breakAdvice: [
        'Support with senolytic-supporting supplements (quercetin, fisetin)',
        'Maintain exercise and fasting routines to promote autophagy',
        'Track biological aging markers (epigenetic clocks if available)',
        'Continue anti-inflammatory diet'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Senescent cell apoptosis initiation',
      week3_4: 'Cellular clearance and renewal',
      week5_8: 'Improved tissue function markers',
      longTerm: 'Rejuvenated tissue function, reduced biological age'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'FOXO4-1MG',
      price: 350,
      stock: 'out-of-stock'
    },
    references: ['PMID: 28340339'],
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at -80°C, extremely light-sensitive, prepare immediately before use',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Extremely experimental — no human trials',
      'Based on single landmark paper (2017)',
      'Very expensive',
      'Requires careful cold storage'
    ],
    notableStudies: [
      {
        title: 'Targeted apoptosis of senescent cells restores tissue homeostasis',
        year: 2017,
        finding: 'FOXO4-DRI selectively eliminated senescent cells and restored fitness in aged mice',
        doi: '10.1016/j.cell.2017.02.031'
      }
    ]
  },
  {
    id: 'humanin',
    name: 'Humanin',
    shortName: 'HN',
    category: 'longevity',
    molecularWeight: '2687.22 Da',
    halfLife: '~30 minutes',
    longevityScore: 8,
    mechanism: 'Mitochondrial-derived peptide (MDP) with potent cytoprotective and neuroprotective effects. Protects cells from stress-induced death via interaction with BAX and IGFBP-3. Improves insulin sensitivity, has anti-inflammatory properties, and is inversely correlated with age.',
    benefits: [
      'Cytoprotection against stress-induced cell death',
      'Neuroprotection (Alzheimer\'s disease research)',
      'Improved insulin sensitivity',
      'Anti-inflammatory effects',
      'Cardioprotective properties'
    ],
    athleteBenefits: [
      'Cellular stress protection',
      'Improved metabolic health',
      'Neuroprotection during intense training',
      'Anti-aging cellular effects'
    ],
    risks: [
      'Very limited human data',
      'Short half-life',
      'Experimental compound',
      'High cost'
    ],
    dosing: {
      beginner: '1mg daily',
      intermediate: '2mg daily',
      advanced: '5mg daily',
      athlete: '2mg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-8 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 28,
      restartAdvice: 'Resume after 4-week break. Monitor metabolic markers.',
      breakAdvice: [
        'Support mitochondrial health with CoQ10 and PQQ',
        'Continue exercise for endogenous mitochondrial peptide production',
        'Maintain anti-inflammatory diet',
        'Track metabolic health markers'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Subtle cellular protection effects',
      week3_4: 'Improved metabolic markers',
      week5_8: 'Enhanced cellular resilience',
      longTerm: 'Neuroprotection and metabolic optimization'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'HN-5MG',
      price: 165,
      stock: 'out-of-stock'
    },
    references: ['PMID: 11854325', 'PMID: 30080227'],
    aminoAcidSequence: 'Met-Ala-Pro-Arg-Gly-Phe-Ser-Cys-Leu-Leu-Leu-Leu-Thr-Ser-Glu-Ile-Asp-Leu-Pro-Val-Lys-Arg-Arg-Ala',
    bioavailability: 'Low-Moderate (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light, stable 2 years lyophilized',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research peptide)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Highly experimental compound',
      'Very limited human safety data',
      'Short half-life limits practical use'
    ]
  },
  {
    id: 'nad',
    name: 'NAD+ (Injectable)',
    shortName: 'NAD+',
    category: 'longevity',
    molecularWeight: '663.43 Da',
    halfLife: '~2-4 hours (IV)',
    longevityScore: 9,
    mechanism: 'Nicotinamide adenine dinucleotide — a coenzyme essential for cellular energy production, DNA repair, and sirtuin activation. Levels decline ~50% between ages 40-60. Injectable NAD+ provides direct cellular replenishment, bypassing oral bioavailability issues.',
    benefits: [
      'Direct cellular energy replenishment',
      'DNA repair activation (PARP pathway)',
      'Sirtuin activation (SIRT1-7)',
      'Mitochondrial function enhancement',
      'Neuroprotective effects'
    ],
    athleteBenefits: [
      'Enhanced cellular energy production',
      'Improved endurance and recovery',
      'Anti-aging at cellular level',
      'Neuroprotection'
    ],
    risks: [
      'Flushing and warmth during IV infusion',
      'Nausea (common with IV)',
      'Chest tightness (high dose IV)',
      'Expensive therapy'
    ],
    dosing: {
      beginner: '100mg SC daily',
      intermediate: '250mg IV 2x/week',
      advanced: '500mg IV 2x/week',
      athlete: '250mg SC or IV 2x/week'
    },
    frequency: '2-3x weekly (SC) or 1-2x weekly (IV)',
    recommendedDuration: '4-12 weeks per cycle',
    cycleProtocol: {
      minDays: 28,
      maxDays: 84,
      breakDays: 28,
      restartAdvice: 'Support with NMN/NR orally during breaks.',
      breakAdvice: [
        'Continue oral NAD+ precursors (NMN 500mg or NR 300mg daily)',
        'Maintain exercise for endogenous NAD+ production',
        'Support with resveratrol and quercetin',
        'Track energy levels and recovery metrics'
      ]
    },
    administration: 'Subcutaneous injection or IV infusion',
    expectedResults: {
      week1_2: 'Improved energy and mental clarity',
      week3_4: 'Enhanced recovery and endurance',
      week5_8: 'Sustained cellular rejuvenation',
      longTerm: 'Slowed cellular aging markers'
    },
    janoshikTested: true,
    janoshikPurity: undefined,
    janoshikDate: '2025-07-02',
    janoshikCOA: [
      {
        taskNumber: '#69931',
        verifyKey: '8IBNP21R84AE',
        sampleName: 'NAD+ 500mg',
        measuredAmount: '563.73 mg',
        testDate: '02 JUL 2025',
        manufacturer: 'https://zztai-tech.com/',
      },
    ],
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'NAD-500MG',
      price: 195,
      stock: 'in-stock'
    },
    references: ['PMID: 26785480', 'PMID: 30457958'],
    bioavailability: 'High (IV), Moderate (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light, use within 24 hours reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Supplement/research',
      australia: 'Schedule 4 (injectable)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'IV infusion should be slow (2-4 hours)',
      'Flushing is normal but can be uncomfortable',
      'Monitor liver function with extended use'
    ]
  },
  {
    id: 'liraglutide',
    name: 'Liraglutide',
    shortName: 'Lira',
    category: 'weight-loss',
    molecularWeight: '3751.20 Da',
    halfLife: '~13 hours',
    longevityScore: 7,
    mechanism: 'GLP-1 receptor agonist FDA-approved for type 2 diabetes (Victoza) and weight management (Saxenda). First GLP-1 approved for weight loss. Requires daily injection due to shorter half-life compared to semaglutide. Longest safety track record among GLP-1 medications.',
    benefits: [
      '5-10% body weight reduction',
      'Improved glycemic control',
      'Longest safety track record (10+ years)',
      'Cardiovascular benefit (LEADER trial)',
      'Daily dosing allows flexible titration'
    ],
    athleteBenefits: [
      'Gradual weight management',
      'Improved insulin sensitivity',
      'Flexible daily dosing',
      'Well-studied safety profile'
    ],
    risks: [
      'Daily injection required',
      'GI side effects (nausea)',
      'Less efficacious than semaglutide/tirzepatide',
      'Pancreatitis risk (rare)'
    ],
    dosing: {
      beginner: '0.6mg daily (1 week)',
      intermediate: '1.2-1.8mg daily',
      advanced: '3.0mg daily',
      athlete: '1.2-1.8mg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '16-56 weeks with dose titration',
    cycleProtocol: {
      minDays: 112,
      maxDays: 392,
      breakDays: 28,
      restartAdvice: 'Taper before stopping. Restart at 0.6mg.',
      breakAdvice: [
        'Maintain dietary habits developed during treatment',
        'Continue exercise routine',
        'Monitor weight and metabolic markers',
        'Focus on behavioral strategies'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced appetite, GI adjustment',
      week3_4: 'Steady weight loss begins',
      week5_8: 'Consistent 1-2 lbs/week loss',
      longTerm: '5-10% total body weight reduction'
    },
    janoshikTested: true,
    janoshikPurity: 99.3,
    janoshikDate: '2024-10-05',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'LIRA-6MG',
      price: 65,
      stock: 'in-stock'
    },
    references: ['PMID: 25882847'],
    aminoAcidSequence: 'Modified GLP-1 (7-37) with C16 fatty acid (palmitic acid)',
    bioavailability: 'High (subcutaneous, ~55%)',
    storageRequirements: 'Store at 2-8°C, protect from light, use within 30 days after first use',
    legalStatus: {
      usa: 'prescription',
      eu: 'Prescription (EMA approved)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2010,
    warnings: [
      'Daily injection required (unlike weekly semaglutide)',
      'Contraindicated with MTC history',
      'Dose titration over 4-5 weeks required'
    ]
  },
  {
    id: 'cagrilintide',
    name: 'Cagrilintide',
    shortName: 'Cagri',
    category: 'weight-loss',
    molecularWeight: '~3900 Da',
    halfLife: '~7 days',
    longevityScore: 7,
    mechanism: 'Long-acting amylin analog developed by Novo Nordisk. Enhances satiety and slows gastric emptying through amylin receptor activation. Phase 2 trials showed 11.8% weight loss as monotherapy and up to 17.1% when combined with semaglutide (CagriSema).',
    benefits: [
      '11.8% weight loss as monotherapy',
      'Up to 17.1% with semaglutide (CagriSema)',
      'Novel amylin-based mechanism',
      'Once-weekly dosing',
      'Complementary to GLP-1 therapy'
    ],
    athleteBenefits: [
      'Enhanced satiety via novel pathway',
      'Additive to GLP-1 effects',
      'Improved body composition',
      'Better glucose control'
    ],
    risks: [
      'GI side effects',
      'Injection site reactions',
      'Currently investigational',
      'Limited long-term data'
    ],
    dosing: {
      beginner: '0.3mg weekly',
      intermediate: '1.2mg weekly',
      advanced: '2.4mg weekly',
      athlete: '1.2mg weekly'
    },
    frequency: 'Once weekly',
    recommendedDuration: '24-68 weeks (based on trial durations)',
    cycleProtocol: {
      minDays: 168,
      maxDays: 476,
      breakDays: 56,
      restartAdvice: 'Taper before stopping. Restart at lowest dose.',
      breakAdvice: [
        'Maintain dietary habits',
        'Continue exercise routine',
        'Monitor metabolic markers',
        'Consider maintaining semaglutide if on CagriSema'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced appetite, possible GI effects',
      week3_4: 'Steady weight loss emerging',
      week5_8: 'Significant weight reduction',
      longTerm: '11-17% body weight reduction'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'CAGRI-5MG',
      price: 155,
      stock: 'out-of-stock'
    },
    references: ['PMID: 36216945'],
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, do not freeze',
    legalStatus: {
      usa: 'research-only',
      eu: 'Clinical trial phase (Novo Nordisk)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase3',
    fdaApproved: false,
    warnings: [
      'Currently in Phase 3 trials',
      'Not yet approved for clinical use',
      'GI side effects common'
    ]
  },
  {
    id: 'follistatin344',
    name: 'Follistatin-344',
    shortName: 'FS-344',
    category: 'gh-secretagogue',
    molecularWeight: '~36,000 Da',
    halfLife: '~4-6 hours',
    longevityScore: 7,
    mechanism: 'Synthetic version of the naturally occurring follistatin protein that inhibits myostatin and activin signaling. By blocking these muscle-growth suppressors, it promotes significant increases in lean muscle mass. Widely researched for muscle-wasting conditions.',
    benefits: [
      'Myostatin inhibition for muscle growth',
      'Activin A suppression',
      'Increased lean muscle mass',
      'Improved fertility parameters',
      'Enhanced physical performance'
    ],
    athleteBenefits: [
      'Significant muscle growth potential',
      'Myostatin blockade for hypertrophy',
      'Enhanced strength gains',
      'Anti-catabolic effects'
    ],
    risks: [
      'Very limited human data',
      'Potential off-target effects on reproductive hormones',
      'Expensive and unstable',
      'Risk of antibody formation'
    ],
    dosing: {
      beginner: '50mcg daily',
      intermediate: '100mcg daily',
      advanced: '100mcg 2x/day',
      athlete: '100mcg daily'
    },
    frequency: 'Daily',
    recommendedDuration: '10-30 days per cycle',
    cycleProtocol: {
      minDays: 10,
      maxDays: 30,
      breakDays: 60,
      restartAdvice: 'Long break between cycles due to antibody formation risk.',
      breakAdvice: [
        'Maintain progressive overload training',
        'High-protein diet for muscle retention',
        'Monitor hormone panel (FSH, activin)',
        'Allow antibody clearance before next cycle'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Increased muscle fullness',
      week3_4: 'Enhanced strength and hypertrophy',
      week5_8: 'Not typically used this long',
      longTerm: 'Lean mass gains retained with training'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'FS344-1MG',
      price: 285,
      stock: 'out-of-stock'
    },
    references: ['PMID: 12628183'],
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at -80°C, extremely temperature-sensitive, prepare immediately',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Highly experimental',
      'Antibody formation with repeated use',
      'May affect reproductive hormones',
      'Requires ultra-cold storage'
    ]
  },
  {
    id: 'igf1lr3',
    name: 'IGF-1 LR3',
    shortName: 'IGF-LR3',
    category: 'gh-secretagogue',
    molecularWeight: '9111 Da',
    halfLife: '~20-30 hours',
    longevityScore: 6,
    mechanism: 'Modified version of insulin-like growth factor 1 with 13 additional amino acids at the N-terminus and an arginine-to-glutamate substitution at position 3. These modifications reduce binding to IGF binding proteins, making it 2-3x more potent than native IGF-1.',
    benefits: [
      'Enhanced muscle protein synthesis',
      'Increased nitrogen retention',
      'Improved recovery',
      'Hyperplasia (new muscle cell formation)',
      'Enhanced nutrient partitioning'
    ],
    athleteBenefits: [
      'Potent anabolic effects',
      'Muscle hyperplasia potential',
      'Enhanced recovery between sessions',
      'Superior to native IGF-1'
    ],
    risks: [
      'Hypoglycemia risk',
      'Joint pain',
      'Potential tumor growth promotion',
      'Gut growth at high doses'
    ],
    dosing: {
      beginner: '20mcg post-workout',
      intermediate: '40-60mcg daily',
      advanced: '80-100mcg daily (split doses)',
      athlete: '40-60mcg post-workout'
    },
    frequency: 'Daily (post-workout)',
    recommendedDuration: '4-6 weeks maximum',
    cycleProtocol: {
      minDays: 28,
      maxDays: 42,
      breakDays: 28,
      restartAdvice: 'Limit to short cycles. Monitor blood glucose and IGF-1 levels.',
      breakAdvice: [
        'Monitor blood glucose normalization',
        'Continue training to retain gains',
        'Check IGF-1 levels before restart',
        'Ensure no signs of uncontrolled growth'
      ]
    },
    administration: 'Subcutaneous or intramuscular injection',
    expectedResults: {
      week1_2: 'Enhanced pump and recovery',
      week3_4: 'Noticeable muscle fullness and growth',
      week5_8: 'Significant hypertrophy (if diet supports)',
      longTerm: 'Retained gains with proper training'
    },
    janoshikTested: true,
    janoshikPurity: 98.5,
    janoshikDate: '2024-09-20',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'IGF1-1MG',
      price: 145,
      stock: 'low-stock'
    },
    references: ['PMID: 7559767'],
    bioavailability: 'High (subcutaneous/intramuscular)',
    storageRequirements: 'Store at -20°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Hypoglycemia risk — always eat with dosing',
      'Banned by WADA',
      'May promote growth of existing tumors',
      'Monitor for signs of acromegaly'
    ]
  },
  {
    id: 'melanotan2',
    name: 'Melanotan II',
    shortName: 'MT-II',
    category: 'skin-hair',
    molecularWeight: '1024.18 Da',
    halfLife: '~33 minutes',
    longevityScore: 4,
    mechanism: 'Synthetic cyclic lactam analog of alpha-melanocyte-stimulating hormone (α-MSH). Activates MC1R (tanning), MC3R/MC4R (sexual function, appetite). More potent than Melanotan I with broader receptor activity.',
    benefits: [
      'Melanin production for tanning',
      'UV photoprotection',
      'Increased libido/sexual function',
      'Appetite suppression',
      'Fat loss (modest)'
    ],
    athleteBenefits: [
      'UV protection for outdoor athletes',
      'Libido enhancement',
      'Modest appetite control',
      'Cosmetic tanning'
    ],
    risks: [
      'Nausea (common initially)',
      'Facial flushing',
      'Mole darkening/new moles',
      'Priapism risk in males',
      'Blood pressure changes'
    ],
    dosing: {
      beginner: '0.25mg every other day',
      intermediate: '0.5mg every other day',
      advanced: '1.0mg every other day',
      athlete: '0.5mg every other day'
    },
    frequency: 'Every other day (loading), then weekly (maintenance)',
    recommendedDuration: '2-4 weeks loading, then maintenance as needed',
    cycleProtocol: {
      minDays: 14,
      maxDays: 28,
      breakDays: 60,
      restartAdvice: 'Maintenance dosing once desired tan achieved. Monitor moles.',
      breakAdvice: [
        'Monitor all moles and freckles for changes',
        'Get dermatological skin check',
        'Tan will fade gradually over weeks',
        'Continue sun protection practices'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Mild tanning begins, possible nausea',
      week3_4: 'Noticeable tan development',
      week5_8: 'Full tan achieved',
      longTerm: 'Maintained with low-dose maintenance'
    },
    janoshikTested: true,
    janoshikPurity: 99.0,
    janoshikDate: '2024-10-05',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MT2-10MG',
      price: 25,
      stock: 'in-stock'
    },
    references: ['PMID: 10643660'],
    aminoAcidSequence: 'Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not approved (research)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Monitor moles for changes — increased melanoma risk debated',
      'Nausea common with initial doses',
      'May cause unwanted erections',
      'Not FDA-approved'
    ]
  },
  {
    id: 'melanotan1',
    name: 'Melanotan I (Afamelanotide)',
    shortName: 'MT-I',
    category: 'skin-hair',
    molecularWeight: '1646.85 Da',
    halfLife: '~30 minutes',
    longevityScore: 5,
    mechanism: 'Synthetic linear analog of alpha-MSH that selectively activates MC1R for melanin production. FDA-approved as Scenesse for erythropoietic protoporphyria (EPP). More selective than MT-II with a cleaner side effect profile — no significant effects on sexual function or appetite.',
    benefits: [
      'Selective melanin stimulation',
      'UV photoprotection',
      'FDA-approved for EPP',
      'Cleaner side effect profile than MT-II',
      'Skin cancer risk reduction (EPP patients)'
    ],
    athleteBenefits: [
      'UV protection for outdoor sports',
      'Photoprotection without sun exposure',
      'Minimal side effects'
    ],
    risks: [
      'Nausea (mild)',
      'Headache',
      'Skin darkening (intended effect)',
      'Injection site reactions'
    ],
    dosing: {
      beginner: '0.5mg every other day',
      intermediate: '1.0mg every other day',
      advanced: '1.0mg daily',
      athlete: '1.0mg every other day'
    },
    frequency: 'Every other day (loading), then maintenance',
    recommendedDuration: '2-4 weeks loading, then maintenance',
    cycleProtocol: {
      minDays: 14,
      maxDays: 28,
      breakDays: 60,
      restartAdvice: 'Maintenance dosing as needed once desired effect achieved.',
      breakAdvice: [
        'Monitor moles for any changes',
        'Continue sun protection',
        'Tan fades more gradually than MT-II',
        'Consider dermatological check-up'
      ]
    },
    administration: 'Subcutaneous injection (or implant for EPP)',
    expectedResults: {
      week1_2: 'Gradual skin darkening begins',
      week3_4: 'Noticeable tan without significant sun exposure',
      week5_8: 'Full photoprotective melanin production',
      longTerm: 'Sustained UV protection'
    },
    janoshikTested: true,
    janoshikPurity: 98.8,
    janoshikDate: '2024-10-02',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MT1-10MG',
      price: 35,
      stock: 'in-stock'
    },
    references: ['PMID: 25388823'],
    aminoAcidSequence: 'Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'prescription',
      eu: 'Approved (EMA) for EPP',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 2019,
    warnings: [
      'Approved only for EPP — off-label for tanning',
      'Monitor for mole changes',
      'Less effective for tanning than MT-II'
    ]
  },
  {
    id: 'oxytocin',
    name: 'Oxytocin',
    shortName: 'OT',
    category: 'hormonal',
    molecularWeight: '1007.19 Da',
    halfLife: '~3-5 minutes (IV)',
    longevityScore: 5,
    mechanism: 'A 9-amino acid neuropeptide produced in the hypothalamus. Known as the "bonding hormone," it plays crucial roles in social bonding, trust, empathy, sexual reproduction, childbirth, and breastfeeding. Research explores therapeutic potential for anxiety, autism spectrum disorders, and PTSD.',
    benefits: [
      'Enhanced social bonding and trust',
      'Reduced anxiety and stress',
      'Improved empathy and emotional recognition',
      'Pain modulation',
      'Anti-inflammatory properties'
    ],
    athleteBenefits: [
      'Reduced performance anxiety',
      'Improved team bonding',
      'Stress reduction',
      'Better pain tolerance'
    ],
    risks: [
      'Uterine contractions (contraindicated in pregnancy)',
      'Water retention/hyponatremia at high doses',
      'Nasal irritation (intranasal)',
      'May increase in-group bias'
    ],
    dosing: {
      beginner: '10 IU intranasal',
      intermediate: '20 IU intranasal',
      advanced: '24-40 IU intranasal',
      athlete: '20 IU intranasal'
    },
    frequency: 'As needed or daily',
    recommendedDuration: 'As needed; 2-4 weeks for therapeutic courses',
    cycleProtocol: {
      minDays: 1,
      maxDays: 28,
      breakDays: 14,
      restartAdvice: 'Use as needed. Short courses for therapeutic benefit.',
      breakAdvice: [
        'Practice social engagement and bonding activities',
        'Continue stress management techniques',
        'Monitor for tolerance development',
        'Maintain healthy social connections'
      ]
    },
    administration: 'Intranasal spray',
    expectedResults: {
      week1_2: 'Enhanced social feelings, reduced anxiety',
      week3_4: 'Sustained emotional regulation',
      week5_8: 'Improved social cognition',
      longTerm: 'Better stress resilience and social function'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'OXY-5MG',
      price: 32,
      stock: 'in-stock'
    },
    references: ['PMID: 18498743'],
    aminoAcidSequence: 'Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2 (disulfide: Cys1-Cys6)',
    bioavailability: 'Low (oral), Moderate (intranasal)',
    storageRequirements: 'Store at 2-8°C, protect from light, stable 30 days reconstituted',
    legalStatus: {
      usa: 'prescription',
      eu: 'Prescription',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'approved',
    fdaApproved: true,
    fdaApprovalYear: 1980,
    warnings: [
      'Contraindicated in pregnancy (causes contractions)',
      'May cause water retention at high doses',
      'Not for self-treatment of psychiatric conditions'
    ]
  },
  {
    id: 'kisspeptin',
    name: 'Kisspeptin',
    shortName: 'Kiss',
    category: 'hormonal',
    molecularWeight: '~1302 Da (Kisspeptin-10)',
    halfLife: '~28 minutes',
    longevityScore: 6,
    mechanism: 'Master regulator of the reproductive hormone axis. Stimulates GnRH release from the hypothalamus, triggering LH and FSH secretion. Used in fertility treatments and hormone optimization. Also shows promise for metabolic regulation and mood enhancement.',
    benefits: [
      'Natural LH and FSH stimulation',
      'Fertility enhancement',
      'Testosterone optimization (in males)',
      'Metabolic regulation',
      'Mood and sexual desire enhancement'
    ],
    athleteBenefits: [
      'Natural testosterone support',
      'HPG axis restoration',
      'Fertility preservation',
      'Hormone optimization without shutdown'
    ],
    risks: [
      'Hot flashes',
      'Injection site reactions',
      'Headache',
      'Limited long-term data'
    ],
    dosing: {
      beginner: '50mcg SC daily',
      intermediate: '100mcg SC daily',
      advanced: '100mcg SC 2x daily',
      athlete: '100mcg SC daily'
    },
    frequency: 'Daily or as needed',
    recommendedDuration: '4-12 weeks for hormonal optimization',
    cycleProtocol: {
      minDays: 28,
      maxDays: 84,
      breakDays: 21,
      restartAdvice: 'Resume based on hormone panel results.',
      breakAdvice: [
        'Monitor testosterone and gonadotropin levels',
        'Support with zinc and vitamin D',
        'Maintain healthy lifestyle for hormone production',
        'Check fertility parameters if applicable'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'LH/FSH elevation',
      week3_4: 'Testosterone increase (males)',
      week5_8: 'Hormonal optimization',
      longTerm: 'Sustained reproductive hormone support'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'KISS-5MG',
      price: 75,
      stock: 'low-stock'
    },
    references: ['PMID: 17185325'],
    aminoAcidSequence: 'Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2 (Kisspeptin-10)',
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'May cause hormonal fluctuations',
      'Not a replacement for TRT',
      'Monitor reproductive hormones'
    ]
  },
  {
    id: 'ptddbm',
    name: 'PTD-DBM',
    shortName: 'PTD-DBM',
    category: 'skin-hair',
    molecularWeight: '~3200 Da',
    halfLife: '~4-6 hours (topical depot)',
    longevityScore: 6,
    mechanism: 'Cell-penetrating peptide that promotes hair growth by inhibiting CXXC5, a negative regulator of the Wnt/β-catenin signaling pathway. By blocking CXXC5-Dishevelled interaction, it activates Wnt signaling essential for hair follicle development and cycling.',
    benefits: [
      'Hair follicle regeneration',
      'Increased hair density and thickness',
      'Wnt/β-catenin pathway activation',
      'Works on androgenetic alopecia',
      'Topical application possible'
    ],
    athleteBenefits: [
      'Hair loss prevention',
      'Non-hormonal mechanism',
      'Topical convenience',
      'Compatible with other treatments'
    ],
    risks: [
      'Limited clinical data',
      'Skin irritation (topical)',
      'Slow onset of action',
      'Results vary significantly'
    ],
    dosing: {
      beginner: 'Topical application daily',
      intermediate: 'Topical + microneedling weekly',
      advanced: '50mcg SC to scalp weekly',
      athlete: 'Topical application daily'
    },
    frequency: 'Daily (topical) or weekly (microneedling/injection)',
    recommendedDuration: '3-6 months minimum for visible results',
    cycleProtocol: {
      minDays: 90,
      maxDays: 180,
      breakDays: 30,
      restartAdvice: 'Continue long-term for hair maintenance.',
      breakAdvice: [
        'Continue minoxidil or finasteride if prescribed',
        'Maintain scalp health with gentle care',
        'Monitor hair density and growth patterns',
        'Support with biotin and marine collagen'
      ]
    },
    administration: 'Topical or subcutaneous (scalp)',
    expectedResults: {
      week1_2: 'No visible changes',
      week3_4: 'Reduced shedding may begin',
      week5_8: 'Early regrowth signs possible',
      longTerm: 'Increased hair density and thickness (3-6 months)'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'PTDDBM-5MG',
      price: 95,
      stock: 'out-of-stock'
    },
    references: ['PMID: 28129361'],
    bioavailability: 'Moderate (topical with microneedling)',
    storageRequirements: 'Store at -20°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Very limited human data',
      'Results take 3-6 months',
      'May cause scalp irritation',
      'Not a proven baldness cure'
    ]
  },
  {
    id: 'tesofensine',
    name: 'Tesofensine',
    shortName: 'Teso',
    category: 'weight-loss',
    molecularWeight: '429.36 Da',
    halfLife: '~220 hours (~9 days)',
    longevityScore: 6,
    mechanism: 'Serotonin-noradrenaline-dopamine reuptake inhibitor (SNDRI) originally developed for Parkinson\'s and Alzheimer\'s disease. Reduces appetite and increases satiety through triple monoamine reuptake inhibition. Phase 2 trials showed 12.8% weight loss over 6 months.',
    benefits: [
      '12.8% weight loss in Phase 2 trials',
      'Triple monoamine reuptake inhibition',
      'Significant appetite reduction',
      'Improved mood and energy',
      'Oral administration'
    ],
    athleteBenefits: [
      'Significant fat loss potential',
      'Enhanced energy and motivation',
      'Oral convenience',
      'Mood enhancement during dieting'
    ],
    risks: [
      'Increased heart rate',
      'Insomnia',
      'Dry mouth',
      'Elevated blood pressure',
      'CNS stimulant effects'
    ],
    dosing: {
      beginner: '0.25mg daily (oral)',
      intermediate: '0.5mg daily',
      advanced: '1.0mg daily',
      athlete: '0.5mg daily'
    },
    frequency: 'Daily (oral, morning)',
    recommendedDuration: '12-24 weeks',
    cycleProtocol: {
      minDays: 84,
      maxDays: 168,
      breakDays: 28,
      restartAdvice: 'Taper down rather than abrupt discontinuation.',
      breakAdvice: [
        'Taper dose over 1-2 weeks',
        'Monitor mood and energy during transition',
        'Maintain dietary habits',
        'Check cardiovascular parameters'
      ]
    },
    administration: 'Oral',
    expectedResults: {
      week1_2: 'Reduced appetite, increased energy',
      week3_4: 'Consistent weight loss',
      week5_8: 'Significant fat loss (5-8%)',
      longTerm: 'Up to 12.8% body weight reduction'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TESO-10MG',
      price: 55,
      stock: 'low-stock'
    },
    references: ['PMID: 18719519'],
    bioavailability: 'High (oral)',
    storageRequirements: 'Store at room temperature, protect from moisture',
    legalStatus: {
      usa: 'research-only',
      eu: 'Clinical trial phase',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase3',
    fdaApproved: false,
    warnings: [
      'Not a peptide — small molecule SNDRI',
      'Cardiovascular monitoring required',
      'May cause insomnia if taken late in day',
      'Contraindicated with MAOIs'
    ]
  },
  {
    id: 'thymosinbeta4',
    name: 'Thymosin Beta-4',
    shortName: 'TB-4',
    category: 'healing',
    molecularWeight: '4963 Da',
    halfLife: '~2-3 hours',
    longevityScore: 8,
    mechanism: 'Full-length 43-amino acid peptide naturally found in human tissues. More biologically complete than TB-500 fragment. Promotes tissue repair, wound healing, cell migration, angiogenesis, and immune regulation through actin-binding and multiple signaling pathways.',
    benefits: [
      'Complete tissue repair signaling',
      'Superior to TB-500 (full-length)',
      'Wound healing acceleration',
      'Anti-inflammatory effects',
      'Cardiac repair potential'
    ],
    athleteBenefits: [
      'Comprehensive injury recovery',
      'Full-spectrum tissue repair',
      'Synergistic with BPC-157',
      'Anti-inflammatory recovery'
    ],
    risks: [
      'More expensive than TB-500',
      'Limited human clinical data',
      'Injection site reactions',
      'Banned in competitive sports'
    ],
    dosing: {
      beginner: '750mcg daily',
      intermediate: '1.5mg daily',
      advanced: '2mg daily',
      athlete: '1.5mg daily'
    },
    frequency: 'Daily for loading, then 2-3x weekly',
    recommendedDuration: '4-8 weeks loading, then maintenance',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 21,
      restartAdvice: 'Resume for injury. Not needed continuously.',
      breakAdvice: [
        'Continue physical therapy and rehab',
        'Support with collagen and vitamin C',
        'Monitor healing progress',
        'Stack with BPC-157 for enhanced effect'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Reduced inflammation at injury site',
      week3_4: 'Accelerated tissue repair visible',
      week5_8: 'Significant healing progress',
      longTerm: 'Complete tissue regeneration support'
    },
    janoshikTested: true,
    janoshikPurity: 98.7,
    janoshikDate: '2024-10-15',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'TB4-5MG',
      price: 85,
      stock: 'in-stock'
    },
    references: ['PMID: 25290457'],
    aminoAcidSequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser',
    bioavailability: 'High (subcutaneous)',
    storageRequirements: 'Store at -20°C, protect from light, stable 2 years lyophilized',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Schedule 4 (prescription)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Banned by WADA',
      'More expensive than TB-500 fragment',
      'Limited controlled human trials'
    ]
  },
  {
    id: '5amino1mq',
    name: '5-Amino-1MQ',
    shortName: '5A1MQ',
    category: 'metabolic',
    molecularWeight: '176.22 Da',
    halfLife: '~2-4 hours',
    longevityScore: 7,
    mechanism: 'Small molecule NNMT (nicotinamide N-methyltransferase) inhibitor. NNMT is linked to fat accumulation and metabolic dysfunction. By blocking NNMT, it increases NAD+ levels, boosts cellular energy, promotes fat loss, and supports metabolic health.',
    benefits: [
      'NNMT inhibition for fat metabolism',
      'Increased NAD+ levels',
      'Enhanced cellular energy',
      'Weight loss support',
      'Oral bioavailability'
    ],
    athleteBenefits: [
      'Fat loss without muscle impact',
      'Enhanced metabolic rate',
      'Oral convenience',
      'NAD+ pathway support'
    ],
    risks: [
      'Limited human data',
      'GI discomfort possible',
      'Relatively new compound',
      'Long-term effects unknown'
    ],
    dosing: {
      beginner: '50mg daily (oral)',
      intermediate: '100mg daily',
      advanced: '150mg daily',
      athlete: '100mg daily'
    },
    frequency: 'Daily (oral)',
    recommendedDuration: '8-12 weeks',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 21,
      restartAdvice: 'Resume after 3-week break if continued metabolic support desired.',
      breakAdvice: [
        'Support NAD+ with NMN or NR supplementation',
        'Maintain exercise and dietary habits',
        'Monitor metabolic markers',
        'Continue healthy lifestyle practices'
      ]
    },
    administration: 'Oral capsule or subcutaneous injection',
    expectedResults: {
      week1_2: 'Subtle metabolic changes',
      week3_4: 'Improved energy levels',
      week5_8: 'Moderate fat loss',
      longTerm: 'Metabolic optimization'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: '5A1MQ-50MG',
      price: 65,
      stock: 'in-stock'
    },
    references: ['PMID: 30445859'],
    bioavailability: 'Moderate (oral)',
    storageRequirements: 'Store at room temperature, protect from moisture',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Not a peptide — small molecule',
      'Very limited human safety data',
      'Long-term effects unknown'
    ]
  },
  {
    id: 'dihexa',
    name: 'Dihexa',
    shortName: 'Dihexa',
    category: 'cognitive',
    molecularWeight: '507.63 Da',
    halfLife: '~6 hours',
    longevityScore: 8,
    mechanism: 'An angiotensin IV analog (N-hexanoic-Tyr-Ile-(6) aminohexanoic amide) that is approximately 10 million times more potent than BDNF at promoting hepatocyte growth factor (HGF)/c-Met receptor activation. Enhances synaptogenesis, spinogenesis, and memory consolidation in the hippocampus.',
    benefits: [
      'Potent cognitive enhancement via HGF/c-Met pathway',
      'Promotes new synapse formation',
      'Enhanced memory consolidation and recall',
      'Neuroprotective properties',
      'May support nerve regeneration'
    ],
    athleteBenefits: [
      'Superior focus and learning capacity',
      'Enhanced motor skill acquisition',
      'Improved spatial memory',
      'Neuroprotection during contact sports'
    ],
    risks: [
      'Very limited human safety data',
      'Potential cancer risk (HGF/c-Met pathway involved in tumor growth)',
      'Unknown long-term effects',
      'Extremely potent — dosing errors risky'
    ],
    dosing: {
      beginner: '10mg oral or 5mg sublingual daily',
      intermediate: '20mg oral daily',
      advanced: '30mg oral daily',
      athlete: '10-20mg oral daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-8 weeks with careful monitoring',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 28,
      restartAdvice: 'Take 4-week break between cycles. Monitor cognitive function.',
      breakAdvice: [
        'Use natural nootropics (lion\'s mane, bacopa) during break',
        'Continue cognitive training to retain synaptogenesis benefits',
        'Monitor for any unusual symptoms',
        'Reassess cognitive baseline before restarting'
      ]
    },
    administration: 'Oral or sublingual',
    expectedResults: {
      week1_2: 'Improved mental clarity and focus',
      week3_4: 'Enhanced memory and learning speed',
      week5_8: 'Significant cognitive enhancement',
      longTerm: 'Sustained neuroplasticity improvements'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'DIHX-50MG',
      price: 55,
      stock: 'in-stock'
    },
    references: ['PMID: 23459100'],
    aminoAcidSequence: 'N-hexanoic-Tyr-Ile-(6)aminohexanoic amide',
    bioavailability: 'Good (oral)',
    storageRequirements: 'Store at -20°C, protect from light and moisture',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Extremely potent — precise dosing critical',
      'HGF/c-Met pathway implicated in cancer; use with caution',
      'No human clinical trials completed',
      'Not recommended for those with cancer history'
    ],
    notableStudies: [
      {
        title: 'Dihexa augments cognition via HGF/c-Met',
        year: 2013,
        finding: 'Seven orders of magnitude more potent than BDNF in promoting synaptogenesis',
        doi: '10.1124/jpet.112.199497'
      }
    ]
  },
  {
    id: 'p21',
    name: 'P21 (Cerebrolysin-derived)',
    shortName: 'P21',
    category: 'cognitive',
    molecularWeight: '~1100 Da',
    halfLife: '~4 hours',
    longevityScore: 7,
    mechanism: 'A synthetic peptide derived from the active region of Cerebrolysin CNTF (ciliary neurotrophic factor). Enhances neurogenesis in the hippocampal dentate gyrus and subventricular zone. Reduces neuroinflammation and tau hyperphosphorylation. Crosses the blood-brain barrier effectively.',
    benefits: [
      'Promotes hippocampal neurogenesis',
      'Reduces tau phosphorylation (Alzheimer\'s model)',
      'Anti-neuroinflammatory effects',
      'Enhanced spatial learning and memory',
      'Crosses blood-brain barrier'
    ],
    athleteBenefits: [
      'Enhanced learning and adaptation',
      'Improved spatial awareness',
      'Neuroprotection',
      'Cognitive recovery support'
    ],
    risks: [
      'Limited human data',
      'Possible headaches',
      'Nasal irritation (intranasal route)',
      'Long-term effects unknown'
    ],
    dosing: {
      beginner: '1mg intranasal daily',
      intermediate: '2mg intranasal daily',
      advanced: '4mg intranasal daily',
      athlete: '2mg intranasal daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-8 weeks per cycle',
    cycleProtocol: {
      minDays: 28,
      maxDays: 56,
      breakDays: 21,
      restartAdvice: 'Take 3-week break. Assess cognitive improvements before restarting.',
      breakAdvice: [
        'Support neurogenesis with exercise (running/HIIT)',
        'Use omega-3 fatty acids and lion\'s mane',
        'Maintain sleep quality for memory consolidation',
        'Practice active learning during break'
      ]
    },
    administration: 'Intranasal',
    expectedResults: {
      week1_2: 'Subtle improvements in clarity',
      week3_4: 'Noticeable memory enhancement',
      week5_8: 'Significant cognitive benefits',
      longTerm: 'Sustained neurogenesis and neuroprotection'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'P21-50MG',
      price: 48,
      stock: 'in-stock'
    },
    references: ['PMID: 25246030'],
    bioavailability: 'Good (intranasal, crosses BBB)',
    storageRequirements: 'Store at -20°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Animal studies only — no human clinical data',
      'Avoid in individuals with nasal conditions',
      'Long-term neurogenic effects unknown'
    ],
    notableStudies: [
      {
        title: 'P21 peptide enhances neurogenesis and cognition',
        year: 2014,
        finding: 'Rescued cognitive deficits and enhanced dentate gyrus neurogenesis in Alzheimer\'s mouse model',
        doi: '10.1016/j.neuropharm.2014.09.017'
      }
    ]
  },
  {
    id: 'snap8',
    name: 'SNAP-8 (Acetyl Octapeptide-3)',
    shortName: 'SNAP-8',
    category: 'skin-hair',
    molecularWeight: '1075.17 Da',
    halfLife: '~12 hours (topical)',
    longevityScore: 4,
    mechanism: 'An extension of Argireline (Acetyl Hexapeptide-3) with two additional amino acids, making it more potent. Acts as a competitive antagonist for the SNARE complex, inhibiting catecholamine release and reducing muscular contraction at the neuromuscular junction. Reduces expression wrinkle depth by up to 63%.',
    benefits: [
      'Reduces expression wrinkle depth up to 63%',
      'More potent than Argireline',
      'Non-invasive botox alternative',
      'Improved skin smoothness',
      'Compatible with other skincare actives'
    ],
    athleteBenefits: [
      'Skin recovery from sun/wind exposure',
      'Anti-aging for outdoor athletes',
      'Non-systemic (topical only)'
    ],
    risks: [
      'Topical irritation in sensitive skin',
      'Effectiveness varies by formulation',
      'No systemic effects'
    ],
    dosing: {
      beginner: '3% topical solution 1x/day',
      intermediate: '5% topical solution 2x/day',
      advanced: '10% topical solution 2x/day',
      athlete: '5% topical solution 1x/day'
    },
    frequency: 'Daily (topical)',
    recommendedDuration: 'Continuous use; results build over 4-8 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 365,
      breakDays: 0,
      restartAdvice: 'No cycling needed. Continuous topical use is safe.',
      breakAdvice: [
        'Maintain moisturizing routine',
        'Use sunscreen daily',
        'Consider retinol during breaks',
        'Stay hydrated for skin health'
      ]
    },
    administration: 'Topical',
    expectedResults: {
      week1_2: 'Subtle smoothing of fine lines',
      week3_4: 'Visible reduction in expression wrinkles',
      week5_8: 'Up to 63% wrinkle depth reduction',
      longTerm: 'Sustained anti-wrinkle effects with continued use'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'SNAP8-1G',
      price: 28,
      stock: 'in-stock'
    },
    references: ['PMID: 20098710'],
    aminoAcidSequence: 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2',
    bioavailability: 'Topical penetration (stratum corneum)',
    storageRequirements: 'Store at room temperature, protect from heat',
    legalStatus: {
      usa: 'research-only',
      eu: 'Cosmetic ingredient (INCI listed)',
      australia: 'Cosmetic ingredient'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'For external/topical use only',
      'Patch test before first use',
      'Not a substitute for injectable neurotoxins'
    ]
  },
  {
    id: 'argireline',
    name: 'Argireline (Acetyl Hexapeptide-3)',
    shortName: 'Argireline',
    category: 'skin-hair',
    molecularWeight: '888.97 Da',
    halfLife: '~8 hours (topical)',
    longevityScore: 4,
    mechanism: 'A hexapeptide that mimics the N-terminal end of SNAP-25, competing for position in the SNARE complex. Destabilizes the SNARE complex formation, reducing vesicle docking and neurotransmitter release at the neuromuscular junction. This attenuates muscle contraction, reducing expression wrinkle depth by up to 30%.',
    benefits: [
      'Reduces expression wrinkles up to 30%',
      'Non-invasive botox alternative',
      'Extensively studied cosmetic peptide',
      'Good safety profile',
      'Compatible with most skincare routines'
    ],
    athleteBenefits: [
      'Anti-aging skin protection',
      'Non-systemic topical use',
      'Recovery from environmental skin damage'
    ],
    risks: [
      'Lower potency than SNAP-8',
      'Mild tingling in some users',
      'Results require consistent use'
    ],
    dosing: {
      beginner: '5% topical solution 1x/day',
      intermediate: '10% topical solution 2x/day',
      advanced: '10% topical solution 2x/day',
      athlete: '5% topical solution 1x/day'
    },
    frequency: 'Daily (topical)',
    recommendedDuration: 'Continuous use; visible effects within 2-4 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 365,
      breakDays: 0,
      restartAdvice: 'No cycling needed. Safe for continuous topical use.',
      breakAdvice: [
        'Use retinoids and vitamin C during breaks',
        'Maintain sunscreen routine',
        'Stay hydrated',
        'Consider other anti-aging actives'
      ]
    },
    administration: 'Topical',
    expectedResults: {
      week1_2: 'Mild smoothing of fine lines',
      week3_4: 'Noticeable wrinkle reduction',
      week5_8: 'Up to 30% wrinkle depth reduction',
      longTerm: 'Maintained anti-wrinkle effects'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'ARGI-1G',
      price: 22,
      stock: 'in-stock'
    },
    references: ['PMID: 12062883'],
    aminoAcidSequence: 'Ac-Glu-Glu-Met-Gln-Arg-Arg-NH2',
    bioavailability: 'Topical penetration',
    storageRequirements: 'Store at room temperature, protect from heat and light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Cosmetic ingredient (INCI listed)',
      australia: 'Cosmetic ingredient'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'For external/topical use only',
      'Patch test recommended for sensitive skin',
      'Effects reverse upon discontinuation'
    ],
    notableStudies: [
      {
        title: 'Argireline anti-wrinkle efficacy study',
        year: 2002,
        finding: 'Reduced wrinkle depth by 30% in 30 days of topical application at 10%',
        doi: '10.1016/S0223-5234(02)01378-X'
      }
    ]
  },
  {
    id: 'ghk',
    name: 'GHK (Glycyl-L-Histidyl-L-Lysine)',
    shortName: 'GHK',
    category: 'skin-hair',
    molecularWeight: '340.38 Da',
    halfLife: '~2 hours',
    longevityScore: 7,
    mechanism: 'A tripeptide naturally found in human plasma, saliva, and urine. Concentration declines with age. Regulates over 4,000 genes, with 31.2% of genes upregulated being those involved in tissue remodeling and wound healing. Stimulates collagen synthesis, decorin, and glycosaminoglycans. Anti-inflammatory via NF-κB suppression.',
    benefits: [
      'Stimulates collagen and elastin synthesis',
      'Regulates 4,000+ human genes',
      'Potent wound healing properties',
      'Anti-inflammatory effects',
      'Promotes hair growth',
      'Antioxidant gene expression'
    ],
    athleteBenefits: [
      'Accelerated wound healing',
      'Skin and tissue repair from training',
      'Joint health support via GAG production',
      'Anti-inflammatory recovery'
    ],
    risks: [
      'Well-tolerated in research',
      'Mild redness at injection site',
      'Few reported side effects'
    ],
    dosing: {
      beginner: '50mg topical cream daily',
      intermediate: '100-200mcg subcutaneous daily',
      advanced: '500mcg subcutaneous daily',
      athlete: '200mcg subcutaneous daily'
    },
    frequency: 'Daily',
    recommendedDuration: '4-12 weeks',
    cycleProtocol: {
      minDays: 28,
      maxDays: 84,
      breakDays: 14,
      restartAdvice: 'Short break then resume. Very safe peptide for extended use.',
      breakAdvice: [
        'Use topical GHK-Cu products during break',
        'Maintain vitamin C intake for collagen support',
        'Continue skin protection with SPF',
        'Support with zinc and copper-rich foods'
      ]
    },
    administration: 'Subcutaneous injection or topical',
    expectedResults: {
      week1_2: 'Improved skin texture and hydration',
      week3_4: 'Visible skin tightening and glow',
      week5_8: 'Significant collagen improvement, wound healing',
      longTerm: 'Sustained anti-aging, hair, and tissue benefits'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'GHK-1G',
      price: 30,
      stock: 'in-stock'
    },
    references: ['PMID: 24508075'],
    aminoAcidSequence: 'Gly-His-Lys',
    bioavailability: 'Good (subcutaneous), Moderate (topical)',
    storageRequirements: 'Store at 2-8°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Cosmetic ingredient (topical)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Copper-free version — differs from GHK-Cu',
      'Monitor copper status if combining with GHK-Cu',
      'Very safe based on available data'
    ],
    notableStudies: [
      {
        title: 'GHK gene expression and tissue remodeling',
        year: 2014,
        finding: 'Upregulated 31.2% of genes involved in wound healing and tissue remodeling',
        doi: '10.1016/j.gene.2014.02.016'
      }
    ]
  },
  {
    id: 'palmitoyl-pentapeptide-4',
    name: 'Palmitoyl Pentapeptide-4 (Matrixyl)',
    shortName: 'Matrixyl',
    category: 'skin-hair',
    molecularWeight: '802.05 Da',
    halfLife: '~6 hours (topical)',
    longevityScore: 5,
    mechanism: 'A lipopeptide that stimulates the production of collagen I, III, and IV, fibronectin, and glycosaminoglycans in the dermal extracellular matrix. Acts as a matrikine — a small peptide fragment that signals the skin to produce new collagen and repair the dermal matrix. Palmitoyl group enhances skin penetration.',
    benefits: [
      'Stimulates collagen I, III, IV production',
      'Reduces wrinkle depth and volume',
      'Improves skin firmness and elasticity',
      'Non-irritating alternative to retinoids',
      'Well-established safety profile'
    ],
    athleteBenefits: [
      'Skin repair from environmental exposure',
      'Anti-aging without systemic effects',
      'Compatible with active lifestyle'
    ],
    risks: [
      'Very few side effects reported',
      'Rare skin sensitivity',
      'Slower results than injectable peptides'
    ],
    dosing: {
      beginner: '2% topical cream 1x/day',
      intermediate: '4% topical cream 2x/day',
      advanced: '4% topical serum 2x/day',
      athlete: '2% topical cream 1x/day'
    },
    frequency: 'Daily (topical)',
    recommendedDuration: 'Continuous use; results visible in 2-4 months',
    cycleProtocol: {
      minDays: 60,
      maxDays: 365,
      breakDays: 0,
      restartAdvice: 'No cycling needed. Safe for continuous topical use.',
      breakAdvice: [
        'Use retinol or vitamin C serums',
        'Maintain SPF protection',
        'Keep skin hydrated',
        'Continue with a basic anti-aging routine'
      ]
    },
    administration: 'Topical',
    expectedResults: {
      week1_2: 'Improved skin hydration',
      week3_4: 'Subtle texture improvement',
      week5_8: 'Visible firmness improvement',
      longTerm: 'Significant wrinkle reduction (up to 36% in studies)'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'MATRX-1G',
      price: 25,
      stock: 'in-stock'
    },
    references: ['PMID: 15675889'],
    aminoAcidSequence: 'Pal-Lys-Thr-Thr-Lys-Ser',
    bioavailability: 'Good topical penetration (palmitoyl enhances delivery)',
    storageRequirements: 'Store at room temperature, protect from heat',
    legalStatus: {
      usa: 'research-only',
      eu: 'Cosmetic ingredient (INCI listed)',
      australia: 'Cosmetic ingredient'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'For external/topical use only',
      'May take 2-4 months for visible results',
      'Less effective than injectable peptides for deep wrinkles'
    ],
    notableStudies: [
      {
        title: 'Matrixyl anti-wrinkle clinical study',
        year: 2005,
        finding: 'Reduced wrinkle depth by 36% and wrinkle volume by 27% over 4 months',
        doi: '10.1111/j.1468-2494.2005.00220.x'
      }
    ]
  },
  {
    id: 'copper-peptide-ahk',
    name: 'AHK-Cu (Alanyl-Histidyl-Lysyl Copper)',
    shortName: 'AHK-Cu',
    category: 'skin-hair',
    molecularWeight: '~420 Da',
    halfLife: '~3 hours',
    longevityScore: 5,
    mechanism: 'A copper-binding tripeptide that stimulates hair follicle growth by increasing follicle size and proliferation of dermal papilla cells. Activates the Wnt/β-catenin signaling pathway essential for hair follicle morphogenesis and cycling. Also promotes VEGF expression for follicular vascularization.',
    benefits: [
      'Stimulates hair follicle growth',
      'Increases dermal papilla cell proliferation',
      'Activates Wnt/β-catenin pathway',
      'Promotes follicular vascularization via VEGF',
      'May reverse miniaturization of hair follicles'
    ],
    athleteBenefits: [
      'Hair preservation during hormonal stress',
      'Scalp health support',
      'Non-systemic topical application'
    ],
    risks: [
      'Limited clinical data',
      'Scalp irritation possible',
      'Results vary significantly'
    ],
    dosing: {
      beginner: '1% topical solution daily',
      intermediate: '3% topical solution daily',
      advanced: '5% topical solution daily',
      athlete: '1-3% topical solution daily'
    },
    frequency: 'Daily (topical to scalp)',
    recommendedDuration: '3-6 months for visible results',
    cycleProtocol: {
      minDays: 90,
      maxDays: 180,
      breakDays: 14,
      restartAdvice: 'Continuous use recommended for hair growth. Brief breaks acceptable.',
      breakAdvice: [
        'Continue biotin and zinc supplementation',
        'Use gentle, sulfate-free shampoo',
        'Scalp massage to promote circulation',
        'Consider minoxidil during breaks'
      ]
    },
    administration: 'Topical (scalp)',
    expectedResults: {
      week1_2: 'Reduced hair shedding',
      week3_4: 'Improved scalp health',
      week5_8: 'Early signs of new growth',
      longTerm: 'Visible hair regrowth and thickening'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'AHKCU-500MG',
      price: 35,
      stock: 'in-stock'
    },
    references: ['PMID: 17907165'],
    aminoAcidSequence: 'Ala-His-Lys-Cu',
    bioavailability: 'Topical (scalp penetration)',
    storageRequirements: 'Store at 2-8°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Cosmetic ingredient',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Topical use only',
      'Results highly individual',
      'Monitor copper levels if combining with GHK-Cu'
    ]
  },
  {
    id: 'epithalon-nasal',
    name: 'N-Acetyl Epitalon Amidate',
    shortName: 'NAEA',
    category: 'longevity',
    molecularWeight: '~475 Da',
    halfLife: '~2 hours (intranasal)',
    longevityScore: 9,
    mechanism: 'An enhanced bioavailable form of Epitalon with N-acetylation and C-terminal amidation modifications. These modifications increase resistance to enzymatic degradation and improve blood-brain barrier penetration. Retains telomerase-activating properties with enhanced CNS bioavailability.',
    benefits: [
      'Enhanced bioavailability over standard Epitalon',
      'Telomerase activation',
      'Improved BBB penetration',
      'Melatonin regulation',
      'Anti-aging effects'
    ],
    athleteBenefits: [
      'Non-injectable administration',
      'Improved sleep quality',
      'Cellular rejuvenation',
      'Convenient intranasal dosing'
    ],
    risks: [
      'Very limited human data',
      'Nasal irritation possible',
      'Novel compound with unknown long-term effects'
    ],
    dosing: {
      beginner: '1mg intranasal daily',
      intermediate: '3mg intranasal daily',
      advanced: '5mg intranasal daily',
      athlete: '3mg intranasal daily'
    },
    frequency: 'Daily for 20-day cycles',
    recommendedDuration: '20-day cycles, 2-3x per year',
    cycleProtocol: {
      minDays: 10,
      maxDays: 20,
      breakDays: 120,
      restartAdvice: 'Run short cycles 2-3x per year like standard Epitalon.',
      breakAdvice: [
        'Support telomere health with astragalus and resveratrol',
        'Maintain consistent sleep schedule',
        'Continue exercise for natural telomerase stimulation',
        'Track sleep quality metrics'
      ]
    },
    administration: 'Intranasal spray',
    expectedResults: {
      week1_2: 'Improved sleep quality',
      week3_4: 'N/A (short cycle)',
      week5_8: 'N/A (short cycle)',
      longTerm: 'Telomere maintenance, anti-aging effects'
    },
    janoshikTested: false,
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'NAEA-50MG',
      price: 95,
      stock: 'low-stock'
    },
    references: ['PMID: 40908429'],
    bioavailability: 'Enhanced (intranasal with modified peptide)',
    storageRequirements: 'Store at -20°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'Not scheduled (research)'
    },
    clinicalStatus: 'preclinical',
    fdaApproved: false,
    warnings: [
      'Novel modification — very limited data',
      'Not interchangeable with standard Epitalon dosing',
      'Avoid with nasal conditions'
    ]
  },
  {
    id: 'peptide-aod9604',
    name: 'AOD-9604',
    shortName: 'AOD',
    category: 'weight-loss',
    molecularWeight: '1817.12 Da',
    halfLife: '~1 hour',
    longevityScore: 5,
    mechanism: 'A modified fragment of human growth hormone (hGH fragment 176-191) with an additional tyrosine at the N-terminus. Stimulates lipolysis and inhibits lipogenesis without the diabetogenic effects of full-length hGH. Acts on beta-3 adrenergic receptors in adipose tissue.',
    benefits: [
      'Targeted fat metabolism without GH side effects',
      'No effect on blood sugar or insulin',
      'Anti-lipogenic properties',
      'GRAS status for food use',
      'Does not affect growth or IGF-1'
    ],
    athleteBenefits: [
      'Fat-specific weight loss',
      'No muscle-wasting effects',
      'Safe for anti-doping (not listed)',
      'Targeted abdominal fat reduction'
    ],
    risks: [
      'Modest efficacy compared to GLP-1 agonists',
      'Injection site reactions',
      'Limited clinical trial success'
    ],
    dosing: {
      beginner: '250mcg daily',
      intermediate: '300mcg daily',
      advanced: '500mcg daily',
      athlete: '300mcg daily'
    },
    frequency: 'Daily (fasted, morning)',
    recommendedDuration: '8-12 weeks',
    cycleProtocol: {
      minDays: 56,
      maxDays: 84,
      breakDays: 21,
      restartAdvice: 'Take 3-week break between cycles. Best combined with exercise.',
      breakAdvice: [
        'Maintain caloric deficit',
        'Continue fasted cardio',
        'Focus on high-protein diet',
        'Monitor body composition changes'
      ]
    },
    administration: 'Subcutaneous injection',
    expectedResults: {
      week1_2: 'Subtle fat mobilization',
      week3_4: 'Mild fat loss beginning',
      week5_8: 'Moderate fat reduction',
      longTerm: 'Targeted fat loss with diet/exercise'
    },
    janoshikTested: true,
    janoshikPurity: 98.5,
    janoshikDate: '2024-09-15',
    supplier: {
      name: 'ZZTai-Tech',
      productCode: 'AOD-5MG',
      price: 32,
      stock: 'in-stock'
    },
    references: ['PMID: 11713213'],
    aminoAcidSequence: 'Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe',
    bioavailability: 'Moderate (subcutaneous)',
    storageRequirements: 'Store at 2-8°C, protect from light',
    legalStatus: {
      usa: 'research-only',
      eu: 'Not regulated (research)',
      australia: 'TGA approved (GRAS for food)'
    },
    clinicalStatus: 'phase2',
    fdaApproved: false,
    warnings: [
      'Modest efficacy as standalone',
      'Best combined with diet and exercise',
      'Does not replace proper nutrition'
    ],
    notableStudies: [
      {
        title: 'AOD-9604 lipolytic activity',
        year: 2001,
        finding: 'Stimulated lipolysis and inhibited lipogenesis without affecting IGF-1 or insulin',
        doi: '10.1038/sj.ijo.0801864'
      }
    ]
  }
];
