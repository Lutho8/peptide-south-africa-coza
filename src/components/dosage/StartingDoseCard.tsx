import { BookOpen, ExternalLink } from 'lucide-react';
import { getStartingDoseReference } from '@/data/startingDoseReferences';

export function StartingDoseCard({ peptideId, peptideName }: { peptideId: string; peptideName: string }) {
  const reference = getStartingDoseReference(peptideId);
  return (
    <section aria-label={`Starting dose and evidence for ${peptideName}`} className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <h3 className="font-semibold">Starting dose &amp; evidence</h3>
      </div>
      <p className="text-sm font-medium">{reference.summary}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{reference.explanation}</p>
      {reference.labels.map(label => (
        <div key={label.product} className="space-y-2 rounded-lg border border-border bg-background p-3">
          <p className="text-sm font-semibold">{label.product}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{label.population}</p>
          <p className="text-sm font-semibold text-primary">{label.amount}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{label.context}</p>
          <a className="inline-flex items-center gap-1 text-xs text-primary underline" href={label.source.url} target="_blank" rel="noopener noreferrer">{label.source.title}<ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" /></a>
        </div>
      ))}
      {reference.sources.map(source => <a key={source.url} className="block text-xs text-primary underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>)}
      <details className="border-t border-border pt-3 text-sm">
        <summary className="cursor-pointer font-medium">New to tracking? Start here</summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Record your baseline symptoms, sleep, weight and relevant bloodwork before a change.</li>
          <li>Have your clinician confirm the product, reason for use, dose, schedule and review plan against your health history and medicines.</li>
          <li>For a prescribed vial preparation, enter the actual concentration and confirmed dose in the calculator. Use a supplied pen according to its own instructions.</li>
          <li>Log the dose, time, site and side effects. Review changes with your clinician; becoming more experienced does not mean increasing the dose.</li>
        </ol>
        <a className="mt-3 inline-block text-primary underline" href="/?tab=daily-log">Open Daily Log</a>
      </details>
      {reference.reviewedAt && <p className="text-xs text-muted-foreground">Reference reviewed {reference.reviewedAt}. Read the linked prescribing information for contraindications and the complete instructions.</p>}
    </section>
  );
}
