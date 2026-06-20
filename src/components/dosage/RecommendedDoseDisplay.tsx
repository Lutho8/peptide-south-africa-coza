import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { parseDose, resolveConcentration, convertDose, SyringeType } from '@/lib/doseMath';
import { getStoredVialSize } from '@/components/peptide/VialSizeSelector';

interface Props {
  doseString: string;
  peptideId: string;
  syringe?: SyringeType;
  vialMg?: number;
  bacWaterMl?: number;
  className?: string;
}

export function RecommendedDoseDisplay({
  doseString,
  peptideId,
  syringe = 'U-40',
  vialMg,
  bacWaterMl,
  className,
}: Props) {
  const enriched = useMemo(() => {
    const parsed = parseDose(doseString);
    if (!parsed) return null;
    const effectiveVial = vialMg ?? getStoredVialSize(peptideId);
    const conc = resolveConcentration(peptideId, effectiveVial, bacWaterMl);
    const out = convertDose(parsed, conc.mgPerMl, syringe);
    if (!out) return null;
    return {
      mg: out.mg.toFixed(out.mg < 1 ? 2 : 1),
      units: out.units.toFixed(1),
      source: conc.source,
    };
  }, [doseString, peptideId, syringe, vialMg, bacWaterMl]);

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 ${className ?? ''}`}>
      <span className="text-primary font-medium">{doseString}</span>
      {enriched && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          ≈ {enriched.mg} mg • {enriched.units} units ({syringe})
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
