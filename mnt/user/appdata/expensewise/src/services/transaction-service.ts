

import { transactions, wallets, debts, type Transaction, type Wallet, type Debt } from '@/lib/data';
import { autoCurrencyExchange } from '@/ai/flows/auto-currency-exchange';
import { getExchangeRateApiKey } from './api-key-service';

export function addTransaction(newTransaction: Omit<Transaction, 'id'>): void {
    const newId = 't' + (Math.max(0, ...transactions.map(t => parseInt(t.id.substring(1)))) + 1).toString();
    transactions.unshift({ ...newTransaction, id: newId });
    window.dispatchEvent(new Event('transactionsUpdated'));
}

export function addTransactions(newTransactions: Omit<Transaction, 'id'>[]): void {
    const newItems = newTransactions.map((t, i) => {
        const newId = 't' + (Math.max(0, ...transactions.map(t => parseInt(t.id.substring(1))), ...newTransactions.map((nt, nti) => parseInt('9999'+nti))) + 1 + i).toString();
        return { ...t, id: newId };
    });
    transactions.unshift(...newItems);
    window.dispatchEvent(new Event('transactionsUpdated'));
}

export function updateTransaction(updatedTransaction: Transaction): void {
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
        transactions[index] = updatedTransaction;
        window.dispatchEvent(new Event('transactionsUpdated'));
    } else {
        console.error(`Transaction with id ${updatedTransaction.id} not found.`);
    }
}

export function deleteTransaction(transactionId: string): void {
    const index = transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
        transactions.splice(index, 1);
        window.dispatchEvent(new Event('transactionsUpdated'));
    } else {
        console.error(`Transaction with id ${transactionId} not found.`);
    }
}

export function deleteAllTransactions(): void {
    transactions.length = 0;
    window.dispatchEvent(new Event('transactionsUpdated'));
}

async function convertAmount(amount: number, fromCurrency: string, toCurrency: string) {
    const apiKey = getExchangeRateApiKey();
    if (!apiKey) {
      throw new Error("ExchangeRate API Key not found. Please set it in the settings.");
    }
    
    const { convertedAmount } = await autoCurrencyExchange({
        amount: amount,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        apiKey: apiKey,
    });
    return convertedAmount;
}


export async function convertAllTransactions(fromCurrency: string, toCurrency: string): Promise<void> {
    for (const transaction of transactions) {
        // We only convert transactions that are in the `fromCurrency`
        if (transaction.currency === fromCurrency) {
            const convertedAmount = await convertAmount(transaction.amount, fromCurrency, toCurrency);
            transaction.amount = convertedAmount;
            transaction.currency = toCurrency;
        }
    }
}

export async function convertAllWallets(fromCurrency: string, toCurrency: string): Promise<void> {
    for (const wallet of wallets) {
        // Only convert wallets that match the OLD default currency
        if (wallet.currency === fromCurrency) {
            const convertedAmount = await convertAmount(wallet.balance, wallet.currency, toCurrency);
            wallet.balance = convertedAmount;
            wallet.currency = toCurrency;
        }
    }
}

export async function convertAllDebts(fromCurrency: string, toCurrency: string): Promise<void> {
    for (const debt of debts) {
        if (debt.currency === fromCurrency) {
            const convertedAmount = await convertAmount(debt.amount, fromCurrency, toCurrency);
            debt.amount = convertedAmount;
            debt.currency = toCurrency;
        }
    }
}
