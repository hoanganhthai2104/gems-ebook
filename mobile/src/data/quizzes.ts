/**
 * Quiz access layer. Ported from the `allBookQuizzes` map that lived inline in
 * the web index.html, keyed by chapter id.
 */
import quizzesJson from './quizzes.json';
import type { QuizQuestion } from './types';
import { getChaptersForBook } from './chapters';

const QUIZZES = quizzesJson as unknown as Record<string, QuizQuestion[]>;

export function getQuizForChapter(chapterId?: string | null): QuizQuestion[] {
  if (!chapterId) return [];
  return QUIZZES[chapterId] ?? [];
}

export function hasQuiz(chapterId?: string | null): boolean {
  return getQuizForChapter(chapterId).length > 0;
}

/** Chapters of a book that actually have a quiz, for the TOC quiz badges. */
export function getQuizChapterIds(bookId: string): string[] {
  return getChaptersForBook(bookId)
    .map((c) => c.id)
    .filter((id) => hasQuiz(id));
}

/** Coins awarded per correct answer, matching the web reward rule. */
export const COINS_PER_CORRECT_ANSWER = 10;
