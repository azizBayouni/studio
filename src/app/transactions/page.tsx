
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { transactions, categories, wallets, type Transaction } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Paperclip } from 'lucide-react';
import { NewTransactionDialog } from '@/components/new-transaction-dialog';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';
import { getDefaultCurrency } from '@/services/settings-service';
import { MultiSelect } from '@/components/ui/multi-select';

export default function TransactionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [walletFilter, setWalletFilter] = useState('all');

  // This effect ensures the component re-renders when the currency changes.
  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
  }, []);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
        const searchLower = searchQuery.toLowerCase();
        const descriptionMatch = transaction.description?.toLowerCase().includes(searchLower) || false;
        const categoryMatch = transaction.category.toLowerCase().includes(searchLower);
        const searchMatches = descriptionMatch || categoryMatch;

        const categoryFilterMatch = selectedCategories.length === 0 || selectedCategories.includes(transaction.category);
        const walletFilterMatch = walletFilter === 'all' || transaction.wallet === walletFilter;

        return searchMatches && categoryFilterMatch && walletFilterMatch;
    });
  }, [searchQuery, selectedCategories, walletFilter]);

  const categoryOptions = categories.map(c => ({ value: c.name, label: c.name }));

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground">
              Here's a list of all your transactions.
            </p>
          </div>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="Search by description or category..." className="max-w-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <MultiSelect
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                className="md:w-[250px]"
                placeholder="Filter by category"
              />
              <Select value={walletFilter} onValueChange={setWalletFilter}>
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue placeholder="Filter by wallet" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Wallets</SelectItem>
                  {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.name}>{wallet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} onClick={() => handleRowClick(transaction)} className="cursor-pointer">
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                      {transaction.description}
                      {transaction.attachments && transaction.attachments.length > 0 && (
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{transaction.wallet}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : ''}`}>
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
