import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  valueClassName?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, description, className, valueClassName, trend }: StatsCardProps) {
  return (
    <Card className={cn('hover:border-primary/50 transition-colors group relative overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 print:pb-1">
        <CardTitle className="text-sm font-medium print:text-xs">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent className="print:pt-1">
        <div className={cn("text-2xl font-bold print:text-lg", valueClassName)}>{value}</div>
        
        <div className="flex flex-col gap-1 mt-1">
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight",
              trend.value === 0 ? "text-muted-foreground" : trend.isPositive ? "text-green-500" : "text-destructive"
            )}>
              {trend.value === 0 ? (
                <Minus className="h-3 w-3" />
              ) : trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value === 0 ? 'Sem alteração' : `${trend.value}%`}
              <span className="text-muted-foreground font-normal lowercase">{trend.label}</span>
            </div>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
