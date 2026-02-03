'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
  Unsubscribe,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Blindagem V8: Tratamento ultra-seguro contra erros de asserção interna.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!memoizedTargetRefOrQuery);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
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
          memoizedTargetRefOrQuery,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const results: ResultItemType[] = [];
            snapshot.forEach((doc) => {
              results.push({ ...(doc.data() as T), id: doc.id });
            });
            setData(results);
            setError(null);
            setIsLoading(false);
          },
          (err: FirestoreError) => {
            // Se o Firestore falhar com erro ca9 ou similar, capturamos aqui sem crashar a UI
            console.warn("Firestore listener warning:", err.message);
            if (err.code === 'permission-denied') {
                const path: string =
                  memoizedTargetRefOrQuery.type === 'collection'
                    ? (memoizedTargetRefOrQuery as CollectionReference).path
                    : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString();

                const contextualError = new FirestorePermissionError({
                    operation: 'list',
                    path,
                });
                setError(contextualError);
                errorEmitter.emit('permission-error', contextualError);
            } else {
                setError(err);
            }
            setIsLoading(false);
          }
        );
    } catch (e: any) {
        console.warn("Firestore snapshot setup blocked to prevent crash:", e);
        setIsLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
            // Desinscrição ultra-segura para evitar erro b815 no HMR
            unsubscribe();
        } catch (e) {
            // Ignora erros de encerramento já que o Firebase pode já estar em estado 'terminated'
        }
      }
    };
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
