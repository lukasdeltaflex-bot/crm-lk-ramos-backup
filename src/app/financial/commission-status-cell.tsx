'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, Lock } from 'lucide-react';
import type { CommissionStatus, Proposal, Customer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

type ProposalWithCustomer = Proposal & { customer?: Customer };

interface CommissionStatusCellProps {
  proposal: ProposalWithCustomer;
  onStatusUpdate: (proposal: ProposalWithCustomer, newStatus: CommissionStatus) => void;
  onEdit: (proposal: ProposalWithCustomer) => void;
}

export function CommissionStatusCell({ proposal, onStatusUpdate, onEdit }: CommissionStatusCellProps) {
    const { statusColors } = useTheme();
    const { commissionStatus, status, dateApproved } = proposal;

    // 🔓 AUTONOMIA TOTAL: Removida a trava de averbação.
    // O usuário agora tem liberdade para definir a comissão em qualquer fase.
    const isReprovado = status === 'Reprovado';
    const canInteract = !isReprovado;

    // 🎯 LÓGICA DE PADRÃO REFINADA (CONFORME SOLICITADO): 
    // "Pendente" só deve aparecer visualmente se houver data de averbação preenchida.
    // Se não tiver data de averbação, tratamos o "Pendente" como nulo (exibindo "Definir").
    // Status manuais e definitivos como "Paga" ou "Parcial" são mantidos sempre, independente da data.
    const effectiveStatus = (commissionStatus === 'Paga' || commissionStatus === 'Parcial')
        ? commissionStatus
        : (dateApproved ? 'Pendente' : null);
    
    const colorValue = effectiveStatus ? (statusColors[effectiveStatus.toUpperCase()] || statusColors[effectiveStatus]) : undefined;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!canInteract}>
                <Button 
                    variant="ghost" 
                    className={cn(
                        "group w-full justify-start p-0 h-auto font-normal hover:bg-transparent",
                        !canInteract && "opacity-40 cursor-not-allowed"
                    )}
                >
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "min-w-[80px] h-6 justify-center transition-all text-[10px] font-black uppercase tracking-tighter border-2 rounded-full", 
                            !effectiveStatus ? 'border-dashed border-muted-foreground/40 text-muted-foreground/60 bg-transparent' : 'status-custom'
                        )}
                        style={colorValue ? { '--status-color': colorValue } as any : {}}
                    >
                        {effectiveStatus || 'Definir'}
                    </Badge>
                    {canInteract && (
                        <ChevronsUpDown className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-40 transition-opacity print:hidden" />
                    )}
                    {!canInteract && (
                        <Lock className="h-2.5 w-2.5 ml-1 text-muted-foreground/30" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl border-2 shadow-xl" align="start">
                <DropdownMenuItem className="font-bold text-xs uppercase" onClick={() => onStatusUpdate(proposal, 'Paga')}>
                    Marcar como Paga
                </DropdownMenuItem>
                <DropdownMenuItem className="font-bold text-xs uppercase" onClick={() => onEdit(proposal)}>
                    Lançar Parcial...
                </DropdownMenuItem>
                <DropdownMenuItem className="font-bold text-xs uppercase text-blue-600 focus:text-blue-600" onClick={() => onStatusUpdate(proposal, 'Pendente')}>
                    Marcar como Pendente
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
