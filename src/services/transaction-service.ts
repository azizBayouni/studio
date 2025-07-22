
import { transactions, type Transaction } from '@/lib/data';

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
