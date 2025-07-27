
import { user, type User } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

export function getUser(): User {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    return {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || `https://placehold.co/100x100.png?text=${(firebaseUser.displayName || 'U').charAt(0)}`,
    };
  }
  // Return a default/guest user object if no one is logged in
  return { ...user };
}

export async function updateUser(updatedUser: Partial<User>): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    try {
        await updateProfile(firebaseUser, {
            displayName: updatedUser.name,
            // photoURL can be updated here if you have a URL
        });
        // Note: updating email is a separate, more complex flow in Firebase
        // and is not handled here for simplicity.
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
  }
}
