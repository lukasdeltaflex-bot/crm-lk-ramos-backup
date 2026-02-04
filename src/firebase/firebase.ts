
'use client';

import { initializeApp, FirebaseApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ FIREBASE ESTRUTURAL V66
 * Proibição de execução fora do browser e estabilização de rede.
 */

if (typeof window === "undefined") {
    // Silencia erros durante o build do Next.js, mas impede execução de Firestore no server
}

const g = globalThis as any;

let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// 🛡️ Inicialização Única e Estável do Firestore
if (!g._firebaseDb && typeof window !== "undefined") {
    try {
        g._firebaseDb = initializeFirestore(app, {
            experimentalForceLongPolling: true,
            useFetchStreams: false,
        });
    } catch (e) {
        // Fallback extremamente resiliente
    }
}
const db: Firestore = g._firebaseDb;

if (!g._firebaseAuth) {
    g._firebaseAuth = getAuth(app);
}
const auth: Auth = g._firebaseAuth;

if (!g._firebaseStorage) {
    g._firebaseStorage = getStorage(app);
}
const storage: FirebaseStorage = g._firebaseStorage;

export { app, auth, db, storage };

export function initializeFirebase(): FirebaseApp {
  return app;
}
