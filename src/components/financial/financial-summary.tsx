'use client';

import * as React from 'react';
import type { Row } from '@tanstack/react-table';
import type { Proposal, Customer } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/stats-card';
import { formatCurrency } from '@/lib/utils';
import { FileText, CircleDollarSign, CheckCircle, Hourglass } from 'lucide-react';

type ProposalWithCustomer = Proposal & { customer: Customer };

interface FinancialSummaryProps {
  rows: Row<ProposalWithCustomer>[];
  isPrivacyMode: boolean;
}

export function FinancialSummary({ rows, isPrivacyMode }: FinancialSummaryProps) {
  const summary = React.useMemo(() => {
    let totalGrossAmount = 0;
    let totalCommissionValue = 0;
    let totalAmountPaid = 0;

    rows.forEach((row) => {
      totalGrossAmount += row.original.grossAmount;
      totalCommissionValue += row.original.commissionValue;
      totalAmountPaid += row.original.amountPaid || 0;
    });

    const pendingAmount = totalCommissionValue - totalAmountPaid;

    return {
      totalGrossAmount,
      totalCommissionValue,
      totalAmountPaid,
      pendingAmount,
    };
  }, [rows]);
  
  const privacyPlaceholder = '•••••';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
      <StatsCard
        title="Total Contratos"
        value={isPrivacyMode ? privacyPlaceholder : formatCurrency(summary.totalGrossAmount)}
        icon={FileText}
        className="print:shadow-none print:border-gray-300 print:p-2"
      />
      <StatsCard
        title="Comissão Esperada"
        value={isPrivacyMode ? privacyPlaceholder : formatCurrency(summary.totalCommissionValue)}
        icon={CircleDollarSign}
        className="print:shadow-none print:border-gray-300 print:p-2"
        valueClassName="text-blue-500"
      />
      <StatsCard
        title="Comissão Recebida"
        value={isPrivacyMode ? privacyPlaceholder : formatCurrency(summary.totalAmountPaid)}
        icon={CheckCircle}
        className="print:shadow-none print:border-gray-300 print:p-2"
        valueClassName="text-green-500"
      />
      <StatsCard
        title="Saldo a Receber"
        value={isPrivacyMode ? privacyPlaceholder : formatCurrency(summary.pendingAmount)}
        icon={Hourglass}
        className="print:shadow-none print:border-gray-300 print:p-2"
        valueClassName="text-orange-500"
      />
    </div>
  );
}
