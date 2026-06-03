import { useState, useCallback, useMemo, useEffect } from "react";
import { InventoryItem, InventoryAlert } from "@/types";
import {
  getInventory,
  saveInventory,
  checkInventoryAlerts,
} from "@/data/inventory";

/**
 * Hook: useInventory
 * Manages vial inventory with localStorage persistence.
 * Integrates with src/data/inventory.ts functions.
 * Calculates remaining doses and alerts automatically.
 */
export function useInventory(): {
  items: InventoryItem[];
  alerts: InventoryAlert[];
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (item: InventoryItem) => void;
  recordDose: (itemId: string, amountMg: number) => void;
  totalPeptides: number;
  totalVials: number;
} {
  const [items, setItems] = useState<InventoryItem[]>(getInventory);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveInventory(items);
  }, [items]);

  // Calculate alerts based on current items
  const alerts = useMemo(() => checkInventoryAlerts(items), [items]);

  const addItem = useCallback((item: InventoryItem) => {
    setItems((prev) => {
      const updated = [...prev, item];
      saveInventory(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveInventory(updated);
      return updated;
    });
  }, []);

  const updateItem = useCallback((item: InventoryItem) => {
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === item.id ? item : i));
      saveInventory(updated);
      return updated;
    });
  }, []);

  const recordDose = useCallback((itemId: string, amountMg: number) => {
    setItems((prev) => {
      const updated = prev.map((i) => {
        if (i.id === itemId) {
          const newRemaining = Math.max(0, i.remainingMg - amountMg);
          return { ...i, remainingMg: newRemaining };
        }
        return i;
      });
      saveInventory(updated);
      return updated;
    });
  }, []);

  // Aggregate stats
  const totalPeptides = useMemo(
    () => new Set(items.map((i) => i.peptideId)).size,
    [items]
  );

  const totalVials = items.length;

  return {
    items,
    alerts,
    addItem,
    removeItem,
    updateItem,
    recordDose,
    totalPeptides,
    totalVials,
  };
}
