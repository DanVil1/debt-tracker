'use client';

import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

type HeaderProps = {
  initialDebt: number | '';
  onDebtChange: (value: number | '') => void;
  onResetClick: () => void;
};

export default function Header({ initialDebt, onDebtChange, onResetClick }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<number | ''>('');

  const startEditing = () => {
    setEditValue(initialDebt);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (typeof editValue === 'number' && editValue > 0) {
      onDebtChange(editValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  return (
    <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-6">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
          Debt Tracker
        </h1>
        <div className="text-neutral-400 mt-2 font-mono text-sm flex items-center gap-2">
          INITIAL DEBT:
          {isEditing ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-neutral-500">$</span>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(parseFloat(e.target.value))}
                className="w-28 bg-neutral-950 border border-indigo-500 rounded px-2 py-0.5 text-white outline-none"
                autoFocus
              />
              <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 p-1">
                <Check size={14} />
              </button>
              <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1">
                <X size={14} />
              </button>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <span className="text-white">{formatCurrency(initialDebt as number)}</span>
              <button
                onClick={startEditing}
                className="text-neutral-600 hover:text-indigo-400 p-1 transition-colors"
              >
                <Pencil size={12} />
              </button>
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onResetClick}
        className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
      >
        Reset Data
      </button>
    </div>
  );
}
