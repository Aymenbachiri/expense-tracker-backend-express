export function calculateBudgetPeriod(
  period: 'monthly' | 'weekly' | 'yearly',
  startDate?: Date,
): { startDate: Date; endDate: Date } {
  const start = startDate || new Date();
  const end = new Date(start);

  switch (period) {
    case 'weekly':
      end.setDate(start.getDate() + 7);
      break;
    case 'monthly':
      end.setMonth(start.getMonth() + 1);
      break;
    case 'yearly':
      end.setFullYear(start.getFullYear() + 1);
      break;
  }

  return { startDate: start, endDate: end };
}
