import type { ResultBiomarker } from '@/components/bloodwork/BloodworkResults';

export type ResearchPathway = {
  title: string;
  titleDe: string;
  body: string;
  bodyDe: string;
  level: 'review' | 'caution';
};

export function buildResearchPathways(biomarkers: ResultBiomarker[], goals: string[]): ResearchPathway[] {
  const abnormal = biomarkers.filter((marker) => marker.status !== 'normal');
  const categories = new Set(abnormal.map((marker) => marker.category.toLowerCase()));
  const normalizedGoals = goals.map((goal) => goal.toLowerCase());
  const hasGoal = (needle: string) => normalizedGoals.some((goal) => goal.includes(needle));
  const pathways: ResearchPathway[] = [];

  if (abnormal.some((marker) => marker.status === 'critical')) {
    pathways.push({
      title: 'Pause peptide decisions and obtain clinical review',
      titleDe: 'Peptid-Entscheidungen pausieren und ärztlich abklären',
      body: 'At least one extracted result was marked critical against the laboratory’s own range. A bloodwork tool cannot safely select a peptide protocol from that finding.',
      bodyDe: 'Mindestens ein erkannter Wert wurde anhand des laborinternen Referenzbereichs als kritisch markiert. Daraus kann dieses Tool kein sicheres Peptidprotokoll ableiten.',
      level: 'caution',
    });
    return pathways;
  }

  if ((categories.has('metabolic') || categories.has('lipid')) && hasGoal('weight')) {
    pathways.push({
      title: 'Metabolic-treatment discussion',
      titleDe: 'Gespräch über Stoffwechselbehandlung',
      body: 'The metabolic/lipid pattern and weight-loss goal support a clinician discussion about diagnosis, contraindications, and approved options. Retatrutide remains investigational; these results do not establish that it is appropriate or provide a dose.',
      bodyDe: 'Das Stoffwechsel-/Lipidmuster und das Gewichtsreduktionsziel sprechen für ein ärztliches Gespräch über Diagnose, Gegenanzeigen und zugelassene Optionen. Retatrutid ist weiterhin experimentell; diese Werte belegen weder die Eignung noch eine Dosierung.',
      level: 'review',
    });
  }

  if (categories.has('inflammation') && (hasGoal('recovery') || hasGoal('performance'))) {
    pathways.push({
      title: 'Recovery claims need clinical context',
      titleDe: 'Regenerationsaussagen brauchen klinischen Kontext',
      body: 'An inflammation marker alone cannot justify BPC-157, TB-500, or another recovery peptide. Confirm the cause of the abnormal result and the injury diagnosis first; controlled human evidence for these peptide protocols remains limited.',
      bodyDe: 'Ein Entzündungsmarker allein rechtfertigt weder BPC-157 noch TB-500 oder ein anderes Regenerationspeptid. Zuerst sollten Ursache des auffälligen Werts und Verletzungsdiagnose geklärt werden; kontrollierte Humanstudien zu diesen Protokollen sind weiterhin begrenzt.',
      level: 'review',
    });
  }

  if (categories.has('liver') || categories.has('kidney') || categories.has('thyroid')) {
    pathways.push({
      title: 'Clarify organ-function markers before any protocol',
      titleDe: 'Organfunktionswerte vor jedem Protokoll klären',
      body: 'Out-of-range liver, kidney, or thyroid markers can change treatment risk. Review the original report, medicines, supplements, symptoms, and repeat-testing needs with a qualified clinician before considering any peptide.',
      bodyDe: 'Auffällige Leber-, Nieren- oder Schilddrüsenwerte können das Behandlungsrisiko verändern. Originalbericht, Medikamente, Nahrungsergänzungen, Symptome und Wiederholungstests sollten vor jeder Peptidüberlegung ärztlich geprüft werden.',
      level: 'caution',
    });
  }

  if (!pathways.length) {
    pathways.push({
      title: 'No peptide protocol can be inferred from this report alone',
      titleDe: 'Aus diesem Bericht allein lässt sich kein Peptidprotokoll ableiten',
      body: 'The extracted values can support a clinician conversation, but normal or isolated laboratory results do not establish an indication, compound, dose, or schedule.',
      bodyDe: 'Die erkannten Werte können ein ärztliches Gespräch unterstützen; normale oder einzelne Laborwerte legen jedoch weder Indikation, Wirkstoff, Dosis noch Zeitplan fest.',
      level: 'review',
    });
  }

  return pathways;
}

