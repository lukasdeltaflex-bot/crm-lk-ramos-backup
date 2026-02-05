'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { Proposal } from '@/lib/types';
import { useMemo } from 'react';

interface OperatorPerformanceChartProps {
  proposals: Proposal[];
}

export function OperatorPerformanceChart({ proposals }: OperatorPerformanceChartProps) {
  const data = useMemo(() => {
    const operatorData: Record<string, { total: number; paid: number; count: number }> = {};

    proposals.forEach(p => {
      const operator = p.operator || 'Sem Operador';
      if (!operatorData[operator]) {
        operatorData[operator] = { total: 0, paid: 0, count: 0 };
      }
      
      const amount = p.commissionBase === 'net' ? (p.netAmount || 0) : (p.grossAmount || 0);
      operatorData[operator].total += amount;
      operatorData[operator].count += 1;
      
      if (p.status === 'Pago' || p.status === 'Saldo Pago') {
        operatorData[operator].paid += amount;
      }
    });

    return Object.entries(operatorData)
      .map(([name, stats]) => ({
        name,
        total: stats.total,
        paid: stats.paid,
        conversion: stats.total > 0 ? (stats.paid / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.paid - a.paid);
  }, [proposals]);

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance por Operador</CardTitle>
        <CardDescription>Volume total pago vs volume digitado por colaborador</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number" 
                hide 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={180} 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.length > 30 ? `${value.substring(0, 30)}...` : value}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                formatter={(value: number) => [formatCurrency(value), 'Volume']}
                contentStyle={{ 
                  borderRadius: 'var(--radius)',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))' 
                }}
              />
              <Bar 
                dataKey="total" 
                name="Total Digitado" 
                fill="hsl(var(--muted))" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
              <Bar 
                dataKey="paid" 
                name="Total Pago" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
