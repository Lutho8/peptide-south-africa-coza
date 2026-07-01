import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const {
      reportId,
      imageBase64: incomingBase64, // legacy clients still send inline
      fileName,
      mimeType,
      languageHint,
      scanType = "baseline",
      age,
      sex,
      goals = [],
      peptideHistoryUsed,
      peptideHistoryNotes,
    } = body || {};

    if (!reportId) {
      return new Response(JSON.stringify({
        ok: false, code: "BAD_REQUEST", retryable: false,
        message: "Missing report id.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch report row to locate the stored file
    const { data: reportRow, error: reportErr } = await supabase
      .from("lab_reports")
      .select("file_url, file_name")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();
    if (reportErr || !reportRow) {
      return new Response(JSON.stringify({
        ok: false, code: "REPORT_NOT_FOUND", retryable: false,
        message: "Couldn't find the uploaded report.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Prefer server-side storage download (no 6MB invoke body limit).
    // Fallback to legacy inline base64 if a client still sends it.
    let base64: string;
    const effectiveFileName = fileName || reportRow.file_name || "report.pdf";
    if (incomingBase64) {
      base64 = incomingBase64;
    } else {
      const downloadStart = Date.now();
      const { data: blob, error: dlErr } = await supabase
        .storage.from("lab-reports").download(reportRow.file_url);
      if (dlErr || !blob) {
        console.error("[analyze-lab-report] storage download failed", { dlErr });
        return new Response(JSON.stringify({
          ok: false, code: "STORAGE_DOWNLOAD_FAILED", retryable: true,
          message: "Couldn't load your uploaded file. Please retry.",
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const buf = new Uint8Array(await blob.arrayBuffer());
      // Reject scanned/encrypted PDFs early
      const head = new TextDecoder().decode(buf.slice(0, Math.min(buf.length, 4096)));
      if (head.includes("/Encrypt")) {
        return new Response(JSON.stringify({
          ok: false, code: "ENCRYPTED_PDF", retryable: false,
          message: "This PDF is password-protected. Please re-export it without encryption.",
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // base64 encode
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      base64 = btoa(bin);
      console.log("[analyze-lab-report] downloaded from storage", {
        bytes: buf.length, durationMs: Date.now() - downloadStart,
      });
    }

    // Resolve MIME by sniffing magic bytes (client-provided type is untrustworthy).
    const lowerName = effectiveFileName.toLowerCase();
    let resolvedMime = mimeType as string | undefined;
    try {
      const headBytes = Uint8Array.from(atob(base64.slice(0, 64)), (c) => c.charCodeAt(0));
      const asAscii = new TextDecoder().decode(headBytes);
      if (asAscii.startsWith("%PDF")) resolvedMime = "application/pdf";
      else if (headBytes[0] === 0xff && headBytes[1] === 0xd8 && headBytes[2] === 0xff) resolvedMime = "image/jpeg";
      else if (headBytes[0] === 0x89 && asAscii.slice(1, 4) === "PNG") resolvedMime = "image/png";
      else if (asAscii.startsWith("RIFF") && asAscii.slice(8, 12) === "WEBP") resolvedMime = "image/webp";
      else if (asAscii.slice(4, 12).includes("ftypheic") || asAscii.slice(4, 12).includes("ftypheix") || asAscii.slice(4, 12).includes("ftypmif1")) resolvedMime = "image/heic";
      else if (!resolvedMime) {
        if (lowerName.endsWith(".pdf")) resolvedMime = "application/pdf";
        else if (lowerName.endsWith(".png")) resolvedMime = "image/png";
        else if (lowerName.endsWith(".webp")) resolvedMime = "image/webp";
        else if (lowerName.endsWith(".heic") || lowerName.endsWith(".heif")) resolvedMime = "image/heic";
        else resolvedMime = "image/jpeg";
      }
    } catch { /* fall through to defaults */ }

    const ALLOWED_MIMES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
    if (!ALLOWED_MIMES.has(resolvedMime!)) {
      return new Response(JSON.stringify({
        ok: false, code: "UNSUPPORTED_CONTENT", retryable: false,
        message: "This file doesn't look like a valid PDF or image. Please re-export your lab report as a PDF, JPG, or PNG.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }




    // Update status & save patient context
    await supabase
      .from("lab_reports")
      .update({
        status: "processing",
        scan_type: scanType === "deep" ? "deep" : "baseline",
        patient_age: age ? Number(age) : null,
        patient_sex: sex || null,
        goals: Array.isArray(goals) ? goals : [],
        peptide_history_used: typeof peptideHistoryUsed === "boolean" ? peptideHistoryUsed : null,
        peptide_history_notes: peptideHistoryNotes || null,
      })
      .eq("id", reportId)
      .eq("user_id", user.id);

    const isDeep = scanType === "deep";

    const systemPrompt = `You are a friendly medical lab report analyzer for the "Peptide South Africa" peptide research community.

The user is requesting a ${isDeep ? "DEEP DECODE" : "BASELINE"} scan.
${isDeep ? "Expand each protocol section to include up to 32 biomarkers across 8 panels and add 4 follow-up retest milestones over 12 months." : "Provide a concise but complete protocol (under 60 seconds of reading)."}

Lab reports may be in ENGLISH or GERMAN — auto-detect the source language.

Common German terms: Blutbild=blood panel, Leberwerte=liver values, Nierenwerte=kidney values, Schilddrüse=thyroid, Cholesterin=cholesterol, Nüchternblutzucker=fasting glucose, Referenzbereich/Normbereich=reference range, Einheit=unit, Wert=value, Gesamttestosteron=total testosterone, Östradiol=estradiol, Insulin=insulin. Decimal commas (5,4) → decimal points (5.4).

BILINGUAL OUTPUT — ALWAYS return every human-readable field in BOTH English and German. Translate accurately using natural, plain layman terms (not literal machine translation). Populate the *_de fields even when the source is English, and populate the English fields even when the source is German.

Personalise the recommendations using the user's age, sex, goals, and peptide history.

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence plain-English overview.",
  "summary_de": "Same 2-3 sentence overview translated to plain German.",
  "report_date": "YYYY-MM-DD or null",
  "detected_language": "en" or "de",
  "health_score": 0-100 (overall health considering all biomarkers and goals),
  "biomarkers": [
    {
      "name": "Full English name",
      "name_de": "German name (e.g. 'Gesamttestosteron', 'Nüchternblutzucker')",
      "short_name": "Abbreviation",
      "value": 123.4,
      "unit": "ng/mL",
      "reference_range": "100-300",
      "status": "normal|high|low|critical",
      "category": "hormone|liver|kidney|lipid|metabolic|thyroid|inflammation|other",
      "layman_explanation": "1 sentence plain English.",
      "layman_explanation_de": "Dieselbe Erklärung auf einfachem Deutsch."
    }
  ],
  "insights": ["6 to 8 plain-English findings, each one short sentence, ordered by importance"],
  "insights_de": ["Same 6-8 findings translated to plain German, same length and order as 'insights'."],
  "protocol": {
    "stack_summary": "1-2 sentence overview of the recommended peptide stack and why it fits the user's goals.",
    "stack": [
      {
        "name": "Peptide name (e.g. Retatrutide)",
        "slug": "retatrutide",
        "priority": "high|medium|low",
        "goals": ["Weight Loss", "Cardiovascular Health"],
        "rationale": "2-3 sentence research-only rationale tied to this user's biomarkers and goals.",
        "dosing": "Typical research dosing line, e.g. '4mg subcutaneous once weekly, 8-12 week cycle'."
      }
    ],
    "supplements": [
      { "name": "Omega-3", "dose": "2g/day", "what_it_is": "Marine fatty acids EPA/DHA.", "why_it_matters": "Lowers triglycerides and inflammation.", "how_to_take": "Take with a meal containing fat." }
    ],
    "nutrition": [
      { "title": "Mediterranean-style eating", "what_it_looks_like": "Olive oil, fish, vegetables, legumes.", "why_adopt": "Improves lipid panel and insulin sensitivity.", "examples": "Salmon + greens + olive oil 4x/week." }
    ],
    "exercise": [{ "title": "Zone-2 cardio 3x/week", "body": "30-45 min nasal-breathing pace to improve mitochondrial density." }],
    "stress": [{ "title": "Daily 10-min nasal breathing", "body": "Down-regulates cortisol; do before bed." }],
    "environment": [{ "title": "Morning sunlight 10 min", "body": "Sets circadian rhythm; supports testosterone and sleep quality." }],
    "retest": [
      { "marker": "HbA1c, fasting glucose", "when": "8 weeks", "why": "Confirm metabolic improvements." }${isDeep ? `,
      { "marker": "Lipid panel", "when": "12 weeks", "why": "Track cholesterol response." },
      { "marker": "IGF-1, hormones", "when": "6 months", "why": "Mid-protocol checkpoint." },
      { "marker": "Full panel", "when": "12 months", "why": "Annual review and protocol adjustment." }` : ""}
    ]
  },
  "recommended_stack_peptides": ["retatrutide", "bpc157"]
}

PEPTIDE GUIDE — recommend by biomarker pattern:
- Low IGF-1 / poor recovery / aging → ipamorelin, cjc1295, tesamorelin, mk677
- High glucose / HbA1c / insulin resistance / weight → retatrutide, tirzepatide, semaglutide, motsc
- High cholesterol / LDL / triglycerides → retatrutide, tirzepatide
- Elevated AST/ALT/GGT / inflammation → bpc157, tb500
- High CRP / chronic inflammation → ta1, bpc157, ghkcu
- Poor sleep / cognition → dsip, selank, semax, epitalon
- Joint/tendon issues → bpc157, tb500, ghkcu
- Mitochondrial decline → motsc, ss31

If the file is unreadable, return:
{"summary":"Unable to read lab report","report_date":null,"detected_language":"en","health_score":null,"biomarkers":[],"insights":["The uploaded file could not be recognised as a lab report."],"protocol":{"stack":[],"supplements":[],"nutrition":[],"exercise":[],"stress":[],"environment":[],"retest":[]},"recommended_stack_peptides":[]}`;

    const userText = [
      `Analyze this lab report (${effectiveFileName}).`,
      `Scan type: ${isDeep ? "Deep Decode" : "Baseline"}.`,
      age ? `Patient age: ${age}.` : "",
      sex && sex !== "na" ? `Patient sex: ${sex}.` : "",
      Array.isArray(goals) && goals.length ? `Goals: ${goals.join(", ")}.` : "",
      typeof peptideHistoryUsed === "boolean"
        ? peptideHistoryUsed
          ? `Prior peptide use: yes${peptideHistoryNotes ? ` — ${peptideHistoryNotes}` : ""}.`
          : "Prior peptide use: no."
        : "",
      languageHint === "en" || languageHint === "de"
        ? `Document language confirmed: ${languageHint === "de" ? "German" : "English"}.`
        : "",
      "Personalise the protocol to these inputs and return the structured JSON.",
    ].filter(Boolean).join(" ");

    const aiStart = Date.now();
    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userText },
                resolvedMime === "application/pdf"
                  ? { type: "file", file: { filename: effectiveFileName, file_data: `data:application/pdf;base64,${base64}` } }
                  : { type: "image_url", image_url: { url: `data:${resolvedMime};base64,${base64}` } },
              ],
            },

          ],
        }),
        signal: AbortSignal.timeout(45_000),
      });
    } catch (e) {
      const isTimeout = (e as Error)?.name === "TimeoutError" || /timeout|abort/i.test(String(e));
      console.error("[analyze-lab-report] AI call failed", { durationMs: Date.now() - aiStart, error: String(e) });
      await supabase.from("lab_reports").update({ status: "failed", ai_summary: isTimeout ? "AI scan timed out." : "AI scan failed." }).eq("id", reportId);
      return new Response(JSON.stringify({
        ok: false,
        code: isTimeout ? "TIMEOUT" : "AI_NETWORK_ERROR",
        retryable: true,
        message: isTimeout
          ? "Scan timed out after 45 seconds. Large or complex reports sometimes need a retry."
          : "Couldn't reach the AI service. Check your connection and retry.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.log("[analyze-lab-report] AI ok", { status: response.status, durationMs: Date.now() - aiStart });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[analyze-lab-report] AI non-2xx", { status: response.status, body: errText.slice(0, 500) });
      if (response.status === 429) {
        await supabase.from("lab_reports").update({ status: "failed", ai_summary: "Rate limited. Please try again in a moment." }).eq("id", reportId);
        return new Response(JSON.stringify({ ok: false, code: "RATE_LIMITED", retryable: true, message: "Too many scans right now. Wait 30 seconds and retry." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        await supabase.from("lab_reports").update({ status: "failed", ai_summary: "AI credits exhausted." }).eq("id", reportId);
        return new Response(JSON.stringify({ ok: false, code: "CREDITS_EXHAUSTED", retryable: false, message: "Scan credits exhausted. Try again later or use manual entry." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ ok: false, code: "AI_GATEWAY_ERROR", retryable: true, message: `AI gateway error (${response.status}). Retry in a moment.` }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let parsed: any;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      parsed = {
        summary: "Failed to parse AI response",
        biomarkers: [],
        insights: [content?.slice(0, 400) || "Parsing error"],
        report_date: null,
        health_score: null,
        protocol: { stack: [], supplements: [], nutrition: [], exercise: [], stress: [], environment: [], retest: [] },
        recommended_stack_peptides: [],
      };
    }

    // Coerce insights to array
    let insightsArr: string[] = [];
    if (Array.isArray(parsed.insights)) insightsArr = parsed.insights.map((s: any) => String(s));
    else if (typeof parsed.insights === "string") insightsArr = parsed.insights.split(/\n+/).map((s: string) => s.trim()).filter(Boolean);

    let insightsDeArr: string[] = [];
    if (Array.isArray(parsed.insights_de)) insightsDeArr = parsed.insights_de.map((s: any) => String(s));
    else if (typeof parsed.insights_de === "string") insightsDeArr = parsed.insights_de.split(/\n+/).map((s: string) => s.trim()).filter(Boolean);

    const healthScore =
      typeof parsed.health_score === "number" && parsed.health_score >= 0 && parsed.health_score <= 100
        ? Math.round(parsed.health_score)
        : null;

    const detectedLang = parsed.detected_language === "de" ? "de" : "en";

    await supabase
      .from("lab_reports")
      .update({
        status: "completed",
        ai_summary: parsed.summary || null,
        ai_summary_de: parsed.summary_de || null,
        extracted_biomarkers: parsed.biomarkers || [],
        ai_insights: insightsArr.join("\n"),
        ai_insights_de: insightsDeArr.join("\n"),
        detected_language: detectedLang,
        report_date: parsed.report_date || null,
        health_score: healthScore,
        protocol: parsed.protocol || null,
        recommended_stack_peptides: Array.isArray(parsed.recommended_stack_peptides)
          ? parsed.recommended_stack_peptides
          : [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({ success: true, data: { ...parsed, insights: insightsArr, insights_de: insightsDeArr, detected_language: detectedLang, health_score: healthScore } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("[analyze-lab-report] unhandled error:", e);
    return new Response(JSON.stringify({
      ok: false,
      code: "INTERNAL_ERROR",
      retryable: true,
      message: (e as Error)?.message?.slice(0, 200) || "Unexpected error. Please retry.",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
