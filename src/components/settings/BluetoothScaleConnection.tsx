import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/GradientCard';
import { useBluetoothScale } from '@/hooks/useBluetoothScale';
import { saveBodyCompositionEntry, BodyComposition, getBodyCompositionHistory } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Scale, Bluetooth, BluetoothOff, Loader2, Info, AlertTriangle, Edit3, Save, X, HelpCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function BluetoothScaleConnection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSupported,
    isConnecting,
    isConnected,
    isSyncing,
    deviceName,
    lastReading,
    scaleBrand,
    connectScale,
    disconnectScale,
    syncNow,
  } = useBluetoothScale();

  const brandLabel = scaleBrand
    ? scaleBrand.charAt(0).toUpperCase() + scaleBrand.slice(1)
    : null;

  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualWeight, setManualWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showRenphoGuide, setShowRenphoGuide] = useState(false);

  const handleManualSave = async () => {
    const weight = parseFloat(manualWeight);
    if (isNaN(weight) || weight < 20 || weight > 300) {
      toast({
        title: "Invalid weight",
        description: "Please enter a weight between 20 and 300 kg.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    const date = new Date().toISOString().split('T')[0];
    const history = getBodyCompositionHistory();
    const latest = history[0];

    const entry: BodyComposition = {
      date,
      weight,
      bmi: weight / Math.pow(1.75, 2), // Assume average height for BMI
      bodyFat: latest?.bodyFat,
      fatFreeWeight: latest?.bodyFat ? weight * (1 - latest.bodyFat / 100) : undefined,
      muscleMass: latest?.muscleMass,
      skeletalMuscle: latest?.skeletalMuscle,
      bodyWater: latest?.bodyWater,
      subcutaneousFat: latest?.subcutaneousFat,
      boneMass: latest?.boneMass,
      protein: latest?.protein,
      visceralFat: latest?.visceralFat,
      metabolicAge: latest?.metabolicAge,
      bmr: latest?.bmr,
      source: 'manual',
    };

    saveBodyCompositionEntry(entry);

    // Save to cloud if logged in
    if (user) {
      try {
        await supabase.from('body_composition').upsert({
          user_id: user.id,
          date: entry.date,
          weight: entry.weight,
          body_fat: entry.bodyFat,
          fat_free_weight: entry.fatFreeWeight,
          muscle_mass: entry.muscleMass,
          skeletal_muscle: entry.skeletalMuscle,
          body_water: entry.bodyWater,
          subcutaneous_fat: entry.subcutaneousFat,
          bone_mass: entry.boneMass,
          protein: entry.protein,
          bmi: entry.bmi,
          visceral_fat: entry.visceralFat,
          metabolic_age: entry.metabolicAge,
          bmr: entry.bmr,
          source: 'manual',
        }, { onConflict: 'user_id,date' });
      } catch (err) {
        console.error('Error saving to cloud:', err);
      }
    }

    setIsSaving(false);
    setManualWeight('');
    setShowManualEntry(false);

    toast({
      title: "Weight saved",
      description: `${weight} kg recorded successfully.`,
    });
  };

  return (
    <GradientCard className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale 
            size={20} 
            className={cn(
              "transition-colors",
              isConnected ? "text-primary" : "text-muted-foreground"
            )} 
          />
          <div>
            <p className="font-medium text-foreground">
              {t('bluetooth.title', 'Bluetooth Scale')}
            </p>
            <p className="text-xs text-muted-foreground">
              {isConnected 
                ? `${deviceName} • ${t('bluetooth.connected', 'Connected')}${lastReading ? ` • ${t('settings.lastSync', 'Last sync')}: ${lastReading.toLocaleTimeString()}` : ''}`
                : t('bluetooth.notConnected', 'Not connected')
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={syncNow}
                disabled={isSyncing}
                title="Re-read latest measurement from the scale"
              >
                {isSyncing ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : (
                  <RefreshCw size={14} className="mr-1" />
                )}
                Sync Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnectScale}
                className="text-destructive hover:text-destructive"
              >
                <BluetoothOff size={14} className="mr-1" />
                {t('bluetooth.disconnect', 'Disconnect')}
              </Button>
            </>
          ) : isSupported ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={connectScale}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <Bluetooth size={14} className="mr-1" />
              )}
              {t('bluetooth.connect', 'Connect')}
            </Button>
          ) : null}
        </div>
      </div>

      {!isSupported && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 text-xs text-warning">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              {t('bluetooth.notSupported', 'Bluetooth is not supported on this browser.')}
            </p>
            <p className="text-warning/80">
              On iPhone/iPad, Web Bluetooth is unavailable in Safari — install the app to your home screen and use the native version, or use manual entry below.
            </p>
          </div>
        </div>
      )}

      {!isConnected && isSupported && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              {t('bluetooth.instructions', 'Step on your scale to wake it up, then click Connect. Make sure Bluetooth is enabled on your device.')}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground/80 px-1">
            ✓ Works with <span className="text-foreground font-medium">Renpho</span>, Xiaomi Mi Body, Eufy, Withings, Yunmai, and standard Bluetooth scales.
          </p>
        </div>
      )}

      {/* Renpho pairing guide */}
      <Collapsible open={showRenphoGuide} onOpenChange={setShowRenphoGuide}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={14} />
              How to pair my Renpho scale
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                showRenphoGuide && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="rounded-lg bg-muted/40 p-3 space-y-3">
            <ol className="space-y-2.5 text-xs text-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center text-[10px]">1</span>
                <span className="text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">Open the Renpho app</span> on your phone and <span className="text-foreground font-medium">forget / unpair</span> the scale from it (Bluetooth scales only talk to one device at a time).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center text-[10px]">2</span>
                <span className="text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">Step on the scale</span> so the display lights up — it should now be in pairing mode.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center text-[10px]">3</span>
                <span className="text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">Tap "Connect" above</span> and pick your scale from the browser's Bluetooth chooser.
                </span>
              </li>
            </ol>
            <p className="text-[11px] text-muted-foreground/80 italic border-t border-border/50 pt-2">
              Still not showing? Toggle Bluetooth off/on in your phone settings, then try again.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {isConnected && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/10 text-xs text-primary">
            <Scale size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              {t('bluetooth.readyToMeasure', 'Ready to receive measurements. Step on your scale and the reading will be saved automatically.')}
            </p>
          </div>
          {lastReading && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs">
              <span className="text-muted-foreground">Last reading received:</span>
              <span className="text-foreground font-medium">{lastReading.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Section */}
      <div className="border-t border-border/50 pt-4">
        {!showManualEntry ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowManualEntry(true)}
          >
            <Edit3 size={14} />
            {t('bluetooth.manualEntry', 'Enter weight manually')}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t('bluetooth.quickWeightEntry', 'Quick Weight Entry')}</Label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => {
                  setShowManualEntry(false);
                  setManualWeight('');
                }}
              >
                <X size={14} />
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder="e.g. 75.5"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('bluetooth.weightInKg', 'Weight in kilograms (kg)')}
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleManualSave}
                disabled={isSaving || !manualWeight}
                className="self-start"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
