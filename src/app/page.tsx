import { AppLayout } from '@/components/app-layout';
import { BirthdayAlerts } from '@/components/dashboard/birthday-alerts';
import { CommissionChart } from '@/components/dashboard/commission-chart';
import { RecentProposals } from '@/components/dashboard/recent-proposals';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PageHeader } from '@/components/page-header';
import { proposals } from '@/lib/data';
import {
  FileText,
  Clock,
  CircleDollarSign,
  CheckCircle,
  XCircle,
  Hourglass,
  BadgePercent,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { ProposalStatus } from '@/lib/types';

export default function DashboardPage() {
  const getProposalsCountByStatus = (status: ProposalStatus) => {
    return proposals.filter((p) => p.status === status).length;
  };

  const paidCommission = proposals
    .filter((p) => p.commissionPaid)
    .reduce((sum, p) => sum + p.commissionValue, 0);

  const pendingCommission = proposals
    .filter((p) => !p.commissionPaid && p.status !== 'Rejeitado')
    .reduce((sum, p) => sum + p.commissionValue, 0);

  return (
    <AppLayout>
      <PageHeader title="Dashboard" />
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatsCard
            title="Em Andamento"
            value={getProposalsCountByStatus('Em Andamento').toString()}
            icon={Hourglass}
          />
          <StatsCard
            title="Aguardando Saldo"
            value={getProposalsCountByStatus('Aguardando Saldo').toString()}
            icon={Clock}
          />
          <StatsCard
            title="Pago"
            value={getProposalsCountByStatus('Pago').toString()}
            icon={CheckCircle}
          />
           <StatsCard
            title="Reprovado"
            value={getProposalsCountByStatus('Rejeitado').toString()}
            icon={XCircle}
          />
          <StatsCard
            title="Comissão Paga"
            value={formatCurrency(paidCommission)}
            icon={CircleDollarSign}
          />
          <StatsCard
            title="Comissão a Receber"
            value={formatCurrency(pendingCommission)}
            icon={BadgePercent}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CommissionChart />
          </div>
          <div className="space-y-8">
            <BirthdayAlerts />
          </div>
        </div>
        <div>
          <RecentProposals />
        </div>
      </div>
    </AppLayout>
  );
}
