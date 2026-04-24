import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProtocolSections, Protocol } from './ProtocolSections';

export interface ResultBiomarker {
  name: string;
  short_name?: string;
  value: number;
  unit: string;
  reference_range: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  category: string;
}

export interface BloodworkScanResult {
  scan_type: 'baseline' | 'deep';
  health_score?: number;
  biomarkers: ResultBiomarker[];
  insights: string[];
  protocol: Protocol;
  goals: string[];
}

const CATEGORY_ORDER = ['hormone', 'lipid', 'metabolic', 'liver', 'kidney', 'inflammation', 'thyroid', 'other'];
const CATEGORY_LABELS: Record<string, string> = {
  hormone: 'Hormones',
  lipid: 'Lipids',
  metabolic: 'Metabolic',
  liver: 'Liver',
  kidney: 'Kidney',
  inflammation: 'Inflammation',
  thyroid: 'Thyroid',
  other: 'Other',
};

interface Props {
  result: BloodworkScanResult;
  onDownload: () => void;
}

export function BloodworkResults({ result, onDownload }: Props) {
  const grouped = groupByCategory(result.biomarkers);

  return (
    <div className="space-y-12" id="bloodwork-results-root">
      {/* HEADER */}
      <header className="border-b border-border/50 pb-6">
        <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          {result.scan_type === 'deep' ? 'Deep Decode' : 'Baseline Scan'}
        </p>
        <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Bloodwork Results</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.biomarkers.length} biomarkers analysed · {result.goals.length} goals
            </p>
          </div>
          <div className="flex items-center gap-5">
            {typeof result.health_score === 'number' && <HealthScoreRing score={result.health_score} />}
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary/60 hover:text-primary transition-colors"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* BIOMARKER PANEL */}
      <section>
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground">02 —</span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Biomarker panel</h2>
        </div>
        <div className="space-y-6">
          {CATEGORY_ORDER.filter((c) => grouped[c]?.length).map((cat) => (
            <div key={cat}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{CATEGORY_LABELS[cat]}</p>
              <div className="rounded-xl border border-border/50 overflow-hidden">
                {grouped[cat].map((bm, i) => (
                  <BiomarkerRow key={`${cat}-${i}`} bm={bm} last={i === grouped[cat].length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSIGHTS */}
      {result.insights.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
            <span className="font-mono text-[11px] tracking-widest text-muted-foreground">03 —</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Insights</h2>
          </div>
          <ol className="space-y-3">
            {result.insights.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-[10px] text-primary mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* PROTOCOL */}
      <ProtocolSections protocol={result.protocol} goals={result.goals} />
    </div>
  );
}

function HealthScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const target = Math.max(0, Math.min(100, score));
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;
  const tone = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-[88px] h-[88px]"
      aria-label={`Health score ${animated} of 100`}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          className={tone}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold', tone)}>{animated}</span>
        <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Score</span>
      </div>
    </motion.div>
  );
}

function BiomarkerRow({ bm, last }: { bm: ResultBiomarker; last: boolean }) {
  const tone =
    bm.status === 'normal'
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : bm.status === 'high'
      ? 'bg-red-500/10 text-red-500 border-red-500/20'
      : bm.status === 'low'
      ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      : 'bg-red-600/15 text-red-600 border-red-600/30';
  const Icon =
    bm.status === 'normal' ? CheckCircle : bm.status === 'high' ? TrendingUp : bm.status === 'low' ? TrendingDown : AlertTriangle;

  return (
    <div className={cn('flex items-center gap-3 p-3 bg-card/30', !last && 'border-b border-border/40')}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{bm.name}</p>
        <p className="text-[10px] text-muted-foreground">Ref: {bm.reference_range}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-base font-bold text-foreground tabular-nums">{bm.value}</p>
        <p className="text-[10px] text-muted-foreground">{bm.unit}</p>
      </div>
      <span
        className={cn(
          'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border shrink-0',
          tone
        )}
      >
        <Icon size={10} /> {bm.status}
      </span>
    </div>
  );
}

function groupByCategory(list: ResultBiomarker[]): Record<string, ResultBiomarker[]> {
  const out: Record<string, ResultBiomarker[]> = {};
  for (const bm of list) {
    const cat = (bm.category || 'other').toLowerCase();
    const key = CATEGORY_ORDER.includes(cat) ? cat : 'other';
    (out[key] ||= []).push(bm);
  }
  return out;
}
