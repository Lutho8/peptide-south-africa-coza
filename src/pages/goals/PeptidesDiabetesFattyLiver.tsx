import GoalPage, { GoalPageConfig } from '../GoalPage';

const config: GoalPageConfig = {
  slug: 'peptides-diabetes-fatty-liver',
  title: 'Peptides for Diabetes and Fatty Liver South Africa — Semaglutide, Tirzepatide, BPC-157, MOTS-c',
  description:
    'Research overview of peptides studied for type 2 diabetes, insulin resistance and non-alcoholic fatty liver disease (NAFLD/MASLD) in the South African context. Covers GLP-1 agonists, BPC-157 hepatoprotection and MOTS-c AMPK activation.',
  h1: 'Peptides for Diabetes and Fatty Liver South Africa',
  tagline:
    'South Africa faces a rising metabolic crisis — type 2 diabetes prevalence is ~13% and NAFLD affects an estimated 30–40% of adults. This research overview examines the peptide mechanisms most studied for this cluster of conditions.',
  badge: 'Metabolic Health',
  badgeClass: 'text-amber-400 bg-amber-500/10',
  paragraphs: [
    'Semaglutide is the most evidence-backed peptide for the diabetes-fatty liver cluster. In the SUSTAIN-6 cardiovascular outcomes trial, weekly subcutaneous semaglutide 1 mg reduced major adverse cardiovascular events by 26% in type 2 diabetic patients versus placebo. In SUSTAIN-10, it also outperformed daily liraglutide on HbA1c reduction (−1.5% vs −1.0%) and weight loss (−5.8 kg vs −2.0 kg). The FLOW trial — published 2024 — was the first to demonstrate that semaglutide reduces progression of chronic kidney disease by 24% in type 2 diabetic patients, confirming renal protection as a separate axis of benefit beyond glycaemia.',
    'Tirzepatide adds GIP receptor agonism to GLP-1 signalling. The SURPASS-2 head-to-head trial showed tirzepatide 15 mg outperformed semaglutide 1 mg on HbA1c reduction (−2.46% vs −2.01%) and weight loss (−13.1 kg vs −6.7 kg) in type 2 diabetics. Crucially for fatty liver, the SYNERGY-NASH trial (2024) demonstrated that 52 weeks of tirzepatide produced MASH resolution without worsening fibrosis in 62.4% of patients on the 15 mg dose versus 9.5% on placebo — a landmark finding for MASLD (formerly NAFLD) treatment. No peptide has previously shown this magnitude of histological liver improvement in a placebo-controlled trial.',
    'BPC-157 occupies a different space: it is a cytoprotective pentadecapeptide with direct hepatoprotective effects independent of GLP-1 signalling. Animal models show BPC-157 attenuates alcohol-induced and drug-induced liver injury, reduces hepatic inflammation markers (TNF-α, IL-6), and promotes hepatocyte regeneration via VEGF upregulation and nitric oxide pathway modulation. Research doses in rodent models scaled to human equivalents suggest 250–500 mcg/day subcutaneous. South African researchers studying NAFLD alongside gut permeability issues frequently combine BPC-157 with a GLP-1 agonist to address both hepatic and intestinal repair simultaneously.',
    'MOTS-c is a mitochondrial-derived peptide (16 amino acids, encoded in the 12S rRNA gene) that activates AMPK — the cellular energy sensor — leading to improved glucose uptake, fatty acid oxidation and insulin sensitivity independent of the insulin receptor. In obese, insulin-resistant mouse models, MOTS-c restored insulin sensitivity comparably to metformin. Human trials are early-stage, but the AMPK mechanism complements GLP-1 agonists well because they act on different nodes: GLP-1 via incretin axis, MOTS-c via mitochondrial bioenergetics. This makes the semaglutide + MOTS-c combination conceptually attractive for researchers targeting both glycaemic control and metabolic flexibility.',
    'For South African researchers, the legal and practical context matters. Semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro) are SAHPRA-approved pharmaceuticals dispensed on prescription. Research-grade material is sold as laboratory reference material only, not for human therapeutic use. BPC-157 and MOTS-c have no current SAHPRA approval and are therefore restricted to in-vitro and animal research contexts. Researchers combining these modalities in any human context must do so under appropriate institutional ethical oversight.',
  ],
  peptideIds: ['semaglutide', 'tirzepatide', 'bpc157', 'motsc'],
};

export default function PeptidesDiabetesFattyLiver() {
  return <GoalPage config={config} />;
}
