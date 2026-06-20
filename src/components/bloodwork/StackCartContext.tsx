import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

export interface CartItem {
  name: string;
  slug: string;
}

interface CartCtx {
  items: CartItem[];
  has: (slug: string) => boolean;
  toggle: (item: CartItem) => void;
  add: (item: CartItem) => void;
  addMany: (items: CartItem[]) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function StackCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((p) => p.slug === item.slug) ? prev.filter((p) => p.slug !== item.slug) : [...prev, item]));
  }, []);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((p) => p.slug === item.slug) ? prev : [...prev, item]));
  }, []);

  const addMany = useCallback((next: CartItem[]) => {
    setItems((prev) => {
      const map = new Map(prev.map((p) => [p.slug, p]));
      for (const n of next) map.set(n.slug, n);
      return Array.from(map.values());
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, has, toggle, add, addMany, clear }), [items, has, toggle, add, addMany, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStackCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStackCart must be used within StackCartProvider');
  return v;
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
