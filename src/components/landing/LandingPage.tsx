import { useState, useEffect, lazy, Suspense } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { useAuth } from '@/contexts/AuthContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, buildFAQSchema } from '@/components/seo/JsonLd';
import { faqCategories } from './FAQSection';

import { PeptideCategory } from '@/data/peptides';

// Below-the-fold sections — lazy load to improve LCP/TBT
const BentoFeatures = lazy(() => import('./BentoFeatures').then(m => ({ default: m.BentoFeatures })));
const PWAInstallJourney = lazy(() => import('./PWAInstallJourney').then(m => ({ default: m.PWAInstallJourney })));
const Testimonials = lazy(() => import('./Testimonials').then(m => ({ default: m.Testimonials })));
const WhyFreeBand = lazy(() => import('./WhyFreeBand').then(m => ({ default: m.WhyFreeBand })));
const ResearchTools = lazy(() => import('./ResearchTools').then(m => ({ default: m.ResearchTools })));
const FeaturedPeptides = lazy(() => import('./FeaturedPeptides').then(m => ({ default: m.FeaturedPeptides })));
const PeptideCategories = lazy(() => import('./PeptideCategories').then(m => ({ default: m.PeptideCategories })));
const BlogSection = lazy(() => import('./BlogSection').then(m => ({ default: m.BlogSection })));
const CTASection = lazy(() => import('./CTASection').then(m => ({ default: m.CTASection })));
const LandingFooter = lazy(() => import('./LandingFooter').then(m => ({ default: m.LandingFooter })));
const FAQSection = lazy(() => import('./FAQSection').then(m => ({ default: m.FAQSection })));
const SafetyDisclaimerBand = lazy(() => import('./SafetyDisclaimerBand').then(m => ({ default: m.SafetyDisclaimerBand })));
const LiveQnAPopup = lazy(() => import('./LiveQnAPopup').then(m => ({ default: m.LiveQnAPopup })));

// Lazy load modals - only loaded when opened
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

const PeptideQuiz = lazy(() => import('./PeptideQuiz').then(m => ({ default: m.PeptideQuiz })));
const BlendsAndStacks = lazy(() => import('./BlendsAndStacks').then(m => ({ default: m.BlendsAndStacks })));
const PeptideSearch = lazy(() => import('./PeptideSearch').then(m => ({ default: m.PeptideSearch })));
const ReconstitutionCalculator = lazy(() => import('./ReconstitutionCalculator').then(m => ({ default: m.ReconstitutionCalculator })));

// Reserved-space placeholder to prevent CLS while a section loads in.
const SectionPlaceholder = ({ minH = 400 }: { minH?: number }) => (
  <div style={{ minHeight: minH }} aria-hidden="true" />
);

export function LandingPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [quizOpen, setQuizOpen] = useState(false);
  const [blendsStacksOpen, setBlendsStacksOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [popupReady, setPopupReady] = useState(false);

  // Defer non-critical popup until idle so it doesn't compete with LCP
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2500));
    const id = schedule(() => setPopupReady(true));
    return () => {
      if (typeof id === 'number') clearTimeout(id);
    };
  }, []);

  const handleSignInClick = () => {
    setAuthMode('signup');
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
        <HeroSection onCategoryClick={handleCategoryClick} onSignInClick={handleSignInClick} />
        <HowItWorks />
        <Suspense fallback={<SectionPlaceholder minH={600} />}>
          <BentoFeatures />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={500} />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={300} />}>
          <WhyFreeBand onPrimaryClick={handleSignInClick} />
        </Suspense>
        <div className="relative">
          <Suspense fallback={<SectionPlaceholder minH={500} />}>
            <ResearchTools
              onBlendsClick={() => setBlendsStacksOpen(true)}
              onQuizClick={() => setQuizOpen(true)}
              onSearchClick={() => setSearchOpen(true)}
              onStackClick={() => setBlendsStacksOpen(true)}
              onCalculatorClick={() => setCalculatorOpen(true)}
            />
          </Suspense>
        </div>
        <div id="featured-peptides" className="relative">
          <Suspense fallback={<SectionPlaceholder minH={600} />}>
            <FeaturedPeptides />
          </Suspense>
        </div>
        <Suspense fallback={<SectionPlaceholder minH={400} />}>
          <PeptideCategories onCategoryClick={() => setSearchOpen(true)} />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={500} />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={120} />}>
          <SafetyDisclaimerBand />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={600} />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder minH={300} />}>
          <CTASection onSignInClick={handleSignInClick} />
        </Suspense>
      </main>

      <Suspense fallback={<SectionPlaceholder minH={300} />}>
        <LandingFooter />
      </Suspense>
      {popupReady && (
        <Suspense fallback={null}>
          <LiveQnAPopup />
        </Suspense>
      )}

      <Suspense fallback={null}>
        {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultMode={authMode} />}
        {quizOpen && <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />}
        {blendsStacksOpen && <BlendsAndStacks open={blendsStacksOpen} onClose={() => setBlendsStacksOpen(false)} />}
        {searchOpen && <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
        {calculatorOpen && <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />}
      </Suspense>
    </div>
  );
}
