/**
 * Safety Engine Types
 *
 * Core type definitions for the Clinical Safety Engine used throughout
 * the peptide tracking application. These types enforce strict safety
 * checking for drug interactions, contraindications, and washout periods.
 */

/** Severity levels for safety alerts, ordered from most to least severe */
export type SeverityLevel = "fatal" | "critical" | "warning" | "info";

/** Priority order for severity levels - used for comparison and sorting */
export const SEVERITY_PRIORITY: Record<SeverityLevel, number> = {
  fatal: 4,
  critical: 3,
  warning: 2,
  info: 1,
};

/**
 * Represents a known drug-peptide interaction.
 * Each entry documents a specific combination of a pharmaceutical drug
 * and a peptide that produces a clinically relevant effect.
 */
export interface DrugPeptideInteraction {
  /** Name of the drug (e.g., "Fluoxetine", "Metformin") */
  drug: string;
  /** Drug class tags for broader matching (e.g., ['ssri'], ['anticoagulant']) */
  drugClasses?: string[];
  /** Peptide ID or name involved in the interaction */
  peptide: string;
  /** Clinical severity of this interaction */
  severity: SeverityLevel;
  /** Biological or pharmacological mechanism of the interaction */
  mechanism: string;
  /** Clinical recommendation for managing this interaction */
  recommendation: string;
  /** Reference source (e.g., "FDA Label", "Clinical Study") */
  source: string;
}

/**
 * Represents a medical condition that contraindicates peptide use.
 * Conditions can block specific peptides or all peptides entirely.
 */
export interface Contraindication {
  /** Human-readable condition name */
  condition: string;
  /** Searchable tags for fuzzy matching against user conditions */
  conditionTags: string[];
  /**
   * List of peptide IDs that are blocked by this condition.
   * Use ['*'] to block all peptides for this condition.
   */
  blockedPeptides: string[];
  /** Clinical severity of proceeding despite this contraindication */
  severity: SeverityLevel;
  /** Detailed medical explanation for the contraindication */
  reason: string;
}

/**
 * Defines the required waiting period (washout) between doses
 * of a specific peptide to prevent overlap or accumulation.
 */
export interface WashoutPeriod {
  /** Peptide identifier */
  peptideId: string;
  /** Required hours between doses */
  hours: number;
  /** Optional explanation for why this washout is required */
  reason?: string;
}

/**
 * Comprehensive result from running the safety engine.
 * Aggregates all potential safety concerns for a peptide administration.
 */
export interface SafetyCheckResult {
  /** Whether the safety check passed (no fatal/critical issues) */
  passed: boolean;
  /** All identified drug-peptide interactions */
  interactions: DrugPeptideInteraction[];
  /** All matched contraindications */
  contraindications: Contraindication[];
  /** Washout period violations with timing details */
  washoutViolations: {
    peptide: string;
    neededHours: number;
    remainingHours: number;
  }[];
  /** Highest severity level found across all checks, or null if none */
  highestSeverity: SeverityLevel | null;
}

/**
 * User safety profile containing all medically relevant information
 * needed to evaluate peptide safety.
 */
export interface UserSafetyProfile {
  /** List of current medications (drug names) */
  medications: string[];
  /** List of diagnosed medical conditions */
  medicalConditions: string[];
  /** List of known allergies */
  allergies: string[];
  /** Pregnancy status for reproductive safety screening */
  pregnancyStatus: "not-pregnant" | "pregnant" | "planning" | null;
  /** User age in years, used for age-based contraindications */
  age: number | null;
}

/**
 * Normalized safety summary for UI display.
 * Provides a user-friendly interpretation of safety check results.
 */
export interface SafetySummary {
  /** Whether the overall safety status is acceptable */
  safe: boolean;
  /** Human-readable summary message */
  message: string;
  /** Recommended actions based on the safety check */
  actions: string[];
}
