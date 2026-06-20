export type InjectionZone =
  | 'deltoid'
  | 'abdomen'
  | 'thigh'
  | 'glute'
  | 'tricep'
  | 'love-handle'
  | 'chest'
  | 'calf';

export type InjectionMethod = 'subq' | 'im';
export type Side = 'left' | 'right' | 'center';

export interface InjectionSite {
  id: string;
  name: string;
  zone: InjectionZone;
  side: Side;
  method: InjectionMethod[];
  svgX: number; // percentage 0-100 for SVG positioning
  svgY: number;
  disabled?: boolean;
  lastUsed?: string; // ISO date
}

export const INJECTION_SITES: InjectionSite[] = [
  // Deltoids (4 sites) - IM
  {
    id: 'delt-left-front',
    name: 'Left Deltoid (Front)',
    zone: 'deltoid',
    side: 'left',
    method: ['im'],
    svgX: 22,
    svgY: 28,
  },
  {
    id: 'delt-left-lat',
    name: 'Left Deltoid (Lateral)',
    zone: 'deltoid',
    side: 'left',
    method: ['im'],
    svgX: 12,
    svgY: 26,
  },
  {
    id: 'delt-right-front',
    name: 'Right Deltoid (Front)',
    zone: 'deltoid',
    side: 'right',
    method: ['im'],
    svgX: 78,
    svgY: 28,
  },
  {
    id: 'delt-right-lat',
    name: 'Right Deltoid (Lateral)',
    zone: 'deltoid',
    side: 'right',
    method: ['im'],
    svgX: 88,
    svgY: 26,
  },

  // Abdomen (6 sites) - SubQ
  {
    id: 'abd-left-upper',
    name: 'Left Abdomen (Upper)',
    zone: 'abdomen',
    side: 'left',
    method: ['subq'],
    svgX: 38,
    svgY: 44,
  },
  {
    id: 'abd-left-lower',
    name: 'Left Abdomen (Lower)',
    zone: 'abdomen',
    side: 'left',
    method: ['subq'],
    svgX: 38,
    svgY: 54,
  },
  {
    id: 'abd-center',
    name: 'Center Abdomen',
    zone: 'abdomen',
    side: 'center',
    method: ['subq'],
    svgX: 50,
    svgY: 48,
  },
  {
    id: 'abd-right-upper',
    name: 'Right Abdomen (Upper)',
    zone: 'abdomen',
    side: 'right',
    method: ['subq'],
    svgX: 62,
    svgY: 44,
  },
  {
    id: 'abd-right-lower',
    name: 'Right Abdomen (Lower)',
    zone: 'abdomen',
    side: 'right',
    method: ['subq'],
    svgX: 62,
    svgY: 54,
  },

  // Thighs (4 sites) - IM + SubQ
  {
    id: 'thigh-left-outer',
    name: 'Left Thigh (Outer)',
    zone: 'thigh',
    side: 'left',
    method: ['im', 'subq'],
    svgX: 30,
    svgY: 62,
  },
  {
    id: 'thigh-left-inner',
    name: 'Left Thigh (Inner)',
    zone: 'thigh',
    side: 'left',
    method: ['subq'],
    svgX: 44,
    svgY: 62,
  },
  {
    id: 'thigh-right-outer',
    name: 'Right Thigh (Outer)',
    zone: 'thigh',
    side: 'right',
    method: ['im', 'subq'],
    svgX: 70,
    svgY: 62,
  },
  {
    id: 'thigh-right-inner',
    name: 'Right Thigh (Inner)',
    zone: 'thigh',
    side: 'right',
    method: ['subq'],
    svgX: 56,
    svgY: 62,
  },

  // Glutes (2 sites) - IM
  {
    id: 'glute-left',
    name: 'Left Glute',
    zone: 'glute',
    side: 'left',
    method: ['im'],
    svgX: 35,
    svgY: 74,
  },
  {
    id: 'glute-right',
    name: 'Right Glute',
    zone: 'glute',
    side: 'right',
    method: ['im'],
    svgX: 65,
    svgY: 74,
  },

  // Triceps (2 sites) - IM
  {
    id: 'tricep-left',
    name: 'Left Tricep',
    zone: 'tricep',
    side: 'left',
    method: ['im'],
    svgX: 18,
    svgY: 36,
  },
  {
    id: 'tricep-right',
    name: 'Right Tricep',
    zone: 'tricep',
    side: 'right',
    method: ['im'],
    svgX: 82,
    svgY: 36,
  },
];

// Zone display info
export const ZONE_INFO: Record<
  InjectionZone,
  { label: string; description: string; typicalMethods: InjectionMethod[] }
> = {
  deltoid: {
    label: 'Deltoid',
    description: 'Shoulder muscle - good for IM injections',
    typicalMethods: ['im'],
  },
  abdomen: {
    label: 'Abdomen',
    description: 'Belly fat area - most common for SubQ',
    typicalMethods: ['subq'],
  },
  thigh: {
    label: 'Thigh',
    description: 'Upper leg - versatile for IM and SubQ',
    typicalMethods: ['im', 'subq'],
  },
  glute: {
    label: 'Glute',
    description: 'Buttock muscle - good for larger IM volumes',
    typicalMethods: ['im'],
  },
  tricep: {
    label: 'Tricep',
    description: 'Back of upper arm - alternative IM site',
    typicalMethods: ['im'],
  },
  'love-handle': {
    label: 'Love Handle',
    description: 'Side fat pad - SubQ alternative',
    typicalMethods: ['subq'],
  },
  chest: {
    label: 'Chest',
    description: 'Pectoral area - less common',
    typicalMethods: ['subq'],
  },
  calf: {
    label: 'Calf',
    description: 'Lower leg - occasional SubQ use',
    typicalMethods: ['subq'],
  },
};

export function getSitesByZone(zone: InjectionZone): InjectionSite[] {
  return INJECTION_SITES.filter((s) => s.zone === zone);
}

export function getSiteById(id: string): InjectionSite | undefined {
  return INJECTION_SITES.find((s) => s.id === id);
}

export function getAllSites(): InjectionSite[] {
  return [...INJECTION_SITES];
}

export function getAllZones(): InjectionZone[] {
  return [
    'deltoid',
    'abdomen',
    'thigh',
    'glute',
    'tricep',
    'love-handle',
    'chest',
    'calf',
  ];
}
