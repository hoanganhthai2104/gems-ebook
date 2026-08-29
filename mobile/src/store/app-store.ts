/**
 * Global app state - the React Native port of window.appState (js/modules/state.js).
 * Persisted to AsyncStorage and mirrored to Firestore through cloud-sync.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Bookmark, Highlight, Note, ReadingPosition } from '@/data/types';
import { saveSessionToCloud, subscribeToSession } from '@/services/cloud-sync';
import type { ReaderThemeKey } from '@/theme/tokens';

/** Reader typeface, ported from the web `setReaderFont('sans' | 'serif')`. */
export type ReaderFontFamily = 'sans' | 'serif';

export interface AppState {
  // Session
  isLoggedIn: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  onboardingCompleted: boolean;

  // Gamification
  userCoins: number;
  streakDays: number;
  pagesRead: number;
  userVouchers: string[];

  // Reading
  currentBookId: string | null;
  currentChapterId: string | null;
  currentPageIndex: number;
  lastReadingPosition: ReadingPosition | null;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];

  // Reader preferences
  readerTheme: ReaderThemeKey;
  readerFontScale: number;
  readerFontFamily: ReaderFontFamily;

  // Actions
  login: (payload: { userId: string; userName?: string; userEmail?: string }) => void;
  logout: () => void;
  completeOnboarding: () => void;
  addCoins: (amount: number) => void;
  addVoucher: (voucherId: string) => void;
  setPagesRead: (pages: number) => void;
  openBook: (bookId: string, chapterId: string, pageIndex?: number) => void;
  setPage: (pageIndex: number) => void;
  setChapter: (chapterId: string, pageIndex?: number) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  removeHighlight: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  setReaderTheme: (theme: ReaderThemeKey) => void;
  setReaderFontScale: (scale: number) => void;
  setReaderFontFamily: (family: ReaderFontFamily) => void;
  hydrateFromCloud: (data: Partial<AppState>) => void;
}

const DEFAULT_USER_ID = 'user_demo_01';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userId: DEFAULT_USER_ID,
      userName: 'Bạn đọc LIMES',
      userEmail: '',
      onboardingCompleted: false,

      userCoins: 250,
      streakDays: 15,
      pagesRead: 0,
      userVouchers: ['VOUCHER_25k', 'FREESHIP_0d'],

      currentBookId: null,
      currentChapterId: null,
      currentPageIndex: 0,
      lastReadingPosition: null,
      bookmarks: [],
      highlights: [],
      notes: [],

      readerTheme: 'white',
      readerFontScale: 1,
      readerFontFamily: 'sans',

      login: ({ userId, userName, userEmail }) =>
        set({
          isLoggedIn: true,
          userId: userId || DEFAULT_USER_ID,
          userName: userName || 'Bạn đọc LIMES',
          userEmail: userEmail || '',
        }),

      logout: () => set({ isLoggedIn: false }),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      addCoins: (amount) => set((s) => ({ userCoins: Math.max(0, s.userCoins + amount) })),

      addVoucher: (voucherId) =>
        set((s) =>
          s.userVouchers.includes(voucherId)
            ? s
            : { userVouchers: [...s.userVouchers, voucherId] },
        ),

      setPagesRead: (pages) => set({ pagesRead: pages }),

      openBook: (bookId, chapterId, pageIndex = 0) =>
        set({
          currentBookId: bookId,
          currentChapterId: chapterId,
          currentPageIndex: pageIndex,
          lastReadingPosition: { bookId, chapterId, pageIndex, updatedAt: Date.now() },
        }),

      setPage: (pageIndex) =>
        set((s) => ({
          currentPageIndex: pageIndex,
          lastReadingPosition: s.currentBookId
            ? {
                bookId: s.currentBookId,
                chapterId: s.currentChapterId ?? '',
                pageIndex,
                updatedAt: Date.now(),
              }
            : s.lastReadingPosition,
        })),

      setChapter: (chapterId, pageIndex = 0) =>
        set((s) => ({
          currentChapterId: chapterId,
          currentPageIndex: pageIndex,
          lastReadingPosition: s.currentBookId
            ? { bookId: s.currentBookId, chapterId, pageIndex, updatedAt: Date.now() }
            : s.lastReadingPosition,
        })),

      toggleBookmark: (bookmark) =>
        set((s) => {
          const existing = s.bookmarks.find(
            (b) =>
              b.bookId === bookmark.bookId &&
              b.chapterId === bookmark.chapterId &&
              b.pageIndex === bookmark.pageIndex,
          );
          if (existing) {
            return { bookmarks: s.bookmarks.filter((b) => b.id !== existing.id) };
          }
          return {
            bookmarks: [
              ...s.bookmarks,
              { ...bookmark, id: makeId('bm'), createdAt: Date.now() },
            ],
          };
        }),

      addHighlight: (highlight) =>
        set((s) => ({
          highlights: [...s.highlights, { ...highlight, id: makeId('hl'), createdAt: Date.now() }],
        })),

      removeHighlight: (id) =>
        set((s) => ({ highlights: s.highlights.filter((h) => h.id !== id) })),

      addNote: (note) =>
        set((s) => ({
          notes: [...s.notes, { ...note, id: makeId('nt'), createdAt: Date.now() }],
        })),

      updateNote: (id, text) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, note: text } : n)),
        })),

      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      setReaderTheme: (readerTheme) => set({ readerTheme }),

      setReaderFontScale: (readerFontScale) =>
        set({ readerFontScale: Math.min(1.6, Math.max(0.8, readerFontScale)) }),

      setReaderFontFamily: (readerFontFamily) => set({ readerFontFamily }),

      hydrateFromCloud: (data) => set((s) => ({ ...s, ...data })),
    }),
    {
      name: 'limes-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        userId: s.userId,
        userName: s.userName,
        userEmail: s.userEmail,
        onboardingCompleted: s.onboardingCompleted,
        userCoins: s.userCoins,
        streakDays: s.streakDays,
        pagesRead: s.pagesRead,
        userVouchers: s.userVouchers,
        currentBookId: s.currentBookId,
        currentChapterId: s.currentChapterId,
        currentPageIndex: s.currentPageIndex,
        lastReadingPosition: s.lastReadingPosition,
        bookmarks: s.bookmarks,
        highlights: s.highlights,
        notes: s.notes,
        readerTheme: s.readerTheme,
        readerFontScale: s.readerFontScale,
        readerFontFamily: s.readerFontFamily,
      }),
    },
  ),
);

/**
 * Push local session state to Firestore whenever a synced field changes.
 * Call once from the root layout.
 */
export function startCloudSync(): () => void {
  const pushToCloud = (s: AppState) => {
    if (!s.isLoggedIn) return;
    saveSessionToCloud(s.userId, {
      userCoins: s.userCoins,
      streakDays: s.streakDays,
      bookmarks: s.bookmarks,
      highlights: s.highlights,
      notes: s.notes,
      userVouchers: s.userVouchers,
      lastReadingPosition: s.lastReadingPosition,
    });
  };

  const unsubscribeStore = useAppStore.subscribe(pushToCloud);

  const { userId, isLoggedIn } = useAppStore.getState();
  const unsubscribeCloud = isLoggedIn
    ? subscribeToSession(userId, (data) => {
        useAppStore.getState().hydrateFromCloud(data as Partial<AppState>);
      })
    : null;

  return () => {
    unsubscribeStore();
    unsubscribeCloud?.();
  };
}
