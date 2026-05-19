const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let url = "https://ridethetide.info/";
  try { const body = await req.json(); if (body?.url) url = String(body.url); } catch {}
  if (!/^https?:\/\//.test(url)) url = "https://" + url;

  let html = "";
  let status = 0;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "RideTheTide-SEO-Check/1.0" } });
    status = res.status;
    html = await res.text();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const findAll = (re: RegExp) => [...html.matchAll(re)];
  const head = html.split(/<\/head>/i)[0] || html;

  const verification = head.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
  const title = head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
  const description = head.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] ?? null;
  const canonical = head.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? null;

  const hreflangs = findAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi)
    .map((m) => ({ hreflang: m[1], href: m[2] }));

  const ogTags = findAll(/<meta\s+property=["'](og:[^"']+)["']\s+content=["']([^"']+)["']/gi)
    .map((m) => ({ property: m[1], content: m[2] }));

  const jsonLdBlocks = findAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .map((m) => {
      try { return JSON.parse(m[1]); } catch { return { __invalid: true }; }
    });

  const required = ["en-za", "de-de", "x-default"];
  const hreflangCodes = hreflangs.map((h) => h.hreflang.toLowerCase());
  const missingHreflang = required.filter((r) => !hreflangCodes.includes(r));

  const checks = {
    http_ok: status >= 200 && status < 400,
    google_verification: !!verification,
    title: !!title,
    description: !!description,
    canonical: !!canonical,
    hreflang_complete: missingHreflang.length === 0,
    has_jsonld: jsonLdBlocks.length > 0,
    og_tags: ogTags.length > 0,
  };
  const ready = Object.values(checks).every(Boolean);

  return new Response(JSON.stringify({
    ok: true, url, http_status: status, ready, checks,
    found: {
      verification_token: verification?.[1] ?? null,
      title, description, canonical,
      hreflangs, og_tags: ogTags,
      jsonld_count: jsonLdBlocks.length,
      jsonld_types: jsonLdBlocks.map((b: any) => b?.["@type"] ?? "unknown"),
      missing_hreflang: missingHreflang,
    },
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
