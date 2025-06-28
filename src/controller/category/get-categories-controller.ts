import Category from 'src/lib/models/category';
import type { Request, Response } from 'express';

export async function getCategories(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const categories = await Category.find({ userId: req.auth.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch categories' });
  }
}
