'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn, cleanFirestoreData } from '@/lib/utils';
import { proposalStatuses } from '@/lib/config-data';
import type { ProposalStatus, ProposalHistoryEntry } from '@/lib/types';
import { useFirestore, auth } from '@/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useTheme } from '@/components/theme-provider';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareText, Loader2 } from 'lucide-react';

interface StatusCellProps {
  proposalId: string;
  currentStatus: ProposalStatus;
  product?: string;
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus, product?: string) => void;
}

export function StatusCell({ proposalId, currentStatus, product, onStatusChange }: StatusCellProps) {
  const firestore = useFirestore();
  const { statusColors, containerStyle } = useTheme();
  
  const [pendingStatus, setPendingStatus] = useState<ProposalStatus | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateInitiate = (newStatus: ProposalStatus) => {
    if (newStatus === currentStatus) return;
    
    // Se for reprovado ou se tiver função de callback externa (ex: PropostasPage), delegamos direto
    if (newStatus === 'Reprovado' || onStatusChange) {
        onStatusChange?.(proposalId, newStatus, product);
        return;
    }

    setPendingStatus(newStatus);
    setQuickNote('');
    setIsNoteModalOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!pendingStatus || !firestore) return;

    setIsUpdating(true);
    const now = new Date().toISOString();
    const user = auth?.currentUser;
    const userName = user?.displayName || user?.email || 'Sistema';

    const dataToUpdate: any = { 
      status: pendingStatus,
      statusUpdatedAt: now
    };
    
    const isPortability = product === 'Portabilidade';

    if (pendingStatus === 'Pago') {
        dataToUpdate.dateApproved = now;
        dataToUpdate.datePaidToClient = now;
    } 
    else if (pendingStatus === 'Saldo Pago' && isPortability) {
        dataToUpdate.debtBalanceArrivalDate = now;
    }
    else if (pendingStatus === 'Aguardando Saldo' && isPortability) {
        dataToUpdate.statusAwaitingBalanceAt = now;
    }

    // 🛡️ BUG #3: Registro de Nota Rápida na Linha do Tempo
    const historyEntry: ProposalHistoryEntry = {
        id: crypto.randomUUID(),
        date: now,
        message: quickNote.trim() 
            ? `⚙️ Status para "${pendingStatus}". Nota: ${quickNote.trim()}`
            : `⚙️ Status alterado rapidamente para "${pendingStatus}"`,
        userName: userName
    };
    dataToUpdate.history = arrayUnion(historyEntry);

    try {
        const docRef = doc(firestore, 'loanProposals', proposalId);
        await updateDoc(docRef, cleanFirestoreData(dataToUpdate));
        
        toast({
            title: 'Status Atualizado!',
            description: `Alterado para "${pendingStatus}".`,
        });
        setIsNoteModalOpen(false);
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: `loanProposals/${proposalId}`,
                operation: 'update',
                requestResourceData: dataToUpdate
            }));
        }
    } finally {
        setIsUpdating(false);
        setPendingStatus(null);
    }
  };

  const statusKey = currentStatus.toUpperCase();
  const colorValue = statusColors[statusKey] || statusColors[currentStatus];

  return (
    <>
    <Select
      value={currentStatus}
      onValueChange={(newStatus: ProposalStatus) => handleUpdateInitiate(newStatus)}
    >
      <SelectTrigger className="p-0 border-0 focus:ring-0 focus:ring-offset-0 shadow-none bg-transparent h-auto w-full group">
        <SelectValue asChild>
            <Badge 
                variant="outline" 
                className={cn(
                    "w-full justify-center text-[10px] font-black uppercase tracking-tighter py-1.5 px-4 border-2 transition-all status-custom rounded-full",
                    containerStyle === 'glow' && "shadow-[0_0_10px_hsla(var(--status-color),0.3)]"
                )}
                style={colorValue ? { 
                    '--status-color': colorValue 
                } as any : {}}
            >
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

    <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="max-w-xs p-6 rounded-[2rem]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-black uppercase tracking-tight">
                    <MessageSquareText className="h-4 w-4 text-primary" /> Nota de Trâmite
                </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="p-3 bg-muted/30 rounded-xl border border-dashed text-[10px] font-bold uppercase text-muted-foreground text-center">
                    Alterando para: <span className="text-primary">{pendingStatus}</span>
                </div>
                <Textarea 
                    placeholder="Algo importante a registrar? (Opcional)"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    className="min-h-[80px] rounded-2xl text-xs font-medium"
                    autoFocus
                />
            </div>
            <DialogFooter className="flex flex-col gap-2">
                <Button 
                    onClick={handleUpdateConfirm} 
                    disabled={isUpdating}
                    className="w-full rounded-full font-black uppercase text-[10px] tracking-widest h-11"
                >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Mudança"}
                </Button>
                <Button variant="ghost" onClick={() => setIsNoteModalOpen(false)} className="rounded-full font-bold text-[10px] uppercase">Cancelar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}