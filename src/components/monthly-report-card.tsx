
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MonthlyReportChart } from './monthly-report-chart';
import { useState, useEffect, useMemo } from 'react';
import { transactions as allTransactions, Transaction } from '@/lib/data';
import { isThisMonth, parseISO } from 'date-fns';
import { getDefaultCurrency } from '@/services/settings-service';

export function MonthlyReportCard() {
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

    const monthlyData = useMemo(() => {
        const reportableTransactions = transactions.filter(t => !t.excludeFromReport);
        const thisMonthTransactions = reportableTransactions.filter(t => isThisMonth(parseISO(t.date)));

        const totalSpent = thisMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = thisMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalSpent, totalIncome, transactions: thisMonthTransactions };
    }, [transactions]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCurrency }).format(amount);
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Report this month</CardTitle>
          <Link href="/reports" className="text-sm font-medium text-accent hover:underline">
            See reports
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total spent</p>
            <p className="text-2xl font-bold text-destructive">
                {formatCurrency(monthlyData.totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total income</p>
            <p className="text-2xl font-bold text-accent">
              {formatCurrency(monthlyData.totalIncome)}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="h-48">
            <MonthlyReportChart data={monthlyData.transactions} />
        </div>
      </CardContent>
    </Card>
  );
}
