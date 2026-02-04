import logoIcon from '@/assets/logo-icon.png';

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
      <img src={logoIcon} alt="Ride The Tide" className="w-8 h-8 rounded-lg" />
      <span className="text-sm font-semibold text-foreground hidden sm:block">Ride The Tide</span>
    </button>
  );
}
