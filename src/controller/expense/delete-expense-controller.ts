import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { deleteExpenseSchema } from '../../lib/schemas/expense-schema';
import { Types } from 'mongoose';
import type { Request, Response } from 'express';

export async function deleteExpense(
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

    const parse = deleteExpenseSchema.safeParse({ params: req.params });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { id } = parse.data;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Expense ID is required',
      });
      return;
    }
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid expense ID',
      });
      return;
    }

    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
    });
  }
}
