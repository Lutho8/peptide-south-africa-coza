import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'longevity-peptides-south-africa',
  title: 'Longevity Peptides South Africa — Epitalon, MOTS-c, SS-31 & GHK-Cu Research',
  description:
    'Longevity and anti-ageing peptides researched in South Africa: Epitalon, MOTS-c, SS-31, GHK-Cu and Ipamorelin. Telomere, mitochondrial and GH-axis mechanisms for researchers.',
  h1: 'Longevity Peptides in South Africa',
  tagline:
    'Telomerase activation, mitochondrial repair and pulsatile GH restoration — the three mechanistic pillars of peptide-based longevity research, with the molecules South African researchers study most.',
  badge: 'Longevity',
  badgeClass: 'text-emerald-400 bg-emerald-500/10',
  paragraphs: [
    'Epitalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) developed by Vladimir Khavinson at the St. Petersburg Institute of Bioregulation and Gerontology. Across multi-decade Russian trials it has been associated with extended telomere length, normalised melatonin rhythm, and reductions in age-related mortality. It is typically researched in short 10–20 day cycles, 1–2 times per year, rather than continuously.',
    'MOTS-c and SS-31 represent the mitochondrial branch of longevity research. MOTS-c is a 16-amino-acid peptide encoded within the mitochondrial genome itself; it activates AMPK, improves insulin sensitivity in aged mice, and circulating levels decline with age in humans. SS-31 (elamipretide) selectively binds cardiolipin on the inner mitochondrial membrane, restoring electron transport chain efficiency — a mechanism distinct from caloric restriction or rapamycin.',
    'For the somatotropic axis, Ipamorelin (a selective GHRP) and CJC-1295 (a GHRH analog) are paired to restore the pulsatile GH/IGF-1 pattern that flattens with age, without the appetite or cortisol effects of older GHRPs. GHK-Cu, the copper-binding tripeptide, completes a typical longevity stack on the gene-expression and skin/connective tissue side. South African researchers should note that none of these are SAHPRA-approved for human use; all are studied as research compounds only.',
  ],
  peptideIds: ['epitalon', 'motsc', 'ss31', 'ghkcu', 'ipamorelin'],
};

export default function LongevityPeptidesSA() {
  return <GoalPage config={config} />;
}
