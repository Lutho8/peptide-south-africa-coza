import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  label: string;
}

interface LegalSidebarProps {
  title: string;
  lastUpdated: string;
  items: TOCItem[];
  children: React.ReactNode;
}

export default function LegalSidebar({ title, lastUpdated, items, children }: LegalSidebarProps) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveId(items[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-primary-100 text-sm">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      <div className="container-main py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar TOC */}
          <aside className="lg:w-72 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-dark-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-dark-900 uppercase tracking-wider mb-4">Contents</h2>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`text-left text-sm px-3 py-2 rounded-lg whitespace-nowrap lg:whitespace-normal transition-colors ${
                      activeId === item.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-dark-500 hover:text-dark-900 hover:bg-dark-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-dark-100 p-6 md:p-8 lg:p-10 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
