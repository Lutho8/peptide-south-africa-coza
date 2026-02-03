import { motion } from 'framer-motion';
import { TrendingUp, FlaskConical, Award, BookOpen } from 'lucide-react';

const stats = [
  { label: 'Peptides', value: '97+', icon: FlaskConical },
  { label: 'FDA Approved', value: '12', icon: Award },
  { label: 'Categories', value: '8', icon: TrendingUp },
  { label: 'Citations', value: '500+', icon: BookOpen },
];

const trendingPeptides = [
  'BPC-157',
  'Semaglutide',
  'TB-500',
  'Tirzepatide',
  'CJC-1295',
  'Ipamorelin',
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Peptibase
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your research-grade peptide database with 97+ peptides. 
              Comprehensive research, mechanisms, clinical data, and scientific literature.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center group hover:border-accent/50 transition-colors"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Trending Peptides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Trending Research</p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingPeptides.map((peptide, index) => (
                <motion.span
                  key={peptide}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium hover:bg-accent/20 hover:border-accent/50 cursor-pointer transition-all"
                >
                  {peptide}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
