import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { searchExpensesSchema } from '../../lib/schemas/expense-schema';
import type { Request, Response } from 'express';

export async function searchExpenses(
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

    const parse = searchExpensesSchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { q, page, limit } = parse.data.query;
    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    if (!page) {
      res.status(400).json({
        success: false,
        message: 'Page number is required',
      });
      return;
    }

    if (!limit) {
      res.status(400).json({
        success: false,
        message: 'Limit is required',
      });
      return;
    }

    const filter = {
      userId,
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } },
      ],
    };

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate('category', 'name')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Expense.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        searchQuery: q,
      },
      message: 'Search completed successfully',
    });
  } catch (error) {
    console.error('Failed to search expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search expenses',
    });
  }
}
