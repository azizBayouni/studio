
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
