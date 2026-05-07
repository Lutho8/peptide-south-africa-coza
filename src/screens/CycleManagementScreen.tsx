import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Pause,
  Play,
  StopCircle,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Cycle,
  getCycles,
  saveCycle,
  updateCycle,
  deleteCycle,
  getActiveStack,
} from '@/services/storage';
import { peptides } from '@/data/peptides';
import { getCycleSuggestion } from '@/data/cycleSuggestions';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';

function daysBetween(start: string, end: Date = new Date()): number {
  const s = new Date(start);
  return Math.floor((end.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

function getEndDate(cycle: Cycle): Date {
  const start = new Date(cycle.startDate);
  return new Date(start.getTime() + cycle.plannedDuration * 24 * 60 * 60 * 1000);
}

function getCycleStatus(cycle: Cycle): {
  label: string;
  tone: string;
  daysElapsed: number;
  daysRemaining: number;
  progress: number;
} {
  const elapsed = Math.max(0, daysBetween(cycle.startDate));
  const remaining = cycle.plannedDuration - elapsed;
  const progress = Math.min(100, (elapsed / cycle.plannedDuration) * 100);

  if (cycle.status === 'completed') {
    return { label: 'Completed', tone: 'bg-muted text-muted-foreground', daysElapsed: elapsed, daysRemaining: 0, progress: 100 };
  }
  if (cycle.status === 'break') {
    return { label: 'On Break', tone: 'bg-amber-500/15 text-amber-500 border-amber-500/30', daysElapsed: elapsed, daysRemaining: remaining, progress };
  }
  if (remaining < 0) {
    return { label: 'Overdue', tone: 'bg-red-500/15 text-red-500 border-red-500/30', daysElapsed: elapsed, daysRemaining: remaining, progress };
  }
  if (remaining <= 7 || progress >= 85) {
    return { label: 'Nearing End', tone: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', daysElapsed: elapsed, daysRemaining: remaining, progress };
  }
  return { label: 'Active', tone: 'bg-primary/15 text-primary border-primary/30', daysElapsed: elapsed, daysRemaining: remaining, progress };
}

export default function CycleManagementScreen() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCycle, setNewCycle] = useState({
    peptideId: '',
    dose: '',
    frequency: 'Daily',
    startDate: new Date().toISOString().split('T')[0],
    plannedDuration: 56,
  });

  const refresh = () => setCycles(getCycles());

  useEffect(() => {
    refresh();
  }, []);

  const stack = useMemo(() => getActiveStack(), []);
  const stackPeptideOptions = useMemo(() => {
    const fromStack = stack
      .map((s) => peptides.find((p) => p.id === s.peptideId))
      .filter(Boolean) as typeof peptides;
    // include all peptides as fallback options
    const ids = new Set(fromStack.map((p) => p.id));
    const others = peptides.filter((p) => !ids.has(p.id));
    return [...fromStack, ...others];
  }, [stack]);

  const { active, past } = useMemo(() => {
    const a: Cycle[] = [];
    const p: Cycle[] = [];
    cycles.forEach((c) => (c.status === 'completed' ? p.push(c) : a.push(c)));
    a.sort((x, y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime());
    p.sort((x, y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime());
    return { active: a, past: p };
  }, [cycles]);

  const handleStart = () => {
    if (!newCycle.peptideId || !newCycle.dose) {
      toast.error('Pick a peptide and dose');
      return;
    }
    const peptide = peptides.find((p) => p.id === newCycle.peptideId);
    if (!peptide) return;
    const suggestion = getCycleSuggestion(newCycle.peptideId);
    const cycle: Cycle = {
      id: `cycle-${Date.now()}`,
      peptideId: newCycle.peptideId,
      peptideName: peptide.name,
      dose: newCycle.dose,
      frequency: newCycle.frequency,
      startDate: newCycle.startDate,
      plannedDuration: newCycle.plannedDuration,
      breakDuration: suggestion?.protocols?.[0]?.breakDuration ?? 28,
      status: 'active',
    };
    saveCycle(cycle);
    refresh();
    setDialogOpen(false);
    setNewCycle({ ...newCycle, peptideId: '', dose: '' });
    toast.success(`Started ${peptide.shortName} cycle`);
  };

  const handlePause = (cycle: Cycle) => {
    updateCycle({ ...cycle, status: cycle.status === 'break' ? 'active' : 'break' });
    refresh();
    toast.success(cycle.status === 'break' ? 'Cycle resumed' : 'Cycle paused');
  };

  const handleEnd = (cycle: Cycle) => {
    updateCycle({ ...cycle, status: 'completed' });
    refresh();
    toast.success(`Ended ${cycle.peptideName} cycle`);
  };

  const handleDelete = (cycle: Cycle) => {
    if (!confirm(`Delete ${cycle.peptideName} cycle?`)) return;
    deleteCycle(cycle.id);
    refresh();
  };

  const handleRestart = (cycle: Cycle) => {
    const fresh: Cycle = {
      ...cycle,
      id: `cycle-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    saveCycle(fresh);
    refresh();
    toast.success(`Restarted ${cycle.peptideName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Cycle Management | Ride The Tide" description="Manage your peptide cycles — track active runs, view planned end dates, pause, end, or restart cycles." />

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Cycle Management
            </h1>
            <p className="text-[11px] text-muted-foreground">Track and update your active peptide cycles</p>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> New Cycle
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Active Cycles */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Active ({active.length})
          </h2>
          {active.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-3">No active cycles. Start one to begin tracking.</p>
              <Button onClick={() => setDialogOpen(true)} variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> Start First Cycle
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {active.map((c) => (
                <CycleCard
                  key={c.id}
                  cycle={c}
                  onPause={() => handlePause(c)}
                  onEnd={() => handleEnd(c)}
                  onDelete={() => handleDelete(c)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Completed ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map((c) => (
                <CycleCard
                  key={c.id}
                  cycle={c}
                  onRestart={() => handleRestart(c)}
                  onDelete={() => handleDelete(c)}
                  past
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* New Cycle Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start a new cycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider">Peptide</Label>
              <Select
                value={newCycle.peptideId}
                onValueChange={(v) => {
                  const sug = getCycleSuggestion(v)?.protocols?.[0];
                  setNewCycle((s) => ({
                    ...s,
                    peptideId: v,
                    plannedDuration: sug?.cycleDuration ?? s.plannedDuration,
                  }));
                }}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a peptide" />
                </SelectTrigger>
                <SelectContent>
                  {stackPeptideOptions.slice(0, 50).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.shortName} — {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Dose</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. 250mcg"
                  value={newCycle.dose}
                  onChange={(e) => setNewCycle((s) => ({ ...s, dose: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Frequency</Label>
                <Input
                  className="mt-1.5"
                  placeholder="Daily"
                  value={newCycle.frequency}
                  onChange={(e) => setNewCycle((s) => ({ ...s, frequency: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Start Date</Label>
                <Input
                  type="date"
                  className="mt-1.5"
                  value={newCycle.startDate}
                  onChange={(e) => setNewCycle((s) => ({ ...s, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Duration (days)</Label>
                <Input
                  type="number"
                  min={1}
                  className="mt-1.5"
                  value={newCycle.plannedDuration}
                  onChange={(e) =>
                    setNewCycle((s) => ({ ...s, plannedDuration: Number(e.target.value) || 56 }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStart}>Start Cycle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CycleCard({
  cycle,
  onPause,
  onEnd,
  onRestart,
  onDelete,
  past = false,
}: {
  cycle: Cycle;
  onPause?: () => void;
  onEnd?: () => void;
  onRestart?: () => void;
  onDelete?: () => void;
  past?: boolean;
}) {
  const status = getCycleStatus(cycle);
  const endDate = getEndDate(cycle);
  const isActive = !past && (status.label === 'Active' || status.label === 'Nearing End');
  const isAlert = status.label === 'Overdue' || status.label === 'Nearing End';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className={cn(
          'p-4 transition-all',
          isActive && 'border-primary/40 bg-primary/[0.02] shadow-lg shadow-primary/5',
          past && 'opacity-75',
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold truncate">{cycle.peptideName}</h3>
              <Badge variant="outline" className={cn('text-[10px] uppercase tracking-wider', status.tone)}>
                {isAlert && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {cycle.dose} · {cycle.frequency}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete cycle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>
              Day {status.daysElapsed} / {cycle.plannedDuration}
            </span>
            <span>
              {past
                ? 'Completed'
                : status.daysRemaining < 0
                  ? `${Math.abs(status.daysRemaining)}d overdue`
                  : `${status.daysRemaining}d left`}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, status.progress)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                status.label === 'Overdue'
                  ? 'bg-red-500'
                  : status.label === 'Nearing End'
                    ? 'bg-yellow-500'
                    : status.label === 'On Break'
                      ? 'bg-amber-500'
                      : 'bg-primary',
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
          <span>Started {new Date(cycle.startDate).toLocaleDateString()}</span>
          <span>Ends {endDate.toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {!past && onPause && (
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onPause}>
              {cycle.status === 'break' ? (
                <>
                  <Play className="w-3 h-3" /> Resume
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              )}
            </Button>
          )}
          {!past && onEnd && (
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onEnd}>
              <StopCircle className="w-3 h-3" /> End
            </Button>
          )}
          {past && onRestart && (
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onRestart}>
              <Play className="w-3 h-3" /> Restart
            </Button>
          )}
          {!past && (
            <Link to="/reminders/today" className="ml-auto">
              <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-primary">
                <CheckCircle2 className="w-3 h-3" /> Today's doses
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
