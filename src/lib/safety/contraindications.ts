/**
 * Contraindication Rules Database
 *
 * Medical conditions that contraindicate the use of specific peptides.
 * Each rule specifies which peptides are blocked, the clinical severity,
 * and the medical rationale.
 *
 * These rules are based on clinical guidelines, FDA labels, case reports,
 * and established pharmacological principles.
 */

import { Contraindication, SeverityLevel } from "./types";

/**
 * Master database of contraindication rules.
 * Rules are evaluated against a user's medical conditions to determine
 * if peptide administration is safe.
 */
export const CONTRAINDICATION_RULES: Contraindication[] = [
  // ═══════════════════════════════════════════════════════════════
  // ONCOLOGY — FATAL
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Active Malignancy (Hormone-Sensitive)",
    conditionTags: [
      "active cancer",
      "active malignancy",
      "breast cancer",
      "prostate cancer",
      "hormone sensitive",
      "hormone-sensitive",
      "er positive",
      "er+",
      "pr positive",
      "pr+",
      "current cancer",
      "cancer treatment",
      "oncology",
      "chemotherapy",
      "radiation therapy",
    ],
    blockedPeptides: ["igf-1", "cjc-1295", "sermorelin", "ipamorelin", "tesamorelin", "ghrp-2", "ghrp-6", "somatropin"],
    severity: "fatal",
    reason:
      "Growth hormone and IGF-1 are potent mitogens that stimulate cellular proliferation. In patients with active hormone-sensitive malignancies, elevated GH/IGF-1 can accelerate tumor growth, promote metastasis, and reduce treatment efficacy. This applies to ALL growth hormone-releasing peptides and IGF-1.",
  },
  {
    condition: "Active Malignancy (Any Type)",
    conditionTags: [
      "active cancer",
      "active malignancy",
      "current cancer",
      "cancer",
      "tumor",
      "neoplasm",
      "metastatic",
      "stage",
      "oncology",
      "chemotherapy",
      "radiation",
      "immunotherapy",
    ],
    blockedPeptides: ["igf-1"],
    severity: "fatal",
    reason:
      "IGF-1 is a universal growth factor that promotes cell survival and proliferation in virtually all tissue types. Administration during active malignancy of any type poses unacceptable risk of accelerating tumor growth.",
  },
  {
    condition: "Melanocytic Lesions / Melanoma History",
    conditionTags: [
      "melanoma",
      "melanocytic",
      "dysplastic nevus",
      "atypical mole",
      "skin cancer",
      "pigmented lesion",
      "melanocytic lesion",
      "history of melanoma",
    ],
    blockedPeptides: ["melanotan-ii", "melanotan2", "mt2", "melanotan"],
    severity: "fatal",
    reason:
      "Melanotan-II is a synthetic analog of alpha-MSH that stimulates melanogenesis. In patients with melanocytic lesions or history of melanoma, MT-II can directly stimulate malignant melanocyte proliferation, potentially triggering or accelerating melanoma.",
  },
  {
    condition: "Lynch Syndrome",
    conditionTags: [
      "lynch syndrome",
      "hnpcc",
      "hereditary non-polyposis",
      "lynch",
      "mismatch repair",
    ],
    blockedPeptides: ["cjc-1295"],
    severity: "fatal",
    reason:
      "Lynch syndrome carriers have defective DNA mismatch repair and elevated cancer risk. CJC-1295 elevates GH/IGF-1, which promotes cellular proliferation. The combination of increased proliferation drive with impaired DNA repair creates an extremely high malignancy risk.",
  },
  {
    condition: "Multiple Endocrine Neoplasia Type 2 (MEN2)",
    conditionTags: [
      "men 2",
      "men2",
      "men ii",
      "multiple endocrine neoplasia",
      "medullary thyroid",
      "mtc",
      "ret proto-oncogene",
      "ret mutation",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide", "liraglutide", "dulaglutide", "exenatide", "glp-1"],
    severity: "fatal",
    reason:
      "GLP-1 receptor agonists carry a black box warning for medullary thyroid carcinoma (MTC). Patients with MEN2 or personal/family history of MTC have a genetic predisposition to this tumor type. GLP-1 agonists may stimulate C-cell proliferation in the thyroid, directly risking MTC development.",
  },
  {
    condition: "Personal History of Medullary Thyroid Carcinoma",
    conditionTags: [
      "medullary thyroid",
      "thyroid cancer",
      "mtc",
      "thyroid carcinoma",
      "thyroidectomy",
      "thyroid malignancy",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide", "liraglutide", "dulaglutide", "exenatide", "glp-1"],
    severity: "fatal",
    reason:
      "Personal history of medullary thyroid carcinoma is an absolute contraindication to all GLP-1 receptor agonists due to the risk of C-cell stimulation and MTC recurrence. Black box warning on all GLP-1 products.",
  },

  // ═══════════════════════════════════════════════════════════════
  // PANCREATIC / GLP-1 RELATED — CRITICAL
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "History of Pancreatitis",
    conditionTags: [
      "pancreatitis",
      "pancreatic inflammation",
      "acute pancreatitis",
      "chronic pancreatitis",
      "pancreatic",
      "pancreas",
      "history of pancreatitis",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide", "liraglutide", "dulaglutide", "exenatide", "glp-1"],
    severity: "critical",
    reason:
      "GLP-1 receptor agonists have been associated with acute pancreatitis in post-marketing surveillance. Patients with a history of pancreatitis are at significantly higher risk of recurrence. Symptoms include severe abdominal pain, nausea, and vomiting.",
  },
  {
    condition: "History of Thyroid Cancer (Non-Medullary)",
    conditionTags: [
      "thyroid cancer",
      "thyroid carcinoma",
      "papillary thyroid",
      "follicular thyroid",
      "thyroid nodule",
      "thyroidectomy",
      "history of thyroid cancer",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide", "liraglutide", "dulaglutide", "exenatide", "glp-1"],
    severity: "critical",
    reason:
      "While the black box warning specifically addresses medullary thyroid carcinoma, caution is advised for all thyroid cancer history due to GLP-1 effects on thyroid C-cells and limited long-term safety data.",
  },

  // ═══════════════════════════════════════════════════════════════
  // TRANSPLANT / IMMUNOLOGY — CRITICAL
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Organ Transplant Recipient",
    conditionTags: [
      "transplant",
      "organ transplant",
      "kidney transplant",
      "liver transplant",
      "heart transplant",
      "lung transplant",
      "pancreas transplant",
      "transplant recipient",
      "transplantation",
      "immunosuppressed",
      "immunosuppression",
      "graft",
      "donor",
    ],
    blockedPeptides: ["thymosin-alpha-1", "ta1", "thymalfasin"],
    severity: "critical",
    reason:
      "Thymosin alpha-1 is an immunomodulator that enhances T-cell function and upregulates immune responses. In transplant recipients on immunosuppressive therapy, TA1 can counteract immunosuppression and precipitate acute or chronic organ rejection, which is life-threatening.",
  },
  {
    condition: "Active Autoimmune Disease (Flare)",
    conditionTags: [
      "active autoimmune",
      "autoimmune flare",
      "lupus flare",
      "ra flare",
      "rheumatoid arthritis active",
      "crohn's flare",
      "ulcerative colitis flare",
      "ms flare",
      "multiple sclerosis relapse",
      "autoimmune hepatitis active",
      "graves disease active",
      "hashimoto's flare",
    ],
    blockedPeptides: ["thymosin-alpha-1", "ta1"],
    severity: "warning",
    reason:
      "During active autoimmune flares, immune-stimulating peptides like thymosin alpha-1 may exacerbate immune-mediated tissue damage by amplifying the already overactive immune response. Use only during stable/remission phases under specialist care.",
  },

  // ═══════════════════════════════════════════════════════════════
  // REPRODUCTIVE — FATAL / CRITICAL
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Pregnancy",
    conditionTags: [
      "pregnant",
      "pregnancy",
      "expecting",
      "gestation",
      "gravid",
      "trimester",
      "prenatal",
      "conception",
    ],
    blockedPeptides: ["*"],
    severity: "fatal",
    reason:
      "Research peptides have NO established safety data in pregnancy. The majority lack any reproductive toxicity studies. Effects on fetal development are unknown. ALL peptides are contraindicated during pregnancy as the risk to the fetus cannot be quantified.",
  },
  {
    condition: "Breastfeeding / Lactation",
    conditionTags: [
      "breastfeeding",
      "lactating",
      "nursing",
      "lactation",
      "breast milk",
      "postpartum",
    ],
    blockedPeptides: ["*"],
    severity: "critical",
    reason:
      "No data exists on peptide transfer into breast milk or effects on nursing infants. Given the unknown risks to the infant, all research peptides are contraindicated during breastfeeding.",
  },
  {
    condition: "Planning Pregnancy",
    conditionTags: [
      "planning pregnancy",
      "trying to conceive",
      "ttc",
      "fertility treatment",
      "ivf",
      "planning conception",
      "preconception",
    ],
    blockedPeptides: ["*"],
    severity: "critical",
    reason:
      "Research peptides should be discontinued before conception attempts due to unknown teratogenic potential. A washout period of at least 4 weeks is recommended for short-acting peptides.",
  },

  // ═══════════════════════════════════════════════════════════════
  // AGE-BASED — CRITICAL
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Pediatric Age (Under 18)",
    conditionTags: [
      "child",
      "pediatric",
      "under 18",
      "underage",
      "minor",
      "adolescent",
      "teenager",
      "children",
    ],
    blockedPeptides: ["*"],
    severity: "critical",
    reason:
      "Research peptides have not been studied in pediatric populations. The effects on growth plates, pubertal development, endocrine maturation, and long-term outcomes are completely unknown. Use in individuals under 18 is strictly contraindicated.",
  },

  // ═══════════════════════════════════════════════════════════════
  // ENDOCRINE — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Diabetic Retinopathy (Proliferative)",
    conditionTags: [
      "diabetic retinopathy",
      "proliferative retinopathy",
      "retinopathy",
      "diabetic eye",
      "vision loss diabetes",
      "neovascularization retina",
    ],
    blockedPeptides: ["cjc-1295", "sermorelin", "ipamorelin", "tesamorelin", "ghrp-2", "ghrp-6"],
    severity: "warning",
    reason:
      "GH and IGF-1 can promote angiogenesis and worsen proliferative diabetic retinopathy by stimulating new blood vessel growth in the retina. This can accelerate vision loss in susceptible patients.",
  },
  {
    condition: "Active Graves' Disease / Hyperthyroidism",
    conditionTags: [
      "graves",
      "hyperthyroidism",
      "overactive thyroid",
      "thyrotoxicosis",
      "graves disease",
      "t3 toxicosis",
      "t4 elevated",
      "thyroid storm",
    ],
    blockedPeptides: ["cjc-1295", "sermorelin", "ipamorelin", "tesamorelin"],
    severity: "warning",
    reason:
      "Growth hormone interacts with thyroid hormone metabolism. In active hyperthyroidism, GH secretagogues may worsen metabolic demands and complicate thyroid management. Stabilize thyroid function before initiating GH-related peptides.",
  },

  // ═══════════════════════════════════════════════════════════════
  // RENAL / HEPATIC — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Severe Kidney Disease (eGFR < 30)",
    conditionTags: [
      "kidney disease",
      "renal failure",
      "severe kidney",
      "egfr",
      "ckd stage 4",
      "ckd stage 5",
      "dialysis",
      "renal disease",
      "kidney failure",
      "esrd",
      "end stage renal",
    ],
    blockedPeptides: ["bpc-157"],
    severity: "warning",
    reason:
      "BPC-157 is primarily cleared renally. In severe kidney disease, accumulation and toxicity risk increase. Additionally, BPC-157's effects on fluid balance may complicate renal management. Dose reduction or avoidance recommended.",
  },
  {
    condition: "Liver Cirrhosis (Decompensated)",
    conditionTags: [
      "cirrhosis",
      "liver cirrhosis",
      "decompensated cirrhosis",
      "ascites",
      "hepatic encephalopathy",
      "varices",
      "liver failure",
      "hepatic failure",
      "child-pugh c",
    ],
    blockedPeptides: ["ghk-cu", "ghk"],
    severity: "warning",
    reason:
      "GHK-Cu is metabolized hepatically. In decompensated cirrhosis, altered drug metabolism and increased copper stores (Wilson's-like risk) may lead to copper overload. Monitor liver function and copper levels.",
  },
  {
    condition: "Hemochromatosis / Iron Overload",
    conditionTags: [
      "hemochromatosis",
      "iron overload",
      "hemosiderosis",
      "iron storage disease",
      "hfe mutation",
    ],
    blockedPeptides: ["ghk-cu", "ghk"],
    severity: "warning",
    reason:
      "GHK-Cu contains copper, which interacts with iron metabolism. In hemochromatosis, additional copper may worsen oxidative stress and organ damage through Fenton chemistry. Avoid or monitor iron/copper levels closely.",
  },

  // ═══════════════════════════════════════════════════════════════
  // CARDIOVASCULAR — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Recent Myocardial Infarction (< 6 months)",
    conditionTags: [
      "recent heart attack",
      "recent mi",
      "myocardial infarction",
      "heart attack",
      "cardiac event",
      "stemi",
      "nstemi",
      "post mi",
      "recent cardiac",
    ],
    blockedPeptides: ["igf-1", "cjc-1295"],
    severity: "warning",
    reason:
      "Following MI, cardiac remodeling is a delicate process. Growth factors like IGF-1 may affect scar formation and cardiac remodeling. While some data suggests potential benefit, the timing and dosing are critical. Cardiology consultation required.",
  },
  {
    condition: "Heart Failure (Severe / NYHA III-IV)",
    conditionTags: [
      "severe heart failure",
      "congestive heart failure",
      "chf",
      "nyha iii",
      "nyha iv",
      "nyha 3",
      "nyha 4",
      "decompensated heart failure",
      "cardiomyopathy severe",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide"],
    severity: "warning",
    reason:
      "GLP-1 agonists can cause dehydration and GI effects that may worsen heart failure. Rapid weight loss may also affect cardiac preload. Use with caution in severe HF; monitor fluid status and symptoms.",
  },

  // ═══════════════════════════════════════════════════════════════
  // NEUROLOGICAL — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "History of Serotonin Syndrome",
    conditionTags: [
      "serotonin syndrome",
      "serotonin toxicity",
      "serotonergic crisis",
      "history serotonin",
    ],
    blockedPeptides: ["semax"],
    severity: "warning",
    reason:
      "Patients with prior serotonin syndrome have demonstrated hypersensitivity to serotonergic agents. Semax has serotonergic properties and may trigger recurrence, especially if combined with SSRIs, SNRIs, or other serotonergic drugs.",
  },
  {
    condition: "Epilepsy / Seizure Disorder",
    conditionTags: [
      "epilepsy",
      "seizure disorder",
      "seizures",
      "convulsions",
      "epileptic",
      "seizure history",
      "febrile seizures",
    ],
    blockedPeptides: ["semax"],
    severity: "warning",
    reason:
      "Semax affects CNS neurotransmission and has stimulant-like properties. In susceptible individuals, this may lower seizure threshold. Use with extreme caution and only under neurology supervision.",
  },

  // ═══════════════════════════════════════════════════════════════
  // HEMATOLOGICAL — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Bleeding Disorder / Coagulopathy",
    conditionTags: [
      "bleeding disorder",
      "coagulopathy",
      "hemophilia",
      "von willebrand",
      "factor deficiency",
      "bleeding diathesis",
      "easy bruising",
      "prolonged bleeding",
      "low platelets",
      "thrombocytopenia",
    ],
    blockedPeptides: ["bpc-157"],
    severity: "warning",
    reason:
      "BPC-157 affects angiogenesis and vascular remodeling. While it may improve some vascular conditions, in patients with primary bleeding disorders, the effects on hemostasis are unpredictable. Hematology consultation advised.",
  },

  // ═══════════════════════════════════════════════════════════════
  // PSYCHIATRIC — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Bipolar Disorder (Unstable)",
    conditionTags: [
      "bipolar",
      "manic depression",
      "bipolar i",
      "bipolar ii",
      "mania",
      "hypomania",
      "bipolar disorder",
      "unstable bipolar",
    ],
    blockedPeptides: ["semax"],
    severity: "warning",
    reason:
      "Semax has CNS stimulant and mood-elevating properties that could potentially trigger manic or hypomanic episodes in patients with bipolar disorder. Stable patients may use under psychiatric supervision.",
  },

  // ═══════════════════════════════════════════════════════════════
  // GASTROINTESTINAL — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Gastroparesis",
    conditionTags: [
      "gastroparesis",
      "gastric paralysis",
      "delayed gastric emptying",
      "gastroparetic",
      "stomach paralysis",
      "diabetic gastroparesis",
    ],
    blockedPeptides: ["semaglutide", "tirzepatide", "retatrutide", "liraglutide"],
    severity: "critical",
    reason:
      "GLP-1 receptor agonists slow gastric emptying as a primary mechanism of action. In patients with pre-existing gastroparesis, this effect is severely amplified, causing intractable nausea, vomiting, malnutrition, and dehydration. Contraindicated.",
  },

  // ═══════════════════════════════════════════════════════════════
  // GENETIC / METABOLIC — WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    condition: "Porphyria",
    conditionTags: [
      "porphyria",
      "acute porphyria",
      "variegate porphyria",
      "intermittent porphyria",
      "ala dehydratase",
      "porphyrin",
    ],
    blockedPeptides: ["ghk-cu"],
    severity: "warning",
    reason:
      "GHK-Cu interacts with heme metabolism pathways. In porphyria, where heme synthesis is already disrupted, introducing copper-peptide complexes may exacerbate acute attacks. Use with caution under hematology care.",
  },
];

