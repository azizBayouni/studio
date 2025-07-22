
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';

interface ConfirmCurrencyChangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  oldCurrency: string;
  newCurrency: string;
  onConfirm: (conversionType: 'convert' | 'keep') => void;
}

export function ConfirmCurrencyChangeDialog({
  isOpen,
  onOpenChange,
  oldCurrency,
  newCurrency,
  onConfirm,
}: ConfirmCurrencyChangeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleConfirm = async (conversionType: 'convert' | 'keep') => {
    setIsProcessing(true);
    await onConfirm(conversionType);
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Default Currency?</DialogTitle>
          <DialogDescription>
            You are changing your default currency from{' '}
            <b>{oldCurrency}</b> to <b>{newCurrency}</b>. How should we handle
            your existing data?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Alert>
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    This action can have significant effects on your financial data. Please choose carefully.
                </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <Button 
                    className="w-full justify-start text-left h-auto" 
                    variant="outline"
                    onClick={() => handleConfirm('convert')}
                    disabled={isProcessing}
                >
                    <div className="flex flex-col">
                        <span className="font-bold">Convert everything</span>
                        <span className="text-muted-foreground text-sm">
                            Convert all transaction amounts and wallet balances from {oldCurrency} to {newCurrency}.
                        </span>
                    </div>
                </Button>
                 <Button 
                    className="w-full justify-start text-left h-auto" 
                    variant="outline"
                    onClick={() => handleConfirm('keep')}
                    disabled={isProcessing}
                >
                    <div className="flex flex-col">
                        <span className="font-bold">Keep amounts, change currency</span>
                         <span className="text-muted-foreground text-sm">
                            Only change the currency symbol. Amounts will remain the same (e.g., 100 {oldCurrency} becomes 100 {newCurrency}).
                        </span>
                    </div>
                </Button>
            </div>
             {isProcessing && <p className="text-sm text-center text-muted-foreground">Processing... Please wait.</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
