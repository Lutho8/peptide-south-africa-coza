import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, FileText, TrendingUp, TrendingDown, Minus, ExternalLink, Loader2, Plus } from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Biomarker {
  name: string;
  short_name?: string;
  value: number;
  unit?: string;
  status?: string;
  category?: string;
  reference_range?: string;
}

interface Report {
  id: string;
  report_date: string | null;
  uploaded_at: string;
  file_name: string | null;
  health_score: number | null;
  status: string;
  extracted_biomarkers: Biomarker[] | null;
  scan_type: string | null;
}

const statusColor = (s?: string) => {
  switch ((s ?? '').toLowerCase()) {
    case 'high':
    case 'critical':
      return 'text-destructive bg-destructive/10 border-destructive/30';
    case 'low':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'normal':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    default:
      return 'text-muted-foreground bg-muted/30 border-border';
  }
};

export function BloodworkTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('lab_reports')
        .select('id, report_date, uploaded_at, file_name, health_score, status, extracted_biomarkers, scan_type')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('uploaded_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('[bloodwork-tab] load failed', error);
      } else {
        setReports((data ?? []) as unknown as Report[]);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Build per-biomarker trend across reports (sorted oldest → newest)
  const trends = useMemo(() => {
    const map = new Map<string, { name: string; unit: string; points: { date: string; value: number; status?: string }[] }>();
    const ordered = [...reports].sort((a, b) => (a.uploaded_at ?? '').localeCompare(b.uploaded_at ?? ''));
    for (const r of ordered) {
      const date = r.report_date ?? r.uploaded_at?.slice(0, 10) ?? '';
      for (const b of r.extracted_biomarkers ?? []) {
        const key = (b.short_name ?? b.name)?.toLowerCase().trim();
        if (!key || typeof b.value !== 'number' || Number.isNaN(b.value)) continue;
        if (!map.has(key)) map.set(key, { name: b.name, unit: b.unit ?? '', points: [] });
        map.get(key)!.points.push({ date, value: b.value, status: b.status });
      }
    }
    // Only keep biomarkers tracked across 1+ reports
    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }));
  }, [reports]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FlaskConical size={22} className="text-primary" />
        </div>
        <h3 className="text-base font-bold text-foreground">No bloodwork yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Upload your first lab report to start tracking biomarker trends and protocol impact.
        </p>
        <Button asChild className="mt-2">
          <Link to="/bloodwork"><Plus size={14} className="mr-1.5" />Upload bloodwork</Link>
        </Button>
      </div>
    );
  }

  const activeReport = reports.find((r) => r.id === selected) ?? reports[0];

  return (
    <div className="space-y-6">
      {/* Quick CTA */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{reports.length} report{reports.length === 1 ? '' : 's'} on file</p>
        <Button asChild size="sm" variant="outline">
          <Link to="/bloodwork"><Plus size={14} className="mr-1.5" />New scan</Link>
        </Button>
      </div>

      {/* Report cards */}
      <div className="grid gap-2">
        {reports.map((r) => {
          const date = r.report_date ?? r.uploaded_at?.slice(0, 10) ?? '';
          const count = r.extracted_biomarkers?.length ?? 0;
          const isActive = activeReport?.id === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r.id)}
              className={`text-left rounded-xl border p-3 transition-colors active:scale-[0.99] ${
                isActive ? 'border-primary/60 bg-primary/5' : 'border-border bg-card/40 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FileText size={14} className="text-primary shrink-0" />
                    <span className="truncate">{r.file_name ?? 'Lab report'}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {date ? format(parseISO(date), 'd MMM yyyy') : 'Date unknown'} ·{' '}
                    {count} biomarker{count === 1 ? '' : 's'}
                    {r.scan_type === 'deep' && ' · Deep Decode'}
                  </p>
                </div>
                {r.health_score != null && (
                  <div className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                    {r.health_score}/100
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active report biomarkers + deltas */}
      {activeReport && (activeReport.extracted_biomarkers?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FlaskConical size={14} className="text-primary" />
            Biomarkers · {format(parseISO(activeReport.report_date ?? activeReport.uploaded_at.slice(0, 10)), 'd MMM yyyy')}
          </h3>
          <div className="grid gap-1.5">
            {activeReport.extracted_biomarkers!.map((b, i) => {
              const trend = trends.find((t) => t.key === (b.short_name ?? b.name)?.toLowerCase().trim());
              const points = trend?.points ?? [];
              const prev = points.length > 1 ? points[points.length - 2].value : null;
              const delta = prev != null && b.value != null ? ((b.value - prev) / prev) * 100 : null;
              const TrendIcon = delta == null ? Minus : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
              return (
                <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/40 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{b.name}</p>
                    {b.reference_range && (
                      <p className="text-[10px] text-muted-foreground">Ref: {b.reference_range}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {delta != null && (
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                        delta > 0 ? 'text-emerald-500' : delta < 0 ? 'text-amber-500' : 'text-muted-foreground'
                      }`}>
                        <TrendIcon size={10} /> {Math.abs(delta).toFixed(0)}%
                      </span>
                    )}
                    <span className={`text-xs font-semibold rounded-md px-2 py-0.5 border ${statusColor(b.status)}`}>
                      {b.value}{b.unit ? ` ${b.unit}` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend charts for biomarkers with 2+ data points */}
      {trends.filter((t) => t.points.length >= 2).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />Trend over time
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {trends
              .filter((t) => t.points.length >= 2)
              .map((t) => (
                <div key={t.key} className="rounded-xl border border-border bg-card/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.unit}</p>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={t.points}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 9 }} hide />
                        <YAxis tick={{ fontSize: 9 }} width={28} />
                        <RTooltip
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                          labelFormatter={(d) => format(parseISO(String(d)), 'd MMM yyyy')}
                        />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Last upload age + reminder hint */}
      {reports[0] && (
        <p className="text-[11px] text-muted-foreground text-center">
          Last bloodwork uploaded {formatDistanceToNow(parseISO(reports[0].uploaded_at), { addSuffix: true })}.
          {' '}Re-test every 90 days for best protocol tracking.
        </p>
      )}
    </div>
  );
}
