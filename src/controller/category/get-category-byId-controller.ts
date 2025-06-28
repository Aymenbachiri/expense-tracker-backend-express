import Category from 'src/lib/models/category';
import { Types } from 'mongoose';
import type { Request, Response } from 'express';

export async function getCategoryById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
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

    const category = await Category.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
}
