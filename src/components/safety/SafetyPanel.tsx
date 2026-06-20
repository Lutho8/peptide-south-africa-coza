/**
 * SafetyPanel Component
 *
 * Dashboard card that displays an at-a-glance safety status summary.
 * Shows overall safety state (safe/warning/critical), counts of
 * active alerts, and provides a link to the interaction checker.
 *
 * This component is designed for embedding in a dashboard or overview page.
 *
 * Usage:
 * ```tsx
 * <SafetyPanel
 *   safetyResult={latestCheckResult}
 *   onOpenChecker={() => setShowChecker(true)}
 * />
 * ```
 */

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafetyCheckResult, SeverityLevel } from "@/lib/safety/types";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Pill,
  Stethoscope,
  ChevronRight,
  Activity,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────

export interface SafetyPanelProps {
  /** The most recent safety check result */
  safetyResult: SafetyCheckResult | null;
  /** Callback to open the interaction checker */
  onOpenChecker?: () => void;
  /** Callback to view detailed safety report */
  onViewDetails?: () => void;
  /** Number of peptides currently in active protocols */
  activeProtocolCount?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether the panel is in a loading state */
  isLoading?: boolean;
  /** Compact mode for tight layouts */
  compact?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Severity Configuration
// ─────────────────────────────────────────────────────────────────

interface StatusConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  cardBorder: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  badgeVariant: string;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  safe: {
    icon: ShieldCheck,
    title: "Safety Status: Clear",
    description: "No safety concerns detected",
    cardBorder: "border-green-200",
    cardBg: "bg-white",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badgeVariant: "bg-green-100 text-green-700 border-green-200",
  },
  info: {
    icon: Shield,
    title: "Safety Status: Informational",
    description: "Minor notices available",
    cardBorder: "border-blue-200",
    cardBg: "bg-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeVariant: "bg-blue-100 text-blue-700 border-blue-200",
  },
  warning: {
    icon: ShieldAlert,
    title: "Safety Status: Warning",
    description: "Caution advised",
    cardBorder: "border-amber-200",
    cardBg: "bg-white",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeVariant: "bg-amber-100 text-amber-700 border-amber-200",
  },
  critical: {
    icon: ShieldX,
    title: "Safety Status: Critical",
    description: "Immediate attention required",
    cardBorder: "border-red-200",
    cardBg: "bg-red-50/50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badgeVariant: "bg-red-100 text-red-700 border-red-200",
  },
  fatal: {
    icon: ShieldX,
    title: "Safety Status: Fatal Risk",
    description: "Administration blocked",
    cardBorder: "border-[var(--destructive)]",
    cardBg: "bg-red-50",
    iconBg: "bg-[var(--destructive)]",
    iconColor: "text-white",
    badgeVariant: "bg-[var(--destructive)] text-white",
  },
  unknown: {
    icon: Shield,
    title: "Safety Status: Unknown",
    description: "Run a safety check to see status",
    cardBorder: "border-[var(--border)]",
    cardBg: "bg-white",
    iconBg: "bg-[var(--muted)]/10",
    iconColor: "text-[var(--muted)]",
    badgeVariant: "bg-[var(--muted)]/10 text-[var(--muted)]",
  },
};

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export const SafetyPanel: React.FC<SafetyPanelProps> = ({
  safetyResult,
  onOpenChecker,
  onViewDetails,
  activeProtocolCount = 0,
  className,
  isLoading = false,
  compact = false,
}) => {
  // ── Determine Status ───────────────────────────────────────────
  const statusKey = useMemo((): string => {
    if (!safetyResult) return "unknown";
    if (!safetyResult.highestSeverity) return "safe";
    return safetyResult.highestSeverity;
  }, [safetyResult]);

  const config = STATUS_CONFIGS[statusKey] ?? STATUS_CONFIGS.unknown;
  const StatusIcon = config.icon;

  // ── Count Issues ───────────────────────────────────────────────
  const issueCounts = useMemo(() => {
    if (!safetyResult) {
      return { total: 0, fatal: 0, critical: 0, warning: 0, info: 0, washout: 0 };
    }

    const severityCount = (sev: SeverityLevel) =>
      safetyResult.interactions.filter((i) => i.severity === sev).length +
      safetyResult.contraindications.filter((c) => c.severity === sev).length;

    return {
      total:
        safetyResult.interactions.length +
        safetyResult.contraindications.length +
        safetyResult.washoutViolations.length,
      fatal: severityCount("fatal"),
      critical: severityCount("critical"),
      warning: severityCount("warning"),
      info: severityCount("info"),
      washout: safetyResult.washoutViolations.length,
    };
  }, [safetyResult]);

  // ── Loading State ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <Card
        className={cn(
          "border-[var(--border)] animate-pulse",
          className
        )}
      >
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--muted)]/20" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-[var(--muted)]/20" />
              <div className="h-3 w-48 rounded bg-[var(--muted)]/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Compact Mode ───────────────────────────────────────────────
  if (compact) {
    return (
      <Card
        className={cn(
          "border transition-shadow hover:shadow-sm",
          config.cardBorder,
          config.cardBg,
          className
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              <StatusIcon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {config.title.replace("Safety Status: ", "")}
                </span>
                {issueCounts.total > 0 && (
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] shrink-0", config.badgeVariant)}
                  >
                    {issueCounts.total} alert{issueCounts.total !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] truncate">
                {config.description}
              </p>
            </div>
            {(onOpenChecker || onViewDetails) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 shrink-0 px-2 text-xs"
                onClick={onViewDetails ?? onOpenChecker}
              >
                Details
                <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Full Mode ──────────────────────────────────────────────────
  return (
    <Card
      className={cn(
        "border transition-shadow hover:shadow-sm",
        config.cardBorder,
        config.cardBg,
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              <StatusIcon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Safety Overview
              </CardTitle>
              <p className="text-xs text-[var(--muted)]">
                {activeProtocolCount > 0
                  ? `${activeProtocolCount} active peptide${
                      activeProtocolCount !== 1 ? "s" : ""
                    }`
                  : "No active protocols"}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] font-medium", config.badgeVariant)}
          >
            {statusKey === "unknown"
              ? "Not Checked"
              : statusKey === "safe"
              ? "Clear"
              : statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Status Description */}
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            {config.title}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {config.description}
            {safetyResult &&
              !safetyResult.passed &&
              " This peptide should not be administered without medical consultation."}
          </p>
        </div>

        {/* Alert Breakdown */}
        {safetyResult && issueCounts.total > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Active Alerts
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {/* Drug Interactions */}
              <AlertCountPill
                icon={Pill}
                label="Drug Interactions"
                count={safetyResult.interactions.length}
                severity={getHighestSeverity(safetyResult.interactions.map((i) => i.severity))}
              />

              {/* Contraindications */}
              <AlertCountPill
                icon={Stethoscope}
                label="Contraindications"
                count={safetyResult.contraindications.length}
                severity={getHighestSeverity(
                  safetyResult.contraindications.map((c) => c.severity)
                )}
              />

              {/* Washout Violations */}
              <AlertCountPill
                icon={Clock}
                label="Washout Issues"
                count={safetyResult.washoutViolations.length}
                severity={
                  safetyResult.washoutViolations.length > 0 ? "warning" : null
                }
              />

              {/* Total Summary */}
              <AlertCountPill
                icon={Activity}
                label="Total Issues"
                count={issueCounts.total}
                severity={safetyResult.highestSeverity}
                highlight
              />
            </div>

            {/* Severity Legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              {issueCounts.fatal > 0 && (
                <LegendItem
                  icon={AlertTriangle}
                  count={issueCounts.fatal}
                  label="Fatal"
                  color="text-[var(--destructive)]"
                />
              )}
              {issueCounts.critical > 0 && (
                <LegendItem
                  icon={AlertTriangle}
                  count={issueCounts.critical}
                  label="Critical"
                  color="text-red-600"
                />
              )}
              {issueCounts.warning > 0 && (
                <LegendItem
                  icon={AlertCircle}
                  count={issueCounts.warning}
                  label="Warning"
                  color="text-amber-600"
                />
              )}
              {issueCounts.info > 0 && (
                <LegendItem
                  icon={Info}
                  count={issueCounts.info}
                  label="Info"
                  color="text-blue-600"
                />
              )}
            </div>
          </div>
        )}

        {/* No Alerts State */}
        {safetyResult && issueCounts.total === 0 && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">
                All safety checks passed. No interactions, contraindications, or
                washout violations found.
              </span>
            </div>
          </div>
        )}

        {/* Not Yet Checked State */}
        {!safetyResult && (
          <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--background)] p-4 text-center">
            <Shield className="mx-auto h-8 w-8 text-[var(--muted)]" />
            <p className="mt-2 text-sm text-[var(--foreground)]">
              No Safety Check Run Yet
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Run a safety check on your peptides to see your safety status here.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {onOpenChecker && (
            <Button
              onClick={onOpenChecker}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Pill className="h-3.5 w-3.5" />
              Interaction Checker
            </Button>
          )}
          {onViewDetails && safetyResult && issueCounts.total > 0 && (
            <Button
              onClick={onViewDetails}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              View Details
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// Sub-Component: Alert Count Pill
// ─────────────────────────────────────────────────────────────────

interface AlertCountPillProps {
  icon: React.ElementType;
  label: string;
  count: number;
  severity: SeverityLevel | null;
  highlight?: boolean;
}

const AlertCountPill: React.FC<AlertCountPillProps> = ({
  icon: Icon,
  label,
  count,
  severity,
  highlight = false,
}) => {
  const severityColor = useMemo(() => {
    if (!severity || count === 0) return "text-[var(--muted)]";
    switch (severity) {
      case "fatal":
        return "text-[var(--destructive)]";
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-amber-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-[var(--muted)]";
    }
  }, [severity, count]);

  const bgColor = useMemo(() => {
    if (highlight && count > 0) {
      if (severity === "fatal" || severity === "critical")
        return "bg-red-50 border-red-200";
      if (severity === "warning") return "bg-amber-50 border-amber-200";
      return "bg-blue-50 border-blue-200";
    }
    return "bg-[var(--background)] border-[var(--border)]";
  }, [highlight, count, severity]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2.5 py-2",
        bgColor
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", severityColor)} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[var(--muted)] truncate">{label}</p>
        <p
          className={cn(
            "text-sm font-bold tabular-nums",
            count > 0 ? severityColor : "text-[var(--muted)]"
          )}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Sub-Component: Legend Item
// ─────────────────────────────────────────────────────────────────

interface LegendItemProps {
  icon: React.ElementType;
  count: number;
  label: string;
  color: string;
}

const LegendItem: React.FC<LegendItemProps> = ({
  icon: Icon,
  count,
  label,
  color,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Icon className={cn("h-3 w-3", color)} />
      <span className={cn("text-[11px] font-medium", color)}>
        {count} {label}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Helper: Get highest severity from a list
// ─────────────────────────────────────────────────────────────────

function getHighestSeverity(severities: SeverityLevel[]): SeverityLevel | null {
  if (severities.length === 0) return null;

  const priority: Record<SeverityLevel, number> = {
    fatal: 4,
    critical: 3,
    warning: 2,
    info: 1,
  };

  return severities.reduce((highest, current) =>
    priority[current] > priority[highest] ? current : highest
  );
}

export default SafetyPanel;
