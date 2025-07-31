

'use client';

import { useMemo } from 'react';
import { getDefaultCurrency } from '@/services/settings-service';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface CategoryExpenseListProps {
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

export function CategoryExpenseList({ data }: CategoryExpenseListProps) {
  const defaultCurrency = getDefaultCurrency();
  const searchParams = useSearchParams();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency,
    }).format(value);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);
  
  const buildCategoryLink = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    return `/reports/${encodeURIComponent(categoryName)}?${params.toString()}`;
  }

  return (
    <div className="space-y-1">
      {sortedData.map((item, index) => (
        <Link key={item.name} href={buildCategoryLink(item.name)}>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                 <span className="text-xl flex h-8 w-8 items-center justify-center bg-muted rounded-full" style={{ color: COLORS[index % COLORS.length] }}>{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-destructive">
                    {formatCurrency(item.value)}
                 </span>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
        </Link>
      ))}
    </div>
  );
}
