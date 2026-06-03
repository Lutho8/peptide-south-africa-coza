import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Smile,
  Moon,
  Zap,
  Heart,
  Activity,
  Target,
  X,
  Save,
  SkipForward,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { FeedbackEntry, MetricType } from '@/lib/feedback/types';
import { getAllMetrics } from '@/lib/feedback/metrics';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smile,
  Moon,
  Zap,
  Heart,
  Activity,
  Target,
};

interface FeedbackLoggerProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: FeedbackEntry) => void;
  linkedDoseId?: string;
  peptideId?: string;
}

const metricColors: Record<MetricType, string> = {
  mood: 'bg-amber-500',
  sleep: 'bg-indigo-500',
  energy: 'bg-yellow-500',
  libido: 'bg-rose-500',
  recovery: 'bg-emerald-500',
  focus: 'bg-cyan-500',
  appetite: 'bg-orange-500',
  pain: 'bg-red-500',
};

const metricTrackColors: Record<MetricType, string> = {
  mood: '[&_[role=slider]]:bg-amber-500 [&_.bg-primary]:bg-amber-500',
  sleep: '[&_[role=slider]]:bg-indigo-500 [&_.bg-primary]:bg-indigo-500',
  energy: '[&_[role=slider]]:bg-yellow-500 [&_.bg-primary]:bg-yellow-500',
  libido: '[&_[role=slider]]:bg-rose-500 [&_.bg-primary]:bg-rose-500',
  recovery: '[&_[role=slider]]:bg-emerald-500 [&_.bg-primary]:bg-emerald-500',
  focus: '[&_[role=slider]]:bg-cyan-500 [&_.bg-primary]:bg-cyan-500',
  appetite: '[&_[role=slider]]:bg-orange-500 [&_.bg-primary]:bg-orange-500',
  pain: '[&_[role=slider]]:bg-red-500 [&_.bg-primary]:bg-red-500',
};

function getMetricEmoji(metric: MetricType, value: number): string {
  if (metric === 'mood') {
    if (value <= 3) return '😢';
    if (value <= 5) return '😐';
    if (value <= 7) return '🙂';
    return '😄';
  }
  if (metric === 'sleep') {
    if (value <= 3) return '😫';
    if (value <= 5) return '🥱';
    if (value <= 7) return '😌';
    return '😴';
  }
  if (metric === 'energy') {
    if (value <= 3) return '🔋';
    if (value <= 5) return '⚡';
    if (value <= 7) return '🔋🔋';
    return '🚀';
  }
  if (metric === 'libido') {
    if (value <= 3) return '💔';
    if (value <= 5) return '💙';
    if (value <= 7) return '💖';
    return '🔥';
  }
  if (metric === 'recovery') {
    if (value <= 3) return '🐢';
    if (value <= 5) return '🚶';
    if (value <= 7) return '🏃';
    return '⚡';
  }
  if (metric === 'focus') {
    if (value <= 3) return '🌫️';
    if (value <= 5) return '👀';
    if (value <= 7) return '🎯';
    return '🧠';
  }
  return '';
}

function getTrendIcon(value: number) {
  if (value >= 8) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (value <= 3) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export const FeedbackLogger: React.FC<FeedbackLoggerProps> = ({
  open,
  onClose,
  onSave,
  linkedDoseId,
  peptideId,
}) => {
  const metrics = getAllMetrics().slice(0, 6); // Show 6 primary metrics
  const [values, setValues] = useState<Record<MetricType, number>>({
    mood: 5,
    sleep: 5,
    energy: 5,
    libido: 5,
    recovery: 5,
    focus: 5,
    appetite: 5,
    pain: 5,
  });
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSliderChange = useCallback((metric: MetricType, val: number[]) => {
    setValues((prev) => ({ ...prev, [metric]: val[0] }));
  }, []);

  const handleSave = useCallback(() => {
    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      metrics: { ...values },
      notes: notes.trim() || undefined,
      linkedDoseId,
      peptideId,
    };
    onSave(entry);
    // Reset
    setValues({
      mood: 5,
      sleep: 5,
      energy: 5,
      libido: 5,
      recovery: 5,
      focus: 5,
      appetite: 5,
      pain: 5,
    });
    setNotes('');
    setShowNotes(false);
    onClose();
  }, [values, notes, linkedDoseId, peptideId, onSave, onClose]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] p-0 gap-0 overflow-hidden border-border bg-card">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            How are you feeling?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {peptideId ? `Tracking effects of ${peptideId}` : 'Log your daily bio-feedback'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-4 space-y-6">
            {metrics.map((metric, index) => {
              const Icon = iconMap[metric.icon] ?? Activity;
              const val = values[metric.type];

              return (
                <motion.div
                  key={metric.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'p-1.5 rounded-lg',
                          metric.color.replace('text-', 'bg-').replace('500', '100')
                        )}
                      >
                        <Icon className={cn('h-4 w-4', metric.color)} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {metric.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={val}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="text-lg font-bold tabular-nums"
                        >
                          <span className="text-2xl mr-1">{getMetricEmoji(metric.type, val)}</span>
                          <span className={cn(metric.color)}>{val}</span>
                          <span className="text-muted-foreground text-xs">/10</span>
                        </motion.span>
                      </AnimatePresence>
                      {getTrendIcon(val)}
                    </div>
                  </div>

                  <Slider
                    value={[val]}
                    onValueChange={(v) => handleSliderChange(metric.type, v)}
                    min={1}
                    max={10}
                    step={1}
                    className={cn('w-full cursor-pointer', metricTrackColors[metric.type])}
                  />

                  <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Notes toggle */}
            <AnimatePresence>
              {showNotes ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any observations, side effects, or context..."
                    className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Add notes
                </Button>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            className="flex-1"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

FeedbackLogger.displayName = 'FeedbackLogger';
