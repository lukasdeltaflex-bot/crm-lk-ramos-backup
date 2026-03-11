'use client';

/**
 * Hub central de exportações do Firebase LK RAMOS.
 * 🛡️ FIX SEGURANÇA: Exportações ordenadas para evitar 'Circular Dependency' e erros de module evaluation.
 */

export * from './firebase';
export { db as firestore } from './firebase'; 
export { 
    FirebaseProvider, 
    useFirebase, 
    useUser, 
    useAuth, 
    useFirestore, 
    useStorage, 
    useMemoFirebase 
} from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { FirestorePermissionError } from './errors';
export { errorEmitter } from './error-emitter';
