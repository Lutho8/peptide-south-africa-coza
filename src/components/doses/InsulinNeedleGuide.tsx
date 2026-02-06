import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsulinNeedleGuideProps {
  dose: number;
  unit: 'mcg' | 'mg' | 'IU';
  concentration?: number; // mcg per mL (from reconstitution)
}

type SyringeType = 'U40' | 'U50' | 'U100';

interface SyringeConfig {
  name: string;
  unitsPerMl: number;
  totalMl: number;
  color: string;
  description: string;
  tickInterval: number;
  maxUnits: number;
}

const syringeConfigs: Record<SyringeType, SyringeConfig> = {
  U40: {
    name: 'U-40',
    unitsPerMl: 40,
    totalMl: 1,
    color: 'text-orange-500',
    description: 'Best for precise small doses. Each unit = 0.025mL',
    tickInterval: 4,
    maxUnits: 40,
  },
  U50: {
    name: 'U-50',
    unitsPerMl: 50,
    totalMl: 0.5,
    color: 'text-cyan-500',
    description: 'Good for medium doses. Each unit = 0.02mL',
    tickInterval: 5,
    maxUnits: 50,
  },
  U100: {
    name: 'U-100',
    unitsPerMl: 100,
    totalMl: 1,
    color: 'text-violet-500',
    description: 'Standard insulin syringe. Each unit = 0.01mL',
    tickInterval: 10,
    maxUnits: 100,
  },
};

