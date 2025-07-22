
import { transactions, wallets, type Transaction, type Wallet } from '@/lib/data';
import { autoCurrencyExchange } from '@/ai/flows/auto-currency-exchange';

export function addTransaction(newTransaction: Omit<Transaction, 'id'>): void {
    const newId = 't' + (Math.max(...transactions.map(t => parseInt(t.id.substring(1)))) + 1).toString();
    transactions.unshift({ ...newTransaction, id: newId });
}

export function updateTransaction(updatedTransaction: Transaction): void {
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
        transactions[index] = updatedTransaction;
    } else {
        console.error(`Transaction with id ${updatedTransaction.id} not found.`);
    }
}

export function deleteTransaction(transactionId: string): void {
    const index = transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
        transactions.splice(index, 1);
    } else {
        console.error(`Transaction with id ${transactionId} not found.`);
    }
}

export async function convertAllTransactions(fromCurrency: string, toCurrency: string): Promise<void> {
    for (const transaction of transactions) {
        const { convertedAmount } = await autoCurrencyExchange({
            amount: transaction.amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
        });
        transaction.amount = convertedAmount;
        transaction.currency = toCurrency;
    }
}

export async function convertAllWallets(fromCurrency: string, toCurrency: string): Promise<void> {
    for (const wallet of wallets) {
        if (wallet.currency === fromCurrency) {
            const { convertedAmount } = await autoCurrencyExchange({
                amount: wallet.balance,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
            });
            wallet.balance = convertedAmount;
            wallet.currency = toCurrency;
        }
    }
}
