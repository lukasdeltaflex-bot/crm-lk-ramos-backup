'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

/**
 * CONFIGURAÇÃO DIRETA (DEBUG MODE)
 * Substitua os valores abaixo pelos dados do seu Console Firebase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

/**
 * Inicializa os serviços do Firebase LK RAMOS.
 */
export function initializeFirebase() {
  // Inicialização única garantida
  const firebaseApp = !getApps().length 
    ? initializeApp(firebaseConfig) 
    : getApp();

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  
  if (typeof window !== 'undefined') {
    // DIAGNÓSTICO TÉCNICO LK RAMOS
    console.log("-----------------------------------------");
    console.log("🚀 LK RAMOS - CONEXÃO FIREBASE (MODO DIRETO)");
    console.log("🆔 PROJECT ID:", firebaseApp.options.projectId);
    console.log("-----------------------------------------");

    setPersistence(auth, browserLocalPersistence).catch(err => {
        console.error("❌ Erro ao configurar persistência:", err);
    });
  }

  return {
    firebaseApp,
    auth,
    firestore,
    storage,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
