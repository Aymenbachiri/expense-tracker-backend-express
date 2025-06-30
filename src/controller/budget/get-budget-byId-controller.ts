import Budget from '../../lib/models/budget-model';
import { getAuth } from '@clerk/express';
import { getBudgetByIdSchema } from '../../lib/schemas/budget-schema';
import { Types } from 'mongoose';
import type { Request, Response } from 'express';

export async function getBudget(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = getBudgetByIdSchema.safeParse({ params: req.params });
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

    res.status(200).json({
      success: true,
      data: budget,
      message: 'Budget retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget',
    });
  }
}
