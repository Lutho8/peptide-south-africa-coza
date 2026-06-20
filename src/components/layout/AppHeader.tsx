import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, ShoppingBag, Target, ChevronDown } from 'lucide-react';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { SupportSheet } from '@/components/support/SupportSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  onLogoClick: () => void;
}

const SHOP_HREF =
  'https://peptide-south-africa.com/?utm_source=psa_app&utm_medium=header&utm_campaign=shop_nav';

const GOAL_LINKS: Array<{ label: string; to: string }> = [
  { label: 'Weight Loss', to: '/weight-loss-peptides-south-africa' },
  { label: 'Healing', to: '/healing-peptides-south-africa' },
  { label: 'Anti-Aging', to: '/anti-aging-peptides-south-africa' },
  { label: 'Cognitive', to: '/cognitive-peptides-south-africa' },
  { label: 'Growth Hormone', to: '/growth-hormone-peptides-south-africa' },
  { label: 'Libido (PT-141)', to: '/libido-peptides-south-africa' },
];

export function AppHeader({ onLogoClick }: AppHeaderProps) {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <div
        className="fixed z-50 left-0 right-0 flex items-center justify-between px-3 pointer-events-none"
        style={{ top: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))' }}
      >
        <div className="pointer-events-auto px-3 py-2 rounded-xl bg-card/95 backdrop-blur border border-border shadow-md hover:shadow-lg hover:border-primary/30 transition-all">
          <AnimatedLogo size="sm" showText={true} onClick={onLogoClick} className="hidden sm:flex" />
          <AnimatedLogo size="sm" showText={false} onClick={onLogoClick} className="sm:hidden" />
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Research by goal"
                className="hidden sm:flex items-center gap-1.5 min-h-11 px-3 rounded-xl bg-card/95 backdrop-blur border border-border shadow-md hover:border-primary/40 hover:bg-card transition-all active:scale-[0.97]"
              >
                <Target size={18} className="text-primary" />
                <span className="text-sm font-semibold">Research by Goal</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur border border-border">
              <DropdownMenuLabel>Browse by research goal</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {GOAL_LINKS.map((g) => (
                <DropdownMenuItem key={g.to} asChild>
                  <Link to={g.to} className="cursor-pointer">
                    {g.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/bpc-157-vs-tb-500" className="cursor-pointer">
                  BPC-157 vs TB-500
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href={SHOP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shop peptides"
            className="flex items-center gap-1.5 min-h-11 px-3 rounded-xl bg-card/95 backdrop-blur border border-border shadow-md hover:border-primary/40 hover:bg-card transition-all active:scale-[0.97]"
          >
            <ShoppingBag size={18} className="text-primary" />
            <span className="text-sm font-semibold hidden xs:inline">Shop</span>
          </a>
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            aria-label="Open support menu"
            className="flex items-center justify-center min-h-11 min-w-11 rounded-xl bg-card/95 backdrop-blur border border-border shadow-md hover:border-primary/40 hover:bg-card transition-all active:scale-[0.97]"
          >
            <LifeBuoy size={20} className="text-primary" />
          </button>
        </div>
      </div>

      <SupportSheet open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  );
}
