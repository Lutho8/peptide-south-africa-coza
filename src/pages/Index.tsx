import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { HomeScreen } from '@/screens/HomeScreen';
import { MyStackScreen } from '@/screens/MyStackScreen';
import { PeptidesScreen } from '@/screens/PeptidesScreen';
import { DosageScreen } from '@/screens/DosageScreen';
import { EducationScreen } from '@/screens/EducationScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { BodyCompositionModal } from '@/components/modals/BodyCompositionModal';
import { DoseTrackerModal } from '@/components/modals/DoseTrackerModal';
import { CycleManagementModal } from '@/components/modals/CycleManagementModal';
import { PeptideDetailModal } from '@/components/modals/PeptideDetailModal';
import { BloodworkModal } from '@/components/modals/BloodworkModal';
import { InventoryModal } from '@/components/modals/InventoryModal';
import { Peptide } from '@/data/peptides';
import { useStorageInit } from '@/hooks/useStorageInit';
import { Settings } from 'lucide-react';

type TabId = 'home' | 'stack' | 'peptides' | 'dosage' | 'education';

const Index = () => {
  useStorageInit();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [bodyCompositionOpen, setBodyCompositionOpen] = useState(false);
  const [doseTrackerOpen, setDoseTrackerOpen] = useState(false);
  const [cycleManagementOpen, setCycleManagementOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);
  const [peptideDetailOpen, setPeptideDetailOpen] = useState(false);

  const handleViewPeptide = (peptide: Peptide) => {
    setSelectedPeptide(peptide);
    setPeptideDetailOpen(true);
  };

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
            onNavigatePeptides={() => setActiveTab('peptides')}
            onNavigateStack={() => setActiveTab('stack')}
          />
        );
      case 'stack':
        return <MyStackScreen />;
      case 'peptides':
        return <PeptidesScreen onViewPeptide={handleViewPeptide} />;
      case 'dosage':
        return <DosageScreen />;
      case 'education':
        return <EducationScreen />;
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
      <PeptideDetailModal peptide={selectedPeptide} open={peptideDetailOpen} onOpenChange={setPeptideDetailOpen} />
    </div>
  );
};

export default Index;
