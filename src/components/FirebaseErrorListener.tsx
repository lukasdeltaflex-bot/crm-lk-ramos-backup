'use client';

import { useEffect, useRef } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Componente silencioso que monitora erros de permissão do Firebase.
 * Registra avisos no console sem interromper a interface do usuário.
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
      
      // Log apenas para depuração técnica, sem overlays ou toasts
      console.warn("LK Ramos Security Notice:", {
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