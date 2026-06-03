/**
 * Pharmacokinetic (PK) Types
 * Core interfaces for peptide PK simulation
 */

/** PK parameters for a specific peptide compound */
export interface PKParameters {
  peptideId: string;
  peptideName: string;
  halfLifeHours: number; // elimination half-life (hours)
  absorptionRateKa: number; // absorption rate constant (1/hr)
  bioavailability: number; // 0-1
  volumeOfDistribution: number; // L/kg
  clearance?: number; // L/hr/kg
  timeToPeakHours: number; // Tmax (hours)
  unit: string; // display unit (mcg, mg, ng/mL)
}

/** A single dose administration event */
export interface DoseEvent {
  timeHours: number; // hours from start of simulation
  amountMg: number; // dose in mg
  peptideId: string;
}

/** A single concentration-time data point */
export interface ConcentrationPoint {
  timeHours: number;
  concentration: number; // ng/mL
  active: boolean; // is concentration above therapeutic threshold
}

/** Complete PK simulation output */
export interface PKSimulationResult {
  points: ConcentrationPoint[];
  maxConcentration: number;
  timeToPeak: number;
  steadyStateReached: boolean;
  estimatedCurrentLevel: number; // at the end of the simulation window
  troughConcentration: number;
  auc: number; // area under curve (ng·hr/mL)
}

/** Therapeutic window for a peptide (ng/mL) */
export interface TherapeuticWindow {
  min: number;
  max: number;
}

/** Admin route affects bioavailability */
export type AdminRoute =
  | "subcutaneous"
  | "intramuscular"
  | "intravenous"
  | "oral"
  | "nasal";

/** Dose schedule template */
export interface DoseSchedule {
  label: string;
  frequencyHours: number;
  amountMg: number;
}

/** Simulation options */
export interface SimulationOptions {
  timeWindowHours: number;
  timeStepMinutes: number;
  bodyWeightKg?: number;
  route?: AdminRoute;
}
