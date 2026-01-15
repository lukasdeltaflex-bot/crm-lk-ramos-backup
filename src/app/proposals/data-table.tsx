'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { proposalStatuses } from '@/lib/config-data';
import type { ProposalStatus } from '@/lib/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  onBulkStatusChange: (newStatus: ProposalStatus) => void;
}

export function ProposalsDataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  onBulkStatusChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      dateApproved: false,
      datePaidToClient: false,
      debtBalanceArrivalDate: false,
      operator: false,
      commissionValue: false,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  
  const statusFilter = (table.getColumn('status')?.getFilterValue() as string[])?.[0] ?? 'Todos';
  const selectedRowCount = Object.keys(rowSelection).length;

  const setStatusFilter = (value: string) => {
    const newValue = value === 'Todos' ? undefined : [value];
    table.getColumn('status')?.setFilterValue(newValue);
  };
  

  return (
    <Card>
      <div className="p-4">
        <Tabs 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
            <TabsList className="h-auto flex-wrap justify-start">
                <TabsTrigger value="Todos">Todos</TabsTrigger>
                {proposalStatuses.map(status => (
                    <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filtrar por cliente..."
              value={(table.getColumn('customerName')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('customerName')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
             {selectedRowCount > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Alterar status ({selectedRowCount})
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Escolha o novo status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {proposalStatuses.map(status => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => onBulkStatusChange(status as ProposalStatus)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const idMap: {[key: string]: string} = {
                    proposalNumber: 'Proposta nº',
                    customerName: 'Cliente',
                    grossAmount: 'Valor Bruto',
                    commissionValue: 'Comissão',
                    dateDigitized: 'Data Digitação',
                    dateApproved: 'Data Averbação',
                    datePaidToClient: 'Data Pgto. Cliente',
                    debtBalanceArrivalDate: 'Chegada Saldo',
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {idMap[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
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
    </Card>
  );
}
