import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { useStorageInit } from '@/hooks/useStorageInit';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useProfileSync } from '@/hooks/useProfileSync';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { HomeSkeleton, ListSkeleton, CardSkeleton } from '@/components/ui/ScreenSkeleton';
import { InstallBanner } from '@/components/pwa/InstallBanner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Settings, User, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Lazy load screens for code splitting
const HomeScreen = lazy(() => import('@/screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const MyStackScreen = lazy(() => import('@/screens/MyStackScreen').then(m => ({ default: m.MyStackScreen })));
const DailyLogScreen = lazy(() => import('@/screens/DailyLogScreen').then(m => ({ default: m.DailyLogScreen })));
const DosageScreen = lazy(() => import('@/screens/DosageScreen').then(m => ({ default: m.DosageScreen })));
const ResearchLibraryScreen = lazy(() => import('@/screens/ResearchLibraryScreen').then(m => ({ default: m.ResearchLibraryScreen })));
const TransformationScreen = lazy(() => import('@/screens/TransformationScreen').then(m => ({ default: m.TransformationScreen })));
const SettingsScreen = lazy(() => import('@/screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const LandingPage = lazy(() => import('@/components/landing/LandingPage').then(m => ({ default: m.LandingPage })));

// Lazy load modals
const BodyCompositionModal = lazy(() => import('@/components/modals/BodyCompositionModal').then(m => ({ default: m.BodyCompositionModal })));
const DoseTrackerModal = lazy(() => import('@/components/modals/DoseTrackerModal').then(m => ({ default: m.DoseTrackerModal })));
const CycleManagementModal = lazy(() => import('@/components/modals/CycleManagementModal').then(m => ({ default: m.CycleManagementModal })));
const BloodworkModal = lazy(() => import('@/components/modals/BloodworkModal').then(m => ({ default: m.BloodworkModal })));
const InventoryModal = lazy(() => import('@/components/modals/InventoryModal').then(m => ({ default: m.InventoryModal })));
const NotificationActionModal = lazy(() => import('@/components/modals/NotificationActionModal').then(m => ({ default: m.NotificationActionModal })));
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })));
const ProfileSetupWizard = lazy(() => import('@/components/onboarding/ProfileSetupWizard').then(m => ({ default: m.ProfileSetupWizard })));

const ScreenLoaderHome = () => <HomeSkeleton />;
const ScreenLoaderList = () => <ListSkeleton />;
const ScreenLoaderCards = () => <CardSkeleton />;

type TabId = 'home' | 'stack' | 'daily-log' | 'dosage' | 'transformation';

