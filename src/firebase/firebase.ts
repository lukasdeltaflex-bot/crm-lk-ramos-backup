'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS - ULTRA RESILIENTE
 * Otimizado para ambientes com restrição de rede, proxies corporativos e Safari iOS.
 */

let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        // 🛡️ PROTOCOLO DE CONEXÃO BLINDADO V26
        // Forçamos Long Polling e desativamos Fetch Streams para máxima compatibilidade.
        // Isso resolve erros de "Could not reach Cloud Firestore backend" em redes instáveis.
        const firestoreSettings = {
            experimentalForceLongPolling: true,
            experimentalAutoDetectLongPolling: false,
            useFetchStreams: false, // Crucial: Evita problemas com proxies que não suportam streams
            host: "firestore.googleapis.com",
            ssl: true,
        };

        // Gerenciamento de cache resiliente (Safe para Safari Mobile e Modo Privado)
        const localCache = (() => {
            try {
                return persistentLocalCache({
                    tabManager: persistentMultipleTabManager()
                });
            } catch (e) {
                console.warn("⚠️ LK RAMOS: Cache persistente não suportado. Usando modo memória.");
                return memoryLocalCache();
            }
        })();

        db = initializeFirestore(app, {
            ...firestoreSettings,
            localCache
        });

        auth = getAuth(app);
        storage = getStorage(app, firebaseConfig.storageBucket);
        
        console.log("💎 LK RAMOS: Conectividade Firestore estabilizada via Long Polling + No-Streams.");
    } catch (error) {
        console.error("❌ Falha crítica na inicialização Firebase:", error);
    }
}

export { db, auth, storage };

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== "undefined") {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return null;
}
