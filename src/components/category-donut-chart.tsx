

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface CategoryDonutChartProps {
    data: { name: string; value: number; icon: string }[];
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

const RADIAN = Math.PI / 180;
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;

  return (
    <g>
        {/* Line from pie to label */}
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="hsl(var(--muted-foreground))" fill="none" />
        {/* Icon */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey - 10} textAnchor="middle" dominantBaseline="central" fontSize="24">
            {payload.icon}
        </text>
        {/* Percentage */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 10} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    </g>
  );
};


export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return (
    <div className="w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                 <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-2xl font-bold"
                    >
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total)}
                </text>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={<CustomLabel />}
                    innerRadius="60%"
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
