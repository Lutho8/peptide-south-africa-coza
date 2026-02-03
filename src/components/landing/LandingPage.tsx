import { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { PeptideQuiz } from './PeptideQuiz';
import { PeptideCompare } from './PeptideCompare';
import { PeptideSearch } from './PeptideSearch';
import { StackBuilder } from './StackBuilder';
import { ReconstitutionCalculator } from './ReconstitutionCalculator';
import { AuthModal } from '@/components/auth/AuthModal';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [stackBuilderOpen, setStackBuilderOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onSignInClick={handleSignInClick} 
        onSearch={() => setSearchOpen(true)}
      />
      
      <main>
        <HeroSection />
        <ResearchTools 
          onCompareClick={() => setCompareOpen(true)}
          onQuizClick={() => setQuizOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onStackClick={() => setStackBuilderOpen(true)}
          onCalculatorClick={() => setCalculatorOpen(true)}
        />
        <FeaturedPeptides />
        <PeptideCategories onCategoryClick={() => setSearchOpen(true)} />
        <CTASection onSignInClick={handleSignInClick} />
      </main>

      <LandingFooter />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
      <PeptideCompare open={compareOpen} onClose={() => setCompareOpen(false)} />
      <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <StackBuilder open={stackBuilderOpen} onClose={() => setStackBuilderOpen(false)} />
      <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </div>
  );
}
