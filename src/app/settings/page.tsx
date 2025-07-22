
'use client';

import { useState } from "react";
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
import { currencies } from "@/lib/data"
import { FileUp, Download } from "lucide-react"
import { getDefaultCurrency, setDefaultCurrency } from "@/services/settings-service";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [defaultCurrencyValue, setDefaultCurrencyValue] = useState(getDefaultCurrency());
  const { toast } = useToast();

  const handleSaveCurrency = () => {
    setDefaultCurrency(defaultCurrencyValue);
    toast({
      title: "Settings Saved",
      description: `Default currency set to ${defaultCurrencyValue}.`,
    });
  };

  return (
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
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>Choose your default currency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="default-currency">Default Currency</Label>
              <Select value={defaultCurrencyValue} onValueChange={setDefaultCurrencyValue}>
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
            <Button onClick={handleSaveCurrency}>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
            <CardDescription>
              Migrate your data from Money Lover or other services using our template.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download the CSV template, fill it with your transaction data, and upload it here.
            </p>
             <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="import-file">Upload CSV File</Label>
              <div className="flex items-center gap-2">
                <Input id="import-file" type="file" className="max-w-xs" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>
              <FileUp className="mr-2 h-4 w-4" /> Upload and Import
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
