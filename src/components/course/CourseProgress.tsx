import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy } from 'lucide-react';

interface CourseProgressProps {
  completedLessons: number;
  totalLessons: number;
  completedQuizzes: number;
  totalQuizzes: number;
}

export function CourseProgress({ completedLessons, totalLessons, completedQuizzes, totalQuizzes }: CourseProgressProps) {
  const total = totalLessons + totalQuizzes;
  const completed = completedLessons + completedQuizzes;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <BookOpen size={16} className="text-primary" />
          <span>{completedLessons}/{totalLessons} lessons</span>
        </div>
        <Progress value={pct} className="h-2 flex-1" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Trophy size={16} className="text-primary" />
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
