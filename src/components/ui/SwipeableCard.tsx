import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
  threshold?: number;
}

export function SwipeableCard({ 
  children, 
  onDelete, 
  className,
  threshold = 100 
}: SwipeableCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  
  // Transform for delete background opacity
  const deleteOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const scale = useTransform(x, [-threshold * 1.5, 0], [0.95, 1]);
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -threshold && onDelete) {
      setIsDeleting(true);
      // Animate out then delete
      setTimeout(() => {
        onDelete();
      }, 200);
    }
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ height: 'auto', opacity: 1 }}
        animate={{ height: 0, opacity: 0, marginBottom: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      />
    );
  }

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <motion.div 
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-destructive rounded-xl"
        style={{ opacity: deleteOpacity, width: threshold + 20 }}
      >
        <Trash2 className="text-destructive-foreground" size={20} />
      </motion.div>
      
      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -threshold * 1.5, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x, scale }}
        className={cn("relative bg-card touch-pan-y", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
