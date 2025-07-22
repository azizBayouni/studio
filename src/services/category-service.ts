
import { categories, type Category } from '@/lib/data';

export function updateCategory(updatedCategory: Category): void {
  const index = categories.findIndex((c) => c.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
  } else {
    // In a real application, you might throw an error or handle this case differently
    console.error(`Category with id ${updatedCategory.id} not found.`);
  }
}

export function addCategory(newCategory: Omit<Category, 'id'>): void {
    const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
    categories.push({ ...newCategory, id: newId });
}
