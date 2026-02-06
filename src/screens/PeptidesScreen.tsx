import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { peptides, Peptide, PeptideCategory, getCategoryLabel } from '@/data/peptides';
import { Search, Filter, Star, Check, FlaskConical, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PeptidesScreenProps {
  onViewPeptide: (peptide: Peptide) => void;
}

type FilterTab = 'all' | 'fda-approved' | 'janoshik' | 'in-stock' | 'longevity' | 'new';

export function PeptidesScreen({ onViewPeptide }: PeptidesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'longevity' | 'name' | 'price'>('longevity');

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'fda-approved', label: 'FDA Approved' },
    { id: 'janoshik', label: 'Janoshik Tested' },
    { id: 'in-stock', label: 'In Stock' },
    { id: 'longevity', label: 'Top Longevity' },
    { id: 'new', label: 'New' },
  ];

  const filteredPeptides = peptides
    .filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryLabel(p.category).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (activeFilter) {
        case 'fda-approved':
          return p.fdaApproved === true;
        case 'janoshik':
          return p.janoshikTested;
        case 'in-stock':
          return p.supplier.stock === 'in-stock';
        case 'longevity':
          return p.longevityScore >= 8;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'longevity':
          return b.longevityScore - a.longevityScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.supplier.price - b.supplier.price;
        default:
          return 0;
      }
    });

  return (
    <div className="pb-24 space-y-4 fade-in">
      <h1 className="text-2xl font-bold text-foreground">Peptide Database</h1>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, short name, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

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
                {peptide.fdaApproved && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    <ShieldCheck size={12} />
                    <span>FDA Approved</span>
                  </div>
                )}
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
