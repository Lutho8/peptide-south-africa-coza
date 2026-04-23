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

    const { reportId, imageBase64, fileName, mimeType, languageHint } = await req.json();
    if (!reportId || !imageBase64) throw new Error("Missing reportId or imageBase64");

    // Determine MIME type — accept PDF or image. Default to JPEG for legacy callers.
    const lowerName = (fileName || "").toLowerCase();
    let resolvedMime = mimeType as string | undefined;
    if (!resolvedMime) {
      if (lowerName.endsWith(".pdf")) resolvedMime = "application/pdf";
      else if (lowerName.endsWith(".png")) resolvedMime = "image/png";
      else if (lowerName.endsWith(".webp")) resolvedMime = "image/webp";
      else resolvedMime = "image/jpeg";
    }

    // Update status to processing
    await supabase
      .from("lab_reports")
      .update({ status: "processing" })
      .eq("id", reportId)
      .eq("user_id", user.id);

    const systemPrompt = `You are a friendly medical lab report analyzer for a peptide research community. Lab reports may be in ENGLISH or GERMAN — auto-detect the language, but ALWAYS write your output in ENGLISH using simple layman's terms (avoid medical jargon, or explain it briefly in parentheses).

Common German terms to recognize:
- "Blutbild" = blood panel, "Leberwerte" = liver values, "Nierenwerte" = kidney values
- "Schilddrüse" = thyroid, "Cholesterin" = cholesterol, "Nüchternblutzucker" = fasting glucose
- "Referenzbereich"/"Normbereich" = reference range, "Einheit" = unit, "Wert" = value
- "Gesamttestosteron" = total testosterone, "Östradiol" = estradiol, "Insulin" = insulin
- Decimal commas (e.g. "5,4") should be parsed as decimal points (5.4)

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence plain-English overview a non-doctor can understand. Mention overall picture (e.g. 'Most values look healthy, but cholesterol is slightly high').",
  "report_date": "YYYY-MM-DD or null if not found",
  "detected_language": "en" or "de",
  "biomarkers": [
    {
      "name": "Biomarker full name in English",
      "short_name": "Abbreviation (e.g. IGF-1, TSH, ALT)",
      "value": 123.4,
      "unit": "ng/mL",
      "reference_range": "100-300",
      "status": "normal|high|low|critical",
      "category": "hormone|liver|kidney|lipid|metabolic|thyroid|inflammation",
      "layman_explanation": "1 sentence in plain English explaining what this marker means and what the result indicates.",
      "suggested_peptides": [
        { "id": "ipamorelin", "name": "Ipamorelin", "rank": 1, "reason": "1-line research-only rationale tied to THIS marker (e.g. 'May support IGF-1 by stimulating GH pulses')." }
      ]
    }
  ],
  "insights": "Markdown-formatted layman analysis with these sections:\\n\\n### What this means for you\\n(plain English summary of out-of-range values and what they typically indicate — no medical jargon)\\n\\n### Lifestyle suggestions\\n(diet, sleep, exercise tips relevant to the findings)\\n\\n### Peptide protocols to consider\\n(recommend specific peptides from the list below that may help optimize the out-of-range markers, with a 1-line reason for each. Frame as 'research-only' suggestions, not medical advice. Use bullet points.)\\n\\n### When to see a doctor\\n(red flags that warrant professional consultation)",
  "recommended_peptides": ["peptide_id_1", "peptide_id_2"]
}

For EACH biomarker, populate "suggested_peptides" with 0–3 entries ranked by relevance (rank 1 = best match). Only include peptides for markers that are out of range (high/low/critical) OR that the peptide is well-known to optimize. For "normal" markers with no clear optimization angle, return an empty array. Use only peptide IDs from the list below.

PEPTIDE OPTIMIZATION GUIDE — recommend from these IDs based on findings:
- Low IGF-1 / poor recovery / aging concerns → ipamorelin, cjc1295, tesamorelin, mk677
- High glucose / HbA1c / insulin resistance / weight → retatrutide, tirzepatide, semaglutide, motsc
- High cholesterol / LDL / triglycerides → retatrutide, tirzepatide
- Elevated liver enzymes (AST/ALT/GGT) / inflammation → bpc157, tb500
- High CRP / chronic inflammation / immune issues → ta1 (thymosin alpha-1), bpc157, ghkcu
- Low testosterone (men) → recommend bloodwork follow-up + lifestyle (no peptide directly raises T safely)
- Poor sleep / cognition → dsip, selank, semax, epitalon
- Joint/tendon issues / slow healing → bpc157, tb500, ghkcu
- Mitochondrial / metabolic decline → motsc, ss31

Match biomarker names to these known IDs when possible: igf1, testosterone, freeT, estradiol, ast, alt, ggt, totalCholesterol, ldl, hdl, triglycerides, fastingGlucose, hba1c, insulin, creatinine, bun, tsh, freeT4, crp, homocysteine.

If the file is not a lab report or is unreadable, return:
{"summary": "Unable to read lab report", "biomarkers": [], "insights": "The uploaded file could not be recognized as a lab report. Please upload a clear photo or PDF of your bloodwork results.", "report_date": null, "detected_language": "en", "recommended_peptides": []}`;

    let userText = `Analyze this lab report (${fileName}). The file may be in English or German — translate findings to plain English. Extract all biomarker values, explain them in layman's terms, and recommend peptide protocols that could help optimize any out-of-range markers.`;
    if (languageHint === 'en' || languageHint === 'de') {
      userText += `\nUser has confirmed the document language is ${languageHint === 'de' ? 'German' : 'English'} — treat it accordingly and set detected_language to "${languageHint}".`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              {
                type: "image_url",
                image_url: { url: `data:${resolvedMime};base64,${imageBase64}` },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        await supabase.from("lab_reports").update({ status: "failed", ai_summary: "Rate limited. Please try again in a moment." }).eq("id", reportId);
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        await supabase.from("lab_reports").update({ status: "failed", ai_summary: "AI credits exhausted." }).eq("id", reportId);
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      parsed = { summary: "Failed to parse AI response", biomarkers: [], insights: content, report_date: null };
    }

    // Update the report with extracted data
    await supabase
      .from("lab_reports")
      .update({
        status: "completed",
        ai_summary: parsed.summary,
        extracted_biomarkers: parsed.biomarkers || [],
        ai_insights: parsed.insights,
        report_date: parsed.report_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-lab-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
