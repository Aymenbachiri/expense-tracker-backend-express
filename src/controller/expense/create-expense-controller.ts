import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { createExpenseSchema } from '../../lib/schemas/expense-schema';
import { checkCategoryOwnership } from '../../lib/helpers/check-category-ownership';
import type { Request, Response } from 'express';

export async function createExpense(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = createExpenseSchema.safeParse({ body: req.body });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const expenseData = parse.data.body;

    const category = await checkCategoryOwnership(expenseData.category, userId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found or does not belong to user',
      });
      return;
    }

    const expense = new Expense({ ...expenseData, userId });
    await expense.save();

    await expense.populate('category', 'name');

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense created successfully',
    });
  } catch (error) {
    console.error('Failed to create expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
    });
  }
}
