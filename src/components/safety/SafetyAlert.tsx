/**
 * SafetyAlert Component
 *
 * Displays safety alerts from a SafetyCheckResult with severity-based
 * visual styling. Supports fatal, critical, warning, and info severity
 * levels with appropriate colors, icons, and layout.
 *
 * Usage:
 * ```tsx
 * <SafetyAlert
 *   alerts={safetyCheckResult}
 *   onDismiss={() => setShowAlert(false)}
 * />
 * ```
 */

import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SafetyCheckResult, SeverityLevel } from "@/lib/safety/types";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Pill,
  Stethoscope,
  Clock,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────

export interface SafetyAlertProps {
  /** Safety check results to display */
  alerts: SafetyCheckResult;
  /** Optional callback when user dismisses the alert */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a compact summary or full details */
  variant?: "compact" | "detailed";
}

// ─────────────────────────────────────────────────────────────────
// Severity Configuration
// ─────────────────────────────────────────────────────────────────

interface SeverityConfig {
  icon: React.ElementType;
  containerClass: string;
  titleClass: string;
  textClass: string;
  borderClass: string;
  label: string;
}

const SEVERITY_CONFIG: Record<SeverityLevel, SeverityConfig> = {
  fatal: {
    icon: AlertTriangle,
    containerClass: "bg-[var(--destructive)] text-white",
    titleClass: "text-white font-bold",
    textClass: "text-white/90",
    borderClass: "border-[var(--destructive)]",
    label: "FATAL",
  },
  critical: {
    icon: AlertTriangle,
    containerClass: "bg-red-50 border-red-300",
    titleClass: "text-red-800 font-bold",
    textClass: "text-red-700",
    borderClass: "border-red-300",
    label: "CRITICAL",
  },
  warning: {
    icon: AlertCircle,
    containerClass: "bg-amber-50 border-amber-300",
    titleClass: "text-amber-800 font-semibold",
    textClass: "text-amber-700",
    borderClass: "border-amber-300",
    label: "WARNING",
  },
  info: {
    icon: Info,
    containerClass: "bg-blue-50 border-blue-200",
    titleClass: "text-blue-800 font-medium",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    label: "INFO",
  },
};

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export const SafetyAlert: React.FC<SafetyAlertProps> = ({
  alerts,
  onDismiss,
  className,
  variant = "detailed",
}) => {
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  /**
   * Compute the overall alert configuration based on highest severity.
   */
  const overallConfig = useMemo((): SeverityConfig | null => {
    if (!alerts.highestSeverity) return null;
    return SEVERITY_CONFIG[alerts.highestSeverity];
  }, [alerts.highestSeverity]);

  /**
   * Count total issues across all categories.
   */
  const issueCounts = useMemo(() => {
    const drugCount = alerts.interactions.length;
    const contraCount = alerts.contraindications.length;
    const washoutCount = alerts.washoutViolations.length;
    return { drugCount, contraCount, washoutCount, total: drugCount + contraCount + washoutCount };
  }, [alerts]);

  // If there are no alerts at all, render nothing
  if (issueCounts.total === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-green-200 bg-green-50 p-4",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800">
              No Safety Concerns
            </h3>
            <p className="text-xs text-green-700">
              No interactions, contraindications, or washout violations detected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Compact Variant ─────────────────────────────────────────────
  if (variant === "compact") {
    if (!overallConfig) return null;
    const Icon = overallConfig.icon;

    return (
      <div
        className={cn(
          "relative rounded-lg border p-3 shadow-sm",
          overallConfig.containerClass,
          overallConfig.borderClass,
          className
        )}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider",
                  alerts.highestSeverity === "fatal"
                    ? "bg-white/20 text-white"
                    : alerts.highestSeverity === "critical"
                    ? "bg-red-100 text-red-800"
                    : alerts.highestSeverity === "warning"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                )}
              >
                {overallConfig.label}
              </span>
              <span className="text-xs font-medium">
                {issueCounts.total} issue{issueCounts.total !== 1 ? "s" : ""} found
              </span>
            </div>
            {!alerts.passed && (
              <p className={cn("mt-1 text-xs", overallConfig.textClass)}>
                Administration is not recommended. Review details before proceeding.
              </p>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss safety alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Detailed Variant ────────────────────────────────────────────
  if (!overallConfig) return null;
  const OverallIcon = overallConfig.icon;

  return (
    <div
      className={cn(
        "relative rounded-lg border shadow-sm overflow-hidden",
        overallConfig.containerClass,
        overallConfig.borderClass,
        className
      )}
      role="alert"
      aria-live={alerts.highestSeverity === "fatal" ? "assertive" : "polite"}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            alerts.highestSeverity === "fatal"
              ? "bg-white/20"
              : alerts.highestSeverity === "critical"
              ? "bg-red-100"
              : alerts.highestSeverity === "warning"
              ? "bg-amber-100"
              : "bg-blue-100"
          )}
        >
          <OverallIcon
            className={cn(
              "h-5 w-5",
              alerts.highestSeverity === "fatal"
                ? "text-white"
                : alerts.highestSeverity === "critical"
                ? "text-red-600"
                : alerts.highestSeverity === "warning"
                ? "text-amber-600"
                : "text-blue-600"
            )}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                alerts.highestSeverity === "fatal"
                  ? "bg-white/20 text-white"
                  : alerts.highestSeverity === "critical"
                  ? "bg-red-100 text-red-800"
                  : alerts.highestSeverity === "warning"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              )}
            >
              {overallConfig.label}
            </span>
            {!alerts.passed && (
              <span
                className={cn(
                  "text-xs font-medium",
                  alerts.highestSeverity === "fatal"
                    ? "text-white/80"
                    : "text-red-600"
                )}
              >
                Administration Blocked
              </span>
            )}
          </div>
          <h3 className={cn("mt-1 text-sm", overallConfig.titleClass)}>
            {alerts.highestSeverity === "fatal"
              ? "Absolute Contraindication"
              : alerts.highestSeverity === "critical"
              ? "Critical Safety Concern"
              : alerts.highestSeverity === "warning"
              ? "Safety Warning"
              : "Information Notice"}
          </h3>
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className={cn(
              "shrink-0 rounded p-1 opacity-70 hover:opacity-100 transition-opacity",
              alerts.highestSeverity === "fatal"
                ? "text-white hover:bg-white/10"
                : "hover:bg-black/5"
            )}
            aria-label="Dismiss safety alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Body - Issue List */}
      <div
        className={cn(
          "space-y-2 px-4 pb-4",
          alerts.highestSeverity === "fatal"
            ? ""
            : alerts.highestSeverity === "critical"
            ? ""
            : ""
        )}
      >
        {/* Drug Interactions */}
        {alerts.interactions.map((interaction, idx) => (
          <AlertItem
            key={`drug-${idx}`}
            icon={Pill}
            severity={interaction.severity}
            title={`${interaction.drug} + ${interaction.peptide}`}
            description={interaction.mechanism}
            recommendation={interaction.recommendation}
            source={interaction.source}
          />
        ))}

        {/* Contraindications */}
        {alerts.contraindications.map((contra, idx) => (
          <AlertItem
            key={`contra-${idx}`}
            icon={Stethoscope}
            severity={contra.severity}
            title={contra.condition}
            description={contra.reason}
          />
        ))}

        {/* Washout Violations */}
        {alerts.washoutViolations.map((violation, idx) => (
          <AlertItem
            key={`washout-${idx}`}
            icon={Clock}
            severity="warning"
            title={`Washout Period: ${violation.peptide}`}
            description={`Wait ${formatHours(
              violation.remainingHours
            )} before next dose. Required washout: ${formatHours(
              violation.neededHours
            )}.`}
            recommendation={`Time remaining: ${formatHours(violation.remainingHours)}`}
          />
        ))}
      </div>

      {/* Footer - Summary */}
      <div
        className={cn(
          "border-t px-4 py-2.5 text-xs",
          alerts.highestSeverity === "fatal"
            ? "border-white/20 text-white/70"
            : alerts.highestSeverity === "critical"
            ? "border-red-200 text-red-600"
            : alerts.highestSeverity === "warning"
            ? "border-amber-200 text-amber-700"
            : "border-blue-200 text-blue-600",
          "font-medium"
        )}
      >
        {alerts.passed
          ? "Review warnings above before administration. Consult a healthcare provider if unsure."
          : "This peptide should NOT be administered under current conditions. Seek medical guidance."}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Sub-Component: Individual Alert Item
// ─────────────────────────────────────────────────────────────────

interface AlertItemProps {
  icon: React.ElementType;
  severity: SeverityLevel;
  title: string;
  description: string;
  recommendation?: string;
  source?: string;
}

const AlertItem: React.FC<AlertItemProps> = ({
  icon: Icon,
  severity,
  title,
  description,
  recommendation,
  source,
}) => {
  const config = SEVERITY_CONFIG[severity];

  return (
    <div
      className={cn(
        "rounded-md border p-3",
        severity === "fatal"
          ? "border-white/20 bg-white/10"
          : severity === "critical"
          ? "border-red-200 bg-white"
          : severity === "warning"
          ? "border-amber-200 bg-white"
          : "border-blue-200 bg-white"
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            severity === "fatal"
              ? "text-white"
              : severity === "critical"
              ? "text-red-500"
              : severity === "warning"
              ? "text-amber-500"
              : "text-blue-500"
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </span>
            <SeverityBadge severity={severity} />
          </div>
          <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
            {description}
          </p>
          {recommendation && (
            <p className="mt-1.5 text-xs font-medium text-[var(--foreground)]">
              <span className="text-[var(--primary)]">Recommendation:</span>{" "}
              {recommendation}
            </p>
          )}
          {source && (
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Source: {source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Sub-Component: Severity Badge
// ─────────────────────────────────────────────────────────────────

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const classes: Record<SeverityLevel, string> = {
    fatal:
      "bg-[var(--destructive)] text-white",
    critical: "bg-red-100 text-red-700 border border-red-200",
    warning: "bg-amber-100 text-amber-700 border border-amber-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
        classes[severity]
      )}
    >
      {severity}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────
// Utility: Format hours to human-readable string
// ─────────────────────────────────────────────────────────────────

function formatHours(hours: number): string {
  if (hours >= 24) {
    const days = Math.ceil((hours / 24) * 10) / 10;
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  const rounded = Math.ceil(hours * 10) / 10;
  return `${rounded} hour${rounded !== 1 ? "s" : ""}`;
}

export default SafetyAlert;
