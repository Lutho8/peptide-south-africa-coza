import { useMemo } from "react";
import { DoseEvent, PKSimulationResult } from "@/types";

// Default half-lives for known peptides (hours)
const HALF_LIFE_MAP: Record<string, number> = {
  "bpc-157": 6,
  "tb-500": 12,
  "cjc-1295": 168,
  "ipamorelin": 2,
  "semaglutide": 168,
  "tirzepatide": 120,
  "pt-141": 2.5,
  "melanotan-ii": 1.5,
  "growth-hormone-releasing-peptide": 1.5,
  "tesamorelin": 0.5,
  "sermorelin": 0.5,
  "hexarelin": 1,
};

function getHalfLife(peptideId: string): number {
  return HALF_LIFE_MAP[peptideId] ?? 12; // default 12h
}

/**
 * Calculate drug concentration at a given time using exponential decay.
 * C(t) = C0 * (0.5)^(t / t_half)
 */
function concentrationAtTime(
  initialConcentration: number,
  timeHours: number,
  halfLifeHours: number
): number {
  if (timeHours < 0 || halfLifeHours <= 0) return 0;
  return initialConcentration * Math.pow(0.5, timeHours / halfLifeHours);
}

/**
 * Simulate PK curve for multiple doses
 */
function simulatePK(
  peptideId: string,
  doses: DoseEvent[],
  timeSpanHours: number = 168, // 1 week default
  resolution: number = 24 // hourly points
): PKSimulationResult {
  const halfLifeHours = getHalfLife(peptideId);

  if (doses.length === 0) {
    return {
      peptideId,
      timePoints: [],
      concentrations: [],
      halfLifeHours,
      maxConcentration: 0,
      steadyStateTime: 0,
    };
  }

  // Sort doses by timestamp
  const sortedDoses = [...doses].sort((a, b) => a.timestamp - b.timestamp);
  const now = Date.now();

  // Generate time points (past to future)
  const timePoints: number[] = [];
  const concentrations: number[] = [];

  const startTime = now - timeSpanHours * 0.5 * 3600 * 1000; // Start from middle of span
  const stepMs = (timeSpanHours * 3600 * 1000) / resolution;

  let maxConcentration = 0;

  for (let i = 0; i <= resolution; i++) {
    const t = startTime + i * stepMs;
    const hoursSinceStart = (t - startTime) / (3600 * 1000);
    timePoints.push(hoursSinceStart);

    // Sum contributions from all doses
    let totalConcentration = 0;
    for (const dose of sortedDoses) {
      const hoursSinceDose = (t - dose.timestamp) / (3600 * 1000);
      if (hoursSinceDose >= 0) {
        // Assume bioavailability of ~100%, scale concentration with dose
        const c0 = dose.amountMg * 0.1; // Arbitrary scaling for display
        const c = concentrationAtTime(c0, hoursSinceDose, halfLifeHours);
        totalConcentration += c;
      }
    }

    concentrations.push(totalConcentration);
    if (totalConcentration > maxConcentration) {
      maxConcentration = totalConcentration;
    }
  }

  // Steady state is typically reached after ~5 half-lives
  const steadyStateTime = halfLifeHours * 5;

  return {
    peptideId,
    timePoints,
    concentrations,
    halfLifeHours,
    maxConcentration,
    steadyStateTime,
  };
}

/**
 * Hook: usePKSimulator
 * Returns a full PK simulation result for a peptide and its dose history.
 * Memoized to avoid recalculation on every render.
 */
export function usePKSimulator(
  peptideId: string,
  doses: DoseEvent[],
  timeSpanHours?: number
): PKSimulationResult {
  return useMemo(
    () => simulatePK(peptideId, doses, timeSpanHours),
    [peptideId, doses, timeSpanHours]
  );
}

/**
 * Hook: useCurrentLevel
 * Returns the estimated current concentration from the most recent dose.
 */
export function useCurrentLevel(peptideId: string, lastDose: DoseEvent): number {
  const halfLifeHours = getHalfLife(peptideId);

  return useMemo(() => {
    const hoursSinceDose = (Date.now() - lastDose.timestamp) / (3600 * 1000);
    if (hoursSinceDose < 0) return 0;
    const c0 = lastDose.amountMg * 0.1;
    return concentrationAtTime(c0, hoursSinceDose, halfLifeHours);
  }, [peptideId, lastDose, halfLifeHours]);
}
