import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Layers, AlertTriangle, CheckCircle, Info, Clock, Trash2, Heart, Sparkles, Brain, Moon, Dumbbell, Shield, FlaskConical, Zap } from 'lucide-react';
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
  'weight-loss': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'anti-aging': 'bg-green-500/20 text-green-400 border-green-500/30',
  'skin-hair': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'hormonal': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bioregulators': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

interface StackTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof Heart;
  peptideIds: string[];
}

const stackTemplates: StackTemplate[] = [
  { id: 'wolverine', name: 'Wolverine Stack', description: 'The legendary healing combo for injury recovery', icon: Heart, peptideIds: ['bpc-157', 'tb-500'] },
  { id: 'glow', name: 'Glow Protocol', description: 'Skin rejuvenation and anti-aging blend', icon: Sparkles, peptideIds: ['bpc-157', 'tb-500', 'ghk-cu'] },
  { id: 'klow', name: 'KLOW Blend', description: 'Advanced healing with gut health support', icon: FlaskConical, peptideIds: ['bpc-157', 'tb-500', 'ghk-cu', 'kpv'] },
  { id: 'gh-opt', name: 'GH Optimization Stack', description: 'Maximize natural growth hormone release', icon: Zap, peptideIds: ['ipamorelin', 'cjc-1295'] },
  { id: 'cognitive', name: 'Cognitive Enhancement', description: 'Boost focus, memory, and mental clarity', icon: Brain, peptideIds: ['semax', 'selank'] },
  { id: 'longevity', name: 'Longevity Stack', description: 'Support cellular health and slow aging', icon: Shield, peptideIds: ['epithalon', 'ghk-cu', 'thymosin-alpha-1'] },
  { id: 'sleep', name: 'Sleep & Recovery', description: 'Enhance sleep quality and overnight recovery', icon: Moon, peptideIds: ['dsip', 'ipamorelin', 'ghrp-2'] },
  { id: 'weight-loss', name: 'Weight Loss Stack', description: 'Support metabolic health and fat reduction', icon: Dumbbell, peptideIds: ['semaglutide', 'aod-9604'] },
  { id: 'recomp', name: 'Body Recomposition', description: 'Build muscle while reducing body fat', icon: Dumbbell, peptideIds: ['ipamorelin', 'cjc-1295', 'bpc-157'] },
  { id: 'immune', name: 'Immune Support', description: 'Strengthen immune function and resilience', icon: Shield, peptideIds: ['thymosin-alpha-1', 'bpc-157'] },
];

interface StackInteraction {
  peptide1: Peptide;
  peptide2: Peptide;
  interaction: StackingInteraction;
}

