'use client';

import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Period, Expense } from '@/app/types';
import { formatCurrency } from '@/app/lib/utils';

type PeriodCardProps = {
  period: Period;
  remainingDebt: number;
  onUpdatePeriod: (field: keyof Period, value: Period[keyof Period]) => void;
  onRemovePeriod: () => void;
  onAddExpense: () => void;
  onUpdateExpense: (expenseId: string, field: keyof Expense, value: string | number) => void;
  onRemoveExpense: (expenseId: string) => void;
};

export default function PeriodCard({
  period,
  remainingDebt,
  onUpdatePeriod,
  onRemovePeriod,
  onAddExpense,
  onUpdateExpense,
  onRemoveExpense,
}: PeriodCardProps) {
  const totalExpenses = period.expenses.reduce((sum, e) => sum + e.amount, 0);
  const freeMoney = period.income - totalExpenses;
  const isPaidOff = remainingDebt <= 0;

  return (
    <div
      className={`flex-shrink-0 w-[420px] h-full group relative bg-neutral-900 rounded-2xl border ${
        isPaidOff ? 'border-emerald-500/30' : 'border-neutral-800'
      } overflow-hidden transition-all hover:border-neutral-700 flex flex-col`}
    >
      {/* Card Header */}
      <div className="bg-neutral-950/50 px-6 py-4 flex justify-between items-center border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPaidOff ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
            <Calendar className={isPaidOff ? 'text-emerald-400' : 'text-indigo-400'} size={18} />
          </div>
          <span className="font-bold text-neutral-200 text-lg tracking-tight">{period.dateLabel}</span>
        </div>
        <button
          onClick={onRemovePeriod}
          className="text-neutral-600 hover:text-red-400 transition-colors p-2"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-rows-[auto_1fr_auto] h-full gap-6">
          {/* Income */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              Income (Received)
            </label>
            <div className="relative group/input">
              <span className="absolute left-3 top-2.5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors">
                $
              </span>
              <input
                type="number"
                value={period.income || ''}
                onChange={(e) => onUpdatePeriod('income', parseFloat(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-neutral-700"
                placeholder="0"
              />
            </div>
          </div>

          {/* Expenses List */}
          <div className="flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Expenses
              </label>
              <button
                onClick={onAddExpense}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Plus size={10} /> ADD
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {period.expenses.map((expense) => (
                <div key={expense.id} className="flex gap-3 group/expense">
                  <input
                    type="text"
                    value={expense.label}
                    onChange={(e) => onUpdateExpense(expense.id, 'label', e.target.value)}
                    className="w-1/2 text-sm bg-transparent border-b border-neutral-800 focus:border-indigo-500 text-neutral-300 outline-none px-1 py-1 transition-colors"
                  />
                  <input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => onUpdateExpense(expense.id, 'amount', parseFloat(e.target.value))}
                    className="w-1/2 text-sm bg-transparent border-b border-neutral-800 focus:border-indigo-500 text-neutral-300 outline-none px-1 py-1 text-right transition-colors"
                    placeholder="0"
                  />
                  <button
                    onClick={() => onRemoveExpense(expense.id)}
                    className="text-neutral-700 hover:text-red-400 opacity-0 group-hover/expense:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right text-xs font-mono text-neutral-500">
              TOTAL EXPENSES: <span className="text-neutral-300">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>

          {/* Results Section */}
          <div
            className={`rounded-xl p-5 border ${
              isPaidOff ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-indigo-950/10 border-indigo-500/20'
            }`}
          >
            {/* Free Money */}
            <div className="mb-6">
              <h3
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isPaidOff ? 'text-emerald-400' : 'text-indigo-400'
                }`}
              >
                Free Cash Flow
              </h3>
              <p className={`text-3xl font-bold tracking-tighter ${freeMoney < 0 ? 'text-red-400' : 'text-white'}`}>
                {formatCurrency(freeMoney)}
              </p>
              <p className="text-[10px] text-neutral-500 mt-1 font-mono">INCOME - EXPENSES</p>
            </div>

            {/* Payment Input */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-widest mb-2 ${
                  isPaidOff ? 'text-emerald-400' : 'text-indigo-400'
                }`}
              >
                Payment to Debt
              </label>
              <input
                type="number"
                value={period.paymentToDebt || ''}
                onChange={(e) => onUpdatePeriod('paymentToDebt', parseFloat(e.target.value))}
                className={`w-full px-4 py-3 text-xl font-bold bg-neutral-950 border rounded-xl outline-none transition-all
                  ${
                    isPaidOff
                      ? 'border-emerald-500/30 text-emerald-400 focus:ring-2 focus:ring-emerald-500/50'
                      : 'border-indigo-500/30 text-indigo-400 focus:ring-2 focus:ring-indigo-500/50'
                  }`}
                placeholder="Amount"
              />

              <div
                className={`mt-5 pt-5 border-t border-dashed ${
                  isPaidOff ? 'border-emerald-500/30' : 'border-indigo-500/30'
                }`}
              >
                <div className="flex justify-between items-end">
                  <span className="text-xs text-neutral-400 font-mono">REMAINING DEBT</span>
                  <span className={`text-xl font-bold ${isPaidOff ? 'text-emerald-400' : 'text-white'}`}>
                    {isPaidOff ? 'PAID OFF' : formatCurrency(remainingDebt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
