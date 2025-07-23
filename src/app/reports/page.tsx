
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Overview } from '@/components/overview';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { transactions } from '@/lib/data';
import { ReportsFilter } from '@/components/reports-filter';
import { useEffect, useState, useMemo } from 'react';
import { getDefaultCurrency } from '@/services/settings-service';
import type { DateRange } from 'react-day-picker';
import { parseISO, isWithinInterval, endOfDay, startOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter } from 'date-fns';
import { ReportsSummaryCard } from '@/components/reports-summary-card';

export default function ReportsPage() {
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
  }, []);

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return { from: startOfDay(now), to: endOfDay(now) };
      case 'week':
        return { from: startOfWeek(now), to: endOfWeek(now) };
      case 'month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'quarter':
        return { from: startOfQuarter(now), to: endOfQuarter(now) };
      case 'year':
        return { from: startOfYear(now), to: endOfYear(now) };
      case 'custom':
        return customDateRange;
      case 'all':
      default:
        return undefined;
    }
  }, [timeRange, customDateRange]);
  
  const reportableTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.excludeFromReport) return false;

      const categoryFilterMatch = selectedCategories.length === 0 || selectedCategories.includes(t.category);
      const walletFilterMatch = selectedWallets.length === 0 || selectedWallets.includes(t.wallet);
      const dateFilterMatch = !dateRange || !dateRange.from || isWithinInterval(parseISO(t.date), { start: dateRange.from, end: endOfDay(dateRange.to || dateRange.from) });
      
      return categoryFilterMatch && walletFilterMatch && dateFilterMatch;
    });
  }, [selectedCategories, selectedWallets, dateRange]);

  const summary = useMemo(() => {
    const totalIncome = reportableTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = reportableTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpense;
    
    // Note: Opening and Ending balance calculations are simplified for this mock.
    // A real implementation would require historical data.
    const endingBalance = transactions.reduce((bal, t) => bal + (t.type === 'income' ? t.amount : -t.amount), 0);
    const openingBalance = endingBalance - netIncome;


    return { totalIncome, totalExpense, netIncome, openingBalance, endingBalance };
  }, [reportableTransactions]);


  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Analyze your financial data with detailed reports.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <ReportsFilter 
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={setSelectedCategories}
          selectedWallets={selectedWallets}
          onSelectedWalletsChange={setSelectedWallets}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
        
        <Card>
            <CardHeader>
                <CardTitle>Balance</CardTitle>
                <CardDescription>
                    Summary of your financial status for the selected period.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-destructive">{formatCurrency(summary.endingBalance, defaultCurrency)}</div>
            </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportsSummaryCard title="Opening Balance" amount={summary.openingBalance} currency={defaultCurrency} />
            <ReportsSummaryCard title="Ending Balance" amount={summary.endingBalance} currency={defaultCurrency} />
            <ReportsSummaryCard title="Net Income" amount={summary.netIncome} currency={defaultCurrency} />
        </div>
         <div className="grid gap-4 md:grid-cols-2">
            <ReportsSummaryCard title="Total Income" amount={summary.totalIncome} currency={defaultCurrency} type="income" />
            <ReportsSummaryCard title="Total Expense" amount={summary.totalExpense} currency={defaultCurrency} type="expense" />
        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>A visual breakdown of your spending based on the selected filters.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Filtered Transactions</CardTitle>
               <CardDescription>
                Showing {reportableTransactions.length} transaction(s) matching your criteria.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportableTransactions.length > 0 ? (
                        reportableTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="font-medium">{transaction.category}</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">{transaction.description}</div>
                            </TableCell>
                            <TableCell>{transaction.wallet}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
