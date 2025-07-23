
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactions, categories, wallets as allWallets } from '@/lib/data';
import { useEffect, useState, useMemo } from 'react';
import { getDefaultCurrency } from '@/services/settings-service';
import type { DateRange } from 'react-day-picker';
import { 
  parseISO, isWithinInterval, endOfDay, startOfDay, subDays, 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, 
  subMonths, subYears, lightFormat, subQuarters, startOfQuarter, endOfQuarter, 
  isSameDay, isSameWeek, isSameMonth, isSameQuarter, isSameYear,
  addDays, addWeeks, addMonths, addQuarters, addYears,
  format
} from 'date-fns';
import { ArrowRight, CalendarIcon, HelpCircle, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { Progress } from '@/components/ui/progress';
import { CategoryDonutChart } from '@/components/category-donut-chart';
import { TimeRangePicker } from '@/components/time-range-picker';

export default function ReportsPage() {
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  
  // State for filters
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('week');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);


  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
  }, []);

  const dateRange = useMemo(() => {
    const now = new Date();
    let baseDate: Date;

    switch (timeRange) {
      case 'day':
        baseDate = addDays(now, dateOffset);
        return { from: startOfDay(baseDate), to: endOfDay(baseDate) };
      case 'week':
        baseDate = addWeeks(now, dateOffset);
        return { from: startOfWeek(baseDate), to: endOfWeek(baseDate) };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case 'quarter':
        baseDate = addQuarters(now, dateOffset);
        return { from: startOfQuarter(baseDate), to: endOfQuarter(baseDate) };
      case 'year':
        baseDate = addYears(now, dateOffset);
        return { from: startOfYear(baseDate), to: endOfYear(baseDate) };
      case 'all':
        return { from: undefined, to: undefined };
      case 'custom':
        return customDateRange;
      case 'this-month':
      default:
         baseDate = addMonths(now, dateOffset);
        return { from: startOfMonth(baseDate), to: endOfMonth(baseDate) };
    }
  }, [timeRange, customDateRange, dateOffset]);
  
  const reportableTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.excludeFromReport) return false;

      const walletFilterMatch = selectedWallets.length === 0 || selectedWallets.includes(t.wallet);
      
      const dateFilterMatch = !dateRange || !dateRange.from || isWithinInterval(
          parseISO(t.date), 
          { start: dateRange.from, end: endOfDay(dateRange.to || dateRange.from) }
      );
      
      return walletFilterMatch && dateFilterMatch;
    });
  }, [selectedWallets, dateRange]);

  const summary = useMemo(() => {
    const totalIncome = reportableTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = reportableTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpense;
    
    // Simplified balance calculation
    const allTransactionsBeforeRange = transactions.filter(t => 
        dateRange?.from && parseISO(t.date) < startOfDay(dateRange.from)
    );
    const openingBalance = allTransactionsBeforeRange.reduce((bal, t) => bal + (t.type === 'income' ? t.amount : -t.amount), 0);
    const endingBalance = openingBalance + netIncome;


    return { totalIncome, totalExpense, netIncome, openingBalance, endingBalance };
  }, [reportableTransactions, dateRange]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency,
      signDisplay: 'never',
    }).format(Math.abs(amount));
  };
  
  const getSign = (amount: number) => (amount < 0 ? '-' : '');

  const walletOptions: MultiSelectOption[] = allWallets.map((w) => ({
    value: w.name,
    label: w.name,
  }));

  const expenseByCategory = useMemo(() => {
    const expenses = reportableTransactions.filter(t => t.type === 'expense');
    const byCategory = expenses.reduce((acc, curr) => {
        const parentCategoryName = categories.find(c => c.name === curr.category)?.parentId 
            ? categories.find(p => p.id === categories.find(c => c.name === curr.category)?.parentId)?.name
            : curr.category;
        
        if (parentCategoryName) {
            acc[parentCategoryName] = (acc[parentCategoryName] || 0) + curr.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory).map(([name, value]) => ({
      name,
      value
    }));
  }, [reportableTransactions]);
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setDateOffset(0); // Reset offset when range type changes
  };

  const getDateRangeLabel = () => {
    if (!dateRange || !dateRange.from) return 'All Time';

    const now = new Date();
    const from = dateRange.from;

    if (timeRange === 'day') {
        if (isSameDay(now, from)) return 'Today';
        if (isSameDay(subDays(now, 1), from)) return 'Yesterday';
    }
    if (timeRange === 'week') {
        if (isSameWeek(now, from, { weekStartsOn: 1 })) return 'This Week';
        if (isSameWeek(subDays(now, 7), from, { weekStartsOn: 1 })) return 'Last Week';
    }
    if (timeRange === 'this-month') {
        if (isSameMonth(now, from)) return 'This Month';
        if (isSameMonth(subMonths(now, 1), from)) return 'Last Month';
    }
     if (timeRange === 'quarter') {
        if (isSameQuarter(now, from)) return 'This Quarter';
        if (isSameQuarter(subQuarters(now, 1), from)) return 'Last Quarter';
    }
    if (timeRange === 'year') {
        if (isSameYear(now, from)) return 'This Year';
        if (isSameYear(subYears(now, 1), from)) return 'Last Year';
    }

    if (dateRange.to && !isSameDay(dateRange.from, dateRange.to)) {
        return `${format(dateRange.from, 'dd MMM yy')} - ${format(dateRange.to, 'dd MMM yy')}`;
    }
    return format(dateRange.from, 'dd MMM yyyy');
  };
  
  const canNavigate = useMemo(() => {
    return !['all', 'custom', 'last-month'].includes(timeRange);
  }, [timeRange]);

  return (
    <>
    <div className="flex-1 space-y-4 p-4 md:p-6">
       <header className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">Balance</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsPickerOpen(true)}>
                <CalendarIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold">
                {getSign(summary.endingBalance)}{formatCurrency(summary.endingBalance)}
            </p>
          </div>
           <MultiSelect
                options={walletOptions}
                selected={selectedWallets}
                onChange={setSelectedWallets}
                className="w-auto"
                placeholder={
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Total</span>
                    </div>
                }
            />
       </header>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <Button variant="ghost" size="icon" onClick={() => setDateOffset(d => d - 1)} disabled={!canNavigate}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center font-semibold text-foreground">
          {getDateRangeLabel()}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setDateOffset(d => d + 1)} disabled={!canNavigate}>
            <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Opening balance</span>
            <span>{getSign(summary.openingBalance)}{formatCurrency(summary.openingBalance)}</span>
        </div>
         <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ending balance</span>
            <span>{getSign(summary.endingBalance)}{formatCurrency(summary.endingBalance)}</span>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">Net Income <HelpCircle className="h-4 w-4 text-muted-foreground"/></CardTitle>
            <Button variant="link" className="text-sm">See details</Button>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{getSign(summary.netIncome)}{formatCurrency(summary.netIncome)}</p>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Income</span>
                <span>{formatCurrency(summary.totalIncome)}</span>
            </div>
             <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Expense</span>
                <span>{formatCurrency(summary.totalExpense)}</span>
            </div>
            <Progress value={summary.totalIncome + summary.totalExpense > 0 ? (summary.totalExpense / (summary.totalIncome + summary.totalExpense)) * 100 : 0} className="mt-2 h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium">Category Report</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground">Income</p>
                            <p className="font-semibold">{formatCurrency(summary.totalIncome)}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground">Expense</p>
                            <p className="font-semibold text-destructive">{formatCurrency(summary.totalExpense)}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Card>
            </div>
            {expenseByCategory.length > 0 && (
                <div className="mt-4">
                    <CategoryDonutChart data={expenseByCategory} />
                </div>
            )}
        </CardContent>
      </Card>
    </div>
    <TimeRangePicker 
      isOpen={isPickerOpen} 
      onOpenChange={setIsPickerOpen}
      value={timeRange}
      onChange={handleTimeRangeChange}
      onCustomDateChange={setCustomDateRange}
    />
    </>
  );
}
