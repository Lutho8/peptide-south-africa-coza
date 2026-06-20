import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ChevronRight,
  Package,
  TrendingDown,
  Thermometer,
  Beaker,
} from 'lucide-react';

export interface Vial {
  id: string;
  peptide: string;
  concentrationMg: number; // mg per mL
  volumeMl: number;
  dosesRemaining: number;
  totalDoses: number;
  reconstitutedDate?: string; // ISO date
  expiresAt: string; // ISO date
  storage: 'fridge' | 'freezer' | 'room';
  status: 'active' | 'empty' | 'expired' | 'degraded';
  notes?: string;
  lotNumber?: string;
}

interface InventoryPanelProps {
  vials: Vial[];
  onAddVial?: () => void;
  onVialClick?: (vialId: string) => void;
  onLogDose?: (vialId: string) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  vials,
  onAddVial,
  onVialClick,
  onLogDose,
}) => {
  const activeVials = useMemo(() => vials.filter((v) => v.status === 'active'), [vials]);
  const expiringSoon = useMemo(
    () =>
      activeVials.filter((v) => {
        const daysUntilExpiry =
          (new Date(v.expiresAt).getTime() - Date.now()) / 86400000;
        return daysUntilExpiry <= 14 && daysUntilExpiry > 0;
      }),
    [activeVials]
  );
  const lowDose = useMemo(
    () => activeVials.filter((v) => v.dosesRemaining < 5),
    [activeVials]
  );
  const degraded = useMemo(
    () =>
      activeVials.filter((v) => {
        if (!v.reconstitutedDate) return false;
        const daysSinceRecon =
          (Date.now() - new Date(v.reconstitutedDate).getTime()) / 86400000;
        return daysSinceRecon > 21;
      }),
    [activeVials]
  );

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{activeVials.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Expiring</span>
            </div>
            <span className={cn('text-2xl font-bold', expiringSoon.length > 0 ? 'text-amber-500' : 'text-foreground')}>
              {expiringSoon.length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Low Dose</span>
            </div>
            <span className={cn('text-2xl font-bold', lowDose.length > 0 ? 'text-red-500' : 'text-foreground')}>
              {lowDose.length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Degraded</span>
            </div>
            <span className={cn('text-2xl font-bold', degraded.length > 0 ? 'text-orange-500' : 'text-foreground')}>
              {degraded.length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Vial List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Vial Inventory
              </CardTitle>
              <CardDescription className="text-xs">
                {activeVials.length} active vial{activeVials.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            {onAddVial && (
              <Button size="sm" variant="outline" onClick={onAddVial}>
                <Plus className="h-4 w-4 mr-1" />
                Add Vial
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[360px]">
            {activeVials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Beaker className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No active vials</p>
                {onAddVial && (
                  <Button variant="outline" size="sm" className="mt-3" onClick={onAddVial}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first vial
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeVials.map((vial, i) => {
                  const pctRemaining = (vial.dosesRemaining / vial.totalDoses) * 100;
                  const daysUntilExpiry = Math.floor(
                    (new Date(vial.expiresAt).getTime() - Date.now()) / 86400000
                  );
                  const daysSinceRecon = vial.reconstitutedDate
                    ? Math.floor((Date.now() - new Date(vial.reconstitutedDate).getTime()) / 86400000)
                    : null;

                  const isExpiringSoon = daysUntilExpiry <= 14;
                  const isLowDose = vial.dosesRemaining < 5;
                  const isDegraded = daysSinceRecon !== null && daysSinceRecon > 21;

                  return (
                    <motion.div
                      key={vial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
                        isExpiringSoon || isLowDose || isDegraded
                          ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900'
                          : 'border-border bg-card hover:bg-muted/30'
                      )}
                      onClick={() => onVialClick?.(vial.id)}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FlaskConical
                            className={cn(
                              'h-4 w-4',
                              isLowDose ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-primary'
                            )}
                          />
                          <span className="text-sm font-semibold text-foreground">{vial.peptide}</span>
                          {vial.concentrationMg > 0 && (
                            <Badge variant="outline" className="text-[9px]">
                              {vial.concentrationMg}mg/mL
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>

                      {/* Progress */}
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">
                            {vial.dosesRemaining} of {vial.totalDoses} doses remaining
                          </span>
                          <span
                            className={cn(
                              'font-medium',
                              pctRemaining > 50
                                ? 'text-emerald-600'
                                : pctRemaining > 20
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                            )}
                          >
                            {pctRemaining.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={pctRemaining}
                          className={cn(
                            'h-1.5',
                            pctRemaining <= 20 && '[&>div]:bg-red-500',
                            pctRemaining > 20 && pctRemaining <= 50 && '[&>div]:bg-amber-500'
                          )}
                        />
                      </div>

                      {/* Alerts and meta */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isExpiringSoon && (
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 gap-1"
                          >
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Expires in {daysUntilExpiry}d
                          </Badge>
                        )}
                        {isLowDose && (
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-red-50 text-red-600 border-red-200 gap-1"
                          >
                            <TrendingDown className="h-2.5 w-2.5" />
                            {vial.dosesRemaining} doses left
                          </Badge>
                        )}
                        {isDegraded && (
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-orange-50 text-orange-600 border-orange-200 gap-1"
                          >
                            <Thermometer className="h-2.5 w-2.5" />
                            {daysSinceRecon}d since reconstitution
                          </Badge>
                        )}
                        {!isExpiringSoon && !isLowDose && !isDegraded && (
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-emerald-50 text-emerald-600 border-emerald-200 gap-1"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Good
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[9px] ml-auto capitalize">
                          {vial.storage}
                        </Badge>
                      </div>

                      {/* Log dose button */}
                      {onLogDose && vial.dosesRemaining > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLogDose(vial.id);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Log Dose
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

InventoryPanel.displayName = 'InventoryPanel';
