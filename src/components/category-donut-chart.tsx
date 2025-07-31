
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { useMemo } from 'react';
import { getDefaultCurrency } from '@/services/settings-service';

interface CategoryDonutChartProps {
    data: { name: string; value: number }[];
}

const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
];


export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const defaultCurrency = getDefaultCurrency();
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const chartConfig = useMemo(() => data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig), [data]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div className="w-full h-64 flex items-center">
        <ChartContainer config={chartConfig} className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                <div className="rounded-lg border bg-background p-2.5 text-sm shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {payload[0].name}
                                            </span>
                                            <span className="font-bold text-foreground">
                                                {formatCurrency(payload[0].value as number)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                )
                            }
                            return null
                        }}
                    />
                     <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-sm font-medium"
                      >
                       Total
                      </text>
                      <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-lg font-bold"
                      >
                       {formatCurrency(total)}
                      </text>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
       </ChartContainer>
       <div className="w-1/2 flex flex-col gap-2 text-sm">
            {data.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                    <div className="ml-auto text-right">
                      <span className="font-medium">{formatCurrency(entry.value)}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
}
