// Bloodwork biomarker definitions with normal ranges and monitoring recommendations

export interface Biomarker {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  category: 'hormone' | 'liver' | 'kidney' | 'lipid' | 'metabolic' | 'thyroid' | 'inflammation';
  normalRange: {
    male: { min: number; max: number };
    female: { min: number; max: number };
  };
  optimalRange?: {
    male: { min: number; max: number };
    female: { min: number; max: number };
  };
  description: string;
  peptideRelevance: string[];
  monitoringFrequency: string;
  warningThreshold: {
    low?: number;
    high?: number;
  };
}

export interface BloodworkEntry {
  id: string;
  date: string;
  biomarkerId: string;
  value: number;
  notes?: string;
}

export const biomarkers: Biomarker[] = [
  // Hormones
  {
    id: 'igf1',
    name: 'Insulin-like Growth Factor 1',
    shortName: 'IGF-1',
    unit: 'ng/mL',
    category: 'hormone',
    normalRange: {
      male: { min: 100, max: 300 },
      female: { min: 100, max: 300 }
    },
    optimalRange: {
      male: { min: 150, max: 250 },
      female: { min: 150, max: 250 }
    },
    description: 'Primary marker for GH activity. Elevated by GH secretagogues.',
    peptideRelevance: ['ipamorelin', 'cjc1295', 'tesamorelin'],
    monitoringFrequency: 'Every 8-12 weeks when using GH peptides',
    warningThreshold: { high: 350 }
  },
  {
    id: 'testosterone',
    name: 'Total Testosterone',
    shortName: 'Test',
    unit: 'ng/dL',
    category: 'hormone',
    normalRange: {
      male: { min: 300, max: 1000 },
      female: { min: 15, max: 70 }
    },
    optimalRange: {
      male: { min: 500, max: 800 },
      female: { min: 25, max: 50 }
    },
    description: 'Primary male sex hormone. Monitor for overall hormonal health.',
    peptideRelevance: ['bpc157', 'tb500'],
    monitoringFrequency: 'Every 12 weeks or with symptoms',
    warningThreshold: { low: 250 }
  },
  {
    id: 'freeT',
    name: 'Free Testosterone',
    shortName: 'Free T',
    unit: 'pg/mL',
    category: 'hormone',
    normalRange: {
      male: { min: 50, max: 210 },
      female: { min: 1, max: 8 }
    },
    description: 'Bioavailable testosterone fraction.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { low: 40 }
  },
  {
    id: 'estradiol',
    name: 'Estradiol (E2)',
    shortName: 'E2',
    unit: 'pg/mL',
    category: 'hormone',
    normalRange: {
      male: { min: 10, max: 40 },
      female: { min: 30, max: 400 }
    },
    description: 'Primary estrogen. Monitor for hormonal balance.',
    peptideRelevance: ['ipamorelin', 'cjc1295'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 50 }
  },
  // Liver Enzymes
  {
    id: 'ast',
    name: 'Aspartate Aminotransferase',
    shortName: 'AST',
    unit: 'U/L',
    category: 'liver',
    normalRange: {
      male: { min: 10, max: 40 },
      female: { min: 9, max: 32 }
    },
    description: 'Liver enzyme. Elevated values may indicate liver stress.',
    peptideRelevance: ['bpc157'],
    monitoringFrequency: 'Every 8-12 weeks',
    warningThreshold: { high: 60 }
  },
  {
    id: 'alt',
    name: 'Alanine Aminotransferase',
    shortName: 'ALT',
    unit: 'U/L',
    category: 'liver',
    normalRange: {
      male: { min: 7, max: 56 },
      female: { min: 7, max: 45 }
    },
    description: 'Liver-specific enzyme. More specific for liver health than AST.',
    peptideRelevance: ['bpc157'],
    monitoringFrequency: 'Every 8-12 weeks',
    warningThreshold: { high: 70 }
  },
  {
    id: 'ggt',
    name: 'Gamma-Glutamyl Transferase',
    shortName: 'GGT',
    unit: 'U/L',
    category: 'liver',
    normalRange: {
      male: { min: 9, max: 48 },
      female: { min: 9, max: 36 }
    },
    description: 'Liver enzyme sensitive to alcohol and certain medications.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 65 }
  },
  // Lipid Panel
  {
    id: 'totalCholesterol',
    name: 'Total Cholesterol',
    shortName: 'TC',
    unit: 'mg/dL',
    category: 'lipid',
    normalRange: {
      male: { min: 125, max: 200 },
      female: { min: 125, max: 200 }
    },
    description: 'Total blood cholesterol. Important cardiovascular marker.',
    peptideRelevance: ['retatrutide', 'tirzepatide'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 240 }
  },
  {
    id: 'ldl',
    name: 'Low-Density Lipoprotein',
    shortName: 'LDL',
    unit: 'mg/dL',
    category: 'lipid',
    normalRange: {
      male: { min: 0, max: 100 },
      female: { min: 0, max: 100 }
    },
    description: '"Bad" cholesterol. Keep low for cardiovascular health.',
    peptideRelevance: ['retatrutide'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 130 }
  },
  {
    id: 'hdl',
    name: 'High-Density Lipoprotein',
    shortName: 'HDL',
    unit: 'mg/dL',
    category: 'lipid',
    normalRange: {
      male: { min: 40, max: 100 },
      female: { min: 50, max: 100 }
    },
    optimalRange: {
      male: { min: 50, max: 80 },
      female: { min: 60, max: 90 }
    },
    description: '"Good" cholesterol. Higher is generally better.',
    peptideRelevance: ['retatrutide'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { low: 35 }
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    shortName: 'TG',
    unit: 'mg/dL',
    category: 'lipid',
    normalRange: {
      male: { min: 0, max: 150 },
      female: { min: 0, max: 150 }
    },
    description: 'Blood fats. Often elevated with poor metabolic health.',
    peptideRelevance: ['retatrutide', 'tirzepatide', 'motsc'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 200 }
  },
  // Metabolic
  {
    id: 'fastingGlucose',
    name: 'Fasting Glucose',
    shortName: 'FG',
    unit: 'mg/dL',
    category: 'metabolic',
    normalRange: {
      male: { min: 70, max: 100 },
      female: { min: 70, max: 100 }
    },
    optimalRange: {
      male: { min: 75, max: 90 },
      female: { min: 75, max: 90 }
    },
    description: 'Blood sugar after fasting. Key metabolic health marker.',
    peptideRelevance: ['retatrutide', 'tirzepatide', 'motsc'],
    monitoringFrequency: 'Every 8-12 weeks when using GLP-1 peptides',
    warningThreshold: { high: 110 }
  },
  {
    id: 'hba1c',
    name: 'Hemoglobin A1c',
    shortName: 'HbA1c',
    unit: '%',
    category: 'metabolic',
    normalRange: {
      male: { min: 4.0, max: 5.7 },
      female: { min: 4.0, max: 5.7 }
    },
    optimalRange: {
      male: { min: 4.5, max: 5.3 },
      female: { min: 4.5, max: 5.3 }
    },
    description: '3-month average blood sugar. Gold standard for metabolic health.',
    peptideRelevance: ['retatrutide', 'tirzepatide', 'motsc'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 6.0 }
  },
  {
    id: 'insulin',
    name: 'Fasting Insulin',
    shortName: 'Insulin',
    unit: 'uIU/mL',
    category: 'metabolic',
    normalRange: {
      male: { min: 2, max: 25 },
      female: { min: 2, max: 25 }
    },
    optimalRange: {
      male: { min: 3, max: 8 },
      female: { min: 3, max: 8 }
    },
    description: 'Fasting insulin levels. Key for insulin sensitivity assessment.',
    peptideRelevance: ['retatrutide', 'tirzepatide', 'ipamorelin'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 15 }
  },
  // Kidney
  {
    id: 'creatinine',
    name: 'Creatinine',
    shortName: 'Creat',
    unit: 'mg/dL',
    category: 'kidney',
    normalRange: {
      male: { min: 0.7, max: 1.3 },
      female: { min: 0.6, max: 1.1 }
    },
    description: 'Kidney function marker. May be elevated in muscular individuals.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 1.5 }
  },
  {
    id: 'bun',
    name: 'Blood Urea Nitrogen',
    shortName: 'BUN',
    unit: 'mg/dL',
    category: 'kidney',
    normalRange: {
      male: { min: 7, max: 20 },
      female: { min: 7, max: 20 }
    },
    description: 'Kidney function and protein metabolism marker.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 25 }
  },
  // Thyroid
  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone',
    shortName: 'TSH',
    unit: 'mIU/L',
    category: 'thyroid',
    normalRange: {
      male: { min: 0.4, max: 4.0 },
      female: { min: 0.4, max: 4.0 }
    },
    optimalRange: {
      male: { min: 1.0, max: 2.5 },
      female: { min: 1.0, max: 2.5 }
    },
    description: 'Primary thyroid function marker. Affects metabolism.',
    peptideRelevance: ['retatrutide'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 5.0, low: 0.3 }
  },
  {
    id: 'freeT4',
    name: 'Free T4',
    shortName: 'FT4',
    unit: 'ng/dL',
    category: 'thyroid',
    normalRange: {
      male: { min: 0.8, max: 1.8 },
      female: { min: 0.8, max: 1.8 }
    },
    description: 'Active thyroid hormone. Regulates metabolism.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { low: 0.7, high: 2.0 }
  },
  // Inflammation
  {
    id: 'crp',
    name: 'C-Reactive Protein (High Sensitivity)',
    shortName: 'hs-CRP',
    unit: 'mg/L',
    category: 'inflammation',
    normalRange: {
      male: { min: 0, max: 3 },
      female: { min: 0, max: 3 }
    },
    optimalRange: {
      male: { min: 0, max: 1 },
      female: { min: 0, max: 1 }
    },
    description: 'Inflammation marker. Elevated indicates systemic inflammation.',
    peptideRelevance: ['bpc157', 'tb500', 'ta1'],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 3 }
  },
  {
    id: 'homocysteine',
    name: 'Homocysteine',
    shortName: 'Hcy',
    unit: 'umol/L',
    category: 'inflammation',
    normalRange: {
      male: { min: 5, max: 15 },
      female: { min: 5, max: 12 }
    },
    optimalRange: {
      male: { min: 6, max: 10 },
      female: { min: 6, max: 10 }
    },
    description: 'Cardiovascular and inflammation marker. Modifiable with B vitamins.',
    peptideRelevance: [],
    monitoringFrequency: 'Every 12 weeks',
    warningThreshold: { high: 15 }
  }
];

