import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { yearlyAnalyticsSchema } from '../../lib/schemas/analytics-schema';
import type { Request, Response } from 'express';

export async function getYearlyBreakdown(
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

    const parse = yearlyAnalyticsSchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { year } = parse.data.query;
    if (!year) {
      res.status(400).json({
        success: false,
        message: 'Year is required',
      });
      return;
    }

    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);

    const monthlyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const quarterlyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $addFields: {
          quarter: {
            $ceil: { $divide: [{ $month: '$date' }, 3] },
          },
        },
      },
      {
        $group: {
          _id: '$quarter',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
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
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
        },
      },
      { $sort: { total: -1 } },
    ]);

    const yearlySummary = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
        },
      },
    ]);

    const topSpendingMonths = monthlyBreakdown
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map((month) => ({
        ...month,
        monthName: new Date(targetYear, month._id - 1).toLocaleString(
          'default',
          { month: 'long' },
        ),
      }));

    const completeMonthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthData = monthlyBreakdown.find((m) => m._id === month);
      return {
        month,
        monthName: new Date(targetYear, index).toLocaleString('default', {
          month: 'long',
        }),
        total: monthData?.total || 0,
        count: monthData?.count || 0,
        avgAmount: monthData?.avgAmount || 0,
      };
    });

    const completeQuarterlyData = Array.from({ length: 4 }, (_, index) => {
      const quarter = index + 1;
      const quarterData = quarterlyBreakdown.find((q) => q._id === quarter);
      return {
        quarter,
        quarterName: `Q${quarter}`,
        total: quarterData?.total || 0,
        count: quarterData?.count || 0,
        avgAmount: quarterData?.avgAmount || 0,
      };
    });

    const breakdown = {
      year: targetYear,
      summary: yearlySummary[0] || {
        total: 0,
        count: 0,
        avgAmount: 0,
        maxAmount: 0,
        minAmount: 0,
      },
      monthlyBreakdown: completeMonthlyData,
      quarterlyBreakdown: completeQuarterlyData,
      categoryBreakdown,
      topSpendingMonths,
    };

    res.status(200).json({
      success: true,
      data: breakdown,
      message: 'Yearly breakdown retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get yearly breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get yearly breakdown',
    });
  }
}
