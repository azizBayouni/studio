
import { wallets, type Wallet } from '@/lib/data';
import { getDefaultCurrency } from './settings-service';

export function addWallet(newWallet: Omit<Wallet, 'id' | 'currency' | 'balance'>): void {
    const newId = 'w' + (Math.max(...wallets.map(w => parseInt(w.id.substring(1)))) + 1).toString();
    const currency = getDefaultCurrency();
    wallets.push({ ...newWallet, id: newId, currency, balance: 0 });
}

export function updateWallet(updatedWallet: Wallet): void {
  const index = wallets.findIndex((w) => w.id === updatedWallet.id);
  if (index !== -1) {
    wallets[index] = updatedWallet;
  } else {
    console.error(`Wallet with id ${updatedWallet.id} not found.`);
  }
}

export function deleteWallet(walletId: string): void {
    const index = wallets.findIndex((w) => w.id === walletId);
    if (index !== -1) {
        wallets.splice(index, 1);
    } else {
        console.error(`Wallet with id ${walletId} not found.`);
    }
}
