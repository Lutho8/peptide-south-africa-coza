/**
 * Drug-Peptide Interaction Database
 *
 * Comprehensive collection of clinically significant interactions between
 * pharmaceutical drugs and research peptides. Each interaction includes
 * severity, mechanism, and evidence-based recommendations.
 *
 * Sources: FDA drug labels, clinical trial data, peer-reviewed literature,
 * and established pharmacological references.
 */

import { DrugPeptideInteraction, SeverityLevel } from "./types";

/**
 * Master database of all known drug-peptide interactions.
 * Organized by drug category for maintainability.
 */
export const DRUG_PEPTIDE_INTERACTIONS: DrugPeptideInteraction[] = [
  // ═══════════════════════════════════════════════════════════════
  // SSRI / SNRI ANTIDEPRESSANTS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Fluoxetine",
    drugClasses: ["ssri"],
    peptide: "semax",
    severity: "warning",
    mechanism:
      "Dual serotonergic effect — Semax modulates serotonin metabolism while SSRIs inhibit reuptake, potentially increasing serotonin availability.",
    recommendation:
      "Monitor for signs of serotonin syndrome (agitation, tremor, hyperthermia). Consider starting at reduced Semax dose.",
    source: "Clinical Pharmacology",
  },
  {
    drug: "Sertraline",
    drugClasses: ["ssri"],
    peptide: "semax",
    severity: "warning",
    mechanism:
      "Additive serotonergic activity via complementary pathways.",
    recommendation:
      "Monitor for serotonergic symptoms. Dose reduction may be warranted.",
    source: "Clinical Pharmacology",
  },
  {
    drug: "Escitalopram",
    drugClasses: ["ssri"],
    peptide: "semax",
    severity: "warning",
    mechanism:
      "Combined serotonergic modulation may increase SSRI side effects.",
    recommendation:
      "Start with lowest effective Semax dose. Monitor mood changes.",
    source: "Drug Interaction Database",
  },
  {
    drug: "Venlafaxine",
    drugClasses: ["snri"],
    peptide: "semax",
    severity: "warning",
    mechanism:
      "SNRI + Semax both affect monoaminergic neurotransmission.",
    recommendation:
      "Caution advised. Monitor blood pressure and mood symptoms.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // ANTICOAGULANTS / ANTIPLATELETS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Warfarin",
    drugClasses: ["anticoagulant", "vitamin-k-antagonist"],
    peptide: "semaglutide",
    severity: "critical",
    mechanism:
      "GLP-1 agonists alter gastric emptying and may affect warfarin absorption; also associated with changes in INR and increased bleeding risk.",
    recommendation:
      "INR monitoring required. Consider alternative anticoagulation or close INR surveillance with dose adjustment.",
    source: "FDA Semaglutide Label",
  },
  {
    drug: "Warfarin",
    drugClasses: ["anticoagulant"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "BPC-157 promotes angiogenesis and accelerates wound healing, which may theoretically increase bleeding risk when combined with anticoagulants.",
    recommendation:
      "Monitor INR closely. Watch for signs of bleeding or bruising.",
    source: "Peptide Safety Review",
  },
  {
    drug: "Apixaban",
    drugClasses: ["anticoagulant", "doac"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "Additive effect on hemostasis — BPC-157 affects vascular integrity while DOACs inhibit factor Xa.",
    recommendation:
      "Monitor for unusual bleeding. Avoid high-dose BPC-157.",
    source: "Clinical Pharmacology",
  },
  {
    drug: "Rivaroxaban",
    drugClasses: ["anticoagulant", "doac"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "Combined effect on coagulation cascade and tissue repair.",
    recommendation:
      "Use lowest effective BPC-157 dose. Monitor for bleeding signs.",
    source: "Clinical Pharmacology",
  },
  {
    drug: "Clopidogrel",
    drugClasses: ["antiplatelet"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "Antiplatelet effects may synergize with BPC-157's vascular effects.",
    recommendation:
      "Monitor bleeding time. Avoid concurrent use if possible.",
    source: "Drug Interaction Review",
  },
  {
    drug: "Aspirin",
    drugClasses: ["antiplatelet", "nsaid"],
    peptide: "bpc-157",
    severity: "info",
    mechanism:
      "May theoretically reduce BPC-157 effectiveness due to NSAID mechanism; evidence is limited.",
    recommendation:
      "Consider separating doses by several hours. Monitor therapeutic response.",
    source: "Preclinical Data",
  },
  {
    drug: "Heparin",
    drugClasses: ["anticoagulant"],
    peptide: "tb-500",
    severity: "warning",
    mechanism:
      "Both affect tissue repair and vascular remodeling; additive bleeding risk.",
    recommendation:
      "Monitor aPTT and signs of bleeding. Coordinate dosing with clinician.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // DIABETES MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Insulin",
    drugClasses: ["insulin", "antidiabetic"],
    peptide: "semaglutide",
    severity: "critical",
    mechanism:
      "Dual glucose-lowering action — GLP-1 agonists stimulate insulin secretion and suppress glucagon, compounding insulin effect and risking severe hypoglycemia.",
    recommendation:
      "INSULIN DOSE REDUCTION REQUIRED. Typically reduce insulin by 20-50% when initiating GLP-1. Monitor glucose frequently.",
    source: "FDA GLP-1 Label",
  },
  {
    drug: "Insulin",
    drugClasses: ["insulin", "antidiabetic"],
    peptide: "tirzepatide",
    severity: "critical",
    mechanism:
      "Dual GIP/GLP-1 agonism potentiates insulin secretion; severe hypoglycemia risk when combined with exogenous insulin.",
    recommendation:
      "MANDATORY insulin dose reduction. Close glucose monitoring essential.",
    source: "FDA Tirzepatide Label",
  },
  {
    drug: "Insulin",
    drugClasses: ["insulin", "antidiabetic"],
    peptide: "retatrutide",
    severity: "critical",
    mechanism:
      "Triple hormone agonist (GIP/GLP-1/GCG) significantly augments insulin secretion; extreme hypoglycemia risk.",
    recommendation:
      "SEVERE hypoglycemia risk. Reduce insulin substantially. Continuous glucose monitoring strongly recommended.",
    source: "Clinical Trial Data",
  },
  {
    drug: "Metformin",
    drugClasses: ["biguanide", "antidiabetic"],
    peptide: "mots-c",
    severity: "warning",
    mechanism:
      "Both activate AMPK pathway — dual AMPK activation may enhance metformin effects but also increase GI side effects.",
    recommendation:
      "Monitor for increased GI symptoms. Glucose levels should be tracked. Dose adjustment may be needed.",
    source: "Metabolic Research",
  },
  {
    drug: "Glipizide",
    drugClasses: ["sulfonylurea", "antidiabetic"],
    peptide: "semaglutide",
    severity: "critical",
    mechanism:
      "Sulfonylureas stimulate insulin release; GLP-1 agonists also stimulate insulin — compounding hypoglycemia risk.",
    recommendation:
      "DISCONTINUE sulfonylurea or reduce by 50% before starting GLP-1. Monitor glucose intensively.",
    source: "ADA Guidelines",
  },
  {
    drug: "Glyburide",
    drugClasses: ["sulfonylurea", "antidiabetic"],
    peptide: "tirzepatide",
    severity: "critical",
    mechanism:
      "Sulfonylurea + dual incretin agonist creates multi-pathway insulin stimulation.",
    recommendation:
      "REDUCE or STOP sulfonylurea. High hypoglycemia risk.",
    source: "FDA Guidance",
  },
  {
    drug: "Sitagliptin",
    drugClasses: ["dpp4-inhibitor", "antidiabetic"],
    peptide: "semaglutide",
    severity: "warning",
    mechanism:
      "DPP-4 inhibitors and GLP-1 agonists both work via incretin pathway; additive effects with uncertain benefit.",
    recommendation:
      "Generally not recommended together. Monitor glucose; DPP-4 may be discontinued.",
    source: "Endocrine Society",
  },
  {
    drug: "Empagliflozin",
    drugClasses: ["sglt2-inhibitor", "antidiabetic"],
    peptide: "semaglutide",
    severity: "warning",
    mechanism:
      "SGLT2 inhibitors cause osmotic diuresis; GLP-1 agonists cause GI fluid loss. Combined dehydration risk.",
    recommendation:
      "Ensure adequate hydration. Monitor renal function and blood pressure.",
    source: "ADA/EASD Consensus",
  },
  {
    drug: "Dapagliflozin",
    drugClasses: ["sglt2-inhibitor"],
    peptide: "tirzepatide",
    severity: "warning",
    mechanism:
      "Combined diuretic/GI effects may increase dehydration and hypotension risk.",
    recommendation:
      "Maintain hydration. Monitor for orthostatic hypotension and kidney function.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // CARDIOVASCULAR MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Atenolol",
    drugClasses: ["beta-blocker"],
    peptide: "ipamorelin",
    severity: "warning",
    mechanism:
      "Beta-blockers blunt GH response by inhibiting the cAMP pathway that mediates GH secretion.",
    recommendation:
      "GH secretagogue effects may be reduced. Consider timing separation or alternative cardiovascular therapy.",
    source: "Endocrine Reviews",
  },
  {
    drug: "Metoprolol",
    drugClasses: ["beta-blocker"],
    peptide: "cjc-1295",
    severity: "warning",
    mechanism:
      "Beta-adrenergic blockade reduces GHRH-stimulated GH release.",
    recommendation:
      "Expect attenuated GH response. Monitor IGF-1 levels if using for GH deficiency.",
    source: "Clinical Endocrinology",
  },
  {
    drug: "Propranolol",
    drugClasses: ["beta-blocker", "non-selective"],
    peptide: "sermorelin",
    severity: "warning",
    mechanism:
      "Non-selective beta-blockade significantly impairs GH secretion in response to secretagogues.",
    recommendation:
      "Consider cardioselective beta-blocker alternative. GH effects may be blunted.",
    source: "Endocrine Reviews",
  },
  {
    drug: "Lisinopril",
    drugClasses: ["ace-inhibitor"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "ACE inhibitors affect angiotensin pathway; BPC-157 modulates vascular tone — potential hypotensive synergy.",
    recommendation:
      "Monitor blood pressure. Watch for symptomatic hypotension.",
    source: "Cardiovascular Research",
  },
  {
    drug: "Losartan",
    drugClasses: ["arb"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "ARBs and BPC-157 both influence vascular remodeling and blood pressure regulation.",
    recommendation:
      "Monitor BP closely. Adjust antihypertensive dose if needed.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // CORTICOSTEROIDS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Prednisone",
    drugClasses: ["corticosteroid", "glucocorticoid"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "Corticosteroids impair wound healing and increase GI ulcer risk; BPC-157 counteracts these effects but the combination is complex.",
    recommendation:
      "BPC-157 may help offset steroid-induced GI damage. Monitor for GI bleeding. Do not discontinue steroids abruptly.",
    source: "Gastroenterology Research",
  },
  {
    drug: "Dexamethasone",
    drugClasses: ["corticosteroid"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "High-potency steroid + BPC-157 — BPC-157 may protect against steroid-induced gastric injury.",
    recommendation:
      "Monitor gastric symptoms. BPC-157 may be beneficial but evidence is limited.",
    source: "Preclinical Studies",
  },
  {
    drug: "Prednisone",
    drugClasses: ["corticosteroid"],
    peptide: "tb-500",
    severity: "warning",
    mechanism:
      "Corticosteroids suppress inflammation and may interfere with thymosin beta-4's tissue repair mechanisms.",
    recommendation:
      "Effects of TB-500 may be reduced. Consider timing separation.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // THYROID MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Levothyroxine",
    drugClasses: ["thyroid-hormone"],
    peptide: "tesamorelin",
    severity: "warning",
    mechanism:
      "Tesamorelin stimulates GH release which affects thyroid hormone metabolism; may alter levothyroxine requirements.",
    recommendation:
      "Monitor TSH levels. Levothyroxine dose adjustment may be necessary.",
    source: "Endocrine Practice",
  },
  {
    drug: "Liothyronine",
    drugClasses: ["thyroid-hormone", "t3"],
    peptide: "cjc-1295",
    severity: "warning",
    mechanism:
      "T3 and GH secretagogues both influence metabolic rate; additive effects on metabolism.",
    recommendation:
      "Monitor thyroid function tests. Watch for hyperthyroid symptoms.",
    source: "Clinical Endocrinology",
  },

  // ═══════════════════════════════════════════════════════════════
  // ONCOLOGY / HORMONAL AGENTS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Tamoxifen",
    drugClasses: ["serm", "anti-estrogen"],
    peptide: "igf-1",
    severity: "fatal",
    mechanism:
      "Tamoxifen is used for estrogen-receptor-positive breast cancer; IGF-1 promotes cellular proliferation and may antagonize tamoxifen's anti-tumor effects, potentially stimulating tumor growth.",
    recommendation:
      "ABSOLUTE CONTRAINDICATION. IGF-1 must not be used in patients on tamoxifen or with history of hormone-sensitive cancers.",
    source: "Oncology Guidelines",
  },
  {
    drug: "Tamoxifen",
    drugClasses: ["serm"],
    peptide: "cjc-1295",
    severity: "fatal",
    mechanism:
      "CJC-1295 increases GH and downstream IGF-1, which can drive proliferation of hormone-sensitive tumor cells.",
    recommendation:
      "CONTRAINDICATED. Any GH secretagogue that raises IGF-1 is unsafe with current or past hormone-sensitive cancer.",
    source: "Oncology Guidelines",
  },
  {
    drug: "Tamoxifen",
    drugClasses: ["serm"],
    peptide: "ipamorelin",
    severity: "fatal",
    mechanism:
      "Ipamorelin stimulates GH release, leading to elevated IGF-1 which may promote tumor growth in hormone-sensitive cancers.",
    recommendation:
      "DO NOT USE. Ipamorelin and all GH secretagogues are contraindicated.",
    source: "ASCO Guidelines",
  },
  {
    drug: "Anastrozole",
    drugClasses: ["aromatase-inhibitor", "anti-estrogen"],
    peptide: "igf-1",
    severity: "fatal",
    mechanism:
      "Aromatase inhibitors are used for breast cancer; IGF-1 signaling may promote residual tumor cell survival.",
    recommendation:
      "ABSOLUTELY CONTRAINDICATED. Risk of cancer recurrence/progression.",
    source: "Oncology Guidelines",
  },
  {
    drug: "Letrozole",
    drugClasses: ["aromatase-inhibitor"],
    peptide: "cjc-1295",
    severity: "fatal",
    mechanism:
      "GH/IGF-1 axis activation may counteract aromatase inhibitor therapy in hormone-sensitive cancers.",
    recommendation:
      "CONTRAINDICATED. Avoid all GH-stimulating peptides during endocrine cancer therapy.",
    source: "NCCN Guidelines",
  },
  {
    drug: "Testosterone",
    drugClasses: ["androgen", "hormone"],
    peptide: "bpc-157",
    severity: "info",
    mechanism:
      "No direct interaction. BPC-157 may support tissue repair benefits sought by TRT patients.",
    recommendation:
      "No interaction precautions needed. Continue standard monitoring.",
    source: "Clinical Practice",
  },
  {
    drug: "Testosterone",
    drugClasses: ["androgen"],
    peptide: "tb-500",
    severity: "info",
    mechanism:
      "Both support recovery and tissue health; complementary mechanisms with no known adverse interaction.",
    recommendation:
      "Generally safe to combine. Monitor standard TRT parameters.",
    source: "Clinical Practice",
  },

  // ═══════════════════════════════════════════════════════════════
  // IMMUNOSUPPRESSANTS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Tacrolimus",
    drugClasses: ["immunosuppressant", "calcineurin-inhibitor"],
    peptide: "thymosin-alpha-1",
    severity: "critical",
    mechanism:
      "Thymosin alpha-1 is an immunomodulator that enhances immune function; tacrolimus suppresses immunity. Direct pharmacological antagonism.",
    recommendation:
      "CONTRAINDICATED in transplant patients. TA1 will counteract immunosuppression and risks organ rejection.",
    source: "Transplantation Guidelines",
  },
  {
    drug: "Cyclosporine",
    drugClasses: ["immunosuppressant"],
    peptide: "thymosin-alpha-1",
    severity: "critical",
    mechanism:
      "TA1 stimulates T-cell function while cyclosporine inhibits T-cell activation — direct opposition.",
    recommendation:
      "DO NOT COMBINE. Risk of transplant rejection is severe.",
    source: "Transplantation Society",
  },
  {
    drug: "Mycophenolate",
    drugClasses: ["immunosuppressant"],
    peptide: "thymosin-alpha-1",
    severity: "critical",
    mechanism:
      "Immunosuppressant + immunostimulant create opposing effects; may precipitate rejection.",
    recommendation:
      "ABSOLUTE CONTRAINDICATION in transplant recipients.",
    source: "Transplant Guidelines",
  },
  {
    drug: "Prednisone",
    drugClasses: ["immunosuppressant", "corticosteroid"],
    peptide: "thymosin-alpha-1",
    severity: "critical",
    mechanism:
      "Systemic steroids broadly suppress immune function, directly opposing TA1's immunomodulatory effects.",
    recommendation:
      "Avoid concurrent use. Effects are directly antagonistic.",
    source: "Immunology Guidelines",
  },
  {
    drug: "Methotrexate",
    drugClasses: ["immunosuppressant", "dmard"],
    peptide: "thymosin-alpha-1",
    severity: "warning",
    mechanism:
      "Methotrexate has immunosuppressive properties; TA1 is immunostimulatory. Reduced efficacy of both.",
    recommendation:
      "Not recommended together. Discuss with rheumatologist.",
    source: "Rheumatology Practice",
  },

  // ═══════════════════════════════════════════════════════════════
  // GROWTH HORMONE / SECRETAGOGUES
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Somatropin",
    drugClasses: ["growth-hormone"],
    peptide: "cjc-1295",
    severity: "warning",
    mechanism:
      "Exogenous GH combined with GH secretagogue can cause excessive GH levels, leading to insulin resistance, fluid retention, and acromegaly-like symptoms.",
    recommendation:
      "Avoid combining. If both needed, reduce doses significantly and monitor IGF-1.",
    source: "Endocrine Society",
  },
  {
    drug: "Somatropin",
    drugClasses: ["growth-hormone"],
    peptide: "ipamorelin",
    severity: "warning",
    mechanism:
      "Dual GH stimulation may lead to supraphysiological levels and side effects.",
    recommendation:
      "Use one or the other. Monitor IGF-1 closely if combination unavoidable.",
    source: "Clinical Endocrinology",
  },

  // ═══════════════════════════════════════════════════════════════
  // OPIOIDS / PAIN MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Morphine",
    drugClasses: ["opioid"],
    peptide: "bpc-157",
    severity: "warning",
    mechanism:
      "Both affect dopaminergic and serotonergic pathways. BPC-157 has been shown to modulate opioid system effects in preclinical models.",
    recommendation:
      "Monitor for altered opioid response. Watch for withdrawal-like symptoms.",
    source: "Preclinical Research",
  },
  {
    drug: "Tramadol",
    drugClasses: ["opioid", "snri"],
    peptide: "semax",
    severity: "warning",
    mechanism:
      "Tramadol has SNRI properties; combined with Semax's serotonergic effects increases serotonin syndrome risk.",
    recommendation:
      "Monitor for serotonergic symptoms. Avoid if other serotonergic drugs present.",
    source: "Clinical Pharmacology",
  },

  // ═══════════════════════════════════════════════════════════════
  // SEDATIVES / ANXIOLYTICS / SLEEP AIDS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Zolpidem",
    drugClasses: ["sedative", "hypnotic"],
    peptide: "dsip",
    severity: "warning",
    mechanism:
      "Both promote sleep via different mechanisms; potential for excessive sedation and respiratory depression.",
    recommendation:
      "Start with reduced doses of both. Monitor for oversedation. Avoid alcohol.",
    source: "Sleep Medicine",
  },
  {
    drug: "Alprazolam",
    drugClasses: ["benzodiazepine", "anxiolytic"],
    peptide: "semax",
    severity: "info",
    mechanism:
      "Semax may have anxiolytic properties that could complement or reduce benzodiazepine need.",
    recommendation:
      "Monitor anxiety levels. Potential to reduce benzodiazepine dose under medical supervision.",
    source: "Clinical Research",
  },

  // ═══════════════════════════════════════════════════════════════
  // STATINS / LIPID MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Atorvastatin",
    drugClasses: ["statin", "lipid-lowering"],
    peptide: "mots-c",
    severity: "info",
    mechanism:
      "No direct interaction. Both improve metabolic health through different pathways.",
    recommendation:
      "Safe to combine. Continue standard lipid monitoring.",
    source: "Metabolic Research",
  },
  {
    drug: "Rosuvastatin",
    drugClasses: ["statin"],
    peptide: "bpc-157",
    severity: "info",
    mechanism:
      "BPC-157 may provide protective effects against statin-induced muscle damage based on preclinical data.",
    recommendation:
      "Monitor CK levels as standard practice. No dose adjustment needed.",
    source: "Preclinical Studies",
  },

  // ═══════════════════════════════════════════════════════════════
  // PROTON PUMP INHIBITORS / GI MEDICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Omeprazole",
    drugClasses: ["ppi"],
    peptide: "bpc-157",
    severity: "info",
    mechanism:
      "Both protect gastric mucosa through different mechanisms; potentially complementary.",
    recommendation:
      "BPC-157 may reduce need for PPI over time. Monitor GI symptoms.",
    source: "Gastroenterology Research",
  },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE SUBSTANCES
  // ═══════════════════════════════════════════════════════════════
  {
    drug: "Alcohol",
    drugClasses: ["sedative", "recreational"],
    peptide: "cjc-1295",
    severity: "warning",
    mechanism:
      "Alcohol suppresses GH secretion by ~70%; directly counteracts GH secretagogue effects.",
    recommendation:
      "Avoid alcohol within 3 hours of GH secretagogue dosing. Chronic use will diminish results.",
    source: "Endocrinology Research",
  },
  {
    drug: "Alcohol",
    drugClasses: ["sedative", "recreational"],
    peptide: "ipamorelin",
    severity: "warning",
    mechanism:
      "Ethanol acutely inhibits GH release, blunting the response to GH secretagogues.",
    recommendation:
      "Avoid concurrent use. Separate alcohol consumption by at least 3 hours.",
    source: "Clinical Endocrinology",
  },
  {
    drug: "Nicotine",
    drugClasses: ["stimulant", "recreational"],
    peptide: "mots-c",
    severity: "info",
    mechanism:
      "Nicotine may affect mitochondrial function; theoretical interaction with MOTS-c's mitochondrial mechanism.",
    recommendation:
      "Limited data. Monitor response to MOTS-c if using nicotine products.",
    source: "Theoretical",
  },
  {
    drug: "Caffeine",
    drugClasses: ["stimulant"],
    peptide: "semax",
    severity: "info",
    mechanism:
      "Both have cognitive-enhancing effects via different pathways; may be complementary.",
    recommendation:
      "Generally well tolerated. Monitor for overstimulation or anxiety.",
    source: "Clinical Practice",
  },
];

