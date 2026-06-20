import { useState, useEffect } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  isNotificationSupported, 
  requestNotificationPermission, 
  getNotificationPermission,
  scheduleAllTodaysDoses,
  cancelAllNotifications
} from '@/services/notifications';
import { 
  getNotificationSettings, 
  saveNotificationSettings,
  NotificationSettings as NotificationSettingsType 
} from '@/services/storage';
import { 
  getServiceWorkerStatus, 
  isPushSupported,
  forceSyncAndCheck
} from '@/services/pushScheduler';
import { ReminderManager } from '@/components/reminders/ReminderManager';
import { Bell, BellOff, BellRing, Volume2, VolumeX, Clock, Smartphone, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>(getNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [swStatus, setSwStatus] = useState<'active' | 'installing' | 'waiting' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
    
    // Check service worker status
    getServiceWorkerStatus().then(setSwStatus);
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    
    if (newPermission === 'granted') {
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      saveNotificationSettings(newSettings);
      scheduleAllTodaysDoses();
    }
    setIsLoading(false);
  };

  const handleToggleEnabled = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    
    if (enabled) {
      scheduleAllTodaysDoses();
    } else {
      cancelAllNotifications();
    }
  };

  const handleToggleSound = (soundEnabled: boolean) => {
    const newSettings = { ...settings, soundEnabled };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleReminderMinutesChange = (minutes: string) => {
    const value = parseInt(minutes) || 5;
    const newSettings = { ...settings, reminderMinutesBefore: Math.max(1, Math.min(60, value)) };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    
    // Reschedule if enabled
    if (newSettings.enabled) {
      cancelAllNotifications();
      scheduleAllTodaysDoses();
    }
  };

  if (permission === 'unsupported') {
    return (
      <GradientCard className="border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center gap-3">
          <BellOff size={24} className="text-yellow-500" />
          <div>
            <h3 className="font-medium text-foreground">Notifications Not Supported</h3>
            <p className="text-sm text-muted-foreground">
              Your browser doesn't support push notifications.
            </p>
          </div>
        </div>
      </GradientCard>
    );
  }

  if (permission === 'denied') {
    return (
      <GradientCard className="border-red-500/30 bg-red-500/10">
        <div className="flex items-center gap-3">
          <BellOff size={24} className="text-red-500" />
          <div>
            <h3 className="font-medium text-foreground">Notifications Blocked</h3>
            <p className="text-sm text-muted-foreground">
              Please enable notifications in your browser settings to receive dose reminders.
            </p>
          </div>
        </div>
      </GradientCard>
    );
  }

  if (permission !== 'granted') {
    return (
      <GradientCard className="border-primary/30 bg-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Enable Dose Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Get notified when it's time to take your peptides
              </p>
            </div>
          </div>
          <Button 
            onClick={handleEnableNotifications}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? 'Enabling...' : 'Enable'}
          </Button>
        </div>
      </GradientCard>
    );
  }

  return (
    <GradientCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              settings.enabled ? "bg-primary/20" : "bg-muted"
            )}>
              {settings.enabled ? (
                <BellRing size={20} className="text-primary" />
              ) : (
                <BellOff size={20} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">Dose Reminders</h3>
              <p className="text-sm text-muted-foreground">
                {settings.enabled ? 'Active' : 'Disabled'}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="h-px bg-border" />
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 size={18} className="text-muted-foreground" />
                ) : (
                  <VolumeX size={18} className="text-muted-foreground" />
                )}
                <Label className="text-sm text-foreground">Sound</Label>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={handleToggleSound}
              />
            </div>

            {/* Reminder Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-muted-foreground" />
                <Label className="text-sm text-foreground">Remind before</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.reminderMinutesBefore}
                  onChange={(e) => handleReminderMinutesChange(e.target.value)}
                  className="w-16 h-8 text-center bg-muted"
                  min={1}
                  max={60}
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>

            {/* Test Notification */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                new Notification('Test Reminder', {
                  body: 'This is how your dose reminders will appear!',
                  icon: '/favicon.png'
                });
              }}
            >
              Send Test Notification
            </Button>

            {/* Background Notification Status */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-muted-foreground" />
                <div>
                  <Label className="text-sm text-foreground">Background Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Works even when app is closed
                  </p>
                </div>
              </div>
              {isPushSupported() && swStatus === 'active' ? (
                <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                  <Check size={12} />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  {swStatus === 'installing' ? 'Installing...' : 'Not Available'}
                </Badge>
              )}
            </div>

            {/* Force Sync Button */}
            {isPushSupported() && swStatus === 'active' && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                disabled={isSyncing}
                onClick={async () => {
                  setIsSyncing(true);
                  try {
                    await forceSyncAndCheck();
                    toast.success('Reminders synced to background service');
                  } catch {
                    toast.error('Failed to sync reminders');
                  } finally {
                    setIsSyncing(false);
                  }
                }}
              >
                <RefreshCw size={14} className={cn(isSyncing && 'animate-spin')} />
                {isSyncing ? 'Syncing...' : 'Force Sync Reminders'}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Scheduled Reminders List */}
      {settings.enabled && permission === 'granted' && (
        <div className="mt-4">
          <ReminderManager />
        </div>
      )}
    </GradientCard>
  );
}
