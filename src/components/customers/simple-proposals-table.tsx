'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Proposal, ProposalStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        const date = parseISO(dateString);
        if (isNaN(date.getTime())) return '-';
        return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
        return '-';
    }
}

export const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: 'proposalNumber',
    header: 'Proposta nº',
  },
  {
    accessorKey: 'product',
    header: 'Produto',
  },
  {
    accessorKey: 'grossAmount',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor Bruto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('grossAmount'));
      return (
        <div className="text-right font-medium">{formatCurrency(amount)}</div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as ProposalStatus;
        return (
            <Badge variant="outline" className={cn({
                'border-green-500 text-green-500': status === 'Pago',
                'border-orange-500 text-orange-500': status === 'Saldo Pago',
                'border-yellow-500 text-yellow-500': status === 'Em Andamento',
                'border-blue-500 text-blue-500': status === 'Aguardando Saldo',
                'border-red-500 text-red-500': status === 'Reprovado',
                'border-purple-500 text-purple-500': status === 'Pendente',
              })}>
                {status}
            </Badge>
        )
    }
  },
  {
    accessorKey: 'dateDigitized',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data Digitação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => formatDate(row.getValue('dateDigitized'))
  },
];


export function SimpleProposalsTable({ proposals }: { proposals: Proposal[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'dateDigitized', desc: true }
  ]);

  const table = useReactTable({
    data: proposals,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma proposta encontrada para este cliente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
