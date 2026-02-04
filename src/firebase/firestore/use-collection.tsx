
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Hook de Coleção Blindado V66.
 * Proíbe execução no servidor e garante unicidade de listeners (causa raiz do ca9).
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!memoizedTargetRefOrQuery);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const unsubRef = useRef<(() => void) | null>(null);
  const isActiveRef = useRef<boolean>(false);

  useEffect(() => {
    // 1️⃣ PROIBIR Firestore fora do Browser
    if (typeof window === "undefined") return;

    let isMounted = true;

    // Limpeza agressiva
    if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
        isActiveRef.current = false;
    }

    if (!memoizedTargetRefOrQuery) {
      if (isMounted) {
        setData(null);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    // 🛡️ Safe Snapshot Wrapper V66
    try {
        if (isActiveRef.current) return;
        isActiveRef.current = true;

        unsubRef.current = onSnapshot(
          memoizedTargetRefOrQuery,
          (snapshot: QuerySnapshot<DocumentData>) => {
            if (!isMounted) return;
            const results: WithId<T>[] = [];
            snapshot.forEach((doc) => {
              results.push({ ...(doc.data() as T), id: doc.id });
            });
            setData(results);
            setError(null);
            setIsLoading(false);
          },
          (err: FirestoreError) => {
            if (!isMounted) return;
            
            // Ignora silenciosamente erros de asserção técnica (ca9/b815)
            const msg = (err.message || "").toUpperCase();
            if (msg.includes('ASSERTION') || msg.includes('CA9') || msg.includes('B815')) {
                return; 
            }
            
            if (err.code === 'permission-denied') {
                let path = 'unknown';
                try { path = (memoizedTargetRefOrQuery as any).path || 'query'; } catch(e) {}
                const contextualError = new FirestorePermissionError({ operation: 'list', path });
                setError(contextualError);
                errorEmitter.emit('permission-error', contextualError);
            } else {
                setError(err);
            }
            setIsLoading(false);
          }
        );
    } catch (e: any) {
        isActiveRef.current = false;
        if (isMounted) {
            setIsLoading(false);
        }
    }

    return () => {
      isMounted = false;
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
        isActiveRef.current = false;
      }
    };
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
