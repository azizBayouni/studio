
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { useMemo, useState, useEffect } from 'react';
import { transactions as allTransactions } from '@/lib/data';
import { subMonths, format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { getDefaultCurrency } from '@/services/settings-service';

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
  const [transactions, setTransactions] = useState(allTransactions);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
    const handleDataChange = () => {
      setTransactions([...allTransactions]);
    };
    window.addEventListener('transactionsUpdated', handleDataChange);
    return () => window.removeEventListener('transactionsUpdated', handleDataChange);
  }, []);

  const data = useMemo(() => {
    const reportableTransactions = transactions.filter(t => !t.excludeFromReport);
    const monthlyData: { name: string; income: number; expense: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetMonth = subMonths(now, i);
      const monthStart = startOfMonth(targetMonth);
      const monthEnd = endOfMonth(targetMonth);
      const monthName = format(targetMonth, 'MMM');

      const income = reportableTransactions
        .filter(t => t.type === 'income' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }))
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = reportableTransactions
        .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }))
        .reduce((sum, t) => sum + t.amount, 0);
        
      monthlyData.push({ name: monthName, income, expense });
    }

    return monthlyData;
  }, [transactions]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  }

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
            tickFormatter={(value) => formatCurrency(value as number)}
          />
          <Tooltip
              cursor={{fill: 'hsl(var(--muted))'}}
              content={<ChartTooltipContent indicator="dot" formatter={(value, name) => {
                 const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency }).format(value as number);
                 return (
                     <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{name}</span>
                        <span className="font-bold">{formattedValue}</span>
                     </div>
                 )
              }}/>}
          />
          <Legend />
          <Bar dataKey="income" fill="hsl(var(--accent))" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
