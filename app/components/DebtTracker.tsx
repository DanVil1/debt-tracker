'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Calendar, TrendingDown } from 'lucide-react';

// --- Constants ---
const STORAGE_KEY = 'debt-tracker-data';

// --- Types ---
type Expense = {
  id: string;
  label: string;
  amount: number;
};

type Period = {
  id: string;
  dateLabel: string;
  year: number;
  month: number;
  periodType: 'first-half' | 'second-half'; 
  income: number;
  expenses: Expense[];
  paymentToDebt: number;
};

// --- Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getNextPeriodInfo = (lastPeriod?: Period) => {
  let year, month, periodType;

  if (lastPeriod) {
    if (lastPeriod.periodType === 'first-half') {
      year = lastPeriod.year;
      month = lastPeriod.month;
      periodType = 'second-half';
    } else {
      year = lastPeriod.month === 11 ? lastPeriod.year + 1 : lastPeriod.year;
      month = lastPeriod.month === 11 ? 0 : lastPeriod.month + 1;
      periodType = 'first-half';
    }
  } else {
    const now = new Date();
    const currentDay = now.getDate();
    year = now.getFullYear();
    month = now.getMonth();
    periodType = currentDay <= 15 ? 'first-half' : 'second-half';
  }

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'short' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateLabel = periodType === 'first-half' 
    ? `01-15 ${monthName} ${year}` 
    : `16-${daysInMonth} ${monthName} ${year}`;

  return { year, month, periodType: periodType as 'first-half' | 'second-half', dateLabel };
};

