'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Coins, Info } from 'lucide-react';
import { partialCommissionReminder } from '@/ai/flows/partial-commission-reminder-flow';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';
import { differenceInDays } from 'date-fns';
import type { Proposal, Customer } from '@/lib/types';

type ReminderMessage = {
  proposalId: string;
  proposalNumber: string;
  customerName: string;
  reminderMessage: string;
};

interface PartialCommissionRemindersProps {
    proposals: Proposal[];
    customers: Customer[];
    isLoading: boolean;
}

function PartialCommissionReminderItem({ reminder }: { reminder: ReminderMessage }) {
  return (
    <Alert variant="destructive">
      <Coins className="h-4 w-4" />
      <AlertTitle>{reminder.customerName} (Proposta: {reminder.proposalNumber})</AlertTitle>
      <AlertDescription>{reminder.reminderMessage}</AlertDescription>
    </Alert>
  );
}

export function PartialCommissionReminders({ proposals, customers, isLoading }: PartialCommissionRemindersProps) {
  const [reminders, setReminders] = useState<ReminderMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  const partialCommissions = useMemo(() => {
    if (!customers || !proposals) return [];
    const customerMap = new Map(customers.map(c => [c.id, c]));
    return proposals
      .filter(p => 
        p.commissionStatus === 'Parcial' && 
        p.commissionPaymentDate && 
        differenceInDays(new Date(), new Date(p.commissionPaymentDate)) > 15
      )
      .map(p => ({...p, customer: customerMap.get(p.customerId)}))
      .filter(p => p.customer);
  }, [proposals, customers]);

  useEffect(() => {
    async function fetchReminders() {
      if (isLoading) return;

      setIsGenerating(true);
      if (partialCommissions.length > 0) {
        try {
            const reminderPromises = partialCommissions.map(proposal => 
                partialCommissionReminder({
                customerName: proposal.customer!.name,
                proposalNumber: proposal.proposalNumber,
                amountPaid: proposal.amountPaid,
                totalCommission: proposal.commissionValue,
                daysSincePayment: differenceInDays(new Date(), new Date(proposal.commissionPaymentDate!)),
            }).then(response => ({
                proposalId: proposal.id,
                proposalNumber: proposal.proposalNumber,
                customerName: proposal.customer!.name,
                reminderMessage: response.reminderMessage,
            }))
            );
            const results = await Promise.all(reminderPromises);
            setReminders(results);
        } catch (error) {
            console.error("Error fetching partial commission reminders:", error);
            setReminders([]);
        }
      } else {
        setReminders([]);
      }
      setIsGenerating(false);
    }
    fetchReminders();
  }, [isLoading, JSON.stringify(partialCommissions)]);

  const showLoadingState = isLoading || isGenerating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Alerta de Comissão Parcial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showLoadingState ? (
          <div className="space-y-4">
             <div className="p-4 border rounded-lg">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
          </div>
        ) : reminders.length > 0 ? (
          reminders.map((reminder) => (
            <PartialCommissionReminderItem key={reminder.proposalId} reminder={reminder} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4">
             <Info className="h-8 w-8 mb-2" />
            <p>Nenhuma comissão parcial pendente de cobrança.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
