/**
 * PKSimulatorPage - Full-Page Pharmacokinetic Simulator
 *
 * A comprehensive PK simulation interface featuring:
 * - Peptide selector with categorized dropdown
 * - Dose input (amount + scheduling)
 * - Time window selector (7d, 14d, 30d, custom)
 * - Full PK curve visualization
 * - Statistics panel (Cmax, Tmax, AUC, steady state, trough)
 * - Dose schedule management (add/remove doses)
 *
 * Uses shadcn/ui components: Card, Select, Input, Button, Tabs, Badge, Label
 * Uses Recharts for visualization via PKCurve component.
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Activity,
  Clock,
  Plus,
  Trash2,
  TrendingUp,
  Pill,
  BarChart3,
  Settings2,
  RotateCcw,
  ChevronDown,
  Download,
  Share2,
  Syringe,
} from "lucide-react";

import type { DoseEvent, AdminRoute } from "@/lib/pk/types";
import {
  simulatePK,
  calculateCurrentLevel,
  estimateTimeToSteadyState,
  formatConcentration,
  formatDuration,
  generateDoseSchedule,
} from "@/lib/pk/engine";
import {
  getPKParameters,
  getTherapeuticWindow,
  getAllPeptides,
  getPeptidesByCategory,
} from "@/lib/pk/compounds";
import { adjustParamsForRoute, ROUTE_LABELS, SUPPORTED_ROUTES } from "@/lib/pk/routes";
import { exportNodeToPng, sharePngBlob } from "@/lib/pk/exportPng";
import { PKCurve } from "./PKCurve";
import { ActiveLevelBadge } from "./ActiveLevelBadge";
import { toast } from "sonner";

/** Pre-built time window presets */
const TIME_WINDOWS = [
  { label: "7 Days", value: "168" },
  { label: "14 Days", value: "336" },
  { label: "30 Days", value: "720" },
];

/** Common dosing schedule templates */
const SCHEDULE_TEMPLATES = [
  { label: "Daily (QD)", frequencyHours: 24 },
  { label: "Twice Daily (BID)", frequencyHours: 12 },
  { label: "3x Daily (TID)", frequencyHours: 8 },
  { label: "Weekly (Q7D)", frequencyHours: 168 },
  { label: "Every 5 Days", frequencyHours: 120 },
  { label: "Every 3 Days", frequencyHours: 72 },
];

