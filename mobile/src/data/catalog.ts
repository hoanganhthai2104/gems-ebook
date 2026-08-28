/**
 * Book catalog access layer.
 * Mirrors js/modules/data.js from the web app: the same 30-book map, the same
 * Netflix-style category hubs, and the same tag-based filtering rules.
 */
import bookDataMap from './book-data-map.json';
import categoryHubs from './category-hubs.json';
import type { Book, CategoryHub } from './types';

export const BOOK_MAP = bookDataMap as unknown as Record<string, Book>;
export const BOOKS: Book[] = Object.values(BOOK_MAP);
export const CATEGORY_HUBS = categoryHubs as unknown as Record<string, CategoryHub>;

export function getBook(id?: string | null): Book | undefined {
  if (!id) return undefined;
  return BOOK_MAP[id];
}

export function getHub(key: string): CategoryHub | undefined {
  return CATEGORY_HUBS[key];
}

/** Distinct category labels, in catalog order, for the library filter chips. */
export function getCategories(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  BOOKS.forEach((b) => {
    if (b.category && !seen.has(b.category)) {
      seen.add(b.category);
      out.push(b.category);
    }
  });
  return out;
}

const CATEGORY_MATCHERS: Record<string, string[]> = {
  yhss: ['yhss', 'sự sống', 'triết lý'],
  thaoduoc: ['thaoduoc', 'dược', 'thảo'],
  giaiphau: ['giaiphau', 'giải phẫu', 'cơ thể'],
  thankinh: ['thankinh', 'thần kinh', 'não'],
  ditruyen: ['ditruyen', 'di truyền', 'gen'],
};

function searchableText(book: Book): string {
  return `${(book.tags ?? []).join(' ')} ${book.category ?? ''} ${book.title ?? ''} ${book.id ?? ''}`.toLowerCase();
}

/** Port of window.getFilteredBooks() - hub key based filtering. */
export function getFilteredBooks(hubKey?: string | null): Book[] {
  if (!hubKey || hubKey === 'all') return BOOKS;
  const needles = CATEGORY_MATCHERS[hubKey];
  if (!needles) return BOOKS;
  return BOOKS.filter((b) => {
    const text = searchableText(b);
    return needles.some((n) => text.includes(n));
  });
}

/** Filter by the human-readable category label used on the Library chips. */
export function getBooksByCategory(category?: string | null): Book[] {
  if (!category || category === 'all') return BOOKS;
  return BOOKS.filter((b) => b.category === category);
}

export function getBooksByIds(ids: string[]): Book[] {
  return ids.map((id) => BOOK_MAP[id]).filter(Boolean);
}

/** Free-text search across title, author, category and tags. */
export function searchBooks(query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return BOOKS.filter((b) => {
    const haystack = `${b.title} ${b.author} ${b.category} ${(b.tags ?? []).join(' ')}`.toLowerCase();
    return haystack.includes(q);
  });
}

/** Featured books drive the Home carousel, matching the web "featured" tag. */
export function getFeaturedBooks(): Book[] {
  const featured = BOOKS.filter((b) => (b.tags ?? []).includes('featured'));
  return featured.length > 0 ? featured : BOOKS.slice(0, 6);
}

/** Unique author list used by the author profile screen. */
export function getAuthors(): { id: string; name: string; bookCount: number }[] {
  const byName = new Map<string, number>();
  BOOKS.forEach((b) => byName.set(b.author, (byName.get(b.author) ?? 0) + 1));
  return [...byName.entries()].map(([name, bookCount]) => ({
    id: slugifyAuthor(name),
    name,
    bookCount,
  }));
}

export function slugifyAuthor(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBooksByAuthorSlug(slug: string): Book[] {
  return BOOKS.filter((b) => slugifyAuthor(b.author) === slug);
}
