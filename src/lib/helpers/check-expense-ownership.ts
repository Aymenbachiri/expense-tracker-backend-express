import Expense from '../models/expense-model';

export async function checkExpenseOwnership(expenseId: string, userId: string) {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  return expense;
}