export function StackBuilder({ open, onClose }: StackBuilderProps) {
  const [selectedPeptides, setSelectedPeptides] = useState<Peptide[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

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
          interactions.push({ peptide1: selectedPeptides[i], peptide2: selectedPeptides[j], interaction });
        }
      }
    }
    return interactions;
  }, [selectedPeptides]);

  const stackScore = useMemo(() => {
    if (selectedPeptides.length < 2) return null;
    let score = 100;
    let synergisticCount = 0, cautionCount = 0, avoidCount = 0;
    stackInteractions.forEach(({ interaction }) => {
      switch (interaction.compatibility) {
        case 'synergistic': score += 15; synergisticCount++; break;
        case 'compatible': score += 5; break;
        case 'caution': score -= 15; cautionCount++; break;
        case 'avoid': score -= 40; avoidCount++; break;
      }
    });
    return { score: Math.max(0, Math.min(100, score)), synergisticCount, cautionCount, avoidCount };
  }, [stackInteractions]);

  const addPeptide = (peptide: Peptide) => {
    setSelectedPeptides(prev => [...prev, peptide]);
    setSelectorOpen(false);
  };

  const removePeptide = (id: string) => {
    setSelectedPeptides(prev => prev.filter(p => p.id !== id));
  };

  const clearAll = () => setSelectedPeptides([]);

  const loadTemplate = (template: StackTemplate) => {
    const found = template.peptideIds
      .map(id => peptides.find(p => p.id === id))
      .filter(Boolean) as Peptide[];
    setSelectedPeptides(found);
    setActiveTab('custom');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCompatibilityIcon = (level: CompatibilityLevel) => {
    switch (level) {
      case 'synergistic': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'compatible': return <Info className="w-4 h-4 text-blue-400" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'avoid': return <X className="w-4 h-4 text-red-400" />;
    }
  };

  if (!open) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-accent" />
              <h1 className="text-xl md:text-2xl font-bold">Peptide Stack Builder</h1>
              {selectedPeptides.length > 0 && <Badge variant="secondary">{selectedPeptides.length} peptides</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {selectedPeptides.length > 0 && <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>}
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4">
          <div className="container mx-auto flex gap-1 py-2">
            <button
              onClick={() => setActiveTab('templates')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]',
                activeTab === 'templates' ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              Stack Templates
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]',
                activeTab === 'custom' ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              Build Custom
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-4 pt-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl text-sm">
              <Info className="w-4 h-4 text-accent shrink-0" />
              <span><strong className="text-accent">Community Protocols:</strong> <span className="text-muted-foreground">Timing and frequency based on human community experience, not animal studies.</span></span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'templates' ? (
                <motion.div key="templates" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                  <h2 className="text-lg font-semibold mb-4">Popular Stack Templates</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stackTemplates.map((template, i) => {
                      const Icon = template.icon;
                      return (
                        <motion.div key={template.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <Card
                            className="p-4 cursor-pointer hover:border-accent/50 transition-all group"
                            onClick={() => loadTemplate(template)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-accent" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{template.name}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.peptideIds.map(id => {
                                    const p = peptides.find(pp => pp.id === id);
                                    return p ? (
                                      <span key={id} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.shortName}</span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border/50 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Educational Information Only</h4>
                      <p className="text-xs text-muted-foreground mt-1">Stack recommendations are based on community protocols and research literature. Always consult with a qualified healthcare provider before starting any peptide protocol.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="custom" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Selection */}
                    <div className="lg:col-span-1 space-y-4">
                      <h2 className="text-lg font-semibold">Build Your Stack</h2>
                      <p className="text-sm text-muted-foreground">Add peptides to your stack and see how they interact.</p>

                      <div className="space-y-2">
                        {selectedPeptides.map((peptide) => (
                          <Card key={peptide.id} className="p-3 group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-sm">{peptide.shortName}</h3>
                                <Badge className={cn('text-xs mt-1', categoryColors[peptide.category])}>{peptide.category.replace('-', ' ')}</Badge>
                              </div>
                              <button onClick={() => removePeptide(peptide.id)} className="opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full min-h-[44px]">
                            <Plus className="w-4 h-4 mr-2" /> Add Peptide
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search peptides..." />
                            <CommandList>
                              <CommandEmpty>No peptides found.</CommandEmpty>
                              <CommandGroup>
                                {availablePeptides.map((p) => (
                                  <CommandItem key={p.id} value={p.name} onSelect={() => addPeptide(p)} className="cursor-pointer">
                                    <span className="font-medium">{p.shortName}</span>
                                    <Badge className={cn('ml-2 text-xs', categoryColors[p.category])}>{p.category.replace('-', ' ')}</Badge>
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
                          <p className="text-lg">Select peptides or choose a template to start building</p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {stackScore && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Stack Synergy Score</h3>
                                <div className="flex items-center gap-6">
                                  <div className="text-center">
                                    <div className={cn("text-5xl font-bold", getScoreColor(stackScore.score))}>{stackScore.score}</div>
                                    <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                                  </div>
                                  <div className="flex-1 grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-green-500/10 rounded-lg"><div className="text-2xl font-bold text-green-400">{stackScore.synergisticCount}</div><p className="text-xs text-muted-foreground">Synergistic</p></div>
                                    <div className="text-center p-3 bg-yellow-500/10 rounded-lg"><div className="text-2xl font-bold text-yellow-400">{stackScore.cautionCount}</div><p className="text-xs text-muted-foreground">Caution</p></div>
                                    <div className="text-center p-3 bg-red-500/10 rounded-lg"><div className="text-2xl font-bold text-red-400">{stackScore.avoidCount}</div><p className="text-xs text-muted-foreground">Avoid</p></div>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )}

                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="text-lg font-semibold mb-4">Interaction Analysis</h3>
                            <div className="space-y-3">
                              {stackInteractions.length > 0 ? stackInteractions.map(({ peptide1, peptide2, interaction }) => (
                                <Card key={`${peptide1.id}-${peptide2.id}`} className={cn("p-4", getCompatibilityBgColor(interaction.compatibility))}>
                                  <div className="flex items-start gap-3">
                                    {getCompatibilityIcon(interaction.compatibility)}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-medium">{peptide1.shortName}</span>
                                        <span className="text-muted-foreground">+</span>
                                        <span className="font-medium">{peptide2.shortName}</span>
                                        <Badge className={cn("ml-1", getCompatibilityBgColor(interaction.compatibility))}>{getCompatibilityLabel(interaction.compatibility)}</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{interaction.notes}</p>
                                      {interaction.timing && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" /><span>{interaction.timing}</span></div>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              )) : (
                                <Card className="p-4 text-center text-muted-foreground">
                                  <p>No known interactions between selected peptides.</p>
                                  <p className="text-sm mt-1">This doesn't mean they're incompatible—just that specific data isn't available.</p>
                                </Card>
                              )}
                            </div>
                          </motion.div>

                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
