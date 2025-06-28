import { getAuth } from '@clerk/express';
import { checkCategoryOwnership } from '../../lib/helpers/check-category-ownership';
import { getExpensesByCategorySchema } from '../../lib/schemas/expense-schema';
import Expense from '../../lib/models/expense-model';
import type { Request, Response } from 'express';

export async function getExpensesByCategory(
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

    const parse = getExpensesByCategorySchema.safeParse({ params: req.params });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { categoryId } = parse.data.params;
    if (!categoryId) {
      res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
      return;
    }

    const category = await checkCategoryOwnership(categoryId, userId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found or does not belong to user',
      });
      return;
    }

    const expenses = await Expense.find({ userId, category: categoryId })
      .populate('category', 'name')
      .sort({ date: -1 })
      .lean();

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    res.status(200).json({
      success: true,
      data: {
        expenses,
        category: category.name,
        totalAmount,
        count: expenses.length,
      },
      message: 'Expenses by category retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get expenses by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expenses by category',
    });
  }
}
