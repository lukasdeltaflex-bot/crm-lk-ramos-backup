'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import type { Proposal, Customer } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/stats-card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Hourglass, Coins, CircleDollarSign } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { subMonths, startOfMonth, endOfMonth, differenceInDays, subDays, isSameDay } from 'date-fns';

type ProposalWithCustomer = Proposal & { customer: Customer };

interface FinancialSummaryProps {
  rows: Row<ProposalWithCustomer>[] | ProposalWithCustomer[];
  currentMonthRange: DateRange;
  isPrivacyMode: boolean;
  isFiltered: boolean;
  onShowDetails: (title: string, proposals: ProposalWithCustomer[]) => void;
}

export function FinancialSummary({ rows, currentMonthRange, isPrivacyMode, isFiltered, onShowDetails }: FinancialSummaryProps) {
  const {
    totalPotentialCommission,
    totalAmountPaid,
    pendingAmount,
    expectedAmount,
    allProposalsInPeriod,
    commissionReceivedProposals,
    proposalsForSaldoAReceber,
    expectedCommissionProposals,
    metrics,
  } = React.useMemo(() => {
    const allProposals = Array.isArray(rows) && rows.length > 0 
        ? ('original' in rows[0] ? (rows as Row<ProposalWithCustomer>[]).map(r => r.original) : (rows as ProposalWithCustomer[]))
        : [];
    
    const today = new Date();
    const fromDate = currentMonthRange?.from || startOfMonth(today);
    const toDate = currentMonthRange?.to || endOfMonth(today);
    
    const startOfPipeline = startOfMonth(subMonths(fromDate, 1));
    const effectiveToDate = new Date(toDate);
    effectiveToDate.setHours(23, 59, 59, 999);

    // 1. PRODUÇÃO MENSAL: Baseado na Data de Digitação (O que entrou de trabalho no período)
    const currentMonthProposals = allProposals.filter(p => {
        if (!p.dateDigitized) return false;
        const d = new Date(p.dateDigitized);
        return d >= fromDate && d <= effectiveToDate;
    });

    const totalPotentialCommission = currentMonthProposals.reduce((sum, p) => sum + (p.commissionValue || 0), 0);

    // 2. FLUXO DE CAIXA (COMISSÃO RECEBIDA): Baseado na Data de Pagamento da Comissão
    // Agora conta qualquer proposta paga no período, mesmo que digitada meses atrás
    const commissionReceivedProposals = allProposals.filter(p => {
        if (p.commissionStatus !== 'Paga' || !p.commissionPaymentDate) return false;
        const d = new Date(p.commissionPaymentDate);
        return d >= fromDate && d <= effectiveToDate;
    });
    const totalAmountPaid = commissionReceivedProposals.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    // 3. ACUMULADOS: Pipeline de Pendências
    const accumulatedProposals = allProposals.filter(p => {
        if (!p.dateDigitized) return false;
        const d = new Date(p.dateDigitized);
        return d >= startOfPipeline && d <= effectiveToDate;
    });

    // Saldo a Receber (Averbados ou Pagos que ainda não pagaram comissão)
    const proposalsForSaldoAReceber = allProposals.filter(p => {
        if (p.commissionStatus === 'Paga') return false;
        const status = p.status;
        const hasAverbacao = !!p.dateApproved;
        // Consideramos propostas que já foram pagas ao cliente ou estão averbadas
        return status === 'Pago' || (hasAverbacao && ['Em Andamento', 'Saldo Pago', 'Pendente'].includes(status));
    });
    const pendingAmount = proposalsForSaldoAReceber.reduce((sum, p) => sum + (p.commissionValue || 0), 0);

    const isCriticalSaldo = proposalsForSaldoAReceber.some(p => {
        if (!p.dateApproved) return false;
        return differenceInDays(today, new Date(p.dateApproved)) > 15;
    });

    // Comissão Esperada (Digitados que ainda não averbaram)
    const expectedCommissionProposals = accumulatedProposals.filter(p => {
        if (p.commissionStatus === 'Paga') return false;
        const isReprovado = p.status === 'Reprovado';
        const hasAverbacao = !!p.dateApproved;
        const isPagoStatus = p.status === 'Pago' || p.status === 'Saldo Pago';
        return !isReprovado && !hasAverbacao && !isPagoStatus;
    });
    const expectedAmount = expectedCommissionProposals.reduce((sum, p) => sum + (p.commissionValue || 0), 0);

    // Sparklines (Últimos 15 dias para visualização de tendência)
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
      totalPotentialCommission,
      totalAmountPaid,
      pendingAmount,
      expectedAmount,
      allProposalsInPeriod: currentMonthProposals,
      commissionReceivedProposals,
      proposalsForSaldoAReceber,
      expectedCommissionProposals,
      metrics: {
          isCriticalSaldo,
          avgTotal: getAvg(totalPotentialCommission, currentMonthProposals),
          avgPaid: getAvg(totalAmountPaid, commissionReceivedProposals),
          avgPending: getAvg(pendingAmount, proposalsForSaldoAReceber),
          avgExpected: getAvg(expectedAmount, expectedCommissionProposals),
          sparkTotal: getSparkline(currentMonthProposals, 'dateDigitized'),
          sparkPaid: getSparkline(commissionReceivedProposals, 'commissionPaymentDate'),
          sparkPending: getSparkline(proposalsForSaldoAReceber, 'dateApproved'),
          sparkExpected: getSparkline(expectedCommissionProposals, 'dateDigitized')
      }
    };
  }, [rows, currentMonthRange]);
  
  const privacyPlaceholder = '•••••';

  const cards = [
    {
      title: "Total de Comissões",
      value: formatCurrency(totalPotentialCommission),
      icon: Coins,
      description: "PRODUÇÃO DO PERÍODO",
      subValue: `Ticket Médio: ${formatCurrency(metrics.avgTotal)}`,
      proposals: allProposalsInPeriod,
      spark: metrics.sparkTotal
    },
    {
      title: "Comissão Recebida",
      value: formatCurrency(totalAmountPaid),
      icon: CheckCircle,
      description: "DINHEIRO NO CAIXA",
      subValue: `Eficiência: ${metrics.avgPaid > 0 ? ((totalAmountPaid / (totalPotentialCommission || 1)) * 100).toFixed(1) : '0'}%`,
      proposals: commissionReceivedProposals,
      spark: metrics.sparkPaid
    },
    {
      title: "Saldo a Receber",
      value: formatCurrency(pendingAmount),
      icon: Hourglass,
      description: "FATURAMENTO PENDENTE",
      subValue: `Averbados/Pagos S/ Comiss.`,
      proposals: proposalsForSaldoAReceber,
      spark: metrics.sparkPending,
      critical: metrics.isCriticalSaldo
    },
    {
      title: "Comissão Esperada",
      value: formatCurrency(expectedAmount),
      icon: CircleDollarSign,
      description: "PIPELINE DIGITADO",
      subValue: `Em processamento`,
      proposals: expectedCommissionProposals,
      spark: metrics.sparkExpected
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 mb-8'>
        {cards.map(card => (
            <div key={card.title} className="cursor-pointer" onClick={() => onShowDetails(card.title, card.proposals)}>
                <StatsCard
                    title={card.title}
                    value={isPrivacyMode ? privacyPlaceholder : card.value}
                    icon={card.icon}
                    description={card.description}
                    subValue={isPrivacyMode ? undefined : card.subValue}
                    sparklineData={card.spark}
                    isCritical={card.critical}
                />
            </div>
        ))}
    </div>
  );
}
