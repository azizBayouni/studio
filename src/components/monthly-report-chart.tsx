
'use client';

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Dot } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { HelpCircle } from 'lucide-react';

const chartData = [
  { date: '01/07', thisMonth: 2200, last3Months: 4500 },
  { date: '05/07', thisMonth: 2800, last3Months: 5000 },
  { date: '10/07', thisMonth: 3500, last3Months: 6000 },
  { date: '15/07', thisMonth: 4200, last3Months: 7500 },
  { date: '20/07', thisMonth: 6000, last3Months: 8500 },
  { date: '25/07', thisMonth: 7800, last3Months: 19000 },
  { date: '30/07', thisMonth: 11000, last3Months: 25000 },
  { date: '31/07', thisMonth: 11969.52, last3Months: 31512.49 },
];

const chartConfig = {
  thisMonth: {
    label: 'This month',
    color: 'hsl(var(--destructive))',
  },
  last3Months: {
    label: 'Previous 3-month average',
    color: 'hsl(var(--foreground))',
  },
} satisfies ChartConfig;


export function MonthlyReportChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: -10,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            tickFormatter={(value, index) => (index === 0 || index === chartData.length -1) ? value : ''}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            tickFormatter={(value) => `${value / 1000}K`}
            domain={[0, 'dataMax + 5000']}
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
            content={({ active, payload, label }) => (
                 active && payload && payload.length ? (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <p className="font-bold text-lg">{payload[1].value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[1].value as number) : 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Previous 3-month average</p>
                </div>
                ) : null
            )}
            
          />
          <defs>
             <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-thisMonth)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--color-thisMonth)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="thisMonth"
            stroke="var(--color-thisMonth)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorThisMonth)"
          />
          <Area
            type="monotone"
            dataKey="last3Months"
            stroke="var(--color-last3Months)"
            strokeWidth={2}
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
       <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground -mt-4">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
                This month
            </div>
            <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                Previous 3-month average
                <HelpCircle className="w-3 h-3" />
            </div>
        </div>
    </ChartContainer>
  );
}
