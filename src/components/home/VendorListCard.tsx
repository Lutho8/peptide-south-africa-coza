import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ExternalLink, Award, FlaskConical, TrendingUp, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { allVendors, ratingColor, getScoreColor, type Vendor, type VendorRating } from '@/data/vendors';

const ratingOrder: VendorRating[] = ['A', 'A-B', 'A-C', 'A-D', 'A-E'];

type SortKey = 'score' | 'rating' | 'tests' | 'name';

export function VendorListCard() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [expanded, setExpanded] = useState(false);

  const filtered = allVendors
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.avgScore - a.avgScore;
        case 'rating': return ratingOrder.indexOf(a.rating) - ratingOrder.indexOf(b.rating);
        case 'tests': return b.tests - a.tests;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const displayVendors = expanded ? filtered : filtered.slice(0, 8);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Verified Vendors</h3>
            <p className="text-xs text-muted-foreground">{allVendors.length} vendors • Lab-tested via Finnrick.com</p>
          </div>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {([
            ['score', 'Score'],
            ['rating', 'Rating'],
            ['tests', 'Tests'],
            ['name', 'Name'],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortBy === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor list */}
      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {displayVendors.map((vendor, i) => (
            <motion.a
              key={vendor.name}
              href={vendor.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition-colors group"
            >
              <span className="text-xs font-bold text-muted-foreground w-5 text-right shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {vendor.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" />{vendor.tests}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{vendor.products}</span>
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] shrink-0 ${ratingColor[vendor.rating]}`}>
                {vendor.rating}
              </Badge>
              <span className={`text-sm font-bold shrink-0 ${getScoreColor(vendor.avgScore)}`}>
                {vendor.avgScore.toFixed(1)}
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Show more/less */}
      {filtered.length > 8 && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Show Less' : `Show All ${filtered.length} Vendors`}
          </Button>
        </div>
      )}
    </div>
  );
}
