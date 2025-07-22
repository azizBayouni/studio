
import { wallets, type Wallet } from '@/lib/data';

export function updateWallet(updatedWallet: Wallet): void {
  const index = wallets.findIndex((w) => w.id === updatedWallet.id);
  if (index !== -1) {
    wallets[index] = updatedWallet;
  } else {
    console.error(`Wallet with id ${updatedWallet.id} not found.`);
  }
}
