import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AISafetyResult = {
  status: "safe" | "caution" | "contraindicated" | "unknown";
  severity: "info" | "warning" | "danger";
  warnings: string[];
  contraindications: string[];
  reasoning: string;
  cached?: boolean;
};

type ProfilePayload = {
  medications?: string[];
  conditions?: string[];
  allergies?: string[];
  is_pregnant?: boolean;
  age?: number;
  sex?: string | null;
  weight_kg?: number | null;
  kidney_status?: string | null;
  liver_status?: string | null;
  oncology_history?: boolean;
};

/**
 * Calls the safety-check edge function for AI-assisted clinical review.
 * Returns null when not authenticated.
 */
export function useAISafetyCheck() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AISafetyResult | null>(null);

  const run = useCallback(async (peptideId: string, peptideName: string, profile: ProfilePayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke("safety-check", {
        body: { peptideId, peptideName, profile },
      });
      if (invokeErr) throw invokeErr;
      if (data?.error) throw new Error(data.error);
      setResult(data as AISafetyResult);
      return data as AISafetyResult;
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error, result };
}
