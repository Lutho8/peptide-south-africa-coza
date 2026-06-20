import { useAchievements, Achievement } from '@/hooks/useAchievements';
import { GradientCard } from '@/components/ui/GradientCard';
import { Progress } from '@/components/ui/progress';
import { Award, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-3 rounded-xl transition-all",
        achievement.unlocked 
          ? "bg-primary/10 border border-primary/30" 
          : "bg-muted/50 border border-transparent opacity-50"
      )}
    >
      <span className="text-2xl mb-1">
        {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
      </span>
      <span className={cn(
        "text-xs font-medium text-center line-clamp-2",
        achievement.unlocked ? "text-foreground" : "text-muted-foreground"
      )}>
        {achievement.name}
      </span>
      {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
        <div className="w-full mt-2">
          <Progress 
            value={(achievement.progress / achievement.maxProgress) * 100} 
            className="h-1"
          />
          <span className="text-[10px] text-muted-foreground mt-0.5 block text-center">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
      )}
    </div>
  );
}

function AchievementDetailCard({ achievement }: { achievement: Achievement }) {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl transition-all",
        achievement.unlocked 
          ? "bg-primary/10 border border-primary/30" 
          : "bg-muted/30 border border-border"
      )}
    >
      <span className="text-3xl flex-shrink-0">
        {achievement.unlocked ? achievement.icon : '🔒'}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-medium",
          achievement.unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {achievement.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-0.5">
          {achievement.description}
        </p>
        {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
          <div className="mt-2">
            <Progress 
              value={(achievement.progress / achievement.maxProgress) * 100} 
              className="h-2"
            />
            <span className="text-xs text-muted-foreground mt-1 block">
              {achievement.progress}/{achievement.maxProgress}
            </span>
          </div>
        )}
      </div>
      {achievement.unlocked && (
        <span className="text-chart-2 text-xs font-medium">Unlocked!</span>
      )}
    </div>
  );
}

export function AchievementsBadges() {
  const { achievements, unlockedCount, totalCount, progressPercentage } = useAchievements();
  const [showAll, setShowAll] = useState(false);

  // Show only first 6 achievements in the preview
  const displayedAchievements = achievements.slice(0, 6);

  // Group achievements by category for the modal
  const groupedAchievements = {
    streak: achievements.filter(a => a.category === 'streak'),
    adherence: achievements.filter(a => a.category === 'adherence'),
    milestone: achievements.filter(a => a.category === 'milestone'),
    dedication: achievements.filter(a => a.category === 'dedication'),
  };

  return (
    <>
      <GradientCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/20">
              <Award className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
              <p className="text-xs text-muted-foreground">
                {unlockedCount}/{totalCount} unlocked
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Achievement grid preview */}
        <div className="grid grid-cols-3 gap-2">
          {displayedAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </GradientCard>

      {/* Full achievements modal */}
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-md max-h-[85vh] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5 text-chart-4" />
              All Achievements
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                {unlockedCount}/{totalCount}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[65vh] pr-2">
            <div className="space-y-6">
              {/* Streak achievements */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  🔥 Streak Achievements
                </h4>
                <div className="space-y-2">
                  {groupedAchievements.streak.map(a => (
                    <AchievementDetailCard key={a.id} achievement={a} />
                  ))}
                </div>
              </div>

              {/* Adherence achievements */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  📊 Adherence Achievements
                </h4>
                <div className="space-y-2">
                  {groupedAchievements.adherence.map(a => (
                    <AchievementDetailCard key={a.id} achievement={a} />
                  ))}
                </div>
              </div>

              {/* Milestone achievements */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  🏅 Milestone Achievements
                </h4>
                <div className="space-y-2">
                  {groupedAchievements.milestone.map(a => (
                    <AchievementDetailCard key={a.id} achievement={a} />
                  ))}
                </div>
              </div>

              {/* Dedication achievements */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  💪 Dedication Achievements
                </h4>
                <div className="space-y-2">
                  {groupedAchievements.dedication.map(a => (
                    <AchievementDetailCard key={a.id} achievement={a} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
