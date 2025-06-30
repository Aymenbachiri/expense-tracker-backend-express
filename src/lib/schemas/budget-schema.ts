import { Types } from 'mongoose';
import { z } from 'zod';

const budgetBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Budget name cannot be empty')
      .max(100, 'Budget name cannot be more than 100 characters'),
    amount: z
      .number()
      .positive('Budget amount must be greater than 0')
      .finite('Budget amount must be a valid number'),
    category: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid category ID format',
    }),
    period: z.enum(['monthly', 'weekly', 'yearly']).default('monthly'),
    startDate: z
      .string()
      .datetime('Invalid start date format')
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .datetime('Invalid end date format')
      .transform((val) => new Date(val)),
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const createBudgetSchema = z.object({ body: budgetBodySchema });

export const updateBudgetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Budget name cannot be empty')
      .max(100, 'Budget name cannot be more than 100 characters')
      .optional(),
    amount: z
      .number()
      .positive('Budget amount must be greater than 0')
      .finite('Budget amount must be a valid number')
      .optional(),
    category: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid category ID format',
      })
      .optional(),
    period: z.enum(['monthly', 'weekly', 'yearly']).optional(),
    startDate: z
      .string()
      .datetime('Invalid start date format')
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .datetime('Invalid end date format')
      .transform((val) => new Date(val))
      .optional(),
    isActive: z.boolean().optional(),
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid budget ID format',
    }),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );

export const getBudgetByIdSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid budget ID format',
  }),
});

export const deleteBudgetSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid budget ID format',
  }),
});

export const getBudgetStatusSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid budget ID format',
  }),
});
