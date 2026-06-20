import { MetricDefinition, MetricType } from './types';

const METRICS: MetricDefinition[] = [
  {
    type: 'mood',
    label: 'Mood',
    icon: 'Smile',
    color: 'text-amber-500',
    min: 1,
    max: 10,
  },
  {
    type: 'sleep',
    label: 'Sleep Quality',
    icon: 'Moon',
    color: 'text-indigo-500',
    min: 1,
    max: 10,
  },
  {
    type: 'energy',
    label: 'Energy',
    icon: 'Zap',
    color: 'text-yellow-500',
    min: 1,
    max: 10,
  },
  {
    type: 'libido',
    label: 'Libido',
    icon: 'Heart',
    color: 'text-rose-500',
    min: 1,
    max: 10,
  },
  {
    type: 'recovery',
    label: 'Recovery',
    icon: 'Activity',
    color: 'text-emerald-500',
    min: 1,
    max: 10,
  },
  {
    type: 'focus',
    label: 'Focus',
    icon: 'Target',
    color: 'text-cyan-500',
    min: 1,
    max: 10,
  },
  {
    type: 'appetite',
    label: 'Appetite',
    icon: 'Utensils',
    color: 'text-orange-500',
    min: 1,
    max: 10,
  },
  {
    type: 'pain',
    label: 'Pain Level',
    icon: 'Flame',
    color: 'text-red-500',
    min: 1,
    max: 10,
  },
];

export function getMetricLabel(type: MetricType): string {
  return METRICS.find((m) => m.type === type)?.label ?? type;
}

export function getMetricColor(type: MetricType): string {
  return METRICS.find((m) => m.type === type)?.color ?? 'text-gray-500';
}

export function getMetricIcon(type: MetricType): string {
  return METRICS.find((m) => m.type === type)?.icon ?? 'Circle';
}

export function getAllMetrics(): MetricDefinition[] {
  return [...METRICS];
}

export function getDefaultMetrics(): Record<MetricType, number> {
  return {
    mood: 5,
    sleep: 5,
    energy: 5,
    libido: 5,
    recovery: 5,
    focus: 5,
    appetite: 5,
    pain: 5,
  };
}
