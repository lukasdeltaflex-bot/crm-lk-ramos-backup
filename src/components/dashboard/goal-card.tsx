
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Pencil, Check, X, Trophy, Sparkles } from 'lucide-react';
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

  if (!isClient) return <Card className="h-40 animate-pulse bg-muted rounded-xl" />;

  return (
    <Card className={cn('hover:shadow-xl transition-all group relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] border border-border/50 rounded-xl shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-8 bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Trophy className={cn("h-5 w-5", isGoalReached ? "text-yellow-500 animate-bounce" : "text-primary/60")} />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-primary">Contratos Pagos (Mês)</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">Objetivo Principal do Período</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-1 bg-background p-1.5 rounded-lg border shadow-sm">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-7 w-24 text-xs border-none focus-visible:ring-0"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-background/60 backdrop-blur-md rounded-full border border-border/50 text-[11px] font-black text-primary shadow-sm">
                Meta: {isPrivacyMode ? '•••••' : formatCurrency(monthlyGoal)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm hover:bg-muted" 
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
        className={cn("pt-4 pb-8 px-8 cursor-pointer")}
        onClick={onValueClick}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className={cn("text-5xl font-normal tracking-tighter text-primary leading-none", isPrivacyMode && "blur-md")}>
                {isPrivacyMode ? '•••••' : formatCurrency(currentProduction)}
              </div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2 mt-3">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Conversão de Esteira: <span className="text-primary font-black">{conversionRate.toFixed(1).replace('.', ',')}%</span>
              </p>
            </div>
            <div className={cn("flex flex-col items-end gap-1 font-bold", isGoalReached ? "text-green-500" : "text-primary")}>
              <div className="text-4xl tabular-nums tracking-tighter">
                {percentageOfGoal.toFixed(1)}%
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Performance</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
                <Progress value={percentageOfGoal} className="h-4 bg-primary/5 rounded-full" />
                <div className="absolute top-0 bottom-0 left-0 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all duration-1000 ease-out rounded-full" style={{ width: `${percentageOfGoal}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                </div>
            </div>
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.15em]">
              {isGoalReached ? (
                <p className="text-green-500 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> META ATINGIDA COM SUCESSO!
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Restam <span className={cn("text-primary", isPrivacyMode && "blur-sm")}>
                    {isPrivacyMode ? '•••••' : formatCurrency(monthlyGoal - currentProduction)}
                  </span> para o objetivo
                </p>
              )}
              <p className="text-muted-foreground opacity-60">Filtro: <span className="text-primary font-black">CONTRATOS PAGOS</span></p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
