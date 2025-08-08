
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wallets as allWallets, type Wallet, getWalletBalance } from '@/lib/data';
import { PlusCircle, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { EditWalletDialog } from '@/components/edit-wallet-dialog';
import { AddWalletDialog } from '@/components/add-wallet-dialog';
import { deleteWallet, getDefaultWallet, setDefaultWallet } from '@/services/wallet-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function WalletsPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [defaultWalletId, setDefaultWalletId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const refreshWallets = () => {
        setDefaultWalletId(getDefaultWallet());
        const updatedWallets = allWallets.map(w => ({
            ...w,
            balance: getWalletBalance(w.name)
        }));
        setWallets(updatedWallets);
    }
    
    refreshWallets();

    const handleDataChange = () => {
       refreshWallets();
    }
    window.addEventListener('transactionsUpdated', handleDataChange);
    window.addEventListener('storage', handleDataChange);
    window.addEventListener('walletsUpdated', handleDataChange);
    
    return () => {
      window.removeEventListener('transactionsUpdated', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('walletsUpdated', handleDataChange);
    }

  }, []);

  const handleEditClick = (e: React.MouseEvent, wallet: Wallet) => {
    e.stopPropagation();
    setSelectedWallet(wallet);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, walletId: string) => {
    e.stopPropagation();
    deleteWallet(walletId);
    toast({
        title: "Wallet Deleted",
        description: "The wallet has been successfully deleted.",
        variant: "destructive"
    })
  };

  const handleSetDefault = (e: React.MouseEvent, walletId: string) => {
    e.stopPropagation();
    setDefaultWallet(walletId);
    setDefaultWalletId(walletId);
    toast({
      title: "Default Wallet Set",
      description: "This wallet will be pre-selected for new transactions.",
    });
  };

  const handleWalletClick = (walletName: string) => {
    const params = new URLSearchParams();
    params.set('wallets', walletName);
    router.push(`/reports?${params.toString()}`);
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
            <p className="text-muted-foreground">
              Manage your accounts and wallets.
            </p>
          </div>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Wallet
              </Button>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wallets.map((wallet) => (
              <Card key={wallet.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleWalletClick(wallet.name)}>
                 <AlertDialog>
                    <DropdownMenu>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{wallet.icon}</span>
                                <div className="space-y-1">
                                    <CardTitle>{wallet.name}</CardTitle>
                                    <CardDescription>
                                        <Badge variant="outline">{wallet.currency}</Badge>
                                    </CardDescription>
                                </div>
                            </div>
                            
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                     <DropdownMenuItem onClick={(e) => handleSetDefault(e, wallet.id)} disabled={defaultWalletId === wallet.id}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {defaultWalletId === wallet.id ? 'Default Wallet' : 'Set as Default'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => handleEditClick(e, wallet)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${wallet.balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: wallet.currency }).format(wallet.balance)}
                            </div>
                        </CardContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this
                            wallet and all associated transactions.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => handleDeleteClick(e, wallet.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </Card>
          ))}
        </div>
      </div>
      <EditWalletDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        wallet={selectedWallet}
      />
      <AddWalletDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
