'use client';

import React from 'react';
import { DollarSign, TrendingDown } from 'lucide-react';

type InitialDebtFormProps = {
  initialDebt: number | '';
  onDebtChange: (value: number | '') => void;
  onSubmit: () => void;
};

export default function InitialDebtForm({ initialDebt, onDebtChange, onSubmit }: InitialDebtFormProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-500/10 rounded-full">
            <TrendingDown className="text-indigo-400" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Debt Projection</h1>
        <p className="text-neutral-400 mb-8">Enter your current total debt to initialize the tracker.</p>

        <div className="relative mb-6 group">
          <DollarSign
            className="absolute left-3 top-3 text-neutral-500 group-focus-within:text-indigo-400 transition-colors"
            size={20}
          />
          <input
            type="number"
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={initialDebt}
            onChange={(e) => onDebtChange(parseFloat(e.target.value))}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!initialDebt}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}
