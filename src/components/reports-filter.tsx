
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
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';

interface ReportsFilterProps {
  selectedCategories: string[];
  onSelectedCategoriesChange: (categories: string[]) => void;
  walletFilter: string;
  onWalletFilterChange: (wallet: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
}

export function ReportsFilter({
  selectedCategories,
  onSelectedCategoriesChange,
  walletFilter,
  onWalletFilterChange,
  dateRange,
  onDateRangeChange,
}: ReportsFilterProps) {

  const categoryOptions: MultiSelectOption[] = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));
  
  const handleClearFilters = () => {
    onSelectedCategoriesChange([]);
    onWalletFilterChange('all');
    onDateRangeChange(undefined);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg bg-card">
      <div className="grid grid-cols-2 md:flex md:flex-row w-full gap-4">
        <MultiSelect
          options={categoryOptions}
          selected={selectedCategories}
          onChange={onSelectedCategoriesChange}
          className="md:w-[250px] col-span-2"
          placeholder="Filter by category"
        />

        <Select value={walletFilter} onValueChange={onWalletFilterChange}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Wallet" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Wallets</SelectItem>
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
                <span>Custom duration</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
       <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={handleClearFilters}>
          <FilterX className="h-4 w-4" />
          <span className="sr-only">Clear Filters</span>
       </Button>
    </div>
  );
}
