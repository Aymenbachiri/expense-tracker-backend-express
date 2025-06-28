import Category from 'src/lib/models/category';
import { createCategorySchema } from 'src/lib/schemas/category';
import type { Request, Response } from 'express';

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const categoryData = req.body;
  try {
    const parse = createCategorySchema.safeParse(categoryData);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const existingCategory = await Category.findOne({
      userId: req.auth.userId,
      name: categoryData.name,
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
      return;
    }

    const category = new Category({
      ...categoryData,
      userId: req.auth.userId,
    });

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
