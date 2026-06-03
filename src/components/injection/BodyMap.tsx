import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Navigation, AlertTriangle, Clock, CheckCircle2, XCircle, RotateCcw, Zap, Syringe } from 'lucide-react';
import { InjectionSite, INJECTION_SITES, ZONE_INFO } from '@/lib/injection/sites';
import { getSiteStatus, isSiteAvailable } from '@/lib/injection/rotation';

interface BodyMapProps {
  selectedSite?: string;
  onSiteSelect: (siteId: string) => void;
  suggestedSite?: string;
  disabledSites?: string[];
}

type ViewMode = 'front' | 'back';

const STATUS_CONFIG = {
  available: {
    fill: '#10b981',
    ring: 'ring-emerald-500',
    bg: 'bg-emerald-500',
    label: 'Available',
    icon: CheckCircle2,
  },
  recent: {
    fill: '#f59e0b',
    ring: 'ring-amber-500',
    bg: 'bg-amber-500',
    label: 'Recent (<48h)',
    icon: Clock,
  },
  disabled: {
    fill: '#ef4444',
    ring: 'ring-red-500',
    bg: 'bg-red-500',
    label: 'Disabled',
    icon: XCircle,
  },
  injured: {
    fill: '#ef4444',
    ring: 'ring-red-600',
    bg: 'bg-red-600',
    label: 'Injured',
    icon: AlertTriangle,
  },
  suggested: {
    fill: '#3b82f6',
    ring: 'ring-blue-500',
    bg: 'bg-blue-500',
    label: 'Suggested Next',
    icon: Zap,
  },
};

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedSite,
  onSiteSelect,
  suggestedSite,
  disabledSites = [],
}) => {
  const [view, setView] = useState<ViewMode>('front');
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  const handleSiteClick = useCallback(
    (siteId: string) => {
      const status = getSiteStatus(siteId);
      if (status === 'disabled' || status === 'injured') return;
      onSiteSelect(siteId);
    },
    [onSiteSelect]
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full">
        {/* Header with view toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Injection Site Map</span>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView('front')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                view === 'front'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Front
            </button>
            <button
              onClick={() => setView('back')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                view === 'back'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Back
            </button>
          </div>
        </div>

        {/* SVG Body Map */}
        <div className="relative bg-gradient-to-b from-muted/50 to-background rounded-xl border border-border overflow-hidden">
          <svg
            viewBox="0 0 200 360"
            className="w-full max-w-[280px] mx-auto"
            style={{ height: 'auto' }}
          >
            {/* Background gradient */}
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--muted)" stopOpacity={0.3} />
                <stop offset="50%" stopColor="var(--muted)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--muted)" stopOpacity={0.3} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Body Silhouette */}
            {view === 'front' ? (
              <FrontBodyShape />
            ) : (
              <BackBodyShape />
            )}

            {/* Zone labels */}
            <text x="100" y="18" textAnchor="middle" className="text-[6px]" fill="var(--muted-foreground)">
              DELTOIDS
            </text>
            <text x="100" y="65" textAnchor="middle" className="text-[6px]" fill="var(--muted-foreground)">
              TRICEPS
            </text>
            <text x="100" y="100" textAnchor="middle" className="text-[6px]" fill="var(--muted-foreground)">
              ABDOMEN
            </text>
            <text x="100" y="155" textAnchor="middle" className="text-[6px]" fill="var(--muted-foreground)">
              THIGHS
            </text>
            <text x="100" y="215" textAnchor="middle" className="text-[6px]" fill="var(--muted-foreground)">
              GLUTES
            </text>

            {/* Injection Site Dots */}
            {INJECTION_SITES.filter((site) => {
              if (view === 'back') {
                // On back view, show glutes, triceps, deltoid lateral
                return (
                  site.zone === 'glute' ||
                  site.zone === 'tricep' ||
                  (site.zone === 'deltoid' && site.id.includes('lat'))
                );
              }
              // Front view: hide glutes and triceps
              return site.zone !== 'glute' && site.zone !== 'tricep';
            }).map((site) => {
              let status = getSiteStatus(site.id);
              const isSelected = selectedSite === site.id;
              const isSuggested = suggestedSite === site.id;
              const isDisabled = disabledSites.includes(site.id) || status === 'disabled';
              const isHovered = hoveredSite === site.id;

              // Override status for visual
              if (isSuggested) status = 'suggested';
              const config = STATUS_CONFIG[status];

              const x = (site.svgX / 100) * 200;
              const y = (site.svgY / 100) * 360;

              return (
                <g
                  key={site.id}
                  onClick={() => handleSiteClick(site.id)}
                  onMouseEnter={() => setHoveredSite(site.id)}
                  onMouseLeave={() => setHoveredSite(null)}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  {/* Ripple for suggested */}
                  {isSuggested && (
                    <circle cx={x} cy={y} r="10" fill="none" stroke={config.fill} strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Selection ring */}
                  {isSelected && (
                    <circle cx={x} cy={y} r="8" fill="none" stroke="var(--primary)" strokeWidth="2" opacity="0.8" />
                  )}

                  {/* Main dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : isSelected ? 6 : 5}
                    fill={config.fill}
                    opacity={isDisabled ? 0.4 : isHovered ? 1 : 0.85}
                    stroke="white"
                    strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                    filter={isHovered ? 'url(#glow)' : undefined}
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* Label on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={x - 40}
                        y={y - 22}
                        width="80"
                        height="14"
                        rx="3"
                        fill="var(--card)"
                        stroke="var(--border)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={x}
                        y={y - 13}
                        textAnchor="middle"
                        className="text-[5px]"
                        fill="var(--foreground)"
                        fontWeight="600"
                      >
                        {site.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG['available']][])
            .filter(([key]) => key !== 'injured')
            .map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <Icon className={cn('h-3 w-3', config.bg.replace('bg-', 'text-'))} />
                  <span className="text-[10px] text-muted-foreground">{config.label}</span>
                </div>
              );
            })}
        </div>

        {/* Zone breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {['deltoid', 'abdomen', 'thigh', 'glute'].map((zone) => {
            const zoneSites = INJECTION_SITES.filter((s) => s.zone === zone);
            const available = zoneSites.filter((s) => isSiteAvailable(s.id)).length;
            const label = ZONE_INFO[zone as keyof typeof ZONE_INFO]?.label ?? zone;

            return (
              <div
                key={zone}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50"
              >
                <span className="text-xs font-medium text-foreground capitalize">{label}</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                  {available}/{zoneSites.length} available
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

/* Simple SVG body silhouettes */
const FrontBodyShape: React.FC = () => (
  <g fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="0.75">
    {/* Head */}
    <ellipse cx="100" cy="22" rx="16" ry="20" />
    {/* Neck */}
    <rect x="92" y="38" width="16" height="12" rx="4" />
    {/* Torso */}
    <path d="M 68 50 Q 65 55 65 65 L 62 140 Q 62 150 70 155 L 130 155 Q 138 150 138 140 L 135 65 Q 135 55 132 50 L 120 48 Q 115 45 100 45 Q 85 45 80 48 Z" />
    {/* Left Arm */}
    <path d="M 65 52 Q 45 58 35 80 L 28 120 Q 26 128 30 130 L 38 128 Q 42 126 44 118 L 52 85 Q 56 68 65 62" />
    {/* Right Arm */}
    <path d="M 135 52 Q 155 58 165 80 L 172 120 Q 174 128 170 130 L 162 128 Q 158 126 156 118 L 148 85 Q 144 68 135 62" />
    {/* Left Leg */}
    <path d="M 72 155 L 60 220 Q 58 240 62 260 L 65 320 Q 66 330 72 332 L 84 330 Q 88 328 88 318 L 86 260 Q 86 240 90 220 L 96 155" />
    {/* Right Leg */}
    <path d="M 128 155 L 140 220 Q 142 240 138 260 L 135 320 Q 134 330 128 332 L 116 330 Q 112 328 112 318 L 114 260 Q 114 240 110 220 L 104 155" />
  </g>
);

const BackBodyShape: React.FC = () => (
  <g fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="0.75">
    {/* Head */}
    <ellipse cx="100" cy="22" rx="16" ry="20" />
    {/* Neck */}
    <rect x="92" y="38" width="16" height="12" rx="4" />
    {/* Torso */}
    <path d="M 72 50 Q 68 55 66 65 L 62 140 Q 62 150 70 155 L 130 155 Q 138 150 138 140 L 134 65 Q 132 55 128 50 L 120 48 Q 115 45 100 45 Q 85 45 80 48 Z" />
    {/* Left Arm */}
    <path d="M 68 52 Q 48 58 38 80 L 30 120 Q 28 128 32 130 L 40 128 Q 44 126 46 118 L 54 85 Q 58 68 66 62" />
    {/* Right Arm */}
    <path d="M 132 52 Q 152 58 162 80 L 170 120 Q 172 128 168 130 L 160 128 Q 156 126 154 118 L 146 85 Q 142 68 134 62" />
    {/* Left Leg */}
    <path d="M 74 155 L 62 220 Q 60 240 64 260 L 67 320 Q 68 330 74 332 L 86 330 Q 90 328 90 318 L 88 260 Q 88 240 92 220 L 98 155" />
    {/* Right Leg */}
    <path d="M 126 155 L 138 220 Q 140 240 136 260 L 133 320 Q 132 330 126 332 L 114 330 Q 110 328 110 318 L 112 260 Q 112 240 108 220 L 102 155" />
  </g>
);

BodyMap.displayName = 'BodyMap';
