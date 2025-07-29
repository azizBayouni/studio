
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { transactions, wallets, debts as allDebts, type Transaction, getWalletBalance } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { NewTransactionDialog } from '@/components/new-transaction-dialog';
import { getDefaultCurrency } from '@/services/settings-service';
import { MonthlyReportCard } from '@/components/monthly-report-card';
import { TrendingReportCard } from '@/components/trending-report-card';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';
import { isThisMonth, parseISO } from 'date-fns';

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [forceRerender, setForceRerender] = useState(0);

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());

    const handleDataChange = () => {
        // This is a simple way to force a re-render when data changes.
        // In a more complex app, a more robust state management solution would be better.
        setForceRerender(Math.random());
    };

    window.addEventListener('transactionsUpdated', handleDataChange);
    return () => {
        window.removeEventListener('transactionsUpdated', handleDataChange);
    };

  }, []);

  const dashboardData = useMemo(() => {
    const reportableTransactions = transactions.filter(t => !t.excludeFromReport);
    const thisMonthTransactions = reportableTransactions.filter(t => isThisMonth(parseISO(t.date)));

    const updatedWallets = wallets.map(wallet => {
        const hasTransactions = transactions.some(t => t.wallet === wallet.name);
         if (hasTransactions || wallet.name === 'Main Wallet' || wallet.name === 'Credit Card' || wallet.name === 'PayPal') {
            return { ...wallet, balance: getWalletBalance(wallet.name) };
        }
        return wallet;
    })

    const totalBalance = updatedWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const monthlyIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const activePayables = allDebts.filter(d => d.type === 'payable' && d.status === 'unpaid');
    const activeReceivables = allDebts.filter(d => d.type === 'receivable' && d.status === 'unpaid');
    const activeDebtsAmount = activePayables.reduce((sum, d) => sum + d.amount, 0);

    return {
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        activeDebtsAmount,
        activePayablesCount: activePayables.length,
        activeReceivablesCount: activeReceivables.length,
        recentTransactions: reportableTransactions.slice(0, 5),
        totalTransactionsThisMonth: reportableTransactions.length,
    }
  }, [transactions, wallets, allDebts, forceRerender]);

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalBalance)}</div>
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
                <div className="text-2xl font-bold text-accent">+{formatCurrency(dashboardData.monthlyIncome)}</div>
                <p className="text-xs text-muted-foreground">
                  Based on reportable transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month's Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">-{formatCurrency(dashboardData.monthlyExpense)}</div>
                 <p className="text-xs text-muted-foreground">
                   Based on reportable transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Debts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.activeDebtsAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.activePayablesCount} Payable, {dashboardData.activeReceivablesCount} Receivable
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
                  You made {dashboardData.totalTransactionsThisMonth} transactions this month.
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
                    {dashboardData.recentTransactions.map((transaction) => (
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
