import { Syringe } from 'lucide-react';

interface AppHeaderProps {
  onLogoClick: () => void;
}

export function AppHeader({ onLogoClick }: AppHeaderProps) {
  return (
    <button
      onClick={onLogoClick}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
      aria-label="Go to Home"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Syringe size={16} className="text-primary-foreground" />
      </div>
      <span className="text-sm font-semibold text-foreground hidden sm:block">PeptidePro</span>
    </button>
  );
}
