import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Peptide } from '@/data/peptides';
import { Button } from '@/components/ui/button';
import { 
  Star, FlaskConical, ShoppingCart, AlertTriangle, 
  Clock, Syringe, ExternalLink, Layers, FileText
} from 'lucide-react';

interface PeptideDetailModalProps {
  peptide: Peptide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PeptideDetailModal({ peptide, open, onOpenChange }: PeptideDetailModalProps) {
  if (!peptide) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-foreground">{peptide.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">({peptide.shortName})</p>
            </div>
            <CategoryBadge category={peptide.category} showCount={false} />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <Star size={18} className="mx-auto text-yellow-500 fill-yellow-500 mb-1" />
              <p className="text-lg font-bold text-foreground">{peptide.longevityScore}/10</p>
              <p className="text-xs text-muted-foreground">Longevity Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <Clock size={18} className="mx-auto text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{peptide.halfLife || 'Varies'}</p>
              <p className="text-xs text-muted-foreground">Half-life</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <Syringe size={18} className="mx-auto text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{peptide.frequency}</p>
              <p className="text-xs text-muted-foreground">Frequency</p>
            </div>
          </div>

          {/* Mechanism */}
          <GradientCard>
            <h3 className="font-medium text-foreground mb-2">Mechanism of Action</h3>
            <p className="text-sm text-muted-foreground">{peptide.mechanism}</p>
          </GradientCard>

          {/* Benefits */}
          <GradientCard>
            <h3 className="font-medium text-foreground mb-2">Benefits</h3>
            <ul className="space-y-1">
              {peptide.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </GradientCard>

          {/* Athlete Benefits */}
          <GradientCard variant="primary">
            <h3 className="font-medium text-foreground mb-2">Athlete-Specific Benefits</h3>
            <ul className="space-y-1">
              {peptide.athleteBenefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </GradientCard>

          {/* Expected Results Timeline */}
          <GradientCard>
            <h3 className="font-medium text-foreground mb-3">Expected Results Timeline</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-muted/50">
                <p className="text-primary font-medium">Week 1-2</p>
                <p className="text-muted-foreground">{peptide.expectedResults.week1_2}</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-primary font-medium">Week 3-4</p>
                <p className="text-muted-foreground">{peptide.expectedResults.week3_4}</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-primary font-medium">Week 5-8</p>
                <p className="text-muted-foreground">{peptide.expectedResults.week5_8}</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-primary font-medium">Long-term</p>
                <p className="text-muted-foreground">{peptide.expectedResults.longTerm}</p>
              </div>
            </div>
          </GradientCard>

          {/* Dosing Tiers */}
          <GradientCard>
            <h3 className="font-medium text-foreground mb-3">Dosing Tiers</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-muted/50">
                <p className="text-muted-foreground text-xs">Beginner</p>
                <p className="text-foreground font-medium">{peptide.dosing.beginner}</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-muted-foreground text-xs">Intermediate</p>
                <p className="text-foreground font-medium">{peptide.dosing.intermediate}</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="text-muted-foreground text-xs">Advanced</p>
                <p className="text-foreground font-medium">{peptide.dosing.advanced}</p>
              </div>
              <div className="p-2 rounded bg-primary/20 border border-primary/30">
                <p className="text-primary text-xs">Athlete</p>
                <p className="text-foreground font-medium">{peptide.dosing.athlete}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Administration:</strong> {peptide.administration}
            </p>
          </GradientCard>

          {/* Risks */}
          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-yellow-500" />
              <h3 className="font-medium text-yellow-400">Risks & Considerations</h3>
            </div>
            <ul className="space-y-1">
              {peptide.risks.map((risk, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-yellow-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Janoshik Test Results */}
          {peptide.janoshikTested && (
            <GradientCard>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-primary" />
                  <h3 className="font-medium text-foreground">Janoshik Test Results</h3>
                </div>
                <StatusBadge status="verified" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Purity</p>
                  <p className="text-2xl font-bold text-primary">{peptide.janoshikPurity}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Test Date</p>
                  <p className="text-foreground font-medium">{peptide.janoshikDate}</p>
                </div>
              </div>
            </GradientCard>
          )}

          {/* Supplier Info */}
          <GradientCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Supplier Info</h3>
              <StatusBadge status={peptide.supplier.stock} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p className="text-foreground">{peptide.supplier.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Product Code</p>
                <p className="text-foreground font-mono">{peptide.supplier.productCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="text-2xl font-bold text-foreground">${peptide.supplier.price}</p>
              </div>
            </div>
            <Button className="w-full gap-2">
              <ShoppingCart size={16} />
              Order Now
              <ExternalLink size={14} />
            </Button>
          </GradientCard>

          {/* Research References */}
          {peptide.references && peptide.references.length > 0 && (
            <GradientCard>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-primary" />
                <h3 className="font-medium text-foreground">Research References</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {peptide.references.map((ref, i) => (
                  <a
                    key={i}
                    href={`https://pubmed.ncbi.nlm.nih.gov/${ref.replace('PMID: ', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {ref}
                  </a>
                ))}
              </div>
            </GradientCard>
          )}

          {/* Personal Notes */}
          <GradientCard>
            <h3 className="font-medium text-foreground mb-2">Personal Notes</h3>
            <p className="text-sm text-muted-foreground italic">No notes added yet. Tap to add your observations.</p>
          </GradientCard>
        </div>
      </DialogContent>
    </Dialog>
  );
}