const Index = () => {
  useStorageInit();
  const { addDose } = useDailyDoses();
  const { user, signOut, isLoading } = useAuth();
  const { isLoading: accessLoading } = useAccessControl();
  const { hydrated: profileHydrated } = useProfileSync();
  const { getDirection, getTransitionVariants } = useScreenTransition();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [bodyCompositionOpen, setBodyCompositionOpen] = useState(false);
  const [doseTrackerOpen, setDoseTrackerOpen] = useState(false);
  const [cycleManagementOpen, setCycleManagementOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);

  // Auto-open the profile setup wizard once per user — wait for cloud hydration first
  // so we don't prompt a user who already has a profile saved on another device.
  useEffect(() => {
    if (!user || !profileHydrated) return;
    let cancelled = false;
    import('@/components/onboarding/ProfileSetupWizard').then(({ shouldShowProfileSetup }) => {
      if (cancelled) return;
      if (shouldShowProfileSetup(user.id)) {
        const t = setTimeout(() => setProfileSetupOpen(true), 600);
        return () => clearTimeout(t);
      }
    });
    return () => { cancelled = true; };
  }, [user, profileHydrated]);

  const handleMarkDoseAsTaken = useCallback((peptideName: string, dose: string, time: string) => {
    const doseMatch = dose.match(/^([\d.]+)(\w+)$/);
    const doseValue = doseMatch ? parseFloat(doseMatch[1]) : 0;
    const unit = (doseMatch ? doseMatch[2] : 'mg') as 'mg' | 'IU' | 'units';
    
    addDose({
      date: format(new Date(), 'yyyy-MM-dd'),
      peptide_id: peptideName.toLowerCase().replace(/\s+/g, '-'),
      peptide_name: peptideName,
      dose: doseValue,
      unit: unit,
      time: time,
      notes: 'Logged from notification',
    });
  }, [addDose]);

  const handleLogoClick = () => {
    setShowSettings(false);
    if (user) {
      setShowLandingPage(true);
    } else {
      setActiveTab('home');
    }
  };
  
  const handleBackToDashboard = () => {
    setShowLandingPage(false);
    setActiveTab('home');
  };

  const screenKey = showSettings ? 'settings' : showResearch ? 'research' : activeTab;
  const direction = getDirection(screenKey);
  const variants = getTransitionVariants(direction);

  const renderScreen = () => {
    if (showSettings) {
      return (
        <ErrorBoundary fallbackTitle="Settings failed to load">
          <Suspense fallback={<ScreenLoaderList />}>
            <SettingsScreen onBack={() => setShowSettings(false)} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    if (showResearch) {
      return (
        <ErrorBoundary fallbackTitle="Research Library failed to load">
          <Suspense fallback={<ScreenLoaderList />}>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResearch(false)}
                className="mb-4 gap-1 text-muted-foreground"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
              <ResearchLibraryScreen />
            </div>
          </Suspense>
        </ErrorBoundary>
      );
    }

    const fallbacks: Record<TabId, JSX.Element> = {
      home: <ScreenLoaderHome />,
      stack: <ScreenLoaderList />,
      'daily-log': <ScreenLoaderList />,
      dosage: <ScreenLoaderCards />,
      transformation: <ScreenLoaderCards />,
    };

    const screenNames: Record<TabId, string> = {
      home: 'Dashboard',
      stack: 'My Stack',
      'daily-log': 'Daily Log',
      dosage: 'Dosage Calculator',
      transformation: 'Transformation',
    };

    return (
      <ErrorBoundary fallbackTitle={`${screenNames[activeTab]} failed to load`}>
        <Suspense fallback={fallbacks[activeTab]}>
          {activeTab === 'home' && (
            <HomeScreen
              onOpenBodyComposition={() => setBodyCompositionOpen(true)}
              onOpenDoseTracker={() => setDoseTrackerOpen(true)}
              onOpenCycles={() => setCycleManagementOpen(true)}
              onOpenBloodwork={() => setBloodworkOpen(true)}
              onOpenInventory={() => setInventoryOpen(true)}
              onNavigatePeptides={() => setActiveTab('daily-log')}
              onNavigateStack={() => setActiveTab('stack')}
              onOpenSettings={() => setShowSettings(true)}
              onNavigateResearch={() => setShowResearch(true)}
            />
          )}
          {activeTab === 'stack' && <MyStackScreen />}
          {activeTab === 'daily-log' && <DailyLogScreen />}
          {activeTab === 'dosage' && <DosageScreen />}
          {activeTab === 'transformation' && <TransformationScreen />}
        </Suspense>
      </ErrorBoundary>
    );
  };

  // Loading state
  if (isLoading || (user && accessLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Landing page for unauthenticated users
  if (!user) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <LandingPage />
      </Suspense>
    );
  }
  
  // Landing page for authenticated users browsing public content
  if (showLandingPage) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <div className="relative">
          <LandingPage />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Button
              onClick={handleBackToDashboard}
              className="gap-2 bg-primary text-primary-foreground shadow-lg hover:shadow-xl px-6 py-3 rounded-full touch-target"
              size="lg"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </Suspense>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogoClick={handleLogoClick} />

      {/* User Auth Button */}
      <div className="fixed top-4 right-16 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-card border-border touch-target">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user.user_metadata?.display_name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive touch-target">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors touch-target"
      >
        <Settings size={20} />
      </button>

      <main className="max-w-lg mx-auto px-4 py-6 pt-20 pb-28 scroll-smooth-touch">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!showSettings && !showResearch && (
        <BottomNav activeTab={activeTab} onTabChange={(tab) => { setShowResearch(false); setActiveTab(tab); }} />
      )}

      <InstallBanner />

      {/* Modals - lazy loaded */}
      <Suspense fallback={null}>
        {bodyCompositionOpen && <BodyCompositionModal open={bodyCompositionOpen} onOpenChange={setBodyCompositionOpen} />}
        {doseTrackerOpen && <DoseTrackerModal open={doseTrackerOpen} onOpenChange={setDoseTrackerOpen} />}
        {cycleManagementOpen && <CycleManagementModal open={cycleManagementOpen} onOpenChange={setCycleManagementOpen} />}
        {bloodworkOpen && <BloodworkModal open={bloodworkOpen} onOpenChange={setBloodworkOpen} />}
        {inventoryOpen && <InventoryModal open={inventoryOpen} onOpenChange={setInventoryOpen} />}
        <NotificationActionModal onMarkAsTaken={handleMarkDoseAsTaken} />
        {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
        {profileSetupOpen && (
          <ProfileSetupWizard
            open={profileSetupOpen}
            onOpenChange={setProfileSetupOpen}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Index;
