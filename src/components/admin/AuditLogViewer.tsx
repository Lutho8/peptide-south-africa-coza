import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, RefreshCw, ScrollText, ChevronLeft, ChevronRight, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { logAudit } from '@/lib/auditLog';

interface AuditRow {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const KNOWN_ACTIONS = [
  'dose.create', 'dose.update', 'dose.delete',
  'dose.cycle.create', 'dose.cycle.update', 'dose.cycle.delete',
  'dose.cycle.status_change', 'dose.cycle.recalculate', 'dose.stack.update',
  'admin.dashboard.open', 'admin.coa_upload', 'admin.label_generate',
  'admin.view_audit_log', 'admin.audit_log.filter',
  'admin.role_check_failed', 'admin.role_check_fallback',
];

const PAGE_SIZE = 50;

export default function AuditLogViewer() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [filter, setFilter] = useState('');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [userQuery, setUserQuery] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let q = supabase
        .from('audit_logs')
        .select('id, user_id, action, entity_type, entity_id, metadata, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (selectedActions.size > 0) {
        q = q.in('action', Array.from(selectedActions));
      }
      if (fromDate) q = q.gte('created_at', fromDate.toISOString());
      if (toDate) {
        const end = new Date(toDate);
        end.setDate(end.getDate() + 1);
        q = q.lt('created_at', end.toISOString());
      }
      const uq = userQuery.trim();
      if (uq) q = q.ilike('user_id', `%${uq}%`);

      const { data, error, count } = await q;
      if (error) throw error;
      setRows((data as AuditRow[]) ?? []);
      setTotal(count ?? 0);
    } catch (err) {
      console.error('audit load failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  useEffect(() => {
    // Filter change: reset page + reload, and log the filter usage.
    setPage(0);
    const t = setTimeout(() => {
      load();
      void logAudit({
        action: 'admin.audit_log.filter',
        metadata: {
          actions: Array.from(selectedActions),
          from: fromDate?.toISOString() ?? null,
          to: toDate?.toISOString() ?? null,
          userQuery: userQuery.trim() || null,
        },
      });
    }, 250);
    return () => clearTimeout(t);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [selectedActions, fromDate, toDate, userQuery]);

  useEffect(() => { void logAudit({ action: 'admin.view_audit_log' }); }, []);

  const toggleAction = (a: string) => {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a); else next.add(a);
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedActions(new Set());
    setFromDate(undefined);
    setToDate(undefined);
    setUserQuery('');
    setFilter('');
  };

  const q = filter.trim().toLowerCase();
  const filtered = useMemo(() => q
    ? rows.filter(r =>
        r.action.toLowerCase().includes(q) ||
        (r.entity_type ?? '').toLowerCase().includes(q) ||
        (r.entity_id ?? '').toLowerCase().includes(q) ||
        r.user_id.toLowerCase().includes(q)
      )
    : rows, [rows, q]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeFilterCount =
    selectedActions.size + (fromDate ? 1 : 0) + (toDate ? 1 : 0) + (userQuery.trim() ? 1 : 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Audit Log
          </CardTitle>
          <CardDescription>
            {total} total entries — page {page + 1} of {pageCount}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Action type {selectedActions.size > 0 && `(${selectedActions.size})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2 max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {KNOWN_ACTIONS.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded hover:bg-muted">
                    <input
                      type="checkbox"
                      checked={selectedActions.has(a)}
                      onChange={() => toggleAction(a)}
                    />
                    <span className="font-mono">{a}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn('gap-1', !fromDate && 'text-muted-foreground')}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {fromDate ? format(fromDate, 'MMM d, yyyy') : 'From'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn('gap-1', !toDate && 'text-muted-foreground')}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {toDate ? format(toDate, 'MMM d, yyyy') : 'To'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Target user id fragment…"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="h-9 max-w-[220px]"
          />

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
              <X className="h-3.5 w-3.5" /> Reset ({activeFilterCount})
            </Button>
          )}
        </div>

        <Input
          placeholder="Filter this page (client-side)…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />

        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading audit trail…
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No audit entries match
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {format(new Date(r.created_at), 'MMM d, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.action.startsWith('admin.') ? 'default' : 'outline'} className="font-mono text-[11px]">
                          {r.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {r.entity_type ? (
                          <span>
                            <span className="text-muted-foreground">{r.entity_type}</span>
                            {r.entity_id ? <span className="ml-1 font-mono">{r.entity_id.slice(0, 12)}</span> : null}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        {r.user_id.slice(0, 8)}…
                      </TableCell>
                      <TableCell className="text-xs max-w-sm">
                        <code className="text-[10px] text-muted-foreground break-all">
                          {r.metadata && Object.keys(r.metadata).length > 0
                            ? JSON.stringify(r.metadata)
                            : '—'}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {rows.length === 0 ? 0 : page * PAGE_SIZE + 1}–{page * PAGE_SIZE + rows.length} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page + 1} / {pageCount}
                </span>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => (p + 1 < pageCount ? p + 1 : p))}
                  disabled={page + 1 >= pageCount || loading}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
