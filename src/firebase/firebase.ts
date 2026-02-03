
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcdnNBy0TZTsq_cI02KFVU9o7PJopEczM",
  authDomain: "studio-248448941-9c1c2.firebaseapp.com",
  projectId: "studio-248448941-9c1c2",
  storageBucket: "studio-248448941-9c1c2.firebasestorage.app",
  messagingSenderId: "341426752875",
  appId: "1:341426752875:web:348f88597e5b9b2057d02e",
};

// 🛡️ SINGLETON ABSOLUTO V26: Proteção Imutável no globalThis
const g = globalThis as any;

if (!g._firebaseApp) {
    g._firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}
const app = g._firebaseApp;

// Firestore Singleton Blindado com bloqueio de re-inicialização
if (!g._firebaseDb) {
    try {
        // Força Long Polling para evitar erros de WebSocket (ca9) em proxies de nuvem
        g._firebaseDb = initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED,
            experimentalForceLongPolling: true,
        });
    } catch (e) {
        console.warn("🛡️ LK Ramos: Recuperando instância existente do Firestore.");
        g._firebaseDb = getFirestore(app);
    }
}
const db: Firestore = g._firebaseDb;

if (!g._firebaseAuth) {
    g._firebaseAuth = getAuth(app);
}
const auth = g._firebaseAuth;

if (!g._firebaseStorage) {
    g._firebaseStorage = getStorage(app);
}
const storage = g._firebaseStorage;

export { app, auth, db, storage };

export function initializeFirebase(): FirebaseApp {
  return app;
}
