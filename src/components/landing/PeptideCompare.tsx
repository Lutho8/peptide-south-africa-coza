import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Scale, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { peptides, Peptide, PeptideCategory, categoryConfig } from '@/data/peptides';
import { cn } from '@/lib/utils';

interface PeptideCompareProps {
  open: boolean;
  onClose: () => void;
}

const allCategories: PeptideCategory[] = Object.keys(categoryConfig) as PeptideCategory[];

export function PeptideCompare({ open, onClose }: PeptideCompareProps) {
  const [selectedPeptides, setSelectedPeptides] = useState<Peptide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PeptideCategory | 'all'>('all');
  const [selectorVisible, setSelectorVisible] = useState(true);

  const filteredPeptides = useMemo(() => {
    return peptides.filter(p => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const togglePeptide = (peptide: Peptide) => {
    setSelectedPeptides(prev => {
      const exists = prev.find(p => p.id === peptide.id);
      if (exists) return prev.filter(p => p.id !== peptide.id);
      if (prev.length >= 4) return prev;
      return [...prev, peptide];
    });
  };

  const isSelected = (id: string) => selectedPeptides.some(p => p.id === id);
  const clearAll = () => setSelectedPeptides([]);

  if (!open) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-accent" />
              <h1 className="text-xl md:text-2xl font-bold">Compare Peptides</h1>
              {selectedPeptides.length > 0 && <Badge variant="secondary">{selectedPeptides.length}/4 selected</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {selectedPeptides.length > 0 && <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>}
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="px-4 pt-4 pb-2">
          <div className="container mx-auto text-center">
            <p className="text-muted-foreground text-sm">Select up to 4 peptides to compare their mechanisms, dosing, side effects, and research status side-by-side.</p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4">
            {/* Selected pills */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Selected ({selectedPeptides.length}/4):</span>
              {selectedPeptides.length === 0 && <span className="text-sm text-muted-foreground">No peptides selected</span>}
              {selectedPeptides.map(p => (
                <Badge key={p.id} variant="secondary" className="gap-1 cursor-pointer" onClick={() => togglePeptide(p)}>
                  {p.shortName}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
              <button onClick={() => setSelectorVisible(!selectorVisible)} className="ml-auto text-sm text-accent flex items-center gap-1 min-h-[44px]">
                {selectorVisible ? <><ChevronUp className="w-4 h-4" /> Hide Selector</> : <><ChevronDown className="w-4 h-4" /> Show Selector</>}
              </button>
            </div>

            {/* Peptide Grid Selector */}
            <AnimatePresence>
              {selectorVisible && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-6">
                  {/* Search + Filter */}
                  <div className="flex gap-3 mb-4 flex-col sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search peptides by name or alias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 min-h-[44px]"
                      />
                    </div>
                    <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-hide">
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px]',
                          categoryFilter === 'all' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        All Categories
                      </button>
                      {allCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px]',
                            categoryFilter === cat ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {categoryConfig[cat].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {filteredPeptides.map(p => {
                      const selected = isSelected(p.id);
                      const disabled = !selected && selectedPeptides.length >= 4;
                      return (
                        <button
                          key={p.id}
                          onClick={() => !disabled && togglePeptide(p)}
                          disabled={disabled}
                          className={cn(
                            'p-3 rounded-xl border text-left transition-all min-h-[60px] relative',
                            selected ? 'border-accent bg-accent/10 ring-1 ring-accent/50' : disabled ? 'opacity-40 cursor-not-allowed border-border' : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          )}
                        >
                          {selected && <Check className="absolute top-2 right-2 w-4 h-4 text-accent" />}
                          <div className="font-medium text-sm">{p.shortName}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{categoryConfig[p.category]?.label || p.category}</div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comparison Table */}
            {selectedPeptides.length >= 2 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground text-sm sticky left-0 bg-background">Property</th>
                      {selectedPeptides.map(p => <th key={p.id} className="text-left p-3 font-bold text-sm">{p.shortName}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Category', render: (p: Peptide) => <Badge className={cn(categoryConfig[p.category]?.bgColor, categoryConfig[p.category]?.color, 'text-xs')}>{categoryConfig[p.category]?.label}</Badge> },
                      { label: 'Half-Life', render: (p: Peptide) => p.halfLife || 'N/A' },
                      { label: 'Longevity Score', render: (p: Peptide) => <span className="font-bold text-accent">{p.longevityScore}/10</span> },
                      { label: 'Clinical Status', render: (p: Peptide) => (
                        <span className={cn('text-xs px-2 py-1 rounded-full',
                          p.clinicalStatus === 'approved' && 'bg-green-500/20 text-green-400',
                          p.clinicalStatus === 'phase3' && 'bg-blue-500/20 text-blue-400',
                          p.clinicalStatus === 'phase2' && 'bg-yellow-500/20 text-yellow-400',
                          p.clinicalStatus === 'phase1' && 'bg-orange-500/20 text-orange-400',
                          p.clinicalStatus === 'preclinical' && 'bg-red-500/20 text-red-400'
                        )}>{p.clinicalStatus ? p.clinicalStatus.replace('phase', 'Phase ') : 'N/A'}</span>
                      )},
                      { label: 'Legal (USA)', render: (p: Peptide) => (
                        <span className={cn('text-xs px-2 py-1 rounded-full',
                          p.legalStatus?.usa === 'approved' && 'bg-green-500/20 text-green-400',
                          p.legalStatus?.usa === 'prescription' && 'bg-blue-500/20 text-blue-400',
                          p.legalStatus?.usa === 'research-only' && 'bg-yellow-500/20 text-yellow-400',
                          p.legalStatus?.usa === 'banned' && 'bg-red-500/20 text-red-400'
                        )}>{p.legalStatus?.usa?.replace('-', ' ') || 'N/A'}</span>
                      )},
                      { label: 'Bioavailability', render: (p: Peptide) => <span className="text-sm">{p.bioavailability || 'N/A'}</span> },
                      { label: 'Mol. Weight', render: (p: Peptide) => <span className="text-sm">{p.molecularWeight || 'N/A'}</span> },
                      { label: 'Administration', render: (p: Peptide) => <span className="text-sm">{p.administration}</span> },
                      { label: 'Frequency', render: (p: Peptide) => <span className="text-sm">{p.frequency}</span> },
                      { label: 'Beginner Dose', render: (p: Peptide) => <span className="text-sm">{p.dosing.beginner}</span> },
                      { label: 'Janoshik Tested', render: (p: Peptide) => p.janoshikTested ? (
                        <div className="flex items-center gap-1 text-green-400"><Check className="w-4 h-4" /><span>{p.janoshikPurity}%</span></div>
                      ) : <span className="text-muted-foreground">No</span> },
                      { label: 'Key Benefits', render: (p: Peptide) => (
                        <ul className="text-sm space-y-1">{p.benefits.slice(0, 3).map((b, i) => <li key={i} className="flex items-start gap-1"><span className="text-accent">•</span><span>{b.slice(0, 50)}{b.length > 50 ? '...' : ''}</span></li>)}</ul>
                      )},
                      { label: 'Risks', render: (p: Peptide) => (
                        <ul className="text-sm space-y-1 text-orange-400">{p.risks.slice(0, 2).map((r, i) => <li key={i}>• {r.slice(0, 40)}{r.length > 40 ? '...' : ''}</li>)}</ul>
                      )},
                    ].map((row, ri) => (
                      <tr key={ri} className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground text-sm align-top sticky left-0 bg-background font-medium">{row.label}</td>
                        {selectedPeptides.map(p => <td key={p.id} className="p-3 align-top">{row.render(p)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              !selectorVisible && (
                <div className="text-center py-16 text-muted-foreground">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select at least 2 peptides to compare</p>
                  <p className="text-sm">You can compare up to 4 peptides side-by-side</p>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
