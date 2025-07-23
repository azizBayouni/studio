
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { transactions as allTransactions } from '@/lib/data';
import { startOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet, Utensils } from 'lucide-react';
import { getDefaultCurrency } from '@/services/settings-service';

export function TrendingReportCard() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const monthlyTransactions = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    return allTransactions.filter(t => isWithinInterval(parseISO(t.date), { start, end: now }));
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const trendingData = useMemo(() => {
    if (isLoading || monthlyTransactions.length === 0) {
      return [
        { title: "No data available for this month.", value: "", icon: <Wallet className="h-8 w-8 text-muted-foreground" /> }
      ];
    }
    
    // 1. Highest Spending Category
    const expenseByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
    
    // 2. Largest Transaction
    const largestTransaction = monthlyTransactions
        .filter(t => t.type === 'expense')
        .sort((a,b) => b.amount - a.amount)[0];

    // 3. Most Used Wallet
    const walletUsage = monthlyTransactions.reduce((acc, t) => {
        acc[t.wallet] = (acc[t.wallet] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topWallet = Object.entries(walletUsage).sort((a,b) => b[1] - a[1])[0];

    return [
      { 
        title: "Top Spending Category", 
        value: topCategory ? `${topCategory[0]}: ${formatCurrency(topCategory[1], defaultCurrency)}` : 'N/A',
        icon: <TrendingDown className="h-8 w-8 text-destructive" />
      },
      {
        title: "Largest Transaction",
        value: largestTransaction ? `${largestTransaction.category}: ${formatCurrency(largestTransaction.amount, defaultCurrency)}` : 'N/A',
        icon: <TrendingUp className="h-8 w-8 text-accent" />
      },
      {
        title: "Most Used Wallet",
        value: topWallet ? `${topWallet[0]} (${topWallet[1]} times)` : 'N/A',
        icon: <Wallet className="h-8 w-8 text-primary" />
      }
    ]
  }, [monthlyTransactions, defaultCurrency, isLoading]);


  return (
    <Card className="flex items-center justify-center">
      <CardContent className="p-4 w-full">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {trendingData.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                    <div className="flex flex-col items-center justify-center gap-2 h-32">
                        {item.icon}
                       <p className="text-sm font-semibold text-center">{item.title}</p>
                       <p className="text-lg font-bold text-center text-muted-foreground">{item.value}</p>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {trendingData.length > 1 && (
            <div className="flex items-center justify-center gap-8 mt-2">
                <CarouselPrevious className="static translate-y-0" />
                <div className="flex items-center gap-2">
                  {trendingData.map((_, i) => (
                     <div key={i} className={`w-2 h-2 rounded-full ${i === current ? 'bg-primary' : 'bg-muted'}`} />
                  ))}
                </div>
                <CarouselNext className="static translate-y-0" />
            </div>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
