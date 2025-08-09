

import { user, type User } from '@/lib/data';

// Keep track of user data in memory for the session
// In a real app with backend auth, you'd fetch this.
// For offline-first, this could be persisted to localStorage as well,
// but for now, we keep it simple.
let currentUser: User = { ...user };

export function getUser(): User {
  return currentUser;
}

export function updateUser(updatedUser: Partial<Omit<User, 'avatar'>>): void {
  currentUser = { ...currentUser, ...updatedUser };
  // Note: User data is not persisted in this simple setup.
  // A real app might save this to localStorage or a server.
}
