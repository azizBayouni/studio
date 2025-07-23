
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MonthlyReportChart } from './monthly-report-chart';

export function MonthlyReportCard() {
  const totalSpent = 11969.52;
  const totalIncome = 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Report this month</CardTitle>
          <Link href="/reports" className="text-sm font-medium text-accent hover:underline">
            See reports
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total spent</p>
            <p className="text-2xl font-bold text-destructive">
                {new Intl.NumberFormat('en-US').format(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total income</p>
            <p className="text-2xl font-bold text-accent">
              {new Intl.NumberFormat('en-US').format(totalIncome)}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="h-48">
            <MonthlyReportChart />
        </div>
      </CardContent>
    </Card>
  );
}
