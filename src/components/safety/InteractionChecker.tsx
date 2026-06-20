/**
 * InteractionChecker Component
 *
 * Interactive form allowing users to input their medications and select
 * a peptide to check for drug-peptide interactions. Displays results
 * with severity badges and detailed information.
 *
 * Uses shadcn/ui components: Card, Input, Button, Badge, Select
 *
 * Usage:
 * ```tsx
 * <InteractionChecker
 *   onCheck={(drugs, peptide) => console.log(`Checked ${peptide} against ${drugs}`)}
 * />
 * ```
 */

import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DrugPeptideInteraction,
  DrugPeptideInteraction as InteractionType,
  SeverityLevel,
} from "@/lib/safety/types";
import { checkDrugInteractions } from "@/lib/safety/interactions";
import {
  Search,
  Pill,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────

export interface InteractionCheckerProps {
  /** Callback fired when a check is performed */
  onCheck?: (medications: string[], peptideId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Pre-filled medications */
  defaultMedications?: string;
  /** Pre-selected peptide */
  defaultPeptide?: string;
  /** Whether the checker is in a loading state */
  isLoading?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Peptide Options for the Selector
// ─────────────────────────────────────────────────────────────────

interface PeptideGroup {
  label: string;
  peptides: { value: string; label: string }[];
}

const PEPTIDE_GROUPS: PeptideGroup[] = [
  {
    label: "Growth Hormone Axis",
    peptides: [
      { value: "cjc-1295", label: "CJC-1295 (no DAC)" },
      { value: "cjc-1295-dac", label: "CJC-1295 (with DAC)" },
      { value: "ipamorelin", label: "Ipamorelin" },
      { value: "sermorelin", label: "Sermorelin" },
      { value: "tesamorelin", label: "Tesamorelin" },
      { value: "ghrp-2", label: "GHRP-2" },
      { value: "ghrp-6", label: "GHRP-6" },
      { value: "hexarelin", label: "Hexarelin" },
      { value: "igf-1", label: "IGF-1" },
      { value: "mgf", label: "MGF" },
    ],
  },
  {
    label: "GLP-1 / Metabolic",
    peptides: [
      { value: "semaglutide", label: "Semaglutide (Ozempic/Wegovy)" },
      { value: "tirzepatide", label: "Tirzepatide (Mounjaro/Zepbound)" },
      { value: "retatrutide", label: "Retatrutide" },
      { value: "liraglutide", label: "Liraglutide (Victoza/Saxenda)" },
      { value: "dulaglutide", label: "Dulaglutide (Trulicity)" },
      { value: "exenatide", label: "Exenatide (Byetta)" },
      { value: "mots-c", label: "MOTS-c" },
    ],
  },
  {
    label: "Tissue Repair",
    peptides: [
      { value: "bpc-157", label: "BPC-157" },
      { value: "tb-500", label: "TB-500 / Thymosin Beta-4" },
      { value: "ghk-cu", label: "GHK-Cu" },
    ],
  },
  {
    label: "Cognitive / Neural",
    peptides: [
      { value: "semax", label: "Semax" },
      { value: "selank", label: "Selank" },
      { value: "dihexa", label: "Dihexa" },
      { value: "cerebrolysin", label: "Cerebrolysin" },
      { value: "dsip", label: "DSIP" },
      { value: "p21", label: "P21" },
    ],
  },
  {
    label: "Immune / Other",
    peptides: [
      { value: "thymosin-alpha-1", label: "Thymosin Alpha-1" },
      { value: "ll-37", label: "LL-37" },
      { value: "melanotan-ii", label: "Melanotan-II" },
      { value: "pt-141", label: "PT-141 (Bremelanotide)" },
      { value: "epitalon", label: "Epitalon" },
      { value: "kisspeptin", label: "Kisspeptin" },
      { value: "oxytocin", label: "Oxytocin" },
      { value: "vip", label: "VIP" },
      { value: "ace-031", label: "ACE-031" },
      { value: "follistatin", label: "Follistatin" },
    ],
  },
];

// Flatten for easy access
const ALL_PEPTIDES = PEPTIDE_GROUPS.flatMap((g) => g.peptides);

// ─────────────────────────────────────────────────────────────────
// Severity Config for UI
// ─────────────────────────────────────────────────────────────────

const SEVERITY_UI: Record<
  SeverityLevel,
  {
    badge: string;
    icon: React.ElementType;
    border: string;
    bg: string;
  }
> = {
  fatal: {
    badge: "bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]",
    icon: AlertTriangle,
    border: "border-[var(--destructive)]",
    bg: "bg-red-50",
  },
  critical: {
    badge: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    icon: AlertTriangle,
    border: "border-red-300",
    bg: "bg-red-50",
  },
  warning: {
    badge:
      "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
    icon: AlertCircle,
    border: "border-amber-300",
    bg: "bg-amber-50",
  },
  info: {
    badge: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
    icon: Info,
    border: "border-blue-300",
    bg: "bg-blue-50",
  },
};

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export const InteractionChecker: React.FC<InteractionCheckerProps> = ({
  onCheck,
  className,
  defaultMedications = "",
  defaultPeptide = "",
  isLoading = false,
}) => {
  // ── State ──────────────────────────────────────────────────────
  const [medications, setMedications] = useState(defaultMedications);
  const [selectedPeptide, setSelectedPeptide] = useState(defaultPeptide);
  const [results, setResults] = useState<InteractionType[] | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // ── Derived State ──────────────────────────────────────────────
  const medicationsList = useMemo(() => {
    return medications
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  }, [medications]);

  const canCheck = medicationsList.length > 0 && selectedPeptide.length > 0;

  // ── Handlers ───────────────────────────────────────────────────
  const handleCheck = useCallback(() => {
    if (!canCheck) return;

    const interactions = checkDrugInteractions(
      medicationsList,
      selectedPeptide
    );

    setResults(interactions);
    setHasChecked(true);
    setExpandedIndex(null);
    onCheck?.(medicationsList, selectedPeptide);
  }, [canCheck, medicationsList, selectedPeptide, onCheck]);

  const handleClear = useCallback(() => {
    setMedications("");
    setSelectedPeptide("");
    setResults(null);
    setHasChecked(false);
    setExpandedIndex(null);
  }, []);

  const toggleExpand = useCallback(
    (index: number) => {
      setExpandedIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && canCheck) {
        handleCheck();
      }
    },
    [canCheck, handleCheck]
  );

  // ── Sort results by severity ───────────────────────────────────
  const sortedResults = useMemo(() => {
    if (!results) return [];
    const priority: Record<SeverityLevel, number> = {
      fatal: 4,
      critical: 3,
      warning: 2,
      info: 1,
    };
    return [...results].sort(
      (a, b) => priority[b.severity] - priority[a.severity]
    );
  }, [results]);

  // ── Severity counts ────────────────────────────────────────────
  const severityCounts = useMemo(() => {
    const counts: Record<SeverityLevel, number> = {
      fatal: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };
    sortedResults.forEach((r) => {
      counts[r.severity]++;
    });
    return counts;
  }, [sortedResults]);

  // ────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
            <FlaskConical className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Drug-Peptide Interaction Checker
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Enter your medications and select a peptide to check for interactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Medications Input ──────────────────────────────────── */}
        <div className="space-y-1.5">
          <label
            htmlFor="medications-input"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Current Medications
          </label>
          <div className="relative">
            <Pill className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              id="medications-input"
              placeholder="e.g., Metformin, Lisinopril, Atorvastatin (comma-separated)"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 text-sm"
              disabled={isLoading}
            />
          </div>
          <p className="text-[11px] text-[var(--muted)]">
            Separate multiple medications with commas. Generic and brand names are
            both supported.
          </p>

          {/* Quick medication chips */}
          {medicationsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {medicationsList.map((med, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[11px] font-normal"
                >
                  {med}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* ── Peptide Selector ───────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Select Peptide
          </label>
          <Select
            value={selectedPeptide}
            onValueChange={setSelectedPeptide}
            disabled={isLoading}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Choose a peptide to check against..." />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {PEPTIDE_GROUPS.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className="text-xs text-[var(--muted)]">
                    {group.label}
                  </SelectLabel>
                  {group.peptides.map((peptide) => (
                    <SelectItem
                      key={peptide.value}
                      value={peptide.value}
                      className="text-sm"
                    >
                      {peptide.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Action Buttons ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            onClick={handleCheck}
            disabled={!canCheck || isLoading}
            size="sm"
            className="gap-1.5"
          >
            <Search className="h-4 w-4" />
            Check Interactions
          </Button>
          {(medications || selectedPeptide) && (
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>

        {/* ── Results Section ────────────────────────────────────── */}
        {hasChecked && (
          <div className="mt-4 space-y-3">
            {/* Results Header */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <h3 className="text-sm font-semibold">Results</h3>
              {sortedResults.length > 0 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {severityCounts.fatal > 0 && (
                    <Badge className="bg-[var(--destructive)] text-white text-[10px]">
                      {severityCounts.fatal} fatal
                    </Badge>
                  )}
                  {severityCounts.critical > 0 && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px]">
                      {severityCounts.critical} critical
                    </Badge>
                  )}
                  {severityCounts.warning > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px]">
                      {severityCounts.warning} warning
                    </Badge>
                  )}
                  {severityCounts.info > 0 && (
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                      {severityCounts.info} info
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* No Results */}
            {sortedResults.length === 0 && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
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
                <h4 className="mt-2 text-sm font-medium text-green-800">
                  No Interactions Found
                </h4>
                <p className="mt-1 text-xs text-green-700">
                  No known interactions between{" "}
                  <strong>{medicationsList.join(", ")}</strong> and{" "}
                  <strong>
                    {
                      ALL_PEPTIDES.find((p) => p.value === selectedPeptide)
                        ?.label
                    }
                  </strong>
                  . Always consult your healthcare provider before starting any
                  new peptide.
                </p>
              </div>
            )}

            {/* Interaction Cards */}
            {sortedResults.map((interaction, index) => (
              <InteractionResultCard
                key={`${interaction.drug}-${interaction.peptide}-${index}`}
                interaction={interaction}
                isExpanded={expandedIndex === index}
                onToggle={() => toggleExpand(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────
// Sub-Component: Interaction Result Card
// ─────────────────────────────────────────────────────────────────

interface InteractionResultCardProps {
  interaction: DrugPeptideInteraction;
  isExpanded: boolean;
  onToggle: () => void;
}

const InteractionResultCard: React.FC<InteractionResultCardProps> = ({
  interaction,
  isExpanded,
  onToggle,
}) => {
  const ui = SEVERITY_UI[interaction.severity];
  const Icon = ui.icon;

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        ui.border,
        ui.bg,
        isExpanded && "shadow-sm"
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left"
        aria-expanded={isExpanded}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            interaction.severity === "fatal"
              ? "text-[var(--destructive)]"
              : interaction.severity === "critical"
              ? "text-red-600"
              : interaction.severity === "warning"
              ? "text-amber-600"
              : "text-blue-600"
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {interaction.drug}
            </span>
            <span className="text-xs text-[var(--muted)]">+</span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {interaction.peptide}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted)] truncate">
            {interaction.mechanism}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={cn("text-[10px] font-bold uppercase tracking-wider", ui.badge)}
          >
            {interaction.severity}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[var(--muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[var(--border)] px-3 py-3 space-y-2.5">
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Mechanism
            </h5>
            <p className="mt-0.5 text-xs text-[var(--foreground)] leading-relaxed">
              {interaction.mechanism}
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Recommendation
            </h5>
            <p className="mt-0.5 text-xs text-[var(--foreground)] leading-relaxed font-medium">
              {interaction.recommendation}
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-[var(--muted)]">Source:</span>
            <span className="text-[10px] font-medium text-[var(--foreground)]">
              {interaction.source}
            </span>
          </div>

          {interaction.drugClasses && interaction.drugClasses.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-[var(--muted)]">
                Drug classes:
              </span>
              {interaction.drugClasses.map((cls) => (
                <Badge
                  key={cls}
                  variant="outline"
                  className="text-[10px] font-normal"
                >
                  {cls}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;
