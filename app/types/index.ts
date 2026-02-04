export type Expense = {
  id: string;
  label: string;
  amount: number;
};

export type Period = {
  id: string;
  dateLabel: string;
  year: number;
  month: number;
  periodType: 'first-half' | 'second-half';
  income: number;
  expenses: Expense[];
  paymentToDebt: number;
};

export type DebtTrackerData = {
  initialDebt: number | '';
  isDebtSet: boolean;
  periods: Period[];
};
