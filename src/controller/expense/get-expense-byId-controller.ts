import { getAuth } from '@clerk/express';
import { getExpenseSchema } from '../../lib/schemas/expense-schema';
import Expense from '../../lib/models/expense-model';
import type { Request, Response } from 'express';

export async function getExpense(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = getExpenseSchema.safeParse({ params: req.params });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { id } = parse.data.params;

    const expense = await Expense.findOne({ _id: id, userId })
      .populate('category', 'name')
      .lean();

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: expense,
      message: 'Expense retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expense',
    });
  }
}
