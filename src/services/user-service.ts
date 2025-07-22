
import { user, type User } from '@/lib/data';

export function getUser(): User {
  // In a real application, this would fetch from a database or API
  return user;
}

export function updateUser(updatedUser: Partial<User>): void {
  // In a real application, this would send an update to a database or API
  if (updatedUser.name) {
    user.name = updatedUser.name;
  }
  if (updatedUser.email) {
    user.email = updatedUser.email;
  }
}
