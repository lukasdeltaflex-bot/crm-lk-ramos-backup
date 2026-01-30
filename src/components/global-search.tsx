'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, FileText, Loader2 } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Customer, Proposal } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  // Queries para buscar os dados do usuário
  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'loanProposals'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: customers, isLoading: loadingCustomers } = useCollection<Customer>(customersQuery);
  const { data: proposals, isLoading: loadingProposals } = useCollection<Proposal>(proposalsQuery);

  // Efeito para o atalho de teclado (Cmd+K ou Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Filtragem de clientes anonimizados
  const validCustomers = React.useMemo(() => {
    return customers?.filter(c => c.name !== 'Cliente Removido') || [];
  }, [customers]);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Pesquisar...</span>
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite o nome, CPF ou número da proposta..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {(loadingCustomers || loadingProposals) && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando dados...
            </div>
          )}

          <CommandGroup heading="Clientes">
            {validCustomers.map((customer) => (
              <CommandItem
                key={customer.id}
                value={`${customer.name} ${customer.cpf}`}
                onSelect={() => {
                  runCommand(() => router.push(`/customers/${customer.id}`));
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{customer.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{customer.cpf}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Propostas">
            {proposals?.map((proposal) => (
              <CommandItem
                key={proposal.id}
                value={`${proposal.proposalNumber} ${proposal.product}`}
                onSelect={() => {
                  runCommand(() => router.push(`/proposals?open=${proposal.id}`));
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Prop. {proposal.proposalNumber}</span>
                <span className="ml-2 text-xs text-muted-foreground">({proposal.product})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
