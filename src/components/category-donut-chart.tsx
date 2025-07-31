

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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
    '#8b5cf6',
    '#ec4899',
    '#6b7280',
    '#f97316',
];


export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const defaultCurrency = getDefaultCurrency();
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div className="w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
                 <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-sm font-medium"
                    >
                    Total Expenses
                    </text>
                    <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-2xl font-bold"
                    >
                    {formatCurrency(total)}
                </text>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius="65%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))" />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
