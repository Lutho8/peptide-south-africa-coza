import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { HomeScreen } from '@/screens/HomeScreen';
import { MyStackScreen } from '@/screens/MyStackScreen';
import { DailyLogScreen } from '@/screens/DailyLogScreen';
import { DosageScreen } from '@/screens/DosageScreen';
import { ResearchLibraryScreen } from '@/screens/ResearchLibraryScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { BodyCompositionModal } from '@/components/modals/BodyCompositionModal';
import { DoseTrackerModal } from '@/components/modals/DoseTrackerModal';
import { CycleManagementModal } from '@/components/modals/CycleManagementModal';
import { BloodworkModal } from '@/components/modals/BloodworkModal';
import { InventoryModal } from '@/components/modals/InventoryModal';
import { NotificationActionModal } from '@/components/modals/NotificationActionModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { LandingPage } from '@/components/landing';
import { useStorageInit } from '@/hooks/useStorageInit';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';
import { Settings, User, LogOut, Loader2, ArrowLeft, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TabId = 'home' | 'stack' | 'daily-log' | 'dosage' | 'research';

const Index = () => {
  useStorageInit();
  const { addDose } = useDailyDoses();
  const { user, signOut, isLoading } = useAuth();
  const { hasAccess, isLoading: accessLoading } = useAccessControl();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [bodyCompositionOpen, setBodyCompositionOpen] = useState(false);
  const [doseTrackerOpen, setDoseTrackerOpen] = useState(false);
  const [cycleManagementOpen, setCycleManagementOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // Handle marking dose as taken from notification
  const handleMarkDoseAsTaken = useCallback((peptideName: string, dose: string, time: string) => {
    // Parse dose value and unit from the dose string (e.g., "250mcg")
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
    // For authenticated users, toggle to landing page
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

  const renderScreen = () => {
    if (showSettings) {
      return <SettingsScreen onBack={() => setShowSettings(false)} />;
    }

    switch (activeTab) {
      case 'home':
        return (
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
        );
      case 'stack':
        return <MyStackScreen />;
      case 'daily-log':
        return <DailyLogScreen />;
      case 'dosage':
        return <DosageScreen />;
      case 'research':
        return <ResearchLibraryScreen />;
      default:
        return null;
    }
  };

  // Show loading state while checking auth or access
  if (isLoading || (user && accessLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }
  
  // Show landing page for authenticated users who want to browse public content
  if (showLandingPage) {
    return (
      <div className="relative">
        <LandingPage />
        {/* Floating Back to Dashboard Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={handleBackToDashboard}
            className="gap-2 bg-primary text-primary-foreground shadow-lg hover:shadow-xl px-6 py-3 rounded-full"
            size="lg"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
   }

  // Show paywall for authenticated users without active membership (not admin)
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
              className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
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
            <Button variant="ghost" className="w-full" onClick={() => signOut()}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show PeptidePro dashboard for authenticated users with access
  return (
    <div className="min-h-screen bg-background">
      {/* App Logo Header */}
      <AppHeader onLogoClick={handleLogoClick} />

      {/* User Auth Button */}
      <div className="fixed top-4 right-16 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-card border-border">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user.user_metadata?.display_name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      >
        <Settings size={20} />
      </button>

      <main className="max-w-lg mx-auto px-4 py-6 pt-20">
        {renderScreen()}
      </main>

      {!showSettings && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Modals */}
      <BodyCompositionModal open={bodyCompositionOpen} onOpenChange={setBodyCompositionOpen} />
      <DoseTrackerModal open={doseTrackerOpen} onOpenChange={setDoseTrackerOpen} />
      <CycleManagementModal open={cycleManagementOpen} onOpenChange={setCycleManagementOpen} />
      <BloodworkModal open={bloodworkOpen} onOpenChange={setBloodworkOpen} />
      <InventoryModal open={inventoryOpen} onOpenChange={setInventoryOpen} />
      <NotificationActionModal onMarkAsTaken={handleMarkDoseAsTaken} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
