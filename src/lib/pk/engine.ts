/**
 * PK Calculation Engine
 *
 * Implements the Bateman equation for multi-dose pharmacokinetic simulation:
 *
 *   C(t) = Σ (F·D·ka / (Vd·(ka - ke))) · (e^(-ke·(t-td)) - e^(-ka·(t-td)))
 *
 * For each dose administered at time td, where:
 *   F  = bioavailability
 *   D  = dose (converted from mg to ng/mL equivalent)
 *   ka = absorption rate constant  (1/hr)
 *   ke = elimination rate constant = ln(2) / t½
 *   Vd = volume of distribution    (L/kg)
 *   td = dose administration time  (hr)
 *   t  = evaluation time point     (hr)
 *
 * Steady-state approximation: concentration after n regular doses
 * approaches the geometric-series sum of individual dose contributions.
 */

import {
  PKParameters,
  DoseEvent,
  ConcentrationPoint,
  PKSimulationResult,
  SimulationOptions,
  TherapeuticWindow,
} from "./types";
import { getTherapeuticWindow } from "./compounds";

const LN2 = Math.log(2);

/** Convert mg dose to ng for concentration calculations */
function mgToNg(mg: number): number {
  return mg * 1e6; // mg → ng
}

/** Compute elimination rate constant ke from half-life */
export function eliminationRate(halfLifeHours: number): number {
  if (halfLifeHours <= 0) throw new Error("Half-life must be > 0");
  return LN2 / halfLifeHours;
}

/**
 * Single-dose Bateman function.
 * Returns serum concentration (ng/mL) at time t from one dose.
 */
export function batemanConcentration(
  t: number,
  doseMg: number,
  params: PKParameters
): number {
  const { bioavailability: F, absorptionRateKa: ka, halfLifeHours, volumeOfDistribution: vd } = params;
  const ke = eliminationRate(halfLifeHours);

  // Guard: ka must not equal ke (degenerate case)
  const kaEff = Math.abs(ka - ke) < 1e-6 ? ke * 1.001 : ka;

  const doseNg = mgToNg(doseMg);
  const coefficient = (F * doseNg * kaEff) / (vd * (kaEff - ke));

  if (t <= 0) return 0;

  const termElim = Math.exp(-ke * t);
  const termAbs = Math.exp(-kaEff * t);

  return Math.max(0, coefficient * (termElim - termAbs));
}

/**
 * Multi-dose superposition.
 * Sums Bateman contributions from all doses at time t.
 */
export function multiDoseConcentration(
  t: number,
  doses: DoseEvent[],
  params: PKParameters
): number {
  let total = 0;
  for (const dose of doses) {
    const elapsed = t - dose.timeHours;
    if (elapsed >= 0) {
      total += batemanConcentration(elapsed, dose.amountMg, params);
    }
  }
  return total;
}

/**
 * Simulate PK curve over a time window.
 */
export function simulatePK(
  params: PKParameters,
  doses: DoseEvent[],
  options: Partial<SimulationOptions> = {}
): PKSimulationResult {
  const {
    timeWindowHours = 168,
    timeStepMinutes = 30,
  } = options;

  if (!doses || doses.length === 0) {
    return {
      points: [],
      maxConcentration: 0,
      timeToPeak: 0,
      steadyStateReached: false,
      estimatedCurrentLevel: 0,
      troughConcentration: 0,
      auc: 0,
    };
  }

  // Sort doses chronologically
  const sortedDoses = [...doses].sort((a, b) => a.timeHours - b.timeHours);

  // Filter to relevant doses (within a reasonable lookback)
  const maxLookback = Math.max(timeWindowHours, params.halfLifeHours * 10);
  const relevantDoses = sortedDoses.filter(
    (d) => d.timeHours >= -maxLookback && d.timeHours <= timeWindowHours
  );

  const stepHours = timeStepMinutes / 60;
  const numSteps = Math.ceil(timeWindowHours / stepHours);
  const points: ConcentrationPoint[] = [];
  const therapeutic = getTherapeuticWindow(params.peptideId);
  const threshold = therapeutic?.min ?? 0;

  let maxConcentration = 0;
  let timeToPeak = 0;
  let auc = 0; // trapezoidal integration
  let prevConc = 0;
  let prevTime = 0;

  for (let i = 0; i <= numSteps; i++) {
    const t = i * stepHours;
    const concentration = multiDoseConcentration(t, relevantDoses, params);
    const active = concentration >= threshold;

    points.push({ timeHours: t, concentration, active });

    if (concentration > maxConcentration) {
      maxConcentration = concentration;
      timeToPeak = t;
    }

    // AUC by trapezoidal rule
    if (i > 0) {
      auc += ((concentration + prevConc) / 2) * (t - prevTime);
    }
    prevConc = concentration;
    prevTime = t;
  }

  // Trough: minimum concentration between last two doses (or first half of window)
  const troughConcentration = findTroughConcentration(points, relevantDoses);

  // Steady-state check: are we within 5% of theoretical steady state?
  const steadyStateTime = estimateTimeToSteadyState(params.halfLifeHours);
  const lastTime = points.length > 0 ? points[points.length - 1].timeHours : 0;
  const steadyStateReached = lastTime >= steadyStateTime * 0.8;

  const estimatedCurrentLevel =
    points.length > 0 ? points[points.length - 1].concentration : 0;

  return {
    points,
    maxConcentration,
    timeToPeak,
    steadyStateReached,
    estimatedCurrentLevel,
    troughConcentration,
    auc,
  };
}

