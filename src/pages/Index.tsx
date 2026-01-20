import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomeScreen } from '@/screens/HomeScreen';
import { MyStackScreen } from '@/screens/MyStackScreen';
import { PeptidesScreen } from '@/screens/PeptidesScreen';
import { DosageScreen } from '@/screens/DosageScreen';
import { EducationScreen } from '@/screens/EducationScreen';
import { BodyCompositionModal } from '@/components/modals/BodyCompositionModal';
import { DoseTrackerModal } from '@/components/modals/DoseTrackerModal';
import { CycleManagementModal } from '@/components/modals/CycleManagementModal';
import { PeptideDetailModal } from '@/components/modals/PeptideDetailModal';
import { Peptide } from '@/data/peptides';
import { useStorageInit } from '@/hooks/useStorageInit';

type TabId = 'home' | 'stack' | 'peptides' | 'dosage' | 'education';

const Index = () => {
  // Initialize storage and notifications
  useStorageInit();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [bodyCompositionOpen, setBodyCompositionOpen] = useState(false);
  const [doseTrackerOpen, setDoseTrackerOpen] = useState(false);
  const [cycleManagementOpen, setCycleManagementOpen] = useState(false);
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);
  const [peptideDetailOpen, setPeptideDetailOpen] = useState(false);

  const handleViewPeptide = (peptide: Peptide) => {
    setSelectedPeptide(peptide);
    setPeptideDetailOpen(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onOpenBodyComposition={() => setBodyCompositionOpen(true)}
            onOpenDoseTracker={() => setDoseTrackerOpen(true)}
            onOpenCycles={() => setCycleManagementOpen(true)}
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
      <main className="max-w-lg mx-auto px-4 py-6">
        {renderScreen()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <BodyCompositionModal 
        open={bodyCompositionOpen} 
        onOpenChange={setBodyCompositionOpen} 
      />
      <DoseTrackerModal 
        open={doseTrackerOpen} 
        onOpenChange={setDoseTrackerOpen} 
      />
      <CycleManagementModal 
        open={cycleManagementOpen} 
        onOpenChange={setCycleManagementOpen} 
      />
      <PeptideDetailModal 
        peptide={selectedPeptide}
        open={peptideDetailOpen} 
        onOpenChange={setPeptideDetailOpen} 
      />
    </div>
  );
};

export default Index;
