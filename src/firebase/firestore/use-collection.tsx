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

// Controle de concorrência V66
let listenerActive = false;

/**
 * Hook de Coleção Blindado V66.
 * Impede execução no servidor e bloqueia duplicidade de listeners.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!memoizedTargetRefOrQuery);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    const cleanup = () => {
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
            listenerActive = false;
        }
    };

    if (!memoizedTargetRefOrQuery) {
      if (isMounted) {
        setData(null);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    if (listenerActive) {
        cleanup();
    }

    setIsLoading(true);
    setError(null);

    try {
        listenerActive = true;
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
        listenerActive = false;
        if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
