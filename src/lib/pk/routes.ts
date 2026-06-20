/**
 * Route-of-administration adjustments for PK parameters.
 *
 * The compound database stores subcutaneous defaults. Other routes adjust
 * bioavailability (F), absorption rate (ka), and time-to-peak (tmax).
 *
 * Values are rounded literature estimates for peptide-class drugs and are
 * intended for educational simulation only.
 */

import type { PKParameters, AdminRoute } from "./types";

export const ROUTE_LABELS: Record<AdminRoute, string> = {
  subcutaneous: "SubQ",
  intramuscular: "IM",
  intravenous: "IV",
  nasal: "Intranasal",
  oral: "Oral",
};

/** Multipliers applied to subcutaneous baseline params. */
interface RouteFactor {
  fMul: number;       // bioavailability multiplier (capped at 1.0)
  kaMul: number;      // absorption rate multiplier
  tmaxMul: number;    // time-to-peak multiplier
}

const ROUTE_FACTORS: Record<AdminRoute, RouteFactor> = {
  subcutaneous:    { fMul: 1.0,  kaMul: 1.0,  tmaxMul: 1.0 },
  intramuscular:   { fMul: 1.0,  kaMul: 1.5,  tmaxMul: 0.6 },
  // IV: full bioavailability, near-instant peak (modeled with very high ka).
  intravenous:     { fMul: 1.0 / 0.85 /* offset typical 0.85 F */, kaMul: 20.0, tmaxMul: 0.05 },
  nasal:           { fMul: 0.35, kaMul: 4.0,  tmaxMul: 0.25 },
  oral:            { fMul: 0.05, kaMul: 1.2,  tmaxMul: 1.5 },
};

export function getRouteFactor(route: AdminRoute): RouteFactor {
  return ROUTE_FACTORS[route] ?? ROUTE_FACTORS.subcutaneous;
}

/**
 * Apply route adjustments to baseline PK parameters.
 * Returns a new PKParameters object — does not mutate the input.
 */
export function adjustParamsForRoute(
  base: PKParameters,
  route: AdminRoute
): PKParameters {
  const f = getRouteFactor(route);
  return {
    ...base,
    bioavailability: Math.min(1, base.bioavailability * f.fMul),
    absorptionRateKa: base.absorptionRateKa * f.kaMul,
    timeToPeakHours: base.timeToPeakHours * f.tmaxMul,
  };
}

export const SUPPORTED_ROUTES: AdminRoute[] = [
  "subcutaneous",
  "intramuscular",
  "intravenous",
  "nasal",
];