export function PKSimulatorPage() {
  const peptidesByCategory = useMemo(() => getPeptidesByCategory(), []);
  const allPeptides = useMemo(() => getAllPeptides(), []);

  // === State ===
  const [selectedPeptideId, setSelectedPeptideId] = useState<string>(
    allPeptides[0]?.peptideId ?? "bpc-157"
  );
  const [doses, setDoses] = useState<DoseEvent[]>([]);
  const [doseAmount, setDoseAmount] = useState<string>("0.5");
  const [doseTime, setDoseTime] = useState<string>("0");
  const [timeWindow, setTimeWindow] = useState<string>("168");
  const [scheduleFreq, setScheduleFreq] = useState<string>("24");
  const [activeTab, setActiveTab] = useState<string>("curve");
  const [route, setRoute] = useState<AdminRoute>("subcutaneous");
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // === Derived state ===
  const baseParams = useMemo(
    () => getPKParameters(selectedPeptideId),
    [selectedPeptideId]
  );
  const params = useMemo(
    () => (baseParams ? adjustParamsForRoute(baseParams, route) : undefined),
    [baseParams, route]
  );
  const therapeutic = useMemo(
    () => getTherapeuticWindow(selectedPeptideId),
    [selectedPeptideId]
  );
  const timeWindowHours = parseInt(timeWindow, 10) || 168;

  const result = useMemo(() => {
    if (!params || doses.length === 0) return null;
    return simulatePK(params, doses, {
      timeWindowHours,
      timeStepMinutes: 30,
    });
  }, [params, doses, timeWindowHours]);

  const currentLevel = useMemo(() => {
    if (!params || doses.length === 0) return 0;
    return calculateCurrentLevel(params, doses);
  }, [params, doses]);

  // === Handlers ===
  const addSingleDose = useCallback(() => {
    const amount = parseFloat(doseAmount);
    const time = parseFloat(doseTime);
    if (isNaN(amount) || amount <= 0) return;
    if (isNaN(time)) return;

    const newDose: DoseEvent = {
      timeHours: time,
      amountMg: amount,
      peptideId: selectedPeptideId,
    };
    setDoses((prev) =>
      [...prev, newDose].sort((a, b) => a.timeHours - b.timeHours)
    );
  }, [doseAmount, doseTime, selectedPeptideId]);

  const addSchedule = useCallback(() => {
    const amount = parseFloat(doseAmount);
    const freq = parseInt(scheduleFreq, 10);
    if (isNaN(amount) || amount <= 0 || isNaN(freq) || freq <= 0) return;

    const scheduleDoses = generateDoseSchedule(
      selectedPeptideId,
      amount,
      freq,
      timeWindowHours
    );
    setDoses((prev) =>
      [...prev, ...scheduleDoses].sort((a, b) => a.timeHours - b.timeHours)
    );
  }, [doseAmount, scheduleFreq, selectedPeptideId, timeWindowHours]);

  const removeDose = useCallback((index: number) => {
    setDoses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearDoses = useCallback(() => {
    setDoses([]);
  }, []);

  const handleExport = useCallback(async () => {
    if (!exportRef.current || !params) return;
    setExporting(true);
    const filename = `pk-${selectedPeptideId}-${route}.png`;
    const blob = await exportNodeToPng(exportRef.current, filename);
    setExporting(false);
    if (blob) toast.success("Chart downloaded");
    else toast.error("Could not export chart");
  }, [params, selectedPeptideId, route]);

  const handleShare = useCallback(async () => {
    if (!exportRef.current || !params) return;
    setExporting(true);
    const filename = `pk-${selectedPeptideId}-${route}.png`;
    const blob = await exportNodeToPng(exportRef.current, filename);
    if (blob) {
      const shared = await sharePngBlob(blob, filename, `${params.peptideName} PK Curve`);
      if (!shared) toast.message("Saved to downloads (share not supported)");
    }
    setExporting(false);
  }, [params, selectedPeptideId, route]);

  const handlePeptideChange = useCallback(
    (id: string) => {
      setSelectedPeptideId(id);
      // Convert existing doses to new peptide (keep times + amounts)
      setDoses((prev) =>
        prev.map((d) => ({ ...d, peptideId: id })).sort((a, b) => a.timeHours - b.timeHours)
      );
    },
    []
  );

  // === Render helpers ===
  const renderDoseList = () => {
    if (doses.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          <Pill className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No doses added yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
        {doses.map((dose, i) => (
          <div
            key={`dose-${i}-${dose.timeHours}`}
            className="flex items-center justify-between rounded-md border bg-card px-3 py-2 group"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[10px] h-5 min-w-[32px] justify-center">
                #{i + 1}
              </Badge>
              <div>
                <p className="text-sm font-medium">
                  {dose.amountMg} mg
                </p>
                <p className="text-[10px] text-muted-foreground">
                  at {formatDuration(dose.timeHours)} ({dose.timeHours.toFixed(1)}h)
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeDose(i)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  if (!params) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive/50">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load peptide database</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            PK Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pharmacokinetic modeling for peptide concentration tracking
          </p>
        </div>
        {doses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <ActiveLevelBadge
              peptideId={selectedPeptideId}
              doses={doses}
              size="md"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={exporting}
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={clearDoses}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Top control bar */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Peptide Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Peptide</Label>
              <Select
                value={selectedPeptideId}
                onValueChange={handlePeptideChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select peptide..." />
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  {Object.entries(peptidesByCategory).map(
                    ([category, peptides]) => (
                      <SelectGroup key={category}>
                        <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {category}
                        </SelectLabel>
                        {peptides.map((p) => (
                          <SelectItem
                            key={p.peptideId}
                            value={p.peptideId}
                            className="text-sm"
                          >
                            {p.peptideName}
                            <span className="ml-2 text-[10px] text-muted-foreground">
                              t½ {formatDuration(p.halfLifeHours)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Time Window */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Time Window</Label>
              <Tabs
                value={timeWindow}
                onValueChange={setTimeWindow}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {TIME_WINDOWS.map((tw) => (
                    <TabsTrigger
                      key={tw.value}
                      value={tw.value}
                      className="text-xs"
                    >
                      {tw.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Admin Route */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Syringe className="h-3 w-3" />
                Route
              </Label>
              <Select value={route} onValueChange={(v) => setRoute(v as AdminRoute)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_ROUTES.map((r) => (
                    <SelectItem key={r} value={r} className="text-sm">
                      {ROUTE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] h-6">
                t½ {formatDuration(params.halfLifeHours)}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-6">
                ka {params.absorptionRateKa}/hr
              </Badge>
              <Badge variant="outline" className="text-[10px] h-6">
                F {(params.bioavailability * 100).toFixed(0)}%
              </Badge>
              <Badge variant="outline" className="text-[10px] h-6">
                Vd {params.volumeOfDistribution} L/kg
              </Badge>
              {therapeutic && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-6 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Therapeutic: {therapeutic.min}-{therapeutic.max} {params.unit}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Add Dose Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Dose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Amount (mg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.01"
                    value={doseAmount}
                    onChange={(e) => setDoseAmount(e.target.value)}
                    placeholder="0.5"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Time (hr)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={doseTime}
                    onChange={(e) => setDoseTime(e.target.value)}
                    placeholder="0"
                    className="h-9"
                  />
                </div>
              </div>
              <Button
                onClick={addSingleDose}
                className="w-full"
                size="sm"
                disabled={!doseAmount || parseFloat(doseAmount) <= 0}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Single Dose
              </Button>

              <Separator />

              {/* Schedule */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Or Add Schedule
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={scheduleFreq}
                    onValueChange={setScheduleFreq}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEDULE_TEMPLATES.map((s) => (
                        <SelectItem
                          key={s.frequencyHours}
                          value={String(s.frequencyHours)}
                          className="text-xs"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSchedule}
                    disabled={!doseAmount || parseFloat(doseAmount) <= 0}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dose List */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  Doses ({doses.length})
                </CardTitle>
                {doses.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-destructive hover:text-destructive text-xs"
                    onClick={clearDoses}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>{renderDoseList()}</CardContent>
          </Card>

          {/* PK Reference */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                PK Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Half-life (t½)</dt>
                  <dd className="font-medium">
                    {formatDuration(params.halfLifeHours)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Absorption rate (ka)
                  </dt>
                  <dd className="font-medium">{params.absorptionRateKa} /hr</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Bioavailability</dt>
                  <dd className="font-medium">
                    {(params.bioavailability * 100).toFixed(0)}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Vol. Distribution (Vd)
                  </dt>
                  <dd className="font-medium">{params.volumeOfDistribution} L/kg</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Time to Peak (Tmax)</dt>
                  <dd className="font-medium">
                    {formatDuration(params.timeToPeakHours)}
                  </dd>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Est. Steady State</dt>
                  <dd className="font-medium">
                    {formatDuration(estimateTimeToSteadyState(params.halfLifeHours))}
                  </dd>
                </div>
                {therapeutic && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Therapeutic Range</dt>
                    <dd className="font-medium text-emerald-600">
                      {therapeutic.min}-{therapeutic.max} {params.unit}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Visualization + Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* PK Curve (wrapped for PNG export) */}
          <div ref={exportRef} className="relative bg-background rounded-lg">
            <PKCurve
              peptideId={selectedPeptideId}
              doses={doses}
              height={420}
              timeWindowHours={timeWindowHours}
              timeStepMinutes={30}
              showTherapeuticWindow={!!therapeutic}
              title={`${params.peptideName} - ${timeWindowHours / 24}-Day Profile`}
              paramsOverride={params}
            />
            <div className="px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground border-t">
              <span>
                Route: {ROUTE_LABELS[route]} • F {(params.bioavailability * 100).toFixed(0)}% • tmax {formatDuration(params.timeToPeakHours)}
              </span>
              <span className="font-medium">Ride The Tide • ridethetide.info</span>
            </div>
          </div>

          {/* Stats Panel */}
          {result && doses.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="curve" className="text-xs">
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  <Activity className="h-3.5 w-3.5 mr-1.5" />
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curve" className="mt-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {/* Cmax */}
                      <StatBox
                        icon={<TrendingUp className="h-3.5 w-3.5" />}
                        label="Cmax"
                        value={formatConcentration(
                          result.maxConcentration,
                          params.unit
                        )}
                        sub={`at ${formatDuration(result.timeToPeak)}`}
                      />
                      {/* Tmax */}
                      <StatBox
                        icon={<Clock className="h-3.5 w-3.5" />}
                        label="Tmax"
                        value={formatDuration(result.timeToPeak)}
                        sub="time to peak"
                      />
                      {/* AUC */}
                      <StatBox
                        icon={<BarChart3 className="h-3.5 w-3.5" />}
                        label="AUC"
                        value={`${result.auc.toFixed(0)}`}
                        sub={`${params.unit}·hr`}
                      />
                      {/* Current */}
                      <StatBox
                        icon={<Activity className="h-3.5 w-3.5" />}
                        label="Current"
                        value={formatConcentration(
                          result.estimatedCurrentLevel,
                          params.unit
                        )}
                        sub="at end"
                      />
                      {/* Trough */}
                      <StatBox
                        icon={<ChevronDown className="h-3.5 w-3.5" />}
                        label="Trough"
                        value={formatConcentration(
                          result.troughConcentration,
                          params.unit
                        )}
                        sub="pre-dose min"
                      />
                      {/* Steady State */}
                      <StatBox
                        icon={<TrendingUp className="h-3.5 w-3.5" />}
                        label="Steady State"
                        value={result.steadyStateReached ? "Yes" : "No"}
                        sub={
                          result.steadyStateReached
                            ? "achieved"
                            : `~${formatDuration(
                                estimateTimeToSteadyState(params.halfLifeHours)
                              )}`
                        }
                        highlight={result.steadyStateReached}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          Dosing Summary
                        </h4>
                        <dl className="space-y-1">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              Total Doses
                            </dt>
                            <dd>{doses.length}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              Total Amount
                            </dt>
                            <dd>
                              {doses
                                .reduce((s, d) => s + d.amountMg, 0)
                                .toFixed(1)}{" "}
                              mg
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              First Dose
                            </dt>
                            <dd>
                              {doses.length > 0
                                ? formatDuration(doses[0].timeHours)
                                : "—"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              Last Dose
                            </dt>
                            <dd>
                              {doses.length > 0
                                ? formatDuration(
                                    doses[doses.length - 1].timeHours
                                  )
                                : "—"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Concentration Summary
                        </h4>
                        <dl className="space-y-1">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Peak</dt>
                            <dd className="font-medium">
                              {formatConcentration(
                                result.maxConcentration,
                                params.unit
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Current</dt>
                            <dd className="font-medium">
                              {formatConcentration(
                                result.estimatedCurrentLevel,
                                params.unit
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Trough</dt>
                            <dd className="font-medium">
                              {formatConcentration(
                                result.troughConcentration,
                                params.unit
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                              AUC (0-{timeWindowHours}h)
                            </dt>
                            <dd className="font-medium">
                              {result.auc.toFixed(0)} {params.unit}·hr
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

// === Sub-components ===

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}

function StatBox({ icon, label, value, sub, highlight }: StatBoxProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 text-center",
        highlight && "border-emerald-200 bg-emerald-50/50"
      )}
    >
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-base font-bold tabular-nums truncate",
          highlight && "text-emerald-700"
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
    </div>
  );
}

export default PKSimulatorPage;
