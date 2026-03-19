import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FlaskConical, Award, BookOpen, Video } from 'lucide-react';
import { HeroCategoryBadges } from './HeroCategoryBadges';
import { PeptideCategory } from '@/data/peptides';
import { useCountUp } from '@/hooks/useCountUp';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Peptides', value: 98, suffix: '+', icon: FlaskConical },
  { label: 'FDA Approved', value: 31, suffix: '', icon: Award },
  { label: 'Categories', value: 11, suffix: '', icon: TrendingUp },
  { label: 'Citations', value: 500, suffix: '+', icon: BookOpen },
];



// Floating particle component - reduced for mobile perf
function FloatingParticle({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-primary/20 will-change-transform"
      initial={{ opacity: 0, x, y }}
      animate={{
        opacity: [0, 0.6, 0],
        y: [y, y - 100, y - 150],
        x: [x, x + 20, x - 10],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Stats card with count-up animation
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { formattedValue } = useCountUp({
    end: stat.value,
    duration: 2000,
    delay: index * 150,
    suffix: stat.suffix,
    enableScrollTrigger: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.2)',
      }}
      className="glass-card rounded-xl p-4 text-center group hover:border-accent/50 transition-all cursor-default"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <stat.icon className="w-6 h-6 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
      <div className="text-2xl md:text-3xl font-bold text-foreground">{formattedValue}</div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}

// Featured blend carousel card
function BlendCarouselCard({ blend, onViewAll }: { blend: typeof featuredBlends[0]; onViewAll: () => void }) {
  return (
    <motion.div
      className="flex-shrink-0 w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5 md:p-6 hover:border-accent/40 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base md:text-lg truncate">{blend.shortName}</h3>
              <Badge variant="outline" className="text-[10px] flex-shrink-0">{blend.vialSize}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blend.description.slice(0, 150)}...</p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-muted/30 px-3 py-1.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Components</div>
                <div className="text-xs font-medium">{blend.components.length} peptides</div>
              </div>
              <div className="rounded-lg bg-muted/30 px-3 py-1.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">References</div>
                <div className="text-xs font-medium">{blend.references.length} studies</div>
              </div>
            </div>

            {/* Component badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {blend.components.map((c, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground border border-accent/20">{c}</span>
              ))}
            </div>

            {/* Quickstart preview */}
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div><strong className="text-foreground">Dose:</strong> {blend.quickstart.typicalDose}</div>
              <div><strong className="text-foreground">Reconstitute:</strong> {blend.quickstart.reconstitute}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-end">
          <Button size="sm" variant="ghost" onClick={onViewAll} className="text-xs text-primary hover:text-primary gap-1">
            View All Blends & Stacks <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface HeroSectionProps {
  onCategoryClick?: (category: PeptideCategory) => void;
  onBlendsClick?: () => void;
}

export function HeroSection({ onCategoryClick, onBlendsClick }: HeroSectionProps) {
  const navigate = useNavigate();
  const [currentBlend, setCurrentBlend] = useState(0);

  const nextBlend = useCallback(() => {
    setCurrentBlend(prev => (prev + 1) % featuredBlends.length);
  }, []);

  const prevBlend = useCallback(() => {
    setCurrentBlend(prev => (prev - 1 + featuredBlends.length) % featuredBlends.length);
  }, []);

  // Reduced particles on mobile for performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 3 : 10;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: i * 0.8,
    duration: 5 + Math.random() * 3,
    x: Math.random() * 100 - 50,
    y: Math.random() * 200,
  }));

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading - Static */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
                Welcome to Ride The Tide
              </span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Your research-grade peptide database with 98+ peptides. 
              Comprehensive research, mechanisms, clinical data, and scientific literature.
            </motion.p>
          </motion.div>

          {/* Live Q&A CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <Button
              size="lg"
              onClick={() => navigate('/live-qna')}
              className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground gap-2 px-6 shadow-lg"
            >
              <Video className="w-5 h-5" />
              Join Free Monthly Q&A — Live on Zoom
            </Button>
          </motion.div>

          {/* Stats Grid with Count-up Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Featured Blends Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold">Featured Peptide Blends</h2>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevBlend} className="h-8 w-8 rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1 mx-1">
                  {featuredBlends.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentBlend(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentBlend ? 'bg-primary w-5' : 'bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="icon" onClick={nextBlend} className="h-8 w-8 rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <BlendCarouselCard
                  key={featuredBlends[currentBlend].id}
                  blend={featuredBlends[currentBlend]}
                  onViewAll={onBlendsClick || (() => {})}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Dynamic Category Badges */}
          <HeroCategoryBadges onCategoryClick={onCategoryClick} />
        </div>
      </div>
    </section>
  );
}
