import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'healing-peptides-south-africa',
  title: 'Peptides for Healing South Africa — BPC-157, TB-500 & GHK-Cu Research',
  description:
    'Research-grade healing peptides studied in South Africa: BPC-157, TB-500 and GHK-Cu. Mechanisms, half-lives, recovery applications and SAHPRA legal status for researchers.',
  h1: 'Peptides for Healing South Africa',
  tagline:
    'BPC-157, TB-500 and GHK-Cu are the most-studied regenerative peptides in South African research communities. Here is what current literature shows.',
  badge: 'Healing',
  badgeClass: 'text-red-400 bg-red-500/10',
  paragraphs: [
    'BPC-157 (Body Protection Compound) is a 15-amino-acid pentadecapeptide derived from a sequence in human gastric juice. In animal models it accelerates tendon-to-bone and ligament healing, upregulates VEGF expression, and protects gut mucosa against NSAID damage. It is the most commonly researched recovery peptide among South African strength athletes recovering from soft-tissue injury, typically alongside TB-500 for synergistic angiogenic effects.',
    'TB-500 (a synthetic fragment of Thymosin Beta-4) increases actin sequestration and promotes cell migration into injury sites, driving the formation of new blood vessels. The TB-500 / BPC-157 stack is well-documented in equine veterinary literature, where both peptides are widely used in racing recovery. Half-lives differ markedly — BPC-157 is short-acting (~4 hours systemic), TB-500 has a much longer functional duration through its actin-binding domain.',
    'GHK-Cu is a copper-binding tripeptide present in human plasma that declines sharply with age. Research shows it modulates over 4,000 human genes toward a younger expression profile, stimulating collagen, glycosaminoglycan and decorin synthesis. While most often associated with skin and hair work, GHK-Cu has measurable wound-healing and connective-tissue remodelling effects that pair well with BPC-157 and TB-500 in soft-tissue recovery research.',
  ],
  peptideIds: ['bpc157', 'tb500', 'ghkcu'],
};

export default function HealingPeptidesSA() {
  return <GoalPage config={config} />;
}
