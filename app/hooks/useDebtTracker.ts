'use client';

import { useLocalStorage } from './useLocalStorage';
import { Period, Expense, DebtTrackerData } from '@/app/types';
import { getNextPeriodInfo } from '@/app/lib/utils';

const STORAGE_KEY = 'debt-tracker-data';

const initialData: DebtTrackerData = {
  initialDebt: '',
  isDebtSet: false,
  periods: [],
};

export function useDebtTracker() {
  const [data, setData, isLoaded] = useLocalStorage<DebtTrackerData>(STORAGE_KEY, initialData);

  const { initialDebt, isDebtSet, periods } = data;

  // --- Setters ---
  const setInitialDebt = (value: number | '') => {
    setData((prev) => ({ ...prev, initialDebt: value }));
  };

  const setIsDebtSet = (value: boolean) => {
    setData((prev) => ({ ...prev, isDebtSet: value }));
  };

  const setPeriods = (periods: Period[]) => {
    setData((prev) => ({ ...prev, periods }));
  };

  // --- Actions ---
  const handleSetDebt = () => {
    if (typeof initialDebt === 'number' && initialDebt > 0) {
      setIsDebtSet(true);
    }
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

  const updatePeriod = (id: string, field: keyof Period, value: Period[keyof Period]) => {
    setPeriods(periods.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removePeriod = (periodId: string) => {
    setPeriods(periods.filter((p) => p.id !== periodId));
  };

  const addExpense = (periodId: string) => {
    setPeriods(
      periods.map((p) => {
        if (p.id !== periodId) return p;
        return {
          ...p,
          expenses: [...p.expenses, { id: crypto.randomUUID(), label: 'New Expense', amount: 0 }],
        };
      })
    );
  };

  const updateExpense = (periodId: string, expenseId: string, field: keyof Expense, value: string | number) => {
    setPeriods(
      periods.map((p) => {
        if (p.id !== periodId) return p;
        const updatedExpenses = p.expenses.map((e) =>
          e.id === expenseId ? { ...e, [field]: value } : e
        );
        return { ...p, expenses: updatedExpenses };
      })
    );
  };

  const removeExpense = (periodId: string, expenseId: string) => {
    setPeriods(
      periods.map((p) => {
        if (p.id !== periodId) return p;
        return { ...p, expenses: p.expenses.filter((e) => e.id !== expenseId) };
      })
    );
  };

  const resetAll = () => {
    setData(initialData);
  };

  // --- Computed Values ---
  const totalPaid = periods.reduce((sum, p) => sum + (p.paymentToDebt || 0), 0);
  const currentDebt = (typeof initialDebt === 'number' ? initialDebt : 0) - totalPaid;
  const progressPercent =
    typeof initialDebt === 'number' && initialDebt > 0
      ? Math.min(100, Math.round((totalPaid / initialDebt) * 100))
      : 0;

  const calculateRemainingDebt = (currentPeriodIndex: number) => {
    const debt = typeof initialDebt === 'number' ? initialDebt : 0;
    let totalPaidSoFar = 0;
    for (let i = 0; i <= currentPeriodIndex; i++) {
      totalPaidSoFar += periods[i].paymentToDebt;
    }
    return debt - totalPaidSoFar;
  };

  return {
    // State
    initialDebt,
    isDebtSet,
    periods,
    isLoaded,
    
    // Computed
    totalPaid,
    currentDebt,
    progressPercent,
    calculateRemainingDebt,
    
    // Actions
    setInitialDebt,
    handleSetDebt,
    addPeriod,
    updatePeriod,
    removePeriod,
    addExpense,
    updateExpense,
    removeExpense,
    resetAll,
  };
}
