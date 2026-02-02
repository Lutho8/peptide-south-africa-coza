import { NewsTicker } from '@/components/home/NewsTicker';
import { BodyCompositionCard } from '@/components/home/BodyCompositionCard';
import { TodaysDoses } from '@/components/home/TodaysDoses';
import { TodaysReminders } from '@/components/home/TodaysReminders';
import { WeeklyAdherenceReport } from '@/components/home/WeeklyAdherenceReport';
import { MissedDosesCard } from '@/components/home/MissedDosesCard';
import { AchievementsBadges } from '@/components/home/AchievementsBadges';
import { ActiveStackPreview } from '@/components/home/ActiveStackPreview';
import { QuickActions } from '@/components/home/QuickActions';
import { StackCategories } from '@/components/home/StackCategories';
import { SafetyDisclaimer } from '@/components/home/SafetyDisclaimer';
import { useDoseReminders } from '@/hooks/useDoseReminders';
import { useAuth } from '@/contexts/AuthContext';

interface HomeScreenProps {
  onOpenBodyComposition: () => void;
  onOpenDoseTracker: () => void;
  onOpenCycles: () => void;
  onOpenBloodwork: () => void;
  onOpenInventory: () => void;
  onNavigatePeptides: () => void;
  onNavigateStack: () => void;
  onOpenSettings: () => void;
}

export function HomeScreen({
  onOpenBodyComposition,
  onOpenDoseTracker,
  onOpenCycles,
  onOpenBloodwork,
  onOpenInventory,
  onNavigatePeptides,
  onNavigateStack,
  onOpenSettings
}: HomeScreenProps) {
  const { reminders } = useDoseReminders();
  const { user } = useAuth();
  
  // Get display name from user metadata or fallback to email
  const displayName = user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'Guest';
  
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="pb-24 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back,</h1>
          <p className="text-lg text-primary font-medium">{displayName}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
          {initials}
        </div>
      </div>

      {/* News Ticker */}
      <NewsTicker />

      {/* Body Composition Dashboard */}
      <BodyCompositionCard onViewDetails={onOpenBodyComposition} />

      {/* Today's Doses Summary */}
      <TodaysDoses onViewTracker={onOpenDoseTracker} />

      {/* Today's Reminders Preview */}
      <TodaysReminders 
        reminders={reminders} 
        onViewSettings={onOpenSettings}
        onMarkAsTaken={(peptideName, dose, time) => {
          // Dispatch event to trigger dose logging via NotificationActionModal
          const event = new CustomEvent('doseNotificationClick', {
            detail: { peptideName, dose, time }
          });
          window.dispatchEvent(event);
        }}
      />

      {/* Weekly Adherence Report */}
      <WeeklyAdherenceReport onViewSettings={onOpenSettings} />

      {/* Missed Doses Quick-Log */}
      <MissedDosesCard />

      {/* Achievements & Badges */}
      <AchievementsBadges />

      {/* Active Protocol Preview */}
      <ActiveStackPreview onViewStack={onNavigateStack} />

      {/* Quick Actions Grid */}
      <QuickActions
        onDoseTracker={onOpenDoseTracker}
        onBodyStats={onOpenBodyComposition}
        onCycles={onOpenCycles}
        onPeptides={onNavigatePeptides}
        onBloodwork={onOpenBloodwork}
        onInventory={onOpenInventory}
      />

      {/* Stack Categories */}
      <StackCategories />

      {/* Safety Disclaimer */}
      <SafetyDisclaimer />
    </div>
  );
}
