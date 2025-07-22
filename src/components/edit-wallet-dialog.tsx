
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { emojiIcons, type Wallet } from '@/lib/data';
import { updateWallet } from '@/services/wallet-service';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface EditWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: Wallet | null;
}

export function EditWalletDialog({
  isOpen,
  onOpenChange,
  wallet,
}: EditWalletDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setIcon(wallet.icon);
    }
  }, [wallet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet) {
      const updatedWallet: Wallet = {
        ...wallet,
        name,
        icon,
      };
      updateWallet(updatedWallet);
      toast({
          title: "Wallet Updated",
          description: `The wallet "${name}" has been saved.`,
      });
      onOpenChange(false);
    }
  };
  
  if (!wallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>
              Update the name and icon for your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-16 h-16 text-2xl">
                      {icon || '...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {emojiIcons.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          className="text-lg p-2"
                          onClick={() => {
                            setIcon(emoji);
                            setIsPopoverOpen(false);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
