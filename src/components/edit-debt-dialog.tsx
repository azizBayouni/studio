
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateDebt, deleteDebt } from '@/services/debt-service';
import { Textarea } from './ui/textarea';
import type { Debt } from '@/lib/data';

interface EditDebtDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  debt: Debt | null;
}

export function EditDebtDialog({
  isOpen,
  onOpenChange,
  debt
}: EditDebtDialogProps) {
  const [type, setType] = useState<'payable' | 'receivable'>('payable');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'paid' | 'unpaid'>('unpaid');
  const { toast } = useToast();

  useEffect(() => {
    if (debt) {
      setType(debt.type);
      setPerson(debt.person);
      setAmount(debt.amount);
      setCurrency(debt.currency);
      setDueDate(parseISO(debt.dueDate));
      setNote(debt.note || '');
      setStatus(debt.status);
    }
  }, [debt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt || !person || !amount || !dueDate) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields.",
            variant: "destructive"
        });
        return;
    }

    const updatedDebt: Debt = {
      ...debt,
      type,
      person,
      amount: Number(amount),
      currency,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      note,
      status,
    };
    
    updateDebt(updatedDebt);
    
    toast({
        title: "Debt Updated",
        description: `The debt for "${person}" has been updated.`,
    });

    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (debt) {
      deleteDebt(debt.id);
      toast({
          title: 'Debt Deleted',
          description: 'The debt has been successfully deleted.',
          variant: 'destructive'
      });
      onOpenChange(false);
    }
  };

  if (!debt) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Debt</DialogTitle>
            <DialogDescription>
              Update the details of this debt record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as 'payable' | 'receivable')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payable" id="edit-payable" />
                  <Label htmlFor="edit-payable">Payable (I owe)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="receivable" id="edit-receivable" />
                  <Label htmlFor="edit-receivable">Receivable (I am owed)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Person / Entity</Label>
              <Input id="edit-name" value={person} onChange={(e) => setPerson(e.target.value)} required placeholder="e.g. John Doe, Car Loan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <div className="flex items-center gap-2">
                <Input id="edit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')} required placeholder="100.00" />
                 <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                    {currency}
                </div>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        id="edit-due-date"
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !dueDate && 'text-muted-foreground'
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-note">Note (Optional)</Label>
                <Textarea id="edit-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. For concert tickets" />
            </div>
             <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as 'paid' | 'unpaid')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpaid" id="unpaid" />
                  <Label htmlFor="unpaid">Unpaid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Paid</Label>
                </div>
              </RadioGroup>
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
                        debt record.
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
