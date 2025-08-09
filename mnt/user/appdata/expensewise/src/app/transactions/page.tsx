

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
import { transactions as allTransactions, categories, wallets, events, type Transaction } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Paperclip, Calendar as CalendarIcon } from 'lucide-react';
import { NewTransactionDialog } from '@/components/new-transaction-dialog';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';
import { getDefaultCurrency } from '@/services/settings-service';
import { MultiSelect } from '@/components/ui/multi-select';
import { DateRange } from 'react-day-picker';
import {
  parseISO,
  isWithinInterval,
  format,
  endOfDay,
} from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(allTransactions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [walletFilter, setWalletFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());

    const handleTransactionsUpdate = () => {
      setTransactions([...allTransactions]);
    };

    window.addEventListener('transactionsUpdated', handleTransactionsUpdate);

    return () => {
      window.removeEventListener('transactionsUpdated', handleTransactionsUpdate);
    };
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

        const dateFilterMatch = !dateRange || !dateRange.from || isWithinInterval(parseISO(transaction.date), { start: dateRange.from, end: endOfDay(dateRange.to || dateRange.from) });

        return searchMatches && categoryFilterMatch && walletFilterMatch && dateFilterMatch;
    });
  }, [searchQuery, selectedCategories, walletFilter, dateRange, transactions]);

  const categoryOptions = categories.map(c => ({ value: c.name, label: c.name }));
  const getEventName = (eventId?: string) => {
    if (!eventId) return '-';
    return events.find(e => e.id === eventId)?.name || '-';
  };
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
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
          <div className="flex flex-col lg:flex-row gap-2">
              <Input placeholder="Search by description or category..." className="w-full lg:max-w-xs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto flex-1">
                <MultiSelect
                  options={categoryOptions}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  className="w-full"
                  placeholder="Filter by category"
                />
                <Select value={walletFilter} onValueChange={setWalletFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wallets</SelectItem>
                    {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.name}>{wallet.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Wallet</TableHead>
                  <TableHead className="hidden lg:table-cell">Event</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} onClick={() => handleRowClick(transaction)} className="cursor-pointer">
                    <TableCell className="hidden sm:table-cell">{format(parseISO(transaction.date), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                          {transaction.description || transaction.category}
                          {transaction.attachments && transaction.attachments.length > 0 && (
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground sm:hidden">
                            {format(parseISO(transaction.date), 'dd MMM')} - {transaction.wallet}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{transaction.wallet}</TableCell>
                    <TableCell className="hidden lg:table-cell">{getEventName(transaction.eventId)}</TableCell>
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
