import { motion } from 'framer-motion';
import { Shield, Star, Lock, ExternalLink, Crown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VendorShowcaseProps {
  onSignInClick: () => void;
}

type VendorRating = 'A' | 'A-B' | 'A-C' | 'A-D' | 'A-E';

interface Vendor {
  name: string;
  rating: VendorRating;
  products: number;
  tests: number;
  avgScore: number;
  url: string;
}

const topVendors: Vendor[] = [
  { name: 'Paradigm Peptide', rating: 'A', products: 2, tests: 14, avgScore: 9.1, url: 'https://www.finnrick.com/vendors/paradigm-peptide' },
  { name: 'Trusted Peptide', rating: 'A', products: 1, tests: 2, avgScore: 10.0, url: 'https://www.finnrick.com/vendors/trusted-peptide' },
  { name: 'Risynth Bio', rating: 'A', products: 2, tests: 8, avgScore: 9.1, url: 'https://www.finnrick.com/vendors/risynth-bio' },
  { name: 'Orbitrex Peptides', rating: 'A', products: 3, tests: 13, avgScore: 9.0, url: 'https://www.finnrick.com/vendors/orbitrex-peptides' },
  { name: 'NUPEPS Peptides', rating: 'A', products: 2, tests: 4, avgScore: 9.0, url: 'https://www.finnrick.com/vendors/nupeps-peptides' },
  { name: 'Aavant Research', rating: 'A', products: 2, tests: 11, avgScore: 8.8, url: 'https://www.finnrick.com/vendors/aavant-research' },
  { name: 'PeptiAtlas', rating: 'A', products: 1, tests: 4, avgScore: 8.8, url: 'https://www.finnrick.com/vendors/peptiatlas' },
  { name: 'Peptide Partners', rating: 'A-C', products: 5, tests: 38, avgScore: 8.4, url: 'https://www.finnrick.com/vendors/peptide-partners' },
  { name: 'Peptide Technologies', rating: 'A-B', products: 3, tests: 11, avgScore: 8.3, url: 'https://www.finnrick.com/vendors/peptide-technologies' },
  { name: 'Peptide Sciences', rating: 'A-E', products: 10, tests: 113, avgScore: 6.8, url: 'https://www.finnrick.com/vendors/peptide-sciences' },
  { name: 'Polaris Peptides', rating: 'A-D', products: 9, tests: 97, avgScore: 7.3, url: 'https://www.finnrick.com/vendors/polaris-peptides' },
  { name: 'Atomik Labz', rating: 'A-C', products: 9, tests: 38, avgScore: 7.7, url: 'https://www.finnrick.com/vendors/atomik-labz' },
];

const ratingColor: Record<VendorRating, string> = {
  'A': 'bg-green-500/20 text-green-400 border-green-500/30',
  'A-B': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'A-C': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'A-D': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'A-E': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 9 ? 'text-green-400' : score >= 7.5 ? 'text-emerald-400' : score >= 6 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-bold text-lg ${color}`}>{score.toFixed(1)}</span>;
}

export function VendorShowcase({ onSignInClick }: VendorShowcaseProps) {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Lab-Tested & Verified</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Waste Your Money on Untested Vendors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our members get exclusive support choosing from <strong>170+ independently tested vendors</strong> with over 4,800 lab samples analyzed. Stop guessing — let data guide your decisions.
          </p>
        </motion.div>

        {/* Vendor Grid - Show top 6, blur rest */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {topVendors.slice(0, 6).map((vendor, index) => (
            <motion.div
              key={vendor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{vendor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${ratingColor[vendor.rating]}`}>
                      Rating: {vendor.rating}
                    </Badge>
                  </div>
                </div>
                <ScoreBadge score={vendor.avgScore} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{vendor.products} products</span>
                <span>•</span>
                <span>{vendor.tests} lab tests</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blurred preview of more vendors */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm opacity-50 pointer-events-none select-none">
            {topVendors.slice(6, 12).map((vendor) => (
              <div
                key={vendor.name}
                className="bg-card/60 border border-border rounded-xl p-5"
              >
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
                  <span>{vendor.tests} lab tests</span>
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
              className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl p-8 text-center max-w-md shadow-2xl shadow-primary/10"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Full Vendor Access</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Members get personalized vendor recommendations, purity reports, and direct support to make the right choice.
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  'Access 170+ verified vendors',
                  '1-on-1 vendor guidance',
                  'Purity & quality reports',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={onSignInClick} className="w-full gap-2">
                <Crown className="w-4 h-4" />
                Join for €9.99/month
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Data source attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8"
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