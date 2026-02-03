import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Layers, AlertTriangle, CheckCircle, Info, Clock, Trash2 } from 'lucide-react';
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
import { 
  getCompatibility, 
  CompatibilityLevel,
  getCompatibilityColor,
  getCompatibilityBgColor,
  getCompatibilityLabel,
  StackingInteraction
} from '@/data/stackingMatrix';
import { cn } from '@/lib/utils';

interface StackBuilderProps {
  open: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  immune: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  longevity: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cognitive: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  metabolic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  healing: 'bg-red-500/20 text-red-400 border-red-500/30',
  'gh-secretagogue': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

interface StackInteraction {
  peptide1: Peptide;
  peptide2: Peptide;
  interaction: StackingInteraction;
}

export function StackBuilder({ open, onClose }: StackBuilderProps) {
  const [selectedPeptides, setSelectedPeptides] = useState<Peptide[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const availablePeptides = useMemo(() => {
    const selectedIds = selectedPeptides.map(p => p.id);
    return peptides.filter(p => !selectedIds.includes(p.id));
  }, [selectedPeptides]);

  const stackInteractions = useMemo(() => {
    const interactions: StackInteraction[] = [];
    for (let i = 0; i < selectedPeptides.length; i++) {
      for (let j = i + 1; j < selectedPeptides.length; j++) {
        const interaction = getCompatibility(selectedPeptides[i].id, selectedPeptides[j].id);
        if (interaction) {
          interactions.push({
            peptide1: selectedPeptides[i],
            peptide2: selectedPeptides[j],
            interaction
          });
        }
      }
    }
    return interactions;
  }, [selectedPeptides]);

  const stackScore = useMemo(() => {
    if (selectedPeptides.length < 2) return null;
    
    let score = 100;
    let synergisticCount = 0;
    let cautionCount = 0;
    let avoidCount = 0;
    
    stackInteractions.forEach(({ interaction }) => {
      switch (interaction.compatibility) {
        case 'synergistic':
          score += 15;
          synergisticCount++;
          break;
        case 'compatible':
          score += 5;
          break;
        case 'caution':
          score -= 15;
          cautionCount++;
          break;
        case 'avoid':
          score -= 40;
          avoidCount++;
          break;
      }
    });
    
    return {
      score: Math.max(0, Math.min(100, score)),
      synergisticCount,
      cautionCount,
      avoidCount
    };
  }, [stackInteractions]);

  const addPeptide = (peptide: Peptide) => {
    setSelectedPeptides(prev => [...prev, peptide]);
    setSelectorOpen(false);
  };

  const removePeptide = (id: string) => {
    setSelectedPeptides(prev => prev.filter(p => p.id !== id));
  };

  const clearAll = () => {
    setSelectedPeptides([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCompatibilityIcon = (level: CompatibilityLevel) => {
    switch (level) {
      case 'synergistic':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'compatible':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'caution':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'avoid':
        return <X className="w-4 h-4 text-red-400" />;
    }
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
              <Layers className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold">Stack Builder</h1>
              {selectedPeptides.length > 0 && (
                <Badge variant="secondary">{selectedPeptides.length} peptides</Badge>
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
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Peptide Selection */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-lg font-semibold">Build Your Stack</h2>
                <p className="text-sm text-muted-foreground">
                  Add peptides to your stack and see how they interact with each other.
                </p>

                {/* Selected Peptides */}
                <div className="space-y-2">
                  {selectedPeptides.map((peptide) => (
                    <Card key={peptide.id} className="p-3 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-medium">{peptide.shortName}</h3>
                            <Badge className={cn('text-xs mt-1', categoryColors[peptide.category])}>
                              {peptide.category.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <button
                          onClick={() => removePeptide(peptide.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Add Peptide Button */}
                <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Peptide
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0" align="start">
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
                              <Badge className={cn('ml-2 text-xs', categoryColors[p.category])}>
                                {p.category.replace('-', ' ')}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Right: Analysis */}
              <div className="lg:col-span-2 space-y-6">
                {selectedPeptides.length < 2 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Add at least 2 peptides to analyze</p>
                    <p className="text-sm">We'll show you how they interact and suggest optimal timing.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {/* Stack Score */}
                    {stackScore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Stack Synergy Score</h3>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className={cn("text-5xl font-bold", getScoreColor(stackScore.score))}>
                                {stackScore.score}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                                <div className="text-2xl font-bold text-green-400">{stackScore.synergisticCount}</div>
                                <p className="text-xs text-muted-foreground">Synergistic</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-400">{stackScore.cautionCount}</div>
                                <p className="text-xs text-muted-foreground">Caution</p>
                              </div>
                              <div className="text-center p-3 bg-red-500/10 rounded-lg">
                                <div className="text-2xl font-bold text-red-400">{stackScore.avoidCount}</div>
                                <p className="text-xs text-muted-foreground">Avoid</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* Interactions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-lg font-semibold mb-4">Interaction Analysis</h3>
                      <div className="space-y-3">
                        {stackInteractions.length > 0 ? (
                          stackInteractions.map(({ peptide1, peptide2, interaction }, index) => (
                            <Card 
                              key={`${peptide1.id}-${peptide2.id}`}
                              className={cn("p-4", getCompatibilityBgColor(interaction.compatibility))}
                            >
                              <div className="flex items-start gap-3">
                                {getCompatibilityIcon(interaction.compatibility)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{peptide1.shortName}</span>
                                    <span className="text-muted-foreground">+</span>
                                    <span className="font-medium">{peptide2.shortName}</span>
                                    <Badge className={cn("ml-2", getCompatibilityBgColor(interaction.compatibility))}>
                                      {getCompatibilityLabel(interaction.compatibility)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{interaction.notes}</p>
                                  {interaction.timing && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span>{interaction.timing}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <Card className="p-4 text-center text-muted-foreground">
                            <p>No known interactions between selected peptides.</p>
                            <p className="text-sm mt-1">This doesn't mean they're incompatible—just that specific data isn't available.</p>
                          </Card>
                        )}
                      </div>
                    </motion.div>

                    {/* Protocol Suggestions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-4">Suggested Protocol</h3>
                      <Card className="p-4">
                        <div className="space-y-4">
                          {selectedPeptides.map((peptide) => (
                            <div key={peptide.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                              <div className="flex-1">
                                <div className="font-medium">{peptide.shortName}</div>
                                <div className="text-sm text-muted-foreground">{peptide.dosing.beginner}</div>
                                <div className="text-xs text-muted-foreground mt-1">{peptide.frequency} • {peptide.administration}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
