import Category from '../../lib/models/category';
import { createCategorySchema } from '../../lib/schemas/category';
import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = getAuth(req);
    const categoryData = req.body;
    const parse = createCategorySchema.safeParse(categoryData);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const existingCategory = await Category.findOne({
      userId,
      name: categoryData.name,
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
      return;
    }

    const category = new Category({ ...categoryData, userId });

    await category.save();

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
}
