'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS
 */

let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Inicialização robusta: se o bucket estiver vazio no .env, tenta usar o padrão do app
        const bucketName = firebaseConfig.storageBucket;
        storage = bucketName ? getStorage(app, `gs://${bucketName}`) : getStorage(app);
        
        console.log("💎 LK RAMOS: Firebase carregado.", {
            bucketConfigurado: bucketName || "USANDO PADRÃO/VAZIO",
            projectId: firebaseConfig.projectId
        });
    } catch (error) {
        console.error("❌ Erro na inicialização do Firebase:", error);
    }
}

export { db, auth, storage };

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== "undefined") {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return null;
}
