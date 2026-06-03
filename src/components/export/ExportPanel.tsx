import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
  Database,
  Syringe,
  Activity,
  FlaskConical,
  Droplets,
  ChevronRight,
  Loader2,
  FileCheck,
} from 'lucide-react';

export type ExportDataType = 'doses' | 'protocols' | 'feedback' | 'bloodwork' | 'inventory';

interface ExportPanelProps {
  onExportCSV?: (types: ExportDataType[], dateRange: DateRange) => void;
  onExportPDF?: (types: ExportDataType[], dateRange: DateRange) => void;
  availableDataCounts?: Partial<Record<ExportDataType, number>>;
}

export interface DateRange {
  from?: string; // ISO date
  to?: string; // ISO date
}

const EXPORT_OPTIONS: {
  id: ExportDataType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'doses',
    label: 'Dose Log',
    description: 'All injection records with site, peptide, and amount',
    icon: Syringe,
  },
  {
    id: 'protocols',
    label: 'Protocols',
    description: 'Saved peptide protocols and schedules',
    icon: FlaskConical,
  },
  {
    id: 'feedback',
    label: 'Bio-Feedback',
    description: 'Mood, energy, sleep and other tracked metrics',
    icon: Activity,
  },
  {
    id: 'bloodwork',
    label: 'Bloodwork',
    description: 'Lab results and marker history',
    icon: Droplets,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Vial inventory and usage history',
    icon: Database,
  },
];

const PRESET_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'All time', days: 0 },
];

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onExportCSV,
  onExportPDF,
  availableDataCounts = {},
}) => {
  const [selectedTypes, setSelectedTypes] = useState<ExportDataType[]>(['doses']);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    return { from, to };
  });
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const [completed, setCompleted] = useState<'csv' | 'pdf' | null>(null);

  const toggleType = useCallback((type: ExportDataType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCompleted(null);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedTypes(EXPORT_OPTIONS.map((o) => o.id));
    setCompleted(null);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedTypes([]);
    setCompleted(null);
  }, []);

  const handleExport = useCallback(
    async (format: 'csv' | 'pdf') => {
      if (selectedTypes.length === 0) return;
      setExporting(format);
      setCompleted(null);

      // Simulate export
      await new Promise((r) => setTimeout(r, 1500));

      if (format === 'csv') {
        onExportCSV?.(selectedTypes, dateRange);
        downloadCSV(selectedTypes, dateRange);
      } else {
        onExportPDF?.(selectedTypes, dateRange);
      }

      setExporting(null);
      setCompleted(format);
    },
    [selectedTypes, dateRange, onExportCSV, onExportPDF]
  );

  const applyPreset = useCallback((days: number) => {
    const to = new Date().toISOString().split('T')[0];
    const from = days > 0
      ? new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
      : undefined;
    setDateRange({ from, to });
    setCompleted(null);
  }, []);

  const canExport = selectedTypes.length > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Data
          </CardTitle>
          <CardDescription className="text-sm">
            Download your peptide tracking data in CSV or PDF format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Data</Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Select all
                </button>
                <span className="text-xs text-muted-foreground">|</span>
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {EXPORT_OPTIONS.map((option) => {
                const isSelected = selectedTypes.includes(option.id);
                const count = availableDataCounts[option.id];
                const Icon = option.icon;

                return (
                  <motion.div
                    key={option.id}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    )}
                    onClick={() => toggleType(option.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleType(option.id)}
                      className="mt-0.5"
                    />
                    <div className={cn('p-1.5 rounded-lg', isSelected ? 'bg-primary/10' : 'bg-muted')}>
                      <Icon className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
                          {option.label}
                        </span>
                        {count !== undefined && (
                          <Badge variant="outline" className="text-[9px]">
                            {count} records
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                    <ChevronRight className={cn('h-4 w-4 self-center', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date Range
            </Label>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {PRESET_RANGES.map((preset) => (
                <Button
                  key={preset.days}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => applyPreset(preset.days)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Custom date inputs */}
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] text-muted-foreground">From</Label>
                <input
                  type="date"
                  value={dateRange.from ?? ''}
                  onChange={(e) => {
                    setDateRange((prev) => ({ ...prev, from: e.target.value || undefined }));
                    setCompleted(null);
                  }}
                  className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <span className="text-muted-foreground pt-4">—</span>
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] text-muted-foreground">To</Label>
                <input
                  type="date"
                  value={dateRange.to ?? ''}
                  onChange={(e) => {
                    setDateRange((prev) => ({ ...prev, to: e.target.value || undefined }));
                    setCompleted(null);
                  }}
                  className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Export Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={!canExport || exporting !== null}
                onClick={() => handleExport('csv')}
              >
                {exporting === 'csv' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : completed === 'csv' ? (
                  <FileCheck className="h-4 w-4 mr-2 text-emerald-500" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                {exporting === 'csv' ? 'Exporting...' : completed === 'csv' ? 'Downloaded!' : 'Export CSV'}
              </Button>
              <Button
                className="w-full"
                disabled={!canExport || exporting !== null}
                onClick={() => handleExport('pdf')}
              >
                {exporting === 'pdf' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : completed === 'pdf' ? (
                  <FileCheck className="h-4 w-4 mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {exporting === 'pdf' ? 'Generating...' : completed === 'pdf' ? 'Generated!' : 'Export PDF'}
              </Button>
            </div>

            {!canExport && (
              <p className="text-xs text-center text-muted-foreground">
                Select at least one data type to export
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Summary */}
      {canExport && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {selectedTypes.length} data type{selectedTypes.length !== 1 ? 's' : ''} selected
              </span>
              <span>
                {dateRange.from && dateRange.to
                  ? `${dateRange.from} to ${dateRange.to}`
                  : 'All time'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Client-side CSV generation helper
function downloadCSV(types: ExportDataType[], dateRange: DateRange) {
  const headers: Record<ExportDataType, string> = {
    doses: 'Date,Peptide,Amount,Site,Notes',
    protocols: 'Name,Peptide,Frequency,Dose,Start Date',
    feedback: 'Date,Mood,Sleep,Energy,Libido,Recovery,Focus,Notes',
    bloodwork: 'Date,Marker,Value,Unit,Reference Range',
    inventory: 'Peptide,Concentration,Volume,Doses Remaining,Expires',
  };

  const now = new Date().toISOString().split('T')[0];
  let csvContent = '';

  for (const type of types) {
    csvContent += `\n=== ${type.toUpperCase()} ===\n`;
    csvContent += `${headers[type]}\n`;
    // Mock data rows
    if (type === 'doses') {
      csvContent += `${now},BPC-157,250mcg,Left Abdomen,Post-workout\n`;
      csvContent += `${now},CJC-1295,100mcg,Right Deltoid,Before bed\n`;
    } else if (type === 'feedback') {
      csvContent += `${now},7,8,6,5,7,6,Feeling good overall\n`;
    }
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `peptide-export-${now}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

ExportPanel.displayName = 'ExportPanel';
