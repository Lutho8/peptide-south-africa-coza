import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'weight-loss-peptides-south-africa',
  title: 'Peptides for Weight Loss South Africa — Retatrutide, Tirzepatide, Semaglutide & MOTS-c',
  description:
    'Research overview of weight loss peptides studied in South Africa: retatrutide, tirzepatide, semaglutide and MOTS-c. Mechanisms, half-lives and SAHPRA legal context for researchers.',
  h1: 'Peptides for Weight Loss South Africa',
  tagline:
    'A research-focused overview of GLP-1, GIP and glucagon receptor agonists most commonly studied by South African biohackers and clinicians.',
  badge: 'Weight Loss',
  badgeClass: 'text-purple-400 bg-purple-500/10',
  paragraphs: [
    'GLP-1 receptor agonists like semaglutide have transformed obesity research over the last five years. In the STEP trials, weekly subcutaneous semaglutide produced an average ~15% reduction in body weight at 68 weeks versus ~2.4% on placebo, by slowing gastric emptying and reducing appetite via hypothalamic GLP-1 receptors. In South Africa, semaglutide is dispensed pharmaceutically as Ozempic and Wegovy, but research-grade material is the same molecule sold for laboratory study only.',
    'Tirzepatide is a dual GIP/GLP-1 agonist; in SURMOUNT-1 the 15 mg weekly dose drove ~22.5% mean weight loss at 72 weeks — meaningfully greater than semaglutide. Retatrutide takes this further as a triple GIP/GLP-1/glucagon agonist currently in Phase 3, with Phase 2 data showing ~24% weight loss at 48 weeks. The added glucagon agonism is hypothesised to increase resting energy expenditure on top of appetite suppression.',
    'MOTS-c sits in a different category: it is a 16-amino-acid mitochondrial-derived peptide that activates AMPK, improves insulin sensitivity, and supports metabolic flexibility independent of the GLP-1 axis. It is typically researched alongside (not instead of) the incretin-class peptides above where the goal is body recomposition rather than weight on a scale alone.',
  ],
  peptideIds: ['retatrutide', 'tirzepatide', 'motsc', 'semaglutide'],
};

export default function WeightLossPeptidesSA() {
  return <GoalPage config={config} />;
}
