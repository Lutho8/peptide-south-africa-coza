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

    const { reportId, imageBase64, fileName } = await req.json();
    if (!reportId || !imageBase64) throw new Error("Missing reportId or imageBase64");

    // Update status to processing
    await supabase
      .from("lab_reports")
      .update({ status: "processing" })
      .eq("id", reportId)
      .eq("user_id", user.id);

    const systemPrompt = `You are a medical lab report analyzer. Extract biomarker values from lab reports.

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "summary": "Brief summary of the lab report",
  "report_date": "YYYY-MM-DD or null if not found",
  "biomarkers": [
    {
      "name": "Biomarker full name",
      "short_name": "Abbreviation (e.g. IGF-1, TSH, ALT)",
      "value": 123.4,
      "unit": "ng/mL",
      "reference_range": "100-300",
      "status": "normal|high|low|critical",
      "category": "hormone|liver|kidney|lipid|metabolic|thyroid|inflammation"
    }
  ],
  "insights": "AI analysis of the results including trends, concerns, and recommendations. Mention any values outside normal range and what they might indicate for someone on a peptide protocol."
}

Match biomarker names to these known IDs when possible: igf1, testosterone, freeT, estradiol, ast, alt, ggt, totalCholesterol, ldl, hdl, triglycerides, fastingGlucose, hba1c, insulin, creatinine, bun, tsh, freeT4, crp, homocysteine.

If the image is not a lab report or is unreadable, return:
{"summary": "Unable to read lab report", "biomarkers": [], "insights": "The uploaded image could not be recognized as a lab report. Please upload a clear photo or PDF of your bloodwork results.", "report_date": null}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this lab report image (${fileName}). Extract all biomarker values you can find and provide insights.`,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
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
