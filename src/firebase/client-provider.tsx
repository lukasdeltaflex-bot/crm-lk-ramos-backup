'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 
import { Loader2 } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Provedor que garante a inicialização do Firebase e suprime erros de asserção interna.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // BLINDAGEM V12: Interceptador Global de Erros de Asserção
    // Impede que falhas internas do SDK (ca9/b815) travem a UI do Next.js
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message?.includes('INTERNAL ASSERTION FAILED')) {
        event.preventDefault();
        console.warn("LK RAMOS: Asserção interna do Firebase suprimida para evitar crash da UI.", event.message);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('INTERNAL ASSERTION FAILED')) {
        event.preventDefault();
        console.warn("LK RAMOS: Rejeição de asserção interna suprimida.", event.reason.message);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    try {
        initializeFirebase();
    } catch (error) {
        console.error("❌ Falha na inicialização do Firebase:", error);
    } finally {
        setIsInitializing(false);
    }

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (isInitializing) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">LK RAMOS: Carregando segurança...</p>
        </div>
    );
  }

  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}
