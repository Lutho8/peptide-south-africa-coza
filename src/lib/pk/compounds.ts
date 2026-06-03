/**
 * Peptide PK Compound Database
 * Pre-calculated pharmacokinetic parameters for 25+ peptides
 *
 * Sources: Literature-derived estimates from clinical/bioavailability studies
 * All values are approximate and for simulation purposes only.
 */

import { PKParameters, TherapeuticWindow } from "./types";

/** Compound database keyed by peptideId */
const COMPOUNDS: Record<string, PKParameters> = {
  // === GROWTH HORMONE SECRETAGOGUES ===
  "cjc-1295-dac": {
    peptideId: "cjc-1295-dac",
    peptideName: "CJC-1295 (w/ DAC)",
    halfLifeHours: 192, // 8 days
    absorptionRateKa: 2.0,
    bioavailability: 0.85,
    volumeOfDistribution: 0.12,
    timeToPeakHours: 12,
    unit: "ng/mL",
  },
  "cjc-1295-nodac": {
    peptideId: "cjc-1295-nodac",
    peptideName: "CJC-1295 (no DAC)",
    halfLifeHours: 0.5, // 30 min
    absorptionRateKa: 4.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 0.5,
    unit: "ng/mL",
  },
  ipamorelin: {
    peptideId: "ipamorelin",
    peptideName: "Ipamorelin",
    halfLifeHours: 2,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.08,
    timeToPeakHours: 0.75,
    unit: "ng/mL",
  },
  tesamorelin: {
    peptideId: "tesamorelin",
    peptideName: "Tesamorelin",
    halfLifeHours: 0.43, // ~26 min
    absorptionRateKa: 5.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 0.25,
    unit: "ng/mL",
  },
  ghrp2: {
    peptideId: "ghrp2",
    peptideName: "GHRP-2",
    halfLifeHours: 2,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.08,
    timeToPeakHours: 0.75,
    unit: "ng/mL",
  },
  ghrp6: {
    peptideId: "ghrp6",
    peptideName: "GHRP-6",
    halfLifeHours: 2,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.08,
    timeToPeakHours: 0.75,
    unit: "ng/mL",
  },
  sermorelin: {
    peptideId: "sermorelin",
    peptideName: "Sermorelin",
    halfLifeHours: 0.2, // ~12 min
    absorptionRateKa: 6.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 0.25,
    unit: "ng/mL",
  },

  // === INCRETINS / GLP-1 ===
  semaglutide: {
    peptideId: "semaglutide",
    peptideName: "Semaglutide",
    halfLifeHours: 168, // 7 days
    absorptionRateKa: 1.5,
    bioavailability: 0.89,
    volumeOfDistribution: 0.2,
    timeToPeakHours: 24,
    unit: "ng/mL",
  },
  tirzepatide: {
    peptideId: "tirzepatide",
    peptideName: "Tirzepatide",
    halfLifeHours: 120, // 5 days
    absorptionRateKa: 1.5,
    bioavailability: 0.8,
    volumeOfDistribution: 0.18,
    timeToPeakHours: 24,
    unit: "ng/mL",
  },
  retatrutide: {
    peptideId: "retatrutide",
    peptideName: "Retatrutide",
    halfLifeHours: 144, // 6 days
    absorptionRateKa: 1.5,
    bioavailability: 0.85,
    volumeOfDistribution: 0.19,
    timeToPeakHours: 48,
    unit: "ng/mL",
  },
  liraglutide: {
    peptideId: "liraglutide",
    peptideName: "Liraglutide",
    halfLifeHours: 13,
    absorptionRateKa: 2.0,
    bioavailability: 0.55,
    volumeOfDistribution: 0.15,
    timeToPeakHours: 8,
    unit: "ng/mL",
  },
  dulaglutide: {
    peptideId: "dulaglutide",
    peptideName: "Dulaglutide",
    halfLifeHours: 120, // 5 days
    absorptionRateKa: 1.2,
    bioavailability: 0.65,
    volumeOfDistribution: 0.22,
    timeToPeakHours: 48,
    unit: "ng/mL",
  },

  // === REPAIR / REGENERATION ===
  "bpc-157": {
    peptideId: "bpc-157",
    peptideName: "BPC-157",
    halfLifeHours: 4,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 1,
    unit: "ng/mL",
  },
  "tb-500": {
    peptideId: "tb-500",
    peptideName: "TB-500",
    halfLifeHours: 240, // 10 days
    absorptionRateKa: 2.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.15,
    timeToPeakHours: 24,
    unit: "ng/mL",
  },
  "ghk-cu": {
    peptideId: "ghk-cu",
    peptideName: "GHK-Cu",
    halfLifeHours: 5,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 1.5,
    unit: "ng/mL",
  },
  "mots-c": {
    peptideId: "mots-c",
    peptideName: "MOTS-c",
    halfLifeHours: 7,
    absorptionRateKa: 3.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.12,
    timeToPeakHours: 2,
    unit: "ng/mL",
  },

  // === MELANOCORTIN ===
  melanotan2: {
    peptideId: "melanotan2",
    peptideName: "Melanotan-II",
    halfLifeHours: 33,
    absorptionRateKa: 3.0,
    bioavailability: 0.7,
    volumeOfDistribution: 0.15,
    timeToPeakHours: 6,
    unit: "ng/mL",
  },

  // === COGNITIVE / NEURO ===
  semax: {
    peptideId: "semax",
    peptideName: "Semax",
    halfLifeHours: 0.17, // ~10 min
    absorptionRateKa: 10.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.3,
    timeToPeakHours: 0.17,
    unit: "ng/mL",
  },
  selank: {
    peptideId: "selank",
    peptideName: "Selank",
    halfLifeHours: 2,
    absorptionRateKa: 5.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.15,
    timeToPeakHours: 0.5,
    unit: "ng/mL",
  },
  dihexa: {
    peptideId: "dihexa",
    peptideName: "Dihexa",
    halfLifeHours: 12,
    absorptionRateKa: 2.5,
    bioavailability: 0.7,
    volumeOfDistribution: 0.25,
    timeToPeakHours: 2,
    unit: "ng/mL",
  },

  // === IMMUNE ===
  "thymosin-alpha-1": {
    peptideId: "thymosin-alpha-1",
    peptideName: "Thymosin Alpha-1",
    halfLifeHours: 2,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.08,
    timeToPeakHours: 0.75,
    unit: "ng/mL",
  },

  // === METABOLIC ===
  "aod-9604": {
    peptideId: "aod-9604",
    peptideName: "AOD-9604",
    halfLifeHours: 4,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 1,
    unit: "ng/mL",
  },
  "hgh-fragment": {
    peptideId: "hgh-fragment",
    peptideName: "hGH Fragment 176-191",
    halfLifeHours: 4,
    absorptionRateKa: 4.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 1,
    unit: "ng/mL",
  },
  tesofensine: {
    peptideId: "tesofensine",
    peptideName: "Tesofensine",
    halfLifeHours: 234, // ~9.7 days (small molecule but included)
    absorptionRateKa: 1.8,
    bioavailability: 0.92,
    volumeOfDistribution: 0.4,
    timeToPeakHours: 4,
    unit: "ng/mL",
  },

  // === TELOMERE / ANTI-AGING ===
  epitalon: {
    peptideId: "epitalon",
    peptideName: "Epitalon",
    halfLifeHours: 0.17, // ~10 min
    absorptionRateKa: 8.0,
    bioavailability: 0.3,
    volumeOfDistribution: 0.25,
    timeToPeakHours: 0.17,
    unit: "ng/mL",
  },
  "ss-31": {
    peptideId: "ss-31",
    peptideName: "SS-31 (Elamipretide)",
    halfLifeHours: 3,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.08,
    timeToPeakHours: 1,
    unit: "ng/mL",
  },
  humanin: {
    peptideId: "humanin",
    peptideName: "Humanin",
    halfLifeHours: 1.5,
    absorptionRateKa: 5.0,
    bioavailability: 0.85,
    volumeOfDistribution: 0.18,
    timeToPeakHours: 0.5,
    unit: "ng/mL",
  },

  // === SEXUAL HEALTH ===
  pt141: {
    peptideId: "pt141",
    peptideName: "PT-141 (Bremelanotide)",
    halfLifeHours: 2.5,
    absorptionRateKa: 4.0,
    bioavailability: 0.95,
    volumeOfDistribution: 0.12,
    timeToPeakHours: 1,
    unit: "ng/mL",
  },

  // === OTHERS ===
  ll37: {
    peptideId: "ll37",
    peptideName: "LL-37",
    halfLifeHours: 1,
    absorptionRateKa: 6.0,
    bioavailability: 0.8,
    volumeOfDistribution: 0.2,
    timeToPeakHours: 0.25,
    unit: "ng/mL",
  },
  kpv: {
    peptideId: "kpv",
    peptideName: "KPV",
    halfLifeHours: 3,
    absorptionRateKa: 5.0,
    bioavailability: 0.9,
    volumeOfDistribution: 0.12,
    timeToPeakHours: 0.75,
    unit: "ng/mL",
  },
  adrf20: {
    peptideId: "adrf20",
    peptideName: "ADRF-20",
    halfLifeHours: 6,
    absorptionRateKa: 3.5,
    bioavailability: 0.85,
    volumeOfDistribution: 0.15,
    timeToPeakHours: 1.5,
    unit: "ng/mL",
  },
  follistatin: {
    peptideId: "follistatin",
    peptideName: "Follistatin 344",
    halfLifeHours: 12,
    absorptionRateKa: 2.0,
    bioavailability: 0.75,
    volumeOfDistribution: 0.1,
    timeToPeakHours: 6,
    unit: "ng/mL",
  },
};

