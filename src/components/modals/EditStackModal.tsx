import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { peptides } from '@/data/peptides';
import { getAllSelectablePeptides, findPeptideOrBlend } from '@/data/blendAdapters';
import { getCategoriesForGoals, getGoalLabels } from '@/data/goalMap';
import { getUserProfile } from '@/services/storage';
import { Plus, Trash2, X, FlaskConical, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface StackItem {
  peptideId: string;
  dose: string;
  frequency: string;
}

interface EditStackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStack: StackItem[];
  onSave: (stack: StackItem[]) => void;
}

export function EditStackModal({ open, onOpenChange, currentStack, onSave }: EditStackModalProps) {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newPeptideId, setNewPeptideId] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [userGoals, setUserGoals] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setStack([...currentStack]);
      setShowAddNew(false);
      const profile = getUserProfile();
      setUserGoals(profile?.goals ?? []);
    }
  }, [open, currentStack]);

  const goalCategories = getCategoriesForGoals(userGoals);
  const goalLabelList = getGoalLabels(userGoals);

  const handleUpdateItem = (index: number, field: 'dose' | 'frequency', value: string) => {
    const updated = [...stack];
    updated[index] = { ...updated[index], [field]: value };
    setStack(updated);
  };

  const handleRemoveItem = (index: number) => {
    setStack(stack.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (!newPeptideId) {
      toast.error('Please select a peptide');
      return;
    }
    if (!newDose) {
      toast.error('Please enter a dose');
      return;
    }
    if (!newFrequency) {
      toast.error('Please enter a frequency');
      return;
    }

    // Check if already in stack
    if (stack.some(s => s.peptideId === newPeptideId)) {
      toast.error('This peptide is already in your stack');
      return;
    }

    setStack([...stack, { peptideId: newPeptideId, dose: newDose, frequency: newFrequency }]);
    setNewPeptideId('');
    setNewDose('');
    setNewFrequency('');
    setShowAddNew(false);
    toast.success('Peptide added to stack');
  };

  const handleSave = () => {
    onSave(stack);
    onOpenChange(false);
    toast.success('Stack updated successfully');
  };

  const allSelectable = getAllSelectablePeptides();
  const availablePeptides = allSelectable.filter(p => !stack.some(s => s.peptideId === p.id));
  const recommendedPeptides = goalCategories.size > 0
    ? availablePeptides.filter(p => goalCategories.has(p.category))
    : [];
  const recommendedIds = new Set(recommendedPeptides.map(p => p.id));
  const otherIndividual = availablePeptides.filter(p => !p.isBlend && !recommendedIds.has(p.id));
  const otherBlends = availablePeptides.filter(p => p.isBlend && !recommendedIds.has(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Your Stack</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Stack Items */}
          {stack.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No peptides in your stack yet.</p>
              <p className="text-sm">Add your first peptide or blend below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stack.map((item, index) => {
                const peptide = findPeptideOrBlend(item.peptideId);
                const isBlend = allSelectable.find(s => s.id === item.peptideId)?.isBlend;
                if (!peptide) return null;

                return (
                  <GradientCard key={item.peptideId} className="p-3">
                    <div className="flex items-start gap-3">
                      {isBlend ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-4 h-4 text-purple-400" />
                        </div>
                      ) : (
                        <CategoryBadge category={peptide.category} showCount={false} size="sm" />
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-sm">{peptide.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Dose</Label>
                            <Input
                              value={item.dose}
                              onChange={(e) => handleUpdateItem(index, 'dose', e.target.value)}
                              placeholder="e.g., 500mcg"
                              className="h-8 text-sm bg-muted border-border"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Frequency</Label>
                            <Input
                              value={item.frequency}
                              onChange={(e) => handleUpdateItem(index, 'frequency', e.target.value)}
                              placeholder="e.g., Daily"
                              className="h-8 text-sm bg-muted border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </GradientCard>
                );
              })}
            </div>
          )}

          {/* Add New Peptide Form */}
          {showAddNew ? (
            <GradientCard className="p-4 border-primary/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground text-sm">Add Peptide</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowAddNew(false)}
                >
                  <X size={14} />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Goal-tuned banner */}
                {goalLabelList.length > 0 ? (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                    <Sparkles size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Tuned to your goals:</p>
                      <div className="flex flex-wrap gap-1">
                        {goalLabelList.map(g => (
                          <Badge key={g} variant="secondary" className="text-[10px] py-0 h-5">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground p-2.5 rounded-lg bg-muted/40 border border-border">
                    💡 Complete your profile in Settings to see peptides recommended for your goals.
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">Peptide / Blend</Label>
                  <Select value={newPeptideId} onValueChange={setNewPeptideId}>
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue placeholder="Select peptide or blend" />
                    </SelectTrigger>
                    <SelectContent>
                      {recommendedPeptides.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-primary flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Recommended for your goals
                          </div>
                          {recommendedPeptides.map(peptide => (
                            <SelectItem key={peptide.id} value={peptide.id} className="bg-primary/5">
                              <span className="flex items-center gap-1.5">
                                {peptide.isBlend && <FlaskConical className="w-3 h-3 text-purple-400" />}
                                {peptide.name}
                              </span>
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {otherIndividual.length > 0 && (
                        <>
                          <div className={cn(
                            "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
                            recommendedPeptides.length > 0 && "border-t border-border mt-1 pt-1.5"
                          )}>Individual Peptides</div>
                          {otherIndividual.map(peptide => (
                            <SelectItem key={peptide.id} value={peptide.id}>
                              {peptide.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {otherBlends.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-1 pt-1.5">Blends & Stacks</div>
                          {otherBlends.map(peptide => (
                            <SelectItem key={peptide.id} value={peptide.id}>
                              <span className="flex items-center gap-1.5">
                                <FlaskConical className="w-3 h-3 text-purple-400" />
                                {peptide.name}
                              </span>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Dose</Label>
                    <Input
                      value={newDose}
                      onChange={(e) => setNewDose(e.target.value)}
                      placeholder="e.g., 500mcg"
                      className="bg-muted border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Frequency</Label>
                    <Input
                      value={newFrequency}
                      onChange={(e) => setNewFrequency(e.target.value)}
                      placeholder="e.g., Daily"
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                <Button onClick={handleAddItem} className="w-full" size="sm">
                  <Plus size={14} className="mr-1" />
                  Add to Stack
                </Button>
              </div>
            </GradientCard>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowAddNew(true)}
            >
              <Plus size={16} className="mr-2" />
              Add Peptide or Blend
            </Button>
          )}

          {/* Save Button */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Stack
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
