import { newsItems } from '@/data/userData';
import { Newspaper } from 'lucide-react';

export function NewsTicker() {
  const duplicatedNews = [...newsItems, ...newsItems];

  return (
    <div className="relative overflow-hidden bg-primary/10 border border-primary/20 rounded-xl py-3">
      <div className="flex items-center gap-2 px-3 mb-2">
        <Newspaper size={14} className="text-primary" />
        <span className="text-xs font-medium text-primary">Research Updates</span>
      </div>
      <div className="overflow-hidden">
        <div className="ticker-scroll flex gap-12 whitespace-nowrap">
          {duplicatedNews.map((item, index) => (
            <span 
              key={index}
              className="text-sm text-muted-foreground inline-flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
