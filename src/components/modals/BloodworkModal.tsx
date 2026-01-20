import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { 
  biomarkers, 
  biomarkerCategories, 
  getBiomarkerStatus, 
  BloodworkEntry,
  recommendedPanels 
} from '@/data/bloodwork';
import { getStoredData, setStoredData } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Save, AlertTriangle, TrendingUp, TrendingDown, Minus, 
  Activity, Heart, Droplets, Flame, BarChart3, FileText, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BloodworkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'peptide_app_bloodwork';

const chartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "hsl(187, 78%, 55%)",
  },
};

export function BloodworkModal({ open, onOpenChange }: BloodworkModalProps) {
  const [entries, setEntries] = useState<BloodworkEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('');
  const [newValue, setNewValue] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'charts' | 'panels'>('list');
  const { toast } = useToast();

  // User gender for reference ranges
  const gender: 'male' | 'female' = 'male';

  useEffect(() => {
    if (open) {
      setEntries(getStoredData<BloodworkEntry[]>(STORAGE_KEY, []));
    }
  }, [open]);

  const handleSaveEntry = () => {
    if (!selectedBiomarker || !newValue) {
      toast({
        title: "Missing fields",
        description: "Please select a biomarker and enter a value.",
        variant: "destructive"
      });
      return;
    }

    const entry: BloodworkEntry = {
      id: `bw-${Date.now()}`,
      date: newDate,
      biomarkerId: selectedBiomarker,
      value: parseFloat(newValue),
      notes: newNotes || undefined,
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    setStoredData(STORAGE_KEY, updated);

    // Reset form
    setSelectedBiomarker('');
    setNewValue('');
    setNewNotes('');
    setShowAddEntry(false);

    toast({
      title: "Entry saved",
      description: "Your bloodwork result has been recorded.",
    });
  };

  // Get latest value for each biomarker
  const getLatestValues = () => {
    const latest: Record<string, BloodworkEntry> = {};
    for (const entry of entries) {
      if (!latest[entry.biomarkerId] || new Date(entry.date) > new Date(latest[entry.biomarkerId].date)) {
        latest[entry.biomarkerId] = entry;
      }
    }
    return latest;
  };

  const latestValues = getLatestValues();

  // Get alerts for abnormal values
  const getAlerts = () => {
    const alerts: { biomarker: typeof biomarkers[0]; entry: BloodworkEntry; status: ReturnType<typeof getBiomarkerStatus> }[] = [];
    
    for (const [biomarkerId, entry] of Object.entries(latestValues)) {
      const biomarker = biomarkers.find(b => b.id === biomarkerId);
      if (!biomarker) continue;
      
      const status = getBiomarkerStatus(biomarker, entry.value, gender);
      if (status.status === 'warning' || status.status === 'critical') {
        alerts.push({ biomarker, entry, status });
      }
    }
    
    return alerts;
  };

  const alerts = getAlerts();

  // Filter biomarkers by category
  const filteredBiomarkers = selectedCategory === 'all' 
    ? biomarkers 
    : biomarkers.filter(b => b.category === selectedCategory);

  // Get history for a specific biomarker
  const getBiomarkerHistory = (biomarkerId: string) => {
    return entries
      .filter(e => e.biomarkerId === biomarkerId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => ({ ...e, date: e.date.slice(5) }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Activity size={20} />
            Bloodwork Tracking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alerts Banner */}
          {alerts.length > 0 && (
            <GradientCard className="p-3 border-l-4 border-l-yellow-500">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Attention Required</h4>
                  <ul className="mt-1 space-y-1">
                    {alerts.slice(0, 3).map(({ biomarker, entry, status }) => (
                      <li key={biomarker.id} className="text-xs text-muted-foreground">
                        <span className={status.color}>{biomarker.shortName}</span>: {entry.value} {biomarker.unit} ({status.label})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GradientCard>
          )}

          {/* Add Entry Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowAddEntry(!showAddEntry)}
          >
            <Plus size={16} />
            Add Bloodwork Result
          </Button>

          {/* Add Entry Form */}
          {showAddEntry && (
            <GradientCard className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Biomarker *</Label>
                  <Select value={selectedBiomarker} onValueChange={setSelectedBiomarker}>
                    <SelectTrigger className="bg-muted">
                      <SelectValue placeholder="Select biomarker..." />
                    </SelectTrigger>
                    <SelectContent>
                      {biomarkerCategories.map(cat => (
                        <div key={cat.id}>
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{cat.label}</div>
                          {biomarkers.filter(b => b.category === cat.id).map(b => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.shortName} - {b.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Value * {selectedBiomarker && `(${biomarkers.find(b => b.id === selectedBiomarker)?.unit})`}
                  </Label>
                  <Input 
                    type="number"
                    step="0.1"
                    placeholder="Enter value"
                    className="bg-muted"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date *</Label>
                  <Input 
                    type="date"
                    className="bg-muted"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Notes (optional)</Label>
                  <Input 
                    placeholder="Lab name, fasting status, etc."
                    className="bg-muted"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>
              {selectedBiomarker && (
                <div className="p-2 rounded-lg bg-muted/50 text-xs">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Normal range:</strong>{' '}
                    {biomarkers.find(b => b.id === selectedBiomarker)?.normalRange[gender].min} - {' '}
                    {biomarkers.find(b => b.id === selectedBiomarker)?.normalRange[gender].max}{' '}
                    {biomarkers.find(b => b.id === selectedBiomarker)?.unit}
                  </p>
                </div>
              )}
              <Button className="w-full gap-2" onClick={handleSaveEntry}>
                <Save size={16} />
                Save Result
              </Button>
            </GradientCard>
          )}

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setViewMode('list')}
            >
              <FileText size={14} />
              Results
            </Button>
            <Button
              variant={viewMode === 'charts' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setViewMode('charts')}
            >
              <BarChart3 size={14} />
              Trends
            </Button>
            <Button
              variant={viewMode === 'panels' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setViewMode('panels')}
            >
              <Calendar size={14} />
              Panels
            </Button>
          </div>

          {/* Category Filter */}
          {viewMode !== 'panels' && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all",
                  selectedCategory === 'all' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                All
              </button>
              {biomarkerCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all",
                    selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-2 gap-3">
              {filteredBiomarkers.map(biomarker => {
                const latest = latestValues[biomarker.id];
                const status = latest ? getBiomarkerStatus(biomarker, latest.value, gender) : null;
                
                return (
                  <GradientCard key={biomarker.id} className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{biomarker.shortName}</span>
                      {status && (
                        <span className={cn("text-xs font-medium", status.color)}>
                          {status.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-foreground">
                        {latest ? latest.value : '--'}
                      </span>
                      <span className="text-xs text-muted-foreground">{biomarker.unit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Range: {biomarker.normalRange[gender].min}-{biomarker.normalRange[gender].max}
                    </p>
                    {latest && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {latest.date}
                      </p>
                    )}
                  </GradientCard>
                );
              })}
            </div>
          )}

          {/* Charts View */}
          {viewMode === 'charts' && (
            <div className="space-y-4">
              {filteredBiomarkers.map(biomarker => {
                const history = getBiomarkerHistory(biomarker.id);
                if (history.length < 2) return null;

                return (
                  <GradientCard key={biomarker.id} className="p-3">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      {biomarker.name} ({biomarker.unit})
                    </h4>
                    <ChartContainer config={chartConfig} className="h-[150px] w-full">
                      <ComposedChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[
                            biomarker.normalRange[gender].min * 0.8,
                            biomarker.normalRange[gender].max * 1.2
                          ]}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ReferenceLine 
                          y={biomarker.normalRange[gender].max} 
                          stroke="hsl(0, 84%, 60%)" 
                          strokeDasharray="3 3" 
                        />
                        <ReferenceLine 
                          y={biomarker.normalRange[gender].min} 
                          stroke="hsl(0, 84%, 60%)" 
                          strokeDasharray="3 3" 
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(187, 78%, 55%)"
                          fill="hsl(187, 78%, 55%)"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ChartContainer>
                  </GradientCard>
                );
              })}
              {filteredBiomarkers.every(b => getBiomarkerHistory(b.id).length < 2) && (
                <p className="text-center text-muted-foreground py-8">
                  Need at least 2 entries per biomarker to show trends.
                </p>
              )}
            </div>
          )}

          {/* Panels View */}
          {viewMode === 'panels' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Recommended bloodwork panels based on your peptide protocol:
              </p>
              {recommendedPanels.map((panel, index) => (
                <GradientCard key={index} className="p-4">
                  <h4 className="font-medium text-foreground mb-2">{panel.name}</h4>
                  <p className="text-xs text-primary mb-2">{panel.frequency}</p>
                  <div className="flex flex-wrap gap-1">
                    {panel.biomarkers.map(biomarkerId => {
                      const biomarker = biomarkers.find(b => b.id === biomarkerId);
                      return biomarker ? (
                        <span key={biomarkerId} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                          {biomarker.shortName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </GradientCard>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
