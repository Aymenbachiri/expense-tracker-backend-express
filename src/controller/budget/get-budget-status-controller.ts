import Budget from '../../lib/models/budget-model';
import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { getBudgetStatusSchema } from '../../lib/schemas/budget-schema';
import { Types } from 'mongoose';
import type { Request, Response } from 'express';

export async function getBudgetStatus(
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

    const parse = getBudgetStatusSchema.safeParse({ params: req.params });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { id } = parse.data.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Budget ID is required',
      });
      return;
    }
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid budget ID',
      });
      return;
    }

    const budget = await Budget.findOne({ _id: id, userId }).populate(
      'category',
      'name',
    );

    if (!budget) {
      res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
      return;
    }

    const totalSpent = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          category: budget.category._id,
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spentAmount = totalSpent.length > 0 ? totalSpent[0].total : 0;
    const remainingAmount = budget.amount - spentAmount;
    const percentageUsed =
      budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

    const status = {
      budget: {
        id: budget._id,
        name: budget.name,
        amount: budget.amount,
        category: budget.category,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        isActive: budget.isActive,
      },
      spent: spentAmount,
      remaining: remainingAmount,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      isOverBudget: spentAmount > budget.amount,
      daysRemaining: Math.max(
        0,
        Math.ceil(
          (budget.endDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      ),
    };

    res.status(200).json({
      success: true,
      data: status,
      message: 'Budget status retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get budget status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget status',
    });
  }
}
