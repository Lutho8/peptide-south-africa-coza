import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd, buildBreadcrumbSchema } from './JsonLd';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BASE_URL = 'https://ridethetide.info';

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = [
    { name: 'Home', url: BASE_URL },
    ...items.map(i => ({ name: i.label, url: `${BASE_URL}${i.href}` }))
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(schemaItems)} id="breadcrumb-schema" />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home size={14} />
          <span>Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-muted-foreground/50" />
            {i === items.length - 1 ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
