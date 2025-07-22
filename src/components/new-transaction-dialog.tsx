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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { categories, wallets } from '@/lib/data';
import { useState } from 'react';

interface NewTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransactionDialog({
  isOpen,
  onOpenChange,
}: NewTransactionDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Add a new income or expense record.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup defaultValue="expense" className="flex gap-4">
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
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="e.g. Lunch with friends" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>{renderCategoryOptions()}</SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="wallet">Wallet</Label>
            <Select>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
