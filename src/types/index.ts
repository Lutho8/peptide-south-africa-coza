// ===== Shared Types for Peptide Mastery =====

export interface Peptide {
  id: string;
  slug: string;
  name: string;
  halfLifeHours: number;
  category: string;
  description?: string;
  imageUrl?: string;
}

export interface DoseEvent {
  id: string;
  peptideId: string;
  amountMg: number;
  timestamp: number;
  siteZone: string;
}

export interface SafetyCheckResult {
  peptideId: string;
  peptideName: string;
  status: "safe" | "caution" | "contraindicated" | "unknown";
  warnings: string[];
  contraindications: string[];
  severity: "info" | "warning" | "danger";
}

export interface UserSafetyProfile {
  id: string;
  medications: string[];
  conditions: string[];
  allergies: string[];
  isPregnant: boolean;
  age: number;
  lastUpdated: number;
}

export interface FeedbackEntry {
  id: string;
  timestamp: number;
  peptideId: string;
  metric: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface CorrelationResult {
  peptideId: string;
  metric: string;
  correlation: number;
  trend: "positive" | "negative" | "none";
  insight: string;
  confidence: number;
}

export interface InventoryItem {
  id: string;
  peptideId: string;
  peptideName: string;
  vialSizeMg: number;
  remainingMg: number;
  concentrationMgMl: number;
  volumeMl: number;
  openedDate: number;
  expirationDate: number;
  batchNumber?: string;
  supplier?: string;
}

export interface InventoryAlert {
  id: string;
  type: "low_stock" | "expiring_soon" | "expired";
  itemId: string;
  peptideName: string;
  message: string;
  severity: "warning" | "danger";
}

export interface PKSimulationResult {
  peptideId: string;
  timePoints: number[];
  concentrations: number[];
  halfLifeHours: number;
  maxConcentration: number;
  steadyStateTime: number;
}

export interface InjectionSite {
  id: string;
  zone: string;
  name: string;
  lastUsed: number | null;
  rotationOrder: number;
  timesUsed: number;
}

export interface InjectionRecord {
  id: string;
  siteId: string;
  peptideId: string;
  peptideName: string;
  doseMg: number;
  timestamp: number;
}
