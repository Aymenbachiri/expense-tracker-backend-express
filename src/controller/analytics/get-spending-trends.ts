import Expense from '../../lib/models/expense-model';
import { getAuth } from '@clerk/express';
import { trendsAnalyticsSchema } from '../../lib/schemas/analytics-schema';
import type { Request, Response } from 'express';

export async function getSpendingTrends(
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

    const parse = trendsAnalyticsSchema.safeParse({ query: req.query });
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: parse.error.errors,
      });
      return;
    }

    const { startDate, endDate, period } = parse.data.query;
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
    if (!period) {
      res.status(400).json({
        success: false,
        message: 'Period is required',
      });
      return;
    }

    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 12);

    const queryStartDate = startDate ? new Date(startDate) : defaultStartDate;
    const queryEndDate = endDate ? new Date(endDate) : defaultEndDate;

    const matchCondition = {
      userId,
      date: { $gte: queryStartDate, $lte: queryEndDate },
    };

    let groupBy: any;
    let dateFormat: string;

    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
        };
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$date' },
          week: { $week: '$date' },
        };
        dateFormat = '%Y-W%U';
        break;
      case 'monthly':
      default:
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' },
        };
        dateFormat = '%Y-%m';
        break;
    }

    const spendingTrends = await Expense.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } },
    ]);

    const categoryTrends = await Expense.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { ...groupBy, category: '$category' },
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
          data: {
            $push: {
              period: '$_id',
              total: '$total',
              count: '$count',
            },
          },
        },
      },
      { $sort: { name: 1 } },
    ]);

    const trendAnalysis = {
      totalPeriods: spendingTrends.length,
      avgSpendingPerPeriod:
        spendingTrends.length > 0
          ? spendingTrends.reduce((sum, trend) => sum + trend.total, 0) /
            spendingTrends.length
          : 0,
      highestSpendingPeriod: spendingTrends.reduce(
        (max, trend) => (trend.total > max.total ? trend : max),
        { total: 0, _id: null },
      ),
      lowestSpendingPeriod: spendingTrends.reduce(
        (min, trend) => (trend.total < min.total ? trend : min),
        { total: Infinity, _id: null },
      ),
    };

    let growthRate = 0;
    if (spendingTrends.length >= 2) {
      const firstPeriod = spendingTrends[0];
      const lastPeriod = spendingTrends[spendingTrends.length - 1];
      growthRate =
        ((lastPeriod.total - firstPeriod.total) / firstPeriod.total) * 100;
    }

    const formattedTrends = spendingTrends.map((trend) => {
      let periodLabel: string;

      switch (period) {
        case 'daily':
          periodLabel = `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}-${String(trend._id.day).padStart(2, '0')}`;
          break;
        case 'weekly':
          periodLabel = `${trend._id.year}-W${String(trend._id.week).padStart(2, '0')}`;
          break;
        case 'monthly':
        default:
          periodLabel = `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`;
          break;
      }

      return {
        period: trend._id,
        periodLabel,
        total: trend.total,
        count: trend.count,
        avgAmount: trend.avgAmount,
        maxAmount: trend.maxAmount,
        minAmount: trend.minAmount,
      };
    });

    const movingAverages = formattedTrends.map((trend, index) => {
      if (index < 2) return { ...trend, movingAvg: null };

      const sum = formattedTrends
        .slice(index - 2, index + 1)
        .reduce((acc, t) => acc + t.total, 0);

      return {
        ...trend,
        movingAvg: sum / 3,
      };
    });

    const previousPeriodComparison = formattedTrends.map((trend, index) => {
      if (index === 0)
        return { ...trend, changeFromPrevious: null, changePercentage: null };

      const previousTrend = formattedTrends[index - 1];
      const change = trend.total - previousTrend.total;
      const changePercentage =
        previousTrend.total > 0 ? (change / previousTrend.total) * 100 : 0;

      return {
        ...trend,
        changeFromPrevious: change,
        changePercentage,
      };
    });

    const patterns = {
      consistentSpender: spendingTrends.every(
        (trend) =>
          Math.abs(trend.total - trendAnalysis.avgSpendingPerPeriod) /
            trendAnalysis.avgSpendingPerPeriod <
          0.2,
      ),
      increasingTrend: growthRate > 10,
      decreasingTrend: growthRate < -10,
      volatile: spendingTrends.some(
        (trend) =>
          Math.abs(trend.total - trendAnalysis.avgSpendingPerPeriod) /
            trendAnalysis.avgSpendingPerPeriod >
          0.5,
      ),
    };

    const trends = {
      period,
      dateRange: { startDate: queryStartDate, endDate: queryEndDate },
      summary: { ...trendAnalysis, growthRate, patterns },
      trends: formattedTrends,
      movingAverages,
      comparisons: previousPeriodComparison,
      categoryTrends,
    };

    res.status(200).json({
      success: true,
      data: trends,
      message: 'Spending trends retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get spending trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get spending trends',
    });
  }
}
