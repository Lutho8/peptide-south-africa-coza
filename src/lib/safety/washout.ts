/**
 * Washout Period Database
 *
 * Defines required waiting periods between doses for each peptide.
 * Washout periods prevent accumulation, receptor desensitization,
 * and overlapping pharmacological effects.
 *
 * These values are based on pharmacokinetic data, half-life calculations,
 * and clinical best practices. Conservative estimates are used where
 * limited data exists.
 */

import { WashoutPeriod } from "./types";

/**
 * Default washout period when no specific data is available.
 * Conservative 48-hour default for safety.
 */
export const DEFAULT_WASHOUT_HOURS = 48;

/**
 * Master database of washout periods for all peptides.
 * Values are in hours from the time of last dose.
 */
export const WASHOUT_PERIODS: WashoutPeriod[] = [
  // ═══════════════════════════════════════════════════════════════
  // GROWTH HORMONE RELEASING HORMONES (GHRH)
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "cjc-1295",
    hours: 48,
    reason:
      "CJC-1295 (no DAC) has a half-life of ~30 minutes but clearance of GH pulses requires approximately 48 hours to prevent overlap and receptor desensitization.",
  },
  {
    peptideId: "cjc-1295-dac",
    hours: 168,
    reason:
      "CJC-1295 with DAC has extended half-life (~6-8 days) due to albumin binding. Dosing more than once per week risks GH receptor desensitization and elevated baseline GH.",
  },
  {
    peptideId: "sermorelin",
    hours: 24,
    reason:
      "Sermorelin has a short half-life (~12 minutes). Daily dosing is standard, but allow at least 24 hours between subcutaneous injections for receptor recovery.",
  },
  {
    peptideId: "tesamorelin",
    hours: 2,
    reason:
      "Tesamorelin (Egrifta) is FDA-approved for daily dosing. The short half-life (~38 minutes) and once-daily labeling support a minimal washout.",
  },
  {
    peptideId: "tesmorelin",
    hours: 2,
    reason: "Alias for tesamorelin — same pharmacokinetics.",
  },

  // ═══════════════════════════════════════════════════════════════
  // GROWTH HORMONE SECRETAGOGUES (GHRP)
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "ipamorelin",
    hours: 24,
    reason:
      "Ipamorelin has a half-life of ~2 hours. While multiple daily doses are common clinically, a 24-hour washout prevents GH receptor downregulation from excessive pulsatile stimulation.",
  },
  {
    peptideId: "ghrp-2",
    hours: 24,
    reason:
      "GHRP-2 half-life is ~15-30 minutes. Frequent dosing can cause receptor desensitization. Minimum 24 hours recommended between standard doses.",
  },
  {
    peptideId: "ghrp-6",
    hours: 24,
    reason:
      "GHRP-6 has a similar profile to GHRP-2. Receptor desensitization risk requires 24-hour spacing for optimal GH response.",
  },
  {
    peptideId: "ghrp2",
    hours: 24,
    reason: "Alias for GHRP-2.",
  },
  {
    peptideId: "ghrp6",
    hours: 24,
    reason: "Alias for GHRP-6.",
  },
  {
    peptideId: "hexarelin",
    hours: 24,
    reason:
      "Hexarelin is a potent GHRP with stronger desensitization potential. 24-hour minimum washout required to maintain efficacy.",
  },
  {
    peptideId: "alexamorelin",
    hours: 24,
    reason:
      "Alexamorelin follows similar GHRP pharmacokinetics. 24-hour washout standard.",
  },

  // ═══════════════════════════════════════════════════════════════
  // GLP-1 RECEPTOR AGONISTS (INCRETINS)
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "semaglutide",
    hours: 168,
    reason:
      "Semaglutide has a prolonged half-life of ~7 days (168 hours) due to albumin binding and resistance to DPP-4 degradation. Weekly dosing is standard.",
  },
  {
    peptideId: "ozempic",
    hours: 168,
    reason: "Brand name for semaglutide — same pharmacokinetics.",
  },
  {
    peptideId: "wegovy",
    hours: 168,
    reason: "Higher-dose brand name for semaglutide — same half-life.",
  },
  {
    peptideId: "tirzepatide",
    hours: 120,
    reason:
      "Tirzepatide (Mounjaro/Zepbound) has a half-life of ~5 days (120 hours) due to fatty acid acylation. Weekly dosing is standard.",
  },
  {
    peptideId: "mounjaro",
    hours: 120,
    reason: "Brand name for tirzepatide — same pharmacokinetics.",
  },
  {
    peptideId: "zepbound",
    hours: 120,
    reason: "Brand name for tirzepatide — same pharmacokinetics.",
  },
  {
    peptideId: "retatrutide",
    hours: 168,
    reason:
      "Retatrutide (triple GIP/GLP-1/GCG agonist) has a long half-life estimated at 5-7 days based on phase 2 data. Weekly dosing standard.",
  },
  {
    peptideId: "liraglutide",
    hours: 24,
    reason:
      "Liraglutide (Victoza/Saxenda) has a 13-hour half-life. Daily dosing is standard with ~24-hour washout.",
  },
  {
    peptideId: "victoza",
    hours: 24,
    reason: "Brand name for liraglutide — same pharmacokinetics.",
  },
  {
    peptideId: "saxenda",
    hours: 24,
    reason: "Weight-loss brand of liraglutide — same pharmacokinetics.",
  },
  {
    peptideId: "dulaglutide",
    hours: 120,
    reason:
      "Dulaglutide (Trulicity) has a ~5-day half-life due to fusion protein structure. Weekly dosing is standard.",
  },
  {
    peptideId: "trulicity",
    hours: 120,
    reason: "Brand name for dulaglutide — same pharmacokinetics.",
  },
  {
    peptideId: "exenatide",
    hours: 24,
    reason:
      "Exenatide (Byetta) immediate-release has a 2.4-hour half-life. Twice-daily dosing with minimum 6-hour spacing, 24 hours for standard washout.",
  },
  {
    peptideId: "bydureon",
    hours: 168,
    reason:
      "Extended-release exenatide has a ~2-week duration. Weekly dosing with 168-hour minimum washout.",
  },

  // ═══════════════════════════════════════════════════════════════
  // TISSUE REPAIR PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "bpc-157",
    hours: 6,
    reason:
      "BPC-157 has a short half-life (~5-10 minutes in plasma) but tissue-level effects persist. The 6-hour washout prevents excessive dosing while maintaining therapeutic levels in target tissues.",
  },
  {
    peptideId: "bpc157",
    hours: 6,
    reason: "Alias for BPC-157.",
  },
  {
    peptideId: "tb-500",
    hours: 168,
    reason:
      "TB-500 (thymosin beta-4 fragment) has effects that persist for several days. Standard dosing is 2x per week. Minimum 48-72 hours between doses, 168 hours for full washout.",
  },
  {
    peptideId: "tb500",
    hours: 168,
    reason: "Alias for TB-500.",
  },
  {
    peptideId: "thymosin-beta-4",
    hours: 168,
    reason: "Full thymosin beta-4 follows similar kinetics to TB-500 fragment.",
  },

  // ═══════════════════════════════════════════════════════════════
  // COGNITIVE / NEUROPEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "semax",
    hours: 12,
    reason:
      "Semax has a short plasma half-life but CNS effects persist for hours. Intranasal dosing typically every 8-12 hours. 12-hour washout for standard protocols.",
  },
  {
    peptideId: "selank",
    hours: 12,
    reason:
      "Selank has similar pharmacokinetics to Semax. 12-hour washout for intranasal protocols.",
  },
  {
    peptideId: "dihexa",
    hours: 24,
    reason:
      "Dihexa is a long-acting hepatocyte growth factor binder with extended CNS activity. Daily dosing with 24-hour washout.",
  },
  {
    peptideId: "cerebrolysin",
    hours: 24,
    reason:
      "Cerebrolysin is a parenteral neuropeptide mixture with complex kinetics. Daily IV/IM dosing standard with 24-hour washout.",
  },
  {
    peptideId: "p21",
    hours: 24,
    reason:
      "P21 peptide has neurogenic effects that require 24-hour spacing for optimal BDNF expression cycles.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MITOCHONDRIAL PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "mots-c",
    hours: 24,
    reason:
      "MOTS-c affects mitochondrial biogenesis with effects that persist beyond its short plasma half-life. Daily dosing standard with 24-hour washout.",
  },
  {
    peptideId: "motsc",
    hours: 24,
    reason: "Alias for MOTS-c.",
  },
  {
    peptideId: "humanin",
    hours: 24,
    reason:
      "Humanin is a mitochondrial-derived peptide with cytoprotective effects. 24-hour washout for standard protocols.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MELANOCORTIN PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "melanotan-ii",
    hours: 48,
    reason:
      "Melanotan-II has a half-life of ~1.5-2 hours but melanogenic effects persist for 24-48 hours. Frequent dosing increases risk of moles, freckles, and potentially dangerous pigmented lesions.",
  },
  {
    peptideId: "melanotan-2",
    hours: 48,
    reason: "Alias for Melanotan-II.",
  },
  {
    peptideId: "mt2",
    hours: 48,
    reason: "Abbreviation for Melanotan-II.",
  },
  {
    peptideId: "melanotan-i",
    hours: 24,
    reason:
      "Melanotan-I (afamelanotide) has a longer half-life. Every 24-48 hours standard dosing.",
  },
  {
    peptideId: "pt-141",
    hours: 24,
    reason:
      "PT-141 (bremelanotide) has an ~2-hour half-life. FDA label specifies minimum 24 hours between doses. Max 8 doses/month.",
  },
  {
    peptideId: "bremelanotide",
    hours: 24,
    reason: "Generic name for PT-141 — same restrictions.",
  },

  // ═══════════════════════════════════════════════════════════════
  // COPPER PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "ghk-cu",
    hours: 12,
    reason:
      "GHK-Cu has a short plasma half-life but tissue remodeling effects persist. 12-hour washout for injectable forms; topical forms may have different kinetics.",
  },
  {
    peptideId: "ghkcu",
    hours: 12,
    reason: "Alias for GHK-Cu.",
  },
  {
    peptideId: "ghk",
    hours: 12,
    reason:
      "GHK (copper-free) follows similar kinetics to GHK-Cu with 12-hour washout.",
  },

  // ═══════════════════════════════════════════════════════════════
  // IMMUNE MODULATORS
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "thymosin-alpha-1",
    hours: 168,
    reason:
      "Thymosin alpha-1 has immunomodulatory effects that persist for days. Standard protocols use 2x weekly dosing (Mon/Thu). 72-hour minimum, 168-hour for full washout.",
  },
  {
    peptideId: "ta1",
    hours: 168,
    reason: "Abbreviation for thymosin alpha-1.",
  },
  {
    peptideId: "thymalfasin",
    hours: 168,
    reason: "Brand name for thymosin alpha-1 (Zadaxin).",
  },
  {
    peptideId: "ll-37",
    hours: 24,
    reason:
      "LL-37 is an antimicrobial peptide with immunomodulatory properties. 24-hour washout between doses.",
  },

  // ═══════════════════════════════════════════════════════════════
  // VASOACTIVE INTESTINAL PEPTIDE / RELAXIN
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "vip",
    hours: 12,
    reason:
      "VIP (vasoactive intestinal peptide) has a very short half-life (~1-2 minutes in plasma). Clinical protocols use continuous infusion or frequent dosing. 12-hour washout for intermittent dosing.",
  },
  {
    peptideId: "relaxin",
    hours: 24,
    reason:
      "Relaxin has vasodilatory and antifibrotic effects. 24-hour washout for standard protocols.",
  },

  // ═══════════════════════════════════════════════════════════════
  // SLEEP PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "dsip",
    hours: 24,
    reason:
      "DSIP (delta sleep-inducing peptide) has effects on sleep architecture that persist beyond its short half-life. Daily evening dosing with 24-hour washout.",
  },
  {
    peptideId: "epitalon",
    hours: 24,
    reason:
      "Epitalon affects telomerase activity with effects that require 24-hour spacing. Standard protocols use 10-day cycles.",
  },

  // ═══════════════════════════════════════════════════════════════
  // ANGIOTENSIN PEPTIDES
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "ace-031",
    hours: 168,
    reason:
      "ACE-031 (ACVR2B-Fc) has a long half-life due to Fc fusion. Weekly dosing standard with 168-hour washout.",
  },
  {
    peptideId: "ace031",
    hours: 168,
    reason: "Alias for ACE-031.",
  },
  {
    peptideId: "follistatin",
    hours: 168,
    reason:
      "Follistatin (various isoforms) has extended activity. Weekly dosing protocols with 168-hour washout.",
  },

  // ═══════════════════════════════════════════════════════════════
  // KISSPEPTIN
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "kisspeptin",
    hours: 24,
    reason:
      "Kisspeptin stimulates GnRH pulsatility with rapid desensitization if overdosed. 24-hour washout preserves sensitivity.",
  },

  // ═══════════════════════════════════════════════════════════════
  // IGF-1 & ANALOGS
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "igf-1",
    hours: 24,
    reason:
      "IGF-1 (mechano growth factor) has a short half-life (~12-15 hours) but potent anabolic effects. Daily dosing maximum to prevent hypoglycemia and organ growth.",
  },
  {
    peptideId: "igf1",
    hours: 24,
    reason: "Alias for IGF-1.",
  },
  {
    peptideId: "mgf",
    hours: 24,
    reason:
      "Mechano growth factor (IGF-1Ec) is an IGF-1 splice variant. Same 24-hour washout as standard IGF-1.",
  },
  {
    peptideId: "des-igf-1",
    hours: 12,
    reason:
      "Des(1-3)IGF-1 is a truncated, more potent form of IGF-1 with higher receptor affinity. Shorter 12-hour washout due to potency.",
  },

  // ═══════════════════════════════════════════════════════════════
  // OXYTOCIN
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "oxytocin",
    hours: 12,
    reason:
      "Oxytocin has a short half-life (1-6 minutes) but behavioral effects persist for hours. 12-hour washout for intranasal dosing.",
  },

  // ═══════════════════════════════════════════════════════════════
  // LATARCIN / ANTIMICROBIAL
  // ═══════════════════════════════════════════════════════════════
  {
    peptideId: "latarcin",
    hours: 24,
    reason:
      "Latarcin is an antimicrobial peptide with potential immunomodulatory effects. 24-hour washout standard.",
  },
];

