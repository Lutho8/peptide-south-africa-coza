import { useState, useDeferredValue, useMemo, useEffect } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { peptides, Peptide, PeptideCategory, getCategoryLabel } from '@/data/peptides';
import { getAliasesFor, boundedLevenshtein } from '@/data/peptideAliases';
import { Search, Filter, Star, Check, FlaskConical, ShieldCheck, Bookmark, BookmarkPlus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { WidgetHint } from '@/components/onboarding/WidgetHint';
import {
  listSavedSearches,
  saveSavedSearch,
  removeSavedSearch,
  summarizeSearch,
  type SavedPeptideSearch,
} from '@/lib/savedPeptideSearches';

interface PeptidesScreenProps {
  onViewPeptide: (peptide: Peptide) => void;
}

type FilterTab = 'all' | 'fda-approved' | 'janoshik' | 'in-stock' | 'longevity' | 'new';
type ResearchStatus = 'all' | 'approved' | 'phase3' | 'phase2' | 'phase1' | 'preclinical';

const researchStatusLabel: Record<ResearchStatus, string> = {
  all: 'All',
  approved: 'FDA Approved',
  phase3: 'Clinical Trials',
  phase2: 'Preclinical',
  phase1: 'Preclinical',
  preclinical: 'Research',
};

type SortKey = 'longevity' | 'name' | 'price' | 'priceDesc' | 'janoshikPurity' | 'recentlyAdded';

const sortLabels: Record<SortKey, string> = {
  longevity: 'Longevity Score',
  name: 'Name (A→Z)',
  price: 'Price (low → high)',
  priceDesc: 'Price (high → low)',
  janoshikPurity: 'Janoshik Purity',
  recentlyAdded: 'Recently Added',
};

const researchStatusTabs: { id: ResearchStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'FDA Approved' },
  { id: 'phase3', label: 'Clinical Trials' },
  { id: 'preclinical', label: 'Preclinical' },
];

function getResearchBadge(peptide: Peptide) {
  if (peptide.fdaApproved) return { label: 'FDA Approved', className: 'bg-green-500/20 text-green-400' };
  if (peptide.clinicalStatus === 'phase3' || peptide.clinicalStatus === 'phase2' || peptide.clinicalStatus === 'phase1')
    return { label: 'Clinical Trials', className: 'bg-blue-500/20 text-blue-400' };
  if (peptide.clinicalStatus === 'preclinical')
    return { label: 'Preclinical', className: 'bg-yellow-500/20 text-yellow-400' };
  return { label: 'Research', className: 'bg-muted text-muted-foreground' };
}

