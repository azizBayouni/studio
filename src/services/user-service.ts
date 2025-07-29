
import { user, type User } from '@/lib/data';

// Keep track of user data in memory for the session
let currentUser: User = { ...user };

export function getUser(): User {
  // Always return the in-memory user
  return currentUser;
}

export function updateUser(updatedUser: Partial<Omit<User, 'avatar'>>): void {
  // Update the in-memory user object
  currentUser = { ...currentUser, ...updatedUser };
}
