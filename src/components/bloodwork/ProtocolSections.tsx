import { ShoppingBag, ArrowRight } from 'lucide-react';
import { StackPeptideCard, StackPeptide } from './StackPeptideCard';
import { captureLead } from '@/lib/crm';
import { useAuth } from '@/contexts/AuthContext';

export interface SupplementItem {
  name: string;
  dose?: string;
  what_it_is?: string;
  why_it_matters?: string;
  how_to_take?: string;
}

export interface NutritionItem {
  title: string;
  what_it_looks_like?: string;
  why_adopt?: string;
  examples?: string;
}

export interface NumberedItem {
  title: string;
  body?: string;
}

export interface RetestItem {
  marker: string;
  when?: string;
  why?: string;
}

export interface Protocol {
  stack_summary?: string;
  stack?: StackPeptide[];
  supplements?: SupplementItem[];
  nutrition?: NutritionItem[];
  exercise?: NumberedItem[];
  stress?: NumberedItem[];
  environment?: NumberedItem[];
  retest?: RetestItem[];
}

interface Props {
  protocol: Protocol;
  goals: string[];
}

export function ProtocolSections({ protocol, goals }: Props) {
  const { user } = useAuth();

  const handleBuyStack = () => {
    void captureLead({
      email: user?.email,
      source: 'bloodwork_stack_buy',
      planInterest: 'premium',
      activityType: 'premium_click',
      activityData: { goals, peptides: protocol.stack?.map((p) => p.name) ?? [] },
    });
  };

  return (
    <div className="space-y-12">
      {/* PEPTIDE STACK */}
      {protocol.stack && protocol.stack.length > 0 && (
        <ProtocolBlock num="04" title="Peptide stack">
          {protocol.stack_summary && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{protocol.stack_summary}</p>
          )}
          <a
            href="https://www.ridethetide.site/shop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyStack}
            className="group flex items-center justify-between gap-3 mb-5 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent p-4 hover:border-primary transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShoppingBag size={18} className="text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Buy this stack on RideTheTide.site/shop
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Lab-verified vendors · ships discreetly · research-grade
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {protocol.stack.map((p, i) => (
              <StackPeptideCard key={`${p.name}-${i}`} peptide={p} index={i} />
            ))}
          </div>
        </ProtocolBlock>
      )}

      {/* SUPPLEMENTS */}
      {protocol.supplements && protocol.supplements.length > 0 && (
        <ProtocolBlock num="05" title="Supplements">
          <ol className="space-y-5">
            {protocol.supplements.map((s, i) => (
              <li key={i} className="border-l-2 border-primary/40 pl-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="text-sm font-semibold text-foreground">{s.name}</h4>
                  {s.dose && <span className="text-xs text-muted-foreground">— {s.dose}</span>}
                </div>
                <SubBlock label="What it is" body={s.what_it_is} />
                <SubBlock label="Why it matters" body={s.why_it_matters} />
                <SubBlock label="How to take it" body={s.how_to_take} />
              </li>
            ))}
          </ol>
        </ProtocolBlock>
      )}

      {/* NUTRITION */}
      {protocol.nutrition && protocol.nutrition.length > 0 && (
        <ProtocolBlock num="06" title="Nutrition">
          <ol className="space-y-5">
            {protocol.nutrition.map((n, i) => (
              <li key={i} className="border-l-2 border-primary/40 pl-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                </div>
                <SubBlock label="What it looks like" body={n.what_it_looks_like} />
                <SubBlock label="Why adopt this" body={n.why_adopt} />
                <SubBlock label="Examples" body={n.examples} />
              </li>
            ))}
          </ol>
        </ProtocolBlock>
      )}

      {/* EXERCISE / STRESS / ENVIRONMENT */}
      {protocol.exercise && <NumberedBlock num="07" title="Exercise" items={protocol.exercise} />}
      {protocol.stress && <NumberedBlock num="08" title="Stress" items={protocol.stress} />}
      {protocol.environment && <NumberedBlock num="09" title="Environment" items={protocol.environment} />}

      {/* RETEST */}
      {protocol.retest && protocol.retest.length > 0 && (
        <ProtocolBlock num="10" title="Diagnostics — retest">
          <ul className="space-y-3">
            {protocol.retest.map((r, i) => (
              <li key={i} className="rounded-lg border border-border/50 bg-card/30 p-3">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-sm font-semibold text-foreground">{r.marker}</span>
                  {r.when && (
                    <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {r.when}
                    </span>
                  )}
                </div>
                {r.why && <p className="text-xs text-muted-foreground">{r.why}</p>}
              </li>
            ))}
          </ul>
        </ProtocolBlock>
      )}
    </div>
  );
}

function ProtocolBlock({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">{num} —</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function NumberedBlock({ num, title, items }: { num: string; title: string; items: NumberedItem[] }) {
  if (!items.length) return null;
  return (
    <ProtocolBlock num={num} title={title}>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="border-l-2 border-primary/40 pl-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
            </div>
            {item.body && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.body}</p>}
          </li>
        ))}
      </ol>
    </ProtocolBlock>
  );
}

function SubBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="mt-2">
      <p className="text-[10px] uppercase tracking-wider text-primary/80 font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
