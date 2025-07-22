
import { transactions, type Transaction } from '@/lib/data';

export function addTransaction(newTransaction: Omit<Transaction, 'id'>): void {
    const newId = 't' + (Math.max(...transactions.map(t => parseInt(t.id.substring(1)))) + 1).toString();
    transactions.unshift({ ...newTransaction, id: newId });
}
