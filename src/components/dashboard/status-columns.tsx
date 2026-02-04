'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Proposal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusCell } from '@/app/proposals/status-cell';

type ProposalWithCustomer = Proposal & { customer: { name: string } };

export const statusColumns: ColumnDef<ProposalWithCustomer>[] = [
  {
    accessorKey: 'proposalNumber',
    header: 'Proposta nº',
  },
  {
    accessorKey: 'customer.name',
    header: 'Cliente',
  },
  {
    accessorKey: 'product',
    header: 'Produto',
  },
  {
    accessorKey: 'grossAmount',
    header: () => <div className="text-right">Valor Bruto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('grossAmount'));
      return (
        <div className="text-right font-medium">{formatCurrency(amount)}</div>
      );
    },
  },
  {
    accessorKey: 'dateDigitized',
    header: 'Data Digitação',
    cell: ({ row }) => {
      const dateStr = row.getValue('dateDigitized') as string;
      if (!dateStr) return '-';
      
      const date = new Date(dateStr);
      if (!isValid(date)) return '-';

      // Ajuste de fuso horário para exibição correta
      const adjustedDate = new Date(
        date.valueOf() + date.getTimezoneOffset() * 60 * 1000
      );
      
      return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
    },
  },
   {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const proposal = row.original;
      return (
        <div className="w-28">
            <StatusCell
                proposalId={proposal.id}
                currentStatus={proposal.status}
            />
        </div>
      );
    },
  },
];
