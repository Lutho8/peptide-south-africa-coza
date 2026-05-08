import { useState, lazy, Suspense } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { BentoFeatures } from './BentoFeatures';
import { Testimonials } from './Testimonials';
import { PricingSection } from './PricingSection';
import { WhyFreeBand } from './WhyFreeBand';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { BlogSection } from './BlogSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { FAQSection, faqCategories } from './FAQSection';
import { SafetyDisclaimerBand } from './SafetyDisclaimerBand';
import { LiveQnAPopup } from './LiveQnAPopup';
import { useAuth } from '@/contexts/AuthContext';
import { useTeaserMode } from '@/hooks/useTeaserMode';
import { PremiumLockOverlay } from '@/components/paywall/PremiumLockOverlay';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, buildFAQSchema } from '@/components/seo/JsonLd';

import { PeptideCategory } from '@/data/peptides';

// Lazy load modals - only loaded when opened
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

const PeptideQuiz = lazy(() => import('./PeptideQuiz').then(m => ({ default: m.PeptideQuiz })));
const BlendsAndStacks = lazy(() => import('./BlendsAndStacks').then(m => ({ default: m.BlendsAndStacks })));
const PeptideSearch = lazy(() => import('./PeptideSearch').then(m => ({ default: m.PeptideSearch })));
const ReconstitutionCalculator = lazy(() => import('./ReconstitutionCalculator').then(m => ({ default: m.ReconstitutionCalculator })));

export function LandingPage() {
  const { user } = useAuth();
  const { teaser } = useTeaserMode();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [blendsStacksOpen, setBlendsStacksOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  const handleCategoryClick = (category: PeptideCategory) => {
    setSearchOpen(true);
  };

  const handleAccessDashboard = () => {
    window.location.reload();
  };

  // Collect all FAQs for JSON-LD
  const allFaqs = faqCategories.flatMap(cat => cat.faqs);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Ride The Tide – Peptide Research & Protocol Tracking Platform"
        description="Research-backed peptide database with protocol tracking, reconstitution calculators, AI-powered biomarker analysis, and 50+ peptide profiles. Free tools for dosing, stacking, and bloodwork monitoring."
        canonical="https://peptide-mastery.lovable.app"
      />
      <JsonLd data={buildOrganizationSchema()} id="org-schema" />
      <JsonLd data={buildWebSiteSchema()} id="website-schema" />
      <JsonLd data={buildFAQSchema(allFaqs)} id="faq-schema" />
      <LandingHeader 
        onSignInClick={handleSignInClick} 
        onSearch={() => setSearchOpen(true)}
      />
      
      <main>
        <HeroSection onCategoryClick={handleCategoryClick} />
        <HowItWorks />
        <PricingSection />
        <BentoFeatures />
        <Testimonials />
        <WhyFreeBand onPrimaryClick={handleSignInClick} />
        <div className="relative">
          <ResearchTools 
            onBlendsClick={() => teaser ? null : setBlendsStacksOpen(true)}
            onQuizClick={() => teaser ? null : setQuizOpen(true)}
            onSearchClick={() => teaser ? null : setSearchOpen(true)}
            onStackClick={() => teaser ? null : setBlendsStacksOpen(true)}
            onCalculatorClick={() => teaser ? null : setCalculatorOpen(true)}
          />
          {teaser && (
            <PremiumLockOverlay
              title="Research tools are Premium"
              description="Unlock the stack builder, reconstitution calculator, blends, quiz, and search."
            />
          )}
        </div>
        <div id="featured-peptides" className="relative">
          <FeaturedPeptides limit={teaser ? 3 : undefined} />
          {teaser && (
            <div className="container mx-auto px-4 -mt-4 pb-10 text-center">
              <p className="text-sm text-muted-foreground">
                Showing 3 of {`50+`} peptides — unlock Premium to view all.
              </p>
            </div>
          )}
        </div>
        <PeptideCategories onCategoryClick={() => setSearchOpen(true)} />
        <BlogSection />
        <FAQSection />
        <CTASection onSignInClick={handleSignInClick} />
      </main>

      <LandingFooter />
      <LiveQnAPopup />

      <Suspense fallback={null}>
        {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
        {quizOpen && <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />}
        {blendsStacksOpen && <BlendsAndStacks open={blendsStacksOpen} onClose={() => setBlendsStacksOpen(false)} />}
        {searchOpen && <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
        {calculatorOpen && <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />}
      </Suspense>
    </div>
  );
}