export default function DebtTracker() {
  const [initialDebt, setInitialDebt] = useState<number | ''>('');
  const [isDebtSet, setIsDebtSet] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.initialDebt !== undefined) setInitialDebt(data.initialDebt);
        if (data.isDebtSet !== undefined) setIsDebtSet(data.isDebtSet);
        if (data.periods !== undefined) setPeriods(data.periods);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial load is complete
    const data = { initialDebt, isDebtSet, periods };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [initialDebt, isDebtSet, periods, isLoaded]);

  const handleSetDebt = () => {
    if (typeof initialDebt === 'number' && initialDebt > 0) setIsDebtSet(true);
  };

  const addPeriod = () => {
    const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : undefined;
    const { dateLabel, year, month, periodType } = getNextPeriodInfo(lastPeriod);

    const newPeriod: Period = {
      id: crypto.randomUUID(),
      dateLabel,
      year,
      month,
      periodType,
      income: 0,
      expenses: [{ id: crypto.randomUUID(), label: 'Fixed Expense', amount: 0 }],
      paymentToDebt: 0,
    };

    setPeriods([...periods, newPeriod]);
  };

  const updatePeriod = (id: string, field: keyof Period, value: any) => {
    setPeriods(periods.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const updateExpense = (periodId: string, expenseId: string, field: keyof Expense, value: any) => {
    setPeriods(periods.map((p) => {
      if (p.id !== periodId) return p;
      const updatedExpenses = p.expenses.map((e) => 
        e.id === expenseId ? { ...e, [field]: value } : e
      );
      return { ...p, expenses: updatedExpenses };
    }));
  };

  const addExpense = (periodId: string) => {
    setPeriods(periods.map((p) => {
      if (p.id !== periodId) return p;
      return {
        ...p,
        expenses: [...p.expenses, { id: crypto.randomUUID(), label: 'New Expense', amount: 0 }]
      };
    }));
  };

  const removeExpense = (periodId: string, expenseId: string) => {
    setPeriods(periods.map((p) => {
      if (p.id !== periodId) return p;
      return { ...p, expenses: p.expenses.filter((e) => e.id !== expenseId) };
    }));
  };

  const removePeriod = (periodId: string) => {
      setPeriods(periods.filter(p => p.id !== periodId));
  }

  const calculateRemainingDebt = (currentPeriodIndex: number) => {
    const debt = typeof initialDebt === 'number' ? initialDebt : 0;
    let totalPaidSoFar = 0;
    for (let i = 0; i <= currentPeriodIndex; i++) {
      totalPaidSoFar += periods[i].paymentToDebt;
    }
    return debt - totalPaidSoFar;
  };

  // Show loading state while hydrating from localStorage
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  // --- INITIAL VIEW ---
  if (!isDebtSet) {
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
            <DollarSign className="absolute left-3 top-3 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="number"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={initialDebt}
              onChange={(e) => setInitialDebt(parseFloat(e.target.value))}
            />
          </div>
          
          <button
            onClick={handleSetDebt}
            disabled={!initialDebt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            Start Tracking
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN TRACKER VIEW ---
  return (
    <div className="max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
            Debt Projector
          </h1>
          <p className="text-neutral-400 mt-2 font-mono text-sm">
            INITIAL DEBT: <span className="text-white">{formatCurrency(initialDebt as number)}</span>
          </p>
        </div>
        <button 
            onClick={() => { setInitialDebt(''); setIsDebtSet(false); setPeriods([]); }}
            className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
        >
          Reset Data
        </button>
      </div>

      {/* Canvas */}
      <div className="space-y-6">
        {periods.map((period, index) => {
          const totalExpenses = period.expenses.reduce((sum, e) => sum + e.amount, 0);
          const freeMoney = period.income - totalExpenses;
          const remainingDebt = calculateRemainingDebt(index);
          const isPaidOff = remainingDebt <= 0;

          return (
            <div key={period.id} className={`group relative bg-neutral-900 rounded-2xl border ${isPaidOff ? 'border-emerald-500/30' : 'border-neutral-800'} overflow-hidden transition-all hover:border-neutral-700`}>
              
              {/* Card Header */}
              <div className="bg-neutral-950/50 px-6 py-4 flex justify-between items-center border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPaidOff ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
                    <Calendar className={isPaidOff ? 'text-emerald-400' : 'text-indigo-400'} size={18} />
                  </div>
                  <span className="font-bold text-neutral-200 text-lg tracking-tight">{period.dateLabel}</span>
                </div>
                <button onClick={() => removePeriod(period.id)} className="text-neutral-600 hover:text-red-400 transition-colors p-2">
                    <Trash2 size={16} />
                </button>
              </div>

              <div className="p-6 grid lg:grid-cols-2 gap-8">
                {/* Left Column: Calculator */}
                <div className="space-y-6">
                  
                  {/* Income */}
                  <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Income (Received)</label>
                      <div className="relative group/input">
                          <span className="absolute left-3 top-2.5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors">$</span>
                          <input
                              type="number"
                              value={period.income || ''}
                              onChange={(e) => updatePeriod(period.id, 'income', parseFloat(e.target.value))}
                              className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-neutral-700"
                              placeholder="0"
                          />
                      </div>
                  </div>

                  {/* Expenses List */}
                  <div>
                      <div className="flex justify-between items-center mb-3">
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Expenses</label>
                          <button onClick={() => addExpense(period.id)} className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded transition-colors flex items-center gap-1">
                              <Plus size={10}/> ADD
                          </button>
                      </div>
                      
                      <div className="space-y-3">
                          {period.expenses.map((expense) => (
                              <div key={expense.id} className="flex gap-3 group/expense">
                                  <input 
                                      type="text" 
                                      value={expense.label}
                                      onChange={(e) => updateExpense(period.id, expense.id, 'label', e.target.value)}
                                      className="w-1/2 text-sm bg-transparent border-b border-neutral-800 focus:border-indigo-500 text-neutral-300 outline-none px-1 py-1 transition-colors"
                                  />
                                  <input 
                                      type="number" 
                                      value={expense.amount || ''}
                                      onChange={(e) => updateExpense(period.id, expense.id, 'amount', parseFloat(e.target.value))}
                                      className="w-1/2 text-sm bg-transparent border-b border-neutral-800 focus:border-indigo-500 text-neutral-300 outline-none px-1 py-1 text-right transition-colors"
                                      placeholder="0"
                                  />
                                  <button onClick={() => removeExpense(period.id, expense.id)} className="text-neutral-700 hover:text-red-400 opacity-0 group-hover/expense:opacity-100 transition-all">
                                      <Trash2 size={14}/>
                                  </button>
                              </div>
                          ))}
                      </div>
                      <div className="mt-3 text-right text-xs font-mono text-neutral-500">
                          TOTAL EXPENSES: <span className="text-neutral-300">{formatCurrency(totalExpenses)}</span>
                      </div>
                  </div>
                </div>

                {/* Right Column: Results & Debt Action */}
                <div className={`flex flex-col justify-between rounded-xl p-5 border ${isPaidOff ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-indigo-950/10 border-indigo-500/20'}`}>
                  
                  {/* Free Money */}
                  <div className="mb-6">
                      <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPaidOff ? 'text-emerald-400' : 'text-indigo-400'}`}>Free Cash Flow</h3>
                      <p className={`text-3xl font-bold tracking-tighter ${freeMoney < 0 ? 'text-red-400' : 'text-white'}`}>
                          {formatCurrency(freeMoney)}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 font-mono">INCOME - EXPENSES</p>
                  </div>

                  {/* Payment Input */}
                  <div>
                      <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isPaidOff ? 'text-emerald-400' : 'text-indigo-400'}`}>
                          Payment to Debt
                      </label>
                      <input
                          type="number"
                          value={period.paymentToDebt || ''}
                          onChange={(e) => updatePeriod(period.id, 'paymentToDebt', parseFloat(e.target.value))}
                          className={`w-full px-4 py-3 text-xl font-bold bg-neutral-950 border rounded-xl outline-none transition-all
                            ${isPaidOff 
                                ? 'border-emerald-500/30 text-emerald-400 focus:ring-2 focus:ring-emerald-500/50' 
                                : 'border-indigo-500/30 text-indigo-400 focus:ring-2 focus:ring-indigo-500/50'
                            }`}
                          placeholder="Amount"
                      />
                      
                      <div className={`mt-5 pt-5 border-t border-dashed ${isPaidOff ? 'border-emerald-500/30' : 'border-indigo-500/30'}`}>
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
          );
        })}

        {/* Add Button */}
        {(!periods.length || calculateRemainingDebt(periods.length - 1) > 0) ? (
           <button
              onClick={addPeriod}
              className="w-full py-5 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 font-medium hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 group"
          >
              <div className="p-1 rounded bg-neutral-800 group-hover:bg-indigo-500/20 transition-colors">
                <Plus size={18} />
              </div>
              ADD NEXT PERIOD
          </button>
        ) : (
          <div className="p-10 text-center bg-emerald-950/10 rounded-2xl border border-emerald-500/20">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">Debt Free Plan Complete 🎉</h2>
              <p className="text-emerald-500/80">You have projected the full repayment of your debt.</p>
          </div>
        )}
       
      </div>
    </div>
  );
}