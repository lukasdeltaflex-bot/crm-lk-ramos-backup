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
  className?: string;
  valueClassName?: string;
}

export function StatsCard({ title, value, icon: Icon, className, valueClassName }: StatsCardProps) {
  return (
    <Card className={cn('hover:border-primary/50 transition-colors', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 print:pb-1">
        <CardTitle className="text-sm font-medium print:text-xs">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="print:pt-1">
        <div className={cn("text-2xl font-bold print:text-lg", valueClassName)}>{value}</div>
      </CardContent>
    </Card>
  );
}
