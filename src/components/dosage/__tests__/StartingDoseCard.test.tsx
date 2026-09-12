import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StartingDoseCard } from '@/components/dosage/StartingDoseCard';
import { getStartingDoseReference } from '@/data/startingDoseReferences';
import { getAllSelectablePeptides } from '@/data/blendAdapters';

describe('starting-dose evidence boundaries', () => {
  it('pairs a labelled starting dose with the exact product, population and source', () => {
    render(<StartingDoseCard peptideId="semaglutide" peptideName="Semaglutide" />);
    expect(screen.getByText(/0.25 mg under the skin once weekly/)).toBeInTheDocument();
    expect(screen.getByText(/Adults with type 2 diabetes/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ozempic prescribing information/ })).toHaveAttribute('href', 'https://www.novo-pi.com/ozempic.pdf');
  });
  it('replaces the numeric label when moving from a medicine to BPC-157', () => {
    const view = render(<StartingDoseCard peptideId="tirzepatide" peptideName="Tirzepatide" />);
    expect(screen.getByText(/2.5 mg under the skin once weekly/)).toBeInTheDocument();
    view.rerender(<StartingDoseCard peptideId="bpc157" peptideName="BPC-157" />);
    expect(screen.getByText('No established starting dose')).toBeInTheDocument();
    expect(screen.queryByText(/2.5 mg under the skin/)).not.toBeInTheDocument();
    expect(getStartingDoseReference('bpc157').labels).toEqual([]);
  });
  it('does not turn ingredient doses or legacy catalogue tiers into blend recommendations', () => {
    const selections = getAllSelectablePeptides();
    const blends = selections.filter(compound => compound.isBlend);
    expect(blends.length).toBeGreaterThan(0);
    for (const compound of blends) {
      expect(getStartingDoseReference(compound.id)).toMatchObject({ status: 'blend', labels: [] });
    }
    for (const compound of selections) {
      const reference = getStartingDoseReference(compound.id);
      expect(reference.summary.length).toBeGreaterThan(0);
      if (reference.status !== 'product-label') expect(reference.labels).toEqual([]);
    }
  });
  it('keeps missing coverage distinct from evidence that a starting dose is not established', () => {
    expect(getStartingDoseReference('unreviewed-compound')).toMatchObject({ status: 'not-verified', labels: [] });
    expect(getStartingDoseReference('unreviewed-compound').reviewedAt).toBeUndefined();
    expect(getStartingDoseReference('tesamorelin').labels[0].context).toContain('not substitutable');
  });
});