// Visual syringe component with animated fill
function SyringeVisual({ 
  syringeType, 
  unitsToDraw,
  isActive 
}: { 
  syringeType: SyringeType; 
  unitsToDraw: number;
  isActive: boolean;
}) {
  const config = syringeConfigs[syringeType];
  const fillPercent = Math.min((unitsToDraw / config.maxUnits) * 100, 100);
  const roundedUnits = Math.round(unitsToDraw * 10) / 10;
  
  return (
    <motion.div 
      className={cn(
        "flex flex-col items-center p-3 rounded-lg border transition-all",
        isActive 
          ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
          : "border-border bg-muted/30"
      )}
      whileHover={{ scale: 1.02 }}
    >
      {/* Syringe Label */}
      <div className={cn("text-sm font-bold mb-1", config.color)}>
        {config.name}
      </div>
      
      {/* Visual Syringe - Enhanced */}
      <div className="relative w-10 h-32 mb-2">
        {/* Plunger rod */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-1 bg-muted-foreground/40 rounded-full"
          style={{ top: 0 }}
          initial={{ height: '100%' }}
          animate={{ height: `${Math.max(100 - fillPercent, 15)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Plunger handle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-muted-foreground/30 rounded-sm border border-border" />
        
        {/* Syringe barrel */}
        <div className="absolute inset-x-0 bottom-4 h-24 bg-background rounded-sm border-2 border-muted-foreground/30 overflow-hidden">
          {/* Graduation marks */}
          {[0.2, 0.4, 0.6, 0.8].map((pos) => (
            <div 
              key={pos}
              className="absolute left-0 w-2 border-t border-muted-foreground/40"
              style={{ bottom: `${pos * 100}%` }}
            />
          ))}
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((pos) => (
            <div 
              key={pos}
              className="absolute left-0 w-1 border-t border-muted-foreground/20"
              style={{ bottom: `${pos * 100}%` }}
            />
          ))}
          
          {/* Liquid fill with animated wave */}
          <motion.div 
            className={cn(
              "absolute bottom-0 left-0 right-0 rounded-b-sm overflow-hidden",
              isActive ? "bg-primary/30" : "bg-muted-foreground/15"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${fillPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Animated wave on top of liquid */}
            {isActive && fillPercent > 5 && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)`,
                  borderRadius: '50%',
                }}
                animate={{
                  x: [-2, 2, -2],
                  scaleY: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>

          {/* Fill line indicator */}
          {isActive && fillPercent > 0 && fillPercent < 100 && (
            <motion.div
              className="absolute left-0 right-0 border-t-2 border-primary border-dashed"
              initial={{ bottom: 0 }}
              animate={{ bottom: `${fillPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </div>
        
        {/* Needle hub */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-2 bg-muted-foreground/40 rounded-sm" />
        
        {/* Needle */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 bg-muted-foreground/60" />
      </div>
      
      {/* Units to draw */}
      <motion.div 
        className={cn(
          "text-lg font-bold",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
        key={roundedUnits}
        initial={{ scale: 1.2, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {roundedUnits} units
      </motion.div>
      <div className="text-[10px] text-muted-foreground text-center">
        ({(unitsToDraw / config.unitsPerMl).toFixed(3)} mL)
      </div>
    </motion.div>
  );
}

export function InsulinNeedleGuide({ dose, unit, concentration }: InsulinNeedleGuideProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSyringe, setSelectedSyringe] = useState<SyringeType>('U40');
  
  // Default concentration if not provided (5mg vial in 2mL water = 2500mcg/mL)
  const defaultConcentration = 2500; // mcg per mL
  const activeConcentration = concentration || defaultConcentration;
  
  // Convert dose to mcg
  const doseMcg = unit === 'mg' ? dose * 1000 : unit === 'IU' ? dose : dose;
  
  // Calculate volume needed in mL
  const volumeNeededMl = doseMcg / activeConcentration;
  
  // Calculate units for each syringe type
  const syringeCalculations = Object.entries(syringeConfigs).map(([type, config]) => {
    const unitsToDraw = volumeNeededMl * config.unitsPerMl;
    const isPractical = unitsToDraw <= config.maxUnits && unitsToDraw >= 1;
    const isIdeal = unitsToDraw <= config.maxUnits * 0.8 && unitsToDraw >= 2;
    
    return {
      type: type as SyringeType,
      config,
      unitsToDraw,
      isPractical,
      isIdeal,
    };
  });
  
  // Find the best syringe recommendation
  const recommendedSyringe = syringeCalculations.find(s => s.isIdeal) || 
                             syringeCalculations.find(s => s.isPractical) ||
                             syringeCalculations[0];
  
  if (dose <= 0) return null;
  
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Syringe size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Insulin Needle Dosage Guide
          </span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              {/* Info Banner */}
              <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">Based on standard reconstitution: </span>
                  5mg vial + 2mL BAC water = {activeConcentration.toLocaleString()} mcg/mL
                </div>
              </div>
              
              {/* Syringe Comparison */}
              <div className="grid grid-cols-3 gap-2">
                {syringeCalculations.map(({ type, unitsToDraw, isIdeal }) => (
                  <button 
                    key={type} 
                    onClick={() => setSelectedSyringe(type)}
                    className="relative"
                  >
                    {isIdeal && type === recommendedSyringe.type && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                        <span className="text-[9px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-medium">
                          Recommended
                        </span>
                      </div>
                    )}
                    <SyringeVisual 
                      syringeType={type}
                      unitsToDraw={unitsToDraw}
                      isActive={selectedSyringe === type}
                    />
                  </button>
                ))}
              </div>
              
              {/* Selected Syringe Details */}
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Using {syringeConfigs[selectedSyringe].name} Syringe:
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-muted-foreground">Draw to line</div>
                    <div className="text-lg font-bold text-primary">
                      {Math.round(volumeNeededMl * syringeConfigs[selectedSyringe].unitsPerMl)} units
                    </div>
                  </div>
                  <div className="p-2 rounded bg-background border border-border">
                    <div className="text-muted-foreground">Volume</div>
                    <div className="text-lg font-bold text-foreground">
                      {volumeNeededMl.toFixed(3)} mL
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {syringeConfigs[selectedSyringe].description}
                </p>
              </div>
              
              {/* Quick Reference */}
              <div className="text-[10px] text-muted-foreground text-center border-t border-border pt-2">
                <strong>Quick Reference:</strong> U-40 = 40 units/mL • U-50 = 50 units/mL • U-100 = 100 units/mL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
