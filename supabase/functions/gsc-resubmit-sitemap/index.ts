import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://ridethetide.info/";
const SITEMAP_URL = "https://ridethetide.info/sitemap.xml";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!LOVABLE_API_KEY || !GSC_KEY) {
    return new Response(JSON.stringify({ error: "Missing connector credentials" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let source = "manual";
  try { const body = await req.json(); if (body?.source) source = String(body.source); } catch {}

  const encSite = encodeURIComponent(SITE_URL);
  const encSitemap = encodeURIComponent(SITEMAP_URL);

  const putRes = await fetch(`${GATEWAY}/webmasters/v3/sites/${encSite}/sitemaps/${encSitemap}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
    },
  });

  let getJson: any = null;
  if (putRes.ok || putRes.status === 204) {
    const getRes = await fetch(`${GATEWAY}/webmasters/v3/sites/${encSite}/sitemaps/${encSitemap}`, {
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GSC_KEY,
      },
    });
    if (getRes.ok) getJson = await getRes.json().catch(() => null);
  }

  const status = (putRes.ok || putRes.status === 204) ? "success" : "error";
  const errorsArr = getJson?.errors != null ? [{ count: getJson.errors }] : [];
  const warnings = typeof getJson?.warnings === "number" ? getJson.warnings : 0;

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  await admin.from("gsc_submissions").insert({
    site_url: SITE_URL,
    sitemap_url: SITEMAP_URL,
    status,
    http_status: putRes.status,
    errors: errorsArr,
    warnings,
    source,
  });

  // Snapshot coverage at the same time
  if (getJson) {
    const contents = Array.isArray(getJson.contents) ? getJson.contents : [];
    const submitted = contents.reduce((s: number, c: any) => s + (Number(c.submitted) || 0), 0);
    const indexed = contents.reduce((s: number, c: any) => s + (Number(c.indexed) || 0), 0);
    await admin.from("gsc_coverage_snapshots").insert({
      site_url: SITE_URL,
      submitted,
      indexed,
      errors: Number(getJson.errors) || 0,
      warnings,
      raw: getJson,
    });
  }

  return new Response(JSON.stringify({ status, http_status: putRes.status, sitemap: getJson }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
