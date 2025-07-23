
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Check, Edit, Calendar, GanttChart, InfinityIcon, CheckIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { CustomRangeDialog } from './custom-range-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface TimeRangePickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onCustomDateChange: (dateRange?: DateRange) => void;
}

const timeRanges = [
  { value: 'day', label: 'Day', icon: <div className="w-6 h-6 flex items-center justify-center rounded bg-muted text-muted-foreground text-xs font-bold">1</div> },
  { value: 'week', label: 'Week', icon: <div className="w-6 h-6 flex items-center justify-center rounded bg-muted text-muted-foreground text-xs font-bold">7</div> },
  { value: 'month', label: 'Month', icon: <div className="w-6 h-6 flex items-center justify-center rounded bg-muted text-muted-foreground text-xs font-bold">30</div> },
  { value: 'quarter', label: 'Quarter', icon: <GanttChart className="h-5 w-5" /> },
  { value: 'year', label: 'Year', icon: <Calendar className="h-5 w-5" /> },
  { value: 'all', label: 'All', icon: <InfinityIcon className="h-5 w-5" /> },
  { value: 'custom', label: 'Custom', icon: <Edit className="h-5 w-5" /> },
];

export function TimeRangePicker({
  isOpen,
  onOpenChange,
  value,
  onChange,
  onCustomDateChange
}: TimeRangePickerProps) {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setIsCustomDialogOpen(true);
    } else {
      onChange(selectedValue);
    }
    onOpenChange(false);
  };
  
  const handleCustomDateSubmit = (dateRange?: DateRange) => {
    onCustomDateChange(dateRange);
    onChange('custom');
    setIsCustomDialogOpen(false);
  };

  const Content = () => (
    <>
      <DrawerHeader className="text-left">
          <DrawerTitle>Select time range</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={value === range.value ? 'secondary' : 'ghost'}
              className="justify-start gap-3 h-12 text-base"
              onClick={() => handleSelect(range.value)}
            >
              {range.icon}
              <span>{range.label}</span>
              {value === range.value && <CheckIcon className="h-5 w-5 ml-auto" />}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent>
            <Content />
          </DrawerContent>
      </Drawer>
      <CustomRangeDialog
        isOpen={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
        onSubmit={handleCustomDateSubmit}
      />
    </>
  );
}
