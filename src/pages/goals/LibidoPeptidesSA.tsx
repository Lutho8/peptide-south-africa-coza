import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'libido-peptides-south-africa',
  title: 'PT-141 South Africa — Bremelanotide Libido Peptide Research',
  description:
    'Research overview of PT-141 (bremelanotide) in South Africa: melanocortin MC4R agonism, central libido mechanism, dosing, side-effect profile and SAHPRA legal context.',
  h1: 'PT-141 South Africa',
  tagline:
    'Bremelanotide (PT-141) acts centrally on melanocortin receptors — a mechanism distinct from the vascular action of PDE5 inhibitors like sildenafil and tadalafil.',
  badge: 'Libido',
  badgeClass: 'text-pink-400 bg-pink-500/10',
  paragraphs: [
    'PT-141 (bremelanotide) is a synthetic cyclic heptapeptide derived from melanotan II. Its primary mechanism is agonism at the melanocortin-4 receptor (MC4R) in the central nervous system, particularly in the hypothalamus, which drives arousal and sexual desire through neural rather than vascular pathways. This distinguishes it sharply from PDE5 inhibitors — PT-141 acts on libido and arousal upstream of erectile mechanics, not on vascular smooth muscle.',
    'Bremelanotide is FDA-approved under the brand Vyleesi for hypoactive sexual desire disorder (HSDD) in pre-menopausal women, dosed as a 1.75 mg subcutaneous autoinjector at least 45 minutes before anticipated activity, with a maximum of one dose per 24 hours and eight per month. The Phase 3 RECONNECT trials reported statistically significant improvements in desire and reduced distress versus placebo. Research-grade PT-141 is the same molecule sold for laboratory study only.',
    'Side-effect profile is dose-dependent and well-characterised: transient nausea is the most common (~40% in trials, usually mild and resolving within a few hours), along with facial flushing, headache and small transient blood-pressure elevation. Researchers studying lower research doses often start well below the Vyleesi label dose to gauge nausea threshold. PT-141 is not SAHPRA-approved for human use in South Africa; it is studied as a research compound only.',
  ],
  peptideIds: ['pt141'],
};

export default function LibidoPeptidesSA() {
  return <GoalPage config={config} />;
}
