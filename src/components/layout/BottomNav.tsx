import { Home, Layers, CalendarDays, Calculator, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'home' | 'stack' | 'daily-log' | 'dosage' | 'research';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'stack' as const, icon: Layers, label: 'My Stack' },
  { id: 'daily-log' as const, icon: CalendarDays, label: 'Daily Log' },
  { id: 'dosage' as const, icon: Calculator, label: 'Dosage' },
  { id: 'research' as const, icon: BookOpen, label: 'Research' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                size={22} 
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive && "text-primary"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
