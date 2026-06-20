import type { ResultBiomarker } from '@/components/bloodwork/BloodworkResults';

export interface Pattern {
  id: string;
  name: string;
  explanation: string;
  contributingMarkers: string[];
  suggestedPeptides: string[]; // peptide names to highlight in stack
  severity: 'info' | 'watch' | 'action';
}

type Rule = {
  id: string;
  name: string;
  explanation: string;
  suggestedPeptides: string[];
  severity: Pattern['severity'];
  match: (markers: Map<string, ResultBiomarker>) => string[] | null; // returns contributing markers or null
};

function getByName(markers: Map<string, ResultBiomarker>, names: string[]): ResultBiomarker | undefined {
  for (const n of names) {
    const m = markers.get(n.toLowerCase());
    if (m) return m;
  }
  return undefined;
}

const RULES: Rule[] = [
  {
    id: 'immune-metabolic',
    name: 'Immune Dysregulation + Metabolic Stress',
    explanation: 'Elevated inflammation markers paired with poor glucose control suggest a feedback loop driving fatigue, weight gain and slower recovery.',
    suggestedPeptides: ['BPC-157', 'Thymosin Alpha-1', 'MOTS-c', 'Tirzepatide'],
    severity: 'action',
    match: (m) => {
      const inflam = getByName(m, ['crp', 'hs-crp', 'hscrp', 'wbc']);
      const metab = getByName(m, ['fasting glucose', 'glucose', 'hba1c', 'insulin', 'homa-ir']);
      const hits: string[] = [];
      if (inflam && (inflam.status === 'high' || inflam.status === 'critical')) hits.push(inflam.name);
      if (metab && (metab.status === 'high' || metab.status === 'critical')) hits.push(metab.name);
      return hits.length >= 2 ? hits : null;
    },
  },
  {
    id: 'androgen-decline',
    name: 'Androgen Decline',
    explanation: 'Low circulating testosterone with high SHBG reduces free hormone available to tissues — typical drivers of low libido, energy and recovery.',
    suggestedPeptides: ['Kisspeptin-10', 'Gonadorelin', 'Enclomiphene'],
    severity: 'action',
    match: (m) => {
      const t = getByName(m, ['testosterone', 'total testosterone', 'free testosterone']);
      const shbg = getByName(m, ['shbg']);
      const hits: string[] = [];
      if (t && t.status === 'low') hits.push(t.name);
      if (shbg && shbg.status === 'high') hits.push(shbg.name);
      return hits.length >= 1 && t?.status === 'low' ? hits : null;
    },
  },
  {
    id: 'cardiometabolic-risk',
    name: 'Cardiometabolic Risk',
    explanation: 'High ApoB/LDL with low HDL and elevated triglycerides points to atherogenic lipid patterning — the strongest modifiable cardiovascular risk lever.',
    suggestedPeptides: ['Tirzepatide', 'Retatrutide', 'MOTS-c'],
    severity: 'action',
    match: (m) => {
      const apob = getByName(m, ['apob', 'apo b', 'ldl', 'ldl-c']);
      const hdl = getByName(m, ['hdl', 'hdl-c']);
      const tg = getByName(m, ['triglycerides', 'trig']);
      const hits: string[] = [];
      if (apob && apob.status === 'high') hits.push(apob.name);
      if (hdl && hdl.status === 'low') hits.push(hdl.name);
      if (tg && tg.status === 'high') hits.push(tg.name);
      return hits.length >= 2 ? hits : null;
    },
  },
  {
    id: 'thyroid-slowdown',
    name: 'Thyroid Slowdown',
    explanation: 'TSH rising while free T3/T4 sit in the low range indicates the thyroid axis is working harder for less output — affects metabolism, mood and energy.',
    suggestedPeptides: ['TB-500', 'MOTS-c'],
    severity: 'watch',
    match: (m) => {
      const tsh = getByName(m, ['tsh']);
      const ft3 = getByName(m, ['free t3', 'ft3']);
      const ft4 = getByName(m, ['free t4', 'ft4']);
      const hits: string[] = [];
      if (tsh && tsh.status === 'high') hits.push(tsh.name);
      if (ft3 && ft3.status === 'low') hits.push(ft3.name);
      if (ft4 && ft4.status === 'low') hits.push(ft4.name);
      return hits.length >= 2 ? hits : null;
    },
  },
  {
    id: 'liver-strain',
    name: 'Liver Strain',
    explanation: 'Elevated liver enzymes suggest hepatic stress — review supplements, alcohol and any hepatotoxic compounds before adding load.',
    suggestedPeptides: ['BPC-157', 'GHK-Cu'],
    severity: 'action',
    match: (m) => {
      const alt = getByName(m, ['alt']);
      const ast = getByName(m, ['ast']);
      const ggt = getByName(m, ['ggt']);
      const hits: string[] = [];
      if (alt && alt.status === 'high') hits.push(alt.name);
      if (ast && ast.status === 'high') hits.push(ast.name);
      if (ggt && ggt.status === 'high') hits.push(ggt.name);
      return hits.length >= 1 ? hits : null;
    },
  },
  {
    id: 'inflammation-fatigue',
    name: 'Inflammation-Driven Fatigue',
    explanation: 'High hs-CRP combined with low ferritin or vitamin D is a recognised driver of chronic low-grade fatigue and impaired recovery.',
    suggestedPeptides: ['Thymosin Alpha-1', 'BPC-157', 'KPV'],
    severity: 'watch',
    match: (m) => {
      const crp = getByName(m, ['hs-crp', 'hscrp', 'crp']);
      const ferritin = getByName(m, ['ferritin']);
      const vitd = getByName(m, ['vitamin d', '25-oh vitamin d', 'vitamin d 25-oh']);
      const hits: string[] = [];
      if (crp && crp.status === 'high') hits.push(crp.name);
      if (ferritin && ferritin.status === 'low') hits.push(ferritin.name);
      if (vitd && vitd.status === 'low') hits.push(vitd.name);
      return hits.length >= 2 ? hits : null;
    },
  },
];

export function detectPatterns(biomarkers: ResultBiomarker[]): Pattern[] {
  const map = new Map<string, ResultBiomarker>();
  for (const b of biomarkers) {
    map.set(b.name.toLowerCase(), b);
    if (b.short_name) map.set(b.short_name.toLowerCase(), b);
  }
  const out: Pattern[] = [];
  for (const r of RULES) {
    const hits = r.match(map);
    if (hits && hits.length) {
      out.push({
        id: r.id,
        name: r.name,
        explanation: r.explanation,
        contributingMarkers: hits,
        suggestedPeptides: r.suggestedPeptides,
        severity: r.severity,
      });
    }
  }
  return out;
}
