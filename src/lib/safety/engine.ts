/**
 * Clinical Safety Engine
 *
 * Core orchestration module that integrates drug interaction checking,
 * contraindication screening, and washout period validation into a
 * unified safety assessment pipeline.
 *
 * This is the primary entry point for all safety-related operations
 * in the peptide tracking application.
 */

import {
  SafetyCheckResult,
  SafetySummary,
  SeverityLevel,
  SEVERITY_PRIORITY,
  UserSafetyProfile,
  DrugPeptideInteraction,
  Contraindication,
} from "./types";
import { checkDrugInteractions } from "./interactions";
import { checkContraindications } from "./contraindications";
import { checkWashoutPeriod } from "./washout";

/**
 * Options for running a comprehensive safety check.
 */
export interface SafetyCheckOptions {
  /** User's complete safety profile including medications and conditions */
  userProfile: UserSafetyProfile;
  /** The peptide being evaluated for administration */
  peptideId: string;
  /** IDs of peptides currently in active protocols */
  currentProtocols: string[];
  /** Record of last dose dates keyed by peptide ID */
  lastDoseDates: Record<string, Date>;
}

/**
 * Run a comprehensive safety check combining all three safety domains:
 * drug interactions, medical contraindications, and washout periods.
 *
 * @param options - Safety check configuration
 * @returns Complete safety check result with all findings
 */
export function runSafetyCheck(options: SafetyCheckOptions): SafetyCheckResult {
  const { userProfile, peptideId, currentProtocols, lastDoseDates } = options;

  // Validate inputs
  if (!peptideId || peptideId.trim() === "") {
    return createEmptyResult("No peptide specified for safety check.");
  }

  const normalizedPeptideId = peptideId.toLowerCase().trim();

  // ── Check 1: Drug-Peptide Interactions ──────────────────────────
  const interactions: DrugPeptideInteraction[] = checkDrugInteractions(
    userProfile.medications,
    normalizedPeptideId
  );

  // ── Check 2: Medical Contraindications ──────────────────────────
  const contraindications: Contraindication[] = checkContraindications(
    userProfile.medicalConditions,
    normalizedPeptideId
  );

  // ── Check 3: Pregnancy Status ───────────────────────────────────
  if (userProfile.pregnancyStatus === "pregnant") {
    contraindications.push({
      condition: "Pregnancy",
      conditionTags: ["pregnancy"],
      blockedPeptides: ["*"],
      severity: "fatal",
      reason:
        "User profile indicates active pregnancy. ALL peptides are contraindicated during pregnancy due to unknown fetal risks.",
    });
  }
  if (userProfile.pregnancyStatus === "planning") {
    contraindications.push({
      condition: "Planning Pregnancy",
      conditionTags: ["planning pregnancy"],
      blockedPeptides: ["*"],
      severity: "critical",
      reason:
        "User is planning pregnancy. All peptides should be discontinued. Consult healthcare provider for washout guidance.",
    });
  }

  // ── Check 4: Age-Based Contraindication ─────────────────────────
  if (userProfile.age !== null && userProfile.age < 18) {
    contraindications.push({
      condition: "Pediatric Age (Under 18)",
      conditionTags: ["under 18", "pediatric"],
      blockedPeptides: ["*"],
      severity: "critical",
      reason:
        "User is under 18 years of age. Research peptides are strictly contraindicated in pediatric populations due to unknown effects on development.",
    });
  }

  // ── Check 5: Washout Period Violations ──────────────────────────
  const washoutViolations: {
    peptide: string;
    neededHours: number;
    remainingHours: number;
  }[] = [];

  // Check washout for the target peptide
  const targetWashout = checkWashoutPeriod(
    normalizedPeptideId,
    lastDoseDates[normalizedPeptideId] ?? null
  );

  if (targetWashout.required && !targetWashout.satisfied) {
    washoutViolations.push({
      peptide: normalizedPeptideId,
      neededHours: targetWashout.hoursNeeded,
      remainingHours: targetWashout.hoursRemaining,
    });
  }

  // Also check washout against other peptides in current protocols
  // (Some peptides may interact if dosed too close together)
  for (const protocolPeptide of currentProtocols) {
    const normalizedProtocol = protocolPeptide.toLowerCase().trim();
    if (normalizedProtocol === normalizedPeptideId) continue;

    const protocolWashout = checkWashoutPeriod(
      normalizedProtocol,
      lastDoseDates[normalizedProtocol] ?? null
    );

    // If another peptide was dosed very recently, flag potential overlap
    if (protocolWashout.required && !protocolWashout.satisfied) {
      // Check if there's an interaction between these two peptides
      const crossInteraction = checkPeptideCrossInteraction(
        normalizedProtocol,
        normalizedPeptideId
      );

      if (crossInteraction) {
        washoutViolations.push({
          peptide: normalizedProtocol,
          neededHours: protocolWashout.hoursNeeded,
          remainingHours: protocolWashout.hoursRemaining,
        });
      }
    }
  }

  // ── Determine Highest Severity ──────────────────────────────────
  const highestSeverity = determineHighestSeverity(
    interactions,
    contraindications,
    washoutViolations
  );

  // ── Determine Pass/Fail ─────────────────────────────────────────
  // A check fails if there are any fatal or critical findings
  const hasFatal =
    interactions.some((i) => i.severity === "fatal") ||
    contraindications.some((c) => c.severity === "fatal");
  const hasCritical =
    interactions.some((i) => i.severity === "critical") ||
    contraindications.some((c) => c.severity === "critical");

  const passed = !hasFatal && !hasCritical;

  return {
    passed,
    interactions,
    contraindications,
    washoutViolations,
    highestSeverity,
  };
}

