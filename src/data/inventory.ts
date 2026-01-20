// Peptide inventory and vial tracking

export interface InventoryItem {
  id: string;
  peptideId: string;
  peptideName: string;
  vialSizeMg: number;
  quantity: number;
  reconstitutionDate?: string;
  reconstitutionVolumeMl?: number;
  expirationDate: string;
  batchNumber?: string;
  supplier: string;
  purchaseDate: string;
  purchasePrice: number;
  notes?: string;
}

export interface DoseUsage {
  id: string;
  inventoryItemId: string;
  date: string;
  doseMcg: number;
  volumeMl: number;
}

// Calculate remaining doses in a vial
export function calculateRemainingDoses(
  item: InventoryItem,
  usages: DoseUsage[],
  standardDoseMcg: number
): { dosesRemaining: number; percentageRemaining: number; daysUntilEmpty?: number } {
  const totalMcg = item.vialSizeMg * 1000;
  const usedMcg = usages
    .filter(u => u.inventoryItemId === item.id)
    .reduce((sum, u) => sum + u.doseMcg, 0);
  
  const remainingMcg = totalMcg - usedMcg;
  const dosesRemaining = Math.floor(remainingMcg / standardDoseMcg);
  const percentageRemaining = (remainingMcg / totalMcg) * 100;

  // Calculate days until empty based on recent usage
  const recentUsages = usages
    .filter(u => u.inventoryItemId === item.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  let daysUntilEmpty: number | undefined;
  if (recentUsages.length >= 2) {
    const daySpan = Math.ceil(
      (new Date(recentUsages[0].date).getTime() - new Date(recentUsages[recentUsages.length - 1].date).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    const avgDailyUsage = recentUsages.reduce((sum, u) => sum + u.doseMcg, 0) / Math.max(daySpan, 1);
    if (avgDailyUsage > 0) {
      daysUntilEmpty = Math.ceil(remainingMcg / avgDailyUsage);
    }
  }

  return { dosesRemaining, percentageRemaining, daysUntilEmpty };
}

// Check if vial is expired or expiring soon
export function getExpirationStatus(
  expirationDate: string
): { status: 'expired' | 'expiring-soon' | 'valid'; daysUntilExpiration: number } {
  const now = new Date();
  const expDate = new Date(expirationDate);
  const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return { status: 'expired', daysUntilExpiration };
  }
  if (daysUntilExpiration <= 30) {
    return { status: 'expiring-soon', daysUntilExpiration };
  }
  return { status: 'valid', daysUntilExpiration };
}

// Check if reconstituted vial is still good (typically 28 days)
export function getReconstitutionStatus(
  reconstitutionDate: string | undefined,
  maxDays: number = 28
): { status: 'not-reconstituted' | 'fresh' | 'expiring-soon' | 'expired'; daysRemaining?: number } {
  if (!reconstitutionDate) {
    return { status: 'not-reconstituted' };
  }

  const now = new Date();
  const reconDate = new Date(reconstitutionDate);
  const daysSinceRecon = Math.floor((now.getTime() - reconDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = maxDays - daysSinceRecon;

  if (daysRemaining < 0) {
    return { status: 'expired', daysRemaining: 0 };
  }
  if (daysRemaining <= 7) {
    return { status: 'expiring-soon', daysRemaining };
  }
  return { status: 'fresh', daysRemaining };
}

// Get low stock alerts
export function getLowStockAlerts(
  inventory: InventoryItem[],
  usages: DoseUsage[],
  thresholdDoses: number = 5
): { item: InventoryItem; dosesRemaining: number; alert: string }[] {
  const alerts: { item: InventoryItem; dosesRemaining: number; alert: string }[] = [];

  for (const item of inventory) {
    // Assume standard dose of 500mcg if not specified
    const standardDose = 500;
    const { dosesRemaining, daysUntilEmpty } = calculateRemainingDoses(item, usages, standardDose);

    if (dosesRemaining <= thresholdDoses) {
      let alert = `Low stock: Only ${dosesRemaining} doses remaining`;
      if (daysUntilEmpty !== undefined) {
        alert += ` (approximately ${daysUntilEmpty} days)`;
      }
      alerts.push({ item, dosesRemaining, alert });
    }

    // Check expiration
    const expStatus = getExpirationStatus(item.expirationDate);
    if (expStatus.status === 'expired') {
      alerts.push({ 
        item, 
        dosesRemaining, 
        alert: `Expired ${Math.abs(expStatus.daysUntilExpiration)} days ago - dispose of vial` 
      });
    } else if (expStatus.status === 'expiring-soon') {
      alerts.push({ 
        item, 
        dosesRemaining, 
        alert: `Expiring in ${expStatus.daysUntilExpiration} days` 
      });
    }

    // Check reconstitution
    if (item.reconstitutionDate) {
      const reconStatus = getReconstitutionStatus(item.reconstitutionDate);
      if (reconStatus.status === 'expired') {
        alerts.push({ 
          item, 
          dosesRemaining, 
          alert: 'Reconstituted vial expired - dispose and use fresh vial' 
        });
      } else if (reconStatus.status === 'expiring-soon' && reconStatus.daysRemaining !== undefined) {
        alerts.push({ 
          item, 
          dosesRemaining, 
          alert: `Reconstituted vial expires in ${reconStatus.daysRemaining} days` 
        });
      }
    }
  }

  return alerts;
}

// Default inventory for demo
export const defaultInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    peptideId: 'bpc157',
    peptideName: 'BPC-157',
    vialSizeMg: 5,
    quantity: 3,
    reconstitutionDate: '2024-11-15',
    reconstitutionVolumeMl: 2,
    expirationDate: '2025-11-01',
    supplier: 'ZZTai-Tech',
    purchaseDate: '2024-10-01',
    purchasePrice: 42,
  },
  {
    id: 'inv-2',
    peptideId: 'ipamorelin',
    peptideName: 'Ipamorelin',
    vialSizeMg: 5,
    quantity: 2,
    reconstitutionDate: '2024-11-18',
    reconstitutionVolumeMl: 2.5,
    expirationDate: '2025-09-15',
    supplier: 'ZZTai-Tech',
    purchaseDate: '2024-10-15',
    purchasePrice: 38,
  },
  {
    id: 'inv-3',
    peptideId: 'retatrutide',
    peptideName: 'Retatrutide',
    vialSizeMg: 10,
    quantity: 1,
    expirationDate: '2025-08-01',
    supplier: 'ZZTai-Tech',
    purchaseDate: '2024-10-20',
    purchasePrice: 195,
  },
  {
    id: 'inv-4',
    peptideId: 'ta1',
    peptideName: 'Thymosin Alpha-1',
    vialSizeMg: 5,
    quantity: 2,
    reconstitutionDate: '2024-11-10',
    reconstitutionVolumeMl: 1,
    expirationDate: '2025-06-01',
    supplier: 'ZZTai-Tech',
    purchaseDate: '2024-09-15',
    purchasePrice: 45,
  }
];
