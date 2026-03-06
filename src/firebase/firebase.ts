'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS
 * Inicialização robusta com modo de resiliência de rede avançado.
 * Otimizado para Safari iOS e navegação privada.
 */

let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        // 🛡️ INICIALIZAÇÃO RESILIENTE V24
        // Tenta configurar o cache local de forma compatível com mobile e desktop.
        // Se falhar (comum no Safari iOS Private), ele ignora o erro e inicializa o Firestore sem cache.
        try {
            db = initializeFirestore(app, {
                experimentalForceLongPolling: true,
                experimentalAutoDetectLongPolling: false,
                localCache: persistentLocalCache({
                    tabManager: persistentMultipleTabManager()
                })
            });
        } catch (cacheError) {
            console.warn("⚠️ LK RAMOS: Cache persistente não disponível neste navegador. Usando modo online direto.");
            db = initializeFirestore(app, {
                experimentalForceLongPolling: true,
                experimentalAutoDetectLongPolling: false,
                localCache: memoryLocalCache()
            });
        }

        auth = getAuth(app);
        storage = getStorage(app, firebaseConfig.storageBucket);
        
        console.log("💎 LK RAMOS: Núcleo Firebase sincronizado com protocolo de alta compatibilidade.");
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
