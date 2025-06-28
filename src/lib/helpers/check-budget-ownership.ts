import { Types } from 'mongoose';
import Budget from '../models/budget-model';

export async function checkBudgetOwnership(
  budgetId: string,
  userId: string,
): Promise<boolean> {
  try {
    if (!Types.ObjectId.isValid(budgetId)) {
      return false;
    }

    const budget = await Budget.findOne({
      _id: budgetId,
      userId: userId,
    });

    return !!budget;
  } catch (error) {
    console.error('Error checking budget ownership:', error);
    return false;
  }
}
