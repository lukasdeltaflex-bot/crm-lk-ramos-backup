'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown } from 'lucide-react';
import type { CommissionStatus, Proposal, Customer } from '@/lib/types';
import { cn } from '@/lib/utils';

type ProposalWithCustomer = Proposal & { customer?: Customer };

interface CommissionStatusCellProps {
  proposal: ProposalWithCustomer;
  onStatusUpdate: (proposal: ProposalWithCustomer, newStatus: CommissionStatus) => void;
  onEdit: (proposal: ProposalWithCustomer) => void;
}

export function CommissionStatusCell({ proposal, onStatusUpdate, onEdit }: CommissionStatusCellProps) {
    const { commissionStatus } = proposal;

    const getStatusClass = (status?: CommissionStatus) => {
        if (!status) return 'border-dashed border-muted-foreground/20 text-transparent group-hover:text-muted-foreground/40 bg-transparent';
        return cn('print:border-gray-400 print:text-black', {
            'border-green-500 text-green-500 bg-green-50/50': status === 'Paga',
            'border-yellow-500 text-yellow-500 bg-yellow-50/50': status === 'Pendente',
            'border-orange-500 text-orange-500 bg-orange-50/50': status === 'Parcial',
        });
    };
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group w-full justify-start p-0 h-auto font-normal hover:bg-transparent">
                    <Badge variant="outline" className={cn("min-w-[80px] h-6 justify-center transition-all", getStatusClass(commissionStatus))}>
                        {commissionStatus || 'Definir'}
                    </Badge>
                    <ChevronsUpDown className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-40 transition-opacity print:hidden" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusUpdate(proposal, 'Paga')}>
                    Paga
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(proposal)}>
                    Parcial...
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(proposal, 'Pendente')}>
                    Pendente
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
