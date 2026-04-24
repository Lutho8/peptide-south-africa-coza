import jsPDF from 'jspdf';
import type { BloodworkScanResult } from '@/components/bloodwork/BloodworkResults';

const MARGIN = 15;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function exportBloodworkProtocolPDF(result: BloodworkScanResult, filename = 'bloodwork-protocol.pdf') {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const ensure = (h: number) => {
    if (y + h > PAGE_H - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Ride The Tide — Bloodwork Protocol', MARGIN, y);
  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(120);
  pdf.text(
    `${result.scan_type === 'deep' ? 'Deep Decode' : 'Baseline Scan'} · ${result.biomarkers.length} biomarkers · Health score: ${
      result.health_score ?? 'n/a'
    }/100`,
    MARGIN,
    y
  );
  y += 6;
  pdf.text(`Goals: ${result.goals.join(', ') || '—'}`, MARGIN, y);
  y += 8;
  pdf.setTextColor(0);

  // Biomarkers
  section(pdf, '02 — Biomarker Panel', () => y, (next) => (y = next));
  for (const bm of result.biomarkers) {
    ensure(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(bm.name, MARGIN, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${bm.value} ${bm.unit}`, PAGE_W - MARGIN - 50, y, { align: 'left' });
    pdf.text(bm.status.toUpperCase(), PAGE_W - MARGIN, y, { align: 'right' });
    y += 4;
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    pdf.text(`Ref: ${bm.reference_range}`, MARGIN, y);
    pdf.setTextColor(0);
    y += 4;
  }

  // Insights
  if (result.insights.length) {
    section(pdf, '03 — Insights', () => y, (next) => (y = next));
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    result.insights.forEach((line, i) => {
      const text = `${i + 1}. ${line}`;
      const wrapped = pdf.splitTextToSize(text, CONTENT_W);
      ensure(wrapped.length * 5);
      pdf.text(wrapped, MARGIN, y);
      y += wrapped.length * 5 + 1;
    });
  }

  const p = result.protocol;

  if (p.stack?.length) {
    section(pdf, '04 — Peptide Stack', () => y, (next) => (y = next));
    if (p.stack_summary) wrap(pdf, p.stack_summary, () => y, (n) => (y = n));
    p.stack.forEach((peptide, i) => {
      ensure(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${i + 1}. ${peptide.name} (${peptide.priority.toUpperCase()})`, MARGIN, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      wrap(pdf, peptide.rationale, () => y, (n) => (y = n));
      wrap(pdf, `Dosing: ${peptide.dosing}`, () => y, (n) => (y = n));
      y += 1;
    });
    wrap(
      pdf,
      'Buy this stack: https://www.ridethetide.site/shop',
      () => y,
      (n) => (y = n)
    );
  }

  numberedSection(pdf, '05 — Supplements', p.supplements?.map((s) => ({
    title: `${s.name}${s.dose ? ` — ${s.dose}` : ''}`,
    body: [s.what_it_is, s.why_it_matters, s.how_to_take].filter(Boolean).join(' '),
  })), () => y, (n) => (y = n));

  numberedSection(pdf, '06 — Nutrition', p.nutrition?.map((n) => ({
    title: n.title,
    body: [n.what_it_looks_like, n.why_adopt, n.examples].filter(Boolean).join(' '),
  })), () => y, (n) => (y = n));

  numberedSection(pdf, '07 — Exercise', p.exercise, () => y, (n) => (y = n));
  numberedSection(pdf, '08 — Stress', p.stress, () => y, (n) => (y = n));
  numberedSection(pdf, '09 — Environment', p.environment, () => y, (n) => (y = n));

  if (p.retest?.length) {
    section(pdf, '10 — Diagnostics: Retest', () => y, (next) => (y = next));
    p.retest.forEach((r, i) => {
      ensure(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${i + 1}. ${r.marker}${r.when ? ` — ${r.when}` : ''}`, MARGIN, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      if (r.why) wrap(pdf, r.why, () => y, (n) => (y = n));
    });
  }

  // Disclaimer
  pdf.addPage();
  y = MARGIN;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Disclaimer', MARGIN, y);
  y += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  wrap(
    pdf,
    'This analysis is for educational and informational purposes only. It does not constitute medical advice. Consult a qualified healthcare provider before making any changes to your health regimen, including peptide protocols, supplements, or diagnostic testing.',
    () => y,
    (n) => (y = n)
  );

  pdf.save(filename);
}

function section(pdf: jsPDF, title: string, getY: () => number, setY: (n: number) => void) {
  let y = getY();
  if (y + 12 > PAGE_H - MARGIN) {
    pdf.addPage();
    y = MARGIN;
  }
  y += 4;
  pdf.setDrawColor(180);
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(title, MARGIN, y);
  y += 6;
  setY(y);
}

function wrap(pdf: jsPDF, text: string, getY: () => number, setY: (n: number) => void) {
  let y = getY();
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(text, CONTENT_W);
  if (y + lines.length * 5 > PAGE_H - MARGIN) {
    pdf.addPage();
    y = MARGIN;
  }
  pdf.text(lines, MARGIN, y);
  y += lines.length * 5 + 1;
  setY(y);
}

function numberedSection(
  pdf: jsPDF,
  title: string,
  items: { title: string; body?: string }[] | undefined,
  getY: () => number,
  setY: (n: number) => void
) {
  if (!items?.length) return;
  section(pdf, title, getY, setY);
  items.forEach((item, i) => {
    let y = getY();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    if (y + 6 > PAGE_H - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.text(`${i + 1}. ${item.title}`, MARGIN, y);
    y += 5;
    setY(y);
    pdf.setFont('helvetica', 'normal');
    if (item.body) wrap(pdf, item.body, getY, setY);
  });
}
