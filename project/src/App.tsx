import React, { useState } from 'react';
import { Group, User, Expense } from './types';
import { GroupList } from './components/GroupList';
import { GroupDetails } from './components/GroupDetails';
import { AddGroupModal } from './components/AddGroupModal';
import { AddExpenseModal } from './components/AddExpenseModal';

function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const handleAddGroup = (name: string, currency: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      currency,
      users: [],
      expenses: [],
    };
    setGroups([...groups, newGroup]);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    setGroups(groups.map((group) => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    setSelectedGroup(updatedGroup);
  };

  const handleAddExpense = (data: {
    name: string;
    amount: number;
    splits: { userId: string; percentage: number }[];
  }) => {
    if (!selectedGroup) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name: data.name,
      amount: data.amount,
      currency: selectedGroup.currency,
      splits: data.splits,
      createdAt: new Date(),
    };

    const updatedGroup = {
      ...selectedGroup,
      expenses: [...selectedGroup.expenses, newExpense],
    };

    handleUpdateGroup(updatedGroup);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Expense Splitter</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <GroupList
              groups={groups}
              onSelectGroup={setSelectedGroup}
              onAddGroup={() => setShowAddGroup(true)}
            />
          </div>
          {selectedGroup && (
            <div className="md:col-span-2">
              <GroupDetails
                group={selectedGroup}
                onAddExpense={() => setShowAddExpense(true)}
                onUpdateGroup={handleUpdateGroup}
              />
            </div>
          )}
        </div>
      </main>

      <AddGroupModal
        isOpen={showAddGroup}
        onClose={() => setShowAddGroup(false)}
        onSubmit={handleAddGroup}
      />

      {selectedGroup && (
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
          group={selectedGroup}
        />
      )}
    </div>
  );
}

export default App;