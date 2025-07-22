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
import { debts } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function DebtsPage() {
  const payables = debts.filter((d) => d.type === 'payable');
  const receivables = debts.filter((d) => d.type === 'receivable');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Debts</h2>
          <p className="text-muted-foreground">
            Track your payables and receivables.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
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
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payables.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.person}</TableCell>
                    <TableCell>{debt.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={debt.status === 'paid' ? 'secondary' : 'destructive'}>{debt.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      -${debt.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
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
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivables.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.person}</TableCell>
                    <TableCell>{debt.dueDate}</TableCell>
                    <TableCell>
                       <Badge variant={debt.status === 'paid' ? 'secondary' : 'default'}>{debt.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-accent">
                      +${debt.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
