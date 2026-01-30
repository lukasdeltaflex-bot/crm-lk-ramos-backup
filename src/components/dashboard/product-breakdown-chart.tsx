
'use client';

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Proposal } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface ProductBreakdownChartProps {
  proposals: Proposal[]
}

const chartConfig = {
  amount: {
    label: "Volume",
  },
  "Margem": { label: "Margem", color: "hsl(var(--chart-1))" },
  "Portabilidade": { label: "Portabilidade", color: "hsl(var(--chart-2))" },
  "Refin": { label: "Refin", color: "hsl(var(--chart-3))" },
  "Saque Complementar": { label: "Saque", color: "hsl(var(--chart-4))" },
  "Cartão com saque": { label: "Cartão", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export function ProductBreakdownChart({ proposals }: ProductBreakdownChartProps) {
  const chartData = React.useMemo(() => {
    const data: Record<string, number> = {}
    proposals.forEach((p) => {
      const amount = p.grossAmount || 0
      data[p.product] = (data[p.product] || 0) + amount
    })

    const colors = [
      "var(--color-Margem)",
      "var(--color-Portabilidade)",
      "var(--color-Refin)",
      "var(--color-Saque-Complementar)",
      "var(--color-Cartão-com-saque)",
    ]

    return Object.entries(data).map(([name, value], index) => ({
      product: name,
      amount: value,
      fill: colors[index % colors.length] || `hsl(var(--chart-${(index % 5) + 1}))`,
    })).sort((a, b) => b.amount - a.amount)
  }, [proposals])

  const totalVolume = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [chartData])

  if (proposals.length === 0) return null

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Mix de Produtos</CardTitle>
        <CardDescription>Volume financeiro por categoria</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="product"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {chartData.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Produtos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="p-4 pt-0 text-center text-xs text-muted-foreground">
        Total: <strong>{formatCurrency(totalVolume)}</strong>
      </div>
    </Card>
  )
}
