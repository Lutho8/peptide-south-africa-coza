import { useState, useEffect } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { userProfile, stackOptimizations } from '@/data/userData';
import { findPeptideOrBlend, findBlendData } from '@/data/blendAdapters';
import { ChevronDown, ChevronUp, Sparkles, ShoppingCart, AlertTriangle, ExternalLink, Edit2, FlaskConical, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EditStackModal, StackItem } from '@/components/modals/EditStackModal';
import { getActiveStack, saveActiveStack, getUserProfile, getCycles, updateCycle, Cycle } from '@/services/storage';
import { AIAgentPanel } from '@/components/ai/AIAgentPanel';
import { Badge } from '@/components/ui/badge';
import { CycleBreakAlert } from '@/components/doses/CycleBreakAlert';
import { Progress } from '@/components/ui/progress';

// --- Stack Item Card ---
interface StackItemProps {
  peptide: ReturnType<typeof findPeptideOrBlend>;
  dose: string;
  frequency: string;
  peptideId: string;
  cycle?: Cycle;
}

function getCycleProgress(cycle: Cycle): { daysElapsed: number; progress: number; isNearing: boolean; isOverdue: boolean } {
  const start = new Date(cycle.startDate);
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min((daysElapsed / cycle.plannedDuration) * 100, 100);
  const warningThreshold = cycle.plannedDuration * 0.85;
  return {
    daysElapsed,
    progress,
    isNearing: daysElapsed >= warningThreshold && daysElapsed < cycle.plannedDuration,
    isOverdue: daysElapsed >= cycle.plannedDuration,
  };
}

