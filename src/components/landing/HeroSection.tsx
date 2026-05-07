import { motion } from 'framer-motion';
import { Lock, ArrowRight, FlaskConical, Award, BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PhoneMockup } from './PhoneMockup';
import { FloatingStatCards } from './FloatingStatCards';
import { HeroCategoryBadges } from './HeroCategoryBadges';
import { PeptideCategory } from '@/data/peptides';
import { useMembership } from '@/hooks/useMembership';
import { useAuth } from '@/contexts/AuthContext';
import { captureLead } from '@/lib/crm';

interface HeroSectionProps {
  onCategoryClick?: (category: PeptideCategory) => void;
}

const socialProof = [
  { icon: FlaskConical, label: '98+ peptides researched' },
  { icon: Award, label: '17 FDA-approved compounds' },
  { icon: BookOpen, label: '22+ scientific citations' },
];

export function HeroSection({ onCategoryClick }: HeroSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPremium } = useMembership();

  const scrollToPeptides = () => {
    const el = document.getElementById('featured-peptides');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQnaCta = () => {
    captureLead({
      email: user?.email ?? null,
      source: 'hero_qa_cta',
      planInterest: 'premium',
      activityType: 'qa_signup',
      activityData: { hasPremium },
    });
    if (hasPremium) {
      navigate('/live-qna');
    } else {
      scrollToPricing();
    }
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Background gradient + orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <motion.div
        className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: Content (mobile order: 2) */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Built for South African peptide users
              </div>

              <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Are You Still{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
                  Guessing
                </span>{' '}
                Your Peptide Doses?
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              Most South Africans using peptides track their protocols in a notes app, spreadsheet,
              or worse — their memory. The result? Inconsistent cycles, missed doses, and zero
              insight into what's actually working.
            </motion.p>

            {/* Positioning card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-6 max-w-xl rounded-2xl border border-border/60 bg-card/60 p-5 text-left backdrop-blur lg:mx-0"
            >
              <p className="text-sm font-semibold text-foreground sm:text-base">
                RideTheTide is the first protocol tracker built for the South African peptide user.
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  'Log every dose with proper unit conversions (mcg, mg, IU)',
                  'Track cycles for BPC-157, TB-500, CJC-1295, Ipamorelin, and 20+ peptides',
                  'Set protocol reminders so you never miss a dose',
                  'Monitor progress markers (recovery, sleep, energy, body comp)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleQnaCta}
                className="h-12 gap-2 bg-gradient-to-r from-primary to-accent px-6 text-primary-foreground shadow-lg hover:opacity-90"
              >
                <Lock className="h-4 w-4" />
                Start Tracking Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToPeptides}
                className="h-12 gap-2 border-2 px-6"
              >
                Explore peptides
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Social proof pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              {socialProof.map((s) => (
                <div
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
                >
                  <s.icon className="h-3.5 w-3.5 text-accent" />
                  {s.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Phone mockup (mobile order: 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="relative order-1 mx-auto flex w-full max-w-md items-center justify-center lg:order-2"
          >
            <div className="relative">
              <PhoneMockup />
              <FloatingStatCards />
            </div>
          </motion.div>
        </div>

        {/* Category badges below */}
        <div className="mt-14">
          <HeroCategoryBadges onCategoryClick={onCategoryClick} />
        </div>
      </div>
    </section>
  );
}