/**
 * Check if a multi-peptide protocol is safe given a user's safety profile.
 * Evaluates each peptide individually and checks for cross-interactions.
 *
 * @param safetyProfile - User's complete safety profile
 * @param protocolIds - Array of peptide IDs in the proposed protocol
 * @returns true if the protocol is considered safe, false otherwise
 */
export function isProtocolSafe(
  safetyProfile: UserSafetyProfile,
  protocolIds: string[]
): boolean {
  if (!protocolIds.length) return true;

  for (const peptideId of protocolIds) {
    const result = runSafetyCheck({
      userProfile: safetyProfile,
      peptideId,
      currentProtocols: protocolIds.filter((id) => id !== peptideId),
      lastDoseDates: {}, // Assume no recent doses for protocol evaluation
    });

    if (!result.passed) {
      return false;
    }
  }

  // Check for problematic peptide combinations
  const dangerousCombos = findDangerousCombinations(protocolIds);
  if (dangerousCombos.length > 0) {
    return false;
  }

  return true;
}

/**
 * Generate a user-friendly safety summary from check results.
 *
 * @param results - The safety check results to summarize
 * @returns A structured summary with safety status, message, and recommended actions
 */
export function getSafetySummary(results: SafetyCheckResult): SafetySummary {
  const { passed, interactions, contraindications, washoutViolations } = results;

  // Count issues by severity
  const fatalCount = countBySeverity(interactions, contraindications, "fatal");
  const criticalCount = countBySeverity(
    interactions,
    contraindications,
    "critical"
  );
  const warningCount = countBySeverity(
    interactions,
    contraindications,
    "warning"
  );
  const infoCount = countBySeverity(interactions, contraindications, "info");

  const totalIssues =
    interactions.length +
    contraindications.length +
    washoutViolations.length;

  // Build message
  let message: string;
  if (fatalCount > 0) {
    message = `FATAL safety issue${fatalCount > 1 ? "s" : ""} detected. This peptide is absolutely contraindicated under current conditions. Administration could result in serious harm or death.`;
  } else if (criticalCount > 0) {
    message = `Critical safety concern${criticalCount > 1 ? "s" : ""} identified. This peptide should not be used without immediate medical consultation and risk mitigation.`;
  } else if (warningCount > 0) {
    message = `${warningCount} warning${warningCount > 1 ? "s" : ""} identified. Use with caution and appropriate monitoring.`;
  } else if (infoCount > 0) {
    message = `${infoCount} informational notice${infoCount > 1 ? "s" : ""} available. No immediate action required.`;
  } else if (washoutViolations.length > 0) {
    message = `Washout period not yet satisfied. Please wait before next administration.`;
  } else {
    message = "No safety concerns identified for this peptide based on current profile.";
  }

  // Build action items
  const actions: string[] = [];

  if (fatalCount > 0) {
    actions.push("DO NOT ADMINISTER this peptide.");
    actions.push("Consult a qualified healthcare provider immediately.");
    actions.push("Review alternative treatment options with your care team.");
  }

  if (criticalCount > 0) {
    actions.push("Consult your healthcare provider before proceeding.");
    actions.push(
      "Discuss risk mitigation strategies if peptide therapy is essential."
    );
  }

  if (warningCount > 0) {
    actions.push("Monitor for adverse effects during treatment.");
    actions.push("Consider starting at a reduced dose.");
  }

  if (washoutViolations.length > 0) {
    for (const v of washoutViolations) {
      actions.push(
        `Wait ${formatHours(v.remainingHours)} before next ${v.peptide} dose (minimum ${formatHours(v.neededHours)} washout required).`
      );
    }
  }

  if (interactions.length > 0) {
    const drugNames = [
      ...new Set(interactions.map((i) => i.drug)),
    ];
    if (drugNames.length <= 3) {
      actions.push(
        `Review medication interactions with: ${drugNames.join(", ")}.`
      );
    } else {
      actions.push(
        `Review ${drugNames.length} medication interactions with your pharmacist or physician.`
      );
    }
  }

  if (contraindications.length > 0) {
    const conditions = contraindications.map((c) => c.condition);
    if (conditions.length <= 2) {
      actions.push(
        `Medical review recommended for: ${conditions.join(", ")}.`
      );
    }
  }

  if (actions.length === 0) {
    actions.push("Continue standard monitoring and dosing protocol.");
  }

  return {
    safe: passed && totalIssues === 0,
    message,
    actions,
  };
}

/**
 * Determine if a specific severity level blocks administration.
 * Fatal and critical severities should block use.
 */