function StackItemCard({ peptide, dose, frequency, peptideId, cycle }: StackItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const blendData = findBlendData(peptideId);

  if (!peptide) return null;

  const cycleInfo = cycle ? getCycleProgress(cycle) : null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <GradientCard className="mb-3">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {blendData ? (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                </div>
              ) : (
                <CategoryBadge category={peptide.category} showCount={false} size="sm" />
              )}
              <div className="text-left">
                <h4 className="font-semibold text-foreground">{peptide.name}</h4>
                <p className="text-sm text-muted-foreground">{dose} • {frequency}</p>
                {blendData && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blendData.components.slice(0, 3).map((c, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0">{c}</Badge>
                    ))}
                    {blendData.components.length > 3 && (
                      <Badge variant="outline" className="text-[10px] py-0">+{blendData.components.length - 3}</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            {isOpen ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        {/* Inline cycle progress bar */}
        {cycle && cycleInfo && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Cycle Day {cycleInfo.daysElapsed}/{cycle.plannedDuration}
              </span>
              <Badge
                variant={cycleInfo.isOverdue ? "destructive" : cycleInfo.isNearing ? "secondary" : "outline"}
                className="text-[10px]"
              >
                {cycle.status === 'break' ? 'On Break' : cycleInfo.isOverdue ? 'Overdue' : cycleInfo.isNearing ? 'Nearing End' : 'Active'}
              </Badge>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  cycleInfo.isOverdue ? "bg-destructive" : cycleInfo.isNearing ? "bg-yellow-500" : "bg-primary"
                )}
                style={{ width: `${Math.min(cycleInfo.progress, 100)}%` }}
              />
            </div>
            {cycle.breakDuration > 0 && (
              <p className="text-[10px] text-muted-foreground">
                {cycle.breakDuration}-day break recommended after cycle
              </p>
            )}
          </div>
        )}

        <CollapsibleContent>
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {blendData ? (
              <>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Protocol Overview</h5>
                  <p className="text-xs text-muted-foreground">{blendData.howItWorks.slice(0, 200)}...</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Dosing Schedule</h5>
                  <div className="space-y-1.5">
                    {blendData.dosingTable.map((row, i) => (
                      <div key={i} className="flex justify-between p-2 rounded-lg bg-muted/50 text-xs">
                        <span className="text-primary font-medium">{row.week}</span>
                        <span className="text-muted-foreground">{row.dailyDose} — {row.units}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Benefits</h5>
                  <ul className="space-y-1">
                    {blendData.benefits.slice(0, 4).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    Watch For
                  </h5>
                  <ul className="space-y-1">
                    {blendData.sideEffects.slice(0, 3).map((effect, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-yellow-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>
                {blendData.references.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">References</h5>
                    <div className="space-y-1">
                      {blendData.references.slice(0, 3).map((ref, i) => (
                        <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                           className="block text-[10px] text-primary/80 hover:text-primary truncate">
                          {ref.source}: {ref.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Expected Results Timeline</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-primary font-medium">Week 1-2</p>
                      <p className="text-muted-foreground">{peptide.expectedResults.week1_2}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-primary font-medium">Week 3-4</p>
                      <p className="text-muted-foreground">{peptide.expectedResults.week3_4}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-primary font-medium">Week 5-8</p>
                      <p className="text-muted-foreground">{peptide.expectedResults.week5_8}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-primary font-medium">Long-term</p>
                      <p className="text-muted-foreground">{peptide.expectedResults.longTerm}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Top Athlete Benefits</h5>
                  <ul className="space-y-1">
                    {peptide.athleteBenefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    Watch For
                  </h5>
                  <ul className="space-y-1">
                    {peptide.risks.slice(0, 2).map((risk, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-yellow-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </CollapsibleContent>
      </GradientCard>
    </Collapsible>
  );
}

// --- Main Screen ---
export function MyStackScreen() {
  const [activeStack, setActiveStack] = useState<StackItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [cycles, setCycles] = useState<Cycle[]>([]);

  useEffect(() => {
    setActiveStack(getActiveStack());
    setProfile(getUserProfile());
    setCycles(getCycles());
  }, []);

  const handleSaveStack = (newStack: StackItem[]) => {
    setActiveStack(newStack);
    saveActiveStack(newStack);
  };

  const handleStartBreak = (cycle: Cycle) => {
    const updated: Cycle = { ...cycle, status: 'break' };
    updateCycle(updated);
    setCycles(getCycles());
  };

  // Map cycles to stack items
  const getCycleForPeptide = (peptideId: string): Cycle | undefined => {
    return cycles.find(c => c.peptideId === peptideId && (c.status === 'active' || c.status === 'break'));
  };

  return (
    <div className="pb-24 space-y-6 fade-in">
      {/* User Profile Header */}
      <GradientCard className="relative overflow-hidden premium-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent/50 to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg shadow-accent/20 luxury-shimmer">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">
              {profile.age} years • {profile.height}cm • {profile.weight}kg
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                {profile.activityLevel.charAt(0).toUpperCase() + profile.activityLevel.slice(1)}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                {profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* Cycle Break Alerts */}
      {cycles.length > 0 && (
        <CycleBreakAlert cycles={cycles} onStartBreak={handleStartBreak} />
      )}

      {/* Active Stack Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Active Stack</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary font-medium">{activeStack.length} peptides</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="gap-1"
            >
              <Edit2 size={14} />
              Edit
            </Button>
          </div>
        </div>

        {activeStack.length === 0 ? (
          <GradientCard className="text-center py-8">
            <p className="text-muted-foreground mb-3">No peptides in your stack yet.</p>
            <Button onClick={() => setEditModalOpen(true)}>
              Add Your First Peptide
            </Button>
          </GradientCard>
        ) : (
          activeStack.map((item) => {
            const peptide = findPeptideOrBlend(item.peptideId);
            if (!peptide) return null;
            return (
              <StackItemCard
                key={item.peptideId}
                peptide={peptide}
                peptideId={item.peptideId}
                dose={item.dose}
                frequency={item.frequency}
                cycle={getCycleForPeptide(item.peptideId)}
              />
            );
          })
        )}
      </div>

      {/* AI Stack Optimizer */}
      {activeStack.length > 0 && (
        <AIAgentPanel
          mode="optimize"
          currentStack={activeStack.map(item => {
            const peptide = findPeptideOrBlend(item.peptideId);
            return peptide?.name || item.peptideId;
          })}
          userWeight={profile.weight}
          userGoals={profile.goals}
          experienceLevel={profile.experience}
        />
      )}

      {/* AI Personalized Recommendations */}
      <AIAgentPanel
        mode="recommend"
        currentStack={activeStack.map(item => {
          const peptide = findPeptideOrBlend(item.peptideId);
          return peptide?.name || item.peptideId;
        })}
        userWeight={profile.weight}
        userGoals={profile.goals}
        experienceLevel={profile.experience}
      />

      {/* Stack Optimization Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Quick Optimizations</h3>
        </div>

        <div className="space-y-2">
          {stackOptimizations.map((opt, index) => (
            <GradientCard key={index} className="p-3 premium-border">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  opt.priority === 'high' ? 'bg-destructive' : 
                  opt.priority === 'medium' ? 'bg-warning' : 'bg-longevity'
                )} />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{opt.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>

      {/* Order Button */}
      <Button className="w-full gap-2" size="lg">
        <ShoppingCart size={18} />
        Order from Supplier
        <ExternalLink size={14} />
      </Button>

      {/* Active Cycles Summary */}
      {cycles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Active Cycles</h3>
          <div className="space-y-2">
            {cycles.filter(c => c.status === 'active' || c.status === 'break').map((cycle) => {
              const info = getCycleProgress(cycle);
              return (
                <GradientCard key={cycle.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{cycle.peptideName}</h4>
                      <p className="text-xs text-muted-foreground">{cycle.dose} • {cycle.frequency}</p>
                    </div>
                    <StatusBadge status={cycle.status} />
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        info.isOverdue ? "bg-destructive" : info.isNearing ? "bg-yellow-500" : "bg-primary"
                      )}
                      style={{ width: `${Math.min(info.progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Day {info.daysElapsed}/{cycle.plannedDuration} • {cycle.breakDuration}d break after
                  </p>
                </GradientCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Disclaimer */}
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Research Use Only:</strong> All peptides mentioned are for 
          research purposes. Consult healthcare professionals before use. Monitor bloodwork regularly.
        </p>
      </div>

      {/* Edit Stack Modal */}
      <EditStackModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentStack={activeStack}
        onSave={handleSaveStack}
      />
    </div>
  );
}
