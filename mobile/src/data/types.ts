/** Shared domain types for the LIMES mobile app. */

export interface Book {
  id: string;
  title: string;
  author: string;
  rating: string;
  reads: string;
  category: string;
  /** Web-style path such as "covers/thaoduoc.png"; resolve via resolveCover(). */
  cover: string;
  desc: string;
  tags: string[];
}

export interface Chapter {
  /** Stable id, equal to the key in chapters.json. */
  id: string;
  title: string;
  meta: string;
  /** Raw HTML page bodies rendered inside the reader WebView. */
  pages: string[];
}

export interface CategoryShelf {
  title: string;
  subtitle: string;
  bookIds: string[];
}

export interface CategoryHub {
  id: string;
  title: string;
  tagline: string;
  /** Tailwind gradient string from the web app; parsed into hex stops for RN. */
  themeGradient: string;
  glowColor: string;
  accentBadge: string;
  spotlightId: string;
  spotlightBadge: string;
  shelves: CategoryShelf[];
}

export interface DictionaryTerm {
  /** Key in dictionary.json, e.g. "Aneurysm". */
  term: string;
  pronunciation?: string;
  symptoms?: string[];
  diagnosis?: DiagnosisEntry[];
  causes?: string[];
  treatment?: string[];
  definition?: string;
  note?: string;
}

export interface QuizOption {
  text: string;
  /** Per-option rationale shown after answering. */
  desc: string;
}

export interface QuizQuestion {
  question: string;
  desc: string;
  options: QuizOption[];
  correctIndex: number;
  explanation: string;
}

export interface DiagnosisEntry {
  label: string;
  desc: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  pageIndex: number;
  title: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  pageIndex: number;
  text: string;
  color: string;
  createdAt: number;
}

export interface Note extends Highlight {
  note: string;
}

export interface ReadingPosition {
  bookId: string;
  chapterId: string;
  pageIndex: number;
  updatedAt: number;
}
