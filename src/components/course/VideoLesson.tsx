import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface VideoLessonProps {
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export function VideoLesson({ title, description, youtubeId, duration, isCompleted, onComplete }: VideoLessonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={14} /> {duration}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      <div className="rounded-xl overflow-hidden border border-border shadow-md">
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </AspectRatio>
      </div>

      {!isCompleted && (
        <button
          onClick={onComplete}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-2"
        >
          <CheckCircle size={16} />
          Mark as completed
        </button>
      )}
      {isCompleted && (
        <div className="flex items-center gap-2 text-sm font-medium text-green-500">
          <CheckCircle size={16} />
          Completed
        </div>
      )}
    </motion.div>
  );
}
