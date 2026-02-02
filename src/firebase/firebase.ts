import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

/**
 * CONFIGURAÇÃO DIRETA FIREBASE - LK RAMOS
 * 
 * ATENÇÃO: Substitua os valores abaixo pelos dados do seu Firebase Console.
 * Sem isso, o sistema não carregará seus dados e parecerá vazio.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDcdnNBy0TZTsq_cI02KFVU9o7PJopEczM", // <--- COLE SUA API KEY REAL AQUI
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Inicialização segura para evitar tela preta em caso de erro na configuração
try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.error("⚠️ Erro na inicialização do Firebase. Verifique suas chaves:", error);
}

// Exportação garantida das instâncias
export { auth, db, storage };

/**
 * Função de inicialização exigida pelo Client Provider e Hooks.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined' && app && app.options.apiKey !== "AIzaSyXXXXXXXXXXXX") {
    console.log("🚀 LK RAMOS - CONEXÃO ATIVA COM:", app.options.projectId);
  }
  
  return {
    firebaseApp: app,
    auth,
    firestore: db,
    storage
  };
}

export default app;