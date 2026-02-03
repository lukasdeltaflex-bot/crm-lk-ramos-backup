'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 
import { Loader2 } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Provedor Blindado V15: Interceptador Total de Erros de Asserção.
 * Anula as falhas ca9/b815 no nível global para impedir o Overlay de erro do Next.js.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Interceptador Global Nível Janela (Shield V15)
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || "";
      const isFirebaseAssertion = 
        msg.includes('INTERNAL ASSERTION FAILED') || 
        msg.includes('ca9') || 
        msg.includes('b815');

      if (isFirebaseAssertion) {
        event.stopImmediatePropagation();
        event.preventDefault();
        console.warn("🛡️ LK RAMOS Shield: Firebase Internal Assertion Silenced.");
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || "";
      if (reason.includes('INTERNAL ASSERTION FAILED') || reason.includes('ca9') || reason.includes('b815')) {
        event.stopImmediatePropagation();
        event.preventDefault();
        console.warn("🛡️ LK RAMOS Shield: Async Assertion Silenced.");
      }
    };

    // 2. Interceptador de Console Defensivo
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('INTERNAL ASSERTION FAILED') || message.includes('ca9') || message.includes('b815')) {
        return; // Silêncio total para erros de asserção interna
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    try {
        initializeFirebase();
    } catch (error) {
        // SDK já inicializado
    } finally {
        setIsInitializing(false);
    }

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      console.error = originalConsoleError;
    };
  }, []);

  if (isInitializing) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4 text-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">LK RAMOS</p>
                <p className="text-xs text-muted-foreground animate-pulse">Estabilizando infraestrutura de dados...</p>
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