/**
 * Drug class aliases - maps common drug name variations to canonical names.
 * Used for fuzzy matching user-provided medication names.
 */
export const DRUG_NAME_ALIASES: Record<string, string> = {
  // SSRIs
  prozac: "Fluoxetine",
  zoloft: "Sertraline",
  lexapro: "Escitalopram",
  celexa: "Citalopram",
  paxil: "Paroxetine",
  // SNRIs
  effexor: "Venlafaxine",
  cymbalta: "Duloxetine",
  pristiq: "Desvenlafaxine",
  // Beta blockers
  tenormin: "Atenolol",
  lopressor: "Metoprolol",
  inderal: "Propranolol",
  // ACE inhibitors
  prinivil: "Lisinopril",
  zestril: "Lisinopril",
  // ARBs
  cozaar: "Losartan",
  // Anticoagulants
  eliquis: "Apixaban",
  xarelto: "Rivaroxaban",
  coumadin: "Warfarin",
  jantoven: "Warfarin",
  plavix: "Clopidogrel",
  // Diabetes
  glucophage: "Metformin",
  glipizide: "Glipizide",
  glucotrol: "Glipizide",
  diabeta: "Glyburide",
  januvia: "Sitagliptin",
  jardiance: "Empagliflozin",
  farxiga: "Dapagliflozin",
  // Corticosteroids
  deltasone: "Prednisone",
  // Thyroid
  synthroid: "Levothyroxine",
  cytomel: "Liothyronine",
  // Oncology
  nolvadex: "Tamoxifen",
  arimidex: "Anastrozole",
  femara: "Letrozole",
  // Immunosuppressants
  prograf: "Tacrolimus",
  neoral: "Cyclosporine",
  cellcept: "Mycophenolate",
  trexall: "Methotrexate",
  // GH
  genotropin: "Somatropin",
  humatrope: "Somatropin",
  // Opioids
  ultram: "Tramadol",
  // Sedatives
  ambien: "Zolpidem",
  xanax: "Alprazolam",
  // Statins
  lipitor: "Atorvastatin",
  crestor: "Rosuvastatin",
  // PPIs
  prilosec: "Omeprazole",
};

