import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UnitToggleProps {
  value: 'mcg' | 'mg' | 'IU';
  onChange: (unit: 'mcg' | 'mg' | 'IU') => void;
}

const units: Array<'mcg' | 'mg' | 'IU'> = ['mcg', 'mg', 'IU'];

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="relative flex rounded-lg border border-border bg-muted/50 p-0.5">
      {units.map((unit) => {
        const isActive = value === unit;
        return (
          <button
            key={unit}
            type="button"
            onClick={() => onChange(unit)}
            className={cn(
              "relative z-10 flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="unit-toggle-bg"
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{unit}</span>
          </button>
        );
      })}
    </div>
  );
}
