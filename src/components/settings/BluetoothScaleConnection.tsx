import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { useBluetoothScale } from '@/hooks/useBluetoothScale';
import { Scale, Bluetooth, BluetoothOff, Loader2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BluetoothScaleConnection() {
  const { t } = useTranslation();
  const {
    isSupported,
    isConnecting,
    isConnected,
    deviceName,
    lastReading,
    connectScale,
    disconnectScale,
  } = useBluetoothScale();

  if (!isSupported) {
    return (
      <GradientCard className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">{t('bluetooth.title', 'Bluetooth Scale')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('bluetooth.notSupported', 'Bluetooth is not supported on this browser. Try using Chrome on Android or desktop.')}
            </p>
          </div>
        </div>
      </GradientCard>
    );
  }

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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={disconnectScale}
              className="text-destructive hover:text-destructive"
            >
              <BluetoothOff size={14} className="mr-1" />
              {t('bluetooth.disconnect', 'Disconnect')}
            </Button>
          ) : (
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
          )}
        </div>
      </div>

      {!isConnected && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <p>
            {t('bluetooth.instructions', 'Step on your scale to wake it up, then click Connect. Make sure Bluetooth is enabled on your device.')}
          </p>
        </div>
      )}

      {isConnected && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/10 text-xs text-primary">
          <Scale size={14} className="flex-shrink-0 mt-0.5" />
          <p>
            {t('bluetooth.readyToMeasure', 'Ready to receive measurements. Step on your scale and the reading will be saved automatically.')}
          </p>
        </div>
      )}
    </GradientCard>
  );
}
