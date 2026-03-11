
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Proposal } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    console.log("Creating proposals query for user:", user.uid);
    return query(collection(firestore, 'loanProposals'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: proposals, isLoading: proposalsLoading } = useCollection<Proposal>(proposalsQuery);
  
  useEffect(() => {
    console.log("Proposals loading:", proposalsLoading);
    if (proposals) {
      console.log("Proposals data length:", proposals.length);
    }
  }, [proposals, proposalsLoading]);
  
  return (
    <AppLayout>
      <h1>Isolating the issue...</h1>
      <p>Checking data hooks...</p>
      {proposalsLoading && <p>Proposals are loading...</p>}
      {proposals && <p>Loaded {proposals.length} proposals.</p>}
    </AppLayout>
  );
}
