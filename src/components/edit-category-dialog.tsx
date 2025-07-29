
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
import { categories, emojiIcons, type Category } from '@/lib/data';
import { updateCategory, getCategoryDepth } from '@/services/category-service';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';

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
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setParentId(category.parentId);
      setIcon(category.icon);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      const updatedCategory: Category = {
        ...category,
        name,
        type,
        parentId,
        icon,
      };
      updateCategory(updatedCategory);
      toast({
          title: "Category Updated",
          description: `The category "${name}" has been saved.`,
      })
      onOpenChange(false);
    }
  };
  
  if (!category) return null;

  const parentCategoryOptions = useMemo(() => {
    return categories.filter(c => {
      // Cannot be its own parent
      if (c.id === category.id) return false;
      // Cannot be a child of itself
      let current: Category | undefined = c;
      while(current) {
        if(current.parentId === category.id) return false;
        current = categories.find(p => p.id === current!.parentId);
      }
      // Parent cannot be at level 3 already
      if (getCategoryDepth(c.id) >= 2) return false;
      return true;
    });
  }, [category]);
  
  const renderParentCategoryOptions = () => {
    const topLevelCategories = parentCategoryOptions.filter(c => c.parentId === null);

    const getOptionsForParent = (pId: string | null, level: number): JSX.Element[] => {
        return parentCategoryOptions
            .filter(c => c.parentId === pId)
            .flatMap(c => {
                const option = (
                    <SelectItem
                        key={c.id}
                        value={c.id}
                        className={cn(`pl-${4 + level * 4}`)}
                    >
                        {c.name}
                    </SelectItem>
                );
                const children = getOptionsForParent(c.id, level + 1);
                return [option, ...children];
            });
    };

    return topLevelCategories.flatMap(c => {
       const option = (
           <SelectItem
                key={c.id}
                value={c.id}
                className="font-semibold"
            >
                {c.name}
            </SelectItem>
       );
       const children = getOptionsForParent(c.id, 1);
       return [option, ...children];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details for your category.
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
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {renderParentCategoryOptions()}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
