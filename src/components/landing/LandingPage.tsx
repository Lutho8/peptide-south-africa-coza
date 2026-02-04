import { useState, useEffect } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { BlogSection } from './BlogSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { PeptideQuiz } from './PeptideQuiz';
import { PeptideCompare } from './PeptideCompare';
import { PeptideSearch } from './PeptideSearch';
import { StackBuilder } from './StackBuilder';
import { ReconstitutionCalculator } from './ReconstitutionCalculator';
import { MembersPaywall } from './MembersPaywall';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';
import { PeptideCategory } from '@/data/peptides';

export function LandingPage() {
  const { user } = useAuth();
  const { hasMembership } = useMembership();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [membersPaywallOpen, setMembersPaywallOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [stackBuilderOpen, setStackBuilderOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Check URL for membership callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('membership') === 'success') {
      setMembersPaywallOpen(true);
    }
  }, []);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  const handleMembersClick = () => {
    setMembersPaywallOpen(true);
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
        onSignInClick={handleMembersClick} 
        onSearch={() => setSearchOpen(true)}
      />
      
      <main>
        <HeroSection onCategoryClick={handleCategoryClick} />
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
        <CTASection onSignInClick={handleMembersClick} />
      </main>

      <LandingFooter />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <MembersPaywall 
        open={membersPaywallOpen} 
        onOpenChange={setMembersPaywallOpen}
        onSignInClick={() => {
          setMembersPaywallOpen(false);
          setAuthModalOpen(true);
        }}
        isAuthenticated={!!user}
        onAccessDashboard={handleAccessDashboard}
      />
      <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
      <PeptideCompare open={compareOpen} onClose={() => setCompareOpen(false)} />
      <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <StackBuilder open={stackBuilderOpen} onClose={() => setStackBuilderOpen(false)} />
      <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </div>
  );
}
