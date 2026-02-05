'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { proposalStatuses } from '@/lib/config-data';
import type { ProposalStatus } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface StatusCellProps {
  proposalId: string;
  currentStatus: ProposalStatus;
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => void;
}

const getStatusClass = (status: ProposalStatus) => {
  return cn('w-full justify-center text-[10px] font-black uppercase tracking-tighter py-1 px-3 border-2 transition-all', {
    'border-green-500/30 text-green-600 bg-green-50/80 hover:bg-green-100': status === 'Pago',
    'border-orange-500/30 text-orange-600 bg-orange-50/80 hover:bg-orange-100': status === 'Saldo Pago',
    'border-yellow-500/30 text-yellow-600 bg-yellow-50/80 hover:bg-yellow-100': status === 'Em Andamento',
    'border-blue-500/30 text-blue-600 bg-blue-50/80 hover:bg-blue-100': status === 'Aguardando Saldo',
    'border-red-500/30 text-red-600 bg-red-50/80 hover:bg-red-100': status === 'Reprovado',
    'border-purple-500/30 text-purple-600 bg-purple-50/80 hover:bg-purple-100': status === 'Pendente',
  });
};

export function StatusCell({ proposalId, currentStatus, onStatusChange }: StatusCellProps) {
  const firestore = useFirestore();

  const handleUpdate = (newStatus: ProposalStatus) => {
    if (newStatus === currentStatus) return;

    // Se houver uma função de callback do pai (como na página de propostas), usamos ela
    if (onStatusChange) {
        onStatusChange(proposalId, newStatus);
        return;
    }

    // Caso contrário (Dashboard ou Financeiro), atualizamos diretamente
    if (!firestore) return;

    const now = new Date().toISOString();
    const dataToUpdate: any = { status: newStatus };
    
    // Regra de Ouro LK Ramos: Marcar como pago atualiza datas automaticamente
    if (newStatus === 'Pago' || newStatus === 'Saldo Pago') {
        dataToUpdate.dateApproved = now;
        dataToUpdate.datePaidToClient = now;
    }

    if (newStatus === 'Saldo Pago') {
        dataToUpdate.debtBalanceArrivalDate = now;
    }

    const docRef = doc(firestore, 'loanProposals', proposalId);
    updateDoc(docRef, dataToUpdate)
        .then(() => {
            toast({
                title: 'Status Atualizado!',
                description: `Proposta alterada para "${newStatus}" com sucesso.`,
            });
        })
        .catch(async (error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate
            }));
        });
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={(newStatus: ProposalStatus) => handleUpdate(newStatus)}
    >
      <SelectTrigger className="p-0 border-0 focus:ring-0 focus:ring-offset-0 shadow-none bg-transparent h-auto w-full group">
        <SelectValue asChild>
            <Badge variant="outline" className={getStatusClass(currentStatus)}>
                {currentStatus}
            </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {proposalStatuses.map((status) => (
          <SelectItem key={status} value={status} className="text-[10px] font-black uppercase">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
