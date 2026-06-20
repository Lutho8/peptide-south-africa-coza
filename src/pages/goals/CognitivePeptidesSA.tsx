import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'cognitive-peptides-south-africa',
  title: 'Cognitive Peptides South Africa — Semax, Selank & DSIP Research',
  description:
    'Research-grade nootropic peptides studied in South Africa: Semax, Selank and DSIP. BDNF/NGF upregulation, anxiolysis and delta-sleep mechanisms with SAHPRA legal context.',
  h1: 'Cognitive Peptides South Africa',
  tagline:
    'BDNF/NGF upregulation, GABA-system modulation and delta-sleep induction — the three best-characterised mechanisms in peptide nootropic research.',
  badge: 'Cognitive',
  badgeClass: 'text-blue-400 bg-blue-500/10',
  paragraphs: [
    'Semax is a synthetic heptapeptide derived from the 4–10 fragment of ACTH, originally developed at the Institute of Molecular Genetics in Moscow as a stroke and cognitive recovery agent. Its primary mechanism is robust upregulation of BDNF and NGF in the hippocampus and cortex within hours of intranasal administration, alongside modulation of the dopaminergic and serotonergic systems. Russian clinical work has documented use in post-stroke rehabilitation, optic nerve atrophy and transient ischaemic attacks.',
    'Selank is a synthetic analog of the immunomodulatory peptide tuftsin and shares much of Semax\'s pedigree. Its anxiolytic profile is comparable to benzodiazepines in animal models — but without sedation, dependence or cognitive blunting — driven by modulation of GABA-A receptor expression and serotonin/noradrenaline turnover. Researchers typically pair it with Semax for a combined "focus + calm" profile rather than either alone.',
    'DSIP (Delta Sleep-Inducing Peptide) is a nonapeptide first isolated from rabbit cerebral venous blood in 1977. Beyond its name-sake induction of delta-wave (slow-wave) sleep, research has documented neuroprotective effects against oxidative stress, modulation of the HPA axis, and reductions in stress-induced cortisol elevation. It is studied as a sleep-architecture optimiser rather than a sedative, distinct from GABAergic hypnotics.',
  ],
  peptideIds: ['semax', 'selank', 'dsip'],
};

export default function CognitivePeptidesSA() {
  return <GoalPage config={config} />;
}
