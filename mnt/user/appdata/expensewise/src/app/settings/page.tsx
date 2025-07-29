
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { currencies, transactions as allTransactions, categories as allCategories, wallets as allWallets, events as allEvents } from "@/lib/data"
import { FileUp, Download, UploadCloud, Moon, Sun, Trash2 } from "lucide-react"
import { getDefaultCurrency, setDefaultCurrency } from "@/services/settings-service";
import { useToast } from "@/hooks/use-toast";
import { convertAllTransactions, convertAllWallets, convertAllDebts, addTransactions } from "@/services/transaction-service";
import { ConfirmCurrencyChangeDialog } from "@/components/confirm-currency-change-dialog";
import { getUser, updateUser } from "@/services/user-service";
import type { Transaction } from "@/lib/data";
import * as XLSX from 'xlsx';
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";
import { DeleteAllTransactionsDialog } from "@/components/delete-all-transactions-dialog";
import { Skeleton } from "@/components/ui/skeleton";


export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentDefaultCurrency, setCurrentDefaultCurrency] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    setIsClient(true);

    const initialCurrency = getDefaultCurrency();
    setCurrentDefaultCurrency(initialCurrency);
    setSelectedCurrency(initialCurrency);

    const currentUser = getUser();
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, []);

  const handleProfileSave = () => {
    updateUser({ name, email });
    toast({
      title: "Profile Saved",
      description: "Your name and email have been updated.",
    });
    // This is a simple way to force the header to update.
    // In a more complex app, global state management would be better.
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleCurrencySaveClick = () => {
    if (selectedCurrency !== currentDefaultCurrency) {
      setIsConfirmDialogOpen(true);
    } else {
      toast({
        title: "No Changes",
        description: "The default currency is already set to " + selectedCurrency,
      });
    }
  };

  const handleConfirmation = async (conversionType: 'convert' | 'keep') => {
    const oldCurrency = currentDefaultCurrency;
    
    if (conversionType === 'convert') {
      try {
        toast({
          title: "Conversion in Progress",
          description: "Please wait while we convert your data...",
        });
        await convertAllTransactions(oldCurrency, selectedCurrency);
        await convertAllWallets(oldCurrency, selectedCurrency);
        await convertAllDebts(oldCurrency, selectedCurrency);
        toast({
          title: "Conversion Successful",
          description: `All financial data has been converted to ${selectedCurrency}.`,
        });
      } catch (error) {
        console.error("Conversion failed:", error);
        toast({
          title: "Conversion Failed",
          description: "Could not convert all data. Please try again.",
          variant: "destructive",
        });
        return; 
      }
    }
    
    setDefaultCurrency(selectedCurrency);
    setCurrentDefaultCurrency(selectedCurrency);
    
    toast({
      title: "Settings Saved",
      description: `Default currency set to ${selectedCurrency}.`,
    });
    // A full page reload would be a simple way to force all components to re-render
    // with the new currency. A more sophisticated app might use a global state manager.
    window.location.reload();
  };

  const handleDownloadTemplate = () => {
    const headers = "No.,Category,Amount,Note,Wallet,Currency,Date,Event,Exclude Report";
    const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "import-template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    // 1. Prepare Transaction Data
    const transactionData = allTransactions.map((t, index) => {
        const eventName = t.eventId ? allEvents.find(e => e.id === t.eventId)?.name || '' : '';
        return {
            'No.': index + 1,
            'Category': t.category,
            'Amount': t.amount,
            'Note': t.description,
            'Wallet': t.wallet,
            'Currency': t.currency,
            'Date': t.date,
            'Event': eventName,
            'Exclude Report': t.excludeFromReport ? 'Yes' : '',
        };
    });

    // 2. Prepare Category Data
    const categoryData = allCategories.map(c => ({
        'category': c.name,
        'parent category': allCategories.find(p => p.id === c.parentId)?.name || '',
    }));

    // 3. Create Worksheets
    const transactionsWs = XLSX.utils.json_to_sheet(transactionData);
    const categoriesWs = XLSX.utils.json_to_sheet(categoryData);

    // 4. Create Workbook and add worksheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, transactionsWs, "Transactions");
    XLSX.utils.book_append_sheet(wb, categoriesWs, "Categories");

    // 5. Trigger download
    XLSX.writeFile(wb, "expensewise-export.xlsx");

    toast({
        title: "Export Successful",
        description: "Your data has been exported."
    });
  };

  const handleImport = () => {
    if (!importFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to import.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const rows = text.split('\n').slice(1); // Skip header row
      const newTransactions: Omit<Transaction, 'id'>[] = [];

      try {
        const categoryNames = new Set(allCategories.map(c => c.name.toLowerCase()));
        const walletNames = new Set(allWallets.map(w => w.name.toLowerCase()));
        const currencyCodes = new Set(currencies.map(c => c.toLowerCase()));
        const eventNames = new Set(allEvents.map(ev => ev.name.toLowerCase()));

        rows.forEach((row, index) => {
          if (!row.trim()) return; // Skip empty rows
          const columns = row.split(',').map(c => c.trim());
          const rowNum = index + 2;

          if (columns.length < 7) {
            throw new Error(`Row ${rowNum} is missing columns.`);
          }
          
          const [no, category, amountStr, note, wallet, currency, dateString, eventName, excludeReport] = columns;
          
          const categoryObj = allCategories.find(c => c.name.toLowerCase() === category.toLowerCase());
          const eventObj = eventName ? allEvents.find(ev => ev.name.toLowerCase() === eventName.toLowerCase()) : null;


          // --- VALIDATION ---
          if (!categoryObj) {
            throw new Error(`Error on row ${rowNum}: Category '${category}' not found.`);
          }
          if (!walletNames.has(wallet.toLowerCase())) {
            throw new Error(`Error on row ${rowNum}: Wallet '${wallet}' not found.`);
          }
          if (currency && !currencyCodes.has(currency.toLowerCase())) {
             throw new Error(`Error on row ${rowNum}: Currency '${currency}' not found.`);
          }
          if (eventName && !eventObj) {
             throw new Error(`Error on row ${rowNum}: Event '${eventName}' not found.`);
          }

          const amount = parseFloat(amountStr);
          if (isNaN(amount)) {
            throw new Error(`Invalid amount on row ${rowNum}`);
          }
          
          if (categoryObj.type === 'expense' && amount >= 0) {
            throw new Error(`Error on row ${rowNum}: Expense amount must be negative.`);
          }

          if (categoryObj.type === 'income' && amount <= 0) {
            throw new Error(`Error on row ${rowNum}: Income amount must be positive.`);
          }
          
          if (!dateString) {
            throw new Error(`Date is missing on row ${rowNum}`);
          }
          // More robust date parsing
           const dateValue = new Date(dateString.trim().replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')); // Attempt to handle MM/DD vs DD/MM
          if (isNaN(dateValue.getTime())) {
             throw new Error(`Invalid time value on row ${rowNum}: "${dateString}". Please use a standard format like YYYY-MM-DD or MM/DD/YYYY.`);
          }
          
          const newTransaction: Omit<Transaction, 'id'> = {
            category: category,
            amount: Math.abs(amount),
            type: categoryObj.type,
            description: note,
            wallet: wallet,
            currency: currency || getDefaultCurrency(),
            date: dateValue.toISOString().split('T')[0],
            eventId: eventObj?.id,
            excludeFromReport: !!excludeReport,
          };
          newTransactions.push(newTransaction);
        });

        addTransactions(newTransactions);

        toast({
          title: 'Import Successful',
          description: `${newTransactions.length} transactions have been imported.`,
        });
        setImportFile(null);
        const fileInput = document.getElementById('import-file') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

      } catch (error: any) {
        toast({
          title: 'Import Failed',
          description: error.message || 'An unexpected error occurred during import.',
          variant: 'destructive',
        });
        setImportFile(null);
        const fileInput = document.getElementById('import-file') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      }
    };
    reader.readAsText(importFile);
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleProfileSave}>Save</Button>
            </CardFooter>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <div className="flex items-center justify-between">
                    <Label htmlFor="theme-switch" className="flex items-center gap-2">
                        {theme === 'dark' ? <Moon /> : <Sun />}
                        <span>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                    </Label>
                    <Switch
                        id="theme-switch"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-11" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Choose your default currency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="default-currency">Default Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleCurrencySaveClick}>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Import / Export</CardTitle>
              <CardDescription>
                Migrate your data or download a backup.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">Import Data</h3>
                        <p className="text-sm text-muted-foreground">
                            Import transactions from a CSV template.
                        </p>
                         <Button variant="outline" onClick={handleDownloadTemplate} className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download Template
                        </Button>
                    </div>
                    <div className="flex-1 space-y-2 mt-4 sm:mt-0">
                        <h3 className="font-semibold">Export Data</h3>
                        <p className="text-sm text-muted-foreground">
                            Export data to a single .xlsx file.
                        </p>
                        <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                            <UploadCloud className="mr-2 h-4 w-4" />
                           Export All Data
                        </Button>
                    </div>
               </div>
              <div className="space-y-2">
                <Label htmlFor="import-file">Upload CSV File for Import</Label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input id="import-file" type="file" accept=".csv" className="w-full sm:max-w-xs" onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleImport}>
                <FileUp className="mr-2 h-4 w-4" /> Upload and Import
              </Button>
            </CardFooter>
          </Card>

           <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>These actions are irreversible. Please be certain.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={() => setIsDeleteAllDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Transactions
                </Button>
            </CardContent>
          </Card>

        </div>
      </div>
      <ConfirmCurrencyChangeDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        oldCurrency={currentDefaultCurrency}
        newCurrency={selectedCurrency}
        onConfirm={handleConfirmation}
      />
       <DeleteAllTransactionsDialog
        isOpen={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      />
    </>
  )
}
