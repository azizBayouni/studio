'use client';

import { Button } from '@/components/ui/button';
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
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { categories, wallets } from '@/lib/data';
import type { DateRange } from 'react-day-picker';
import { useState } from 'react';

export function ReportsFilter() {
  const [date, setDate] = useState<DateRange | undefined>();

  const renderCategoryOptions = () => {
    const parentCategories = categories.filter((c) => c.parentId === null);
    const options: JSX.Element[] = [];

    parentCategories.forEach((parent) => {
      options.push(
        <SelectItem key={parent.id} value={parent.name} className="font-bold">
          {parent.name}
        </SelectItem>
      );
      const subCategories = categories.filter((c) => c.parentId === parent.id);
      subCategories.forEach((sub) => {
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
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg bg-card">
      <div className="grid grid-cols-2 md:flex md:flex-row w-full gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>{renderCategoryOptions()}</SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Wallet" />
          </SelectTrigger>
          <SelectContent>
            {wallets.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.name}>
                {wallet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal col-span-2',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Custom duration</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
       <Button variant="ghost" size="icon" className="flex-shrink-0">
          <FilterX className="h-4 w-4" />
          <span className="sr-only">Clear Filters</span>
       </Button>
    </div>
  );
}
