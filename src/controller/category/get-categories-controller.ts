import Category from '../../lib/models/category-model';
import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

export async function getCategories(
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
    const categories = await Category.find({ userId }).sort({
      createdAt: -1,
    });
    if (!categories) {
      res.status(404).json({
        success: false,
        message: 'No categories found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
}
