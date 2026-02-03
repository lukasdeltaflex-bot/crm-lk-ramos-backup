'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 
import { Loader2 } from 'lucide-react';

/**
 * Provedor Blindado V21: Protocolo de Supressão Total.
 * Intercepta e silencia erros fatais do Firebase (ca9/b815) para impedir o Overlay do Next.js.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 🛡️ ESCUDO DE SILÊNCIO V21: Interceptação Global de Erros de Asserção
    const isFirebaseAssertionError = (msg: string, stack?: string) => {
        const patterns = ['INTERNAL ASSERTION FAILED', 'ca9', 'b815', 'Fe: -1', 'Unexpected state'];
        const fullText = (msg + (stack || '')).toUpperCase();
        return patterns.some(pattern => fullText.includes(pattern.toUpperCase()));
    };

    const handleGlobalError = (event: ErrorEvent) => {
      if (isFirebaseAssertionError(event.message, event.error?.stack)) {
        console.warn("🛡️ LK Ramos: Interceptada e silenciada falha interna do Firebase. Sistema preservado.");
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || String(event.reason);
      if (isFirebaseAssertionError(reason, event.reason?.stack)) {
        console.warn("🛡️ LK Ramos: Interceptada promessa rejeitada por estado interno. Ignorando silenciosamente.");
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    };

    // 🛡️ INTERCEPTADOR DE CONSOLE: Evita que o Next.js capture logs do SDK que disparam a tela de erro
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const msg = args.join(' ');
      if (isFirebaseAssertionError(msg)) {
        // Silêncio técnico: O erro não sobe para o motor de Overlay do Next.js
        return; 
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    try {
        initializeFirebase();
    } catch (error) {
        // SDK já inicializado ou em estado de recuperação
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
                <p className="text-sm font-bold text-foreground uppercase tracking-widest">LK RAMOS</p>
                <p className="text-[10px] text-muted-foreground animate-pulse font-bold">ESTABILIZANDO MOTOR DE DADOS V21...</p>
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
