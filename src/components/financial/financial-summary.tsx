'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import type { Proposal, Customer, UserSettings } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/stats-card';
import { formatCurrency, cn } from '@/lib/utils';
import { CheckCircle, Hourglass, Coins, CircleDollarSign, Activity, Wallet } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { subMonths, startOfMonth, endOfMonth, differenceInDays, subDays, isSameDay } from 'date-fns';
import * as configData from '@/lib/config-data';

type ProposalWithCustomer = Proposal & { customer: Customer };

interface FinancialSummaryProps {
  rows: Row<ProposalWithCustomer>[] | ProposalWithCustomer[];
  currentMonthRange: DateRange;
  isPrivacyMode: boolean;
  isFiltered: boolean;
  onShowDetails: (title: string, proposals: ProposalWithCustomer[]) => void;
  userSettings: UserSettings | null;
}

/**
 * Resumo Financeiro Consolidado LK RAMOS
 * Restaurado os cards de Saldo a Receber e Comissão Esperada para visão executiva.
 */
export function FinancialSummary({ rows, currentMonthRange, isPrivacyMode, isFiltered, onShowDetails, userSettings }: FinancialSummaryProps) {
  const {
    totalMonthlyGross,
    totalPotentialCommission,
    totalAmountPaid,
    totalSaldoAReceber,
    allProposalsInPeriod,
    commissionReceivedProposals,
    proposalsWithBalance,
    metrics,
  } = React.useMemo(() => {
    const allProposals = Array.isArray(rows) && rows.length > 0 
        ? ('original' in rows[0] ? (rows as Row<ProposalWithCustomer>[]).map(r => r.original) : (rows as ProposalWithCustomer[]))
        : [];
    
    const today = new Date();
    const fromDate = currentMonthRange?.from || startOfMonth(today);
    const toDate = currentMonthRange?.to || endOfMonth(today);
    
    const effectiveToDate = new Date(toDate);
    effectiveToDate.setHours(23, 59, 59, 999);

    // 1. PRODUÇÃO MENSAL (Focado no que foi digitado no período)
    const currentMonthProposals = allProposals.filter(p => {
        if (!p.dateDigitized) return false;
        const d = new Date(p.dateDigitized);
        return d >= fromDate && d <= effectiveToDate;
    });

    const totalMonthlyGross = currentMonthProposals.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
    const totalPotentialCommission = currentMonthProposals.reduce((sum, p) => sum + (p.commissionValue || 0), 0);

    // 2. COMISSÕES PAGAS NO PERÍODO (Dinheiro no caixa)
    const commissionReceivedProposals = allProposals.filter(p => {
        if (p.commissionStatus !== 'Paga' || !p.commissionPaymentDate) return false;
        const d = new Date(p.commissionPaymentDate);
        return d >= fromDate && d <= effectiveToDate;
    });
    const totalAmountPaid = commissionReceivedProposals.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    // 3. SALDO A RECEBER (Pendente Geral de todas as propostas ativas)
    const proposalsWithBalance = allProposals.filter(p => 
        p.status !== 'Reprovado' && 
        p.commissionStatus !== 'Paga' &&
        (p.commissionValue - (p.amountPaid || 0)) > 0
    );
    const totalSaldoAReceber = proposalsWithBalance.reduce((sum, p) => sum + (p.commissionValue - (p.amountPaid || 0)), 0);

    // Sparklines
    const getSparkline = (list: Proposal[], dateField: keyof Proposal) => {
        const days = Array.from({length: 15}, (_, i) => subDays(today, 14 - i));
        return days.map(day => {
            return list.filter(p => {
                const d = p[dateField];
                return d && isSameDay(new Date(d as string), day);
            }).reduce((sum, p) => sum + (p.commissionValue || 0), 0);
        });
    };

    const getAvg = (val: number, list: any[]) => list.length > 0 ? val / list.length : 0;
    
    return {
      totalMonthlyGross,
      totalPotentialCommission,
      totalAmountPaid,
      totalSaldoAReceber,
      allProposalsInPeriod: currentMonthProposals,
      commissionReceivedProposals,
      proposalsWithBalance,
      metrics: {
          avgTotal: getAvg(totalPotentialCommission, currentMonthProposals),
          avgPaid: getAvg(totalAmountPaid, commissionReceivedProposals),
          sparkTotal: getSparkline(currentMonthProposals, 'dateDigitized'),
          sparkPaid: getSparkline(commissionReceivedProposals, 'commissionPaymentDate'),
      }
    };
  }, [rows, currentMonthRange]);
  
  const privacyPlaceholder = '•••••';

  return (
    <div className='space-y-6 mb-8'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4'>
            {/* CARD 1: PRODUÇÃO DIGITADA (VOLUME BRUTO MENSAL) */}
            <div className="cursor-pointer" onClick={() => onShowDetails("Produção Digitada (Bruta)", allProposalsInPeriod)}>
                <StatsCard
                    title="Produção Digitada"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalMonthlyGross)}
                    icon={CircleDollarSign}
                    description="VOLUME BRUTO MENSAL"
                    subValue={`Propostas: ${allProposalsInPeriod.length}`}
                    sparklineData={metrics.sparkTotal}
                />
            </div>

            {/* CARD 2: COMISSÃO RECEBIDA (CASH IN MENSAL) */}
            <div className="cursor-pointer" onClick={() => onShowDetails("Comissões Recebidas no Mês", commissionReceivedProposals)}>
                <StatsCard
                    title="Comissão Recebida"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalAmountPaid)}
                    icon={CheckCircle}
                    description="DINHEIRO NO CAIXA"
                    subValue={`Média: ${formatCurrency(metrics.avgPaid)}`}
                    sparklineData={metrics.sparkPaid}
                />
            </div>

            {/* CARD 3: SALDO A RECEBER (PENDENTE GERAL) */}
            <div className="cursor-pointer" onClick={() => onShowDetails("Saldo a Receber (Pendente Geral)", proposalsWithBalance)}>
                <StatsCard
                    title="Saldo a Receber"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalSaldoAReceber)}
                    icon={Coins}
                    description="SALDO A RECEBER"
                    subValue={`${proposalsWithBalance.length} Contratos pendentes`}
                />
            </div>

            {/* CARD 4: COMISSÃO ESPERADA (POTENCIAL MENSAL) */}
            <div className="cursor-pointer" onClick={() => onShowDetails("Comissão Esperada (Produção Mês)", allProposalsInPeriod)}>
                <StatsCard
                    title="Comissão Esperada"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalPotentialCommission)}
                    icon={Hourglass}
                    description="COMISSÃO ESPERADA"
                    subValue={`Ticket Médio: ${formatCurrency(metrics.avgTotal)}`}
                />
            </div>
        </div>
    </div>
  );
}
