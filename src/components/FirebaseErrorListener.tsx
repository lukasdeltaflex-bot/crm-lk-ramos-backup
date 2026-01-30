'use client';

import { useEffect, useRef } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * Componente que escuta erros de permissão do Firebase e os exibe de forma
 * controlada usando Toasts. Inclui deduplicação severa para evitar flood.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();
  const lastErrorRef = useRef<string | null>(null);
  const lastToastTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      const now = Date.now();
      const errorKey = `${error.request.method}:${error.request.path}`;
      
      // Log detalhado apenas para o console do desenvolvedor
      console.warn("Firestore Permission Insight:", {
        method: error.request.method,
        path: error.request.path,
        uid: error.request.auth?.uid
      });

      // Silencia notificações repetitivas por 15 segundos
      if (lastErrorRef.current === errorKey && now - lastToastTimeRef.current < 15000) {
        return;
      }

      lastErrorRef.current = errorKey;
      lastToastTimeRef.current = now;
      
      toast({
        variant: 'destructive',
        title: 'Sincronização em andamento',
        description: 'Alguns registros pertencentes a outros usuários ou antigos podem estar ocultos por segurança.',
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}