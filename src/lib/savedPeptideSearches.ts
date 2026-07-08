// Local-only saved-search store for the Peptide Database screen.
// Keyed per browser; matches the existing rtd-peptides-filters persistence.

const KEY = 'rtd-peptide-saved-searches';

export interface SavedPeptideSearch {
  id: string;
  name: string;
  query: string;
  activeFilter: string;
  researchFilter: string;
  sortBy: string;
  createdAt: number;
}

function read(): SavedPeptideSearch[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: SavedPeptideSearch[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* quota/private-mode: ignore */
  }
}

export function listSavedSearches(): SavedPeptideSearch[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveSavedSearch(
  entry: Omit<SavedPeptideSearch, 'id' | 'createdAt'>
): SavedPeptideSearch {
  const items = read();
  const rec: SavedPeptideSearch = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  items.push(rec);
  write(items);
  return rec;
}

export function removeSavedSearch(id: string): void {
  write(read().filter((s) => s.id !== id));
}

export function summarizeSearch(
  input: Omit<SavedPeptideSearch, 'id' | 'createdAt' | 'name'>
): string {
  const bits: string[] = [];
  if (input.query.trim()) bits.push(`"${input.query.trim().slice(0, 24)}"`);
  if (input.activeFilter && input.activeFilter !== 'all') bits.push(input.activeFilter);
  if (input.researchFilter && input.researchFilter !== 'all') bits.push(input.researchFilter);
  if (input.sortBy && input.sortBy !== 'longevity') bits.push(`sort:${input.sortBy}`);
  return bits.length ? bits.join(' + ') : 'All peptides';
}
