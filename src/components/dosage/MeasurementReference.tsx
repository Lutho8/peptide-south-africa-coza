import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { amountAtMark, calculateMeasurement, formatMeasurementNumber as fmt, type MeasurementSyringeType } from '@/lib/measurementMath';

interface Props { vialAmountMg: number; diluentMl: number; barrelCapacityMl: number; syringeType: MeasurementSyringeType | '' }
export function MeasurementReference({ vialAmountMg, diluentMl, barrelCapacityMl, syringeType }: Props) {
  const [mark, setMark] = useState('');
  const concentration = vialAmountMg > 0 && diluentMl > 0 ? vialAmountMg / diluentMl : 0;
  const valid = concentration > 0 && Number.isFinite(concentration);
  const reverse = syringeType ? amountAtMark(vialAmountMg, diluentMl, Number(mark), syringeType) : null;
  const rows = [0.25, 0.5, 1, 1.5, 2].filter(amount => amount <= vialAmountMg).map(amount => {
    const result = calculateMeasurement({ vialAmountMg, diluentMl, enteredAmount: amount, enteredUnit: 'mg', syringeType: 'U-100', barrelCapacityMl: barrelCapacityMl || 1 });
    return result && { mg: amount, mcg: amount * 1000, ml: result.volumeMl, u40: result.volumeMl * 40, u100: result.syringeUnits };
  }).filter((row): row is NonNullable<typeof row> => row !== null);
  const copy = async () => {
    const text = ['PSA conversion reference — arithmetic examples, not recommended doses', `${vialAmountMg} mg in ${diluentMl} mL = ${fmt(concentration)} mg/mL`, 'mg\tmcg\tmL\tU-40 marking\tU-100 marking', ...rows.map(row => [row.mg, row.mcg, row.ml, row.u40, row.u100].map(value => fmt(value)).join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(text); toast.success('Reference copied with concentration and both syringe scales.'); }
    catch { toast.error('Could not copy. You can select the table text instead.'); }
  };
  return <Card className="space-y-5 p-4 sm:p-5">
    <div><h2 className="text-xl font-semibold">Syringe units are volume, not dose</h2><p className="mt-2 text-sm text-muted-foreground">U-100: 1 unit = 0.01 mL. U-40: 1 unit = 0.025 mL. The same unit number on U-40 represents 2.5 times as much liquid. These conversions describe syringe markings; they do not convert medicine-specific IU to mg.</p></div>
    <div className="rounded-xl bg-primary/5 p-4 text-sm"><strong>Why “10 units” is incomplete</strong><p className="mt-1">On U-100, 10 units at 25 mcg per unit contains 250 mcg; at 50 mcg per unit it contains 500 mcg. Match the vial concentration and syringe scale before comparing a number from someone else.</p></div>
    {valid ? <>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Your concentration reference</h3><p className="text-sm text-muted-foreground">{vialAmountMg} mg in {diluentMl} mL = {fmt(concentration)} mg/mL. Arithmetic examples only; this table does not recommend amounts or schedules.</p></div><Button variant="outline" onClick={() => void copy()}>Copy reference</Button></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Conversion examples for the entered concentration</caption><thead><tr className="border-b bg-muted/50">{['mg', 'mcg', 'mL', 'U-40 marking', 'U-100 marking'].map(label => <th key={label} className="whitespace-nowrap p-3">{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr className="border-b" key={row.mg}>{[row.mg, row.mcg, row.ml, row.u40, row.u100].map((value, index) => <td key={index} className="p-3 tabular-nums">{fmt(value)}</td>)}</tr>)}</tbody></table></div>
      <p className="text-sm text-muted-foreground">Rows may fall between physical markings or exceed a small barrel. Check the capacity and smallest increment above. For a blend, total vial mg is the combined amount, not the amount of each ingredient.</p>
      <div className="space-y-2 border-t pt-4"><h3 className="font-semibold">What does a syringe marking contain?</h3><Label htmlFor="reverse-mark">Marking to check{ syringeType ? ` (${syringeType})` : ' — select a syringe scale above'}</Label><Input id="reverse-mark" type="number" inputMode="decimal" min="0" step="any" value={mark} onChange={event => setMark(event.target.value)} placeholder="Enter the marking, e.g. 10" />
      <div aria-live="polite">{reverse && <p className="rounded-xl bg-primary/10 p-3 text-sm font-medium">{mark} units on {syringeType} = {fmt(reverse.volumeMl)} mL = {fmt(reverse.amountMg)} mg = {fmt(reverse.amountMcg)} mcg.</p>}{reverse && barrelCapacityMl > 0 && reverse.volumeMl > barrelCapacityMl && <p role="alert" className="mt-2 text-sm text-destructive">This marking exceeds your selected barrel capacity.</p>}{mark && syringeType && !reverse && <p role="alert" className="text-sm text-destructive">Check the marking: it must be positive and cannot represent more liquid than the vial contains.</p>}</div></div>
    </> : <p className="text-sm text-muted-foreground">Enter the vial amount and diluent volume above to build a reference for your actual concentration.</p>}
    <a className="inline-block text-sm font-medium text-primary underline" href="https://www.peptide-south-africa.com/blog/peptide-injection-site-rotation-guide">Read the injection-site rotation guide</a>
  </Card>;
}