/**
 * Normalize a peptide ID for consistent matching.
 */
function normalizePeptideId(peptideId: string): string {
  return peptideId.toLowerCase().replace(/[-_\s]/g, "");
}

/**
 * Check contraindications for a user's medical conditions against a target peptide.
 *
 * @param userConditions - Array of medical condition names/keywords
 * @param peptideId - The peptide to check against
 * @returns Array of matching contraindications
 */
export function checkContraindications(
  userConditions: string[],
  peptideId: string
): Contraindication[] {
  if (!userConditions.length || !peptideId) return [];

  const normalizedPeptide = normalizePeptideId(peptideId);
  const matches: Contraindication[] = [];

  for (const rule of CONTRAINDICATION_RULES) {
    // Check if any of the user's conditions match this rule's tags
    const conditionMatch = userConditions.some((userCondition) => {
      const userConditionLower = userCondition.toLowerCase().trim();

      return rule.conditionTags.some((tag) => {
        const tagLower = tag.toLowerCase();
        // Exact match
        if (userConditionLower === tagLower) return true;
        // Substring match (e.g., "diabetic retinopathy" matches "retinopathy")
        if (userConditionLower.includes(tagLower)) return true;
        if (tagLower.includes(userConditionLower)) return true;
        return false;
      });
    });

    if (!conditionMatch) continue;

    // Check if this rule blocks the target peptide
    const blocksAll = rule.blockedPeptides.includes("*");
    const blocksSpecific = rule.blockedPeptides.some(
      (bp) => normalizePeptideId(bp) === normalizedPeptide
    );

    if (blocksAll || blocksSpecific) {
      matches.push(rule);
    }
  }

  return matches;
}

