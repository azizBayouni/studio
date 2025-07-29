
import { debts, type Debt } from '@/lib/data';

export function addDebt(newDebtData: Omit<Debt, 'id'>): void {
    const newId = 'd' + (Math.max(0, ...debts.map(d => parseInt(d.id.substring(1)))) + 1).toString();
    const newDebt: Debt = {
        ...newDebtData,
        id: newId,
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
