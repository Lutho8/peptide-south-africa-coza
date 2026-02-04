import { Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  onLogoClick: () => void;
}

export function AppHeader({ onLogoClick }: AppHeaderProps) {
  return (
    <button
      onClick={onLogoClick}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/30 transition-all"
      aria-label="Go to Home"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Waves size={16} className="text-primary-foreground" />
      </div>
      <span className="text-sm font-semibold text-foreground hidden sm:block">Ride The Tide</span>
    </button>
  );
}