/** Find the trough concentration (minimum pre-dose level) */
function findTroughConcentration(
  points: ConcentrationPoint[],
  doses: DoseEvent[]
): number {
  if (points.length === 0 || doses.length === 0) return 0;

  const sortedDoses = [...doses].sort((a, b) => a.timeHours - b.timeHours);
  let minPreDose = Infinity;

  for (let i = 1; i < sortedDoses.length; i++) {
    const doseTime = sortedDoses[i].timeHours;
    // Find the point just before this dose
    const preDosePoint = points
      .filter((p) => p.timeHours < doseTime)
      .pop();
    if (preDosePoint && preDosePoint.concentration < minPreDose) {
      minPreDose = preDosePoint.concentration;
    }
  }

  return minPreDose === Infinity ? 0 : minPreDose;
}

/**
 * Calculate the current active concentration.
 * Assumes the last dose in the array was administered "now".
 */
export function calculateCurrentLevel(
  params: PKParameters,
  doses: DoseEvent[]
): number {
  if (!doses || doses.length === 0) return 0;
  const sortedDoses = [...doses].sort((a, b) => a.timeHours - b.timeHours);
  const lastDoseTime = sortedDoses[sortedDoses.length - 1].timeHours;
  // Evaluate at t = lastDoseTime ("now")
  return multiDoseConcentration(lastDoseTime, sortedDoses, params);
}

/**
 * Estimate time to reach ~95% of steady-state concentration.
 * Rule of thumb: 4-5 half-lives.
 */
export function estimateTimeToSteadyState(halfLifeHours: number): number {
  return halfLifeHours * 5;
}

/**
 * Estimate how many regular doses are needed to reach steady state.
 */
export function estimateDosesToSteadyState(
  halfLifeHours: number,
  dosingIntervalHours: number
): number {
  const steadyStateTime = estimateTimeToSteadyState(halfLifeHours);
  return Math.ceil(steadyStateTime / dosingIntervalHours);
}

/**
 * Generate a regular dosing schedule.
 */
export function generateDoseSchedule(
  peptideId: string,
  amountMg: number,
  frequencyHours: number,
  totalHours: number,
  startOffsetHours: number = 0
): DoseEvent[] {
  const doses: DoseEvent[] = [];
  for (let t = startOffsetHours; t <= totalHours; t += frequencyHours) {
    doses.push({ timeHours: t, amountMg, peptideId });
  }
  return doses;
}

/**
 * Suggest next optimal dose timing based on current levels.
 */
export function suggestNextDose(
  params: PKParameters,
  doses: DoseEvent[],
  therapeutic: TherapeuticWindow | undefined
): {
  suggestedTimeHours: number;
  reason: string;
} {
  const sortedDoses = [...doses].sort((a, b) => a.timeHours - b.timeHours);
  const lastDose = sortedDoses[sortedDoses.length - 1];

  if (!lastDose) {
    return { suggestedTimeHours: 0, reason: "No previous doses recorded" };
  }

  const currentLevel = calculateCurrentLevel(params, doses);
  const minLevel = therapeutic?.min ?? 0;
  const ke = eliminationRate(params.halfLifeHours);

  if (currentLevel <= minLevel * 1.1) {
    return {
      suggestedTimeHours: lastDose.timeHours + params.halfLifeHours * 0.5,
      reason: "Levels approaching therapeutic threshold",
    };
  }

  // Calculate when level drops to min therapeutic
  // C(t) = C0 * e^(-ke*t) → t = ln(C0/min) / ke
  if (currentLevel > minLevel && minLevel > 0) {
    const timeToTrough = Math.log(currentLevel / minLevel) / ke;
    return {
      suggestedTimeHours: lastDose.timeHours + timeToTrough,
      reason: "Dose when level reaches therapeutic floor",
    };
  }

  return {
    suggestedTimeHours: lastDose.timeHours + params.halfLifeHours * 0.8,
    reason: "Standard interval based on half-life",
  };
}

/**
 * Format concentration value for display.
 */
export function formatConcentration(
  value: number,
  unit: string = "ng/mL"
): string {
  if (value < 0.01) return `< 0.01 ${unit}`;
  if (value < 1) return `${value.toFixed(2)} ${unit}`;
  if (value < 100) return `${value.toFixed(1)} ${unit}`;
  return `${Math.round(value)} ${unit}`;
}

/**
 * Format time duration into human-readable string.
 */
export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hr`;
  const days = hours / 24;
  if (days < 7) return `${days.toFixed(1)} days`;
  if (days < 30) return `${Math.round(days)} days`;
  const weeks = days / 7;
  return `${weeks.toFixed(1)} weeks`;
}

/**
 * Convert absolute date to simulation hours relative to a start time.
 */
export function dateToSimHours(
  date: Date,
  simulationStart: Date
): number {
  return (date.getTime() - simulationStart.getTime()) / (1000 * 60 * 60);
}
