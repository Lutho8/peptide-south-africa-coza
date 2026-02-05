import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown, Check, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { peptides, Peptide } from '@/data/peptides';
import { cn } from '@/lib/utils';

interface PeptideCompareProps {
  open: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  immune: 'bg-indigo-500/20 text-indigo-400',
  longevity: 'bg-emerald-500/20 text-emerald-400',
  cognitive: 'bg-blue-500/20 text-blue-400',
  metabolic: 'bg-purple-500/20 text-purple-400',
  healing: 'bg-red-500/20 text-red-400',
  'gh-secretagogue': 'bg-yellow-500/20 text-yellow-400',
};

export function PeptideCompare({ open, onClose }: PeptideCompareProps) {
  const [selectedPeptides, setSelectedPeptides] = useState<Peptide[]>([]);
  const [openSelector, setOpenSelector] = useState<number | null>(null);

  const availablePeptides = useMemo(() => {
    const selectedIds = selectedPeptides.map(p => p.id);
    return peptides.filter(p => !selectedIds.includes(p.id));
  }, [selectedPeptides]);

  const addPeptide = (peptide: Peptide) => {
    if (selectedPeptides.length < 4) {
      setSelectedPeptides(prev => [...prev, peptide]);
    }
    setOpenSelector(null);
  };

  const removePeptide = (id: string) => {
    setSelectedPeptides(prev => prev.filter(p => p.id !== id));
  };

  const clearAll = () => {
    setSelectedPeptides([]);
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
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold">Compare Peptides</h1>
              {selectedPeptides.length > 0 && (
                <Badge variant="secondary">{selectedPeptides.length}/4 selected</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedPeptides.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4">
            {/* Selection Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[0, 1, 2, 3].map((index) => {
                const peptide = selectedPeptides[index];
                
                return (
                  <div key={index} className="relative">
                    {peptide ? (
                      <Card className="p-4 h-32 relative group">
                        <button
                          onClick={() => removePeptide(peptide.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                        <h3 className="font-bold">{peptide.shortName}</h3>
                        <p className="text-sm text-muted-foreground truncate">{peptide.name}</p>
                        <Badge className={cn('mt-2 text-xs', categoryColors[peptide.category])}>
                          {peptide.category.replace('-', ' ')}
                        </Badge>
                      </Card>
                    ) : (
                      <Popover open={openSelector === index} onOpenChange={(o) => setOpenSelector(o ? index : null)}>
                        <PopoverTrigger asChild>
                          <button className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-colors">
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Add Peptide</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search peptides..." />
                            <CommandList>
                              <CommandEmpty>No peptides found.</CommandEmpty>
                              <CommandGroup>
                                {availablePeptides.map((p) => (
                                  <CommandItem
                                    key={p.id}
                                    value={p.name}
                                    onSelect={() => addPeptide(p)}
                                    className="cursor-pointer"
                                  >
                                    <span className="font-medium">{p.shortName}</span>
                                    <span className="ml-2 text-muted-foreground text-sm">{p.name}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison Table */}
            {selectedPeptides.length >= 2 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">Property</th>
                        {selectedPeptides.map((p) => (
                          <th key={p.id} className="text-left p-3 font-bold">{p.shortName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Category</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <Badge className={cn(categoryColors[p.category])}>
                              {p.category.replace('-', ' ')}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Half-Life</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">{p.halfLife || 'N/A'}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Longevity Score</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <span className="font-bold text-accent">{p.longevityScore}/10</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Clinical Status</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <span className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              p.clinicalStatus === 'approved' && 'bg-green-500/20 text-green-400',
                              p.clinicalStatus === 'phase3' && 'bg-blue-500/20 text-blue-400',
                              p.clinicalStatus === 'phase2' && 'bg-yellow-500/20 text-yellow-400',
                              p.clinicalStatus === 'phase1' && 'bg-orange-500/20 text-orange-400',
                              p.clinicalStatus === 'preclinical' && 'bg-red-500/20 text-red-400'
                            )}>
                              {p.clinicalStatus ? p.clinicalStatus.replace('phase', 'Phase ') : 'N/A'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Legal (USA)</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <span className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              p.legalStatus?.usa === 'approved' && 'bg-green-500/20 text-green-400',
                              p.legalStatus?.usa === 'prescription' && 'bg-blue-500/20 text-blue-400',
                              p.legalStatus?.usa === 'research-only' && 'bg-yellow-500/20 text-yellow-400',
                              p.legalStatus?.usa === 'banned' && 'bg-red-500/20 text-red-400'
                            )}>
                              {p.legalStatus?.usa?.replace('-', ' ') || 'N/A'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Bioavailability</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3 text-sm">
                            {p.bioavailability || 'N/A'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Mol. Weight</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3 text-sm">{p.molecularWeight || 'N/A'}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Administration</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3 text-sm">{p.administration}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Frequency</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3 text-sm">{p.frequency}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Beginner Dose</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3 text-sm">{p.dosing.beginner}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">Janoshik Tested</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            {p.janoshikTested ? (
                              <div className="flex items-center gap-1 text-green-400">
                                <Check className="w-4 h-4" />
                                <span>{p.janoshikPurity}%</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground align-top">Key Benefits</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <ul className="text-sm space-y-1">
                              {p.benefits.slice(0, 3).map((b, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-accent">•</span>
                                  <span>{b.slice(0, 50)}{b.length > 50 ? '...' : ''}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground align-top">Risks</td>
                        {selectedPeptides.map((p) => (
                          <td key={p.id} className="p-3">
                            <ul className="text-sm space-y-1 text-orange-400">
                              {p.risks.slice(0, 2).map((r, i) => (
                                <li key={i}>• {r.slice(0, 40)}{r.length > 40 ? '...' : ''}</li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
              </AnimatePresence>
            )}

            {selectedPeptides.length < 2 && (
              <div className="text-center py-16 text-muted-foreground">
                <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select at least 2 peptides to compare</p>
                <p className="text-sm">You can compare up to 4 peptides side-by-side</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
