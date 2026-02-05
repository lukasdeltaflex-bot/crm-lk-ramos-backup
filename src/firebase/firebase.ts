'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

/**
 * 🛠️ INFRAESTRUTURA DE DADOS LK RAMOS
 * Centraliza a inicialização dos serviços garantindo estabilidade no Browser.
 */

let app;
let db: any = null;
let auth: any = null;
let storage: any = null;

if (typeof window !== "undefined") {
    try {
        // Inicializa o App se necessário
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        // Inicializa instâncias de serviço como Singletons estáveis
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        
        // Log de sanidade técnico (apenas para diagnóstico de uploads)
        if (!firebaseConfig.storageBucket || firebaseConfig.storageBucket === "") {
            console.warn("LK RAMOS AVISO: O campo 'storageBucket' está ausente na configuração. Os anexos não funcionarão.");
        }
    } catch (error) {
        console.error("Falha crítica ao inicializar Firebase:", error);
    }
}

export { db, auth, storage };

export function initializeFirebase() {
  if (typeof window !== "undefined") {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return null;
}
