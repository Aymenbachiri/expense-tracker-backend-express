import { getAuth } from '@clerk/express';
import { checkCategoryOwnership } from '../../lib/helpers/check-category-ownership';
import { checkExpenseOwnership } from '../../lib/helpers/check-expense-ownership';
import { updateExpenseSchema } from '../../lib/schemas/expense-schema';
import Expense from '../../lib/models/expense-model';
import type { Request, Response } from 'express';

export async function updateExpense(
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

    const parse = updateExpenseSchema.safeParse({
      body: req.body,
      params: req.params,
    });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { id } = parse.data.params;
    const updateData = parse.data.body;

    const existingExpense = await checkExpenseOwnership(id, userId);
    if (!existingExpense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
      return;
    }

    if (updateData.category) {
      const category = await checkCategoryOwnership(
        updateData.category,
        userId,
      );
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found or does not belong to user',
        });
        return;
      }
    }

    const expense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    res.status(200).json({
      success: true,
      data: expense,
      message: 'Expense updated successfully',
    });
  } catch (error) {
    console.error('Failed to update expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
    });
  }
}
