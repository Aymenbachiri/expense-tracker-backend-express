import { z } from 'zod';
import { Types } from 'mongoose';

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .positive('Amount must be greater than 0')
      .min(0.01, 'Amount must be at least 0.01')
      .max(999999.99, 'Amount cannot exceed 999,999.99'),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(1, 'Description cannot be empty')
      .max(200, 'Description cannot be more than 200 characters')
      .trim(),
    notes: z
      .string()
      .max(500, 'Notes cannot be more than 500 characters')
      .trim()
      .optional(),
    category: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid category ID format',
    }),
    date: z
      .string()
      .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
      .or(z.date())
      .transform((val) => new Date(val)),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z
      .number({
        invalid_type_error: 'Amount must be a number',
      })
      .positive('Amount must be greater than 0')
      .min(0.01, 'Amount must be at least 0.01')
      .max(999999.99, 'Amount cannot exceed 999,999.99')
      .optional(),
    description: z
      .string()
      .min(1, 'Description cannot be empty')
      .max(200, 'Description cannot be more than 200 characters')
      .trim()
      .optional(),
    notes: z
      .string()
      .max(500, 'Notes cannot be more than 500 characters')
      .trim()
      .optional(),
    category: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid category ID format',
      })
      .optional(),
    date: z
      .string()
      .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
      .or(z.date())
      .transform((val) => new Date(val))
      .optional(),
  }),
  params: z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'params.id must be a valid ObjectId in update expense',
    }),
  }),
});

export const getExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'params.id must be a valid ObjectId in get expense',
    }),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'params.id must be a valid ObjectId in delete expense',
    }),
  }),
});

export const getExpensesByCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message:
        'params.categoryId must be a valid ObjectId in get Expenses By Category',
    }),
  }),
});

export const getExpensesQuerySchema = z.object({
  query: z.object({
    startDate: z
      .string()
      .date('Invalid start date format. Use YYYY-MM-DD')
      .optional(),
    endDate: z
      .string()
      .date('Invalid end date format. Use YYYY-MM-DD')
      .optional(),
    category: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'categoryId must be a valid ObjectId in get expense query',
      })
      .optional(),
    minAmount: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => !isNaN(val) && val >= 0, 'Invalid minimum amount')
      .optional(),
    maxAmount: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => !isNaN(val) && val >= 0, 'Invalid maximum amount')
      .optional(),
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val > 0,
        'Page must be a positive integer',
      )
      .default('1'),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val > 0 && val <= 100,
        'Limit must be between 1 and 100',
      )
      .default('10'),
    sortBy: z
      .enum(['date', 'amount', 'category', 'description'])
      .default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const searchExpensesSchema = z.object({
  query: z.object({
    q: z
      .string({
        required_error: 'Search query is required',
      })
      .min(1, 'Search query cannot be empty')
      .max(100, 'Search query cannot be more than 100 characters')
      .trim(),
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val > 0,
        'Page must be a positive integer',
      )
      .default('1'),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine(
        (val) => !isNaN(val) && val > 0 && val <= 100,
        'Limit must be between 1 and 100',
      )
      .default('10'),
  }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body'];
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type GetExpenseInput = z.infer<typeof getExpenseSchema>['params'];
export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>['params'];
export type GetExpensesByCategoryInput = z.infer<
  typeof getExpensesByCategorySchema
>['params'];
export type GetExpensesQueryInput = z.infer<
  typeof getExpensesQuerySchema
>['query'];
export type SearchExpensesInput = z.infer<typeof searchExpensesSchema>['query'];
