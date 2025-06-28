import Expense from '../../lib/models/expense-model';
import Budget from '../../lib/models/budget-model';
import { getAuth } from '@clerk/express';
import { analyticsQuerySchema } from '../../lib/schemas/analytics-schema';
import type { Request, Response } from 'express';

export async function getAnalyticsSummary(
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

    const parse = analyticsQuerySchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { startDate, endDate, categoryId } = parse.data.query;
    if (!startDate) {
      res.status(400).json({
        success: false,
        message: 'Start date is required',
      });
      return;
    }
    if (!endDate) {
      res.status(400).json({
        success: false,
        message: 'End date is required',
      });
      return;
    }
    if (!categoryId) {
      res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
      return;
    }

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchCondition: any = { userId };
    if (Object.keys(dateFilter).length > 0) {
      matchCondition.date = dateFilter;
    }
    if (categoryId) {
      matchCondition.category = categoryId;
    }

    const totalExpenses = await Expense.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    const expensesByCategory = await Expense.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: '$categoryInfo',
      },
      {
        $project: {
          _id: 1,
          total: 1,
          count: 1,
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
        },
      },
      { $sort: { total: -1 } },
    ]);

    const recentExpenses = await Expense.find(matchCondition)
      .populate('category', 'name color')
      .sort({ date: -1 })
      .limit(5);

    let budgetComparison = null;
    if (!startDate && !endDate) {
      const currentDate = new Date();
      const currentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      );

      const budgets = await Budget.find({
        userId,
        isActive: true,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      }).populate('category', 'name color');
      if (!budgets) {
        res.status(404).json({
          success: false,
          message: 'No budgets found',
        });
        return;
      }

      if (budgets.length > 0) {
        const budgetIds = budgets.map((b) => b.category);
        const monthlyExpenses = await Expense.aggregate([
          {
            $match: {
              userId,
              category: { $in: budgetIds },
              date: { $gte: currentMonth, $lt: nextMonth },
            },
          },
          {
            $group: {
              _id: '$category',
              spent: { $sum: '$amount' },
            },
          },
        ]);

        budgetComparison = budgets.map((budget) => {
          const spent =
            monthlyExpenses.find(
              (e) => e._id.toString() === budget.category._id.toString(),
            )?.spent || 0;
          const percentage = (spent / budget.amount) * 100;

          return {
            budget: budget,
            spent,
            remaining: budget.amount - spent,
            percentage: Math.round(percentage * 100) / 100,
            status:
              percentage >= 100
                ? 'exceeded'
                : percentage >= 80
                  ? 'warning'
                  : 'good',
          };
        });
      }
    }

    const summary = {
      totalExpenses: totalExpenses[0]?.total || 0,
      totalCount: totalExpenses[0]?.count || 0,
      avgExpense: totalExpenses[0]?.avgAmount || 0,
      expensesByCategory,
      recentExpenses,
      budgetComparison,
    };

    res.status(200).json({
      success: true,
      data: summary,
      message: 'Analytics summary retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get analytics summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics summary',
    });
  }
}
