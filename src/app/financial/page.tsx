
'use client';
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { FinancialDataTable } from './data-table';
import { getColumns } from './columns';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Proposal, Customer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CommissionForm } from './commission-form';
import { toast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export type ProposalWithCustomer = Proposal & { customer: Customer | undefined };

export default function FinancialPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedProposal, setSelectedProposal] = React.useState<ProposalWithCustomer | undefined>(undefined);

  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'loanProposals'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: proposals, isLoading: proposalsLoading } = useCollection<Proposal>(proposalsQuery);
  const { data: customers, isLoading: customersLoading } = useCollection<Customer>(customersQuery);

  const proposalsWithCustomerData: ProposalWithCustomer[] = React.useMemo(() => {
    if (!proposals || !customers) return [];
    const customersMap = new Map(customers.map(c => [c.id, c]));
    return proposals.map(p => ({
      ...p,
      customer: customersMap.get(p.customerId),
    }));
  }, [proposals, customers]);

  const isLoading = proposalsLoading || customersLoading || isUserLoading;

  const handleEditCommission = (proposal: ProposalWithCustomer) => {
    setSelectedProposal(proposal);
    setIsSheetOpen(true);
  };
  
  const handleFormSubmit = (data: Partial<Proposal>) => {
    if (!firestore || !selectedProposal) return;
  
    const proposalToUpdate: Partial<Proposal> = {
      commissionStatus: data.commissionStatus,
      amountPaid: data.amountPaid,
      commissionPaymentDate: data.commissionPaymentDate ? new Date(data.commissionPaymentDate).toISOString() : undefined,
    };
  
    setDocumentNonBlocking(doc(firestore, 'loanProposals', selectedProposal.id), proposalToUpdate, { merge: true });
    
    toast({
      title: 'Comissão Atualizada!',
      description: `Os dados financeiros da proposta foram atualizados.`,
    });
  
    setIsSheetOpen(false);
  };

  const columns = React.useMemo(() => getColumns({ onEdit: handleEditCommission }), [handleEditCommission]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageHeader title="Controle Financeiro" />
        <Button variant="ghost" size="icon" onClick={() => setIsPrivacyMode(!isPrivacyMode)}>
          {isPrivacyMode ? <EyeOff /> : <Eye />}
          <span className="sr-only">{isPrivacyMode ? 'Mostrar valores' : 'Ocultar valores'}</span>
        </Button>
      </div>

       <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Comissão</SheetTitle>
          </SheetHeader>
          <CommissionForm
            proposal={selectedProposal}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>

      {isLoading ? (
        <div className="rounded-md border p-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
        </div>
      ) : (
        <FinancialDataTable 
            columns={columns} 
            data={proposalsWithCustomerData}
            isPrivacyMode={isPrivacyMode} 
        />
      )}
    </AppLayout>
  );
}
