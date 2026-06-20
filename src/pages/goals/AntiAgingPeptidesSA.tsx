import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'anti-aging-peptides-south-africa',
  title: 'Anti-Aging Peptides South Africa — Epitalon, GHK-Cu & Thymosin Alpha-1 Research',
  description:
    'Research-grade anti-aging peptides studied in South Africa: Epitalon, GHK-Cu and Thymosin Alpha-1. Telomere, gene expression and immune senescence mechanisms with SAHPRA legal context.',
  h1: 'Anti-Aging Peptides South Africa',
  tagline:
    'Telomere maintenance, gene expression reprogramming and immune senescence reversal — three mechanistic pillars of peptide-based anti-aging research, with the molecules most commonly studied by South African researchers.',
  badge: 'Anti-Aging',
  badgeClass: 'text-green-400 bg-green-500/10',
  paragraphs: [
    'Epitalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) developed by Vladimir Khavinson at the St. Petersburg Institute of Bioregulation and Gerontology. Across multi-decade Russian studies it has been associated with extended telomere length in somatic cells, normalisation of the pineal melatonin rhythm, and reductions in age-related mortality markers in elderly cohorts. It is typically researched in short 10–20 day cycles, 1–2 times per year, rather than continuously — a profile that distinguishes it from continuously-dosed peptide protocols.',
    'GHK-Cu is a copper-binding tripeptide (Gly-His-Lys) present in human plasma that declines sharply from a young-adult baseline of ~200 ng/mL to ~80 ng/mL by age 60. Genomic research by Pickart and colleagues shows GHK-Cu modulates expression of over 4,000 human genes toward a younger profile, including upregulation of DNA repair, antioxidant and collagen-synthesis pathways. It is one of the few peptides with direct evidence of broad transcriptomic reprogramming in cultured human cells.',
    'Thymosin Alpha-1 (Tα1) is a 28-amino-acid peptide secreted by the thymus that drives T-cell maturation and modulates innate and adaptive immunity. As the thymus involutes with age, endogenous Tα1 falls and immune surveillance against malignancy and infection declines — a hallmark of immunosenescence. Tα1 is approved as a pharmaceutical (Zadaxin) in over 35 countries for chronic hepatitis B and as an immunoadjuvant; in research settings it is studied for its potential to restore the immune competence lost with age.',
  ],
  peptideIds: ['epitalon', 'ghkcu', 'ta1'],
};

export default function AntiAgingPeptidesSA() {
  return <GoalPage config={config} />;
}
