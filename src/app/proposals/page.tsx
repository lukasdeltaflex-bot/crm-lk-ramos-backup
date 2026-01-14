
'use client';
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { getProposalsWithCustomerData } from '@/lib/data';
import { ProposalsDataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProposalForm } from './proposal-form';

export default function ProposalsPage() {
  const proposals = getProposalsWithCustomerData();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageHeader title="Propostas" />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle />
              Nova Proposta
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-2xl sm:w-3/4">
            <SheetHeader>
              <SheetTitle>Nova Proposta</SheetTitle>
            </SheetHeader>
            <ProposalForm onSubmit={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <ProposalsDataTable columns={columns} data={proposals} />
    </AppLayout>
  );
}
