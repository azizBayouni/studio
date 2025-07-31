

import { wallets, type Wallet } from '@/lib/data';

const WALLET_STORAGE_KEY = 'expensewise-default-wallet';

export function addWallet(newWallet: Omit<Wallet, 'id' | 'balance'>): void {
    const newId = 'w' + (Math.max(...wallets.map(w => parseInt(w.id.substring(1)))) + 1).toString();
    wallets.push({ ...newWallet, id: newId, balance: 0 });
    window.dispatchEvent(new Event('walletsUpdated'));
}

export function updateWallet(updatedWallet: Wallet): void {
  const index = wallets.findIndex((w) => w.id === updatedWallet.id);
  if (index !== -1) {
    wallets[index] = updatedWallet;
    window.dispatchEvent(new Event('walletsUpdated'));
  } else {
    console.error(`Wallet with id ${updatedWallet.id} not found.`);
  }
}

export function deleteWallet(walletId: string): void {
    const index = wallets.findIndex((w) => w.id === walletId);
    if (index !== -1) {
        wallets.splice(index, 1);
        if (getDefaultWallet() === walletId) {
            clearDefaultWallet();
        }
        window.dispatchEvent(new Event('walletsUpdated'));
    } else {
        console.error(`Wallet with id ${walletId} not found.`);
    }
}

export function setDefaultWallet(walletId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WALLET_STORAGE_KEY, walletId);
    window.dispatchEvent(new Event('defaultWalletChanged'));
  }
}

export function getDefaultWallet(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(WALLET_STORAGE_KEY);
  }
  return null;
}

export function clearDefaultWallet(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(WALLET_STORAGE_KEY);
    window.dispatchEvent(new Event('defaultWalletChanged'));
  }
}
