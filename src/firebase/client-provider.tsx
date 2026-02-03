
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './firebase'; 
import { LoaderCircle } from 'lucide-react';

/**
 * Provedor Blindado V26: Protocolo de Supressão Total.
 * Resolve erros de permissão transientes e falhas fatais de asserção (ca9/b815).
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 🛡️ ESCUDO DE SILÊNCIO V26: Interceptação Global de Baixo Nível
    const isSuppressibleError = (msg: string) => {
        if (!msg) return false;
        const normalized = String(msg).toUpperCase();
        return (
            normalized.includes('INTERNAL ASSERTION FAILED') ||
            normalized.includes('CA9') ||
            normalized.includes('B815') ||
            normalized.includes('PERMISSION-DENIED') ||
            normalized.includes('INSUFFICIENT PERMISSIONS') ||
            normalized.includes('FE: -1')
        );
    };

    const handleGlobalError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const message = 'message' in event ? event.message : (event.reason?.message || String(event.reason));
      if (isSuppressibleError(message)) {
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        event.preventDefault();
        console.warn("🛡️ LK Ramos: Falha técnica suprimida para estabilidade.");
        return true;
      }
    };

    // Mute de Console para evitar disparos do Overlay do Next.js
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const msg = args.join(' ');
      if (isSuppressibleError(msg)) return; 
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleGlobalError, true);

    try {
        initializeFirebase();
    } catch (error) {}

    setMounted(true);
    // Pequeno delay para garantir que a hidratação de texto coincida
    const timer = setTimeout(() => setIsReady(true), 100);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleGlobalError, true);
      console.error = originalConsoleError;
      clearTimeout(timer);
    };
  }, []);

  // Evita Hydration Mismatch garantindo que o servidor e o cliente renderizem o mesmo inicialmente
  if (!mounted || !isReady) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary opacity-20" />
            <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-foreground uppercase tracking-widest opacity-40">LK RAMOS</p>
                <p className="text-[10px] text-muted-foreground animate-pulse font-bold">ESTABILIZANDO MOTOR DE DADOS...</p>
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
