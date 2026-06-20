/**
 * PKPanel - Dashboard Panel for Pharmacokinetic Summary
 *
 * Displays a compact overview of a peptide's PK status:
 * - Mini sparkline (small AreaChart)
 * - Current active concentration badge
 * - Peak timing / steady-state indicator
 * - Next dose suggestion
 * - Key stats in a card layout
 */

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  TrendingUp,
  Clock,
  Pill,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { DoseEvent } from "@/lib/pk/types";
import {
  simulatePK,
  calculateCurrentLevel,
  estimateTimeToSteadyState,
  suggestNextDose,
  formatConcentration,
  formatDuration,
} from "@/lib/pk/engine";
import { getPKParameters, getTherapeuticWindow } from "@/lib/pk/compounds";

interface PKPanelProps {
  peptideId: string;
  doses: DoseEvent[];
  className?: string;
}

export function PKPanel({ peptideId, doses, className }: PKPanelProps) {
  const params = useMemo(() => getPKParameters(peptideId), [peptideId]);
  const therapeutic = useMemo(
    () => getTherapeuticWindow(peptideId),
    [peptideId]
  );

  const result = useMemo(() => {
    if (!params || doses.length === 0) return null;
    return simulatePK(params, doses, {
      timeWindowHours: 168,
      timeStepMinutes: 60,
    });
  }, [params, doses]);

  const currentLevel = useMemo(() => {
    if (!params || doses.length === 0) return 0;
    return calculateCurrentLevel(params, doses);
  }, [params, doses]);

  const nextDoseSuggestion = useMemo(() => {
    if (!params || doses.length === 0) return null;
    return suggestNextDose(params, doses, therapeutic);
  }, [params, doses, therapeutic]);

  const isActive = useMemo(() => {
    if (!therapeutic) return currentLevel > 0.01;
    return currentLevel >= therapeutic.min * 0.5;
  }, [currentLevel, therapeutic]);

  const sparklineData = useMemo(() => {
    if (!result) return [];
    // Downsample for sparkline
    return result.points.filter((_, i) => i % 4 === 0);
  }, [result]);

  const lastDose = useMemo(() => {
    if (doses.length === 0) return null;
    return [...doses].sort((a, b) => a.timeHours - b.timeHours)[
      doses.length - 1
    ];
  }, [doses]);

  const timeSinceLastDose = lastDose ? lastDose.timeHours : 0;

  if (!params) {
    return (
      <Card className={cn("border-destructive/50", className)}>
        <CardContent className="flex items-center gap-2 py-6">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">
            Unknown peptide: &quot;{peptideId}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  if (doses.length === 0) {
    return (
      <Card className={cn("opacity-75", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Pill className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No doses recorded for {params.peptideName}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const steadyStateTime = estimateTimeToSteadyState(params.halfLifeHours);
  const formattedSteadyState = formatDuration(steadyStateTime);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity
              className={cn(
                "h-4 w-4",
                isActive ? "text-emerald-500" : "text-muted-foreground"
              )}
            />
            <CardTitle className="text-sm font-semibold">
              {params.peptideName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "relative flex h-2.5 w-2.5",
                isActive && "animate-pulse"
              )}
            >
              {isActive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  isActive ? "bg-emerald-500" : "bg-muted-foreground"
                )}
              />
            </span>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-[10px] h-5"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini sparkline */}
        <div className="h-[80px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sparklineData}
              margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
            >
              <XAxis dataKey="timeHours" hide />
              <YAxis hide domain={["auto", "auto"]} />
              {result && (
                <ReferenceLine
                  y={result.maxConcentration}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                />
              )}
              <Area
                type="monotone"
                dataKey="concentration"
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeWidth={1.5}
                fill="transparent"
                dot={false}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Current concentration */}
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Current
              </span>
            </div>
            <p className="text-lg font-bold tabular-nums">
              {formatConcentration(currentLevel, params.unit)}
            </p>
          </div>

          {/* Cmax */}
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Peak (Cmax)
              </span>
            </div>
            <p className="text-lg font-bold tabular-nums">
              {result ? formatConcentration(result.maxConcentration, params.unit) : "—"}
            </p>
          </div>

          {/* Time to peak */}
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Tmax
              </span>
            </div>
            <p className="text-sm font-semibold tabular-nums">
              {result ? formatDuration(result.timeToPeak) : "—"}
            </p>
          </div>

          {/* Steady state */}
          <div className="rounded-lg border bg-card p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              {result?.steadyStateReached ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              ) : (
                <Clock className="h-3 w-3 text-muted-foreground" />
              )}
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Steady State
              </span>
            </div>
            <p className="text-sm font-semibold">
              {result?.steadyStateReached ? (
                <span className="text-emerald-600">Reached</span>
              ) : (
                <span className="text-muted-foreground">
                  ~{formattedSteadyState}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Next dose suggestion */}
        {nextDoseSuggestion && (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <Pill className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Next Dose</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextDoseSuggestion.reason}
            </p>
            {nextDoseSuggestion.suggestedTimeHours > timeSinceLastDose && (
              <p className="text-xs font-medium mt-1 tabular-nums">
                In{" "}
                {formatDuration(
                  nextDoseSuggestion.suggestedTimeHours - timeSinceLastDose
                )}
              </p>
            )}
          </div>
        )}

        {/* PK parameters summary */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            t½ {formatDuration(params.halfLifeHours)}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            ka {params.absorptionRateKa}/hr
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            F {(params.bioavailability * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            Vd {params.volumeOfDistribution} L/kg
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default PKPanel;
