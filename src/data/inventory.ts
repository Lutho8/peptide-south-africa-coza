import { InventoryItem, InventoryAlert } from "@/types";

const STORAGE_KEY = "peptide_inventory";

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

export function calculateRemainingDoses(item: InventoryItem, doseMg: number = 5): number {
  return item.remainingMg > 0 ? Math.floor(item.remainingMg / doseMg) : 0;
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
