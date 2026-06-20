import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  X,
  ShoppingCart,
  Package,
  Thermometer,
  Info,
  ChevronRight,
} from 'lucide-react';

export interface AlertVial {
  id: string;
  peptide: string;
  dosesRemaining: number;
  expiresAt: string;
  reconstitutedDate?: string;
}

interface ReorderAlertProps {
  vials: AlertVial[];
  onDismiss?: (vialId: string) => void;
  onDismissAll?: () => void;
  onReorder?: (peptide: string) => void;
  className?: string;
}

type AlertType = 'low-dose' | 'expiring' | 'degraded';

interface AlertItem {
  id: string;
  type: AlertType;
  peptide: string;
  message: string;
  severity: 'warning' | 'critical';
  action?: string;
}

export const ReorderAlert: React.FC<ReorderAlertProps> = ({
  vials,
  onDismiss,
  onDismissAll,
  onReorder,
  className,
}) => {
  const alerts = useMemo((): AlertItem[] => {
    const items: AlertItem[] = [];

    for (const vial of vials) {
      // Low dose check
      if (vial.dosesRemaining < 5) {
        items.push({
          id: `${vial.id}-low`,
          type: 'low-dose',
          peptide: vial.peptide,
          message: `${vial.peptide} has only ${vial.dosesRemaining} dose${vial.dosesRemaining !== 1 ? 's' : ''} remaining`,
          severity: vial.dosesRemaining <= 2 ? 'critical' : 'warning',
          action: 'Reorder now',
        });
      }

      // Expiration check
      const daysUntilExpiry = Math.floor(
        (new Date(vial.expiresAt).getTime() - Date.now()) / 86400000
      );
      if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
        items.push({
          id: `${vial.id}-exp`,
          type: 'expiring',
          peptide: vial.peptide,
          message: `${vial.peptide} expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
          severity: daysUntilExpiry <= 7 ? 'critical' : 'warning',
          action: 'Use soon',
        });
      }

      // Reconstitution degradation
      if (vial.reconstitutedDate) {
        const daysSinceRecon = Math.floor(
          (Date.now() - new Date(vial.reconstitutedDate).getTime()) / 86400000
        );
        if (daysSinceRecon > 21) {
          items.push({
            id: `${vial.id}-deg`,
            type: 'degraded',
            peptide: vial.peptide,
            message: `${vial.peptide} was reconstituted ${daysSinceRecon} days ago — potency may be declining`,
            severity: daysSinceRecon > 30 ? 'critical' : 'warning',
            action: 'Consider replacement',
          });
        }
      }
    }

    // Sort: critical first
    return items.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      return 0;
    });
  }, [vials]);

  if (alerts.length === 0) return null;

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn('space-y-2', className)}
      >
        {/* Summary bar when multiple alerts */}
        {alerts.length > 1 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                {alerts.length} alert{alerts.length > 1 ? 's' : ''} requiring attention
                {criticalCount > 0 && (
                  <span className="text-red-600 dark:text-red-400 ml-1">
                    ({criticalCount} critical)
                  </span>
                )}
              </span>
            </div>
            {onDismissAll && (
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onDismissAll}>
                <X className="h-3 w-3 mr-1" />
                Dismiss all
              </Button>
            )}
          </div>
        )}

        {/* Individual alerts */}
        {alerts.map((alert) => (
          <AlertItemComponent
            key={alert.id}
            alert={alert}
            onDismiss={onDismiss ? () => onDismiss(alert.id) : undefined}
            onReorder={onReorder ? () => onReorder(alert.peptide) : undefined}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

const AlertItemComponent: React.FC<{
  alert: AlertItem;
  onDismiss?: () => void;
  onReorder?: () => void;
}> = ({ alert, onDismiss, onReorder }) => {
  const config = {
    'low-dose': {
      icon: TrendingDown,
      variant: 'destructive' as const,
      className: 'border-red-300 bg-red-50 text-red-900 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200',
      iconClass: 'text-red-600',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
    },
    expiring: {
      icon: Clock,
      variant: 'default' as const,
      className: 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200',
      iconClass: 'text-amber-600',
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    degraded: {
      icon: Thermometer,
      variant: 'default' as const,
      className: 'border-orange-300 bg-orange-50 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900 dark:text-orange-200',
      iconClass: 'text-orange-600',
      badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    },
  }[alert.type];

  const Icon = config.icon;

  return (
    <Alert className={cn('relative pr-10', config.className)}>
      <Icon className={cn('h-4 w-4 mt-0.5', config.iconClass)} />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <AlertTitle className="text-sm">{alert.message}</AlertTitle>
          <Badge variant="outline" className={cn('text-[9px]', config.badgeClass)}>
            {alert.severity}
          </Badge>
        </div>
        {alert.action && (
          <AlertDescription className="text-xs mt-1">
            <div className="flex items-center gap-2 mt-1">
              {onReorder && alert.type === 'low-dose' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] bg-background/80 hover:bg-background"
                  onClick={onReorder}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {alert.action}
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              )}
            </div>
          </AlertDescription>
        )}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  );
};

ReorderAlert.displayName = 'ReorderAlert';