/** Therapeutic windows for common peptides (ng/mL, approximate) */
const THERAPEUTIC_WINDOWS: Record<string, TherapeuticWindow> = {
  semaglutide: { min: 10, max: 60 },
  tirzepatide: { min: 50, max: 200 },
  retatrutide: { min: 40, max: 150 },
  liraglutide: { min: 15, max: 80 },
  dulaglutide: { min: 20, max: 100 },
  "bpc-157": { min: 0.1, max: 5 },
  "tb-500": { min: 0.5, max: 10 },
  ipamorelin: { min: 1, max: 20 },
  melanotan2: { min: 0.5, max: 8 },
  "cjc-1295-dac": { min: 2, max: 40 },
  "cjc-1295-nodac": { min: 1, max: 15 },
  tesamorelin: { min: 2, max: 30 },
  semax: { min: 0.5, max: 10 },
  selank: { min: 1, max: 15 },
  "ghk-cu": { min: 0.1, max: 3 },
  "mots-c": { min: 0.5, max: 8 },
  epitalon: { min: 0.1, max: 5 },
  "thymosin-alpha-1": { min: 1, max: 20 },
  "aod-9604": { min: 0.5, max: 10 },
  "ss-31": { min: 0.5, max: 8 },
  tesofensine: { min: 5, max: 40 },
  ghrp2: { min: 2, max: 25 },
  ghrp6: { min: 2, max: 25 },
  sermorelin: { min: 2, max: 20 },
  dihexa: { min: 0.5, max: 10 },
  humanin: { min: 0.2, max: 5 },
  pt141: { min: 1, max: 15 },
  ll37: { min: 0.2, max: 5 },
  kpv: { min: 0.1, max: 3 },
  adrf20: { min: 0.5, max: 8 },
  follistatin: { min: 1, max: 15 },
  "hgh-fragment": { min: 0.5, max: 10 },
};

