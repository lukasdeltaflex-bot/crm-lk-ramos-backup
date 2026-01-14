import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { getProposalsWithCustomerData } from '@/lib/data';
import { FinancialDataTable } from './data-table';
import { columns } from './columns';

export default function FinancialPage() {
  const proposals = getProposalsWithCustomerData();

  return (
    <AppLayout>
      <PageHeader title="Controle Financeiro" />
      <FinancialDataTable columns={columns} data={proposals} />
    </AppLayout>
  );
}
