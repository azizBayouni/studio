
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { CalendarIcon, Download, Paperclip, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { categories, wallets } from '@/lib/data';
import { useState, useEffect } from 'react';
import { updateTransaction, deleteTransaction } from '@/services/transaction-service';
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from '@/lib/data';

interface EditTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function EditTransactionDialog({
  isOpen,
  onOpenChange,
  transaction
}: EditTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount);
      setDescription(transaction.description);
      setCategory(transaction.category);
      setWallet(transaction.wallet);
      setDate(parseISO(transaction.date));
      setAttachments(transaction.attachments || []);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !wallet || !date) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields.",
            variant: "destructive",
        })
        return;
    }

    const updatedTransaction: Transaction = {
        ...transaction,
        amount: Number(amount),
        type,
        description,
        category,
        wallet,
        date: format(date, 'yyyy-MM-dd'),
        currency: wallets.find(w => w.name === wallet)?.currency || 'USD',
        attachments,
    };

    updateTransaction(updatedTransaction);

    toast({
      title: 'Transaction Updated',
      description: 'Your transaction has been successfully updated.',
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (transaction) {
        deleteTransaction(transaction.id);
        toast({
            title: 'Transaction Deleted',
            description: 'The transaction has been successfully deleted.',
            variant: 'destructive'
        });
        onOpenChange(false);
    }
  }


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

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const selectedWalletCurrency = wallets.find(w => w.name === wallet)?.currency;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
                Update the details of your transaction.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup value={type} onValueChange={(v) => setType(v as 'income' | 'expense')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="edit-expense" />
                    <Label htmlFor="edit-expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="edit-income" />
                    <Label htmlFor="edit-income">Income</Label>
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
                        {wallet.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                 <div className="flex items-center gap-2">
                    <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} required className="flex-1"/>
                    <span className="flex items-center justify-center w-16 h-10 text-sm text-muted-foreground bg-muted rounded-md">{selectedWalletCurrency || '...'}</span>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="e.g. Lunch with friends" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                    <label htmlFor="edit-file-upload" className="cursor-pointer">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add Attachments
                    </label>
                </Button>
                <Input id="edit-file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                {attachments.length > 0 && (
                    <div className="space-y-2 pt-2">
                    {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                            <a 
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(file);
                                }}
                                className="truncate flex items-center gap-2 hover:underline"
                            >
                                <Download className="h-4 w-4"/>
                                {file.name}
                            </a>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            <DialogFooter className="sm:justify-between">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this
                            transaction from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save Changes</Button>
                </div>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
