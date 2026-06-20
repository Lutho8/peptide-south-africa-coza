import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FlaskConical, Beaker, Clock, Thermometer, Syringe, BookOpen, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, Heart, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PeptideBlend } from '@/data/peptideBlends';
import { cn } from '@/lib/utils';

interface BlendDetailModalProps {
  blend: PeptideBlend | null;
  open: boolean;
  onClose: () => void;
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors min-h-[48px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BlendDetailModal({ blend, open, onClose }: BlendDetailModalProps) {
  if (!open || !blend) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold leading-tight">{blend.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px]">{blend.type === 'blend' ? 'Blend' : 'Stack'}</Badge>
                  <Badge variant="outline" className="text-[10px]">{blend.category}</Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="container mx-auto p-4 max-w-4xl space-y-6">
            {/* Quickstart Highlights */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-primary" /> Quickstart Highlights
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{blend.description}</p>
              <ul className="space-y-2">
                <li className="text-sm"><strong>Reconstitute:</strong> {blend.quickstart.reconstitute}</li>
                <li className="text-sm"><strong>Typical dose:</strong> {blend.quickstart.typicalDose}</li>
                <li className="text-sm"><strong>Easy measuring:</strong> {blend.quickstart.easyMeasuring}</li>
                <li className="text-sm"><strong>Storage:</strong> {blend.quickstart.storage}</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {blend.components.map((c, i) => (
                  <Badge key={i} className="bg-accent/20 text-accent-foreground border-accent/30">{c}</Badge>
                ))}
              </div>
            </div>

            {/* Dosing Table */}
            <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-1">
              <div className="bg-background rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-primary" /> Dosing & Reconstitution Guide
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Educational guide for reconstitution and daily dosing</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Week</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Daily Dose</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Units (mL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blend.dosingTable.map((row, i) => (
                        <tr key={i} className="border-b border-border/30">
                          <td className="py-2 px-3 font-medium">{row.week}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.dailyDose}</td>
                          <td className="py-2 px-3"><Badge variant="outline" className="text-[11px]">{row.units}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">{blend.dosingFrequency}</p>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-3">
              <CollapsibleSection title="Reconstitution Steps" icon={Beaker} defaultOpen={false}>
                <ol className="space-y-2 list-decimal list-inside">
                  {blend.reconstitutionSteps.map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{step}</li>
                  ))}
                </ol>
              </CollapsibleSection>

              {blend.syringeMath && (
                <CollapsibleSection title="Syringe Math Reference" icon={Activity}>
                  <ul className="space-y-1">
                    {blend.syringeMath.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              <CollapsibleSection title="Protocol Overview" icon={Clock}>
                <ul className="space-y-2">
                  {blend.protocolOverview.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Dosing Protocol" icon={Syringe}>
                <ul className="space-y-2">
                  {blend.dosingProtocol.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Storage Instructions" icon={Thermometer}>
                <ul className="space-y-2">
                  {blend.storageInstructions.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="How It Works" icon={FlaskConical} defaultOpen={false}>
                <p className="text-sm text-muted-foreground leading-relaxed">{blend.howItWorks}</p>
              </CollapsibleSection>

              <CollapsibleSection title="Potential Benefits" icon={Heart}>
                <ul className="space-y-2">
                  {blend.benefits.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Side Effects & Considerations" icon={AlertTriangle}>
                <ul className="space-y-2">
                  {blend.sideEffects.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚠</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Important Notes" icon={Shield}>
                <ul className="space-y-2">
                  {blend.importantNotes.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Injection Technique" icon={Syringe}>
                <ul className="space-y-2">
                  {blend.injectionTechnique.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              {/* References */}
              <CollapsibleSection title={`References (${blend.references.length})`} icon={BookOpen} defaultOpen={false}>
                <ol className="space-y-3">
                  {blend.references.map((ref, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground font-mono text-xs mt-0.5">[{i + 1}]</span>
                        <div>
                          <span className="font-medium text-foreground">{ref.source}</span>
                          <span className="text-muted-foreground"> — {ref.title}</span>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline ml-2 text-xs">
                            View Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </CollapsibleSection>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4">
              <p className="text-xs text-muted-foreground">
                <strong className="text-yellow-500">⚠ Educational Disclaimer:</strong> This content is for educational and research purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a healthcare professional before starting any peptide protocol.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
