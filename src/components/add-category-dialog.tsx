
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { categories, emojiIcons } from '@/lib/data';
import { addCategory } from '@/services/category-service';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
  isOpen,
  onOpenChange,
}: AddCategoryDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState<string>('🤔');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = {
      name,
      type,
      parentId,
      icon,
    };
    addCategory(newCategory);
    toast({
        title: "Category Added",
        description: `The category "${name}" has been created.`,
    })
    onOpenChange(false);
    // Reset form
    setName('');
    setType('expense');
    setParentId(null);
    setIcon('🤔');
  };
  
  const parentCategoryOptions = categories.filter(
    (c) => c.parentId === null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-16 h-16 text-2xl">
                      {icon}
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
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coffee" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as 'income' | 'expense')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="add-expense" />
                  <Label htmlFor="add-expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="add-income" />
                  <Label htmlFor="add-income">Income</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category</Label>
              <Select value={parentId || 'none'} onValueChange={(value) => setParentId(value === 'none' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parentCategoryOptions.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
