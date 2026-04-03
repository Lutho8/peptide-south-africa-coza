import { useState, useMemo, useEffect } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { peptides, getCategoryLabel } from '@/data/peptides';
import { getAllSelectablePeptides, findPeptideOrBlend, allBlendsAsPeptides, findBlendData } from '@/data/blendAdapters';
import { peptideBlends, peptideStacks } from '@/data/peptideBlends';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlaskConical } from 'lucide-react';
import { AlertTriangle, Calculator, Droplets, Syringe, ChevronDown, ChevronUp, Clock, Calendar, Bell, BellOff, Save, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  getCalculatorSettings, 
  saveCalculatorSettings, 
  getScheduledReminders, 
  saveScheduledReminder, 
  deleteScheduledReminder,
  ScheduledReminder,
  getNotificationSettings 
} from '@/services/storage';
import { 
  requestNotificationPermission, 
  getNotificationPermission, 
  scheduleNotification,
  cancelAllNotifications
} from '@/services/notifications';

// Syringe types with units per ml
const SYRINGE_TYPES = [
  { id: 'u100', label: 'U-100', unitsPerMl: 100, description: 'Standard insulin syringe' },
  { id: 'u40', label: 'U-40', unitsPerMl: 40, description: 'Pet/veterinary syringe' },
  { id: 'u50', label: 'U-50', unitsPerMl: 50, description: 'Intermediate syringe' },
] as const;

type SyringeType = typeof SYRINGE_TYPES[number]['id'];

// Parse half-life string to hours for calculations
function parseHalfLifeToHours(halfLife: string | undefined): number | null {
  if (!halfLife) return null;
  
  const lower = halfLife.toLowerCase();
  const match = lower.match(/(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?)?\s*(hour|hr|minute|min|day|week)/);
  
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  if (unit.startsWith('min')) return value / 60;
  if (unit.startsWith('hour') || unit.startsWith('hr')) return value;
  if (unit.startsWith('day')) return value * 24;
  if (unit.startsWith('week')) return value * 24 * 7;
  
  return null;
}

// Generate injection schedule based on frequency
function generateSchedule(frequency: string, halfLifeHours: number | null): { time: string; note: string }[] {
  const schedule: { time: string; note: string }[] = [];
  const freqLower = frequency.toLowerCase();
  
  if (freqLower.includes('before bed') || freqLower.includes('daily')) {
    schedule.push({ time: '21:00', note: 'Evening dose (before bed)' });
    if (freqLower.includes('2x')) {
      schedule.push({ time: '06:00', note: 'Morning dose (fasted)' });
    }
  } else if (freqLower.includes('3x')) {
    schedule.push({ time: '06:00', note: 'Morning dose' });
    schedule.push({ time: '14:00', note: 'Afternoon dose' });
    schedule.push({ time: '21:00', note: 'Evening dose' });
  } else if (freqLower.includes('2x')) {
    schedule.push({ time: '06:00', note: 'Morning dose' });
    schedule.push({ time: '18:00', note: 'Evening dose' });
  } else if (freqLower.includes('weekly')) {
    schedule.push({ time: '08:00', note: 'Weekly dose (same day each week)' });
  } else {
    schedule.push({ time: '08:00', note: 'Standard dose time' });
  }
  
  return schedule;
}