export const biomarkerCategories = [
  { id: 'hormone', label: 'Hormones', color: 'hsl(262, 83%, 58%)' },
  { id: 'liver', label: 'Liver', color: 'hsl(25, 95%, 53%)' },
  { id: 'kidney', label: 'Kidney', color: 'hsl(0, 84%, 60%)' },
  { id: 'lipid', label: 'Lipids', color: 'hsl(45, 93%, 47%)' },
  { id: 'metabolic', label: 'Metabolic', color: 'hsl(160, 84%, 39%)' },
  { id: 'thyroid', label: 'Thyroid', color: 'hsl(187, 78%, 55%)' },
  { id: 'inflammation', label: 'Inflammation', color: 'hsl(340, 82%, 52%)' },
] as const;

export function getBiomarkerStatus(
  biomarker: Biomarker, 
  value: number, 
  gender: 'male' | 'female'
): { status: 'optimal' | 'normal' | 'warning' | 'critical'; label: string; color: string } {
  const range = biomarker.normalRange[gender];
  const optimal = biomarker.optimalRange?.[gender];
  const warning = biomarker.warningThreshold;

  // Check for critical values first
  if (warning?.low && value < warning.low) {
    return { status: 'critical', label: 'Low', color: 'text-red-500' };
  }
  if (warning?.high && value > warning.high) {
    return { status: 'critical', label: 'High', color: 'text-red-500' };
  }

  // Check if below normal range
  if (value < range.min) {
    return { status: 'warning', label: 'Below Normal', color: 'text-yellow-500' };
  }
  
  // Check if above normal range
  if (value > range.max) {
    return { status: 'warning', label: 'Above Normal', color: 'text-yellow-500' };
  }

  // Check if in optimal range
  if (optimal && value >= optimal.min && value <= optimal.max) {
    return { status: 'optimal', label: 'Optimal', color: 'text-green-500' };
  }

  return { status: 'normal', label: 'Normal', color: 'text-primary' };
}

