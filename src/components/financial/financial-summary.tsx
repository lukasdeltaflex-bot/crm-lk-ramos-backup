'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import type { Proposal, Customer, UserSettings } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/stats-card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Hourglass, CircleDollarSign, TrendingUp, Activity } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth, subDays, isSameDay } from 'date-fns';

type ProposalWithCustomer = Proposal & { customer: Customer };

interface FinancialSummaryProps {
  rows: Row<ProposalWithCustomer>[] | ProposalWithCustomer[];
  currentMonthRange: DateRange;
  isPrivacyMode: boolean;
  isFiltered: boolean;
  onShowDetails: (title: string, proposals: ProposalWithCustomer[]) => void;
  userSettings: UserSettings | null;
}

export function FinancialSummary({ rows, currentMonthRange, isPrivacyMode, onShowDetails }: FinancialSummaryProps) {
  const {
    totalMonthlyComissaoDigitada,
    totalAmountPaid,
    totalSaldoAReceber,
    totalComissaoEsperada,
    allProposalsInPeriod,
    commissionReceivedProposals,
    proposalsWithBalance,
    proposalsEsperadas,
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

    const filteredBase = allProposals.filter(p => p.status !== 'Reprovado');

    // 1. PRODUÇÃO DIGITADA: Comissão potencial do mês vigente (menos reprovados)
    const currentMonthProposals = filteredBase.filter(p => {
        if (!p.dateDigitized) return false;
        const d = new Date(p.dateDigitized);
        return d >= fromDate && d <= effectiveToDate;
    });
    const totalMonthlyComissaoDigitada = currentMonthProposals.reduce((sum, p) => sum + (p.commissionValue || 0), 0);

    // 2. COMISSÃO RECEBIDA: Cash-in do período
    const commissionReceivedProposals = allProposals.filter(p => {
        if (p.commissionStatus !== 'Paga' || !p.commissionPaymentDate) return false;
        const d = new Date(p.commissionPaymentDate);
        return d >= fromDate && d <= effectiveToDate;
    });
    const totalAmountPaid = commissionReceivedProposals.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    // 3. SALDO A RECEBER: Contratos averbados OU Pagos com saldo pendente (menos reprovados)
    const proposalsWithBalance = filteredBase.filter(p => {
        const isPaidStatusWithResidual = p.status === 'Pago' && p.amountPaid < p.commissionValue;
        const isAverbadoAndPending = !!p.dateApproved && p.commissionStatus !== 'Paga';
        return (isPaidStatusWithResidual || isAverbadoAndPending);
    });
    const totalSaldoAReceber = proposalsWithBalance.reduce((sum, p) => sum + (p.commissionValue - (p.amountPaid || 0)), 0);

    // 4. COMISSÃO ESPERADA: Repasse pendente de todos os status (menos reprovados/pagos)
    const proposalsEsperadas = filteredBase.filter(p => p.commissionStatus !== 'Paga');
    const totalComissaoEsperada = proposalsEsperadas.reduce((sum, p) => sum + (p.commissionValue - (p.amountPaid || 0)), 0);

    const ticketMedio = currentMonthProposals.length > 0 ? totalMonthlyComissaoDigitada / currentMonthProposals.length : 0;
    const eficiencia = (totalAmountPaid + totalSaldoAReceber) > 0 ? (totalAmountPaid / (totalAmountPaid + totalSaldoAReceber)) * 100 : 0;
    
    return {
      totalMonthlyComissaoDigitada,
      totalAmountPaid,
      totalSaldoAReceber,
      totalComissaoEsperada,
      allProposalsInPeriod: currentMonthProposals,
      commissionReceivedProposals,
      proposalsWithBalance,
      proposalsEsperadas,
      metrics: {
          ticketMedio,
          eficiencia,
      }
    };
  }, [rows, currentMonthRange]);
  
  const privacyPlaceholder = '•••••';

  return (
    <div className='space-y-6 mb-8'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4'>
            <div className="cursor-pointer" onClick={() => onShowDetails("Produção Digitada (Comissão)", allProposalsInPeriod)}>
                <StatsCard
                    title="PRODUÇÃO DIGITADA"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalMonthlyComissaoDigitada)}
                    icon={Activity}
                    description="COMISSÃO POTENCIAL"
                    subValue={`TICKET MÉDIO: ${formatCurrency(metrics.ticketMedio)}`}
                />
            </div>

            <div className="cursor-pointer" onClick={() => onShowDetails("Comissões Recebidas", commissionReceivedProposals)}>
                <StatsCard
                    title="COMISSÃO RECEBIDA"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalAmountPaid)}
                    icon={TrendingUp}
                    description="DINHEIRO NO CAIXA"
                    subValue={`EFICIÊNCIA: ${metrics.eficiencia.toFixed(1)}%`}
                    isHot={metrics.eficiencia > 80}
                />
            </div>

            <div className="cursor-pointer" onClick={() => onShowDetails("Saldo a Receber", proposalsWithBalance)}>
                <StatsCard
                    title="SALDO A RECEBER"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalSaldoAReceber)}
                    icon={Hourglass}
                    description="GARANTIDO EM ESTEIRA"
                />
            </div>

            <div className="cursor-pointer" onClick={() => onShowDetails("Comissão Esperada", proposalsEsperadas)}>
                <StatsCard
                    title="COMISSÃO ESPERADA"
                    value={isPrivacyMode ? privacyPlaceholder : formatCurrency(totalComissaoEsperada)}
                    icon={CircleDollarSign}
                    description="PIPELINE GERAL"
                />
            </div>
        </div>
    </div>
  );
}