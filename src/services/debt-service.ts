
import { debts, type Debt, type Payment } from '@/lib/data';
import { format } from 'date-fns';

export function addDebt(newDebtData: Omit<Debt, 'id' | 'status' | 'payments'>): void {
    const newId = 'd' + (Math.max(0, ...debts.map(d => parseInt(d.id.substring(1)))) + 1).toString();
    const newDebt: Debt = {
        ...newDebtData,
        id: newId,
        status: 'unpaid',
        payments: [],
    };
    debts.unshift(newDebt);
    window.dispatchEvent(new Event('debtsUpdated'));
}

export function updateDebt(updatedDebt: Debt): void {
  const index = debts.findIndex((d) => d.id === updatedDebt.id);
  if (index !== -1) {
    debts[index] = updatedDebt;
    window.dispatchEvent(new Event('debtsUpdated'));
  } else {
    console.error(`Debt with id ${updatedDebt.id} not found.`);
  }
}

export function deleteDebt(debtId: string): void {
    const index = debts.findIndex((d) => d.id === debtId);
    if (index !== -1) {
        debts.splice(index, 1);
        window.dispatchEvent(new Event('debtsUpdated'));
    } else {
        console.error(`Debt with id ${debtId} not found.`);
    }
}

export function addPaymentToDebt(debtId: string, paymentAmount: number): void {
    const debt = debts.find(d => d.id === debtId);
    if (debt) {
        const newPayment: Payment = {
            id: 'p' + (Math.random() * 1e9).toString(36),
            date: format(new Date(), 'yyyy-MM-dd'),
            amount: paymentAmount,
        };
        debt.payments.push(newPayment);

        const totalPaid = debt.payments.reduce((sum, p) => sum + p.amount, 0);

        if (totalPaid >= debt.amount) {
            debt.status = 'paid';
        } else if (totalPaid > 0) {
            debt.status = 'partial';
        } else {
            debt.status = 'unpaid';
        }
        updateDebt(debt);
    }
}
