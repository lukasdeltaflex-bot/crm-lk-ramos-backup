'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ChevronRight, User, TrendingUp } from 'lucide-react';
import type { Customer, Proposal } from '@/lib/types';
import { differenceInMonths } from 'date-fns';
import Link from 'next/link';
import { formatCurrency, getAge } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface RadarWidgetProps {
  proposals: Proposal[];
  customers: Customer[];
  isLoading: boolean;
}

export function RadarWidget({ proposals, customers, isLoading }: RadarWidgetProps) {
  const radarOpportunities = useMemo(() => {
    if (!proposals || !customers) return [];
    
    const now = new Date();
    
    // Filtra clientes ATIVOS (Status Ativo e Idade < 75) que têm contratos pagos há mais de 12 meses
    const opportunities = customers
      .filter(c => c.status !== 'inactive' && getAge(c.birthDate) < 75)
      .map(customer => {
        const maturedProposals = proposals.filter(p => {
          if (p.customerId !== customer.id) return false;
          if (p.status !== 'Pago' && p.status !== 'Saldo Pago') return false;
          if (!p.datePaidToClient) return false;
          return differenceInMonths(now, new Date(p.datePaidToClient)) >= 12;
        });

        if (maturedProposals.length === 0) return null;

        // Pega a proposta mais antiga para mostrar o tempo de maturação
        const oldest = [...maturedProposals].sort((a,b) => a.datePaidToClient!.localeCompare(b.datePaidToClient!))[0];
        const months = differenceInMonths(now, new Date(oldest.datePaidToClient!));

        return {
          customer,
          months,
          lastProposal: oldest
        };
      })
      .filter((opt): opt is NonNullable<typeof opt> => opt !== null)
      .sort((a, b) => b.months - a.months)
      .slice(0, 10);

    return opportunities;
  }, [proposals, customers]);

  return (
    <Card className="h-full flex flex-col border-orange-200/50 bg-orange-50/10 shadow-lg overflow-hidden">
      <CardHeader className="pb-4 bg-orange-50/30 border-b border-orange-100">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-700">
                    <Zap className="h-5 w-5 fill-orange-500 text-orange-500" />
                    Radar de Vendas
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase text-orange-600/70 tracking-widest">Retenção e Refinanciamento</CardDescription>
            </div>
            {!isLoading && radarOpportunities.length > 0 && (
                <Badge variant="outline" className="bg-white border-orange-200 text-orange-700 font-bold">
                    {radarOpportunities.length} OPORTUNIDADES
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6 pb-0">
        {isLoading ? (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        ) : radarOpportunities.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center text-center text-orange-600/40 p-8 border-2 border-dashed border-orange-200/30 rounded-xl bg-orange-50/5">
                <Zap className="h-10 w-10 mb-4 opacity-20" />
                <p className="font-bold text-sm text-orange-800/60">Radar Limpo</p>
                <p className="text-[11px] opacity-60 mt-1">Nenhum contrato amadurecido para retenção no momento.</p>
            </div>
        ) : (
            <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3 pr-4 pb-6">
                    {radarOpportunities.map((opt) => (
                        <Link key={opt.customer.id} href={`/customers/${opt.customer.id}`}>
                            <div className="group flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-white hover:border-orange-400 hover:shadow-md transition-all">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-orange-900 truncate group-hover:text-orange-600 transition-colors">{opt.customer.name}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600/60 uppercase">
                                        <TrendingUp className="h-3 w-3" />
                                        Pago há {opt.months} meses • {formatCurrency(opt.lastProposal.grossAmount)}
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-orange-300 group-hover:text-orange-500 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        )}
      </CardContent>
      <div className="px-6 py-3 border-t border-orange-100/50 bg-orange-50/30">
          <p className="text-[9px] text-center text-orange-600/50 font-bold uppercase tracking-tighter">
              Clientes ativos com contratos pagos há mais de 1 ano
          </p>
      </div>
    </Card>
  );
}
