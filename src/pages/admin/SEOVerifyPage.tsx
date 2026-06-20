import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CheckResult = {
  ok: boolean;
  url: string;
  http_status: number;
  ready: boolean;
  checks: Record<string, boolean>;
  found: {
    verification_token: string | null;
    title: string | null;
    description: string | null;
    canonical: string | null;
    hreflangs: { hreflang: string; href: string }[];
    og_tags: { property: string; content: string }[];
    jsonld_count: number;
    jsonld_types: string[];
    missing_hreflang: string[];
  };
};

const CHECK_LABELS: Record<string, string> = {
  http_ok: "Page loads (2xx/3xx)",
  google_verification: "google-site-verification meta",
  title: "<title> present",
  description: "meta description present",
  canonical: "canonical link present",
  hreflang_complete: "hreflang en-za, de-de, x-default",
  has_jsonld: "JSON-LD structured data",
  og_tags: "Open Graph tags",
};

export default function SEOVerifyPage() {
  const [url, setUrl] = useState("https://peptide-south-africa.co.za/");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const runCheck = async () => {
    setLoading(true); setResult(null);
    const { data, error } = await supabase.functions.invoke("gsc-verify-live", { body: { url } });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setResult(data as CheckResult);
  };

  const submitToGoogle = async () => {
    setVerifying(true);
    const { data, error } = await supabase.functions.invoke("gsc-resubmit-sitemap", { body: { source: "manual-verify" } });
    setVerifying(false);
    if (error) toast.error(error.message);
    else if ((data as any)?.status === "success") toast.success("Sitemap submitted to Google");
    else toast.error("Submission returned: " + JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin/seo"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />SEO</Button></Link>
          <h1 className="text-2xl font-bold">Live verification check</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pre-flight check</CardTitle>
            <CardDescription>Fetches the production URL and confirms verification + SEO tags are live before submitting to Google Search Console.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://peptide-south-africa.co.za/" />
              <Button onClick={runCheck} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run check"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.ready ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                  {result.ready ? "Ready to submit to Google" : "Not ready — fix below"}
                </CardTitle>
                <CardDescription>HTTP {result.http_status} from {result.url}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(result.checks).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {v ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                      <span>{CHECK_LABELS[k] ?? k}</span>
                    </div>
                    <Badge variant={v ? "secondary" : "destructive"}>{v ? "OK" : "Missing"}</Badge>
                  </div>
                ))}
                <Button onClick={submitToGoogle} disabled={!result.ready || verifying} className="w-full mt-4">
                  {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit / resubmit sitemap to Google
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Detected tags</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Verification token" value={result.found.verification_token ?? "—"} mono />
                <Row label="Title" value={result.found.title ?? "—"} />
                <Row label="Description" value={result.found.description ?? "—"} />
                <Row label="Canonical" value={result.found.canonical ?? "—"} mono />
                <div>
                  <div className="text-muted-foreground mb-1">hreflang ({result.found.hreflangs.length})</div>
                  {result.found.hreflangs.map((h, i) => (
                    <div key={i} className="font-mono text-xs">{h.hreflang} → {h.href}</div>
                  ))}
                  {result.found.missing_hreflang.length > 0 && (
                    <div className="text-destructive text-xs mt-1">Missing: {result.found.missing_hreflang.join(", ")}</div>
                  )}
                </div>
                <Row label="JSON-LD" value={`${result.found.jsonld_count} blocks: ${result.found.jsonld_types.join(", ") || "—"}`} />
                <Row label="OG tags" value={`${result.found.og_tags.length} tags`} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-xs break-all" : "text-sm break-words"}>{value}</div>
    </div>
  );
}
