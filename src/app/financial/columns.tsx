'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Proposal, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

type ProposalWithCustomer = Proposal & { customer: Customer };

export const columns: ColumnDef<ProposalWithCustomer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customer.name',
    header: 'Cliente',
  },
  {
    accessorKey: 'promoter',
    header: 'Promotora',
  },
  {
    accessorKey: 'bank',
    header: 'Banco',
  },
  {
    accessorKey: 'grossAmount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor Bruto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('grossAmount'));
      return <div className="text-left font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'commissionPercentage',
    header: 'Comissão (%)',
    cell: ({ row }) => {
      const percentage = parseFloat(row.getValue('commissionPercentage'));
      return `${percentage.toFixed(2)}%`;
    }
  },
  {
    accessorKey: 'commissionValue',
    header: 'Valor Comissão',
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue('commissionValue'));
        return formatCurrency(amount);
      },
  },
  {
    accessorKey: 'commissionPaid',
    header: 'Status Comissão',
    cell: ({ row }) => {
      const isPaid = row.getValue('commissionPaid');
      return (
        <Badge
          variant="outline"
          className={cn({
            'border-green-500 text-green-500': isPaid,
            'border-yellow-500 text-yellow-500': !isPaid,
          })}
        >
          {isPaid ? 'Paga' : 'Pendente'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'commissionPaymentDate',
    header: 'Data Pagamento',
    cell: ({ row }) => {
        const date = row.getValue('commissionPaymentDate') as string | undefined;
        if (!date) return '-';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }
  },
];
