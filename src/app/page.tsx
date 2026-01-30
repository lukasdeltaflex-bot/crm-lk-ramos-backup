
'use client';
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { CommissionChart } from '@/components/dashboard/commission-chart';
import { RecentProposals } from '@/components/dashboard/recent-proposals';
import { StatsCard } from '@/components/dashboard/stats-card';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import {
  FileText,
  Clock,
  Hourglass,
  BadgePercent,
  Eye,
  EyeOff,
  X,
  Filter,
  XCircle,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, parse, startOfMonth, endOfMonth, isValid, startOfDay, subDays, endOfDay, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, cn } from '@/lib/utils';
import type { Proposal, ProposalStatus, Customer, UserProfile } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProposalsStatusTable } from '@/components/dashboard/proposals-status-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import { DailySummary } from '@/components/summary/daily-summary';
import { GoalCard } from '@/components/dashboard/goal-card';
import { ProductBreakdownChart } from '@/components/dashboard/product-breakdown-chart';
import { PartnerPerformanceCharts } from '@/components/dashboard/partner-performance-charts';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AgendaSection } from '@/components/dashboard/agenda-section';
import { LiveClock } from '@/components/dashboard/live-clock';

export default function DashboardPage() {
  const [startDateInput, setStartDateInput] = React.useState('');
  const [endDateInput, setEndDateInput] = React.useState('');
  const [appliedDateRange, setAppliedDateRange] = React.useState<DateRange | undefined>(undefined);
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [dialogData, setDialogData] = React.useState<{ title: string; proposals: Proposal[] } | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'loanProposals'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: proposals, isLoading: proposalsLoading } = useCollection<Proposal>(proposalsQuery);
  
  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: customers, isLoading: customersLoading } = useCollection<Customer>(customersQuery);

  const userProfileDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileDocRef);

  const isLoading = proposalsLoading || customersLoading || isUserLoading || profileLoading;

  const handleDateInputChange = (value: string, type: 'start' | 'end') => {
    let formattedValue = value.replace(/\D/g, '');
    if (formattedValue.length > 8) formattedValue = formattedValue.substring(0, 8);
    formattedValue = formattedValue.replace(/(\d{2})(\d)/, '$1/$2');
    formattedValue = formattedValue.replace(/(\d{2})(\d)/, '$1/$2');
    
    if (type === 'start') {
      setStartDateInput(formattedValue);
    } else {
      setEndDateInput(formattedValue);
    }
  };

  const applyRange = (range: 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth') => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    switch (range) {
        case 'today': from = startOfDay(now); break;
        case 'yesterday': from = startOfDay(subDays(now, 1)); to = endOfDay(subDays(now, 1)); break;
        case 'week': from = startOfDay(subDays(now, 7)); break;
        case 'month': from = startOfMonth(now); break;
        case 'lastMonth': from = startOfMonth(subMonths(now, 1)); to = endOfMonth(subMonths(now, 1)); break;
        default: return;
    }

    setStartDateInput(from.toLocaleDateString('pt-BR'));
    setEndDateInput(to.toLocaleDateString('pt-BR'));
    setAppliedDateRange({ from, to });
  };

  const handleApplyFilter = () => {
    const startDate = parse(startDateInput, 'dd/MM/yyyy', new Date());
    const endDate = parse(endDateInput, 'dd/MM/yyyy', new Date());
    if (isValid(startDate) && isValid(endDate)) {
        setAppliedDateRange({ from: startDate, to: endDate });
    }
  };

  const clearDates = () => {
    setStartDateInput('');
    setEndDateInput('');
    setAppliedDateRange(undefined);
  }

  const filteredProposals = React.useMemo(() => {
    if (!proposals || !isClient) return [];
    const today = new Date();
    const fromDate = appliedDateRange?.from || startOfMonth(today);
    const toDate = appliedDateRange?.to || endOfMonth(today);
    toDate.setHours(23, 59, 59, 999);
  
    return proposals.filter(p => {
      if (!p.dateDigitized) return false;
      const proposalDate = new Date(p.dateDigitized);
      return proposalDate >= fromDate && proposalDate <= toDate;
    });
  }, [proposals, appliedDateRange, isClient]);

  const getProposalsSum = (proposalsList: Proposal[]): number => {
    return proposalsList.reduce((sum, p) => {
        if (p.commissionBase === 'net') return sum + (p.netAmount || 0);
        return sum + (p.grossAmount || 0);
    }, 0);
  };

  const currentTotalDigitado = getProposalsSum(filteredProposals);
  const pagoProposals = filteredProposals.filter(p => ['Pago', 'Saldo Pago'].includes(p.status));
  const currentTotalPago = getProposalsSum(pagoProposals);

  return (
    <AppLayout>
       <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-fit">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Olá, {userProfile?.displayName || 'Agente'}!</h1>
                <div className="mt-1"><LiveClock /></div>
            </div>
            <div className="flex items-center gap-2 flex-wrap bg-card p-2 rounded-lg border shadow-sm">
                <Select onValueChange={(val) => applyRange(val as any)}>
                    <SelectTrigger className='w-[140px] h-9 border-none shadow-none focus:ring-0'>
                        <CalendarIcon className='mr-2 h-4 w-4 text-primary' />
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="yesterday">Ontem</SelectItem>
                        <SelectItem value="week">Últimos 7 dias</SelectItem>
                        <SelectItem value="month">Mês Atual</SelectItem>
                        <SelectItem value="lastMonth">Mês Passado</SelectItem>
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
                <div className="flex items-center gap-1">
                    <Input 
                        placeholder="De" 
                        value={startDateInput}
                        onChange={(e) => handleDateInputChange(e.target.value, 'start')}
                        maxLength={10}
                        className="h-9 w-28 border-none shadow-none"
                    />
                    <span className='text-muted-foreground'>-</span>
                    <Input 
                        placeholder="Até" 
                        value={endDateInput}
                        onChange={(e) => handleDateInputChange(e.target.value, 'end')}
                        maxLength={10}
                        className="h-9 w-28 border-none shadow-none"
                    />
                </div>
                <Button size="sm" onClick={handleApplyFilter} className='h-8'>Filtrar</Button>
                {(startDateInput || appliedDateRange) && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearDates}><X className="h-4 w-4" /></Button>
                )}
                <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
                <Button variant="ghost" size="icon" className='h-8 w-8' onClick={() => setIsPrivacyMode(!isPrivacyMode)}>
                    {isPrivacyMode ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <GoalCard 
                    currentProduction={currentTotalPago} 
                    totalDigitized={currentTotalDigitado}
                    isPrivacyMode={isPrivacyMode}
                    className="md:col-span-2"
                />
                <StatsCard title="Total Digitado" value={isPrivacyMode ? '•••••' : formatCurrency(currentTotalDigitado)} icon={FileText} />
                <StatsCard title="Contratos Pagos" value={isPrivacyMode ? '•••••' : formatCurrency(currentTotalPago)} icon={CheckCircle2} valueClassName="text-green-500" />
            </div>
            <CommissionChart proposals={proposals || []} />
            <RecentProposals proposals={proposals || []} customers={customers || []} isLoading={isLoading}/>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <AgendaSection />
            <DailySummary 
                proposals={proposals || []}
                customers={customers || []}
                userProfile={userProfile}
            />
            <ProductBreakdownChart proposals={filteredProposals} />
        </div>
      </div>

      <Dialog open={!!dialogData} onOpenChange={(isOpen) => !isOpen && setDialogData(null)}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader><DialogTitle>{dialogData?.title}</DialogTitle></DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <ProposalsStatusTable proposals={dialogData?.proposals || []} customers={customers || []} />
                </div>
            </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
