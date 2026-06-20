import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'growth-hormone-peptides-south-africa',
  title: 'Growth Hormone Peptides South Africa — Ipamorelin & CJC-1295 Research',
  description:
    'Research-grade GH-axis peptides studied in South Africa: Ipamorelin and CJC-1295. Selective GHRP and GHRH analog mechanisms, pulsatile-restoration rationale and SAHPRA legal context.',
  h1: 'Growth Hormone Peptides South Africa',
  tagline:
    'Restoring the pulsatile GH/IGF-1 pattern that flattens with age — without the cortisol, prolactin or appetite side effects of older GHRPs.',
  badge: 'Growth Hormone',
  badgeClass: 'text-yellow-400 bg-yellow-500/10',
  paragraphs: [
    'Ipamorelin is a pentapeptide GH-releasing peptide (GHRP) developed by Novo Nordisk in the late 1990s as a more selective successor to GHRP-2 and GHRP-6. It binds the ghrelin receptor (GHS-R1a) on pituitary somatotrophs to trigger a clean GH pulse, but unlike older GHRPs it does not meaningfully elevate cortisol, prolactin, ACTH or appetite at research doses. This selectivity is the main reason it has become the default GHRP in modern peptide research stacks.',
    'CJC-1295 is a synthetic 30-amino-acid GHRH analog. Two variants exist: the unmodified peptide (often called Mod-GRF 1-29) with a half-life under 30 minutes, and CJC-1295 with DAC (Drug Affinity Complex), which covalently binds to serum albumin and extends the half-life to roughly 6–8 days. The DAC version produces a sustained GH/IGF-1 elevation; the no-DAC version preserves a pulsatile pattern closer to native physiology.',
    'The standard research rationale for stacking Ipamorelin + CJC-1295 (no-DAC) is that the GHRH analog primes the somatotrophs while the GHRP triggers release — producing a GH pulse larger than either peptide alone, while still preserving the pulsatile rhythm that continuous infusion (or DAC variants) disrupts. Typical research timing is pre-sleep to align with the body\'s natural overnight GH peak.',
  ],
  peptideIds: ['ipamorelin', 'cjc1295'],
};

export default function GrowthHormonePeptidesSA() {
  return <GoalPage config={config} />;
}
