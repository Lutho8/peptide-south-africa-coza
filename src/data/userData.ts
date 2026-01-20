export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
}

export interface BodyComposition {
  date: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  fatFreeWeight: number;
  muscleMass: number;
  skeletalMuscle: number;
  bodyWater: number;
  subcutaneousFat: number;
  visceralFat: number;
  boneMass: number;
  protein: number;
  bmr: number;
  metabolicAge: number;
}

export interface DoseSchedule {
  id: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  frequency: 'daily' | 'weekly' | '2x-week' | '3x-week' | 'custom';
  customDays?: number[];
  time: string;
  status: 'pending' | 'taken' | 'skipped' | 'missed';
  notes?: string;
}

export interface Cycle {
  id: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  frequency: string;
  startDate: string;
  plannedDuration: number; // days
  breakDuration: number; // days
  status: 'active' | 'break' | 'completed';
  notes?: string;
}

export const userProfile: UserProfile = {
  name: 'Lutho Kote',
  age: 33,
  gender: 'male',
  height: 186,
  weight: 105.3,
  activityLevel: 'athlete',
  experience: 'intermediate',
  goals: [
    'Reduce body fat from 19% to 15%',
    'Maintain muscle mass at 81kg+',
    'Optimize metabolic health',
    'Enhance recovery and performance'
  ]
};

export const bodyCompositionHistory: BodyComposition[] = [
  {
    date: '2024-11-22',
    weight: 105.3,
    bmi: 30.4,
    bodyFat: 19.0,
    fatFreeWeight: 85.3,
    muscleMass: 81,
    skeletalMuscle: 52.3,
    bodyWater: 58.5,
    subcutaneousFat: 15.5,
    visceralFat: 13,
    boneMass: 4.3,
    protein: 21.3,
    bmr: 2156,
    metabolicAge: 28
  },
  {
    date: '2024-11-15',
    weight: 106.1,
    bmi: 30.7,
    bodyFat: 19.5,
    fatFreeWeight: 85.4,
    muscleMass: 81.1,
    skeletalMuscle: 52.0,
    bodyWater: 58.2,
    subcutaneousFat: 15.8,
    visceralFat: 13,
    boneMass: 4.3,
    protein: 21.2,
    bmr: 2148,
    metabolicAge: 29
  },
  {
    date: '2024-11-08',
    weight: 106.8,
    bmi: 30.9,
    bodyFat: 20.1,
    fatFreeWeight: 85.3,
    muscleMass: 80.9,
    skeletalMuscle: 51.8,
    bodyWater: 57.9,
    subcutaneousFat: 16.2,
    visceralFat: 14,
    boneMass: 4.3,
    protein: 21.0,
    bmr: 2140,
    metabolicAge: 30
  }
];

export const activeStack = [
  { peptideId: 'ta1', dose: '1.5mg', frequency: '3x weekly' },
  { peptideId: 'epitalon', dose: '10mg', frequency: 'Daily (10 days)' },
  { peptideId: 'semax', dose: '600mcg', frequency: 'Daily intranasal' },
  { peptideId: 'ss31', dose: '5mg', frequency: 'Daily' },
  { peptideId: 'retatrutide', dose: '2mg', frequency: 'Weekly' },
  { peptideId: 'bpc157', dose: '500mcg', frequency: 'Daily' },
  { peptideId: 'tb500', dose: '5mg', frequency: '2x weekly' },
  { peptideId: 'ipamorelin', dose: '200mcg', frequency: 'Before bed' },
  { peptideId: 'cjc1295', dose: '200mcg', frequency: 'Before bed' }
];

export const activeCycles: Cycle[] = [
  {
    id: 'c1',
    peptideId: 'ta1',
    peptideName: 'Thymosin Alpha-1',
    dose: '1.5mg',
    frequency: '3x weekly',
    startDate: '2024-10-01',
    plannedDuration: 90,
    breakDuration: 30,
    status: 'active'
  },
  {
    id: 'c2',
    peptideId: 'retatrutide',
    peptideName: 'Retatrutide',
    dose: '2mg',
    frequency: 'Weekly',
    startDate: '2024-10-15',
    plannedDuration: 120,
    breakDuration: 0,
    status: 'active'
  },
  {
    id: 'c3',
    peptideId: 'ipamorelin',
    peptideName: 'Ipamorelin',
    dose: '200mcg',
    frequency: 'Before bed',
    startDate: '2024-09-01',
    plannedDuration: 180,
    breakDuration: 30,
    status: 'active'
  },
  {
    id: 'c4',
    peptideId: 'epitalon',
    peptideName: 'Epitalon',
    dose: '10mg',
    frequency: 'Daily',
    startDate: '2024-11-01',
    plannedDuration: 10,
    breakDuration: 170,
    status: 'break',
    notes: 'Next cycle: Feb 2025'
  }
];

export const todaysDoses: DoseSchedule[] = [
  {
    id: 'd1',
    peptideId: 'semax',
    peptideName: 'Semax',
    dose: '600mcg',
    frequency: 'daily',
    time: '08:00',
    status: 'taken'
  },
  {
    id: 'd2',
    peptideId: 'ss31',
    peptideName: 'SS-31',
    dose: '5mg',
    frequency: 'daily',
    time: '09:00',
    status: 'taken'
  },
  {
    id: 'd3',
    peptideId: 'bpc157',
    peptideName: 'BPC-157',
    dose: '500mcg',
    frequency: 'daily',
    time: '12:00',
    status: 'pending'
  },
  {
    id: 'd4',
    peptideId: 'ipamorelin',
    peptideName: 'Ipamorelin',
    dose: '200mcg',
    frequency: 'daily',
    time: '22:00',
    status: 'pending'
  },
  {
    id: 'd5',
    peptideId: 'cjc1295',
    peptideName: 'CJC-1295',
    dose: '200mcg',
    frequency: 'daily',
    time: '22:00',
    status: 'pending'
  }
];

export const newsItems = [
  'New study shows BPC-157 accelerates tendon healing by 40% in animal models',
  'Retatrutide Phase 3 trials show 24% body weight reduction at 48 weeks',
  'MOTS-c research reveals potential as exercise mimetic for metabolic health',
  'Epitalon study demonstrates telomere lengthening in human cell cultures',
  'SS-31 clinical trials for heart failure show promising mitochondrial benefits'
];

export const stackOptimizations = [
  {
    title: 'Add GHK-Cu for regeneration',
    description: 'Synergizes with BPC-157 and TB-500 for enhanced tissue repair and anti-aging benefits.',
    priority: 'high'
  },
  {
    title: 'Add MOTS-c for metabolic optimization',
    description: 'Complements Retatrutide for enhanced metabolic flexibility and endurance.',
    priority: 'medium'
  },
  {
    title: 'Optimize Retatrutide timing',
    description: 'Consider morning dosing for better alignment with circadian glucose metabolism.',
    priority: 'low'
  },
  {
    title: 'GH Stack protocol optimization',
    description: 'Add fasted cardio 30 min post-Ipam/CJC injection for enhanced fat oxidation.',
    priority: 'medium'
  },
  {
    title: 'Schedule next Epitalon cycle',
    description: 'Plan February 2025 cycle for continued telomere support.',
    priority: 'low'
  }
];
