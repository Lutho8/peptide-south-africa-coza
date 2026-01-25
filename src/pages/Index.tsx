import { useState, useCallback } from 'react';
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
import { useStorageInit } from '@/hooks/useStorageInit';
import { useDailyDoses } from '@/hooks/useDailyDoses';
import { Settings } from 'lucide-react';

type TabId = 'home' | 'stack' | 'daily-log' | 'dosage' | 'research';

const Index = () => {
  useStorageInit();
  const { addDose } = useDailyDoses();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSettings, setShowSettings] = useState(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* App Logo Header */}
      <AppHeader onLogoClick={handleLogoClick} />

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
    </div>
  );
};

export default Index;
