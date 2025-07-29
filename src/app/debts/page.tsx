
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { debts as allDebts, type Debt } from '@/lib/data';
import { PlusCircle, Info } from 'lucide-react';
import { getDefaultCurrency } from '@/services/settings-service';
import { AddDebtDialog } from '@/components/add-debt-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function DebtsPage() {
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [debts, setDebts] = useState([...allDebts]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


  useEffect(() => {
    setDefaultCurrency(getDefaultCurrency());
    
    const handleDataChange = () => {
        setDebts([...allDebts]);
    }
    window.addEventListener('debtsUpdated', handleDataChange);
    return () => window.removeEventListener('debtsUpdated', handleDataChange);

  }, []);

  const payables = debts.filter((d) => d.type === 'payable');
  const receivables = debts.filter((d) => d.type === 'receivable');

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const handleDialogClose = () => {
    setDebts([...allDebts]);
  }

  const renderDebtRow = (debt: Debt) => (
    <TableRow key={debt.id}>
      <TableCell className="font-medium flex items-center gap-2">
        {debt.person}
        {debt.note && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{debt.note}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell">{debt.dueDate}</TableCell>
      <TableCell>
        <Badge variant={debt.status === 'paid' ? 'secondary' : (debt.type === 'payable' ? 'destructive' : 'default')}>
          {debt.status}
        </Badge>
      </TableCell>
      <TableCell className={`text-right font-medium ${debt.type === 'payable' ? 'text-destructive' : 'text-accent'}`}>
        {debt.type === 'payable' ? '-' : '+'}{formatCurrency(debt.amount, debt.currency)}
      </TableCell>
    </TableRow>
  );

  return (
    <>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Debts</h2>
          <p className="text-muted-foreground">
            Track your payables and receivables.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Debt
            </Button>
        </div>
      </div>

      <Tabs defaultValue="payable" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payable">Payable</TabsTrigger>
          <TabsTrigger value="receivable">Receivable</TabsTrigger>
        </TabsList>
        <TabsContent value="payable" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person/Entity</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payables.map(renderDebtRow)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="receivable" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person/Entity</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivables.map(renderDebtRow)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
     <AddDebtDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) handleDialogClose();
        }}
     />
    </>
  );
}
