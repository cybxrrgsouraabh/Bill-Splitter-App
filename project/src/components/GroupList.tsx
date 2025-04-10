import React from 'react';
import { Plus } from 'lucide-react';
import { Group } from '../types';

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  onAddGroup: () => void;
}

export function GroupList({ groups, onSelectGroup, onAddGroup }: GroupListProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Groups</h2>
        <button
          onClick={onAddGroup}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Group
        </button>
      </div>
      <div className="space-y-2">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <h3 className="font-semibold text-gray-800">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.users.length} members</p>
          </div>
        ))}
      </div>
    </div>
  );
}