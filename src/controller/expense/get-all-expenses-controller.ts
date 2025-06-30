import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { getExpensesQuerySchema } from '../../lib/schemas/expense-schema';
import type { Request, Response } from 'express';

export async function getExpenses(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const parse = getExpensesQuerySchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const {
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      page,
      limit,
      sortBy,
      sortOrder,
    } = parse.data;

    const filter: any = { userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    if (category) {
      filter.category = category;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      filter.amount = {};
      if (minAmount !== undefined) filter.amount.$gte = minAmount;
      if (maxAmount !== undefined) filter.amount.$lte = maxAmount;
    }

    const sort: any = {};
    if (sortBy === 'category') {
      sort['category'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate('category', 'name')
        .sort(sort)
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
      },
      message: 'Expenses retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expenses',
    });
  }
}
