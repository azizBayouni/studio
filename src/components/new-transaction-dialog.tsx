
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { categories, wallets, currencies } from '@/lib/data';
import { useState, useEffect } from 'react';
import { addTransaction } from '@/services/transaction-service';
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from '@/lib/data';
import { autoCurrencyExchange } from '@/ai/flows/auto-currency-exchange';
import { getDefaultCurrency } from '@/services/settings-service';

interface NewTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransactionDialog({
  isOpen,
  onOpenChange,
}: NewTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attachments, setAttachments] = useState<File[]>([]);
  const [transactionCurrency, setTransactionCurrency] = useState(getDefaultCurrency());
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setCategory('');
    setWallet('');
    setDate(new Date());
    setAttachments([]);
    setTransactionCurrency(getDefaultCurrency());
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, getDefaultCurrency()]);

  const handleCurrencyChange = async (newCurrency: string) => {
    const originalAmount = Number(amount);
    const fromCurrency = newCurrency;
    const toCurrency = getDefaultCurrency();

    if (!originalAmount || !toCurrency || fromCurrency === toCurrency) {
        setTransactionCurrency(fromCurrency);
        return;
    }

    setIsConverting(true);
    try {
        const result = await autoCurrencyExchange({
            amount: originalAmount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
        });
        
        setAmount(result.convertedAmount);
        setTransactionCurrency(toCurrency);
        
        toast({
            title: "Amount Converted",
            description: `${originalAmount.toFixed(2)} ${fromCurrency} is approximately ${result.convertedAmount.toFixed(2)} ${toCurrency}.`,
        });

    } catch (error) {
        console.error("Currency conversion failed:", error);
        setTransactionCurrency(fromCurrency); // Revert on failure
        toast({
            title: "Conversion Failed",
            description: "Could not convert currency. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsConverting(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultCurrency = getDefaultCurrency();
    if (transactionCurrency !== defaultCurrency) {
        toast({
            title: "Currency Mismatch",
            description: `Please convert the amount to the default currency (${defaultCurrency}) before saving.`,
            variant: "destructive",
        });
        return;
    }

    if (!amount || !category || !wallet || !date) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields.",
            variant: "destructive",
        })
        return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
        amount: Number(amount),
        type,
        description,
        category,
        wallet,
        date: format(date, 'yyyy-MM-dd'),
        currency: defaultCurrency,
        attachments,
    };

    addTransaction(newTransaction);

    toast({
      title: 'Transaction Saved',
      description: 'Your new transaction has been successfully recorded.',
    });

    onOpenChange(false);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderCategoryOptions = () => {
    const parentCategories = categories.filter(c => c.parentId === null);
    const options: JSX.Element[] = [];

    parentCategories.forEach(parent => {
      options.push(
        <SelectItem key={parent.id} value={parent.name} className="font-bold">
          {parent.name}
        </SelectItem>
      );
      const subCategories = categories.filter(c => c.parentId === parent.id);
      subCategories.forEach(sub => {
        options.push(
          <SelectItem key={sub.id} value={sub.name} className="pl-8">
            {sub.name}
          </SelectItem>
        );
      });
    });
    return options;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogDescription>
                Add a new income or expense record.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup value={type} onValueChange={(v) => setType(v as 'income' | 'expense')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Income</Label>
                </div>
                </RadioGroup>
            </div>
             <div className="space-y-2">
                <Label htmlFor="wallet">Wallet</Label>
                <Select value={wallet} onValueChange={setWallet}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                    {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.name}>
                        {wallet.name} ({wallet.currency})
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center gap-2">
                    <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="flex-1" disabled={isConverting} />
                     <Select value={transactionCurrency} onValueChange={handleCurrencyChange} disabled={isConverting}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="e.g. Lunch with friends" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>{renderCategoryOptions()}</SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <Button asChild variant="outline" className="w-full">
                    <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add Attachments
                    </label>
                </Button>
                <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                {attachments.length > 0 && (
                    <div className="space-y-2 pt-2">
                    {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                        <span className="truncate">{file.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                Cancel
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isConverting}>
                {isConverting ? 'Converting...' : 'Save Transaction'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
