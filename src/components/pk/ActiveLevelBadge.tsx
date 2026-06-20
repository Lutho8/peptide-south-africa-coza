/**
 * ActiveLevelBadge - Inline Peptide Activity Indicator
 *
 * A compact badge that displays the current concentration level
 * of a peptide with a pulsing activity indicator.
 *
 * - Shows "Active: X ng/mL" with animated green pulse when active
 * - Shows "Cleared" in muted style when below threshold
 * - Optionally calculates level from last dose time and amount
 */

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  calculateCurrentLevel,
  formatConcentration,
} from "@/lib/pk/engine";
import { getPKParameters, getTherapeuticWindow } from "@/lib/pk/compounds";
import type { DoseEvent } from "@/lib/pk/types";

interface ActiveLevelBadgeProps {
  peptideId: string;
  /** If provided, uses these doses to calculate current level */
  doses?: DoseEvent[];
  /** If no doses array, use last dose time + amount to estimate */
  lastDoseTime?: Date;
  lastDoseAmount?: number;
  /** Override: directly provide concentration value */
  concentration?: number;
  /** Whether to show the animated pulse dot */
  showPulse?: boolean;
  /** Visual size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ActiveLevelBadge({
  peptideId,
  doses,
  lastDoseTime,
  lastDoseAmount,
  concentration,
  showPulse = true,
  size = "sm",
  className,
}: ActiveLevelBadgeProps) {
  const params = useMemo(() => getPKParameters(peptideId), [peptideId]);
  const therapeutic = useMemo(
    () => getTherapeuticWindow(peptideId),
    [peptideId]
  );

  const currentLevel = useMemo(() => {
    // Direct value override
    if (concentration !== undefined) return concentration;

    if (!params) return 0;

    // Use doses array
    if (doses && doses.length > 0) {
      return calculateCurrentLevel(params, doses);
    }

    // Calculate from last dose time + amount
    if (lastDoseTime && lastDoseAmount && lastDoseAmount > 0) {
      const now = Date.now();
      const doseMs = lastDoseTime.getTime();
      const elapsedHours = (now - doseMs) / (1000 * 60 * 60);

      if (elapsedHours < 0) return 0;

      // Create a dose event at t=0 and evaluate at elapsed time
      const doseEvent: DoseEvent = {
        timeHours: 0,
        amountMg: lastDoseAmount,
        peptideId,
      };
      return calculateCurrentLevel(params, [doseEvent]);
    }

    return 0;
  }, [params, doses, lastDoseTime, lastDoseAmount, concentration, peptideId]);

  const isActive = useMemo(() => {
    if (!therapeutic) return currentLevel > 0.01;
    return currentLevel >= therapeutic.min * 0.5;
  }, [currentLevel, therapeutic]);

  if (!params) {
    return (
      <Badge
        variant="outline"
        className={cn("text-muted-foreground", className)}
      >
        Unknown
      </Badge>
    );
  }

  const sizeClasses = {
    sm: "text-[10px] h-5 px-1.5 gap-1",
    md: "text-xs h-6 px-2 gap-1.5",
    lg: "text-sm h-7 px-2.5 gap-2",
  };

  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        sizeClasses[size],
        "tabular-nums font-medium inline-flex items-center",
        !isActive && "text-muted-foreground",
        className
      )}
    >
      {showPulse && (
        <span className={cn("relative flex", dotSize[size])}>
          {isActive && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                size === "sm" ? "bg-emerald-300" : "bg-emerald-400"
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full",
              dotSize[size],
              isActive ? "bg-emerald-400" : "bg-muted-foreground/40"
            )}
          />
        </span>
      )}
      <span>
        {isActive
          ? `Active: ${formatConcentration(currentLevel, params.unit)}`
          : "Cleared"}
      </span>
    </Badge>
  );
}

/**
 * A simpler variant that just shows the concentration value without activity status.
 */
interface ConcentrationValueProps {
  value: number;
  unit?: string;
  className?: string;
}

export function ConcentrationValue({
  value,
  unit = "ng/mL",
  className,
}: ConcentrationValueProps) {
  return (
    <span
      className={cn(
        "tabular-nums font-medium",
        value > 0 ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {formatConcentration(value, unit)}
    </span>
  );
}

export default ActiveLevelBadge;
