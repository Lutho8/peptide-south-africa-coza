import { AnimatedLogo } from '@/components/ui/AnimatedLogo';

interface AppHeaderProps {
  onLogoClick: () => void;
}

export function AppHeader({ onLogoClick }: AppHeaderProps) {
  return (
    <div className="fixed z-50 px-3 py-2 rounded-xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/30 transition-all" style={{ top: 'max(1rem, env(safe-area-inset-top, 1rem))', left: 'max(1rem, env(safe-area-inset-left, 1rem))' }}>
      <AnimatedLogo size="sm" showText={true} onClick={onLogoClick} className="hidden sm:flex" />
      <AnimatedLogo size="sm" showText={false} onClick={onLogoClick} className="sm:hidden" />
    </div>
  );
}
