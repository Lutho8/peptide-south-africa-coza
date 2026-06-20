import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  InventoryItem, 
  DoseUsage, 
  defaultInventory,
  calculateRemainingDoses,
  getExpirationStatus,
  getReconstitutionStatus,
  getLowStockAlerts
} from '@/data/inventory';
import { peptides } from '@/data/peptides';
import { getStoredData, setStoredData } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Save, Package, AlertTriangle, Calendar, Beaker, 
  Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INVENTORY_KEY = 'peptide_app_inventory';
const USAGE_KEY = 'peptide_app_dose_usage';

export function InventoryModal({ open, onOpenChange }: InventoryModalProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [usages, setUsages] = useState<DoseUsage[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Form state
  const [newPeptideId, setNewPeptideId] = useState('');
  const [newVialSize, setNewVialSize] = useState('5');
  const [newQuantity, setNewQuantity] = useState('1');
  const [newExpiration, setNewExpiration] = useState('');
  const [newSupplier, setNewSupplier] = useState('ZZTai-Tech');
  const [newPrice, setNewPrice] = useState('');
  
  // Reconstitution form
  const [reconDate, setReconDate] = useState('');
  const [reconVolume, setReconVolume] = useState('2');
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const storedInventory = getStoredData<InventoryItem[]>(INVENTORY_KEY, []);
      setInventory(storedInventory.length > 0 ? storedInventory : defaultInventory);
      setUsages(getStoredData<DoseUsage[]>(USAGE_KEY, []));
    }
  }, [open]);

  const saveInventory = (items: InventoryItem[]) => {
    setInventory(items);
    setStoredData(INVENTORY_KEY, items);
  };

  const handleAddItem = () => {
    if (!newPeptideId || !newVialSize || !newExpiration) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const peptide = peptides.find(p => p.id === newPeptideId);
    if (!peptide) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      peptideId: newPeptideId,
      peptideName: peptide.name,
      vialSizeMg: parseFloat(newVialSize),
      quantity: parseInt(newQuantity),
      expirationDate: newExpiration,
      supplier: newSupplier,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: parseFloat(newPrice) || 0,
    };

    saveInventory([...inventory, item]);
    
    // Reset form
    setNewPeptideId('');
    setNewVialSize('5');
    setNewQuantity('1');
    setNewExpiration('');
    setNewPrice('');
    setShowAddItem(false);

    toast({
      title: "Item added",
      description: `${peptide.name} added to inventory.`,
    });
  };

  const handleReconstitute = (itemId: string) => {
    if (!reconDate || !reconVolume) {
      toast({
        title: "Missing fields",
        description: "Please enter reconstitution date and volume.",
        variant: "destructive"
      });
      return;
    }

    const updated = inventory.map(item => 
      item.id === itemId 
        ? { ...item, reconstitutionDate: reconDate, reconstitutionVolumeMl: parseFloat(reconVolume) }
        : item
    );
    saveInventory(updated);
    setReconDate('');
    setReconVolume('2');

    toast({
      title: "Vial reconstituted",
      description: "Reconstitution date recorded.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = inventory.filter(item => item.id !== itemId);
    saveInventory(updated);
    toast({
      title: "Item removed",
      description: "Inventory item deleted.",
    });
  };

  const alerts = getLowStockAlerts(inventory, usages);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Package size={20} />
            Peptide Inventory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alerts */}
          {alerts.length > 0 && (
            <GradientCard className="p-3 border-l-4 border-l-yellow-500">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Inventory Alerts</h4>
                  <ul className="mt-1 space-y-1">
                    {alerts.slice(0, 3).map((alert, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        <span className="text-foreground">{alert.item.peptideName}</span>: {alert.alert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GradientCard>
          )}

          {/* Add Item Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddItem(!showAddItem)}
          >
            <Plus size={16} />
            Add Inventory Item
          </Button>

          {/* Add Item Form */}
          {showAddItem && (
            <GradientCard className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Peptide *</Label>
                  <Select value={newPeptideId} onValueChange={setNewPeptideId}>
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder="Select peptide..." />
                    </SelectTrigger>
                    <SelectContent>
                      {peptides.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Vial Size (mg) *</Label>
                  <Input 
                    type="number"
                    className="bg-muted"
                    value={newVialSize}
                    onChange={(e) => setNewVialSize(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantity *</Label>
                  <Input 
                    type="number"
                    className="bg-muted"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Expiration Date *</Label>
                  <Input 
                    type="date"
                    className="bg-muted"
                    value={newExpiration}
                    onChange={(e) => setNewExpiration(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price ($)</Label>
                  <Input 
                    type="number"
                    className="bg-muted"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Supplier</Label>
                  <Input 
                    className="bg-muted"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full gap-2" onClick={handleAddItem}>
                <Save size={16} />
                Add to Inventory
              </Button>
            </GradientCard>
          )}

          {/* Inventory List */}
          <div className="space-y-3">
            {inventory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No inventory items. Add your first peptide vial above.
              </p>
            ) : (
              inventory.map(item => {
                const expStatus = getExpirationStatus(item.expirationDate);
                const reconStatus = getReconstitutionStatus(item.reconstitutionDate);
                const remaining = calculateRemainingDoses(item, usages, 500);
                const isExpanded = expandedItem === item.id;

                return (
                  <Collapsible key={item.id} open={isExpanded} onOpenChange={() => setExpandedItem(isExpanded ? null : item.id)}>
                    <GradientCard className="p-3">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              reconStatus.status === 'not-reconstituted' ? "bg-muted" : "bg-primary/20"
                            )}>
                              <Beaker size={18} className={reconStatus.status === 'not-reconstituted' ? "text-muted-foreground" : "text-primary"} />
                            </div>
                            <div className="text-left">
                              <h4 className="font-medium text-foreground">{item.peptideName}</h4>
                              <p className="text-xs text-muted-foreground">
                                {item.vialSizeMg}mg × {item.quantity} • {item.supplier}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {expStatus.status !== 'valid' && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                expStatus.status === 'expired' ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                              )}>
                                {expStatus.status === 'expired' ? 'Expired' : 'Expiring'}
                              </span>
                            )}
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                          {/* Status Info */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-muted-foreground">Expiration</p>
                              <p className={cn(
                                "font-medium",
                                expStatus.status === 'expired' ? "text-red-400" : 
                                expStatus.status === 'expiring-soon' ? "text-yellow-400" : "text-foreground"
                              )}>
                                {item.expirationDate}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-muted-foreground">Reconstituted</p>
                              <p className={cn(
                                "font-medium",
                                reconStatus.status === 'expired' ? "text-red-400" :
                                reconStatus.status === 'expiring-soon' ? "text-yellow-400" : "text-foreground"
                              )}>
                                {item.reconstitutionDate || 'Not yet'}
                              </p>
                            </div>
                            {item.reconstitutionVolumeMl && (
                              <div className="p-2 rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">Concentration</p>
                                <p className="font-medium text-foreground">
                                  {((item.vialSizeMg * 1000) / item.reconstitutionVolumeMl).toFixed(0)} mcg/mL
                                </p>
                              </div>
                            )}
                            {reconStatus.daysRemaining !== undefined && (
                              <div className="p-2 rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">Recon Days Left</p>
                                <p className={cn(
                                  "font-medium",
                                  reconStatus.daysRemaining <= 7 ? "text-yellow-400" : "text-foreground"
                                )}>
                                  {reconStatus.daysRemaining} days
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Reconstitute Button */}
                          {!item.reconstitutionDate && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input 
                                  type="date"
                                  className="bg-muted flex-1"
                                  value={reconDate}
                                  onChange={(e) => setReconDate(e.target.value)}
                                  placeholder="Recon date"
                                />
                                <Input 
                                  type="number"
                                  step="0.5"
                                  className="bg-muted w-20"
                                  value={reconVolume}
                                  onChange={(e) => setReconVolume(e.target.value)}
                                  placeholder="mL"
                                />
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full gap-1"
                                onClick={() => handleReconstitute(item.id)}
                              >
                                <Beaker size={14} />
                                Mark as Reconstituted
                              </Button>
                            </div>
                          )}

                          {/* Delete Button */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-1 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 size={14} />
                            Remove from Inventory
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </GradientCard>
                  </Collapsible>
                );
              })
            )}
          </div>

          {/* Total Value */}
          {inventory.length > 0 && (
            <GradientCard variant="primary" className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Total Inventory Value</span>
                <span className="text-lg font-bold text-primary">
                  ${inventory.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </GradientCard>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
