
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
import { wallets, type Wallet } from '@/lib/data';
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


export default function WalletsPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [defaultWalletId, setDefaultWalletId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setDefaultWalletId(getDefaultWallet());
  }, []);

  const handleEditClick = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (walletId: string) => {
    deleteWallet(walletId);
    toast({
        title: "Wallet Deleted",
        description: "The wallet has been successfully deleted.",
        variant: "destructive"
    })
  };

  const handleSetDefault = (walletId: string) => {
    setDefaultWallet(walletId);
    setDefaultWalletId(walletId);
    toast({
      title: "Default Wallet Set",
      description: "This wallet will be pre-selected for new transactions.",
    });
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wallets.map((wallet) => (
              <Card key={wallet.id}>
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
                            
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                     <DropdownMenuItem onClick={() => handleSetDefault(wallet.id)} disabled={defaultWalletId === wallet.id}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {defaultWalletId === wallet.id ? 'Default Wallet' : 'Set as Default'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditClick(wallet)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive">
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
                        <AlertDialogAction onClick={() => handleDeleteClick(wallet.id)}>Continue</AlertDialogAction>
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
