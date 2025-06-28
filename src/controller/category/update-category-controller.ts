import { Types } from 'mongoose';
import Category from '../../lib/models/category';
import { updateCategorySchema } from '../../lib/schemas/category';
import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
      return;
    }
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid category ID' });
      return;
    }

    const parse = updateCategorySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, message: parse.error.errors });
      return;
    }

    const updateData = parse.data.body;
    if (updateData.name) {
      const existingCategory = await Category.findOne({
        userId,
        name: updateData.name,
        _id: { $ne: id },
      });

      if (existingCategory) {
        res.status(409).json({
          success: false,
          message: 'Category with this name already exists',
        });
        return;
      }
    }

    const updated = await Category.findOneAndUpdate(
      { _id: id, userId },
      { name: parse.data.body.name },
      { new: true },
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
    });
  }
}