/**
 * Get all contraindications that apply to a specific peptide,
 * regardless of user conditions.
 */
export function getContraindicationsForPeptide(
  peptideId: string
): Contraindication[] {
  const normalized = normalizePeptideId(peptideId);

  return CONTRAINDICATION_RULES.filter((rule) => {
    const blocksAll = rule.blockedPeptides.includes("*");
    const blocksSpecific = rule.blockedPeptides.some(
      (bp) => normalizePeptideId(bp) === normalized
    );
    return blocksAll || blocksSpecific;
  });
}

/**
 * Get all peptides that are contraindicated for a given condition.
 */
export function getBlockedPeptidesForCondition(
  conditionTag: string
): { peptide: string; severity: SeverityLevel; reason: string }[] {
  const tagLower = conditionTag.toLowerCase();
  const results: { peptide: string; severity: SeverityLevel; reason: string }[] = [];

  for (const rule of CONTRAINDICATION_RULES) {
    const tagMatch = rule.conditionTags.some(
      (t) => t.toLowerCase() === tagLower || t.toLowerCase().includes(tagLower)
    );

    if (tagMatch) {
      for (const peptide of rule.blockedPeptides) {
        results.push({
          peptide,
          severity: rule.severity,
          reason: rule.reason,
        });
      }
    }
  }

  return results;
}

/**
 * Get all unique condition tags in the database.
 */
export function getAllConditionTags(): string[] {
  const tags = new Set<string>();
  for (const rule of CONTRAINDICATION_RULES) {
    for (const tag of rule.conditionTags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
