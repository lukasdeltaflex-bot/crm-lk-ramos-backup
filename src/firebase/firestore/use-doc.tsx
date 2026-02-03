'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Blindagem V7: Tratamento ultra-seguro para evitar erros de conexão.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!memoizedDocRef);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    let unsubscribe: Unsubscribe | null = null;

    try {
        unsubscribe = onSnapshot(
          memoizedDocRef,
          (snapshot: DocumentSnapshot<DocumentData>) => {
            if (snapshot.exists()) {
              setData({ ...(snapshot.data() as T), id: snapshot.id });
            } else {
              setData(null);
            }
            setError(null);
            setIsLoading(false);
          },
          (error: FirestoreError) => {
            console.error("Firestore useDoc error:", error);
            const contextualError = new FirestorePermissionError({
              operation: 'get',
              path: memoizedDocRef.path,
            })

            setError(contextualError)
            setData(null)
            setIsLoading(false)
            errorEmitter.emit('permission-error', contextualError);
          }
        );
    } catch (e: any) {
        console.warn("Snapshot setup failed:", e);
        setIsLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
            // Desinscrição segura para evitar erro b815
            unsubscribe();
        } catch (e) {
            console.debug("Safe unsubscribe fail (expected in HMR)");
        }
      }
    };
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
