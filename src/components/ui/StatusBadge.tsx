import { cn } from '@/lib/utils';
import { Check, Clock, X, AlertCircle } from 'lucide-react';

type Status = 'pending' | 'taken' | 'skipped' | 'missed' | 'upcoming' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'active' | 'break' | 'completed' | 'verified';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { label: string; className: string; icon?: React.ElementType }> = {
  pending: { 
    label: 'Pending', 
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Clock
  },
  taken: { 
    label: 'Taken', 
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: Check
  },
  skipped: { 
    label: 'Skipped', 
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: X
  },
  missed: { 
    label: 'Missed', 
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: AlertCircle
  },
  upcoming: { 
    label: 'Upcoming', 
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Clock
  },
  'in-stock': { 
    label: 'In Stock', 
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: Check
  },
  'low-stock': { 
    label: 'Low Stock', 
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: AlertCircle
  },
  'out-of-stock': { 
    label: 'Out of Stock', 
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: X
  },
  active: { 
    label: 'Active', 
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: Check
  },
  break: { 
    label: 'Break', 
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Clock
  },
  completed: { 
    label: 'Completed', 
    className: 'bg-muted text-muted-foreground border-border',
    icon: Check
  },
  verified: { 
    label: 'Janoshik Verified', 
    className: 'bg-primary/20 text-primary border-primary/30',
    icon: Check
  }
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      {config.label}
    </span>
  );
}
