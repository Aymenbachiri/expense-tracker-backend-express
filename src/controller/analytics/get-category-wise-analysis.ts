import Expense from '../../lib/models/expense-model';
import Category from '../../lib/models/category-model';
import { getAuth } from '@clerk/express';
import { analyticsQuerySchema } from '../../lib/schemas/analytics-schema';
import type { Request, Response } from 'express';

export async function getCategoryWiseAnalysis(
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

    const { startDate, endDate } = parse.data.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchCondition: any = { userId };
    if (Object.keys(dateFilter).length > 0) {
      matchCondition.date = dateFilter;
    }

    const userCategories = await Category.find({ userId });
    if (!userCategories) {
      res.status(404).json({
        success: false,
        message: 'No categories found for user',
      });
      return;
    }

    const categoryAnalysis = await Expense.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
          expenses: {
            $push: {
              amount: '$amount',
              date: '$date',
              description: '$description',
            },
          },
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
          avgAmount: 1,
          maxAmount: 1,
          minAmount: 1,
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
          icon: '$categoryInfo.icon',
          expenses: { $slice: ['$expenses', -5] },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalSpent = categoryAnalysis.reduce(
      (sum, cat) => sum + cat.total,
      0,
    );

    const enhancedCategoryAnalysis = categoryAnalysis.map((category) => ({
      ...category,
      percentage: totalSpent > 0 ? (category.total / totalSpent) * 100 : 0,
      frequency: category.count,
      avgPerTransaction: category.avgAmount,
      highestTransaction: category.maxAmount,
      lowestTransaction: category.minAmount,
    }));

    const categoriesWithExpenses = categoryAnalysis.map((cat) =>
      cat._id.toString(),
    );
    const categoriesWithoutExpenses = userCategories
      .filter((cat) => !categoriesWithExpenses.includes(cat?._id?.toString()))
      .map((cat) => ({
        _id: cat._id,
        name: cat.name,
        total: 0,
        count: 0,
        avgAmount: 0,
        maxAmount: 0,
        minAmount: 0,
        percentage: 0,
        frequency: 0,
        avgPerTransaction: 0,
        highestTransaction: 0,
        lowestTransaction: 0,
        expenses: [],
      }));

    const allCategories = [
      ...enhancedCategoryAnalysis,
      ...categoriesWithoutExpenses,
    ];

    const topCategories = enhancedCategoryAnalysis.slice(0, 5);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const categoryTrends = await Expense.aggregate([
      {
        $match: { userId, date: { $gte: sixMonthsAgo } },
      },
      {
        $group: {
          _id: {
            category: '$category',
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: '$categoryInfo',
      },
      {
        $group: {
          _id: '$_id.category',
          name: { $first: '$categoryInfo.name' },
          color: { $first: '$categoryInfo.color' },
          monthlyData: {
            $push: {
              year: '$_id.year',
              month: '$_id.month',
              total: '$total',
              count: '$count',
            },
          },
        },
      },
      { $sort: { name: 1 } },
    ]);

    const summary = {
      totalCategories: userCategories.length,
      activeCategories: enhancedCategoryAnalysis.length,
      inactiveCategories: categoriesWithoutExpenses.length,
      totalSpent,
      avgSpentPerCategory:
        enhancedCategoryAnalysis.length > 0
          ? totalSpent / enhancedCategoryAnalysis.length
          : 0,
      mostExpensiveCategory: enhancedCategoryAnalysis[0] || null,
      leastExpensiveCategory:
        enhancedCategoryAnalysis[enhancedCategoryAnalysis.length - 1] || null,
    };

    const analysis = {
      summary,
      categories: allCategories,
      topCategories,
      trends: categoryTrends,
      period: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    };

    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Category-wise analysis retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get category-wise analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category-wise analysis',
    });
  }
}
