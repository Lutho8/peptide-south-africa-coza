import { FeedbackEntry, CorrelationResult, MetricType } from './types';

interface DoseLog {
  date: string;
  peptide: string;
  amount: number;
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;

  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const sumX = xSlice.reduce((a, b) => a + b, 0);
  const sumY = ySlice.reduce((a, b) => a + b, 0);
  const sumXY = xSlice.reduce((sum, xi, i) => sum + xi * ySlice[i], 0);
  const sumX2 = xSlice.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = ySlice.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Time-align feedback entries with dose events and calculate correlation.
 * Uses ±1 day window around dose events for comparison.
 */
export function calculateCorrelation(
  feedback: FeedbackEntry[],
  metric: MetricType,
  peptideId: string,
  doseLogs?: DoseLog[]
): CorrelationResult {
  // Filter feedback entries that have this metric recorded
  const relevantFeedback = feedback
    .filter((entry) => entry.metrics[metric] !== undefined)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (relevantFeedback.length < 3) {
    return {
      metric,
      peptide: peptideId,
      correlation: 0,
      confidence: 'low',
      insight: `Not enough data to correlate ${metric} with ${peptideId}. Log more entries to see insights.`,
    };
  }

  // If dose logs provided, do time-aligned comparison
  if (doseLogs && doseLogs.length > 0) {
    const peptideDoses = doseLogs
      .filter((d) => d.peptide.toLowerCase() === peptideId.toLowerCase())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (peptideDoses.length === 0) {
      return {
        metric,
        peptide: peptideId,
        correlation: 0,
        confidence: 'low',
        insight: `No dose records found for ${peptideId}. Start logging doses to see correlations.`,
      };
    }

    // Get metric values on dose days (±1 day window)
    const doseDayValues: number[] = [];
    const nonDoseDayValues: number[] = [];

    const doseDates = new Set(
      peptideDoses.map((d) => new Date(d.date).toISOString().split('T')[0])
    );

    for (const entry of relevantFeedback) {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      const value = entry.metrics[metric];

      // Check if within 1 day of any dose
      let isDoseDay = false;
      for (const doseDate of doseDates) {
        const diff = Math.abs(
          new Date(entryDate).getTime() - new Date(doseDate).getTime()
        );
        if (diff <= 86400000) {
          // 1 day in ms
          isDoseDay = true;
          break;
        }
      }

      if (isDoseDay) {
        doseDayValues.push(value);
      } else {
        nonDoseDayValues.push(value);
      }
    }

    if (doseDayValues.length > 0 && nonDoseDayValues.length > 0) {
      const doseAvg = doseDayValues.reduce((a, b) => a + b, 0) / doseDayValues.length;
      const nonDoseAvg = nonDoseDayValues.reduce((a, b) => a + b, 0) / nonDoseDayValues.length;
      const percentDiff = nonDoseAvg === 0 ? 0 : ((doseAvg - nonDoseAvg) / nonDoseAvg) * 100;

      // Calculate correlation using binary dose indicator
      const allDates = [
        ...new Set(relevantFeedback.map((e) => e.timestamp.split('T')[0])),
      ].sort();
      const metricValues = allDates.map(
        (date) =>
          relevantFeedback.find((e) => e.timestamp.startsWith(date))?.metrics[metric] ?? 0
      );
      const doseIndicators = allDates.map((date) => {
        for (const dd of doseDates) {
          const diff = Math.abs(new Date(date).getTime() - new Date(dd).getTime());
          if (diff <= 86400000) return 1;
        }
        return 0;
      });

      const correlation = pearsonCorrelation(metricValues, doseIndicators);
      const absCorrelation = Math.abs(correlation);
      const confidence =
        absCorrelation > 0.5 ? 'high' : absCorrelation > 0.25 ? 'medium' : 'low';

      const direction = percentDiff > 0 ? 'higher' : 'lower';
      const insight =
        absCorrelation > 0.15
          ? `Your ${metric} scores are ${Math.abs(percentDiff).toFixed(0)}% ${direction} on ${peptideId} dosing days (correlation: ${correlation.toFixed(2)}).`
          : `No strong correlation detected between ${peptideId} and ${metric}. Keep logging for more accurate insights.`;

      return { metric, peptide: peptideId, correlation, confidence, insight };
    }
  }

  // Fallback: basic average-based insight
  const values = relevantFeedback.map((e) => e.metrics[metric]);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const trend = values[values.length - 1] - values[0];
  const correlation = Math.max(-1, Math.min(1, trend / 10));

  return {
    metric,
    peptide: peptideId,
    correlation,
    confidence: 'low',
    insight:
      trend > 0.5
        ? `Your ${metric} has trended upward by ${trend.toFixed(1)} points since you started tracking ${peptideId}.`
        : trend < -0.5
          ? `Your ${metric} has trended downward by ${Math.abs(trend).toFixed(1)} points since starting ${peptideId}.`
          : `No clear trend in ${metric} yet for ${peptideId}. Continue logging for more insights.`,
  };
}

/**
 * Calculate correlations for all metric-peptide pairs
 */
export function calculateAllCorrelations(
  feedback: FeedbackEntry[],
  peptides: string[],
  doseLogs?: DoseLog[]
): CorrelationResult[] {
  const results: CorrelationResult[] = [];
  const metricTypes: MetricType[] = ['mood', 'sleep', 'energy', 'libido', 'recovery', 'focus'];

  for (const peptide of peptides) {
    for (const metric of metricTypes) {
      results.push(calculateCorrelation(feedback, metric, peptide, doseLogs));
    }
  }

  // Sort by absolute correlation strength
  return results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}
