import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required',
      })
      .min(3, 'Category name must be at least 3 characters long')
      .max(50, 'Category name cannot be more than 50 characters'),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required',
      })
      .min(3, 'Category name must be at least 3 characters long')
      .max(50, 'Category name cannot be more than 50 characters'),
  }),
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryInput = z.infer<typeof getCategorySchema>['params'];