/**
 * Normalize a drug name by checking aliases and lowercasing.
 */
function normalizeDrugName(drug: string): string {
  const lower = drug.trim().toLowerCase();
  return DRUG_NAME_ALIASES[lower] || drug.trim();
}

/**
 * Normalize a peptide ID for consistent matching.
 */
function normalizePeptideId(peptideId: string): string {
  return peptideId.toLowerCase().replace(/[-_\s]/g, "");
}

/**
 * Check for drug-peptide interactions between a user's medications
 * and a target peptide.
 *
 * @param userDrugs - Array of medication names the user is taking
 * @param peptideId - The peptide to check against
 * @returns Array of matching drug-peptide interactions
 */
export function checkDrugInteractions(
  userDrugs: string[],
  peptideId: string
): DrugPeptideInteraction[] {
  if (!userDrugs.length || !peptideId) return [];

  const normalizedPeptide = normalizePeptideId(peptideId);
  const normalizedDrugs = userDrugs.map(normalizeDrugName);

  const matches: DrugPeptideInteraction[] = [];

  for (const interaction of DRUG_PEPTIDE_INTERACTIONS) {
    const interactionPeptide = normalizePeptideId(interaction.peptide);

    // Check peptide match
    if (interactionPeptide !== normalizedPeptide) continue;

    // Check if any of the user's drugs match this interaction
    const drugMatch = normalizedDrugs.some((userDrug) => {
      const userDrugLower = userDrug.toLowerCase();
      const interactionDrugLower = interaction.drug.toLowerCase();

      // Direct name match
      if (userDrugLower === interactionDrugLower) return true;

      // Partial match (e.g., "metformin hcl" matches "metformin")
      if (
        userDrugLower.includes(interactionDrugLower) ||
        interactionDrugLower.includes(userDrugLower)
      )
        return true;

      // Drug class match
      if (interaction.drugClasses) {
        return interaction.drugClasses.some((cls) =>
          userDrugLower.includes(cls.toLowerCase())
        );
      }

      return false;
    });

    if (drugMatch) {
      matches.push(interaction);
    }
  }

  return matches;
}

