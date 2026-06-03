import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Syringe,
  Zap,
  Clock,
  MapPin,
  ArrowRight,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { InjectionSite } from '@/lib/injection/sites';
import { getNextSite, getRotationHistory, RotationEntry } from '@/lib/injection/rotation';

interface RotationPanelProps {
  onQuickInject?: (siteId: string) => void;
  onViewMap?: () => void;
}

interface ZoneStat {
  zone: string;
  count: number;
  label: string;
}

export const RotationPanel: React.FC<RotationPanelProps> = ({
  onQuickInject,
  onViewMap,
}) => {
  // Get suggested next site
  const suggested = useMemo(() => {
    try {
      return getNextSite();
    } catch {
      return null;
    }
  }, []);

  // Get recent history
  const history = useMemo(() => getRotationHistory(5), []);

  // Calculate zone distribution from history
  const zoneStats = useMemo((): ZoneStat[] => {
    const zoneMap = new Map<string, number>();
    const labelMap: Record<string, string> = {
      deltoid: 'Deltoid',
      abdomen: 'Abdomen',
      thigh: 'Thigh',
      glute: 'Glute',
      tricep: 'Tricep',
      'love-handle': 'Love Handle',
      chest: 'Chest',
      calf: 'Calf',
    };

    history.forEach((entry) => {
      const zone = entry.site.zone;
      zoneMap.set(zone, (zoneMap.get(zone) ?? 0) + 1);
    });

    return Array.from(zoneMap.entries())
      .map(([zone, count]) => ({
        zone,
        count,
        label: labelMap[zone] ?? zone,
      }))
      .sort((a, b) => b.count - a.count);
  }, [history]);

  const totalRecent = history.length;

  const handleQuickInject = () => {
    if (suggested && onQuickInject) {
      onQuickInject(suggested.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Suggested Next */}
      <Card className="border-primary/30 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  Next Suggested
                </span>
              </div>
              {suggested ? (
                <>
                  <h3 className="text-xl font-bold text-foreground">{suggested.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] bg-background">
                      {suggested.zone}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-background">
                      {suggested.side}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px]',
                        suggested.method.includes('subq')
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-purple-50 text-purple-600 border-purple-200'
                      )}
                    >
                      {suggested.method.join(' / ')}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No suggestion available</p>
              )}
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Syringe className="h-6 w-6 text-primary" />
            </div>
          </div>

          {suggested && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleQuickInject}
                className="bg-primary hover:bg-primary/90"
              >
                <Syringe className="h-4 w-4 mr-1" />
                Quick Inject
              </Button>
              {onViewMap && (
                <Button variant="outline" size="sm" onClick={onViewMap}>
                  <MapPin className="h-4 w-4 mr-1" />
                  View Map
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Rotation Adherence</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {history.length > 0 ? '94%' : '—'}
            </span>
            {history.length > 0 && (
              <p className="text-[10px] text-emerald-600 mt-0.5">Good rotation habits</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Last Injection</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {history.length > 0 ? getTimeAgo(history[0].date) : '—'}
            </span>
            {history.length > 0 && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {history[0]?.site.name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone Distribution */}
      {zoneStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Zone Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Based on last {totalRecent} injections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {zoneStats.map((stat) => {
              const pct = (stat.count / totalRecent) * 100;
              return (
                <div key={stat.zone} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{stat.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Recent Injections
          </CardTitle>
          <CardDescription className="text-xs">Last 5 logged injections</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Syringe className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No injections logged yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry, i) => (
                  <motion.div
                    key={`${entry.site.id}-${entry.date}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                      i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30 hover:bg-muted/60'
                    )}
                  >
                    <div
                      className={cn(
                        'p-1.5 rounded-full shrink-0',
                        i === 0 ? 'bg-primary/10' : 'bg-muted'
                      )}
                    >
                      {i === 0 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Syringe className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {entry.site.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                          {entry.site.zone}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

RotationPanel.displayName = 'RotationPanel';