/**
 * Normalize a peptide ID for consistent matching.
 */
function normalizePeptideId(peptideId: string): string {
  return peptideId.toLowerCase().replace(/[-_\s]/g, "");
}

/**
 * Look up the washout period for a specific peptide.
 *
 * @param peptideId - The peptide identifier
 * @returns The washout period entry, or a default if not found
 */
export function getWashoutPeriod(peptideId: string): WashoutPeriod {
  if (!peptideId) {
    return {
      peptideId: "unknown",
      hours: DEFAULT_WASHOUT_HOURS,
      reason: "No peptide specified. Using default washout period.",
    };
  }

  const normalized = normalizePeptideId(peptideId);

  const match = WASHOUT_PERIODS.find(
    (wp) => normalizePeptideId(wp.peptideId) === normalized
  );

  if (match) return match;

  // Return default with warning
  return {
    peptideId,
    hours: DEFAULT_WASHOUT_HOURS,
    reason: `No specific washout data available for ${peptideId}. Using conservative default of ${DEFAULT_WASHOUT_HOURS} hours.`,
  };
}

/**
 * Check if a washout period has been satisfied since the last dose.
 *
 * @param peptideId - The peptide that was dosed
 * @param lastDoseDate - The date/time of the last dose, or null if never dosed
 * @returns Object indicating if washout is satisfied and time details
 */