/**
 * Get all interactions for a specific drug across all peptides.
 * Useful for comprehensive medication reviews.
 */
export function getInteractionsForDrug(
  drugName: string
): DrugPeptideInteraction[] {
  const normalized = normalizeDrugName(drugName).toLowerCase();

  return DRUG_PEPTIDE_INTERACTIONS.filter((interaction) => {
    const directMatch = interaction.drug.toLowerCase() === normalized;
    const classMatch =
      interaction.drugClasses?.some(
        (cls) => cls.toLowerCase() === normalized
      ) ?? false;
    return directMatch || classMatch;
  });
}

/**
 * Get all interactions for a specific peptide across all drugs.
 * Useful for peptide safety profiles.
 */
export function getInteractionsForPeptide(
  peptideId: string
): DrugPeptideInteraction[] {
  const normalized = normalizePeptideId(peptideId);
  return DRUG_PEPTIDE_INTERACTIONS.filter(
    (i) => normalizePeptideId(i.peptide) === normalized
  );
}

/**
 * Get all unique peptide IDs that have documented interactions.
 */
export function getPeptidesWithInteractions(): string[] {
  const peptides = new Set(
    DRUG_PEPTIDE_INTERACTIONS.map((i) => i.peptide.toLowerCase())
  );
  return Array.from(peptides).sort();
}

/**
 * Get all unique drug names that have documented interactions.
 */
export function getDrugsWithInteractions(): string[] {
  const drugs = new Set(
    DRUG_PEPTIDE_INTERACTIONS.map((i) => i.drug)
  );
  return Array.from(drugs).sort();
}