/**
 * Get PK parameters for a peptide by its ID
 */
export function getPKParameters(
  peptideId: string
): PKParameters | undefined {
  return COMPOUNDS[peptideId.toLowerCase()];
}

/**
 * Get therapeutic window for a peptide
 */
export function getTherapeuticWindow(
  peptideId: string
): TherapeuticWindow | undefined {
  return THERAPEUTIC_WINDOWS[peptideId.toLowerCase()];
}

/**
 * Get all available peptides
 */
export function getAllPeptides(): PKParameters[] {
  return Object.values(COMPOUNDS);
}

/**
 * Get peptides grouped by category
 */
export function getPeptidesByCategory(): Record<string, PKParameters[]> {
  return {
    "GH Secretagogues": [
      COMPOUNDS["cjc-1295-dac"],
      COMPOUNDS["cjc-1295-nodac"],
      COMPOUNDS["ipamorelin"],
      COMPOUNDS["tesamorelin"],
      COMPOUNDS["ghrp2"],
      COMPOUNDS["ghrp6"],
      COMPOUNDS["sermorelin"],
    ],
    "GLP-1 / Incretins": [
      COMPOUNDS["semaglutide"],
      COMPOUNDS["tirzepatide"],
      COMPOUNDS["retatrutide"],
      COMPOUNDS["liraglutide"],
      COMPOUNDS["dulaglutide"],
    ],
    "Repair / Regeneration": [
      COMPOUNDS["bpc-157"],
      COMPOUNDS["tb-500"],
      COMPOUNDS["ghk-cu"],
      COMPOUNDS["mots-c"],
    ],
    Cognitive: [
      COMPOUNDS["semax"],
      COMPOUNDS["selank"],
      COMPOUNDS["dihexa"],
    ],
    "Immune / Metabolic": [
      COMPOUNDS["thymosin-alpha-1"],
      COMPOUNDS["aod-9604"],
      COMPOUNDS["hgh-fragment"],
      COMPOUNDS["ll37"],
      COMPOUNDS["kpv"],
    ],
    "Anti-Aging": [
      COMPOUNDS["epitalon"],
      COMPOUNDS["ss-31"],
      COMPOUNDS["humanin"],
      COMPOUNDS["adrf20"],
    ],
    Other: [
      COMPOUNDS["melanotan2"],
      COMPOUNDS["pt141"],
      COMPOUNDS["follistatin"],
      COMPOUNDS["tesofensine"],
    ],
  };
}

/**
 * Check if a peptide exists in the database
 */
export function isPeptideSupported(peptideId: string): boolean {
  return peptideId.toLowerCase() in COMPOUNDS;
}
