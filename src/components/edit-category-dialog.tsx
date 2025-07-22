
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { categories, type Category } from '@/lib/data';
import { useEffect, useState } from 'react';

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategoryDialog({
  isOpen,
  onOpenChange,
  category,
}: EditCategoryDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setParentId(category.parentId);
    }
  }, [category]);
  
  if (!category) return null;

  const parentCategoryOptions = categories.filter(
    (c) => c.id !== category.id && c.parentId === null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details for your category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as 'income' | 'expense')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="edit-expense" />
                <Label htmlFor="edit-expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="edit-income" />
                <Label htmlFor="edit-income">Income</Label>
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
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
