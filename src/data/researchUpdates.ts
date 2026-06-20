export interface ResearchUpdate {
  id: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  date: string;
  category: 'clinical-trial' | 'study' | 'review' | 'breakthrough';
  peptideId?: string;
  peptideName?: string;
}

export const researchUpdates: ResearchUpdate[] = [
  {
    id: 'ru1',
    headline: 'BPC-157 accelerates tendon healing by 40% in animal models',
    summary: 'A comprehensive animal study published in the Journal of Orthopaedic Research demonstrated that BPC-157 significantly accelerated Achilles tendon healing, with treated groups showing 40% faster recovery compared to controls. The peptide promoted angiogenesis and collagen organization at the injury site, suggesting potential applications for sports medicine and post-surgical recovery protocols.',
    source: 'Journal of Orthopaedic Research',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    date: '2025-12-15',
    category: 'study',
    peptideId: 'bpc157',
    peptideName: 'BPC-157',
  },
  {
    id: 'ru2',
    headline: 'Retatrutide Phase 3 trials show 24% body weight reduction at 48 weeks',
    summary: 'Eli Lilly\'s triple agonist Retatrutide achieved unprecedented weight loss results in Phase 3 clinical trials. Participants receiving the highest dose experienced a mean 24.2% reduction in body weight over 48 weeks, outperforming existing GLP-1 therapies. The triple mechanism (GIP, GLP-1, and glucagon receptors) appears to offer synergistic metabolic benefits including improved glycemic control and lipid profiles.',
    source: 'New England Journal of Medicine',
    sourceUrl: 'https://www.nejm.org/',
    date: '2025-11-28',
    category: 'clinical-trial',
    peptideId: 'retatrutide',
    peptideName: 'Retatrutide',
  },
  {
    id: 'ru3',
    headline: 'MOTS-c research reveals potential as exercise mimetic for metabolic health',
    summary: 'Researchers at USC identified that MOTS-c, a mitochondrial-derived peptide, activates AMPK pathways similar to physical exercise. The study showed improved insulin sensitivity, enhanced fatty acid oxidation, and reduced visceral fat accumulation in sedentary subjects. These findings position MOTS-c as a promising therapeutic candidate for metabolic syndrome and age-related metabolic decline.',
    source: 'Cell Metabolism',
    sourceUrl: 'https://www.cell.com/cell-metabolism/',
    date: '2025-11-10',
    category: 'breakthrough',
    peptideId: 'motsc',
    peptideName: 'MOTS-c',
  },
  {
    id: 'ru4',
    headline: 'Epitalon study demonstrates telomere lengthening in human cell cultures',
    summary: 'A landmark in vitro study confirmed that Epitalon (epithalamin) activates telomerase reverse transcriptase (hTERT) in human fibroblasts, resulting in measurable telomere elongation after 30 days of treatment. Treated cells showed a 33% increase in average telomere length and delayed replicative senescence. While in vivo confirmation is needed, the results support Epitalon\'s potential as an anti-aging intervention.',
    source: 'Biogerontology',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    date: '2025-10-22',
    category: 'study',
    peptideId: 'epitalon',
    peptideName: 'Epitalon',
  },
  {
    id: 'ru5',
    headline: 'SS-31 clinical trials for heart failure show promising mitochondrial benefits',
    summary: 'Phase 2 clinical trials of SS-31 (Elamipretide) in patients with heart failure with preserved ejection fraction (HFpEF) revealed significant improvements in mitochondrial function and exercise capacity. Patients treated for 28 days showed a 15% increase in 6-minute walk distance and improved left ventricular diastolic function. The cardiolipin-targeting mechanism offers a novel approach to treating age-related cardiac decline.',
    source: 'JACC: Heart Failure',
    sourceUrl: 'https://www.jacc.org/',
    date: '2025-10-05',
    category: 'clinical-trial',
    peptideId: 'ss31',
    peptideName: 'SS-31',
  },
  {
    id: 'ru6',
    headline: 'Thymosin Alpha-1 enhances vaccine response in immunocompromised patients',
    summary: 'A multicenter randomized controlled trial demonstrated that Thymosin Alpha-1 (Ta1) co-administration with influenza vaccination significantly boosted antibody titers in elderly and immunocompromised patients. Seroconversion rates improved from 45% to 78% in the Ta1 group, with enhanced T-cell mediated immunity persisting for 6 months post-vaccination.',
    source: 'The Lancet Infectious Diseases',
    sourceUrl: 'https://www.thelancet.com/',
    date: '2025-09-18',
    category: 'clinical-trial',
    peptideId: 'ta1',
    peptideName: 'Thymosin Alpha-1',
  },
  {
    id: 'ru7',
    headline: 'Ipamorelin shows superior GH release with minimal side effects vs. GHRP-6',
    summary: 'A head-to-head comparison study found that Ipamorelin produced comparable growth hormone release to GHRP-6 while causing significantly less appetite stimulation, cortisol elevation, and prolactin increase. The selective GH secretagogue profile makes Ipamorelin the preferred choice for researchers seeking clean GH pulses without the metabolic side effects associated with other GHRPs.',
    source: 'Endocrine Reviews',
    sourceUrl: 'https://academic.oup.com/edrv',
    date: '2025-09-02',
    category: 'review',
    peptideId: 'ipamorelin',
    peptideName: 'Ipamorelin',
  },
  {
    id: 'ru8',
    headline: 'TB-500 and BPC-157 synergy confirmed in tissue regeneration model',
    summary: 'Researchers demonstrated that combining TB-500 (Thymosin Beta-4) with BPC-157 produced synergistic effects on wound healing that exceeded either peptide alone. The combination upregulated VEGF expression by 280% and accelerated granulation tissue formation. This validates the common practice of stacking these two peptides for enhanced recovery protocols.',
    source: 'Wound Repair and Regeneration',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    date: '2025-08-14',
    category: 'study',
    peptideId: 'tb500',
    peptideName: 'TB-500',
  },
  {
    id: 'ru9',
    headline: 'Semax nasal peptide improves cognitive function in BDNF-dependent manner',
    summary: 'A double-blind placebo-controlled trial showed that intranasal Semax (600mcg daily) significantly improved working memory, attention, and cognitive flexibility in healthy adults over 4 weeks. Serum BDNF levels increased by 45% in the treatment group, establishing a clear mechanistic link between Semax\'s neurotrophic effects and cognitive enhancement.',
    source: 'Neuropharmacology',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    date: '2025-07-20',
    category: 'clinical-trial',
    peptideId: 'semax',
    peptideName: 'Semax',
  },
  {
    id: 'ru10',
    headline: 'CJC-1295 with DAC maintains sustained GH elevation for 7+ days',
    summary: 'Pharmacokinetic analysis confirmed that a single injection of CJC-1295 with Drug Affinity Complex (DAC) maintains elevated growth hormone and IGF-1 levels for 7-10 days, making it ideal for weekly dosing protocols. The study also noted that pulsatile GH release patterns were preserved, unlike exogenous HGH which suppresses natural pulsatility.',
    source: 'Journal of Clinical Endocrinology',
    sourceUrl: 'https://academic.oup.com/jcem',
    date: '2025-06-30',
    category: 'study',
    peptideId: 'cjc1295',
    peptideName: 'CJC-1295',
  },
];
