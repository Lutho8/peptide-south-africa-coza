import type { InventoryItem, InventoryAlert } from "@/types";

export type { InventoryItem, InventoryAlert };

export interface DoseUsage {
  id: string;
  itemId: string;
  peptideId: string;
  date: number;
  amountMcg: number;
}

const STORAGE_KEY = "peptide_inventory";

export const defaultInventory: InventoryItem[] = [];

export function getInventory(): InventoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveInventory(items: InventoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function calculateRemainingDoses(
  item: InventoryItem,
  usagesOrDoseMg: DoseUsage[] | number = 5,
  doseMcg?: number
): number {
  if (typeof usagesOrDoseMg === "number") {
    const doseMg = usagesOrDoseMg;
    return item.remainingMg > 0 ? Math.floor(item.remainingMg / doseMg) : 0;
  }
  const usages = usagesOrDoseMg;
  const dose = (doseMcg ?? 500) / 1000;
  const usedMg = usages
    .filter((u) => u.itemId === item.id)
    .reduce((sum, u) => sum + u.amountMcg / 1000, 0);
  const remaining = Math.max(0, item.remainingMg - usedMg);
  return dose > 0 ? Math.floor(remaining / dose) : 0;
}

export function getExpirationStatus(expirationDate: number): "ok" | "expiring" | "expired" {
  const days = (expirationDate - Date.now()) / (1000 * 60 * 60 * 24);
  if (days <= 0) return "expired";
  if (days <= 30) return "expiring";
  return "ok";
}

export function getReconstitutionStatus(reconstitutionDate?: number): "fresh" | "aging" | "expired" | "unreconstituted" {
  if (!reconstitutionDate) return "unreconstituted";
  const days = (Date.now() - reconstitutionDate) / (1000 * 60 * 60 * 24);
  if (days >= 28) return "expired";
  if (days >= 21) return "aging";
  return "fresh";
}

export function getLowStockAlerts(items: InventoryItem[]): InventoryAlert[] {
  return checkInventoryAlerts(items).filter((a) => a.type === "low_stock");
}


export function checkInventoryAlerts(items: InventoryItem[]): InventoryAlert[] {
  const now = Date.now();
  const alerts: InventoryAlert[] = [];

  for (const item of items) {
    if (item.remainingMg <= 10) {
      alerts.push({
        id: `low-${item.id}`,
        type: "low_stock",
        itemId: item.id,
        peptideName: item.peptideName,
        message: `${item.peptideName} has ${item.remainingMg.toFixed(1)}mg remaining`,
        severity: "warning",
      });
    }

    const daysUntilExpiry = (item.expirationDate - now) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry <= 0) {
      alerts.push({
        id: `expired-${item.id}`,
        type: "expired",
        itemId: item.id,
        peptideName: item.peptideName,
        message: `${item.peptideName} vial has expired`,
        severity: "danger",
      });
    } else if (daysUntilExpiry <= 30) {
      alerts.push({
        id: `expiring-${item.id}`,
        type: "expiring_soon",
        itemId: item.id,
        peptideName: item.peptideName,
        message: `${item.peptideName} expires in ${Math.ceil(daysUntilExpiry)} days`,
        severity: "warning",
      });
    }
  }

  return alerts;
}
