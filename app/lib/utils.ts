import { Period } from '@/app/types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getNextPeriodInfo = (lastPeriod?: Period) => {
  let year: number, month: number, periodType: 'first-half' | 'second-half';

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

  return { year, month, periodType, dateLabel };
};
