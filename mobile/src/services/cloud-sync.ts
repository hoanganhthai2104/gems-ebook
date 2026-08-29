/**
 * Firestore sync for user session state.
 * Mirrors js/modules/state.js: the same `user_sessions/{userId}` document and
 * the same field names, so web and mobile share one progress record.
 */
import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Bookmark, Highlight, Note, ReadingPosition } from '@/data/types';

const COLLECTION = 'user_sessions';
const DEBOUNCE_MS = 1500;

export interface CloudSessionPayload {
  userCoins: number;
  streakDays: number;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
  userVouchers: string[];
  lastReadingPosition: ReadingPosition | null;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced write, matching the web app's 1.5s coalescing window. */
export function saveSessionToCloud(userId: string, payload: CloudSessionPayload): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await setDoc(
        doc(getDb(), COLLECTION, userId),
        { ...payload, updatedAt: serverTimestamp() },
        { merge: true },
      );
    } catch (error) {
      // Offline or rules failure must never break the UI - local state is the
      // source of truth and the next write retries.
      console.warn('[cloud-sync] save failed:', error);
    }
  }, DEBOUNCE_MS);
}

/** Live listener that pushes remote changes back into the local store. */
export function subscribeToSession(
  userId: string,
  onData: (data: Partial<CloudSessionPayload>) => void,
): Unsubscribe | null {
  try {
    return onSnapshot(
      doc(getDb(), COLLECTION, userId),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data() as Partial<CloudSessionPayload> | undefined;
        if (data) onData(data);
      },
      (error) => console.warn('[cloud-sync] listener error:', error),
    );
  } catch (error) {
    console.warn('[cloud-sync] subscribe failed:', error);
    return null;
  }
}
