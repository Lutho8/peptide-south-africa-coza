import { NewsTicker } from '@/components/home/NewsTicker';
import { BodyCompositionCard } from '@/components/home/BodyCompositionCard';
import { TodaysDoses } from '@/components/home/TodaysDoses';
import { TodaysReminders } from '@/components/home/TodaysReminders';
import { ActiveStackPreview } from '@/components/home/ActiveStackPreview';
import { QuickActions } from '@/components/home/QuickActions';
import { StackCategories } from '@/components/home/StackCategories';
import { SafetyDisclaimer } from '@/components/home/SafetyDisclaimer';
import { userProfile } from '@/data/userData';
import { useDoseReminders } from '@/hooks/useDoseReminders';

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
  return (
    <div className="pb-24 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back,</h1>
          <p className="text-lg text-primary font-medium">{userProfile.name}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-primary-foreground font-bold text-lg">
          {userProfile.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>

      {/* News Ticker */}
      <NewsTicker />

      {/* Body Composition Dashboard */}
      <BodyCompositionCard onViewDetails={onOpenBodyComposition} />

      {/* Today's Doses Summary */}
      <TodaysDoses onViewTracker={onOpenDoseTracker} />

      {/* Today's Reminders Preview */}
      <TodaysReminders reminders={reminders} onViewSettings={onOpenSettings} />

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