// Recommended bloodwork panels for peptide users
export const recommendedPanels = [
  {
    name: 'GH Peptide Panel',
    peptides: ['ipamorelin', 'cjc1295', 'tesamorelin'],
    biomarkers: ['igf1', 'fastingGlucose', 'insulin', 'hba1c'],
    frequency: 'Every 8-12 weeks',
  },
  {
    name: 'Metabolic Panel',
    peptides: ['retatrutide', 'tirzepatide', 'motsc'],
    biomarkers: ['fastingGlucose', 'hba1c', 'insulin', 'totalCholesterol', 'ldl', 'hdl', 'triglycerides', 'tsh'],
    frequency: 'Every 8-12 weeks',
  },
  {
    name: 'Healing & Recovery Panel',
    peptides: ['bpc157', 'tb500', 'ghkcu'],
    biomarkers: ['ast', 'alt', 'crp', 'creatinine'],
    frequency: 'Every 12 weeks',
  },
  {
    name: 'Immune Panel',
    peptides: ['ta1', 'epitalon'],
    biomarkers: ['crp', 'homocysteine'],
    frequency: 'Every 12 weeks',
  },
  {
    name: 'Comprehensive Male Panel',
    peptides: [],
    biomarkers: ['testosterone', 'freeT', 'estradiol', 'igf1', 'tsh', 'freeT4', 'ast', 'alt', 'fastingGlucose', 'hba1c', 'totalCholesterol', 'ldl', 'hdl', 'triglycerides', 'crp'],
    frequency: 'Every 12 weeks (baseline)',
  }
];
