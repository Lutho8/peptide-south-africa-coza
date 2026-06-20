import { ExternalLink, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { captureLead } from '@/lib/crm';
import { useAuth } from '@/contexts/AuthContext';
import { useStackCart, slugify } from './StackCartContext';

export interface StackPeptide {
  name: string;
  slug?: string;
  priority: 'high' | 'medium' | 'low';
  goals?: string[];
  rationale: string;
  dosing: string;
}

interface Props {
  peptide: StackPeptide;
  index: number;
}

export function StackPeptideCard({ peptide, index }: Props) {
  const { user } = useAuth();
  const { has, toggle } = useStackCart();
  const slug = peptide.slug || slugify(peptide.name);
  const inCart = has(slug);
  const shopUrl = `https://peptide-south-africa.com/shop?q=${encodeURIComponent(slug)}&utm_source=app&utm_medium=bloodwork&utm_campaign=peptide`;

  const handleClick = () => {
    void captureLead({
      email: user?.email,
      source: 'bloodwork_peptide_shop',
      planInterest: 'premium',
      activityType: 'peptide_search',
      activityData: { peptide: peptide.name, slug },
    });
  };

  return (
    <div className={cn(
      'rounded-xl border bg-card/40 p-4 transition-colors',
      inCart ? 'border-primary/60 bg-primary/5' : 'border-border/60'
    )}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          <h4 className="text-base font-semibold text-foreground truncate">{peptide.name}</h4>
        </div>
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
            peptide.priority === 'high' && 'bg-red-500/15 text-red-500',
            peptide.priority === 'medium' && 'bg-yellow-500/15 text-yellow-600',
            peptide.priority === 'low' && 'bg-green-500/15 text-green-500'
          )}
        >
          {peptide.priority}
        </span>
      </div>

      {peptide.goals && peptide.goals.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {peptide.goals.map((g) => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {g}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">{peptide.rationale}</p>

      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Dosing</p>
        <p className="text-xs text-foreground">{peptide.dosing}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => toggle({ name: peptide.name, slug })}
          className={cn(
            'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-md border transition-colors',
            inCart
              ? 'border-green-500/40 bg-green-500/10 text-green-500'
              : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {inCart ? <><Check size={11} /> In stack</> : <><Plus size={11} /> Add</>}
        </button>
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline"
        >
          Shop <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
