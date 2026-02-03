import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { peptides, Peptide, PeptideCategory } from '@/data/peptides';
import { cn } from '@/lib/utils';

interface PeptideSearchProps {
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<PeptideCategory, string> = {
  immune: 'Immune Support',
  longevity: 'Longevity',
  cognitive: 'Cognitive',
  metabolic: 'Metabolic',
  healing: 'Healing & Recovery',
  'gh-secretagogue': 'GH Secretagogue',
};

const categoryColors: Record<PeptideCategory, string> = {
  immune: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  longevity: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cognitive: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  metabolic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  healing: 'bg-red-500/20 text-red-400 border-red-500/30',
  'gh-secretagogue': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function PeptideSearch({ open, onClose }: PeptideSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PeptideCategory[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'score'>('name');

  const filteredPeptides = useMemo(() => {
    let results = [...peptides];

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.shortName.toLowerCase().includes(lowerQuery) ||
          p.benefits.some(b => b.toLowerCase().includes(lowerQuery)) ||
          p.mechanism.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      results = results.filter(p => selectedCategories.includes(p.category));
    }

    // Sort
    results.sort((a, b) => {
      if (sortBy === 'score') {
        return b.longevityScore - a.longevityScore;
      }
      return a.name.localeCompare(b.name);
    });

    return results;
  }, [query, selectedCategories, sortBy]);

  const toggleCategory = (category: PeptideCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-accent" />
                <h1 className="text-2xl font-bold">Browse Peptides</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, benefits, or mechanism..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={selectedCategories.includes(key as PeptideCategory)}
                      onCheckedChange={() => toggleCategory(key as PeptideCategory)}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'name'}
                    onCheckedChange={() => setSortBy('name')}
                  >
                    Name (A-Z)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'score'}
                    onCheckedChange={() => setSortBy('score')}
                  >
                    Longevity Score
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCategories.map(cat => (
                  <Badge
                    key={cat}
                    className={cn('cursor-pointer', categoryColors[cat])}
                    onClick={() => toggleCategory(cat)}
                  >
                    {categoryLabels[cat]}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4">
            <div className="text-sm text-muted-foreground mb-4">
              {filteredPeptides.length} peptide{filteredPeptides.length !== 1 ? 's' : ''} found
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredPeptides.map((peptide, index) => (
                  <motion.div
                    key={peptide.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Card className="p-4 h-full hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{peptide.shortName}</h3>
                          <p className="text-sm text-muted-foreground">{peptide.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-accent">{peptide.longevityScore}</span>
                          <span className="text-xs text-muted-foreground">/10</span>
                        </div>
                      </div>

                      <Badge className={cn('mb-3', categoryColors[peptide.category])}>
                        {categoryLabels[peptide.category]}
                      </Badge>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {peptide.mechanism.slice(0, 120)}...
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {peptide.benefits.slice(0, 2).map((benefit, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary"
                          >
                            {benefit.slice(0, 25)}{benefit.length > 25 ? '...' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                        <span>{peptide.halfLife || 'Half-life N/A'}</span>
                        <span>{peptide.frequency}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredPeptides.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No peptides found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
