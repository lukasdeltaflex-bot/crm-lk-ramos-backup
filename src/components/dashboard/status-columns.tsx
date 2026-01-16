
'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Proposal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

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
      const date = new Date(row.getValue('dateDigitized'));
      // Adjust for timezone to show the correct date
      const adjustedDate = new Date(
        date.valueOf() + date.getTimezoneOffset() * 60 * 1000
      );
      return new Intl.DateTimeFormat('pt-BR').format(adjustedDate);
    },
  },
   {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="outline"
          className={cn('w-24 justify-center', {
            'border-green-500 text-green-500': status === 'Pago',
            'border-orange-500 text-orange-500': status === 'Saldo Pago',
            'border-yellow-500 text-yellow-500': status === 'Em Andamento',
            'border-blue-500 text-blue-500': status === 'Aguardando Saldo',
            'border-red-500 text-red-500': status === 'Reprovado',
            'border-purple-500 text-purple-500': status === 'Pendente',
          })}
        >
          {status}
        </Badge>
      );
    },
  },
];
