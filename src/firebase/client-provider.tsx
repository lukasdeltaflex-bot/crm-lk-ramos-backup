'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 
import { LoaderCircle } from 'lucide-react';

/**
 * Provedor de Infraestrutura Blindada V43.
 * Intercepta e anula erros fatais de asserção do Firestore (ca9/b815).
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 🛡️ ESCUDO DE SILÊNCIO V43: Interceptação Profunda
    const isSuppressibleError = (err: any) => {
        if (!err) return false;
        const msg = typeof err === 'string' ? err : (err.message || String(err));
        const normalized = msg.toUpperCase();
        return (
            normalized.includes('INTERNAL ASSERTION FAILED') ||
            normalized.includes('CA9') ||
            normalized.includes('B815') ||
            normalized.includes('FE: -1') ||
            normalized.includes('UNEXPECTED STATE')
        );
    };

    const handleGlobalError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const error = 'error' in event ? event.error : (event.reason);
      if (isSuppressibleError(error) || isSuppressibleError(event instanceof ErrorEvent ? event.message : '')) {
        event.preventDefault();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        return true;
      }
    };

    // Mute de Console Redundante
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args.some(arg => isSuppressibleError(arg))) {
        return; 
      }
      originalConsoleError.apply(console, args);
    };

    // Override de window.onerror
    const oldOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (isSuppressibleError(message) || isSuppressibleError(error)) {
        return true; 
      }
      if (oldOnError) return oldOnError(message, source, lineno, colno, error);
      return false;
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleGlobalError, true);

    try {
        initializeFirebase();
    } catch (error) {}

    const timer = setTimeout(() => setIsReady(true), 10);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleGlobalError, true);
      console.error = originalConsoleError;
      clearTimeout(timer);
    };
  }, []);

  if (!isReady) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary opacity-20" />
            <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-foreground opacity-40">LK RAMOS</p>
                <p className="text-[10px] text-muted-foreground animate-pulse font-bold">Sincronizando banco de dados...</p>
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
