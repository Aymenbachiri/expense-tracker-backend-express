import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const monthlyAnalyticsSchema = z.object({
  query: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const yearlyAnalyticsSchema = z.object({
  query: z.object({
    year: z.string().optional(),
  }),
});

export const trendsAnalyticsSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    period: z
      .enum(['daily', 'weekly', 'monthly'])
      .optional()
      .default('monthly'),
  }),
});

export type AnalyticsQueryType = z.infer<typeof analyticsQuerySchema>;
export type MonthlyAnalyticsType = z.infer<typeof monthlyAnalyticsSchema>;
export type YearlyAnalyticsType = z.infer<typeof yearlyAnalyticsSchema>;
export type TrendsAnalyticsType = z.infer<typeof trendsAnalyticsSchema>;
