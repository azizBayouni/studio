
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsSummaryCardProps {
    title: string;
    amount: number;
    currency: string;
    type?: 'income' | 'expense' | 'neutral';
}

export function ReportsSummaryCard({ title, amount, currency, type = 'neutral' }: ReportsSummaryCardProps) {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    const amountColorClass = {
        income: 'text-accent',
        expense: 'text-destructive',
        neutral: 'text-foreground',
    }[type];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${amountColorClass}`}>
                    {formatCurrency(amount)}
                </div>
            </CardContent>
        </Card>
    )
}
