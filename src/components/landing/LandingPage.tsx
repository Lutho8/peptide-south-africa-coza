import { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { AuthModal } from '@/components/auth/AuthModal';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onSignInClick={handleSignInClick} />
      
      <main>
        <HeroSection />
        <ResearchTools />
        <FeaturedPeptides />
        <PeptideCategories />
        <CTASection onSignInClick={handleSignInClick} />
      </main>

      <LandingFooter />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
