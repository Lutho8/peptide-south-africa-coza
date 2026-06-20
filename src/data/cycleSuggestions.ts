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

// ── Blend Cycle Suggestions ──

export const blendCycleSuggestions: CycleSuggestion[] = [
  {
    peptideId: 'glow-70mg',
    name: 'GLOW',
    protocols: [
      { level: 'beginner', cycleDuration: 28, breakDuration: 14, dose: '0.3ml', frequency: 'Daily', notes: 'Start low to assess tolerance', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 56, breakDuration: 14, dose: '0.5ml', frequency: 'Daily', notes: 'Standard healing & regeneration protocol', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Contains multiple active peptides — do not stack with individual components'],
    monitoringRecommendations: ['Track skin quality and wound healing', 'Monitor CRP if available'],
  },
  {
    peptideId: 'klow-80mg',
    name: 'KLOW',
    protocols: [
      { level: 'beginner', cycleDuration: 28, breakDuration: 14, dose: '0.3ml', frequency: 'Daily', notes: 'Assess anti-inflammatory response first', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 56, breakDuration: 14, dose: '0.5ml', frequency: 'Daily', notes: 'Full anti-inflammatory & healing protocol', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Do not combine with standalone KPV or BPC-157'],
    monitoringRecommendations: ['Track inflammation markers', 'Note pain and recovery improvements'],
  },
  {
    peptideId: 'bpc157-tb500-10mg',
    name: 'BPC-157 + TB-500 (10 mg)',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '0.3ml', frequency: 'Daily', notes: 'Short healing cycle for acute injuries', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: '0.5ml', frequency: 'Daily', notes: 'Extended healing protocol', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Do not stack with standalone BPC-157 or TB-500'],
    monitoringRecommendations: ['Track injury healing progress', 'Monitor liver enzymes long-term'],
  },
  {
    peptideId: 'bpc157-tb500-20mg',
    name: 'BPC-157 + TB-500 (20 mg)',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '0.25ml', frequency: 'Daily', notes: 'Higher concentration — use lower volume', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: '0.5ml', frequency: 'Daily', notes: 'Full-dose systemic healing', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Higher concentration blend — start conservatively'],
    monitoringRecommendations: ['Track healing markers', 'Monitor injection site reactions'],
  },
  {
    peptideId: 'cjc1295-ipamorelin-10mg',
    name: 'CJC-1295 + Ipamorelin',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: '0.3ml', frequency: 'Before bed', notes: 'Administer fasted for best GH pulse', bloodworkBefore: ['igf1', 'fastingGlucose'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: '0.5ml', frequency: 'Before bed', notes: 'Standard GH optimization blend', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Monitor blood glucose', 'Administer on empty stomach'],
    monitoringRecommendations: ['Check IGF-1 at 8 weeks', 'Track sleep quality and recovery'],
  },
  {
    peptideId: 'cjc1295-ghrp2-10mg',
    name: 'CJC-1295 + GHRP-2',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: '0.3ml', frequency: 'Before bed', notes: 'GHRP-2 increases appetite — plan nutrition', bloodworkBefore: ['igf1', 'fastingGlucose'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: '0.5ml', frequency: 'Before bed', notes: 'Potent GH stack — monitor glucose closely', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin', 'hba1c'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Significant appetite increase expected', 'Monitor cortisol and prolactin with extended use'],
    monitoringRecommendations: ['Check IGF-1 and glucose monthly', 'Track body composition'],
  },
  {
    peptideId: 'aod9604-cjc1295-ipamorelin-12mg',
    name: 'AOD + CJC + Ipam',
    protocols: [
      { level: 'beginner', cycleDuration: 60, breakDuration: 21, dose: '0.3ml', frequency: 'Before bed', notes: 'Fat loss & GH support combo', bloodworkBefore: ['igf1', 'fastingGlucose', 'triglycerides'], bloodworkDuring: ['fastingGlucose'] },
      { level: 'intermediate', cycleDuration: 90, breakDuration: 21, dose: '0.5ml', frequency: 'Before bed', notes: 'Extended recomposition protocol', bloodworkBefore: ['igf1', 'fastingGlucose', 'triglycerides', 'insulin'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Administer fasted', 'May affect glucose metabolism'],
    monitoringRecommendations: ['Track body fat percentage', 'Monitor fasting glucose'],
  },
  {
    peptideId: 'cagrilintide-semaglutide-10mg',
    name: 'CagriSema',
    protocols: [
      { level: 'beginner', cycleDuration: 84, breakDuration: 0, dose: '0.25mg → 0.5mg', frequency: 'Weekly (titrate monthly)', notes: 'Slow titration essential — start 0.25mg weekly', bloodworkBefore: ['fastingGlucose', 'hba1c', 'triglycerides', 'tsh'], bloodworkDuring: ['fastingGlucose', 'hba1c'] },
      { level: 'intermediate', cycleDuration: 168, breakDuration: 0, dose: '0.5mg → 1mg', frequency: 'Weekly', notes: 'GI side effects common — titrate slowly', bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'triglycerides', 'tsh'], bloodworkDuring: ['fastingGlucose', 'hba1c', 'triglycerides'] },
    ],
    stackSuggestions: [],
    warnings: ['GI side effects common', 'MUST titrate slowly', 'Resistance training required to prevent muscle loss'],
    monitoringRecommendations: ['Weekly weigh-ins', 'Monthly body composition', 'Fasting glucose every 4 weeks'],
  },
  {
    peptideId: 'tesamorelin-ipamorelin-10mg',
    name: 'Tesa + Ipam',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: '0.3ml', frequency: 'Before bed', notes: 'Targets visceral fat + GH optimization', bloodworkBefore: ['igf1', 'fastingGlucose', 'triglycerides'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: '0.5ml', frequency: 'Before bed', notes: 'Extended fat loss & GH protocol', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin', 'triglycerides'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Monitor glucose closely', 'Administer fasted'],
    monitoringRecommendations: ['Track visceral fat reduction', 'Check IGF-1 at 8 weeks'],
  },
  {
    peptideId: 'tri-heal-45mg',
    name: 'Tri-Heal',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '0.3ml', frequency: 'Daily', notes: 'Triple-action healing blend', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: '0.5ml', frequency: 'Daily', notes: 'Extended comprehensive healing protocol', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Contains KPV — do not combine with standalone anti-inflammatory peptides'],
    monitoringRecommendations: ['Track healing progress', 'Monitor inflammation markers'],
  },
  {
    peptideId: 'ghk-cu-bpc157-kpv-30mg',
    name: 'Regen-3',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '0.3ml', frequency: 'Daily', notes: 'Regeneration & anti-aging blend', bloodworkBefore: [], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 21, dose: '0.5ml', frequency: 'Daily', notes: 'Full regenerative protocol', bloodworkBefore: ['crp'], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['Copper accumulation possible — take breaks', 'Do not stack with standalone GHK-Cu'],
    monitoringRecommendations: ['Track skin quality', 'Note wound healing improvements'],
  },
  {
    peptideId: 'semax-na-selank-10mg',
    name: 'NA-Semax + NA-Selank',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '300mcg', frequency: 'Daily intranasal', notes: 'Cognitive + anxiolytic blend', bloodworkBefore: [], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: '600mcg', frequency: 'Daily intranasal (split AM/PM)', notes: 'Full nootropic protocol', bloodworkBefore: [], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['May cause headaches initially', 'Nasal irritation possible'],
    monitoringRecommendations: ['Track cognitive performance', 'Note anxiety and focus changes'],
  },
  {
    peptideId: 'mots-c-humanin-blend',
    name: 'MOTS-c + Humanin',
    protocols: [
      { level: 'beginner', cycleDuration: 60, breakDuration: 30, dose: '5mg', frequency: '3x weekly', notes: 'Dual mitochondrial peptide blend', bloodworkBefore: ['fastingGlucose', 'hba1c'], bloodworkDuring: ['fastingGlucose'] },
      { level: 'intermediate', cycleDuration: 90, breakDuration: 30, dose: '10mg', frequency: '3x weekly', notes: 'Enhanced longevity & metabolic support', bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin'], bloodworkDuring: ['fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Not a replacement for exercise', 'Monitor blood glucose'],
    monitoringRecommendations: ['Track fasting glucose', 'Monitor energy and endurance'],
  },
  // Stacks
  {
    peptideId: 'pt141-melanotanII-stack',
    name: 'PT-141 + MT-II',
    protocols: [
      { level: 'beginner', cycleDuration: 14, breakDuration: 30, dose: 'Per protocol', frequency: 'As needed', notes: 'Short-term use only', bloodworkBefore: [], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 28, breakDuration: 30, dose: 'Per protocol', frequency: '2-3x weekly', notes: 'Cycled use with breaks', bloodworkBefore: [], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['Nausea common', 'Sun exposure caution with MT-II', 'Monitor moles/skin changes'],
    monitoringRecommendations: ['Track skin pigmentation changes', 'Monitor blood pressure'],
  },
  {
    peptideId: 'cjc1295dac-ipamorelin-2mg-5mg',
    name: 'CJC-DAC + Ipam (2+5)',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: '0.3ml', frequency: 'Before bed', notes: 'DAC variant provides sustained GH elevation', bloodworkBefore: ['igf1', 'fastingGlucose'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: '0.5ml', frequency: 'Before bed', notes: 'Extended sustained-release GH protocol', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['DAC version has longer half-life — less frequent dosing needed', 'Monitor glucose'],
    monitoringRecommendations: ['Check IGF-1 at 6-8 weeks', 'Track body composition'],
  },
  {
    peptideId: 'cjc1295dac-ipamorelin-5mg-5mg',
    name: 'CJC-DAC + Ipam (5+5)',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: '0.25ml', frequency: 'Before bed', notes: 'Higher concentration — start with lower volume', bloodworkBefore: ['igf1', 'fastingGlucose'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: '0.5ml', frequency: 'Before bed', notes: 'Full-dose sustained GH protocol', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Higher concentration — titrate carefully', 'Monitor glucose and IGF-1'],
    monitoringRecommendations: ['Check IGF-1 at 6-8 weeks', 'Monitor fasting glucose monthly'],
  },
  {
    peptideId: 'tb500-bpc157-5mg-stack',
    name: 'TB-500 + BPC-157 Stack',
    protocols: [
      { level: 'beginner', cycleDuration: 42, breakDuration: 14, dose: 'Per protocol', frequency: 'Daily BPC / 2x weekly TB', notes: 'Classic healing stack', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: 'Per protocol', frequency: 'Daily BPC / 2x weekly TB', notes: 'Extended healing cycle', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Follow individual dosing for each component'],
    monitoringRecommendations: ['Track injury recovery', 'Monitor liver enzymes'],
  },
  {
    peptideId: 'bpc157-ghkcu-stack',
    name: 'BPC-157 + GHK-Cu',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: 'Per protocol', frequency: 'Daily', notes: 'Healing + regeneration stack', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 21, dose: 'Per protocol', frequency: 'Daily', notes: 'Extended tissue repair & collagen synthesis', bloodworkBefore: ['crp', 'ast', 'alt'], bloodworkDuring: ['crp'] },
    ],
    stackSuggestions: [],
    warnings: ['Monitor copper levels with extended GHK-Cu use'],
    monitoringRecommendations: ['Track skin and wound healing', 'Monitor liver enzymes'],
  },
  {
    peptideId: 'semax-selank-stack',
    name: 'Semax + Selank',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: '300mcg each', frequency: 'Daily intranasal', notes: 'Focus + calm nootropic stack', bloodworkBefore: [], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: '600mcg each', frequency: 'Daily (AM Semax / PM Selank)', notes: 'Full cognitive optimization', bloodworkBefore: [], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['Nasal irritation possible', 'Headaches may occur initially'],
    monitoringRecommendations: ['Track focus and memory', 'Note anxiety levels'],
  },
  {
    peptideId: 'tirzepatide-retatrutide-stack',
    name: 'Tirzepatide + Retatrutide',
    protocols: [
      { level: 'beginner', cycleDuration: 84, breakDuration: 0, dose: 'Titrate per protocol', frequency: 'Weekly', notes: 'Aggressive metabolic stack — slow titration essential', bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'triglycerides', 'tsh'], bloodworkDuring: ['fastingGlucose', 'hba1c'] },
      { level: 'intermediate', cycleDuration: 168, breakDuration: 0, dose: 'Titrate per protocol', frequency: 'Weekly', notes: 'Long-term metabolic management', bloodworkBefore: ['fastingGlucose', 'hba1c', 'insulin', 'triglycerides', 'tsh', 'totalCholesterol'], bloodworkDuring: ['fastingGlucose', 'hba1c', 'triglycerides'] },
    ],
    stackSuggestions: [],
    warnings: ['Severe GI side effects possible', 'MUST titrate very slowly', 'Resistance training mandatory'],
    monitoringRecommendations: ['Weekly weigh-ins', 'Monthly body composition', 'Fasting glucose every 2 weeks initially'],
  },
  {
    peptideId: 'ipamorelin-cjc1295-nodac-stack',
    name: 'Ipam + CJC no DAC Stack',
    protocols: [
      { level: 'beginner', cycleDuration: 90, breakDuration: 30, dose: 'Per protocol', frequency: 'Before bed', notes: 'Classic pulsatile GH stack', bloodworkBefore: ['igf1', 'fastingGlucose'], bloodworkDuring: ['igf1'] },
      { level: 'intermediate', cycleDuration: 120, breakDuration: 30, dose: 'Per protocol', frequency: 'Before bed', notes: 'Extended GH optimization', bloodworkBefore: ['igf1', 'fastingGlucose', 'insulin'], bloodworkDuring: ['igf1', 'fastingGlucose'] },
    ],
    stackSuggestions: [],
    warnings: ['Administer fasted', 'Monitor blood glucose'],
    monitoringRecommendations: ['Check IGF-1 at 8 weeks', 'Track sleep and recovery'],
  },
  {
    peptideId: 'bpc157-semax-neurohealing-stack',
    name: 'BPC-157 + Semax',
    protocols: [
      { level: 'beginner', cycleDuration: 30, breakDuration: 14, dose: 'Per protocol', frequency: 'Daily (BPC sub-q / Semax nasal)', notes: 'Neuro-healing & neuroprotection', bloodworkBefore: ['crp'], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 60, breakDuration: 14, dose: 'Per protocol', frequency: 'Daily', notes: 'Extended neuro-recovery protocol', bloodworkBefore: ['crp'], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['Different administration routes — follow each component protocol'],
    monitoringRecommendations: ['Track cognitive improvements', 'Note mood and focus changes'],
  },
  {
    peptideId: 'epitalon-ghkcu-longevity-stack',
    name: 'Epitalon + GHK-Cu',
    protocols: [
      { level: 'beginner', cycleDuration: 10, breakDuration: 170, dose: 'Per protocol', frequency: 'Daily (Epitalon 10-day burst + ongoing GHK-Cu)', notes: 'Longevity stack — Epitalon cycles short', bloodworkBefore: [], bloodworkDuring: [] },
      { level: 'intermediate', cycleDuration: 20, breakDuration: 160, dose: 'Per protocol', frequency: 'Daily', notes: 'Extended longevity protocol', bloodworkBefore: [], bloodworkDuring: [] },
    ],
    stackSuggestions: [],
    warnings: ['Epitalon cycles must be spaced 6+ months apart', 'Monitor copper with GHK-Cu'],
    monitoringRecommendations: ['Track sleep quality', 'Note energy and skin improvements'],
  },
];

// Combined lookup across individual + blend suggestions
const allCycleSuggestions = [...cycleSuggestions, ...blendCycleSuggestions];

export function getCycleSuggestion(peptideId: string): CycleSuggestion | undefined {
  return allCycleSuggestions.find(cs => cs.peptideId === peptideId);
}
