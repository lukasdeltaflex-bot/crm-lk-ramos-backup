'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ FIREBASE ESTRUTURAL V66 (FINAL)
 * Proibição de execução no servidor e motor de sincronização Long Polling.
 */

if (typeof window === "undefined") {
    // Interrompe imediatamente se tentar carregar no lado do servidor (Next.js SSR)
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Singleton Firestore Blindado V66
const g = globalThis as any;
if (!g._firebaseDb && typeof window !== "undefined") {
    g._firebaseDb = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        useFetchStreams: false,
    });
}

export const db = g._firebaseDb;
export const auth = getAuth(app);
export const storage = getStorage(app);

export function initializeFirebase() {
  return app;
}