export function PeptidesScreen({ onViewPeptide }: PeptidesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [researchFilter, setResearchFilter] = useState<ResearchStatus>('all');
  const [sortBy, setSortBy] = useState<SortKey>('longevity');
  const [savedSearches, setSavedSearches] = useState<SavedPeptideSearch[]>(() => listSavedSearches());
  const [saveName, setSaveName] = useState('');
  const [saveOpen, setSaveOpen] = useState(false);

  const peptideIndex = useMemo(() => new Map(peptides.map((p, i) => [p.id, i])), []);

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'fda-approved', label: 'FDA Approved' },
    { id: 'janoshik', label: 'Janoshik Tested' },
    { id: 'in-stock', label: 'In Stock' },
    { id: 'longevity', label: 'Top Longevity' },
    { id: 'new', label: 'New' },
  ];

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredPeptides = useMemo(() => peptides
    .filter(p => {
      const raw = deferredQuery.trim().toLowerCase();
      let matchesSearch = true;
      if (raw) {
        // token-AND: every whitespace-separated token must match at least one field.
        // Supports scope hints: fda:true, janoshik:true, stock:in-stock, score:>=8, price:<50, cat:<slug>
        const tokens = raw.split(/\s+/).filter(Boolean);
        const aliases = getAliasesFor(p.name, p.shortName);
        const haystacks = [
          p.name,
          p.shortName,
          getCategoryLabel(p.category),
          p.category,
          p.mechanism ?? '',
          ...(p.benefits ?? []),
          ...aliases,
        ].map((s) => s.toLowerCase());

        matchesSearch = tokens.every((tok) => {
          // scope hints
          if (tok.startsWith('fda:')) return p.fdaApproved === (tok.slice(4) === 'true');
          if (tok.startsWith('janoshik:')) return p.janoshikTested === (tok.slice(9) === 'true');
          if (tok.startsWith('stock:')) return p.supplier.stock === tok.slice(6);
          if (tok.startsWith('cat:')) return p.category.toLowerCase() === tok.slice(4);
          if (tok.startsWith('score:')) {
            const m = tok.slice(6).match(/^(>=|<=|>|<|=)?(\d+(?:\.\d+)?)$/);
            if (!m) return false;
            const [, op = '=', v] = m; const n = parseFloat(v);
            return op === '>=' ? p.longevityScore >= n :
                   op === '<=' ? p.longevityScore <= n :
                   op === '>'  ? p.longevityScore >  n :
                   op === '<'  ? p.longevityScore <  n :
                                 p.longevityScore === n;
          }
          if (tok.startsWith('price:')) {
            const m = tok.slice(6).match(/^(>=|<=|>|<|=)?(\d+(?:\.\d+)?)$/);
            if (!m) return false;
            const [, op = '=', v] = m; const n = parseFloat(v);
            return op === '>=' ? p.supplier.price >= n :
                   op === '<=' ? p.supplier.price <= n :
                   op === '>'  ? p.supplier.price >  n :
                   op === '<'  ? p.supplier.price <  n :
                                 p.supplier.price === n;
          }
          if (haystacks.some((h) => h.includes(tok))) return true;
          if (tok.length >= 3) {
            return haystacks.some((h) =>
              h.split(/[\s\-+()]+/).some((w) => w.length >= 3 && boundedLevenshtein(w, tok, 1) <= 1)
            );
          }
          return false;
        });
      }

      if (!matchesSearch) return false;

      // Category filter
      let matchesCategory = true;
      switch (activeFilter) {
        case 'fda-approved':
          matchesCategory = p.fdaApproved === true;
          break;
        case 'janoshik':
          matchesCategory = p.janoshikTested;
          break;
        case 'in-stock':
          matchesCategory = p.supplier.stock === 'in-stock';
          break;
        case 'longevity':
          matchesCategory = p.longevityScore >= 8;
          break;
      }
      if (!matchesCategory) return false;

      // Research status filter
      if (researchFilter !== 'all') {
        if (researchFilter === 'approved') return p.fdaApproved === true;
        if (researchFilter === 'phase3') return p.clinicalStatus === 'phase3' || p.clinicalStatus === 'phase2' || p.clinicalStatus === 'phase1';
        if (researchFilter === 'preclinical') return p.clinicalStatus === 'preclinical';
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'longevity':
          return b.longevityScore - a.longevityScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.supplier.price - b.supplier.price;
        case 'priceDesc':
          return b.supplier.price - a.supplier.price;
        case 'janoshikPurity':
          return (b.janoshikPurity ?? 0) - (a.janoshikPurity ?? 0);
        case 'recentlyAdded':
          return (peptideIndex.get(b.id) ?? 0) - (peptideIndex.get(a.id) ?? 0);
        default:
          return 0;
      }
    }), [deferredQuery, activeFilter, researchFilter, sortBy, peptideIndex]);

  const isDirty =
    searchQuery.trim() !== '' ||
    activeFilter !== 'all' ||
    researchFilter !== 'all' ||
    sortBy !== 'longevity';

  const applySaved = (s: SavedPeptideSearch) => {
    setSearchQuery(s.query);
    setActiveFilter(s.activeFilter as FilterTab);
    setResearchFilter(s.researchFilter as ResearchStatus);
    setSortBy(s.sortBy as SortKey);
    toast.success(`Applied "${s.name}"`);
  };

  const handleSave = () => {
    const summary = summarizeSearch({
      query: searchQuery, activeFilter, researchFilter, sortBy,
    });
    const rec = saveSavedSearch({
      name: saveName.trim() || summary,
      query: searchQuery,
      activeFilter,
      researchFilter,
      sortBy,
    });
    setSavedSearches(listSavedSearches());
    setSaveName('');
    setSaveOpen(false);
    toast.success(`Saved "${rec.name}"`);
  };

  const handleDelete = (id: string) => {
    removeSavedSearch(id);
    setSavedSearches(listSavedSearches());
    toast('Removed saved search');
  };

  return (
    <div className="pb-24 space-y-4 fade-in">
      <h1 className="text-2xl font-bold text-foreground">Peptide Database</h1>

      <WidgetHint
        id="peptides-intro"
        title="Browse 98+ peptides — filter, then tap for the full profile"
        body="Search by name (partial works), or use the filter tabs to narrow by FDA status, testing, stock, and category. Tap any card for dosing, half-life, and study links."
        steps={[
          'Type a partial name in the search bar — e.g. "Tesa" or "BPC".',
          'Use "Janoshik Tested" for third-party verified peptides only.',
          'Tap a card → Add to Stack to start tracking it.',
        ]}
        goalHooks={{
          'fat-loss': 'try the "Top Longevity" and category filters — Retatrutide, Tirzepatide sit here.',
          'recovery': 'BPC-157 and TB-500 are your top healing candidates — search either name.',
          'cognitive': 'search Semax, Selank, or Cerebrolysin for cognitive-edge peptides.',
        }}
      />


      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder='Search — try "BPC", "cat:healing", "fda:true", "score:>=8"'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Showing <span className="font-semibold text-foreground">{filteredPeptides.length}</span> of {peptides.length} peptides
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeFilter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Research Status Filter */}
      <div>
        <span className="text-xs text-muted-foreground mb-1.5 block">Research Status</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {researchStatusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setResearchFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                researchFilter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Sort by:</span>
        {(['longevity', 'name', 'price'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={cn(
              "px-2 py-1 rounded text-xs transition-all",
              sortBy === option
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option === 'longevity' ? 'Longevity Score' : 
             option === 'name' ? 'Name' : 'Price'}
          </button>
        ))}
      </div>

      {/* Peptide Cards */}
      <div className="space-y-3">
        {filteredPeptides.map((peptide) => (
          <GradientCard 
            key={peptide.id} 
            hover 
            onClick={() => onViewPeptide(peptide)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{peptide.name}</h3>
                  <span className="text-xs text-muted-foreground">({peptide.shortName})</span>
                </div>
                <CategoryBadge category={peptide.category} showCount={false} size="sm" />
              </div>
              <div className="flex flex-col items-end gap-1">
                {(() => {
                  const badge = getResearchBadge(peptide);
                  return (
                    <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", badge.className)}>
                      {peptide.fdaApproved && <ShieldCheck size={12} />}
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
                {peptide.janoshikTested && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <FlaskConical size={12} />
                    <span>{peptide.janoshikPurity}%</span>
                  </div>
                )}
                <StatusBadge status={peptide.supplier.stock} size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{peptide.longevityScore}/10</span>
                  <span className="text-xs text-muted-foreground">Longevity</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">${peptide.supplier.price}</p>
                <p className="text-xs text-muted-foreground">per vial</p>
              </div>
            </div>
          </GradientCard>
        ))}
      </div>

      {filteredPeptides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No peptides found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
