import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

/**
 * CONFIGURAÇÃO DIRETA FIREBASE - LK RAMOS
 * 
 * ATENÇÃO: Substitua os valores abaixo pelos dados do seu Firebase Console.
 * Se o sistema estiver vazio, é porque você precisa colar suas chaves reais aqui.
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

try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.error("⚠️ Erro na inicialização do Firebase:", error);
}

export { auth, db, storage };

export function initializeFirebase() {
  if (typeof window !== 'undefined' && app && app.options.apiKey !== "AIzaSyDcdnNBy0TZTsq_cI02KFVU9o7PJopEczM") {
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
