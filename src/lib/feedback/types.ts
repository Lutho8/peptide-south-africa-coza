export type MetricType = 'mood' | 'sleep' | 'energy' | 'libido' | 'recovery' | 'focus' | 'appetite' | 'pain';

export interface MetricDefinition {
  type: MetricType;
  label: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  min: number;
  max: number;
}

export interface FeedbackEntry {
  id: string;
  timestamp: string; // ISO date
  metrics: Record<MetricType, number>; // 1-10 scale
  notes?: string;
  linkedDoseId?: string; // optional link to a dose log
  peptideId?: string; // which peptide being tracked
}

export interface CorrelationResult {
  metric: MetricType;
  peptide: string;
  correlation: number; // -1 to 1
  confidence: 'low' | 'medium' | 'high';
  insight: string; // human readable insight
}

export interface WeeklyMetricSummary {
  metric: MetricType;
  currentWeek: {
    average: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    bestDay: string;
    worstDay: string;
    values: number[];
  };
  previousWeek: {
    average: number;
    values: number[];
  };
}

export type FeedbackFilter = 'all' | 'dose-linked' | 'notes-only';
