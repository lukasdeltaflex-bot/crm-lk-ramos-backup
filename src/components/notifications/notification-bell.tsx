
'use client';

import React from 'react';
import { Bell, Cake, BadgePercent, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Customer, Proposal } from '@/lib/types';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export function NotificationBell() {
  const { user } = useUser();
  const firestore = useFirestore();

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'loanProposals'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: customers } = useCollection<Customer>(customersQuery);
  const { data: proposals } = useCollection<Proposal>(proposalsQuery);

  const notifications = React.useMemo(() => {
    if (!customers || !proposals) return [];
    const alerts: { id: string; title: string; type: 'birthday' | 'commission'; date: string; link: string }[] = [];
    const today = format(new Date(), 'MM-dd');

    // Birthdays today
    customers.forEach(c => {
      if (c.birthDate && c.birthDate.substring(5) === today) {
        alerts.push({
          id: `bday-${c.id}`,
          title: `Aniversário: ${c.name}`,
          type: 'birthday',
          date: 'Hoje',
          link: `/customers/${c.id}`
        });
      }
    });

    // Late commissions (> 7 days since payment)
    proposals.forEach(p => {
      if ((p.status === 'Pago' || p.status === 'Saldo Pago') && p.commissionStatus === 'Pendente' && p.datePaidToClient) {
        const days = differenceInDays(new Date(), new Date(p.datePaidToClient));
        if (days > 7) {
          alerts.push({
            id: `comm-${p.id}`,
            title: `Comissão Pendente: ${p.proposalNumber}`,
            type: 'commission',
            date: `${days} dias`,
            link: `/proposals?open=${p.id}`
          });
        }
      }
    });

    return alerts;
  }, [customers, proposals]);

  const count = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600">
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {count === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum alerta para hoje.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <Link key={n.id} href={n.link} passHref>
                <DropdownMenuItem className="cursor-pointer p-3">
                  <div className="flex items-start gap-3">
                    {n.type === 'birthday' ? (
                      <Cake className="h-4 w-4 text-pink-500 mt-1" />
                    ) : (
                      <BadgePercent className="h-4 w-4 text-orange-500 mt-1" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.date}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </Link>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
