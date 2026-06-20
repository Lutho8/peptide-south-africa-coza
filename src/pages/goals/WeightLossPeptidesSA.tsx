import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'weight-loss-peptides-south-africa',
  title: 'Weight Loss Peptides South Africa — Semaglutide, Tirzepatide & Retatrutide Research',
  description:
    'Compare GLP-1, dual and triple agonist research peptides used in South Africa for fat loss: semaglutide, tirzepatide, retatrutide, AOD-9604 and MOTS-c. Dosing, half-life and SAHPRA legal context.',
  h1: 'Weight Loss Peptides in South Africa',
  tagline:
    'A research-focused overview of GLP-1, GIP and glucagon receptor agonists most commonly studied by South African biohackers and clinicians.',
  badge: 'Weight Loss',
  badgeClass: 'text-purple-400 bg-purple-500/10',
  paragraphs: [
    'GLP-1 receptor agonists like semaglutide have transformed obesity research over the last five years. In the STEP trials, weekly subcutaneous semaglutide produced an average ~15% reduction in body weight at 68 weeks versus ~2.4% on placebo, by slowing gastric emptying and reducing appetite via hypothalamic GLP-1 receptors. In South Africa, semaglutide is dispensed pharmaceutically as Ozempic and Wegovy, but research-grade material is the same molecule sold for laboratory study only.',
    'Tirzepatide is a dual GIP/GLP-1 agonist; in SURMOUNT-1 the 15 mg weekly dose drove ~22.5% mean weight loss at 72 weeks — meaningfully greater than semaglutide. Retatrutide takes this further as a triple GIP/GLP-1/glucagon agonist currently in Phase 3, with Phase 2 data showing ~24% weight loss at 48 weeks. The added glucagon agonism is hypothesised to increase resting energy expenditure on top of appetite suppression.',
    'AOD-9604 and MOTS-c sit in a different category: AOD-9604 is a modified C-terminal fragment of human growth hormone studied for lipolysis without GH-like growth effects, while MOTS-c is a mitochondrial-derived peptide that improves insulin sensitivity and metabolic flexibility. Both are typically researched alongside (not instead of) GLP-1 class peptides where the goal is body recomposition rather than weight on a scale.',
  ],
  peptideIds: ['semaglutide', 'tirzepatide', 'retatrutide', 'aod9604', 'motsc'],
};

export default function WeightLossPeptidesSA() {
  return <GoalPage config={config} />;
}
