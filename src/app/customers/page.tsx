
'use client';
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { customers } from '@/lib/data';
import { CustomerDataTable } from './data-table';
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
import { CustomerForm } from './customer-form';

export default function CustomersPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageHeader title="Clientes" />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle />
              Novo Cliente
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-lg sm:w-3/4">
            <SheetHeader>
              <SheetTitle>Novo Cliente</SheetTitle>
            </SheetHeader>
            <CustomerForm onSubmit={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <CustomerDataTable columns={columns} data={customers} />
    </AppLayout>
  );
}
