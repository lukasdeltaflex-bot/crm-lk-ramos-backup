import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, initializeFirestore, CACHE_SIZE_UNLIMITED, getFirestore as getExistingFirestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcdnNBy0TZTsq_cI02KFVU9o7PJopEczM",
  authDomain: "studio-248448941-9c1c2.firebaseapp.com",
  projectId: "studio-248448941-9c1c2",
  storageBucket: "studio-248448941-9c1c2.firebasestorage.app",
  messagingSenderId: "341426752875",
  appId: "1:341426752875:web:348f88597e5b9b2057d02e",
};

// 🛡️ SINGLETON BLINDADO V21: Proteção absoluta contra erros de estado ca9/b815
// Usamos o globalThis para garantir que as instâncias persistam entre os Hot Reloads do Next.js
const g = globalThis as any;

const app = g._firebaseApp || (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
if (process.env.NODE_ENV !== "production") g._firebaseApp = app;

let db: Firestore;
if (g._firebaseDb) {
    db = g._firebaseDb;
} else {
    try {
        // Forçamos Long Polling e desativamos auto-detect para estabilidade total em ambientes Cloud
        db = initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED,
            experimentalForceLongPolling: true,
            experimentalAutoDetectLongPolling: false,
        });
    } catch (e) {
        try {
            db = getExistingFirestore(app);
        } catch (inner) {
            db = getFirestore(app);
        }
    }
    g._firebaseDb = db;
}

const auth = g._firebaseAuth || (g._firebaseAuth = getAuth(app));
const storage = g._firebaseStorage || (g._firebaseStorage = getStorage(app));

export { app, auth, db, storage };

export function initializeFirebase(): FirebaseApp {
  return app;
}
