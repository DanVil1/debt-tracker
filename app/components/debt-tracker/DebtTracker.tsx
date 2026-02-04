'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDebtTracker } from '@/app/hooks/useDebtTracker';
import Modal, { ModalActions } from '@/app/components/ui/Modal';
import InitialDebtForm from './InitialDebtForm';
import Header from './Header';
import SummaryCards from './SummaryCards';
import PeriodCard from './PeriodCard';

export default function DebtTracker() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    initialDebt,
    isDebtSet,
    periods,
    isLoaded,
    totalPaid,
    currentDebt,
    progressPercent,
    calculateRemainingDebt,
    setInitialDebt,
    handleSetDebt,
    addPeriod,
    updatePeriod,
    removePeriod,
    addExpense,
    updateExpense,
    removeExpense,
    resetAll,
  } = useDebtTracker();

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  // Initial setup
  if (!isDebtSet) {
    return (
      <InitialDebtForm
        initialDebt={initialDebt}
        onDebtChange={setInitialDebt}
        onSubmit={handleSetDebt}
      />
    );
  }

  // Main tracker view
  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset All Data?"
        description="This will delete your initial debt and all periods. This action cannot be undone."
      >
        <ModalActions
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleReset}
          confirmText="Yes, Reset"
          confirmVariant="danger"
        />
      </Modal>

      <Header
        initialDebt={initialDebt}
        onDebtChange={setInitialDebt}
        onResetClick={() => setShowResetConfirm(true)}
      />

      <SummaryCards
        totalPaid={totalPaid}
        currentDebt={currentDebt}
        progressPercent={progressPercent}
      />

      {/* Horizontal Timeline */}
      <div className="fixed bottom-0 left-0 right-0 top-[280px] overflow-x-auto overflow-y-hidden px-4 md:px-8">
        <div className="flex gap-6 h-full pb-6 max-w-5xl mx-auto">
          {periods.map((period, index) => (
            <PeriodCard
              key={period.id}
              period={period}
              remainingDebt={calculateRemainingDebt(index)}
              onUpdatePeriod={(field, value) => updatePeriod(period.id, field, value)}
              onRemovePeriod={() => removePeriod(period.id)}
              onAddExpense={() => addExpense(period.id)}
              onUpdateExpense={(expenseId, field, value) =>
                updateExpense(period.id, expenseId, field, value)
              }
              onRemoveExpense={(expenseId) => removeExpense(period.id, expenseId)}
            />
          ))}

          {/* Add Button / Completion Card */}
          {!periods.length || calculateRemainingDebt(periods.length - 1) > 0 ? (
            <button
              onClick={addPeriod}
              className="flex-shrink-0 w-64 h-full border border-dashed border-neutral-800 rounded-2xl text-neutral-500 font-medium hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="p-2 rounded bg-neutral-800 group-hover:bg-indigo-500/20 transition-colors">
                <Plus size={24} />
              </div>
              <span className="text-sm">ADD NEXT PERIOD</span>
            </button>
          ) : (
            <div className="flex-shrink-0 w-80 h-full flex flex-col items-center justify-center p-8 text-center bg-emerald-950/10 rounded-2xl border border-emerald-500/20">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">Debt Free! 🎉</h2>
              <p className="text-emerald-500/80">Plan complete.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
