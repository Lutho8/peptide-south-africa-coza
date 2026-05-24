import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { useAuth } from '@/contexts/AuthContext';

interface LandingHeaderProps {
  onSignInClick: () => void;
  onSearch?: (query: string) => void;
}

const SHOP_URL = 'https://www.ridethetide.site';

export function LandingHeader({ onSignInClick, onSearch }: LandingHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { label: 'Free Course', href: '/free-course' },
    { label: 'Bloodwork', href: '/bloodwork' },
    { label: 'Browse', href: '#browse' },
    { label: 'Blends & Stacks', href: '#tools' },
    { label: 'Research', href: '#research' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <AnimatedLogo size="md" showText={true} onClick={scrollToTop} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link key={link.label} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </a>
              )
            )}
            {user && (
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search peptides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </form>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            {!user && (
              <Button
                onClick={onSignInClick}
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-muted-foreground hover:text-primary"
              >
                Sign in
              </Button>
            )}
            <a href={SHOP_URL}>
              <Button
                size="sm"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                Shop Peptides →
              </Button>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search peptides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              {user && (
                <Link
                  to="/"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <a
                href={SHOP_URL}
                className="mt-2 px-3 py-2 text-sm font-semibold text-accent border border-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Peptides →
              </a>
              {!user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignInClick();
                  }}
                  className="mt-2 px-3 py-2 text-sm font-medium text-left text-foreground border border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  Sign in
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
