'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  const sdks = getSdks(firebaseApp);
  
  // 🔥 OBRIGATÓRIO: Garante que o login não se perca ao recarregar ou salvar
  setPersistence(sdks.auth, browserLocalPersistence).catch(console.error);
  
  // Diagnóstico de conexão para o usuário
  if (typeof window !== 'undefined') {
    console.log("🔥 LK Ramos - Conectado ao Projeto:", firebaseApp.options.projectId);
  }

  return sdks;
}

export function getSdks(firebaseApp: FirebaseApp) {
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestore,
    storage: storage,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';