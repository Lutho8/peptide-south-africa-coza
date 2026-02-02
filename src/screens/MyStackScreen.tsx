import { useState, useEffect } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { userProfile, stackOptimizations, activeCycles } from '@/data/userData';
import { peptides } from '@/data/peptides';
import { ChevronDown, ChevronUp, Sparkles, ShoppingCart, AlertTriangle, ExternalLink, Edit2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EditStackModal, StackItem } from '@/components/modals/EditStackModal';
import { getActiveStack, saveActiveStack, getUserProfile } from '@/services/storage';
import { AIAgentPanel } from '@/components/ai/AIAgentPanel';

interface StackItemProps {
  peptide: typeof peptides[0];
  dose: string;
  frequency: string;
}

function StackItemCard({ peptide, dose, frequency }: StackItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <GradientCard className="mb-3">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CategoryBadge category={peptide.category} showCount={false} size="sm" />
              <div className="text-left">
                <h4 className="font-semibold text-foreground">{peptide.name}</h4>
                <p className="text-sm text-muted-foreground">{dose} • {frequency}</p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Expected Results Timeline */}
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

            {/* Top Athlete Benefits */}
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

            {/* Risks */}
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
          </div>
        </CollapsibleContent>
      </GradientCard>
    </Collapsible>
  );
}

export function MyStackScreen() {
  const [activeStack, setActiveStack] = useState<StackItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profile, setProfile] = useState(userProfile);

  useEffect(() => {
    setActiveStack(getActiveStack());
    setProfile(getUserProfile());
  }, []);

  const handleSaveStack = (newStack: StackItem[]) => {
    setActiveStack(newStack);
    saveActiveStack(newStack);
  };

  return (
    <div className="pb-24 space-y-6 fade-in">
      {/* User Profile Header - Luxury */}
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
            const peptide = peptides.find(p => p.id === item.peptideId);
            if (!peptide) return null;
            return (
              <StackItemCard
                key={peptide.id}
                peptide={peptide}
                dose={item.dose}
                frequency={item.frequency}
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
            const peptide = peptides.find(p => p.id === item.peptideId);
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
          const peptide = peptides.find(p => p.id === item.peptideId);
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
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Active Cycles</h3>
        <div className="space-y-2">
          {activeCycles.map((cycle) => (
            <GradientCard key={cycle.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">{cycle.peptideName}</h4>
                  <p className="text-xs text-muted-foreground">{cycle.dose} • {cycle.frequency}</p>
                </div>
                <StatusBadge status={cycle.status} />
              </div>
            </GradientCard>
          ))}
        </div>
      </div>

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
