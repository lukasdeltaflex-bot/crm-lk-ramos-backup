import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  percentage?: number;
  className?: string;
  valueClassName?: string;
}

/**
 * StatsCard com visual premium LK RAMOS.
 */
export function StatsCard({ title, value, icon: Icon, description, percentage, className, valueClassName }: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden border border-border/50 bg-card shadow-md rounded-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 print:pb-1">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors print:text-[8px]">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Icon className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="print:pt-1">
        <div className="flex items-baseline justify-between gap-2">
            <div className={cn("text-2xl font-normal tracking-tight text-foreground print:text-lg", valueClassName)}>{value}</div>
            {percentage !== undefined && (
                <div className="text-[10px] font-bold bg-background dark:bg-black/40 px-2.5 py-1 rounded-full border border-border/50 shadow-sm text-primary">
                    {percentage.toFixed(1).replace('.', ',')}%
                </div>
            )}
        </div>
        {description && <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter opacity-60 border-t pt-2 border-border/30">{description}</p>}
      </CardContent>
    </Card>
  );
}
