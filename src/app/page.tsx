
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Wallet, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { Overview } from '@/components/overview';
import { transactions, type Transaction } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { NewTransactionDialog } from '@/components/new-transaction-dialog';
import { getDefaultCurrency } from '@/services/settings-service';
import { MonthlyReportCard } from '@/components/monthly-report-card';
import { TrendingReportCard } from '@/components/trending-report-card';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
  }, []);

  const reportableTransactions = transactions.filter(t => !t.excludeFromReport);
  const recentTransactions = reportableTransactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: defaultCurrency,
    }).format(amount);
  };

  const formatTransactionAmount = (amount: number, currency: string) => {
     return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              An overview of your financial status.
            </p>
          </div>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> New Transaction
              </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(45231.89)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all wallets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month's Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">+{formatCurrency(2350.00)}</div>
                <p className="text-xs text-muted-foreground">
                  +18.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month's Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">-{formatCurrency(4210.50)}</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Debts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(1200.00)}</div>
                <p className="text-xs text-muted-foreground">
                  3 Payable, 1 Receivable
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
             <div className="col-span-full grid gap-4 lg:grid-cols-2">
                <MonthlyReportCard />
                <TrendingReportCard />
            </div>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You made {reportableTransactions.length} transactions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                       <TableRow key={transaction.id} onClick={() => handleRowClick(transaction)} className="cursor-pointer">
                         <TableCell>
                           <div className="font-medium">{transaction.category}</div>
                           <div className="hidden text-sm text-muted-foreground md:inline">{transaction.description}</div>
                         </TableCell>
                         <TableCell>{transaction.wallet}</TableCell>
                         <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                            {transaction.type === 'income' ? '+' : ''}{formatTransactionAmount(transaction.amount, transaction.currency)}
                         </TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <NewTransactionDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <EditTransactionDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        transaction={selectedTransaction}
      />
    </>
  );
}
