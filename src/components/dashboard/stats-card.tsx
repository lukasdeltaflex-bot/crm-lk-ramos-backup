'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  subValue?: string;
  percentage?: number;
  className?: string;
  valueClassName?: string;
  sparklineData?: number[];
  isHot?: boolean;
  isCritical?: boolean;
  topContributor?: string;
}

/**
 * StatsCard Premium Executivo V36
 * Aura de fundo realçada (12% opacidade) e bordas nítidas (50% opacidade).
 * Sincronização 100% com o Laboratório de Cores.
 */
export function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    subValue,
    percentage, 
    className, 
    valueClassName,
    sparklineData = [],
    isHot = false,
    isCritical = false,
    topContributor
}: StatsCardProps) {
  const { statusColors } = useTheme();
  
  const getThemeStyles = () => {
    const t = title.toLowerCase();

    // Prioridade 1: Cores Dinâmicas do Laboratório de Status
    const customColor = statusColors[title];
    if (customColor) {
        return {
            card: '',
            text: '', 
            stroke: `hsl(${customColor})`,
            style: { 
                borderColor: `hsla(${customColor}, 0.5)`, // Borda mais definida
                backgroundColor: `hsla(${customColor}, 0.12)`, // Fundo mais visível
                color: `hsl(${customColor})`,
                '--status-color': customColor 
            } as any
        };
    }

    if (isCritical) 
        return {
            card: 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse',
            text: 'text-red-600 dark:text-red-400',
            stroke: '#dc2626'
        };

    // TEMAS NEUTROS
    if (t === 'total digitado' || t === 'produção digitada' || t === 'total de comissões')
        return {
            card: 'border-zinc-300 dark:border-zinc-500/40 bg-zinc-100/50 dark:bg-zinc-900/40',
            text: 'text-zinc-700 dark:text-zinc-100',
            stroke: '#a1a1aa'
        };
    
    if (t.includes('andamento') || t.includes('esperada')) 
        return {
            card: 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10',
            text: 'text-yellow-700 dark:text-yellow-500',
            stroke: '#d97706'
        };

    if (t.includes('saldo pago') || t.includes('saldo a receber')) 
        return {
            card: 'border-orange-400 bg-orange-50/50 dark:bg-orange-900/10',
            text: 'text-orange-700 dark:text-orange-400',
            stroke: '#ea580c'
        };

    if (t.includes('performance') || t.includes('recebida') || t.includes('paga') || t.includes('pago')) 
        return {
            card: 'border-green-400 bg-green-50/50 dark:bg-green-900/10',
            text: 'text-green-700 dark:text-green-400',
            stroke: '#16a34a'
        };
    
    if (t.includes('aguardando')) 
        return {
            card: 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10',
            text: 'text-blue-700 dark:text-blue-400',
            stroke: '#2563eb'
        };
    
    if (t.includes('pendente')) 
        return {
            card: 'border-purple-400 bg-purple-50/50 dark:bg-purple-900/10',
            text: 'text-purple-700 dark:text-purple-400',
            stroke: '#9333ea'
        };
    
    if (t.includes('reprovado')) 
        return {
            card: 'border-red-400 bg-red-50/50 dark:bg-red-900/10',
            text: 'text-red-700 dark:text-red-400',
            stroke: '#dc2626'
        };

    return { 
        card: 'border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/10', 
        text: 'text-slate-700 dark:text-slate-300',
        stroke: '#475569'
    };
  };

  const theme = getThemeStyles();

  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const max = Math.max(...sparklineData, 1);
    const width = 70;
    const height = 22;
    const points = sparklineData.map((v, i) => {
        const x = (i / (sparklineData.length - 1)) * width;
        const y = height - (v / max) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="opacity-60">
            <polyline
                fill="none"
                stroke={theme.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
  };

  return (
    <Card 
        className={cn(
            'hover:shadow-lg transition-all group relative overflow-hidden rounded-xl h-full flex flex-col border-2 py-3.5 px-5', 
            theme.card,
            isHot && 'ring-2 ring-orange-500 ring-offset-2',
            className
        )}
        style={theme.style}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-1.5">
        <div className="flex flex-col gap-0.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.1em] transition-colors" style={{ color: theme.style?.color || 'inherit' }}>
                {title}
            </CardTitle>
            {isCritical ? (
                <div className="flex items-center gap-1 text-[8px] font-bold text-red-600 animate-bounce">
                    <AlertTriangle className="h-2.5 w-2.5 fill-current" /> PENDÊNCIA
                </div>
            ) : isHot && (
                <div className="flex items-center gap-1 text-[8px] font-bold text-orange-600 animate-pulse">
                    <Zap className="h-2.5 w-2.5 fill-current" /> EM ALTA
                </div>
            )}
        </div>
        <div className="flex items-center gap-2">
            {renderSparkline()}
            <Icon className={cn("h-4 w-4 opacity-80", theme.text)} style={{ color: theme.style?.color || 'inherit' }} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-0">
        <div className="flex items-baseline justify-between gap-2">
            <div className={cn("text-2xl sm:text-3xl font-light tracking-tighter", theme.text, valueClassName)} style={{ color: theme.style?.color || 'inherit' }}>
                {value}
            </div>
            {percentage !== undefined && (
                <div className="text-[10px] font-bold bg-background/60 px-2 py-0.5 rounded border border-border/30 text-primary">
                    {percentage.toFixed(1).replace('.', ',')}%
                </div>
            )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-border/10 flex items-center justify-between">
            <div className="flex flex-col">
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-tighter">
                    {description}
                </p>
                {subValue && (
                    <p className="text-[9px] font-black opacity-80 uppercase tracking-tighter mt-0.5">
                        {subValue}
                    </p>
                )}
            </div>
            {topContributor && (
                <p className="text-[9px] font-bold truncate max-w-[100px]" style={{ color: theme.style?.color || 'inherit' }}>
                    {topContributor.split(' ')[0]}
                </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}