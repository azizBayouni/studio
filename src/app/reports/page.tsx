
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
import { useEffect, useState } from 'react';
import { getDefaultCurrency } from '@/services/settings-service';

export default function ReportsPage() {
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
  }, []);
  
  const reportableTransactions = transactions.filter(t => !t.excludeFromReport);

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
        <ReportsFilter />
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
              <CardDescription>The transactions matching your filter criteria.</CardDescription>
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
                      {reportableTransactions.map((transaction) => (
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
                      ))}
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
