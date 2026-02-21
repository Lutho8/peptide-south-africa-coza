import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Trash2, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GradientCard } from '@/components/ui/GradientCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FoodEntry {
  id: string;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch', label: '☀️ Lunch' },
  { value: 'dinner', label: '🌙 Dinner' },
  { value: 'snack', label: '🍎 Snack' },
];

const DAILY_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 30 };

export function FoodLogger() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Form state
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('snack');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('food_logs')
      .select('id, meal_name, meal_type, calories, protein_g, carbs_g, fat_g, fiber_g')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: true });
    setEntries((data || []) as FoodEntry[]);
    setIsLoading(false);
  };

  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + Number(e.protein_g),
      carbs: acc.carbs + Number(e.carbs_g),
      fat: acc.fat + Number(e.fat_g),
      fiber: acc.fiber + Number(e.fiber_g),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const handleAdd = async () => {
    if (!user || !mealName.trim()) return;
    const { error } = await supabase.from('food_logs').insert({
      user_id: user.id,
      date: today,
      meal_name: mealName,
      meal_type: mealType,
      calories: parseInt(calories) || 0,
      protein_g: parseFloat(protein) || 0,
      carbs_g: parseFloat(carbs) || 0,
      fat_g: parseFloat(fat) || 0,
      fiber_g: parseFloat(fiber) || 0,
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } else {
      toast({ title: 'Meal logged!' });
      resetForm();
      setAddModalOpen(false);
      fetchEntries();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('food_logs').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setMealName(''); setMealType('snack'); setCalories('');
    setProtein(''); setCarbs(''); setFat(''); setFiber('');
  };

  const MacroBar = ({ label, value, goal, icon: Icon, color }: { label: string; value: number; goal: number; icon: any; color: string }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Icon className={`w-3 h-3 ${color}`} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium text-foreground">{Math.round(value)}/{goal}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((value / goal) * 100, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Daily Summary */}
      <GradientCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Today's Nutrition</h3>
          </div>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Log Meal
          </Button>
        </div>

        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-foreground">{totals.calories}</span>
          <span className="text-sm text-muted-foreground ml-1">/ {DAILY_GOALS.calories} cal</span>
        </div>

        <div className="space-y-2">
          <MacroBar label="Protein" value={totals.protein} goal={DAILY_GOALS.protein} icon={Beef} color="text-red-500" />
          <MacroBar label="Carbs" value={totals.carbs} goal={DAILY_GOALS.carbs} icon={Wheat} color="text-amber-500" />
          <MacroBar label="Fat" value={totals.fat} goal={DAILY_GOALS.fat} icon={Droplet} color="text-blue-500" />
          <MacroBar label="Fiber" value={totals.fiber} goal={DAILY_GOALS.fiber} icon={Flame} color="text-green-500" />
        </div>
      </GradientCard>

      {/* Entries List */}
      <div className="space-y-2">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GradientCard className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{entry.meal_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {MEAL_TYPES.find(m => m.value === entry.meal_type)?.label} · {entry.calories} cal · {entry.protein_g}g protein
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </GradientCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {entries.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground py-8">No meals logged today. Tap "Log Meal" to start!</p>
        )}
      </div>

      {/* Add Meal Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log a Meal</DialogTitle>
            <DialogDescription>Track your nutrition for today</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Meal Name</Label>
              <Input placeholder="e.g., Grilled chicken salad" value={mealName} onChange={e => setMealName(e.target.value)} />
            </div>
            <div>
              <Label>Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Calories</Label><Input type="number" placeholder="0" value={calories} onChange={e => setCalories(e.target.value)} /></div>
              <div><Label>Protein (g)</Label><Input type="number" placeholder="0" value={protein} onChange={e => setProtein(e.target.value)} /></div>
              <div><Label>Carbs (g)</Label><Input type="number" placeholder="0" value={carbs} onChange={e => setCarbs(e.target.value)} /></div>
              <div><Label>Fat (g)</Label><Input type="number" placeholder="0" value={fat} onChange={e => setFat(e.target.value)} /></div>
              <div><Label>Fiber (g)</Label><Input type="number" placeholder="0" value={fiber} onChange={e => setFiber(e.target.value)} /></div>
            </div>
            <Button className="w-full" onClick={handleAdd} disabled={!mealName.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Add Meal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
