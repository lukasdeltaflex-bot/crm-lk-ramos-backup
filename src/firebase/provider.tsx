'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { Storage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { auth as authInstance, db, storage as storageInstance } from './firebase';

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: Storage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!authInstance) return;
    
    const unsubscribe = onAuthStateChanged(
      authInstance,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("FirebaseProvider Error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, []);

  const areServicesAvailable = !!authInstance && !!db;

  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable,
    firestore: db,
    auth: authInstance,
    storage: storageInstance,
    user: userAuthState.user,
    isUserLoading: userAuthState.isUserLoading,
    userError: userAuthState.userError,
  }), [userAuthState, areServicesAvailable]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * 🛡️ HOOKS BLINDADOS (Aprovado #3)
 * Removemos o fallback de objetos uninitialized para evitar erros de 'undefined' 
 * durante a fase crítica de avaliação de módulos no Next.js 15.
 */
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    // Retorna null explicitamente para que componentes possam lidar com o estado 'não-pronto'
    return {
        auth: null,
        firestore: null,
        storage: null,
        user: null,
        isUserLoading: true,
        userError: null,
    };
  }
  return {
    auth: context.auth,
    firestore: context.firestore,
    storage: context.storage,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useUser = () => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};

export const useAuth = () => authInstance;
export const useFirestore = () => db;
export const useStorage = () => storageInstance;

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps);
}
