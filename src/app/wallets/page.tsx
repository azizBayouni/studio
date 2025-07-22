import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wallets } from '@/lib/data';
import { PlusCircle, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export default function WalletsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
          <p className="text-muted-foreground">
            Manage your accounts and wallets.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Wallet
            </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wallets.map((wallet) => (
            <Card key={wallet.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle>{wallet.name}</CardTitle>
                        <CardDescription>
                            <Badge variant="outline">{wallet.currency}</Badge>
                        </CardDescription>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            {/* <DropdownMenuItem>Set as Default</DropdownMenuItem> */}
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${wallet.balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: wallet.currency }).format(wallet.balance)}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
