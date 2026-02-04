
'use client';
    
import { useState, useEffect, useRef } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Hook de Documento Blindado V66.
 * Proíbe execução no servidor e garante unicidade de listeners (causa raiz do ca9).
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!memoizedDocRef);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const unsubRef = useRef<(() => void) | null>(null);
  const isActiveRef = useRef<boolean>(false);

  useEffect(() => {
    // 1️⃣ PROIBIR Firestore fora do Browser
    if (typeof window === "undefined") return;

    let isMounted = true;

    if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
        isActiveRef.current = false;
    }

    if (!memoizedDocRef) {
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
          memoizedDocRef,
          (snapshot: DocumentSnapshot<DocumentData>) => {
            if (!isMounted) return;
            if (snapshot.exists()) {
              setData({ ...(snapshot.data() as T), id: snapshot.id });
            } else {
              setData(null);
            }
            setError(null);
            setIsLoading(false);
          },
          (err: FirestoreError) => {
            if (!isMounted) return;

            const msg = (err.message || "").toUpperCase();
            if (msg.includes('ASSERTION') || msg.includes('CA9') || msg.includes('B815')) {
                return; 
            }

            if (err.code === 'permission-denied') {
                const contextualError = new FirestorePermissionError({
                  operation: 'get',
                  path: memoizedDocRef.path,
                });
                setError(contextualError);
                errorEmitter.emit('permission-error', contextualError);
            } else {
                setError(err);
            }
            setData(null);
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
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
