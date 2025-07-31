
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

interface CustomRangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dateRange?: DateRange) => void;
}

export function CustomRangeDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: CustomRangeDialogProps) {
  const [date, setDate] = useState<DateRange | undefined>();

  const handleSubmit = () => {
    onSubmit(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Custom Date Range</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
            <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    