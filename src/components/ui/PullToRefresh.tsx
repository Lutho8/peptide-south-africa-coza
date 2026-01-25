import { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  threshold?: number;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  className,
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  // Transform for spinner rotation
  const rotate = useTransform(y, [0, threshold], [0, 180]);
  const spinnerOpacity = useTransform(y, [0, threshold / 2], [0, 1]);
  const spinnerScale = useTransform(y, [0, threshold], [0.5, 1]);

  const handleDragStart = () => {
    // Only enable pull if at top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setIsPulling(true);
    }
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isPulling) return;
    
    // Only allow downward drag
    if (info.offset.y < 0) {
      y.set(0);
    }
  };

  const handleDragEnd = useCallback(async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsPulling(false);
    
    if (info.offset.y >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [threshold, isRefreshing, onRefresh]);

  return (
    <div ref={containerRef} className={cn("relative overflow-auto", className)}>
      {/* Refresh indicator */}
      <motion.div 
        className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10"
        style={{ 
          opacity: isPulling || isRefreshing ? spinnerOpacity : 0,
          scale: spinnerScale
        }}
      >
        <motion.div
          style={{ rotate: isRefreshing ? undefined : rotate }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : undefined}
        >
          <Loader2 className="text-primary" size={24} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag={isPulling ? 'y' : false}
        dragConstraints={{ top: 0, bottom: threshold }}
        dragElastic={0.5}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y: isRefreshing ? threshold / 2 : y }}
        animate={!isPulling && !isRefreshing ? { y: 0 } : undefined}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}
