import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, Clock, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useDoseReminders } from '@/hooks/useDoseReminders';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  isNativePlatform,
  initializeLocalNotifications,
  scheduleDoseReminder,
  registerNotificationActions,
} from '@/services/capacitorNotifications';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function nextFireTime(time: string, days: string[]): Date {
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    d.setHours(h, m, 0, 0);
    if (d <= now) continue;
    if (days.length === 0 || days.includes(DAY_NAMES[d.getDay()])) return d;
  }
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

function formatRelative(target: Date): string {
  const diffMs = target.getTime() - Date.now();
  if (diffMs < 0) return 'past';
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  return `in ${Math.round(hours / 24)}d`;
}

export default function TodayRemindersScreen() {
  const navigate = useNavigate();
  const { reminders, isLoading, toggleReminder } = useDoseReminders();
  const { addDose } = useDailyDoses();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [enabling, setEnabling] = useState(false);

  const todays = useMemo(() => {
    const today = DAY_NAMES[new Date().getDay()];
    return reminders
      .filter((r) => r.days.length === 0 || r.days.includes(today))
      .map((r) => ({ ...r, next: nextFireTime(r.time, r.days || []) }))
      .sort((a, b) => a.next.getTime() - b.next.getTime());
  }, [reminders]);

  // Schedule on native platform whenever today's enabled list changes.
  useEffect(() => {
    if (!isNativePlatform()) return;
    (async () => {
      try {
        await initializeLocalNotifications();
        await registerNotificationActions();
        for (const r of todays) {
          if (!r.enabled) continue;
          await scheduleDoseReminder(r.id, r.peptide_name, r.dose, r.next, r.peptide_id);
        }
      } catch (e) {
        console.error('native schedule failed', e);
      }
    })();
  }, [todays]);

  const enablePush = async () => {
    setEnabling(true);
    try {
      if (isNativePlatform()) {
        const ok = await initializeLocalNotifications();
        if (ok) {
          await registerNotificationActions();
          setPermission('granted');
          toast.success('Notifications enabled on this device');
        } else {
          toast.error('Notifications were not granted');
        }
      } else {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm === 'granted') toast.success('Notifications enabled');
        else toast.error('Notifications blocked. Enable in browser settings.');
      }
    } finally {
      setEnabling(false);
    }
  };

  const markTaken = async (peptideId: string, peptideName: string, doseStr: string) => {
    const m = doseStr.match(/^([\d.]+)\s*(mg|IU|units)$/i);
    const value = m ? parseFloat(m[1]) : 0;
    const unit = (m ? m[2] : 'mg') as 'mg' | 'IU' | 'units';
    await addDose({
      date: format(new Date(), 'yyyy-MM-dd'),
      peptide_id: peptideId,
      peptide_name: peptideName,
      dose: value,
      unit,
      time: format(new Date(), 'HH:mm'),
      notes: 'Logged from Today reminders',
    });
    toast.success(`${peptideName} logged`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Today's Reminders" description="All dose reminders for today with next firing times." />
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Today's Reminders
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {todays.filter((r) => r.enabled).length} active · {todays.length} total
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-4">
        {/* Push status card */}
        <div
          className={cn(
            'rounded-xl border p-4 flex items-center justify-between gap-3',
            permission === 'granted'
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-primary/30 bg-primary/10'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {permission === 'granted' ? (
              <Bell size={20} className="text-green-500 shrink-0" />
            ) : (
              <BellOff size={20} className="text-primary shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Push notifications {permission === 'granted' ? 'enabled' : 'off'}
              </p>
              <p className="text-xs text-muted-foreground">
                {permission === 'granted'
                  ? 'You will receive dose alerts on this device.'
                  : 'Enable to get alerts on your phone at dose time.'}
              </p>
            </div>
          </div>
          {permission !== 'granted' && (
            <Button size="sm" onClick={enablePush} disabled={enabling || permission === 'unsupported'}>
              {enabling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enable'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : todays.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No reminders scheduled for today.</p>
            <p className="text-xs mt-1">Add reminders from the Dosage screen.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todays.map((r, i) => {
              const past = r.next.getTime() < Date.now();
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'rounded-xl border p-3 flex items-center gap-3',
                    r.enabled
                      ? 'border-border bg-card'
                      : 'border-border/40 bg-muted/30 opacity-60'
                  )}
                >
                  <div className="w-14 text-center shrink-0">
                    <div className="text-sm font-bold text-primary">{r.time}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                      <Clock size={9} /> {formatRelative(r.next)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.peptide_name}</p>
                    <p className="text-xs text-muted-foreground">{r.dose}</p>
                  </div>
                  {r.enabled && !past && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => markTaken(r.peptide_id, r.peptide_name, r.dose)}
                    >
                      <Check size={14} className="mr-1" /> Taken
                    </Button>
                  )}
                  <Switch
                    checked={r.enabled}
                    onCheckedChange={() => toggleReminder(r.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
