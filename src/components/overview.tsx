'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';


const data = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--accent))',
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function Overview() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
              cursor={{fill: 'hsl(var(--muted))'}}
              content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend />
          <Bar dataKey="income" fill="hsl(var(--accent))" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
