'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { ProposalsDataTable, type ProposalsDataTableHandle } from './data-table';
import { getColumns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, Trash2, CheckCircle2, ChevronDown, FileSpreadsheet, FileText as FilePdf, FileBadge, Printer, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProposalForm } from './proposal-form';
import type { Proposal, Customer, ProposalStatus, UserSettings, ProposalHistoryEntry } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, updateDoc, setDoc, query, where, writeBatch, arrayUnion, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerSearchDialog } from '@/components/proposals/customer-search-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cleanFirestoreData, formatCurrency, cleanBankName, formatDateSafe } from '@/lib/utils';
import { format } from 'date-fns';

export type ProposalWithCustomer = Proposal & { customer: Customer | undefined };
type ProposalFormData = Partial<Omit<Proposal, 'id' | 'ownerId'>>;

/**
 * 🛡️ FIX HIDRATAÇÃO (Aprovado #4)
 * Skeletons não devem envolver o AppLayout, apenas o conteúdo interno.
 */
function ProposalsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                </div>
            </div>
            <div className="rounded-xl border-2 border-zinc-200 p-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProposalsPageContent() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = React.useState(false);
  const [newlySelectedCustomer, setNewlySelectedCustomer] = React.useState<Customer | null>(null);

  const [selectedProposal, setSelectedProposal] = React.useState<ProposalWithCustomer | undefined>(undefined);
  const [sheetMode, setSheetMode] = React.useState<'new' | 'edit' | 'view'>('new');
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [defaultValues, setDefaultValues] = React.useState<ProposalFormData | undefined>(undefined);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formKey, setFormKey] = React.useState('new');
  const tableRef = React.useRef<ProposalsDataTableHandle>(null);
  const [hasOpenedFromParam, setHasOpenedFromParam] = React.useState(false);
  
  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'loanProposals'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const settingsDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'userSettings', user.uid);
  }, [firestore, user]);
  
  const { data: proposals, isLoading: proposalsLoading } = useCollection<Proposal>(proposalsQuery);
  const { data: customers, isLoading: customersLoading } = useCollection<Customer>(customersQuery);
  const { data: userSettings, isLoading: settingsLoading } = useDoc<UserSettings>(settingsDocRef);

  const isLoading = proposalsLoading || customersLoading || isUserLoading || settingsLoading;

  const selectedIds = React.useMemo(() => 
    Object.keys(rowSelection).filter(id => rowSelection[id]),
  [rowSelection]);

  const selectedCount = selectedIds.length;

  const proposalsWithCustomerData: ProposalWithCustomer[] = React.useMemo(() => {
    if (!proposals || !customers) return [];
    const customersMap = new Map(customers.map(c => [c.id, c]));
    return proposals.map(p => ({
      ...p,
      customer: customersMap.get(p.customerId),
    }));
  }, [proposals, customers]);

  const handleNewProposal = React.useCallback(() => {
    setSelectedProposal(undefined);
    setDefaultValues(undefined);
    setSheetMode('new');
    setFormKey(`new-${Date.now()}`);
    setIsDialogOpen(true);
  }, []);

  const handleEditProposal = React.useCallback((proposal: ProposalWithCustomer) => {
    setSelectedProposal(proposal);
    setDefaultValues(undefined);
    setSheetMode('edit');
    setFormKey(`edit-${proposal.id}`);
    setIsDialogOpen(true);
  }, []);

  const handleViewProposal = React.useCallback((proposal: ProposalWithCustomer) => {
    setSelectedProposal(proposal);
    setDefaultValues(undefined);
    setSheetMode('view');
    setFormKey(`view-${proposal.id}`);
    setIsDialogOpen(true);
  }, []);

  const handleCustomerSelect = React.useCallback((customer: Customer) => {
    setNewlySelectedCustomer(customer);
    setIsCustomerSearchOpen(false);
  }, []);

  const handleCustomerSearchSelectionHandled = React.useCallback(() => {
    setNewlySelectedCustomer(null);
  }, []);
  
  const handleDuplicateProposal = React.useCallback((proposal: Proposal) => {
    const { id, proposalNumber, status, history, checklist, commissionStatus, amountPaid, commissionPaymentDate, ...rest } = proposal;
    const duplicatedData: ProposalFormData = {
        ...rest,
        proposalNumber: '',
        status: 'Em Andamento',
        commissionStatus: '',
        amountPaid: 0,
        commissionPaymentDate: undefined,
        dateDigitized: new Date().toISOString(),
        dateApproved: undefined,
        datePaidToClient: undefined,
        debtBalanceArrivalDate: undefined,
        attachments: [],
        history: [],
        checklist: {
            formalization: false,
            documentation: false,
            signature: false,
            approval: false
        }
    };
    setSelectedProposal(undefined);
    setDefaultValues(duplicatedData);
    setSheetMode('new');
    setFormKey(`dup-${proposal.id}-${Date.now()}`);
    setIsDialogOpen(true);
  }, []);

  const handleBulkStatusChange = async (newStatus: ProposalStatus) => {
    if (!firestore || !user || selectedCount === 0) return;
    setIsSaving(true);
    try {
        const batch = writeBatch(firestore);
        const now = new Date().toISOString();
        const userName = user.displayName || user.email || 'Sistema';
        
        selectedIds.forEach(id => {
            const proposal = proposals?.find(p => p.id === id);
            if (!proposal) return;

            const docRef = doc(firestore, 'loanProposals', id);
            const dataToUpdate: any = { 
                status: newStatus, 
                statusUpdatedAt: now 
            };

            if (newStatus === 'Pago') {
                dataToUpdate.dateApproved = now;
                dataToUpdate.datePaidToClient = now;
                if (!proposal.commissionStatus) dataToUpdate.commissionStatus = 'Pendente';
            } else if (newStatus === 'Saldo Pago' && proposal.product === 'Portabilidade') {
                dataToUpdate.debtBalanceArrivalDate = now;
            }

            const historyEntry: ProposalHistoryEntry = {
                id: crypto.randomUUID(),
                date: now,
                message: `⚙️ Status alterado em massa para "${newStatus}"`,
                userName: userName
            };
            dataToUpdate.history = arrayUnion(historyEntry);

            batch.set(docRef, cleanFirestoreData(dataToUpdate), { merge: true });
        });

        await batch.commit();
        toast({ title: 'Status Atualizado em Massa', description: `${selectedCount} propostas alteradas para "${newStatus}".` });
        setRowSelection({});
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: 'loanProposals',
                operation: 'update',
                requestResourceData: { status: newStatus }
            }));
        }
        toast({ variant: 'destructive', title: 'Erro na operação em massa' });
    } finally {
        setIsSaving(false);
    }
  };

  const handleStatusChange = async (proposalId: string, payload: { status: ProposalStatus; rejectionReason?: string; quickNote?: string; product?: string }) => {
    if (!firestore || !user) return;
    
    const proposal = proposals?.find(p => p.id === proposalId);
    if (!proposal) return;

    const { status: newStatus, rejectionReason, quickNote, product: productType } = payload;
    const now = new Date().toISOString();
    const userName = user.displayName || user.email || 'Sistema';
    
    const dataToUpdate: any = { 
        status: newStatus,
        statusUpdatedAt: now
    };

    const isPortability = (productType || proposal.product) === 'Portabilidade';

    if (newStatus === 'Pago') {
        dataToUpdate.dateApproved = now;
        dataToUpdate.datePaidToClient = now;
        if (!proposal.commissionStatus) dataToUpdate.commissionStatus = 'Pendente';
    } else if (newStatus === 'Saldo Pago' && isPortability) {
        dataToUpdate.debtBalanceArrivalDate = now;
    } else if (newStatus === 'Aguardando Saldo' && isPortability) {
        dataToUpdate.statusAwaitingBalanceAt = now;
    }

    dataToUpdate.rejectionReason = newStatus === 'Reprovado' ? (rejectionReason || "") : "";

    const historyMessage = newStatus === 'Reprovado'
        ? `⚙️ Status para "${newStatus}". MOTIVO: ${rejectionReason}${quickNote ? ` | NOTA: ${quickNote}` : ''}`
        : quickNote && quickNote.trim() 
            ? `⚙️ Status para "${newStatus}". Nota: ${quickNote.trim()}`
            : `⚙️ Status alterado para "${newStatus}"`;

    const historyEntry: ProposalHistoryEntry = {
        id: crypto.randomUUID(),
        date: now,
        message: historyMessage,
        userName: userName
    };
    dataToUpdate.history = arrayUnion(historyEntry);
    
    const docRef = doc(firestore, 'loanProposals', proposalId);
    setIsSaving(true);
    try {
        await updateDoc(docRef, cleanFirestoreData(dataToUpdate));
        toast({ title: 'Status Atualizado!' });
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate
            }));
        }
        toast({ variant: 'destructive', title: 'Erro ao atualizar status' });
    } finally {
        setIsSaving(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!firestore || !user) return;
    setIsSaving(true);
    
    const docRef = sheetMode === 'edit' && selectedProposal ? doc(firestore, 'loanProposals', selectedProposal.id) : doc(collection(firestore, 'loanProposals'));
    const finalData = cleanFirestoreData({ ...data, id: docRef.id, ownerId: user.uid });
    
    try {
        await setDoc(docRef, finalData, { merge: true });
        toast({ title: 'Proposta Salva!' });
        setIsDialogOpen(false);
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'write',
                requestResourceData: finalData
            }));
        }
        toast({ variant: 'destructive', title: 'Erro ao salvar proposta' });
    } finally {
        setIsSaving(false);
    }
  };

  const columns = React.useMemo(() => getColumns(
    handleEditProposal, 
    handleViewProposal, 
    async (id: string) => {
        if (!firestore) return;
        try { await deleteDoc(doc(firestore, 'loanProposals', id)); toast({ title: 'Proposta Excluída' }); } catch (error: any) {
            if (error.code === 'permission-denied') {
                errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `loanProposals/${id}`, operation: 'delete' }));
            }
        }
    }, 
    handleStatusChange, 
    handleDuplicateProposal,
    async (proposalId: string, stepId: string, currentValue: boolean) => {
        if (!firestore) return;
        const updatePath = `checklist.${stepId}`;
        try { await updateDoc(doc(firestore, 'loanProposals', proposalId), { [updatePath]: !currentValue }); } catch (e: any) {
            if (e.code === 'permission-denied') {
                errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `loanProposals/${proposalId}`, operation: 'update', requestResourceData: { [updatePath]: !currentValue } }));
            }
        }
    }
  ), [firestore, handleEditProposal, handleViewProposal, handleStatusChange, handleDuplicateProposal]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <PageHeader title="Propostas" />
        <div className="flex items-center gap-3 flex-wrap">
            {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 px-6 rounded-full font-bold border-primary/30 bg-primary/5 text-primary text-xs" disabled={isSaving}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Alterar Status ({selectedCount}) <ChevronDown className="ml-2 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {['Pendente', 'Em Andamento', 'Aguardando Saldo', 'Pago', 'Saldo Pago'].map(s => (
                                <DropdownMenuItem key={s} onSelect={() => handleBulkStatusChange(s as ProposalStatus)}>{s}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <Button onClick={handleNewProposal} className="h-10 px-8 rounded-full font-bold bg-[#00AEEF] hover:bg-[#0096D1] text-white shadow-lg shadow-[#00AEEF]/20 transition-all border-none text-xs"
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Proposta
            </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader><DialogTitle>{sheetMode === 'edit' ? 'Editar' : sheetMode === 'view' ? 'Detalhes' : 'Novo'} Proposta</DialogTitle></DialogHeader>
          <ProposalForm 
            key={formKey}
            proposal={selectedProposal} 
            allProposals={proposals || []}
            customers={customers || []}
            userSettings={userSettings || null}
            isReadOnly={sheetMode === 'view'}
            onSubmit={handleFormSubmit}
            onDuplicate={handleDuplicateProposal}
            defaultValues={defaultValues}
            sheetMode={sheetMode}
            onOpenCustomerSearch={() => setIsCustomerSearchOpen(true)}
            selectedCustomerFromSearch={newlySelectedCustomer}
            onCustomerSearchSelectionHandled={handleCustomerSearchSelectionHandled}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCustomerSearchOpen} onOpenChange={setIsCustomerSearchOpen}>
        <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
            <CustomerSearchDialog
                open={isCustomerSearchOpen}
                onOpenChange={setIsCustomerSearchOpen}
                customers={customers?.filter(c => c.name !== 'Cliente Removido') || []}
                onSelectCustomer={handleCustomerSelect}
            />
        </DialogContent>
      </Dialog>

      <ProposalsDataTable 
        ref={tableRef}
        columns={columns} 
        data={proposalsWithCustomerData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onBulkStatusChange={handleBulkStatusChange} 
        userSettings={userSettings || null}
      />
    </>
  );
}

export default function ProposalsPage() {
    return (
        <AppLayout>
            <Suspense fallback={<ProposalsPageSkeleton />}>
                <ProposalsPageContent />
            </Suspense>
        </AppLayout>
    )
}
