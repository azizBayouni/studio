

import { transactions, wallets, debts, type Transaction, type Wallet, type Debt } from '@/lib/data';
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

async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const apiKey = getExchangeRateApiKey();
    if (!apiKey) {
      throw new Error("ExchangeRate API Key not found. Please set it in the settings.");
    }
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorType = errorData['error-type'] || `HTTP status ${response.status}`;
            console.error(`API request failed with status: ${response.status}`, errorData);
            throw new Error(`API request failed: ${errorType}`);
        }
        const data = await response.json();
        if (data.result === 'error') {
            console.error(`ExchangeRate API error: ${data['error-type']}`);
            throw new Error(`ExchangeRate API error: ${data['error-type']}`);
        }
        const rate = data.conversion_rates?.[toCurrency];
        if (!rate) {
            throw new Error(`Could not find rate for ${toCurrency}`);
        }
        return rate;
    } catch(error) {
        console.error("Failed to fetch exchange rate. Full error:", error);
        throw error;
    }
}

export async function convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    return amount * exchangeRate;
}


export async function convertAllTransactions(fromCurrency: string, toCurrency: string): Promise<void> {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    for (const transaction of transactions) {
        if (transaction.currency === fromCurrency) {
            transaction.amount = transaction.amount * exchangeRate;
            transaction.currency = toCurrency;
        }
    }
}

export async function convertAllWallets(fromCurrency: string, toCurrency: string): Promise<void> {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    for (const wallet of wallets) {
        if (wallet.currency === fromCurrency) {
            wallet.balance = wallet.balance * exchangeRate;
            wallet.currency = toCurrency;
        }
    }
}

export async function convertAllDebts(fromCurrency: string, toCurrency: string): Promise<void> {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    for (const debt of debts) {
        if (debt.currency === fromCurrency) {
            debt.amount = debt.amount * exchangeRate;
            debt.currency = toCurrency;
        }
    }
}
