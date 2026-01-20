// Cycle suggestions and protocols for each peptide

export interface CycleSuggestion {
  peptideId: string;
  name: string;
  protocols: {
    level: 'beginner' | 'intermediate' | 'advanced' | 'athlete';
    cycleDuration: number; // days
    breakDuration: number; // days
    dose: string;
    frequency: string;
    notes: string;
    bloodworkBefore: string[];
    bloodworkDuring: string[];
  }[];
  stackSuggestions: {
    peptideIds: string[];
    rationale: string;
    synergy: string;
  }[];
  warnings: string[];
  monitoringRecommendations: string[];
}

export const cycleSuggestions: CycleSuggestion[] = [
  {
    peptideId: 'ta1',
    name: 'Thymosin Alpha-1',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 60,
        breakDuration: 30,
        dose: '0.8mg',
        frequency: '2x weekly',
        notes: 'Start with lower frequency to assess tolerance',
        bloodworkBefore: ['crp', 'homocysteine'],
        bloodworkDuring: ['crp'],
      },
      {
        level: 'intermediate',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '1.0mg',
        frequency: '3x weekly',
        notes: 'Standard immune optimization protocol',
        bloodworkBefore: ['crp', 'homocysteine'],
        bloodworkDuring: ['crp'],
      },
      {
        level: 'athlete',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '1.5mg',
        frequency: '3x weekly',
        notes: 'Enhanced protocol for high training loads',
        bloodworkBefore: ['crp', 'homocysteine'],
        bloodworkDuring: ['crp'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['bpc157', 'tb500'],
        rationale: 'Comprehensive immune and healing support',
        synergy: 'TA1 enhances immune function while BPC/TB support tissue repair',
      },
    ],
    warnings: ['Do not use with immunosuppressive therapy without physician guidance'],
    monitoringRecommendations: ['Monitor CRP every 4-6 weeks', 'Track illness frequency and duration'],
  },
  {
    peptideId: 'epitalon',
    name: 'Epitalon',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 10,
        breakDuration: 170,
        dose: '5mg',
        frequency: 'Daily',
        notes: '10-day cycle, 2 cycles per year recommended',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 10,
        breakDuration: 170,
        dose: '10mg',
        frequency: 'Daily',
        notes: 'Standard telomere support protocol',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'advanced',
        cycleDuration: 20,
        breakDuration: 160,
        dose: '10mg',
        frequency: 'Daily',
        notes: 'Extended protocol for enhanced effects',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['ghkcu', 'ss31'],
        rationale: 'Comprehensive longevity stack',
        synergy: 'Telomere, mitochondrial, and regenerative support',
      },
    ],
    warnings: ['May affect sleep patterns initially', 'Space cycles at least 6 months apart'],
    monitoringRecommendations: ['Track sleep quality', 'Note energy levels and recovery'],
  },
  {
    peptideId: 'ipamorelin',
    name: 'Ipamorelin',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '100mcg',
        frequency: 'Before bed',
        notes: 'Conservative start to assess GH response',
        bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'],
        bloodworkDuring: ['igf1'],
      },
      {
        level: 'intermediate',
        cycleDuration: 120,
        breakDuration: 30,
        dose: '200mcg',
        frequency: 'Before bed',
        notes: 'Standard GH optimization protocol',
        bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'],
        bloodworkDuring: ['igf1', 'fastingGlucose'],
      },
      {
        level: 'athlete',
        cycleDuration: 180,
        breakDuration: 30,
        dose: '200mcg',
        frequency: 'Before bed',
        notes: 'Extended protocol with CJC-1295 stack',
        bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin', 'hba1c'],
        bloodworkDuring: ['igf1', 'fastingGlucose'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['cjc1295'],
        rationale: 'Classic GH stack for enhanced pulsatile release',
        synergy: 'GHRH + GHRP synergy amplifies GH pulse by 3-5x',
      },
    ],
    warnings: ['Monitor blood glucose', 'May increase appetite', 'Administer fasted for best results'],
    monitoringRecommendations: ['Check IGF-1 at 8 weeks', 'Monitor fasting glucose monthly', 'Track sleep quality'],
  },
  {
    peptideId: 'cjc1295',
    name: 'CJC-1295 (no DAC)',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '100mcg',
        frequency: 'Before bed',
        notes: 'Start with lower dose to assess tolerance',
        bloodworkBefore: ['igf1', 'fastingGlucose'],
        bloodworkDuring: ['igf1'],
      },
      {
        level: 'intermediate',
        cycleDuration: 120,
        breakDuration: 30,
        dose: '200mcg',
        frequency: 'Before bed with Ipamorelin',
        notes: 'Combined with GHRP for optimal results',
        bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'],
        bloodworkDuring: ['igf1'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['ipamorelin'],
        rationale: 'Synergistic GH release',
        synergy: 'CJC extends and amplifies Ipamorelin-induced GH pulse',
      },
    ],
    warnings: ['Flushing is common initially', 'Administer on empty stomach'],
    monitoringRecommendations: ['Monitor IGF-1 levels', 'Track body composition changes'],
  },
  {
    peptideId: 'bpc157',
    name: 'BPC-157',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 30,
        breakDuration: 14,
        dose: '250mcg',
        frequency: 'Daily',
        notes: 'Short cycle for acute injury healing',
        bloodworkBefore: ['ast', 'alt'],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 60,
        breakDuration: 14,
        dose: '500mcg',
        frequency: 'Daily',
        notes: 'Standard healing protocol',
        bloodworkBefore: ['ast', 'alt', 'crp'],
        bloodworkDuring: ['crp'],
      },
      {
        level: 'athlete',
        cycleDuration: 90,
        breakDuration: 14,
        dose: '500mcg',
        frequency: 'Daily (split AM/PM for systemic)',
        notes: 'Extended protocol with TB-500 for comprehensive healing',
        bloodworkBefore: ['ast', 'alt', 'crp'],
        bloodworkDuring: ['crp'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['tb500'],
        rationale: 'Complete healing stack',
        synergy: 'BPC-157 local healing + TB-500 systemic healing',
      },
      {
        peptideIds: ['tb500', 'ghkcu'],
        rationale: 'Ultimate tissue regeneration',
        synergy: 'Multi-pathway healing and collagen synthesis',
      },
    ],
    warnings: ['Inject near injury site when possible', 'Not recommended during active bleeding'],
    monitoringRecommendations: ['Track healing progress', 'Monitor liver enzymes if using long-term'],
  },
  {
    peptideId: 'tb500',
    name: 'TB-500',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 42,
        breakDuration: 30,
        dose: '2.5mg',
        frequency: '2x weekly',
        notes: 'Loading phase: 2.5mg 2x/week for 6 weeks',
        bloodworkBefore: ['crp'],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 60,
        breakDuration: 30,
        dose: '5mg',
        frequency: '2x weekly',
        notes: 'Standard systemic healing protocol',
        bloodworkBefore: ['crp'],
        bloodworkDuring: ['crp'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['bpc157'],
        rationale: 'Synergistic healing mechanisms',
        synergy: 'TB-500 systemic + BPC-157 local action',
      },
    ],
    warnings: ['May cause initial fatigue', 'Long half-life - effects accumulate'],
    monitoringRecommendations: ['Track injury healing progress', 'Note flexibility improvements'],
  },
  {
    peptideId: 'retatrutide',
    name: 'Retatrutide',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 84,
        breakDuration: 0,
        dose: '0.5mg → 1mg → 2mg',
        frequency: 'Weekly (titrate monthly)',
        notes: 'Slow titration essential. Start 0.5mg, increase monthly',
        bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'totalCholesterol', 'ldl', 'hdl', 'triglycerides', 'tsh'],
        bloodworkDuring: ['fastingGlucose', 'hba1c'],
      },
      {
        level: 'intermediate',
        cycleDuration: 168,
        breakDuration: 0,
        dose: '2mg → 4mg',
        frequency: 'Weekly',
        notes: 'Extended protocol with resistance training mandatory',
        bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'totalCholesterol', 'ldl', 'hdl', 'triglycerides', 'tsh'],
        bloodworkDuring: ['fastingGlucose', 'hba1c', 'triglycerides'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['ipamorelin', 'cjc1295'],
        rationale: 'Body recomposition stack',
        synergy: 'Fat loss from Reta + muscle preservation from GH peptides',
      },
    ],
    warnings: ['GI side effects common initially', 'MUST include resistance training to prevent muscle loss', 'Slow dose titration required'],
    monitoringRecommendations: ['Weekly weigh-ins', 'Monthly body composition', 'Fasting glucose every 4 weeks', 'Thyroid panel at 12 weeks'],
  },
  {
    peptideId: 'ss31',
    name: 'SS-31 (Elamipretide)',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 60,
        breakDuration: 30,
        dose: '2.5mg',
        frequency: 'Daily',
        notes: 'Start low to assess mitochondrial response',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '5mg',
        frequency: 'Daily',
        notes: 'Standard mitochondrial optimization protocol',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'athlete',
        cycleDuration: 120,
        breakDuration: 30,
        dose: '5-10mg',
        frequency: 'Daily (higher dose pre-competition)',
        notes: 'Enhanced endurance and recovery protocol',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['epitalon', 'ghkcu'],
        rationale: 'Complete longevity stack',
        synergy: 'Mitochondrial + telomere + regenerative support',
      },
      {
        peptideIds: ['motsc'],
        rationale: 'Mitochondrial synergy',
        synergy: 'Dual mitochondrial optimization pathways',
      },
    ],
    warnings: ['May cause initial fatigue as mitochondria adapt', 'Expensive - plan cycle carefully'],
    monitoringRecommendations: ['Track energy levels daily', 'Monitor exercise performance', 'Note recovery times'],
  },
  {
    peptideId: 'semax',
    name: 'Semax',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 30,
        breakDuration: 14,
        dose: '300mcg',
        frequency: 'Daily intranasal',
        notes: 'Start with lower dose to assess cognitive response',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 60,
        breakDuration: 14,
        dose: '600mcg',
        frequency: 'Daily intranasal (split AM/PM)',
        notes: 'Standard nootropic protocol',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'athlete',
        cycleDuration: 60,
        breakDuration: 14,
        dose: '600mcg',
        frequency: 'Daily intranasal',
        notes: 'Focus and reaction time enhancement',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['ss31'],
        rationale: 'Cognitive + mitochondrial support',
        synergy: 'Enhanced brain energy and neuroprotection',
      },
    ],
    warnings: ['May cause headaches initially', 'Nasal irritation possible'],
    monitoringRecommendations: ['Track cognitive performance', 'Note focus and memory improvements'],
  },
  {
    peptideId: 'ghkcu',
    name: 'GHK-Cu',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 60,
        breakDuration: 30,
        dose: '1mg',
        frequency: 'Daily',
        notes: 'Start low for skin and regeneration benefits',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
      {
        level: 'intermediate',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '2mg',
        frequency: 'Daily',
        notes: 'Standard anti-aging and regeneration protocol',
        bloodworkBefore: [],
        bloodworkDuring: [],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['bpc157', 'tb500'],
        rationale: 'Ultimate regeneration stack',
        synergy: 'Collagen synthesis + healing + tissue repair',
      },
      {
        peptideIds: ['epitalon', 'ss31'],
        rationale: 'Longevity triad',
        synergy: 'Multi-pathway anti-aging approach',
      },
    ],
    warnings: ['Copper accumulation possible with long-term use', 'Take breaks between cycles'],
    monitoringRecommendations: ['Track skin quality', 'Note wound healing improvements', 'Consider copper levels if cycling long-term'],
  },
  {
    peptideId: 'motsc',
    name: 'MOTS-c',
    protocols: [
      {
        level: 'beginner',
        cycleDuration: 60,
        breakDuration: 30,
        dose: '5mg',
        frequency: '3x weekly',
        notes: 'Exercise mimetic - still exercise regularly',
        bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin'],
        bloodworkDuring: ['fastingGlucose'],
      },
      {
        level: 'intermediate',
        cycleDuration: 90,
        breakDuration: 30,
        dose: '10mg',
        frequency: '3x weekly',
        notes: 'Enhanced metabolic optimization',
        bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'triglycerides'],
        bloodworkDuring: ['fastingGlucose', 'triglycerides'],
      },
    ],
    stackSuggestions: [
      {
        peptideIds: ['ss31'],
        rationale: 'Mitochondrial powerhouse',
        synergy: 'MOTS-c metabolic + SS-31 mitochondrial optimization',
      },
      {
        peptideIds: ['retatrutide'],
        rationale: 'Maximum metabolic enhancement',
        synergy: 'GLP-1 appetite control + MOTS-c metabolic flexibility',
      },
    ],
    warnings: ['Not a replacement for exercise', 'Monitor blood glucose closely'],
    monitoringRecommendations: ['Track fasting glucose', 'Monitor exercise performance', 'Note metabolic improvements'],
  },
];

export function getCycleSuggestion(peptideId: string): CycleSuggestion | undefined {
  return cycleSuggestions.find(cs => cs.peptideId === peptideId);
}
