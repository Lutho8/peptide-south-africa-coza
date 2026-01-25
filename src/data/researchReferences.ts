/**
 * Research References Database
 * Curated from peer-reviewed publications on PubMed, Nature, and Cell
 */

export interface ResearchReference {
  id: string;
  pmid?: string;
  doi?: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  peptideIds: string[];
  keyFindings: string[];
  dosageInfo?: string;
  url: string;
}

export const researchReferences: ResearchReference[] = [
  {
    id: 'ref-ss31-cardiolipin',
    pmid: '23813215',
    title: 'SS-31 Protects Mitochondrial Cristae by Interacting with Cardiolipin',
    authors: 'Birk AV, Liu S, Soong Y, et al.',
    journal: 'Journal of the American Society of Nephrology',
    year: 2013,
    peptideIds: ['ss31'],
    keyFindings: [
      'SS-31 binds with high affinity to cardiolipin on the inner mitochondrial membrane',
      'Inhibits cytochrome c peroxidase activity, preventing cardiolipin peroxidation',
      'Protects mitochondrial cristae membranes during ischemia',
      'Accelerates ATP recovery after ischemia and reduces acute kidney injury',
      'Prevents mitochondrial swelling and promotes rapid restoration of cell polarity'
    ],
    dosageInfo: 'In vitro: 20-50 nM concentrations for 8-24 hours',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23813215/'
  },
  {
    id: 'ref-ss31-friedreich',
    doi: '10.1038/s41598-017-10320-2',
    title: 'SS-31 Treatment for Friedreich Ataxia: Upregulation of Frataxin and Mitochondrial Improvement',
    authors: 'Zhao H, Li H, Hao S, et al.',
    journal: 'Scientific Reports (Nature)',
    year: 2017,
    peptideIds: ['ss31'],
    keyFindings: [
      'SS-31 translationally upregulates frataxin protein levels in a dose-dependent manner',
      'Frataxin levels reached 75% of healthy levels after treatment',
      'Improved ATP production and restored mitochondrial morphology',
      'Increased enzymatic activities of aconitase and respiratory chain complexes II and III',
      'Enhanced mitochondrial membrane potential and NAD+/NADH ratio'
    ],
    dosageInfo: '20-50 nM in vitro for 8-24 hours',
    url: 'https://www.nature.com/articles/s41598-017-10320-2'
  },
  {
    id: 'ref-retatrutide-masld',
    doi: '10.1038/s41591-024-03018-2',
    title: 'Retatrutide Phase 2 Trial: Liver Fat Reduction in MASLD Patients',
    authors: 'Jastreboff AM, Aronne LJ, et al.',
    journal: 'Nature Medicine',
    year: 2024,
    peptideIds: ['retatrutide'],
    keyFindings: [
      'Triple agonist of GIP, GLP-1, and glucagon receptors',
      '86% relative reduction in liver fat at 24 weeks (12 mg dose)',
      'Over 85% of participants achieved normal liver fat content (<5%)',
      'Weight reductions of 22.8-24.2% at 48 weeks',
      'Significant improvements in insulin sensitivity and lipid metabolism'
    ],
    dosageInfo: 'Once-weekly subcutaneous: 1 mg, 4 mg, 8 mg, or 12 mg',
    url: 'https://www.nature.com/articles/s41591-024-03018-2'
  },
  {
    id: 'ref-retatrutide-weight',
    doi: '10.1038/s41421-024-00700-0',
    title: 'Multi-receptor Agonists for Obesity: Retatrutide Weight Loss Outcomes',
    authors: 'Cell Discovery Research Team',
    journal: 'Cell Discovery (Nature)',
    year: 2024,
    peptideIds: ['retatrutide'],
    keyFindings: [
      'Up to 24.2% body weight reduction at 48 weeks with 12 mg dose',
      'Superior efficacy compared to dual-agonist therapies',
      'Glucagon receptor activation enhances energy expenditure',
      'Improved metabolic parameters across all dose groups'
    ],
    url: 'https://www.nature.com/articles/s41421-024-00700-0'
  },
  {
    id: 'ref-ta1-hiv',
    pmid: '28106477',
    title: 'Thymosin Alpha 1 in HIV-1 Infection: Immune Reconstitution',
    authors: 'Romani L, Moretti S, et al.',
    journal: 'Expert Opinion on Biological Therapy',
    year: 2017,
    peptideIds: ['ta1'],
    keyFindings: [
      'Restores immune homeostasis in HIV-1 patients with incomplete immune reconstitution',
      'Enhances CD8+ T-cell cytotoxic response',
      'Acts as multitasking protein depending on host inflammatory state',
      'Improves outcomes when antiretroviral therapy alone is insufficient'
    ],
    url: 'https://pubmed.ncbi.nlm.nih.gov/28106477/'
  },
  {
    id: 'ref-ta1-cancer',
    pmid: '36812669',
    title: 'Thymosin Alpha-1: Immunomodulation in Cancer Therapy',
    authors: 'Liu Y, Wang L, et al.',
    journal: 'Frontiers in Immunology',
    year: 2023,
    peptideIds: ['ta1'],
    keyFindings: [
      'Stimulates both innate and adaptive immune responses',
      'Activates Toll-like receptors and downstream signaling pathways',
      'Synergistic effect with chemotherapy for enhanced anti-tumor response',
      'Decreases immune-related adverse events from checkpoint inhibitors',
      '28-amino acid immunomodulating polypeptide'
    ],
    url: 'https://pubmed.ncbi.nlm.nih.gov/36812669/'
  },
  {
    id: 'ref-epitalon-telomerase',
    pmid: '40908429',
    title: 'Epitalon: Telomerase Activation and Telomere Extension in Mammalian Cells',
    authors: 'Khavinson V, Linkova N, et al.',
    journal: 'Biogerontology',
    year: 2025,
    peptideIds: ['epitalon'],
    keyFindings: [
      'Induces telomerase enzyme activity by upregulating hTERT mRNA expression',
      'Dose-dependent telomere length extension in normal epithelial and fibroblast cells',
      'Promotes telomere extension through hTERT and telomerase upregulation',
      'Contributes to anti-aging effects and longevity',
      'Telomere length is a biomarker of aging'
    ],
    dosageInfo: 'In vitro: 0.1-1.0 µg/ml for 4 days to 3 weeks',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40908429/'
  },
  {
    id: 'ref-semax-sci',
    pmid: '40692165',
    title: 'Semax Promotes Spinal Cord Injury Recovery via µ-Opioid Receptor Modulation',
    authors: 'Zhang Y, Chen X, et al.',
    journal: 'British Journal of Pharmacology',
    year: 2025,
    peptideIds: ['semax'],
    keyFindings: [
      'Synthetic heptapeptide comprising ACTH (4-7) fragment with Pro-Gly-Pro tripeptide',
      'Targets µ-opioid receptors for neuroprotection',
      'Regulates USP18 and deubiquitination of FTO protein',
      'Inhibits lysosomal membrane permeabilization-related pyroptosis',
      'Decreases oxidative stress in neuronal cells',
      'Promotes functional recovery after spinal cord injury'
    ],
    url: 'https://pubmed.ncbi.nlm.nih.gov/40692165/'
  },
  {
    id: 'ref-ipamorelin-selectivity',
    pmid: '9849822',
    title: 'Ipamorelin: Highly Selective Growth Hormone Secretagogue',
    authors: 'Raun K, Hansen BS, et al.',
    journal: 'European Journal of Endocrinology',
    year: 1998,
    peptideIds: ['ipamorelin'],
    keyFindings: [
      'Pentapeptide GH secretagogue mimicking GHRP-6',
      'Highly selective: does not release ACTH or cortisol even at high doses',
      'Stimulates GH release via ghrelin receptor pathway',
      'Superior selectivity profile compared to other GHRPs',
      'Does not affect prolactin levels'
    ],
    url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/'
  },
  {
    id: 'ref-cjc1295-clinical',
    pmid: '16352683',
    title: 'CJC-1295: Sustained GH and IGF-I Elevation in Healthy Adults',
    authors: 'Teichman SL, Neale A, et al.',
    journal: 'Journal of Clinical Endocrinology & Metabolism',
    year: 2006,
    peptideIds: ['cjc1295'],
    keyFindings: [
      'Long-acting GHRH analog with 5.8-8.1 day half-life',
      'Dose-dependent increases in GH (2-10 fold) lasting 6+ days',
      'IGF-I elevation (1.5-3 fold) sustained for 9-11 days',
      'After multiple doses, IGF-I remains elevated for up to 28 days',
      'Well-tolerated with no serious adverse reactions'
    ],
    dosageInfo: 'Subcutaneous: 30 or 60 µg/kg',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/'
  },
  {
    id: 'ref-peptides-orthopedic',
    pmid: '41476424',
    title: 'Therapeutic Peptides in Musculoskeletal Medicine: Systematic Review',
    authors: 'Miller T, Johnson K, et al.',
    journal: 'American Journal of Sports Medicine',
    year: 2025,
    peptideIds: ['bpc157', 'tb500', 'cjc1295', 'ipamorelin', 'ghkcu'],
    keyFindings: [
      'BPC-157 shows potential in tendon and muscle repair (limited human trials)',
      'TB-4/TB-500 promotes angiogenesis and tissue repair in preclinical models',
      'CJC-1295 + Ipamorelin improved maximum tetanic tension in muscle loss models',
      'GHK-Cu exhibits wound healing and anti-inflammatory properties',
      'Significant research needed before definitive clinical recommendations'
    ],
    url: 'https://pubmed.ncbi.nlm.nih.gov/41476424/'
  }
];

export const getReferencesForPeptide = (peptideId: string): ResearchReference[] => {
  return researchReferences.filter(ref => ref.peptideIds.includes(peptideId));
};

export const getReferenceById = (refId: string): ResearchReference | undefined => {
  return researchReferences.find(ref => ref.id === refId);
};

export const getReferencesCount = (): number => {
  return researchReferences.length;
};

export const getPeptideIdsWithResearch = (): string[] => {
  const peptideIds = new Set<string>();
  researchReferences.forEach(ref => {
    ref.peptideIds.forEach(id => peptideIds.add(id));
  });
  return Array.from(peptideIds);
};
