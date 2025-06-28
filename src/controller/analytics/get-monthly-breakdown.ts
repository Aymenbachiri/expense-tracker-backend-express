import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { monthlyAnalyticsSchema } from '../../lib/schemas/analytics-schema';
import type { Request, Response } from 'express';

export async function getMonthlyBreakdown(
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

    const parse = monthlyAnalyticsSchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { year, month } = parse.data.query;
    if (!year) {
      res.status(400).json({
        success: false,
        message: 'Year is required',
      });
      return;
    }
    if (!month) {
      res.status(400).json({
        success: false,
        message: 'Month is required',
      });
      return;
    }

    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const dailyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
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

    const weeklyBreakdown = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $week: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          startOfWeek: { $min: '$date' },
          endOfWeek: { $max: '$date' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlySummary = await Expense.aggregate([
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

    const daysInMonth = endDate.getDate();
    const completeDailyData = Array.from(
      { length: daysInMonth },
      (_, index) => {
        const day = index + 1;
        const dayData = dailyBreakdown.find((d) => d._id === day);
        return {
          day,
          total: dayData?.total || 0,
          count: dayData?.count || 0,
          date: new Date(targetYear, targetMonth, day),
        };
      },
    );

    const breakdown = {
      month: targetMonth + 1,
      year: targetYear,
      period: `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
      summary: monthlySummary[0] || {
        total: 0,
        count: 0,
        avgAmount: 0,
        maxAmount: 0,
        minAmount: 0,
      },
      dailyBreakdown: completeDailyData,
      weeklyBreakdown,
      categoryBreakdown,
    };

    res.status(200).json({
      success: true,
      data: breakdown,
      message: 'Monthly breakdown retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get monthly breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get monthly breakdown',
    });
  }
}
