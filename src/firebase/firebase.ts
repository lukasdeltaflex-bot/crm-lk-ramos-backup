
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS
 * Centraliza a inicialização dos serviços garantindo estabilidade no Browser.
 */

let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Inicialização explícita do Storage com log de verificação
        // Garante que o bucket seja injetado corretamente na instância
        const bucketName = firebaseConfig.storageBucket?.replace(/^gs:\/\//, '');
        
        if (bucketName) {
            storage = getStorage(app, bucketName);
            console.log("💎 LK RAMOS: Firebase Storage inicializado com sucesso.");
        } else {
            console.error("❌ LK RAMOS ERRO: Variável 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' não encontrada ou vazia no arquivo .env");
        }
    } catch (error) {
        console.error("❌ Falha crítica ao inicializar Firebase:", error);
    }
}

export { db, auth, storage };

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== "undefined") {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return null;
}
