import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { findBlendData } from '@/data/blendAdapters';

interface Props {
  doseString: string;
  peptideId: string;
}

interface Concentration {
  mgPerMl: number;
  source: string; // human description for tooltip
}

function resolveConcentration(peptideId: string): Concentration | null {
  const blend = findBlendData(peptideId);
  if (blend) {
    const mg = parseFloat(blend.vialSize.match(/([\d.]+)\s*mg/i)?.[1] ?? '');
    const ml = parseFloat(blend.quickstart.reconstitute.match(/([\d.]+)\s*mL/i)?.[1] ?? '');
    if (mg > 0 && ml > 0) {
      return {
        mgPerMl: mg / ml,
        source: `${mg} mg vial + ${ml} mL BAC water = ${(mg / ml).toFixed(2)} mg/mL`,
      };
    }
  }
  // Fallback assumption for non-blend peptides: standard 10 mg / 2 mL = 5 mg/mL
  return { mgPerMl: 5, source: 'Assumes standard 10 mg vial + 2 mL BAC water = 5 mg/mL' };
}

function parseDose(s: string): { value: number; unit: 'ml' | 'mg' | 'iu' | 'units' } | null {
  const m = s.match(/([\d.]+)\s*(ml|mg|iu|units?|u)\b/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!isFinite(value) || value <= 0) return null;
  const raw = m[2].toLowerCase();
  let unit: 'ml' | 'mg' | 'iu' | 'units';
  if (raw === 'ml') unit = 'ml';
  else if (raw === 'mg') unit = 'mg';
  else if (raw === 'iu') unit = 'iu';
  else unit = 'units';
  return { value, unit };
}

export function RecommendedDoseDisplay({ doseString, peptideId }: Props) {
  const enriched = useMemo(() => {
    const parsed = parseDose(doseString);
    if (!parsed) return null;
    if (parsed.unit === 'iu' || parsed.unit === 'units') return null;

    const conc = resolveConcentration(peptideId);
    if (!conc) return null;

    let mL: number;
    let mg: number;
    if (parsed.unit === 'ml') {
      mL = parsed.value;
      mg = mL * conc.mgPerMl;
    } else {
      mg = parsed.value;
      mL = mg / conc.mgPerMl;
    }
    const u40 = mL * 40;
    return {
      mg: mg.toFixed(mg < 1 ? 2 : 1),
      u40: u40.toFixed(1),
      source: conc.source,
    };
  }, [doseString, peptideId]);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span className="text-primary font-medium">{doseString}</span>
      {enriched && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          ≈ {enriched.mg} mg • {enriched.u40} units (U-40)
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex" aria-label="Concentration assumption">
                  <Info size={11} className="text-muted-foreground hover:text-primary transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {enriched.source}. Always verify with your own reconstitution.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      )}
    </div>
  );
}
