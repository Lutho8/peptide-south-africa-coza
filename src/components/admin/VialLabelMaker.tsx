import { useState, useRef } from 'react';
import { Tag, Printer, Copy, Check, Plus, Trash2, Palette, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { peptides } from '@/data/peptides';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

interface VialLabel {
  id: string;
  peptideName: string;
  coaAmount: string;
  bacWater: string;
  concentration: string;
  dosePerInjection: string;
  doseUnit: string;
  units: string;
  cc: string;
  reconDate: string;
  expiryDate: string;
}

type LabelLayout = 'compact' | 'standard' | 'large';
type LabelColorTheme = 'default' | 'blue' | 'green' | 'amber' | 'rose' | 'slate';

const colorThemes: Record<LabelColorTheme, { label: string; border: string; header: string; bg: string; accent: string; printBorder: string; printHeader: string; printBg: string }> = {
  default: { label: 'Default', border: 'border-border', header: 'bg-card', bg: 'bg-card', accent: 'text-primary', printBorder: '#333', printHeader: '#f8f8f8', printBg: '#fff' },
  blue: { label: 'Ocean Blue', border: 'border-blue-400/50', header: 'bg-blue-500/10', bg: 'bg-blue-50/5', accent: 'text-blue-500', printBorder: '#3b82f6', printHeader: '#eff6ff', printBg: '#f8fbff' },
  green: { label: 'Medical Green', border: 'border-emerald-400/50', header: 'bg-emerald-500/10', bg: 'bg-emerald-50/5', accent: 'text-emerald-500', printBorder: '#10b981', printHeader: '#ecfdf5', printBg: '#f8fdfb' },
  amber: { label: 'Warm Amber', border: 'border-amber-400/50', header: 'bg-amber-500/10', bg: 'bg-amber-50/5', accent: 'text-amber-500', printBorder: '#f59e0b', printHeader: '#fffbeb', printBg: '#fffef5' },
  rose: { label: 'Rose', border: 'border-rose-400/50', header: 'bg-rose-500/10', bg: 'bg-rose-50/5', accent: 'text-rose-500', printBorder: '#f43f5e', printHeader: '#fff1f2', printBg: '#fff5f6' },
  slate: { label: 'Dark Slate', border: 'border-slate-400/50', header: 'bg-slate-500/10', bg: 'bg-slate-50/5', accent: 'text-slate-400', printBorder: '#475569', printHeader: '#f1f5f9', printBg: '#f8fafc' },
};

const layoutSizes: Record<LabelLayout, { label: string; width: string; qrSize: number; textSize: string; printWidth: string }> = {
  compact: { label: 'Compact', width: 'max-w-[220px]', qrSize: 48, textSize: 'text-[10px]', printWidth: '220px' },
  standard: { label: 'Standard', width: 'max-w-[300px]', qrSize: 64, textSize: 'text-xs', printWidth: '280px' },
  large: { label: 'Large', width: 'max-w-[380px]', qrSize: 80, textSize: 'text-sm', printWidth: '360px' },
};

/** Build a clean, short QR string that scans reliably */
function buildQrData(label: VialLabel): string {
  return [
    label.peptideName,
    `${label.coaAmount}mg/${label.bacWater}mL`,
    `${label.concentration}mg/mL`,
    `Dose:${label.dosePerInjection}${label.doseUnit}`,
    `Draw:${label.units}u`,
    `Recon:${label.reconDate}`,
    `Exp:${label.expiryDate}`,
  ].join('\n');
}

export default function VialLabelMaker() {
  const [labels, setLabels] = useState<VialLabel[]>([]);
  const [selectedPeptide, setSelectedPeptide] = useState('');
  const [coaAmount, setCoaAmount] = useState('');
  const [bacWater, setBacWater] = useState('');
  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState('mcg');
  const [copied, setCopied] = useState<string | null>(null);
  const [colorTheme, setColorTheme] = useState<LabelColorTheme>('default');
  const [layout, setLayout] = useState<LabelLayout>('standard');
  const printRef = useRef<HTMLDivElement>(null);

  const theme = colorThemes[colorTheme];
  const size = layoutSizes[layout];

  const peptideName = selectedPeptide
    ? peptides.find(p => p.id === selectedPeptide)?.shortName || ''
    : '';

  const handleAddLabel = () => {
    const coa = parseFloat(coaAmount);
    const bac = parseFloat(bacWater);
    const dose = parseFloat(doseAmount);

    if (!peptideName || !coa || !bac || !dose) {
      toast.error('Please fill in all fields');
      return;
    }

    const concentrationMgMl = coa / bac;
    const doseMg = doseUnit === 'mg' ? dose : dose / 1000;
    const volumeMl = doseMg / concentrationMgMl;
    const unitsToDraw = Math.round(volumeMl * 100 * 10) / 10;

    const reconDate = format(new Date(), 'yyyy-MM-dd');
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryDate = format(expiry, 'yyyy-MM-dd');

    const label: VialLabel = {
      id: crypto.randomUUID(),
      peptideName,
      coaAmount: String(coa),
      bacWater: String(bac),
      concentration: concentrationMgMl.toFixed(2),
      dosePerInjection: String(dose),
      doseUnit,
      units: String(unitsToDraw),
      cc: volumeMl.toFixed(2),
      reconDate,
      expiryDate,
    };

    setLabels(prev => [...prev, label]);
    toast.success(`Label created for ${peptideName}`);
  };

  const handleRemoveLabel = (id: string) => {
    setLabels(prev => prev.filter(l => l.id !== id));
  };

  const handleCopyLabel = async (label: VialLabel) => {
    const text = `RTD | ${label.peptideName}\n${label.coaAmount}mg COA / ${label.bacWater}mL BAC\n${label.concentration}mg/mL | ${label.dosePerInjection}${label.doseUnit} = ${label.units}u (${label.cc}cc)\nRecon: ${label.reconDate}\nExp: ${label.expiryDate}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label.id);
      toast.success('Label copied!');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handlePrint = () => {
    if (labels.length === 0) {
      toast.error('No labels to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const labelsHtml = labels.map(label => {
      const qrData = encodeURIComponent(buildQrData(label));
      const qrPx = size.qrSize;
      return `
      <div style="border: 2px solid ${theme.printBorder}; border-radius: 8px; padding: 12px; width: ${size.printWidth}; font-family: monospace; font-size: 11px; page-break-inside: avoid; margin: 8px; background: ${theme.printBg};">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 8px; background: ${theme.printHeader}; margin: -12px -12px 8px; padding: 8px 12px; border-radius: 6px 6px 0 0;">
          <img src="/logo-animated.png" style="width: 24px; height: 24px;" />
          <strong style="font-size: 14px;">RTD — Ride The Tide</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <div style="font-size: ${layout === 'large' ? '18px' : layout === 'compact' ? '13px' : '16px'}; font-weight: bold; margin-bottom: 4px;">${label.peptideName}</div>
            <div>${label.coaAmount}mg COA / ${label.bacWater}mL BAC</div>
            <div>${label.concentration}mg/mL | ${label.dosePerInjection}${label.doseUnit} = ${label.units}u (${label.cc}cc)</div>
            <div style="margin-top: 6px; font-size: 10px; color: #666;">
              Recon: ${label.reconDate}<br/>
              Exp: ${label.expiryDate}
            </div>
          </div>
          <div style="margin-left: 8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=${qrPx * 2}x${qrPx * 2}&data=${qrData}&ecc=M" width="${qrPx}" height="${qrPx}" />
          </div>
        </div>
        <div style="margin-top: 6px; font-size: 9px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 4px;">For Research Purposes Only</div>
      </div>
    `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Vial Labels — Ride The Tide</title></head>
        <body style="display: flex; flex-wrap: wrap; padding: 16px; gap: 8px;">
          ${labelsHtml}
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Label Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Vial Label Maker
          </CardTitle>
          <CardDescription>Create printable labels with RTD branding, QR codes, and reconstitution details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Peptide / COA / BAC inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Peptide</Label>
              <Select value={selectedPeptide} onValueChange={setSelectedPeptide}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select peptide..." />
                </SelectTrigger>
                <SelectContent>
                  {peptides.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.shortName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>COA Amount (mg)</Label>
              <Input type="number" value={coaAmount} onChange={e => setCoaAmount(e.target.value)} placeholder="e.g. 12" className="mt-1" min="0" step="0.1" />
            </div>
            <div>
              <Label>BAC Water (mL)</Label>
              <Input type="number" value={bacWater} onChange={e => setBacWater(e.target.value)} placeholder="e.g. 1.2" className="mt-1" min="0" step="0.1" />
            </div>
          </div>

          {/* Dose / Unit / Create button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Dose per Injection</Label>
              <Input type="number" value={doseAmount} onChange={e => setDoseAmount(e.target.value)} placeholder="e.g. 500" className="mt-1" min="0" />
            </div>
            <div>
              <Label>Dose Unit</Label>
              <Select value={doseUnit} onValueChange={setDoseUnit}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcg">mcg</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLabel} className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Create Label
              </Button>
            </div>
          </div>

          {/* Customization: Color Theme & Layout */}
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Label Customization</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1.5 mb-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Color Theme
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(colorThemes) as LabelColorTheme[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setColorTheme(key)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                        colorTheme === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {colorThemes[key].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1.5">
                  <Layout className="w-3.5 h-3.5" />
                  Label Size
                </Label>
                <div className="flex gap-2">
                  {(Object.keys(layoutSizes) as LabelLayout[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setLayout(key)}
                      className={cn(
                        "flex-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                        layout === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {layoutSizes[key].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Labels */}
      {labels.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Labels ({labels.length})</CardTitle>
              <Button onClick={handlePrint} size="sm">
                <Printer className="w-4 h-4 mr-1" />
                Print All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={printRef} className="flex flex-wrap gap-4">
              {labels.map(label => (
                <div
                  key={label.id}
                  className={cn(
                    "border-2 rounded-lg p-3 font-mono relative group w-full",
                    size.width,
                    size.textSize,
                    theme.border,
                    theme.bg,
                  )}
                >
                  {/* RTD Brand header */}
                  <div className={cn(
                    "flex items-center gap-2 mb-2 pb-2 border-b border-border -mx-3 -mt-3 px-3 pt-3 rounded-t-md",
                    theme.header,
                  )}>
                    <img src="/logo-animated.png" className="w-5 h-5" alt="RTD Logo" />
                    <span className={cn("font-bold text-sm", theme.accent)}>RTD — Ride The Tide</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-bold text-foreground mb-1", layout === 'large' ? 'text-lg' : 'text-base')}>{label.peptideName}</div>
                      <div className="text-muted-foreground">{label.coaAmount}mg COA / {label.bacWater}mL BAC</div>
                      <div className="text-muted-foreground">
                        {label.concentration}mg/mL | {label.dosePerInjection}{label.doseUnit} = {label.units}u ({label.cc}cc)
                      </div>
                      <div className="mt-2 text-[10px] text-muted-foreground">
                        Recon: {label.reconDate}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Exp: {label.expiryDate}
                      </div>
                    </div>
                    {/* QR Code */}
                    <div className="ml-2 shrink-0">
                      <QRCodeSVG
                        value={buildQrData(label)}
                        size={size.qrSize}
                        level="M"
                        bgColor="transparent"
                        fgColor="currentColor"
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mt-2 text-[9px] text-muted-foreground text-center border-t border-border pt-1">
                    For Research Purposes Only
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyLabel(label)}
                      className="p-1 rounded bg-muted hover:bg-accent transition-colors"
                    >
                      {copied === label.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleRemoveLabel(label.id)}
                      className="p-1 rounded bg-muted hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
