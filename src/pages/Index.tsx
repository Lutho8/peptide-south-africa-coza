import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { useStorageInit } from '@/hooks/useStorageInit';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useScreenTransition } from '@/hooks/useScreenTransition';
import { HomeSkeleton, ListSkeleton, CardSkeleton } from '@/components/ui/ScreenSkeleton';
import { InstallBanner } from '@/components/pwa/InstallBanner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Settings, User, LogOut, Loader2, ArrowLeft, Crown, Lock } from 'lucide-react';
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

const ScreenLoaderHome = () => <HomeSkeleton />;
const ScreenLoaderList = () => <ListSkeleton />;
const ScreenLoaderCards = () => <CardSkeleton />;

type TabId = 'home' | 'stack' | 'daily-log' | 'dosage' | 'research';

const Index = () => {
  useStorageInit();
  const { addDose } = useDailyDoses();
  const { user, signOut, isLoading } = useAuth();
  const { hasAccess, isLoading: accessLoading } = useAccessControl();
  const { getDirection, getTransitionVariants } = useScreenTransition();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [bodyCompositionOpen, setBodyCompositionOpen] = useState(false);
  const [doseTrackerOpen, setDoseTrackerOpen] = useState(false);
  const [cycleManagementOpen, setCycleManagementOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const handleMarkDoseAsTaken = useCallback((peptideName: string, dose: string, time: string) => {
    const doseMatch = dose.match(/^([\d.]+)(\w+)$/);
    const doseValue = doseMatch ? parseFloat(doseMatch[1]) : 0;
    const unit = (doseMatch ? doseMatch[2] : 'mcg') as 'mcg' | 'mg' | 'IU';
    
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

  const screenKey = showSettings ? 'settings' : activeTab;
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

    const fallbacks: Record<TabId, JSX.Element> = {
      home: <ScreenLoaderHome />,
      stack: <ScreenLoaderList />,
      'daily-log': <ScreenLoaderList />,
      dosage: <ScreenLoaderCards />,
      research: <ScreenLoaderList />,
    };

    const screenNames: Record<TabId, string> = {
      home: 'Dashboard',
      stack: 'My Stack',
      'daily-log': 'Daily Log',
      dosage: 'Dosage Calculator',
      research: 'Research Library',
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
            />
          )}
          {activeTab === 'stack' && <MyStackScreen />}
          {activeTab === 'daily-log' && <DailyLogScreen />}
          {activeTab === 'dosage' && <DosageScreen />}
          {activeTab === 'research' && <ResearchLibraryScreen />}
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

  // Paywall for users without membership
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Membership Required</h1>
            <p className="text-muted-foreground mt-2">
              A €9.99/month Pro Membership is required to access the Peptide Pro dashboard.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown size={20} className="text-primary" />
              <span className="font-semibold text-foreground">Pro Membership</span>
            </div>
            <p className="text-2xl font-bold text-foreground">€9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full bg-[#0070ba] hover:bg-[#003087] text-white touch-target"
              onClick={() => {
                const returnUrl = encodeURIComponent(window.location.origin + '/?membership=success');
                const cancelUrl = encodeURIComponent(window.location.origin + '/?membership=cancelled');
                window.open(`https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-PEPTIDEPRO-MONTHLY-EUR&return_url=${returnUrl}&cancel_url=${cancelUrl}`, '_blank');
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .761-.629h6.317c2.102 0 3.585.453 4.413 1.348.796.858 1.058 2.042.781 3.52l-.026.15-.13.626-.038.171c-.537 2.664-2.212 4.004-4.976 4.004H9.73l-.969 5.434a.77.77 0 0 1-.761.629H7.076Z"/>
                <path d="M19.956 8.665c-.497 2.922-2.401 4.405-5.696 4.405h-1.445c-.35 0-.648.253-.703.597l-.792 5.027-.224 1.421a.37.37 0 0 0 .366.427h2.57a.641.641 0 0 0 .632-.538l.026-.135.501-3.17.032-.175a.641.641 0 0 1 .633-.538h.399c2.581 0 4.6-1.048 5.191-4.079.247-1.266.119-2.323-.535-3.066a2.563 2.563 0 0 0-.955-.676Z"/>
              </svg>
              Subscribe with PayPal
            </Button>
            <Button variant="ghost" className="w-full touch-target" onClick={() => signOut()}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
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

      <main className="max-w-lg mx-auto px-4 py-6 pt-20 scroll-smooth-touch">
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

      {!showSettings && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
      </Suspense>
    </div>
  );
};

export default Index;
