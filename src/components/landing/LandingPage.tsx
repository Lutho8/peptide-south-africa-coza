import { useState, useEffect, lazy, Suspense } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { BlogSection } from './BlogSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { VendorShowcase } from './VendorShowcase';
import { FAQSection } from './FAQSection';
import { useAuth } from '@/contexts/AuthContext';

import { PeptideCategory } from '@/data/peptides';

// Lazy load modals - only loaded when opened
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

const PeptideQuiz = lazy(() => import('./PeptideQuiz').then(m => ({ default: m.PeptideQuiz })));
const PeptideCompare = lazy(() => import('./PeptideCompare').then(m => ({ default: m.PeptideCompare })));
const PeptideSearch = lazy(() => import('./PeptideSearch').then(m => ({ default: m.PeptideSearch })));
const StackBuilder = lazy(() => import('./StackBuilder').then(m => ({ default: m.StackBuilder })));
const ReconstitutionCalculator = lazy(() => import('./ReconstitutionCalculator').then(m => ({ default: m.ReconstitutionCalculator })));

export function LandingPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [stackBuilderOpen, setStackBuilderOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  const handleCategoryClick = (category: PeptideCategory) => {
    setSearchOpen(true);
  };

  const handleAccessDashboard = () => {
    // This would redirect to dashboard - handled by parent component
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onSignInClick={handleSignInClick} 
        onSearch={() => setSearchOpen(true)}
      />
      
      <main>
        <HeroSection onCategoryClick={handleCategoryClick} />
        <FAQSection />
        <VendorShowcase onSignInClick={handleSignInClick} />
        <ResearchTools 
          onCompareClick={() => setCompareOpen(true)}
          onQuizClick={() => setQuizOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onStackClick={() => setStackBuilderOpen(true)}
          onCalculatorClick={() => setCalculatorOpen(true)}
        />
        <FeaturedPeptides />
        <PeptideCategories onCategoryClick={() => setSearchOpen(true)} />
        <BlogSection />
        <CTASection onSignInClick={handleSignInClick} />
      </main>

      <LandingFooter />

      <Suspense fallback={null}>
        {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
        {quizOpen && <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />}
        {compareOpen && <PeptideCompare open={compareOpen} onClose={() => setCompareOpen(false)} />}
        {searchOpen && <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
        {stackBuilderOpen && <StackBuilder open={stackBuilderOpen} onClose={() => setStackBuilderOpen(false)} />}
        {calculatorOpen && <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />}
      </Suspense>
    </div>
  );
}