export function checkWashoutPeriod(
  peptideId: string,
  lastDoseDate: Date | null
): {
  required: boolean;
  hoursNeeded: number;
  hoursRemaining: number;
  satisfied: boolean;
} {
  const washout = getWashoutPeriod(peptideId);

  // If never dosed before, no washout needed
  if (!lastDoseDate) {
    return {
      required: false,
      hoursNeeded: washout.hours,
      hoursRemaining: 0,
      satisfied: true,
    };
  }

  const now = new Date();
  const elapsedMs = now.getTime() - lastDoseDate.getTime();
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const hoursRemaining = Math.max(0, washout.hours - elapsedHours);
  const satisfied = hoursRemaining <= 0;

  return {
    required: true,
    hoursNeeded: washout.hours,
    hoursRemaining: Math.ceil(hoursRemaining * 10) / 10, // Round to 1 decimal
    satisfied,
  };
}

/**
 * Get all peptide IDs that have defined washout periods.
 */
export function getPeptidesWithWashout(): string[] {
  const peptides = new Set(
    WASHOUT_PERIODS.map((wp) => wp.peptideId.toLowerCase())
  );
  return Array.from(peptides).sort();
}

/**
 * Format a washout duration in hours into a human-readable string.
 */
export function formatWashoutDuration(hours: number): string {
  if (hours >= 168) {
    const weeks = Math.round((hours / 168) * 10) / 10;
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  if (hours >= 24) {
    const days = Math.round((hours / 24) * 10) / 10;
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  if (hours >= 1) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  const minutes = Math.round(hours * 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
