'use client';

import { DateFilterProps } from "@/types";

interface RangeOption {
  id: string;
  label: string;
  icon: string;
}

export default function DateFilter({ onFilterChange, currentRange }: DateFilterProps) {
  const ranges: RangeOption[] = [
    { id: '7d', label: '7 dias', icon: '📅' },
    { id: '30d', label: '30 dias', icon: '📊' },
    { id: '90d', label: '90 dias', icon: '📈' },
    { id: 'ytd', label: 'Ano atual', icon: '🎯' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
      {ranges.map((range: RangeOption) => (
        <button
          key={range.id}
          onClick={() => onFilterChange(range.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${currentRange === range.id 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <span>{range.icon}</span>
          <span>{range.label}</span>
        </button>
      ))}
    </div>
  );
}