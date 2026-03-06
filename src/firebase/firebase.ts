'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS
 * Inicialização robusta com modo de resiliência de rede avançado.
 * Otimizado para Safari iOS, navegação privada e redes com restrição de WebSocket.
 */

let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        // 🛡️ PROTOCOLO DE CONEXÃO HARDENED V25
        // Forçamos o Long Polling e definimos o host explicitamente para evitar timeouts de 10s.
        const firestoreSettings = {
            experimentalForceLongPolling: true,
            experimentalAutoDetectLongPolling: false,
            host: "firestore.googleapis.com",
            ssl: true,
        };

        // Tenta configurar o cache local de forma compatível com mobile e desktop.
        try {
            db = initializeFirestore(app, {
                ...firestoreSettings,
                localCache: persistentLocalCache({
                    tabManager: persistentMultipleTabManager()
                })
            });
        } catch (cacheError) {
            console.warn("⚠️ LK RAMOS: Cache persistente não disponível. Usando modo de memória.");
            db = initializeFirestore(app, {
                ...firestoreSettings,
                localCache: memoryLocalCache()
            });
        }

        auth = getAuth(app);
        storage = getStorage(app, firebaseConfig.storageBucket);
        
        console.log("💎 LK RAMOS: Núcleo Firebase sincronizado via Long Polling (Modo Estável).");
    } catch (error) {
        console.error("❌ Erro crítico na inicialização do Firebase:", error);
    }
}

export { db, auth, storage };

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== "undefined") {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return null;
}
