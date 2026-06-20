import { useState, useCallback, useMemo, useEffect } from "react";
import { FeedbackEntry, CorrelationResult } from "@/types";

const STORAGE_KEY = "peptide_feedback_entries";

function loadEntries(): FeedbackEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FeedbackEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length || n < 3) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Group entries by peptide and metric, then calculate correlations.
 * For simplicity, we correlate dose amount with each metric.
 */
function calculateCorrelations(entries: FeedbackEntry[]): CorrelationResult[] {
  if (entries.length < 3) return [];

  // Group by peptideId
  const byPeptide: Record<string, FeedbackEntry[]> = {};
  for (const entry of entries) {
    if (!byPeptide[entry.peptideId]) byPeptide[entry.peptideId] = [];
    byPeptide[entry.peptideId].push(entry);
  }

  const results: CorrelationResult[] = [];

  for (const [peptideId, peptideEntries] of Object.entries(byPeptide)) {
    // Group by metric
    const byMetric: Record<string, FeedbackEntry[]> = {};
    for (const entry of peptideEntries) {
      if (!byMetric[entry.metric]) byMetric[entry.metric] = [];
      byMetric[entry.metric].push(entry);
    }

    for (const [metric, metricEntries] of Object.entries(byMetric)) {
      if (metricEntries.length < 3) continue;

      // Extract day indices and values
      const sorted = [...metricEntries].sort((a, b) => a.timestamp - b.timestamp);
      const values = sorted.map((e) => e.value);

      // Create pseudo-time series (days since first entry)
      const firstDay = sorted[0].timestamp;
      const days = sorted.map((e) => (e.timestamp - firstDay) / (1000 * 60 * 60 * 24));

      // Correlate metric value with time (is it improving/degrading over time?)
      const correlation = pearsonCorrelation(days, values);

      let trend: CorrelationResult["trend"] = "none";
      if (correlation > 0.3) trend = "positive";
      else if (correlation < -0.3) trend = "negative";

      let insight = "No significant trend detected";
      if (trend === "positive") {
        insight = `Your ${metric} has been trending upward over time`;
      } else if (trend === "negative") {
        insight = `Your ${metric} has been trending downward over time`;
      }

      // Calculate confidence based on sample size
      const confidence = Math.min(sorted.length / 10, 1);

      results.push({
        peptideId,
        metric,
        correlation,
        trend,
        insight,
        confidence,
      });
    }
  }

  return results;
}

/**
 * Hook: useFeedback
 * Manages bio-feedback entries with localStorage persistence.
 * Automatically calculates correlations when entries change.
 */
export function useFeedback(): {
  entries: FeedbackEntry[];
  addEntry: (entry: FeedbackEntry) => void;
  correlations: CorrelationResult[];
} {
  const [entries, setEntries] = useState<FeedbackEntry[]>(loadEntries);

  // Persist to localStorage whenever entries change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addEntry = useCallback((entry: FeedbackEntry) => {
    setEntries((prev) => {
      const updated = [...prev, entry];
      saveEntries(updated);
      return updated;
    });
  }, []);

  const correlations = useMemo(() => calculateCorrelations(entries), [entries]);

  return { entries, addEntry, correlations };
}
