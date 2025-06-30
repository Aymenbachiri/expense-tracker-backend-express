import Budget from '../../lib/models/budget-model';
import { getAuth } from '@clerk/express';
import { checkCategoryOwnership } from '../../lib/helpers/check-category-ownership';
import { updateBudgetSchema } from '../../lib/schemas/budget-schema';
import { Types } from 'mongoose';
import type { Request, Response } from 'express';

export async function updateBudget(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = updateBudgetSchema.safeParse({
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
    const updateData = parse.data;

    const existingBudget = await Budget.findOne({ _id: id, userId });
    if (!existingBudget) {
      res.status(404).json({
        success: false,
        message: 'Budget not found',
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

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true },
    ).populate('category', 'name');

    res.status(200).json({
      success: true,
      data: updatedBudget,
      message: 'Budget updated successfully',
    });
  } catch (error) {
    console.error('Failed to update budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget',
    });
  }
}
