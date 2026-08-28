/**
 * Chapter access layer.
 * chapters.json stores each page as a raw HTML string (Tailwind-classed markup
 * authored for the web reader), so pages are handed to the reader WebView
 * as-is rather than converted to React Native elements.
 *
 * The book -> chapter mapping is ported from js/modules/reader.js
 * (bookToDefaultChapter + chapterBelongsToBook).
 */
import chaptersJson from './chapters.json';
import type { Chapter } from './types';

type RawChapter = { title: string; meta: string; pages: string[] };

const RAW = chaptersJson as unknown as Record<string, RawChapter>;

/** Explicit chapter ordering per book. Books absent here use DEFAULT_CHAPTER. */
export const BOOK_CHAPTERS: Record<string, string[]> = {
  chandoanykhoa: ['tongquan', 'hetuanhoan', 'ecg'],
  thaoduoc: ['tamthat', 'nhansam'],
  trietly_yhss: ['trietly_mo_dau', 'trietly_5nen', 'trietly_3tru', 'trietly_ket_luan'],
  nuoc_va_su_song: ['nuoc_va_su_song'],
  tam_hoc_chua_lanh: ['tam_hoc_chua_lanh'],
  nhansam: ['nhansam'],
  lamsangnoikhoa: ['hetuanhoan'],
};

/** Fallback chapter for books that have no dedicated content yet. */
export const DEFAULT_CHAPTER: Record<string, string> = {
  capnhatyvan: 'ecg',
  thucduong: 'trietly_5nen',
  trathaomoc: 'nuoc_va_su_song',
  'co-the-nguoi': 'tongquan',
  thankinh: 'hetuanhoan',
  thankinhhoc: 'hetuanhoan',
  ditruyen: 'tongquan',
};

const GENERIC_FALLBACK = 'tongquan';

export function getChapter(chapterId?: string | null): Chapter | undefined {
  if (!chapterId) return undefined;
  const raw = RAW[chapterId];
  if (!raw) return undefined;
  return { id: chapterId, ...raw };
}

/** Ordered chapter list for a book, always non-empty. */
export function getChaptersForBook(bookId?: string | null): Chapter[] {
  if (!bookId) return [];
  const ids = BOOK_CHAPTERS[bookId];
  if (ids?.length) {
    return ids.map((id) => getChapter(id)).filter((c): c is Chapter => Boolean(c));
  }
  const fallbackId = DEFAULT_CHAPTER[bookId] ?? GENERIC_FALLBACK;
  const fallback = getChapter(fallbackId);
  return fallback ? [fallback] : [];
}

export function getFirstChapterId(bookId?: string | null): string | undefined {
  return getChaptersForBook(bookId)[0]?.id;
}

/** Resolve the chapter to open, preferring a saved position when it is valid. */
export function resolveChapterId(bookId: string, preferredChapterId?: string | null): string | undefined {
  const chapters = getChaptersForBook(bookId);
  if (preferredChapterId && chapters.some((c) => c.id === preferredChapterId)) {
    return preferredChapterId;
  }
  return chapters[0]?.id;
}

export function getPageCount(chapterId: string): number {
  return RAW[chapterId]?.pages.length ?? 0;
}

/** Total pages across a book, used for progress indicators. */
export function getBookPageCount(bookId: string): number {
  return getChaptersForBook(bookId).reduce((sum, c) => sum + c.pages.length, 0);
}

/** Strip HTML tags for previews, search snippets and text-to-speech. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
