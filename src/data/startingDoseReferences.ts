import { findBlendData, findPeptideOrBlend } from '@/data/blendAdapters';

interface Source { title: string; url: string }
interface LabelDose {
  product: string;
  population: string;
  amount: string;
  context: string;
  source: Source;
}
export interface StartingDoseReference {
  status: 'product-label' | 'not-established' | 'not-verified' | 'blend';
  summary: string;
  explanation: string;
  labels: LabelDose[];
  sources: Source[];
  reviewedAt?: string;
}

const labelReferences: Record<string, LabelDose[]> = {
  semaglutide: [{
    product: 'Ozempic injection · US prescribing information',
    population: 'Adults with type 2 diabetes; see the label for its specific indications.',
    amount: '0.25 mg under the skin once weekly for the first 4 weeks',
    context: 'This is an initiation dose. The label moves to 0.5 mg weekly after 4 weeks; further dosing depends on the indication and clinical response. This reference does not cover oral semaglutide or other products.',
    source: { title: 'Novo Nordisk · Ozempic prescribing information, section 2.2', url: 'https://www.novo-pi.com/ozempic.pdf' },
  }],
  tirzepatide: [{
    product: 'Zepbound injection · US prescribing information',
    population: 'Eligible adults with obesity, or overweight with a weight-related condition; also specified adults with obesity and obstructive sleep apnoea.',
    amount: '2.5 mg under the skin once weekly for the first 4 weeks',
    context: 'The label then moves to 5 mg weekly. The 2.5 mg amount is for initiation, not maintenance. Subsequent changes depend on response and tolerability; this is not a general protocol for research vials.',
    source: { title: 'Eli Lilly · Zepbound prescribing information, sections 1 and 2', url: 'https://pi.lilly.com/us/zepbound-uspi.pdf' },
  }],
  liraglutide: [{
    product: 'Saxenda injection · US prescribing information',
    population: 'Adult weight-management reference for the eligible groups described in the label.',
    amount: '0.6 mg under the skin once daily for the first week',
    context: 'This is the first step of the labelled escalation schedule, not the adult maintenance dose. Follow the prescribed schedule and review tolerability. This reference does not cover other liraglutide products.',
    source: { title: 'Novo Nordisk · Saxenda prescribing information, section 2.2', url: 'https://www.novo-pi.com/saxenda.pdf' },
  }],
  tesamorelin: [{
    product: 'Egrifta WR 11.6 mg vial · US prescribing information',
    population: 'Adults with HIV-associated lipodystrophy and excess abdominal fat; not general weight management.',
    amount: '1.28 mg under the skin once daily — labelled regimen',
    context: 'This is a product-specific regimen, not a beginner titration. Egrifta WR and Egrifta SV are not substitutable. Do not transfer the WR amount or preparation instructions to SV or a different tesamorelin vial.',
    source: { title: 'Egrifta WR prescribing information, sections 1 and 2', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/022505s020lbl.pdf' },
  }],
};

const limitedEvidence: Record<string, string> = {
  bpc157: 'A minimum effective or safe starting dose for knee or tendon injury has not been established in reliable human evidence. Community reports and a low number alone cannot establish a beginner dose or escalation schedule.',
  tb500: 'A beginner dose for the TB-500 fragment is not established. Human findings for full-length thymosin beta-4 cannot be assumed to apply to this fragment.',
  motsc: 'A starting dose for self-administered MOTS-c is not established. Findings about naturally occurring MOTS-c do not establish an injected treatment dose.',
  kpv: 'A starting dose for self-administered KPV is not established in reliable human evidence.',
  ghkcu: 'A starting dose for injectable GHK-Cu is not established. Topical-product evidence does not establish an injection dose.',
};
const limitedEvidenceSource: Source = {
  title: 'FDA · review of human safety information for these compounds',
  url: 'https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks',
};

// Explicit product references only. Legacy catalogue dose tiers and experience
// scores must never be treated as verified initiation doses.
export function getStartingDoseReference(peptideId: string): StartingDoseReference {
  if (findBlendData(peptideId)) return {
    status: 'blend', summary: 'No verified starting dose for this exact blend',
    explanation: 'A dose for one ingredient does not establish a dose for the mixture. The ingredient ratio, formulation and evidence must match the exact product.',
    labels: [], sources: [],
  };
  const labels = labelReferences[peptideId];
  if (labels) return {
    status: 'product-label', summary: 'A product-specific dose reference is available',
    explanation: 'Match the exact medicine, formulation and indication with your prescriber. A labelled starting dose is not a universal minimum effective dose and does not establish equivalence to a research vial.',
    labels, sources: [], reviewedAt: '2026-09-12',
  };
  if (limitedEvidence[peptideId]) return {
    status: 'not-established', summary: 'No established starting dose',
    explanation: limitedEvidence[peptideId], labels: [],
    sources: [limitedEvidenceSource], reviewedAt: '2026-09-12',
  };
  const name = findPeptideOrBlend(peptideId)?.shortName || 'This compound';
  return {
    status: 'not-verified', summary: 'Starting-dose reference not yet verified',
    explanation: `${name} does not yet have an app-verified product and indication-specific starting-dose reference. This is a gap in our reference coverage, not proof that no clinical dosing guidance exists. Ask your prescriber or pharmacist for the exact product instructions.`,
    labels: [], sources: [],
  };
}
