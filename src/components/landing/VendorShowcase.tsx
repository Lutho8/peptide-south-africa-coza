import { motion } from 'framer-motion';
import { Shield, Lock, ExternalLink, Crown, CheckCircle, FlaskConical, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { allVendors, ratingColor, getScoreColor } from '@/data/vendors';

interface VendorShowcaseProps {
  onSignInClick: () => void;
}

const showcaseVendors = allVendors.slice(0, 3);
const blurredVendors = allVendors.slice(3, 9);

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = score >= 9 ? '#10b981' : score >= 7.5 ? '#14b8a6' : score >= 6 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
        <motion.circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
    </div>
  );
}

function VendorCard({ vendor, index }: { vendor: typeof allVendors[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Rank badge */}
      <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-md">
        #{index + 1}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg truncate">{vendor.name}</h3>
            <Badge variant="outline" className={`text-xs mt-1.5 ${ratingColor[vendor.rating]}`}>
              <Award className="w-3 h-3 mr-1" />
              {vendor.rating}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              {vendor.tests} tests
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {vendor.products} products
            </span>
          </div>
        </div>
        <ScoreRing score={vendor.avgScore} />
      </div>
    </motion.div>
  );
}

export function VendorShowcase({ onSignInClick }: VendorShowcaseProps) {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-5"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Lab-Tested & Verified</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-foreground leading-tight">
            Stop Guessing.<br />
            <span className="text-primary">Start with Data.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our members get exclusive support choosing from <strong className="text-foreground">170+ independently tested vendors</strong> with over 4,800 lab samples analyzed. Make every purchase count.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12"
        >
          {[
            { value: '170+', label: 'Vendors Tested' },
            { value: '4,802', label: 'Lab Samples' },
            { value: '98%', label: 'Member Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-card border border-border">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Top 3 vendor cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {showcaseVendors.map((vendor, index) => (
            <VendorCard key={vendor.name} vendor={vendor} index={index} />
          ))}
        </div>

        {/* Blurred preview + CTA overlay */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden="true">
            {blurredVendors.map((vendor) => (
              <div key={vendor.name} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{vendor.rating}</Badge>
                  </div>
                  <span className="font-bold text-lg">{vendor.avgScore.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{vendor.products} products</span>
                  <span>•</span>
                  <span>{vendor.tests} tests</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card/95 backdrop-blur-xl border border-primary/25 rounded-2xl p-8 text-center max-w-sm shadow-2xl shadow-primary/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Unlock Full Vendor Access</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Get personalized vendor recommendations, purity reports, and 1-on-1 guidance.
              </p>
              <div className="flex flex-col gap-2.5 mb-5">
                {[
                  'Access 170+ verified vendors',
                  '1-on-1 vendor guidance',
                  'Purity & quality reports',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={onSignInClick} size="lg" className="w-full gap-2 text-base">
                <Crown className="w-5 h-5" />
                Join for €9.99/month
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-10"
        >
          Vendor data sourced from{' '}
          <a
            href="https://www.finnrick.com/vendors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Finnrick.com <ExternalLink className="w-3 h-3" />
          </a>{' '}
          — 4,802 samples from 170 vendors independently lab-tested.
        </motion.p>
      </div>
    </section>
  );
}
