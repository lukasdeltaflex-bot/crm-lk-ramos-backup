'use client';

import { useEffect, useRef } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Monitor silencioso de erros de permissão do Firebase.
 * Registra falhas apenas no console técnico para depuração,
 * mantendo a interface do usuário limpa e sem interrupções.
 */
export function FirebaseErrorListener() {
  const lastErrorRef = useRef<string | null>(null);
  const lastLogTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      const now = Date.now();
      const errorKey = `${error.request.method}:${error.request.path}`;
      
      // Throttling: Evita poluir o console com o mesmo erro repetidamente (10 segundos)
      if (lastErrorRef.current === errorKey && now - lastLogTimeRef.current < 10000) {
        return;
      }

      lastErrorRef.current = errorKey;
      lastLogTimeRef.current = now;
      
      // Log apenas para depuração técnica
      console.warn("LK Ramos Security Access Info:", {
        action: error.request.method,
        resource: error.request.path,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}