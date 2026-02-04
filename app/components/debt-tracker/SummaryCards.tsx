'use client';

import React from 'react';
import { formatCurrency } from '@/app/lib/utils';

type SummaryCardsProps = {
  totalPaid: number;
  currentDebt: number;
  progressPercent: number;
};

export default function SummaryCards({ totalPaid, currentDebt, progressPercent }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Paid</p>
        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalPaid)}</p>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Remaining</p>
        <p className={`text-2xl font-bold ${currentDebt <= 0 ? 'text-emerald-400' : 'text-white'}`}>
          {currentDebt <= 0 ? 'PAID OFF!' : formatCurrency(currentDebt)}
        </p>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Progress</p>
        <p className="text-2xl font-bold text-indigo-400">{progressPercent}%</p>
        <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
