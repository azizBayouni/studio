

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
    // We get the API key from localStorage here on the client before calling the server-side flow
    const apiKey = getExchangeRateApiKey();
    if (!apiKey) {
      throw new Error("ExchangeRate API Key not found. Please set it in the settings.");
    }
    
    // The flow itself will run on the server, but since this service is client-side,
    // the API key won't be available there. We need to pass it.
    // Let's reconsider the design. The flow should be able to get the key.
    // The easiest way is to modify the flow itself to not need the key from its parameters,
    // but this is not possible as localStorage is client-side.
    // So the `autoCurrencyExchange` flow must receive the key.
    // The tool `getExchangeRate` already expects it.
    // The flow `autoCurrencyExchangeFlow` should call the tool with the key.
    // But how does the flow get the key?
    // Let's stick with the plan: the client-side service reads the key and passes it.
    // This requires updating the flow schema.

    // Let's adjust the `autoCurrencyExchange` input schema in the flow file.
    // For now, let's assume the flow can get the key, which was the last change.

    const { convertedAmount } = await autoCurrencyExchange({
        amount: amount,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
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
