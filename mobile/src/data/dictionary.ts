/**
 * Medical dictionary access layer, backed by the same dictionary.json the web
 * app ships. Entries are keyed by term ("Aneurysm", "Hypertension", ...).
 */
import dictionaryJson from './dictionary.json';
import type { DictionaryTerm } from './types';

type RawEntry = Omit<DictionaryTerm, 'term'>;

const RAW = dictionaryJson as unknown as Record<string, RawEntry>;

export const DICTIONARY_TERMS: DictionaryTerm[] = Object.entries(RAW)
  .map(([term, entry]) => ({ term, ...entry }))
  .sort((a, b) => a.term.localeCompare(b.term));

export function getTerm(term?: string | null): DictionaryTerm | undefined {
  if (!term) return undefined;
  const entry = RAW[term];
  if (entry) return { term, ...entry };
  // Case-insensitive fallback so deep links and reader taps still resolve.
  const key = Object.keys(RAW).find((k) => k.toLowerCase() === term.toLowerCase());
  return key ? { term: key, ...RAW[key] } : undefined;
}

export function searchTerms(query: string): DictionaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return DICTIONARY_TERMS;
  return DICTIONARY_TERMS.filter((t) => {
    const haystack = `${t.term} ${t.definition ?? ''} ${(t.causes ?? []).join(' ')}`.toLowerCase();
    return haystack.includes(q);
  });
}

/** Group terms by first letter for the A-Z index list. */
export function groupTermsByLetter(terms: DictionaryTerm[]): { letter: string; items: DictionaryTerm[] }[] {
  const groups = new Map<string, DictionaryTerm[]>();
  terms.forEach((t) => {
    const letter = t.term.charAt(0).toUpperCase();
    const bucket = groups.get(letter);
    if (bucket) bucket.push(t);
    else groups.set(letter, [t]);
  });
  return [...groups.entries()]
    .map(([letter, items]) => ({ letter, items }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}
