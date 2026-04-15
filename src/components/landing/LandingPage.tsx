import { useState, lazy, Suspense } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ResearchTools } from './ResearchTools';
import { FeaturedPeptides } from './FeaturedPeptides';
import { PeptideCategories } from './PeptideCategories';
import { BlogSection } from './BlogSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';
import { VendorShowcase } from './VendorShowcase';
import { FAQSection, faqCategories } from './FAQSection';
import { LiveQnAPopup } from './LiveQnAPopup';
import { useAuth } from '@/contexts/AuthContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, buildFAQSchema } from '@/components/seo/JsonLd';

import { PeptideCategory } from '@/data/peptides';

// Lazy load modals - only loaded when opened
const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

const PeptideQuiz = lazy(() => import('./PeptideQuiz').then(m => ({ default: m.PeptideQuiz })));
const PeptideBlends = lazy(() => import('./PeptideBlends').then(m => ({ default: m.PeptideBlends })));
const PeptideSearch = lazy(() => import('./PeptideSearch').then(m => ({ default: m.PeptideSearch })));
const StackBuilder = lazy(() => import('./StackBuilder').then(m => ({ default: m.StackBuilder })));
const ReconstitutionCalculator = lazy(() => import('./ReconstitutionCalculator').then(m => ({ default: m.ReconstitutionCalculator })));

export function LandingPage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [blendsOpen, setBlendsOpen] = useState(false);
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
        <FAQSection />
        <VendorShowcase onSignInClick={handleSignInClick} />
        <ResearchTools 
          onBlendsClick={() => setBlendsOpen(true)}
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
      <LiveQnAPopup />

      <Suspense fallback={null}>
        {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
        {quizOpen && <PeptideQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />}
        {blendsOpen && <PeptideBlends open={blendsOpen} onClose={() => setBlendsOpen(false)} />}
        {searchOpen && <PeptideSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
        {stackBuilderOpen && <StackBuilder open={stackBuilderOpen} onClose={() => setStackBuilderOpen(false)} />}
        {calculatorOpen && <ReconstitutionCalculator open={calculatorOpen} onClose={() => setCalculatorOpen(false)} />}
      </Suspense>
    </div>
  );
}
