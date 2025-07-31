

'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { transactions as allTransactions, categories, type Category } from '@/lib/data';
import { getDefaultCurrency } from '@/services/settings-service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { isWithinInterval, parseISO, differenceInDays, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function CategoryReportDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDefaultCurrency(getDefaultCurrency());
  }, []);

  const { category: categoryName } = params;
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  
  const dateRange = useMemo(() => {
    try {
      if (from && to) {
        return { from: parseISO(from), to: parseISO(to) };
      }
    } catch(e) { console.error("Invalid date params"); }
    return { from: null, to: null };
  }, [from, to]);
  

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const dateFilterMatch = !dateRange.from || !dateRange.to || isWithinInterval(
        parseISO(t.date),
        { start: startOfDay(dateRange.from), end: endOfDay(dateRange.to) }
      );
      if (!dateFilterMatch) return false;
      if (t.type !== 'expense') return false;
      
      const decodedCategoryName = decodeURIComponent(categoryName as string);
      
      if (decodedCategoryName === 'all-expense') return true;

      // Find the category and its children
      const topLevelCategory = categories.find(c => c.name === decodedCategoryName && c.parentId === null);
      if (!topLevelCategory) {
        // Handle case where the clicked category might be a sub-category - find its top-level parent
         const subCategory = categories.find(c => c.name === decodedCategoryName);
         if (!subCategory) return false;
         
         const parentCategory = categories.find(p => p.id === subCategory.parentId);
         return parentCategory?.name === t.category || subCategory.name === t.category;
      }
      
      const childCategories = categories.filter(c => c.parentId === topLevelCategory.id).map(c => c.name);
      return t.category === topLevelCategory.name || childCategories.includes(t.category);
    });
  }, [categoryName, dateRange]);
  
  const totalExpense = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);
  
  const dailyAverage = useMemo(() => {
    if (!dateRange.from || !dateRange.to || totalExpense === 0) return 0;
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    return totalExpense / days;
  }, [dateRange, totalExpense]);

  const expensesBySubCategory = useMemo(() => {
    const breakdown: Record<string, { value: number, icon?: string }> = {};

    const decodedCategoryName = decodeURIComponent(categoryName as string);
    const topLevelCat = categories.find(c => c.name === decodedCategoryName);
    const relevantCategories = categories.filter(c => c.parentId === topLevelCat?.id);

    // Initialize all sub-categories
    relevantCategories.forEach(cat => {
        breakdown[cat.name] = { value: 0, icon: cat.icon };
    });

    filteredTransactions.forEach(t => {
      // Ensure the category exists in the breakdown
      if (breakdown[t.category] === undefined) {
          const categoryDetails = categories.find(c => c.name === t.category);
          breakdown[t.category] = { value: 0, icon: categoryDetails?.icon };
      }
       breakdown[t.category].value += t.amount;
    });
    
    return Object.entries(breakdown)
      .map(([name, data]) => ({ name, ...data }))
      .filter(item => item.value > 0)
      .sort((a,b) => b.value - a.value);

  }, [filteredTransactions, categoryName]);

  const formatCurrency = (value: number) => {
    if (!defaultCurrency) return '...';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency }).format(value);
  }

  if (!isClient) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }
  
  const decodedCategoryName = decodeURIComponent(categoryName as string);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
       <header className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Expense Details</h2>
       </header>

        <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(totalExpense)}</p>
            </Card>
             <Card className="p-4">
                <p className="text-sm text-muted-foreground">Daily average</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(dailyAverage)}</p>
            </Card>
        </div>

       <div>
        <h3 className="text-md font-semibold mb-2 mt-4">{decodedCategoryName === 'all-expense' ? 'All Expenses' : `Breakdown for ${decodedCategoryName}`}</h3>
        <div className="space-y-4">
            {expensesBySubCategory.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon || '💸'}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                    </div>
                    <Progress value={(item.value / totalExpense) * 100} className="h-2" />
                </div>
            ))}
        </div>
       </div>

    </div>
  );
}
