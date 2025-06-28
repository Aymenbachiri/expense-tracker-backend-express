import Budget from '../../lib/models/budget-model';
import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

export async function getAllBudgets(
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

    const budgets = await Budget.find({ userId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: budgets,
      message: 'Budgets retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get budgets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budgets',
    });
  }
}
