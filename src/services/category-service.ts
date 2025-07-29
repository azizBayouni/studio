
import { categories, transactions, type Category } from '@/lib/data';

export function getCategoryDepth(categoryId: string | null): number {
    if (!categoryId) return 0;
    let depth = 0;
    let current = categories.find(c => c.id === categoryId);
    while (current?.parentId) {
        depth++;
        current = categories.find(c => c.id === current!.parentId);
        if (depth > 10) break; // Safety break for circular dependencies
    }
    return depth;
}


export function updateCategory(updatedCategory: Category): void {
  const index = categories.findIndex((c) => c.id === updatedCategory.id);
  if (index !== -1) {
    const oldName = categories[index].name;
    categories[index] = updatedCategory;
    // Update transactions if category name changed
    if (oldName !== updatedCategory.name) {
        transactions.forEach(t => {
            if (t.category === oldName) {
                t.category = updatedCategory.name;
            }
        });
    }
  } else {
    // In a real application, you might throw an error or handle this case differently
    console.error(`Category with id ${updatedCategory.id} not found.`);
  }
}

export function addCategory(newCategory: Omit<Category, 'id'>): void {
    if (newCategory.parentId) {
        const parentDepth = getCategoryDepth(newCategory.parentId);
        if (parentDepth >= 2) {
            throw new Error("Cannot add a category beyond 3 levels deep.");
        }
    }

    const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
    categories.push({ ...newCategory, id: newId });
}

export function deleteCategory(categoryId: string): void {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete) {
        throw new Error(`Category with id ${categoryId} not found.`);
    }
    
    // Recursively find all child categories
    const allIdsToDelete: string[] = [categoryId];
    const findChildren = (parentId: string) => {
        const children = categories.filter(c => c.parentId === parentId);
        for (const child of children) {
            allIdsToDelete.push(child.id);
            findChildren(child.id);
        }
    };
    findChildren(categoryId);
    
    // Find names of all categories being deleted
    const namesToDelete = categories.filter(c => allIdsToDelete.includes(c.id)).map(c => c.name);

    // Prevent deletion if transactions are associated with it
    const hasTransactions = transactions.some(t => namesToDelete.includes(t.category));
    if (hasTransactions) {
        throw new Error("Cannot delete a category that has associated transactions. Please re-assign them first.");
    }

    // Filter out the category and its sub-categories
    const updatedCategories = categories.filter(c => !allIdsToDelete.includes(c.id));
    
    // Replace the original array
    categories.length = 0;
    categories.push(...updatedCategories);
}
