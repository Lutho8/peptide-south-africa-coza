import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const STORAGE_PREFIX = 'vialSize:';

export function getStoredVialSize(peptideId: string): number | undefined {
  try {
    const v = localStorage.getItem(STORAGE_PREFIX + peptideId);
    if (!v) return undefined;
    const n = parseFloat(v);
    return isFinite(n) && n > 0 ? n : undefined;
  } catch {
    return undefined;
  }
}

export function setStoredVialSize(peptideId: string, mg: number) {
  try {
    localStorage.setItem(STORAGE_PREFIX + peptideId, String(mg));
  } catch {}
}

export function useSelectedVialSize(peptideId: string, sizes?: number[]): [number | undefined, (mg: number) => void] {
  const [value, setValue] = useState<number | undefined>(() => {
    const stored = getStoredVialSize(peptideId);
    if (stored && (!sizes || sizes.includes(stored))) return stored;
    return sizes?.[0];
  });

  useEffect(() => {
    const stored = getStoredVialSize(peptideId);
    if (stored && (!sizes || sizes.includes(stored))) setValue(stored);
    else if (sizes?.length) setValue(sizes[0]);
  }, [peptideId, sizes?.join(',')]);

  const update = (mg: number) => {
    setValue(mg);
    setStoredVialSize(peptideId, mg);
  };
  return [value, update];
}

interface Props {
  peptideId: string;
  sizes: number[];
  className?: string;
  label?: string;
}

export function VialSizeSelector({ peptideId, sizes, className, label = 'Vial size' }: Props) {
  const [selected, setSelected] = useSelectedVialSize(peptideId, sizes);
  if (!sizes?.length) return null;
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((mg) => {
          const active = selected === mg;
          return (
            <button
              key={mg}
              type="button"
              onClick={() => setSelected(mg)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/40'
              )}
            >
              {mg} mg
            </button>
          );
        })}
      </div>
    </div>
  );
}
