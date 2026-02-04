'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 

/**
 * Provedor de Infraestrutura V66.
 * Focado na inicialização correta no lado do cliente.
 * Removido escudos de supressão para focar na correção estrutural.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
        initializeFirebase();
    } catch (error) {
        console.error("Erro na inicialização do Firebase:", error);
    }

    const timer = setTimeout(() => {
        setIsReady(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-20" />
            <div className="text-center">
                <p className="text-sm font-bold opacity-40 uppercase tracking-widest">LK RAMOS</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold opacity-30 mt-1">Conectando ao núcleo de dados...</p>
            </div>
        </div>
    );
  }

  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}

interface FirebaseClientProviderProps {
  children: ReactNode;
}
