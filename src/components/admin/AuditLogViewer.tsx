import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ScrollText } from 'lucide-react';
import { format } from 'date-fns';
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

export default function AuditLogViewer() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, user_id, action, entity_type, entity_id, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setRows((data as AuditRow[]) ?? []);
      void logAudit({ action: 'admin.view_audit_log' });
    } catch (err) {
      console.error('audit load failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const q = filter.trim().toLowerCase();
  const filtered = q
    ? rows.filter(r =>
        r.action.toLowerCase().includes(q) ||
        (r.entity_type ?? '').toLowerCase().includes(q) ||
        (r.entity_id ?? '').toLowerCase().includes(q) ||
        r.user_id.toLowerCase().includes(q)
      )
    : rows;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Audit Log
          </CardTitle>
          <CardDescription>Last 200 admin + dose actions across the app</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Filter by action, entity, or user id…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading audit trail…
          </div>
        ) : (
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
                      No audit entries yet
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
        )}
      </CardContent>
    </Card>
  );
}
