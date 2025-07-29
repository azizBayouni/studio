
import { categories, transactions, type Category } from '@/lib/data';

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
    const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
    categories.push({ ...newCategory, id: newId });
}

export function deleteCategory(categoryId: string): void {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete) {
        throw new Error(`Category with id ${categoryId} not found.`);
    }

    // Find sub-categories to also delete
    const subCategoryIds = categories.filter(c => c.parentId === categoryId).map(c => c.id);
    const allIdsToDelete = [categoryId, ...subCategoryIds];
    
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
