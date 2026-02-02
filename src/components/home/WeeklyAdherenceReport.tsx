import { useAdherenceReport } from '@/hooks/useAdherenceReport';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Flame, Bell, Download, Image, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { exportToImage, exportToPDF } from '@/utils/exportReport';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface WeeklyAdherenceReportProps {
  onViewSettings?: () => void;
}

function ProgressRing({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage >= 80) return 'hsl(var(--chart-2))'; // Green
    if (percentage >= 50) return 'hsl(var(--chart-4))'; // Amber
    return 'hsl(var(--destructive))'; // Red
  };
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getColor()}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

function AdherenceBar({ name, percentage }: { name: string; percentage: number }) {
  const getBarColor = () => {
    if (percentage >= 80) return 'bg-chart-2';
    if (percentage >= 50) return 'bg-chart-4';
    return 'bg-destructive';
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium truncate max-w-[150px]">{name}</span>
        <span className={cn(
          "font-medium",
          percentage >= 80 ? "text-chart-2" : percentage >= 50 ? "text-chart-4" : "text-destructive"
        )}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function WeeklyAdherenceReport({ onViewSettings }: WeeklyAdherenceReportProps) {
  const { overall, byPeptide, streak, isLoading, hasReminders } = useAdherenceReport();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'image' | 'pdf') => {
    setIsExporting(true);
    try {
      const filename = `adherence-report-${format(new Date(), 'yyyy-MM-dd')}`;
      if (type === 'image') {
        await exportToImage('adherence-report', filename);
        toast.success('Report saved as image');
      } else {
        await exportToPDF('adherence-report', filename);
        toast.success('Report saved as PDF');
      }
    } catch (error) {
      toast.error('Failed to export report');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  if (isLoading) {
    return (
      <GradientCard className="animate-pulse">
        <div className="h-32 bg-muted/50 rounded" />
      </GradientCard>
    );
  }
  
  // Empty state - no reminders configured
  if (!hasReminders) {
    return (
      <GradientCard>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Weekly Adherence</h3>
        </div>
        
        <div className="text-center py-4">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Set up reminders to track your protocol adherence
          </p>
          {onViewSettings && (
            <Button variant="outline" size="sm" onClick={onViewSettings}>
              Create Reminders
            </Button>
          )}
        </div>
      </GradientCard>
    );
  }
  
  return (
    <GradientCard>
      <div id="adherence-report">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Adherence</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-chart-4/20 rounded-full">
                <Flame className="h-4 w-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">{streak} day{streak !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('image')}>
                  <Image className="h-4 w-4 mr-2" />
                  Save as Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      
      {/* Main content */}
      <div className="flex gap-6">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing percentage={overall.percentage} />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {overall.actual}/{overall.expected} doses
          </p>
        </div>
        
        {/* Peptide breakdown */}
        <div className="flex-1 space-y-3 min-w-0">
          {byPeptide.slice(0, 4).map((peptide) => (
            <AdherenceBar 
              key={peptide.peptideId} 
              name={peptide.peptideName} 
              percentage={peptide.percentage} 
            />
          ))}
          
          {byPeptide.length > 4 && (
            <p className="text-xs text-muted-foreground">
              +{byPeptide.length - 4} more peptides
            </p>
          )}
        </div>
      </div>
      
      {/* Footer hint */}
        {overall.percentage < 80 && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Swipe reminders right on the home screen to quickly mark doses as taken
            </p>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
