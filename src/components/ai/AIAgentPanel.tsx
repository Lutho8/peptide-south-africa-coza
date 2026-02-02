import { useState } from 'react';
import { Bot, Sparkles, Brain, Zap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { usePeptideAI } from '@/hooks/usePeptideAI';
import { cn } from '@/lib/utils';

interface AIAgentPanelProps {
  peptideId?: string;
  peptideName?: string;
  currentStack?: string[];
  userWeight?: number;
  userBodyFat?: number;
  userGoals?: string[];
  experienceLevel?: string;
  mode?: 'research' | 'recommend' | 'optimize';
}

export function AIAgentPanel({
  peptideId,
  peptideName,
  currentStack = [],
  userWeight,
  userBodyFat,
  userGoals,
  experienceLevel,
  mode = 'research'
}: AIAgentPanelProps) {
  const { isLoading, response, fetchResearch, getRecommendations, optimizeStack, clearResponse } = usePeptideAI();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = async () => {
    if (mode === 'research' && peptideId && peptideName) {
      await fetchResearch(peptideId, peptideName);
    } else if (mode === 'recommend') {
      await getRecommendations({
        weight: userWeight,
        bodyFat: userBodyFat,
        goals: userGoals,
        currentStack,
        experienceLevel
      });
    } else if (mode === 'optimize') {
      await optimizeStack(currentStack, {
        weight: userWeight,
        bodyFat: userBodyFat,
        goals: userGoals,
        experienceLevel
      });
    }
    setIsExpanded(true);
  };

  const getIcon = () => {
    switch (mode) {
      case 'research': return <Brain className="w-5 h-5" />;
      case 'recommend': return <Sparkles className="w-5 h-5" />;
      case 'optimize': return <Zap className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'research': return 'AI Research Agent';
      case 'recommend': return 'AI Recommendations';
      case 'optimize': return 'Stack Optimizer';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'research': return `Analyze ${peptideName || 'Peptide'}`;
      case 'recommend': return 'Get Personalized Recommendations';
      case 'optimize': return 'Optimize My Stack';
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="font-semibold text-foreground mt-4 mb-2">{line.slice(2, -2)}</h4>;
        }
        if (line.startsWith('# ')) {
          return <h3 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h4 key={i} className="font-semibold text-foreground mt-3 mb-2">{line.slice(3)}</h4>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
        }
        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
          return <li key={i} className="text-muted-foreground ml-4 list-decimal">{line.slice(3)}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
      });
  };

  return (
    <GradientCard className="relative overflow-hidden border border-accent/20">
      {/* Luxury glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {getTitle()}
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                {mode === 'research' && 'Latest research & clinical insights'}
                {mode === 'recommend' && 'Personalized protocol suggestions'}
                {mode === 'optimize' && 'Stack synergy analysis'}
              </p>
            </div>
          </div>
          
          {response && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          )}
        </div>

        {/* Action Button */}
        {!response && (
          <Button
            onClick={handleAction}
            disabled={isLoading || (mode === 'research' && !peptideId)}
            className={cn(
              "w-full relative overflow-hidden",
              "bg-gradient-to-r from-accent to-accent/80",
              "hover:from-accent/90 hover:to-accent/70",
              "text-accent-foreground font-medium",
              "border border-accent/30 shadow-lg shadow-accent/20"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                {getIcon()}
                <span className="ml-2">{getButtonText()}</span>
              </>
            )}
          </Button>
        )}

        {/* Response Content */}
        {response && isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50 max-h-[400px] overflow-y-auto scrollbar-hide">
              <div className="prose prose-sm prose-invert max-w-none">
                {formatContent(response)}
              </div>
            </div>
            
            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground/60 italic text-center">
              For research and educational purposes only. Not medical advice.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAction}
                disabled={isLoading}
                className="flex-1 border-accent/30 text-accent hover:bg-accent/10"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh Analysis'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { clearResponse(); setIsExpanded(false); }}
                className="text-muted-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
