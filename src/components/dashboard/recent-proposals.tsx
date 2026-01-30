
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency, cn, calculateBusinessDays } from '@/lib/utils';
import type { Proposal, Customer } from '@/lib/types';
import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RecentProposalsProps {
    proposals: Proposal[];
    customers: Customer[];
    isLoading: boolean;
}

export function RecentProposals({ proposals, customers, isLoading }: RecentProposalsProps) {
  const recentProposals = useMemo(() => {
    const customerMap = new Map(customers.map(c => [c.id, c]));
    return proposals
        .sort((a, b) => new Date(b.dateDigitized).getTime() - new Date(a.dateDigitized).getTime())
        .slice(0, 5)
        .map(p => ({...p, customer: customerMap.get(p.customerId)}))
  }, [proposals, customers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Propostas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor Bruto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : recentProposals.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Nenhuma proposta recente.</TableCell>
                </TableRow>
            ) : (
                recentProposals.map((proposal) => {
                    const isPortAwaitingBalance = proposal.product === 'Portabilidade' && proposal.status === 'Aguardando Saldo';
                    const businessDays = proposal.dateDigitized ? calculateBusinessDays(new Date(proposal.dateDigitized)) : 0;

                    return (
                        <TableRow key={proposal.id}>
                            <TableCell>
                            <div className="font-medium">{proposal.customer?.name || 'Cliente não encontrado'}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {proposal.customer?.email}
                            </div>
                            </TableCell>
                            <TableCell>{proposal.product}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn({
                                            'border-green-500 text-green-500': proposal.status === 'Pago',
                                            'border-orange-500 text-orange-500': proposal.status === 'Saldo Pago',
                                            'border-yellow-500 text-yellow-500': proposal.status === 'Em Andamento',
                                            'border-blue-500 text-blue-500': proposal.status === 'Aguardando Saldo',
                                            'border-red-500 text-red-500': proposal.status === 'Reprovado',
                                            'border-purple-500 text-purple-500': proposal.status === 'Pendente',
                                        })}
                                    >
                                        {proposal.status}
                                    </Badge>
                                    {isPortAwaitingBalance && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <AlertCircle className={cn(
                                                        "h-4 w-4 cursor-help transition-colors", 
                                                        businessDays >= 5 ? "text-destructive animate-pulse" : 
                                                        businessDays === 4 ? "text-orange-500" : 
                                                        "text-blue-400"
                                                    )} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-semibold">Monitoramento de Saldo</p>
                                                    <p>Prazo decorrido: {businessDays} dia(s) úteis.</p>
                                                    <p className="text-[10px] text-muted-foreground">O prazo bancário padrão é de 5 dias úteis.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                            {formatCurrency(proposal.grossAmount)}
                            </TableCell>
                        </TableRow>
                    );
                })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
