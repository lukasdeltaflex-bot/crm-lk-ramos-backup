'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Expense } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Receipt, CheckCircle2, AlertCircle, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/5">
        <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground font-bold">Nenhuma despesa lançada.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Lançar gastos ajuda a calcular seu lucro real.</p>
      </div>
    );
  }

  const getRecurrenceLabel = (expense: Expense) => {
    if (expense.recurrence === 'installments' && expense.installmentNumber && expense.installmentsCount) {
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 text-[9px] font-black">{expense.installmentNumber}/{expense.installmentsCount} Parc.</Badge>;
    }
    if (expense.recurrence === 'monthly') return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-[9px] font-black">FIXA MENSAL</Badge>;
    if (expense.recurrence === 'annually') return <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-[9px] font-black">ANUAL</Badge>;
    if (expense.recurrence === 'semi-annually') return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[9px] font-black">SEMESTRAL</Badge>;
    return null;
  };

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">Data</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">Descrição</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">Categoria</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">Tipo</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Valor</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.sort((a,b) => b.date.localeCompare(a.date)).map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="text-xs font-medium">
                {format(parseISO(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell className="font-bold text-sm">
                <div className="flex flex-col gap-0.5">
                    {expense.description}
                    {expense.category && <span className="text-[9px] text-muted-foreground uppercase">{expense.category}</span>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-background text-[10px] font-black uppercase border-zinc-300">
                    {expense.category}
                </Badge>
              </TableCell>
              <TableCell>
                {getRecurrenceLabel(expense) || <span className="text-[9px] text-muted-foreground/40 uppercase font-black">Único</span>}
              </TableCell>
              <TableCell>
                <Badge 
                    variant="outline" 
                    className={cn(
                        "text-[10px] font-black uppercase border-2 flex w-fit items-center gap-1",
                        expense.paid 
                            ? "bg-green-50 text-green-600 border-green-200" 
                            : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    )}
                >
                    {expense.paid ? <CheckCircle2 className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />}
                    {expense.paid ? "Pago" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-bold text-red-600">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(expense)} title="Editar Pagamento">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(expense.id)} title="Excluir Lançamento">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}