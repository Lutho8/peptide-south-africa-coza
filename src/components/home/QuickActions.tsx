import { Syringe, BarChart3, Calendar, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onDoseTracker: () => void;
  onBodyStats: () => void;
  onCycles: () => void;
  onPeptides: () => void;
}

const actions = [
  { 
    id: 'dose', 
    icon: Syringe, 
    label: 'Dose Tracker',
    gradient: 'from-violet-600 to-purple-700',
    onClick: 'onDoseTracker'
  },
  { 
    id: 'stats', 
    icon: BarChart3, 
    label: 'Body Stats',
    gradient: 'from-emerald-600 to-green-700',
    onClick: 'onBodyStats'
  },
  { 
    id: 'cycles', 
    icon: Calendar, 
    label: 'Cycles',
    gradient: 'from-red-600 to-rose-700',
    onClick: 'onCycles'
  },
  { 
    id: 'peptides', 
    icon: Database, 
    label: 'Peptides',
    gradient: 'from-cyan-600 to-teal-700',
    onClick: 'onPeptides'
  },
];

export function QuickActions({ onDoseTracker, onBodyStats, onCycles, onPeptides }: QuickActionsProps) {
  const handlers: Record<string, () => void> = {
    onDoseTracker,
    onBodyStats,
    onCycles,
    onPeptides
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={handlers[action.onClick]}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br text-white",
              "hover:scale-[1.02] hover:shadow-lg transition-all duration-200",
              action.gradient
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon size={20} />
            </div>
            <span className="font-medium text-sm">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
