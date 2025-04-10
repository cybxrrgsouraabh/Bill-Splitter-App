import React from 'react';
import { Group } from '../types';
import { calculateGroupTotal, calculateUserTotal, formatCurrency } from '../utils/calculations';

interface GroupSummaryProps {
  group: Group;
}

export function GroupSummary({ group }: GroupSummaryProps) {
  const groupTotal = calculateGroupTotal(group);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Group Summary</h2>
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-700">
          Total Expenses: <span className="text-green-600">{formatCurrency(groupTotal, group.currency)}</span>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Per Person Breakdown:</h3>
        {group.users.map(user => {
          const userTotal = calculateUserTotal(group, user.id);
          return (
            <div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">{user.name}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(userTotal, group.currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}