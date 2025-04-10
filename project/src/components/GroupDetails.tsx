import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Group, User } from '../types';
import { ExpenseList } from './ExpenseList';
import { GroupSummary } from './GroupSummary';

interface GroupDetailsProps {
  group: Group;
  onAddExpense: () => void;
  onUpdateGroup: (updatedGroup: Group) => void;
}

export function GroupDetails({ group, onAddExpense, onUpdateGroup }: GroupDetailsProps) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: newUserName.trim(),
      };
      onUpdateGroup({
        ...group,
        users: [...group.users, newUser],
      });
      setNewUserName('');
      setShowAddUser(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    onUpdateGroup({
      ...group,
      users: group.users.filter((user) => user.id !== userId),
      expenses: group.expenses.map((expense) => ({
        ...expense,
        splits: expense.splits.filter((split) => split.userId !== userId),
      })),
    });
  };

  return (
    <div className="space-y-6">
      <GroupSummary group={group} />
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Users className="text-gray-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Group Members</h2>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {showAddUser && (
          <form onSubmit={handleAddUser} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member name"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {group.users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <span className="text-gray-800">{user.name}</span>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {group.users.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No members yet. Add members to start tracking expenses.
            </p>
          )}
        </div>
      </div>

      <ExpenseList group={group} onAddExpense={onAddExpense} />
    </div>
  );
}