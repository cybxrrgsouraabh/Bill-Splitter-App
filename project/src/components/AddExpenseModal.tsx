import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Group } from '../types';
import { formatCurrency } from '../utils/calculations';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    splits: { userId: string; percentage: number }[];
  }) => void;
  group: Group;
}

export function AddExpenseModal({ isOpen, onClose, onSubmit, group }: AddExpenseModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [splits, setSplits] = useState<{ userId: string; percentage: number }[]>([]);
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');

  useEffect(() => {
    if (group.users.length > 0) {
      const equalPercentage = 100 / group.users.length;
      setSplits(
        group.users.map((user) => ({
          userId: user.id,
          percentage: equalPercentage,
        }))
      );
    }
  }, [group.users]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert('Split percentages must sum to 100%');
      return;
    }
    
    if (name.trim() && amount) {
      onSubmit({
        name: name.trim(),
        amount: parseFloat(amount),
        splits,
      });
      setName('');
      setAmount('');
      setSplitMode('equal');
      onClose();
    }
  };

  const handleSplitChange = (userId: string, percentage: number) => {
    const newSplits = splits.map((split) =>
      split.userId === userId ? { ...split, percentage } : split
    );
    setSplits(newSplits);
  };

  const setEqualSplit = () => {
    const equalPercentage = 100 / group.users.length;
    setSplits(
      group.users.map((user) => ({
        userId: user.id,
        percentage: equalPercentage,
      }))
    );
    setSplitMode('equal');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Name
              </label>
              <input
                type="text"
                id="expenseName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter expense name"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({group.currency})
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter amount in ${group.currency}`}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Split Type</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={setEqualSplit}
                    className={`px-3 py-1 text-sm rounded ${
                      splitMode === 'equal'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('custom')}
                    className={`px-3 py-1 text-sm rounded ${
                      splitMode === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Custom Split
                  </button>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {group.users.map((user) => {
                  const split = splits.find((s) => s.userId === user.id);
                  const percentage = split?.percentage || 0;
                  const amountValue = amount ? (parseFloat(amount) * percentage) / 100 : 0;

                  return (
                    <div key={user.id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-24">{user.name}</span>
                      <input
                        type="number"
                        value={percentage}
                        onChange={(e) =>
                          handleSplitChange(user.id, parseFloat(e.target.value))
                        }
                        className="w-20 px-2 py-1 border rounded-md"
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={splitMode === 'equal'}
                      />
                      <span className="text-sm text-gray-600">%</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({formatCurrency(amountValue, group.currency)})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}