export function severityBlocksAdministration(
  severity: SeverityLevel
): boolean {
  return severity === "fatal" || severity === "critical";
}

/**
 * Compare two severity levels.
 * @returns positive if a > b, negative if a < b, 0 if equal
 */
export function compareSeverity(
  a: SeverityLevel,
  b: SeverityLevel
): number {
  return SEVERITY_PRIORITY[a] - SEVERITY_PRIORITY[b];
}

/**
 * Get the more severe of two severity levels.
 */
export function getHigherSeverity(
  a: SeverityLevel,
  b: SeverityLevel
): SeverityLevel {
  return compareSeverity(a, b) >= 0 ? a : b;
}

// ─────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Create an empty result for error cases.
 */
function createEmptyResult(reason: string): SafetyCheckResult {
  return {
    passed: false,
    interactions: [],
    contraindications: [],
    washoutViolations: [],
    highestSeverity: null,
  };
}

/**
 * Determine the highest severity across all findings.
 */
function determineHighestSeverity(
  interactions: DrugPeptideInteraction[],
  contraindications: Contraindication[],
  washoutViolations: { peptide: string; neededHours: number; remainingHours: number }[]
): SeverityLevel | null {
  let highest: SeverityLevel | null = null;

  for (const interaction of interactions) {
    if (!highest || compareSeverity(interaction.severity, highest) > 0) {
      highest = interaction.severity;
    }
  }

  for (const contraindication of contraindications) {
    if (!highest || compareSeverity(contraindication.severity, highest) > 0) {
      highest = contraindication.severity;
    }
  }

  // Washout violations are at most "warning" level
  if (washoutViolations.length > 0 && !highest) {
    highest = "warning";
  }

  return highest;
}

/**
 * Count total findings of a specific severity.
 */
function countBySeverity(
  interactions: DrugPeptideInteraction[],
  contraindications: Contraindication[],
  severity: SeverityLevel
): number {
  const interactionCount = interactions.filter(
    (i) => i.severity === severity
  ).length;
  const contraindicationCount = contraindications.filter(
    (c) => c.severity === severity
  ).length;
  return interactionCount + contraindicationCount;
}

/**
 * Format hours into a human-readable string.
 */
function formatHours(hours: number): string {
  if (hours >= 24) {
    const days = Math.round((hours / 24) * 10) / 10;
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  return `${Math.round(hours * 10) / 10} hour${hours !== 1 ? "s" : ""}`;
}

/**
 * Check if two peptides have known cross-interactions when used together.
 * This identifies problematic combinations beyond individual safety checks.
 */
function checkPeptideCrossInteraction(
  peptideA: string,
  peptideB: string
): boolean {
  // Define known problematic peptide pairs
  const problematicPairs: [string, string][] = [
    // Dual GLP-1 agonists
    ["semaglutide", "tirzepatide"],
    ["semaglutide", "liraglutide"],
    ["tirzepatide", "liraglutide"],
    // Dual GHRP stacking without GHRH
    ["ghrp-2", "ghrp-6"],
    ["ipamorelin", "ghrp-2"],
    ["ipamorelin", "ghrp-6"],
    // Excessive GH stimulation
    ["cjc-1295", "sermorelin"],
    ["cjc-1295", "tesamorelin"],
    ["sermorelin", "tesamorelin"],
    // Dual tissue repair (unlikely harmful but redundant)
    ["bpc-157", "bpc-157"], // Self-check (duplicate dosing)
  ];

  const normA = peptideA.toLowerCase().replace(/[-_\s]/g, "");
  const normB = peptideB.toLowerCase().replace(/[-_\s]/g, "");

  return problematicPairs.some(
    ([a, b]) =>
      (normA.includes(a.replace(/[-_\s]/g, "")) &&
        normB.includes(b.replace(/[-_\s]/g, ""))) ||
      (normA.includes(b.replace(/[-_\s]/g, "")) &&
        normB.includes(a.replace(/[-_\s]/g, "")))
  );
}

/**
 * Find dangerous combinations within a protocol.
 */
function findDangerousCombinations(protocolIds: string[]): string[][] {
  const dangerous: string[][] = [];

  for (let i = 0; i < protocolIds.length; i++) {
    for (let j = i + 1; j < protocolIds.length; j++) {
      if (checkPeptideCrossInteraction(protocolIds[i], protocolIds[j])) {
        dangerous.push([protocolIds[i], protocolIds[j]]);
      }
    }
  }

  return dangerous;
}

/**
 * Run batch safety check across multiple peptides.
 * Useful for reviewing entire protocols or comparing options.
 */
export function runBatchSafetyCheck(
  options: Omit<SafetyCheckOptions, "peptideId"> & { peptideIds: string[] }
): { peptideId: string; result: SafetyCheckResult }[] {
  const { peptideIds, userProfile, currentProtocols, lastDoseDates } = options;

  return peptideIds.map((peptideId) => ({
    peptideId,
    result: runSafetyCheck({
      userProfile,
      peptideId,
      currentProtocols,
      lastDoseDates,
    }),
  }));
}
