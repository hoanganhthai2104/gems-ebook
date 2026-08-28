/**
 * Firebase bootstrap for the mobile app.
 * Uses the same project as the web app (see index.html) so reading progress,
 * highlights and coins sync across web and mobile for the same user id.
 *
 * The Firebase Web API key is not a secret - it identifies the project and is
 * shipped in every web/mobile client. Access is controlled by Firestore rules.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error - getReactNativePersistence ships without types in some builds
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBqYwumJNkRogUIjCY965OQQv28nGeHI_o',
  authDomain: 'gems-ebook.firebaseapp.com',
  projectId: 'gems-ebook',
  storageBucket: 'gems-ebook.firebasestorage.app',
  messagingSenderId: '531668800970',
  appId: '1:531668800970:web:0985471a02361fcf0e6b33',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

/**
 * Auth with AsyncStorage persistence so the session survives app restarts.
 * initializeAuth throws if called twice, so fall back to getAuth.
 */
export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  try {
    auth = initializeAuth(getFirebaseApp(), {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}
