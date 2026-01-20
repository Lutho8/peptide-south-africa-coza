import { Syringe, BarChart3, Calendar, Database, Activity, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onDoseTracker: () => void;
  onBodyStats: () => void;
  onCycles: () => void;
  onPeptides: () => void;
  onBloodwork: () => void;
  onInventory: () => void;
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
  { 
    id: 'bloodwork', 
    icon: Activity, 
    label: 'Bloodwork',
    gradient: 'from-pink-600 to-rose-700',
    onClick: 'onBloodwork'
  },
  { 
    id: 'inventory', 
    icon: Package, 
    label: 'Inventory',
    gradient: 'from-amber-600 to-orange-700',
    onClick: 'onInventory'
  },
];

export function QuickActions({ 
  onDoseTracker, 
  onBodyStats, 
  onCycles, 
  onPeptides,
  onBloodwork,
  onInventory 
}: QuickActionsProps) {
  const handlers: Record<string, () => void> = {
    onDoseTracker,
    onBodyStats,
    onCycles,
    onPeptides,
    onBloodwork,
    onInventory
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={handlers[action.onClick]}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br text-white",
              "hover:scale-[1.02] hover:shadow-lg transition-all duration-200",
              action.gradient
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon size={20} />
            </div>
            <span className="font-medium text-xs text-center">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
