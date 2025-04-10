import { Group, User, Expense } from '../types';

export function calculateGroupTotal(group: Group): number {
  return group.expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function calculateUserTotal(group: Group, userId: string): number {
  return group.expenses.reduce((total, expense) => {
    const split = expense.splits.find(s => s.userId === userId);
    if (split) {
      return total + (expense.amount * split.percentage / 100);
    }
    return total;
  }, 0);
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
] as const;

export function formatCurrency(amount: number, currency: string): string {
  const currencyObj = CURRENCIES.find(c => c.code === currency);
  return `${currencyObj?.symbol || '$'}${amount.toFixed(2)}`;
}