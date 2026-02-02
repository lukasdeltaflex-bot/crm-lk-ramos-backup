'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Pencil, Check, X, ShieldCheck, Trophy } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GoalCardProps {
  currentProduction: number;
  totalDigitized: number;
  isPrivacyMode?: boolean;
  onValueClick?: () => void;
  className?: string;
}

const STORAGE_KEY_GOAL = 'lk-ramos-monthly-goal-v1';

export function GoalCard({ currentProduction, totalDigitized, isPrivacyMode, onValueClick, className }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(100000);
  const [editValue, setEditValue] = useState('100000');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedGoal = localStorage.getItem(STORAGE_KEY_GOAL);
    if (savedGoal) {
      const parsed = parseFloat(savedGoal);
      if (!isNaN(parsed)) {
        setMonthlyGoal(parsed);
        setEditValue(savedGoal);
      }
    }
  }, []);

  const handleSave = () => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed) && parsed > 0) {
      setMonthlyGoal(parsed);
      localStorage.setItem(STORAGE_KEY_GOAL, String(parsed));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(monthlyGoal));
    setIsEditing(false);
  };

  const percentageOfGoal = Math.min((currentProduction / monthlyGoal) * 100, 100);
  const conversionRate = totalDigitized > 0 ? (currentProduction / totalDigitized) * 100 : 0;
  const isGoalReached = currentProduction >= monthlyGoal;

  if (!isClient) return <Card className="h-48 animate-pulse bg-muted" />;

  return (
    <Card className={cn('hover:border-primary/50 transition-all group relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] dark:from-primary/[0.05] dark:to-primary/[0.15] border border-border/50 rounded-xl shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Trophy className={cn("h-5 w-5", isGoalReached ? "text-yellow-500" : "text-primary/60")} />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-primary">Performance do Mês</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">Meta de Contratos Pagos</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1 bg-background p-1 rounded-lg border shadow-sm">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-7 w-24 text-xs border-none focus-visible:ring-0"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
                <Check className="h-3 w-3 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
                <X className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-background/50 backdrop-blur-md rounded-full border border-border/50 text-xs font-bold text-primary">
                Objetivo: {isPrivacyMode ? '•••••' : formatCurrency(monthlyGoal)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background shadow-sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent 
        className={cn("pt-6 cursor-pointer")}
        onClick={onValueClick}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className={cn("text-5xl font-normal tracking-tighter text-primary", isPrivacyMode && "blur-md")}>
                {isPrivacyMode ? '•••••' : formatCurrency(currentProduction)}
              </div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide flex items-center gap-2 mt-2">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                Conversão de <span className="text-foreground">{conversionRate.toFixed(1).replace('.', ',')}%</span> sobre a digitação total.
              </p>
            </div>
            <div className={cn("flex flex-col items-end gap-1 font-bold", isGoalReached ? "text-green-500" : "text-primary")}>
              <div className="text-4xl tabular-nums">
                {percentageOfGoal.toFixed(1)}%
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Concluído</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
                <Progress value={percentageOfGoal} className="h-4 bg-primary/10" />
                <div className="absolute top-0 bottom-0 left-0 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out" style={{ width: `${percentageOfGoal}%` }} />
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              {isGoalReached ? (
                <p className="text-green-500 animate-bounce flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> 🚀 META ATINGIDA! VOCÊ É EXTRAORDINÁRIO!
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Faltam <span className={cn("text-primary", isPrivacyMode && "blur-sm")}>
                    {isPrivacyMode ? '•••••' : formatCurrency(monthlyGoal - currentProduction)}
                  </span> para o objetivo.
                </p>
              )}
              <p className="text-muted-foreground opacity-60">
                Status: <strong>Pago + Saldo Pago</strong>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
