import React from 'react';
import { Plus } from 'lucide-react';
import { Expense, Group } from '../types';

interface ExpenseListProps {
  group: Group;
  onAddExpense: () => void;
}

export function ExpenseList({ group, onAddExpense }: ExpenseListProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>
      <div className="space-y-3">
        {group.expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} group={group} />
        ))}
      </div>
    </div>
  );
}

function ExpenseCard({ expense, group }: { expense: Expense; group: Group }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{expense.name}</h3>
          <p className="text-sm text-gray-600">
            {new Date(expense.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="text-lg font-bold text-green-600">
          ${expense.amount.toFixed(2)}
        </span>
      </div>
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Split Details:</h4>
        <div className="space-y-1">
          {expense.splits.map((split) => {
            const user = group.users.find((u) => u.id === split.userId);
            return (
              <div
                key={split.userId}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>{user?.name}</span>
                <span>{split.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}