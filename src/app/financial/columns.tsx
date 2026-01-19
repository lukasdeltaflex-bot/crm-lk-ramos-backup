
'use client';

import { ColumnDef, flexRender, Header } from '@tanstack/react-table';
import type { Proposal, Customer, CommissionStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHead } from '@/components/ui/table';
import { CommissionStatusCell } from './commission-status-cell';


type ProposalWithCustomer = Proposal & { customer: Customer };

interface ActionsCellProps {
  row: { original: ProposalWithCustomer };
  onEdit: (proposal: ProposalWithCustomer) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row, onEdit }) => {
  const proposal = row.original;
  return (
    <div className="text-right print:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => onEdit(proposal)}>
            Editar Comissão
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const DraggableHeader = ({ header }: { header: Header<ProposalWithCustomer, unknown>}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: header.column.id,
      });
    
      const style = {
        ...header.column.getCanResize() && {
            width: header.getSize(),
        },
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableHead
            ref={setNodeRef}
            colSpan={header.colSpan}
            style={style}
            className={cn('relative p-0 h-12')}
        >
            <div
                className={cn(
                    'flex items-center gap-1 h-full px-4',
                    header.column.getCanSort() && 'cursor-pointer select-none'
                )}
                onClick={header.column.getToggleSortingHandler()}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-1 -ml-2"
                    onClick={e => e.stopPropagation()}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
            </div>
            {header.column.getCanResize() && (
                <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={cn(
                        'absolute top-2.5 h-7 w-px cursor-col-resize select-none touch-none bg-border',
                        header.column.getIsResizing() && 'bg-primary w-0.5'
                    )}
                />
            )}
        </TableHead>
    )
}

export const getColumns = (
  { onEdit, onStatusUpdate }: { 
    onEdit: (proposal: ProposalWithCustomer) => void;
    onStatusUpdate: (proposal: ProposalWithCustomer, newStatus: CommissionStatus) => void;
  }
): ColumnDef<ProposalWithCustomer>[] => [
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
        className="print:hidden"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="print:hidden"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnOrdering: false,
  },
  {
    accessorKey: 'promoter',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Promotora</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'promotora'
  },
  {
    accessorKey: 'customer.name',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Cliente</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'customerName',
  },
  {
    accessorKey: 'customer.cpf',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>CPF</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'customerCpf',
    cell: ({row}) => row.original.customer.cpf,
  },
  {
    accessorKey: 'proposalNumber',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Nº Proposta</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'proposalNumber',
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Produto</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'produto'
  },
  {
    accessorKey: 'bank',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Banco</span>
        {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      </div>
    ),
    id: 'banco'
  },
  {
    accessorKey: 'grossAmount',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center justify-end gap-2 print:p-0 print:font-bold print:text-black"
        >
          <span>Valor Bruto</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4 print:hidden" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4 print:hidden" /> : <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />}
        </div>
      );
    },
    cell: ({ row, table }) => {
      const isPrivacyMode = (table.options.meta as {isPrivacyMode?: boolean})?.isPrivacyMode;
      if (isPrivacyMode) return <div className="text-left font-medium">•••••</div>;
      const amount = parseFloat(row.getValue('grossAmount'));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
    id: 'grossAmount',
  },
  {
    accessorKey: 'commissionPercentage',
    header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>Comissão (%)</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </div>
      ),
    cell: ({ row, table }) => {
      const isPrivacyMode = (table.options.meta as {isPrivacyMode?: boolean})?.isPrivacyMode;
      if (isPrivacyMode) return '•••••';
      const percentage = parseFloat(row.getValue('commissionPercentage'));
      return `${percentage.toFixed(2)}%`;
    },
    id: 'commissionPercentage'
  },
  {
    accessorKey: 'commissionValue',
    header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>Valor Comissão</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </div>
      ),
    cell: ({ row, table }) => {
        const isPrivacyMode = (table.options.meta as {isPrivacyMode?: boolean})?.isPrivacyMode;
        if (isPrivacyMode) return '•••••';
        const amount = parseFloat(row.getValue('commissionValue'));
        return formatCurrency(amount);
      },
    id: 'commissionValue',
  },
  {
    accessorKey: 'amountPaid',
    header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>Valor Pago</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </div>
      ),
    cell: ({ row, table }) => {
      const isPrivacyMode = (table.options.meta as {isPrivacyMode?: boolean})?.isPrivacyMode;
      if (isPrivacyMode) return '•••••';
      const amount = parseFloat(row.getValue('amountPaid') || '0');
      return formatCurrency(amount);
    },
    id: 'amountPaid',
  },
  {
    accessorKey: 'commissionStatus',
    header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>Status Comissão</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </div>
      ),
    cell: ({ row }) => {
      const proposal = row.original;
      return (
        <CommissionStatusCell 
            proposal={proposal} 
            onStatusUpdate={onStatusUpdate} 
            onEdit={onEdit} 
        />
      );
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
    id: 'commissionStatus',
  },
  {
    accessorKey: 'commissionPaymentDate',
    header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>Data Pagamento</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
        </div>
      ),
    cell: ({ row }) => {
        const date = row.getValue('commissionPaymentDate') as string | undefined;
        if (!date) return '-';
        return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    },
    id: 'commissionPaymentDate',
  },
  {
    id: 'actions',
    cell: (props) => <ActionsCell {...props} onEdit={onEdit} />,
    enableHiding: false,
    enableColumnOrdering: false,
  },
].map(column => ({ ...column, id: column.id || column.accessorKey as string}));
