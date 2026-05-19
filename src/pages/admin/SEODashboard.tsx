import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type StatusData = {
  sitemap: any;
  searchAnalytics: any;
  submissions: any[];
  coverage: any[];
  site_url: string;
  sitemap_url: string;
} | null;

export default function SEODashboard() {
  const [loading, setLoading] = useState(true);
  const [resubmitting, setResubmitting] = useState(false);
  const [data, setData] = useState<StatusData>(null);

  const load = async () => {
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("gsc-status");
    if (error) toast.error(error.message);
    else setData(res as StatusData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resubmit = async () => {
    setResubmitting(true);
    const { data: res, error } = await supabase.functions.invoke("gsc-resubmit-sitemap", {
      body: { source: "manual" },
    });
    setResubmitting(false);
    if (error || (res as any)?.status !== "success") {
      toast.error("Resubmit failed: " + (error?.message || JSON.stringify(res)));
    } else {
      toast.success("Sitemap resubmitted to Google");
      load();
    }
  };

  const sm = data?.sitemap;
  const contents = Array.isArray(sm?.contents) ? sm.contents : [];
  const totalSubmitted = contents.reduce((s: number, c: any) => s + (Number(c.submitted) || 0), 0);
  const totalIndexed = contents.reduce((s: number, c: any) => s + (Number(c.indexed) || 0), 0);
  const sitemapErrors = Number(sm?.errors) || 0;
  const sitemapWarnings = Number(sm?.warnings) || 0;
  const isHealthy = sitemapErrors === 0;

  const saRows = data?.searchAnalytics?.rows ?? [];
  const saTotals = saRows.reduce(
    (acc: any, r: any) => ({
      clicks: acc.clicks + (r.clicks || 0),
      impressions: acc.impressions + (r.impressions || 0),
      ctrSum: acc.ctrSum + (r.ctr || 0),
      posSum: acc.posSum + (r.position || 0),
    }),
    { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0 }
  );
  const saAvgCtr = saRows.length ? (saTotals.ctrSum / saRows.length) * 100 : 0;
  const saAvgPos = saRows.length ? saTotals.posSum / saRows.length : 0;

  const coverageChart = (data?.coverage ?? []).map((c) => ({
    date: format(new Date(c.captured_at), "MMM d"),
    submitted: c.submitted,
    indexed: c.indexed,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Admin</Button></Link>
            <h1 className="text-2xl font-bold">SEO / Search Console</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/seo/verify"><Button variant="outline" size="sm"><ShieldCheck className="mr-2 h-4 w-4" />Live check</Button></Link>
            <Button onClick={resubmit} disabled={resubmitting} size="sm">
              <RefreshCw className={`mr-2 h-4 w-4 ${resubmitting ? "animate-spin" : ""}`} />
              Resubmit sitemap
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary" /></div>
        ) : (
          <div className="space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Sitemap status</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {isHealthy ? <><CheckCircle2 className="h-5 w-5 text-green-500" /> Healthy</> : <><AlertTriangle className="h-5 w-5 text-destructive" /> Errors</>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {sm?.lastSubmitted ? `Submitted ${format(new Date(sm.lastSubmitted), "MMM d, yyyy")}` : "Never submitted"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardDescription>URLs submitted</CardDescription><CardTitle className="text-3xl">{totalSubmitted}</CardTitle></CardHeader>
                <CardContent className="text-xs text-muted-foreground">in sitemap.xml</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardDescription>URLs indexed</CardDescription><CardTitle className="text-3xl text-primary">{totalIndexed}</CardTitle></CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {totalSubmitted ? `${Math.round((totalIndexed / totalSubmitted) * 100)}% coverage` : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardDescription>Errors / Warnings</CardDescription>
                  <CardTitle className="text-3xl">
                    <span className={sitemapErrors ? "text-destructive" : ""}>{sitemapErrors}</span>
                    <span className="text-muted-foreground text-lg"> / {sitemapWarnings}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">From Google's last crawl</CardContent>
              </Card>
            </div>

            {/* Search performance */}
            <Card>
              <CardHeader>
                <CardTitle>Search performance (last 28 days)</CardTitle>
                <CardDescription>Source: Google Search Console</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Stat label="Clicks" value={saTotals.clicks.toLocaleString()} />
                  <Stat label="Impressions" value={saTotals.impressions.toLocaleString()} />
                  <Stat label="Avg CTR" value={`${saAvgCtr.toFixed(2)}%`} />
                  <Stat label="Avg position" value={saAvgPos ? saAvgPos.toFixed(1) : "—"} />
                </div>
              </CardContent>
            </Card>

            {/* Coverage chart */}
            <Card>
              <CardHeader>
                <CardTitle>Indexing coverage trend</CardTitle>
                <CardDescription>Submitted vs indexed URLs over time</CardDescription>
              </CardHeader>
              <CardContent>
                {coverageChart.length < 2 ? (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                    Not enough snapshots yet. Daily cron will populate this chart.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coverageChart}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Line type="monotone" dataKey="submitted" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                        <Line type="monotone" dataKey="indexed" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent submissions</CardTitle>
                <CardDescription>Last 20 attempts (manual + automated)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(data?.submissions ?? []).length === 0 && <div className="text-sm text-muted-foreground py-4">No submissions yet.</div>}
                  {(data?.submissions ?? []).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        {s.status === "success"
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <AlertTriangle className="h-4 w-4 text-destructive" />}
                        <span>{format(new Date(s.submitted_at), "MMM d, yyyy HH:mm")}</span>
                        <Badge variant="outline" className="text-xs">{s.source}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">HTTP {s.http_status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crawl errors */}
            <Card>
              <CardHeader>
                <CardTitle>Latest crawl errors</CardTitle>
                <CardDescription>From sitemap-level reporting</CardDescription>
              </CardHeader>
              <CardContent>
                {!contents.length && <div className="text-sm text-muted-foreground">No sitemap content reported.</div>}
                {contents.map((c: any, i: number) => (
                  <div key={i} className="border rounded-md p-3 mb-2 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{c.type ?? "web"}</span>
                      <span className="text-muted-foreground">{c.indexed}/{c.submitted} indexed</span>
                    </div>
                  </div>
                ))}
                <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                  Open in Search Console <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
