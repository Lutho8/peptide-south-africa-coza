/**
 * PKCurve - Pharmacokinetic Concentration-Time Visualization
 *
 * Renders an AreaChart showing serum concentration over time with:
 * - Dose markers (vertical reference lines)
 * - Half-life reference (horizontal dotted line)
 * - Therapeutic window shading
 * - Custom tooltip with concentration details
 * - Responsive design with shadcn Card wrapper
 */

import { useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

import { DoseEvent } from "@/lib/pk/types";
import {
  simulatePK,
  formatConcentration,
  formatDuration,
} from "@/lib/pk/engine";
import { getPKParameters, getTherapeuticWindow } from "@/lib/pk/compounds";

interface PKCurveProps {
  peptideId: string;
  doses: DoseEvent[];
  height?: number;
  showTherapeuticWindow?: boolean;
  timeWindowHours?: number;
  timeStepMinutes?: number;
  className?: string;
  title?: string;
}

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  payload: {
    timeHours: number;
    concentration: number;
    active: boolean;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number;
  unit: string;
}

function CustomTooltip({ active, payload, unit }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0].payload;
  const timeHours = point.timeHours;

  const timeDisplay =
    timeHours >= 24
      ? `${(timeHours / 24).toFixed(1)}d (${timeHours.toFixed(1)}h)`
      : `${timeHours.toFixed(1)}h`;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md text-popover-foreground">
      <p className="text-xs text-muted-foreground mb-1">Time: {timeDisplay}</p>
      <p className="text-sm font-semibold">
        Concentration: {formatConcentration(point.concentration, unit)}
      </p>
      {point.active && (
        <Badge variant="default" className="mt-1 text-[10px] h-5">
          Therapeutic
        </Badge>
      )}
    </div>
  );
}

export function PKCurve({
  peptideId,
  doses,
  height = 400,
  showTherapeuticWindow = true,
  timeWindowHours = 168,
  timeStepMinutes = 30,
  className,
  title,
}: PKCurveProps) {
  const params = useMemo(() => getPKParameters(peptideId), [peptideId]);
  const therapeutic = useMemo(
    () => (showTherapeuticWindow ? getTherapeuticWindow(peptideId) : undefined),
    [peptideId, showTherapeuticWindow]
  );

  const result = useMemo(() => {
    if (!params || doses.length === 0) return null;
    return simulatePK(params, doses, {
      timeWindowHours,
      timeStepMinutes,
    });
  }, [params, doses, timeWindowHours, timeStepMinutes]);

  const formatTimeLabel = useCallback((hours: number): string => {
    if (hours < 24) return `${Math.round(hours)}h`;
    if (hours < 168) return `${(hours / 24).toFixed(0)}d`;
    return `${(hours / 168).toFixed(1)}w`;
  }, []);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.points.map((p) => ({
      ...p,
      timeLabel: formatTimeLabel(p.timeHours),
    }));
  }, [result, formatTimeLabel]);

  const halfLifeY = useMemo(() => {
    if (!result || !params) return undefined;
    // Half-life reference = Cmax / 2
    return result.maxConcentration / 2;
  }, [result, params]);

  const formatXAxis = useCallback(
    (value: number) => formatTimeLabel(value),
    [formatTimeLabel]
  );

  const formatYAxis = useCallback((value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    if (value >= 1) return value.toFixed(0);
    return value.toFixed(2);
  }, []);

  // Dose markers for ReferenceLines
  const doseTimes = useMemo(() => {
    return doses.map((d) => d.timeHours).filter((t) => t >= 0 && t <= timeWindowHours);
  }, [doses, timeWindowHours]);

  if (!params) {
    return (
      <Card className={cn("border-destructive/50", className)}>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-destructive">
            Unknown peptide: &quot;{peptideId}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  if (doses.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-muted-foreground">
            Add doses to visualize PK curve
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-muted-foreground">
            Unable to simulate PK data
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayTitle =
    title ?? `${params.peptideName} Concentration Profile`;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              {displayTitle}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {result.steadyStateReached && (
              <Badge variant="secondary" className="text-[10px]">
                Steady State
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] font-mono">
              t½ = {formatDuration(params.halfLifeHours)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="pkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient
                id="pkGradientActive"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--success, 142 71% 45%))"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--success, 142 71% 45%))"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />

            <XAxis
              dataKey="timeHours"
              type="number"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
              domain={[0, timeWindowHours]}
              label={{
                value: "Time",
                position: "insideBottomRight",
                offset: -5,
                style: {
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
              label={{
                value: `Conc. (${params.unit})`,
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: {
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
            />

            <Tooltip
              content={<CustomTooltip unit={params.unit} />}
            />

            {/* Therapeutic window shading */}
            {therapeutic && (
              <ReferenceArea
                y1={therapeutic.min}
                y2={therapeutic.max}
                fill="hsl(var(--success, 142 71% 45%))"
                fillOpacity={0.08}
                strokeOpacity={0}
              />
            )}

            {/* Dose markers */}
            {doseTimes.map((t, i) => (
              <ReferenceLine
                key={`dose-${i}`}
                x={t}
                stroke="hsl(var(--warning, 38 92% 50%))"
                strokeDasharray="4 2"
                strokeOpacity={0.6}
              />
            ))}

            {/* Half-life reference */}
            {halfLifeY !== undefined && halfLifeY > 0 && (
              <ReferenceLine
                y={halfLifeY}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="6 3"
                strokeOpacity={0.4}
              />
            )}

            {/* Tmax reference */}
            <ReferenceLine
              x={result.timeToPeak}
              stroke="hsl(var(--primary))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: "Cmax",
                position: "top",
                style: {
                  fontSize: 10,
                  fill: "hsl(var(--primary))",
                },
              }}
            />

            <Area
              type="monotone"
              dataKey="concentration"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#pkGradient)"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                fill: "hsl(var(--background))",
              }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 px-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-[hsl(var(--primary))]" />
            <span className="text-[10px] text-muted-foreground">
              Concentration
            </span>
          </div>
          {therapeutic && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[hsl(var(--success,142_71%_45%))] opacity-20 rounded-sm" />
              <span className="text-[10px] text-muted-foreground">
                Therapeutic Window ({therapeutic.min}-{therapeutic.max}{" "}
                {params.unit})
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-[hsl(var(--warning,38_92%_50%))] border-dashed" />
            <span className="text-[10px] text-muted-foreground">Dose</span>
          </div>
          {halfLifeY !== undefined && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[hsl(var(--muted-foreground))] border-dashed opacity-50" />
              <span className="text-[10px] text-muted-foreground">
                ½ Cmax
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PKCurve;