export function DosageScreen() {
  // Load saved settings on mount
  const savedSettings = getCalculatorSettings();
  
  const [vialSize, setVialSize] = useState(savedSettings.lastVialSize || '5');
  const [bacWater, setBacWater] = useState(savedSettings.lastBacWater || '2');
  const [targetDose, setTargetDose] = useState(savedSettings.lastTargetDose || '250');
  const [selectedBlendForCalc, setSelectedBlendForCalc] = useState<string>('');
  const [syringeType, setSyringeType] = useState<SyringeType>(savedSettings.syringeType || 'u40');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'athlete'>(
    savedSettings.experienceLevel || 'intermediate'
  );
  const [expandedPeptide, setExpandedPeptide] = useState<string | null>(null);
  const [selectedSchedulePeptide, setSelectedSchedulePeptide] = useState<string>(savedSettings.lastSelectedPeptide || '');
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load reminders and notification status on mount
  useEffect(() => {
    setReminders(getScheduledReminders());
    const permission = getNotificationPermission();
    const settings = getNotificationSettings();
    setNotificationsEnabled(permission === 'granted' && settings.enabled);
  }, []);

  // Blend auto-fill for calculator
  const selectedBlendData = useMemo(() => findBlendData(selectedBlendForCalc), [selectedBlendForCalc]);
  const allBlends = useMemo(() => [...peptideBlends, ...peptideStacks], []);

  const handleBlendSelect = (blendId: string) => {
    setSelectedBlendForCalc(blendId);
    const blend = findBlendData(blendId);
    if (blend) {
      const mgMatch = blend.vialSize.match(/([\d.]+)\s*mg/i);
      if (mgMatch) setVialSize(mgMatch[1]);
      const waterMatch = blend.quickstart.reconstitute.match(/([\d.]+)\s*mL/i);
      if (waterMatch) setBacWater(waterMatch[1]);
    }
  };

  // Get selected syringe config
  const selectedSyringe = SYRINGE_TYPES.find(s => s.id === syringeType) || SYRINGE_TYPES[1];

  // Parse inputs with validation
  const vialMg = Math.max(0, parseFloat(vialSize) || 0);
  const waterMl = Math.max(0, parseFloat(bacWater) || 0);
  const targetMg = Math.max(0, parseFloat(targetDose) || 0);

  // Core calculations in mg — U-40 syringe (40 units = 1mL)
  const concentrationMgPerMl = waterMl > 0 ? vialMg / waterMl : 0;
  const volumeNeeded = concentrationMgPerMl > 0 ? targetMg / concentrationMgPerMl : 0;
  
  // U-40 syringe units
  const syringeUnits = volumeNeeded * selectedSyringe.unitsPerMl;

  // Verification calculation
  const verificationDose = volumeNeeded * concentrationMgPerMl;
  const isAccurate = Math.abs(verificationDose - targetMg) < 0.001 || targetMg === 0;

  // Calculate doses per vial
  const dosesPerVial = targetMg > 0 ? Math.floor(vialMg / targetMg) : 0;

  // Get schedule for selected peptide
  const schedulePeptide = useMemo(() => 
    findPeptideOrBlend(selectedSchedulePeptide), 
    [selectedSchedulePeptide]
  );
  
  const schedule = useMemo(() => {
    if (!schedulePeptide) return [];
    const halfLifeHours = parseHalfLifeToHours(schedulePeptide.halfLife);
    return generateSchedule(schedulePeptide.frequency, halfLifeHours);
  }, [schedulePeptide]);

  // Check if reminder exists for this peptide and time
  const hasReminder = (peptideId: string, time: string) => {
    return reminders.some(r => r.peptideId === peptideId && r.time === time && r.enabled);
  };

  // Handle saving settings
  const handleSaveSettings = () => {
    saveCalculatorSettings({
      syringeType,
      experienceLevel,
      lastVialSize: vialSize,
      lastBacWater: bacWater,
      lastTargetDose: targetDose,
      lastSelectedPeptide: selectedSchedulePeptide,
    });
    setSettingsSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      toast.success('Dose reminders enabled!');
      // Schedule existing reminders
      reminders.filter(r => r.enabled).forEach(r => {
        scheduleNotification(r.id, r.peptideName, r.dose, r.time);
      });
    } else if (permission === 'denied') {
      toast.error(
        'Notifications blocked by browser. To enable, click the lock icon in your address bar → Site settings → Allow notifications.',
        { duration: 8000 }
      );
    } else {
      toast.error('Notification permission was not granted. Please try again.');
    }
  };

  // Handle adding/removing reminder
  const toggleReminder = (peptideId: string, peptideName: string, dose: string, time: string) => {
    const existingReminder = reminders.find(r => r.peptideId === peptideId && r.time === time);
    
    if (existingReminder) {
      deleteScheduledReminder(existingReminder.id);
      setReminders(prev => prev.filter(r => r.id !== existingReminder.id));
      toast.info(`Reminder removed for ${peptideName} at ${time}`);
    } else {
      const newReminder: ScheduledReminder = {
        id: `reminder-${peptideId}-${time}-${Date.now()}`,
        peptideId,
        peptideName,
        dose,
        time,
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      saveScheduledReminder(newReminder);
      setReminders(prev => [...prev, newReminder]);
      
      if (notificationsEnabled) {
        scheduleNotification(newReminder.id, peptideName, dose, time);
      }
      toast.success(`Reminder set for ${peptideName} at ${time}`);
    }
  };

  const experienceLevels = [
    { id: 'beginner' as const, label: 'Beginner' },
    { id: 'intermediate' as const, label: 'Intermediate' },
    { id: 'advanced' as const, label: 'Advanced' },
    { id: 'athlete' as const, label: 'Athlete' },
  ];

  return (
    <div className="pb-24 space-y-4 sm:space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dosage Calculator</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveSettings}
          className={cn(
            "gap-1.5 transition-all",
            settingsSaved && "bg-green-500/20 border-green-500/50 text-green-400"
          )}
        >
          {settingsSaved ? <Check size={14} /> : <Save size={14} />}
          {settingsSaved ? 'Saved!' : 'Save'}
        </Button>
      </div>

      {/* Notification Permission Banner */}
      {!notificationsEnabled && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Enable Dose Reminders</p>
                <p className="text-xs text-muted-foreground">Get notified at your scheduled dose times</p>
              </div>
            </div>
            <Button size="sm" onClick={handleEnableNotifications}>
              Enable
            </Button>
          </div>
        </div>
      )}

      {/* Safety Warning */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-400 text-sm sm:text-base">Safety First</h3>
            <p className="text-xs text-yellow-200/80 mt-1">
              Always verify calculations independently. Start with the lowest recommended dose.
            </p>
          </div>
        </div>
      </div>

      {/* Reconstitution Calculator */}
      <GradientCard variant="primary">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={18} className="text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Reconstitution Calculator</h2>
        </div>

        {/* Blend Quick-Fill Selector */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-xs sm:text-sm text-muted-foreground">Quick-Fill from Blend/Stack</Label>
          <Select value={selectedBlendForCalc} onValueChange={handleBlendSelect}>
            <SelectTrigger className="bg-muted border-border h-10">
              <SelectValue placeholder="Select a blend to auto-fill..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50 max-h-60">
              <SelectItem value="custom">Custom / Individual Peptide</SelectItem>
              {allBlends.map((blend) => (
                <SelectItem key={blend.id} value={blend.id}>
                  <span className="flex items-center gap-1.5">
                    <FlaskConical className="w-3 h-3 text-primary" />
                    {blend.shortName} ({blend.vialSize})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blend Safety Warning */}
        {selectedBlendData && (
          <Alert variant="destructive" className="mb-4 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm font-bold">⚠️ Blend-Specific Values</AlertTitle>
            <AlertDescription className="text-xs">
              Values auto-filled for <strong>{selectedBlendData.shortName}</strong>. 
              Do NOT use generic peptide defaults — blends have higher total mg and different concentrations.
              Always verify against your specific product.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Vial Size (mg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={vialSize}
              onChange={(e) => setVialSize(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">BAC Water (ml)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={bacWater}
              onChange={(e) => setBacWater(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Target Dose (mg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={targetDose}
              onChange={(e) => setTargetDose(e.target.value)}
              className="bg-muted border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Syringe Type</Label>
            <Select value={syringeType} onValueChange={(v) => setSyringeType(v as SyringeType)}>
              <SelectTrigger className="bg-muted border-border h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {SYRINGE_TYPES.map((syringe) => (
                  <SelectItem key={syringe.id} value={syringe.id}>
                    <span className="font-medium">{syringe.label}</span>
                    <span className="text-muted-foreground ml-1 text-xs">({syringe.unitsPerMl} u/ml)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Syringe info banner */}
        <div className="mb-4 p-2 rounded-lg bg-primary/10 text-xs text-center">
          <span className="text-primary font-medium">{selectedSyringe.label}</span>
          <span className="text-muted-foreground"> - {selectedSyringe.description} ({selectedSyringe.unitsPerMl} units = 1ml)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-4 border-t border-border/50">
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Droplets size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Concentration</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{concentrationMgPerMl.toFixed(2)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">mg/ml</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Syringe size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Volume</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{volumeNeeded.toFixed(4)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">ml</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-primary/20">
            <Syringe size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">{selectedSyringe.label} Units</p>
            <p className="text-base sm:text-lg font-bold text-primary">{syringeUnits.toFixed(1)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">units</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
            <Calculator size={16} className="mx-auto text-primary mb-1" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Doses/Vial</p>
            <p className="text-base sm:text-lg font-bold text-foreground">{dosesPerVial}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">doses</p>
          </div>
        </div>

        {/* Verification Badge */}
        {concentrationMgPerMl > 0 && (
          <div className={cn(
            "mt-3 sm:mt-4 p-2 rounded-lg text-center text-xs",
            isAccurate ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isAccurate ? "✓ Calculation verified" : "⚠ Precision warning"}
            <span className="block text-muted-foreground mt-1 text-[10px] sm:text-xs">
              {volumeNeeded.toFixed(4)} ml × {concentrationMgPerMl.toFixed(2)} mg/ml = {verificationDose.toFixed(2)} mg
            </span>
          </div>
        )}

        {/* Blend Protocol Dosing Table */}
        {selectedBlendData && selectedBlendData.dosingTable.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{selectedBlendData.shortName} Protocol Dosing Table</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">Period</TableHead>
                  <TableHead className="h-8 text-xs">Daily Dose</TableHead>
                  <TableHead className="h-8 text-xs">Units to Draw</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBlendData.dosingTable.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-1.5 text-xs font-medium">{row.week}</TableCell>
                    <TableCell className="py-1.5 text-xs">{row.dailyDose}</TableCell>
                    <TableCell className="py-1.5 text-xs font-bold text-primary">{row.units}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedBlendData.syringeMath && (
              <div className="p-2 rounded-lg bg-muted/50 text-xs space-y-0.5">
                <div className="font-medium text-foreground mb-1">Syringe Math:</div>
                {selectedBlendData.syringeMath.map((line, i) => (
                  <div key={i} className="text-muted-foreground">• {line}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </GradientCard>

      {/* Dosing Schedule Calculator */}
      <GradientCard>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Dosing Schedule</h2>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm text-muted-foreground">Select Peptide</Label>
            <Select value={selectedSchedulePeptide} onValueChange={setSelectedSchedulePeptide}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Choose a peptide..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50 max-h-60">
                {(() => {
                  const all = getAllSelectablePeptides();
                  return (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Peptides</div>
                      {all.filter(p => !p.isBlend).map((peptide) => (
                        <SelectItem key={peptide.id} value={peptide.id}>
                          {peptide.name}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-1 pt-1.5">Blends & Stacks</div>
                      {all.filter(p => p.isBlend).map((peptide) => (
                        <SelectItem key={peptide.id} value={peptide.id}>
                          <span className="flex items-center gap-1.5">
                            <FlaskConical className="w-3 h-3 text-purple-400" />
                            {peptide.name}
                          </span>
                        </SelectItem>
                      ))}
                    </>
                  );
                })()}
              </SelectContent>
            </Select>
          </div>

          {schedulePeptide && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              {/* Peptide info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="text-foreground font-medium">{schedulePeptide.frequency}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Half-life</p>
                  <p className="text-foreground font-medium">{schedulePeptide.halfLife || 'N/A'}</p>
                </div>
                <div className="col-span-2 p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground">Recommended Dose ({experienceLevel})</p>
                  <p className="text-primary font-medium">{schedulePeptide.dosing[experienceLevel]}</p>
                </div>
              </div>

              {/* Schedule with reminder toggles */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar size={12} />
                  Recommended Schedule
                  {notificationsEnabled && <span className="text-primary ml-1">(tap bell to set reminder)</span>}
                </p>
                <div className="space-y-2">
                  {schedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <div className="w-14 sm:w-16 text-center">
                        <span className="text-primary font-bold text-sm">{item.time.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-foreground">{item.note}</div>
                      <button
                        onClick={() => toggleReminder(
                          schedulePeptide.id,
                          schedulePeptide.name,
                          schedulePeptide.dosing[experienceLevel],
                          item.time.split(' ')[0]
                        )}
                        className={cn(
                          "p-1.5 rounded-lg transition-all touch-manipulation",
                          hasReminder(schedulePeptide.id, item.time.split(' ')[0])
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {hasReminder(schedulePeptide.id, item.time.split(' ')[0]) ? (
                          <Bell size={14} />
                        ) : (
                          <BellOff size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administration tip */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <span className="font-medium text-foreground">Administration:</span> {schedulePeptide.administration}
              </div>
            </div>
          )}
        </div>
      </GradientCard>

      {/* Active Reminders Summary */}
      {reminders.filter(r => r.enabled).length > 0 && (
        <GradientCard>
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Active Reminders</h3>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {reminders.filter(r => r.enabled).length}
            </span>
          </div>
          <div className="space-y-2">
            {reminders.filter(r => r.enabled).map((reminder) => (
              <div 
                key={reminder.id} 
                className="flex items-center justify-between p-2 rounded bg-muted/50 text-xs"
              >
                <div>
                  <span className="font-medium text-foreground">{reminder.peptideName}</span>
                  <span className="text-muted-foreground ml-2">{reminder.dose}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-medium">{reminder.time}</span>
                  <button
                    onClick={() => toggleReminder(reminder.peptideId, reminder.peptideName, reminder.dose, reminder.time)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    <BellOff size={12} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GradientCard>
      )}

      {/* Experience Level Selector */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Experience Level</h3>
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setExperienceLevel(level.id)}
              className={cn(
                "py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation",
                experienceLevel === level.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted active:scale-95"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Peptide Dosage Reference */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Dosage Reference</h3>
        <div className="space-y-2">
          {[...peptides, ...allBlendsAsPeptides].map((peptide) => (
            <Collapsible 
              key={peptide.id}
              open={expandedPeptide === peptide.id}
              onOpenChange={(open) => setExpandedPeptide(open ? peptide.id : null)}
            >
              <GradientCard className="p-2 sm:p-3">
                <CollapsibleTrigger className="w-full touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="text-left flex items-center gap-2">
                      {allBlendsAsPeptides.some(b => b.id === peptide.id) && (
                        <FlaskConical className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-medium text-foreground text-sm sm:text-base">{peptide.name}</h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{getCategoryLabel(peptide.category)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-primary font-medium">
                        {peptide.dosing[experienceLevel]}
                      </span>
                      {expandedPeptide === peptide.id ? (
                        <ChevronUp size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Beginner</p>
                        <p className="text-foreground font-medium">{peptide.dosing.beginner}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Intermediate</p>
                        <p className="text-foreground font-medium">{peptide.dosing.intermediate}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-muted-foreground">Advanced</p>
                        <p className="text-foreground font-medium">{peptide.dosing.advanced}</p>
                      </div>
                      <div className="p-2 rounded bg-primary/20">
                        <p className="text-primary">Athlete</p>
                        <p className="text-foreground font-medium">{peptide.dosing.athlete}</p>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p><span className="text-muted-foreground">Frequency:</span> <span className="text-foreground">{peptide.frequency}</span></p>
                      <p><span className="text-muted-foreground">Administration:</span> <span className="text-foreground">{peptide.administration}</span></p>
                      {peptide.halfLife && (
                        <p><span className="text-muted-foreground">Half-life:</span> <span className="text-foreground">{peptide.halfLife}</span></p>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </GradientCard>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <GradientCard>
        <h3 className="font-medium text-foreground mb-2 text-sm sm:text-base">Storage & Handling</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Store unreconstituted peptides frozen (-20°C) or refrigerated (2-8°C)</li>
          <li>• After reconstitution, refrigerate and use within 4-6 weeks</li>
          <li>• Use bacteriostatic water for multi-dose reconstitution</li>
          <li>• Avoid shaking - gently swirl to mix</li>
          <li>• Protect from light and heat</li>
        </ul>
      </GradientCard>
    </div>
  );
}
