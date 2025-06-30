import swaggerJsdoc from 'swagger-jsdoc';
import type { OpenAPIV3 } from 'openapi-types';

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description:
      'A comprehensive expense tracking API with categories, expenses, and budgets management',
    contact: {
      name: 'API Support',
      email: 'aymen.bachiri99@gmail.com',
    },
  },
  servers: [
    {
      url: 'https://expense-tracker-backend-express.vercel.app/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Clerk authentication token. Get this from your Clerk session.',
      },
    },
    schemas: {
      Category: {
        type: 'object',
        required: ['name', 'userId'],
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB ObjectId',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            maxLength: 50,
            description: 'Category name',
            example: 'Food & Dining',
          },
          userId: {
            type: 'string',
            description: 'Clerk user ID',
            example: 'user_2abcdefghijklmnop',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:30:00.000Z',
          },
        },
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            maxLength: 50,
            description: 'Category name',
            example: 'Food & Dining',
          },
        },
      },
      UpdateCategoryRequest: {
        type: 'object',
        required: ['name', 'id'],
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            description: 'Updated category name',
            example: 'Restaurants & Dining',
          },
          id: {
            type: 'string',
            description: 'Category ID',
            example: '507f1f77bcf86cd799439011',
          },
        },
      },
      Expense: {
        type: 'object',
        required: ['amount', 'description', 'category', 'date'],
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          amount: { type: 'number', example: 49.99 },
          description: { type: 'string', example: 'Grocery shopping' },
          notes: { type: 'string', example: 'Bought fruits and veggies' },
          category: {
            type: 'string',
            description: 'Category ID',
            example: '507f1f77bcf86cd799439011',
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-06-30T12:00:00.000Z',
          },
          userId: { type: 'string', example: 'user_2abcdefghijklmnop' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateExpenseRequest: {
        type: 'object',
        required: ['amount', 'description', 'category', 'date'],
        properties: {
          amount: { type: 'number', example: 49.99 },
          description: { type: 'string', example: 'Grocery shopping' },
          notes: { type: 'string', example: 'Bought fruits and veggies' },
          category: { type: 'string', example: '507f1f77bcf86cd799439011' },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-30T12:00:00.000Z',
          },
        },
      },
      UpdateExpenseRequest: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 59.99 },
          description: { type: 'string', example: 'Updated description' },
          notes: { type: 'string', example: 'Updated notes' },
          category: { type: 'string', example: '507f1f77bcf86cd799439011' },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2025-07-01T10:00:00.000Z',
          },
        },
      },
      Budget: {
        type: 'object',
        required: [
          'name',
          'amount',
          'category',
          'period',
          'startDate',
          'endDate',
          'userId',
        ],
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB ObjectId',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Budget name',
            example: 'Monthly Groceries',
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Budget amount',
            example: 500.0,
          },
          category: {
            oneOf: [
              {
                type: 'string',
                description: 'Category ID (when not populated)',
                example: '507f1f77bcf86cd799439011',
              },
              {
                type: 'object',
                description: 'Populated category object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '507f1f77bcf86cd799439011',
                  },
                  name: {
                    type: 'string',
                    example: 'Food & Dining',
                  },
                },
              },
            ],
          },
          period: {
            type: 'string',
            enum: ['monthly', 'weekly', 'yearly'],
            description: 'Budget period',
            example: 'monthly',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Budget start date',
            example: '2025-01-01T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Budget end date',
            example: '2025-01-31T23:59:59.000Z',
          },
          userId: {
            type: 'string',
            description: 'Clerk user ID',
            example: 'user_2abcdefghijklmnop',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the budget is active',
            example: true,
            default: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2025-01-01T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2025-01-01T10:30:00.000Z',
          },
        },
      },
      CreateBudgetRequest: {
        type: 'object',
        required: ['name', 'amount', 'category', 'startDate', 'endDate'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Budget name',
            example: 'Monthly Groceries Budget',
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Budget amount (must be positive)',
            example: 500.0,
          },
          category: {
            type: 'string',
            description: 'Category ID (must be a valid MongoDB ObjectId)',
            example: '507f1f77bcf86cd799439011',
          },
          period: {
            type: 'string',
            enum: ['monthly', 'weekly', 'yearly'],
            description: 'Budget period',
            example: 'monthly',
            default: 'monthly',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Budget start date (ISO 8601 format)',
            example: '2025-01-01T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description:
              'Budget end date (ISO 8601 format, must be after start date)',
            example: '2025-01-31T23:59:59.000Z',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the budget is active',
            example: true,
            default: true,
          },
        },
      },
      UpdateBudgetRequest: {
        type: 'object',
        description:
          'Fields for updating an existing budget. All fields are optional.',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Updated budget name',
            example: 'Monthly Dining Out',
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Updated budget amount (must be positive)',
            example: 250.0,
          },
          category: {
            type: 'string',
            description:
              'Updated category ID (must be a valid MongoDB ObjectId)',
            example: '507f1f77bcf86cd799439011',
          },
          period: {
            type: 'string',
            enum: ['monthly', 'weekly', 'yearly'],
            description: 'Updated budget period',
            example: 'monthly',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Updated budget start date (ISO 8601 format)',
            example: '2025-08-01T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description:
              'Updated budget end date (ISO 8601 format, must be after start date)',
            example: '2025-08-31T23:59:59.000Z',
          },
          isActive: {
            type: 'boolean',
            description: 'Update whether the budget is active',
            example: false,
          },
        },
      },
      AnalyticsSummary: {
        type: 'object',
        properties: {
          totalExpenses: {
            type: 'number',
            description: 'The total sum of all expenses matching the query.',
            example: 1250.75,
          },
          totalCount: {
            type: 'number',
            description: 'The total number of expenses matching the query.',
            example: 15,
          },
          avgExpense: {
            type: 'number',
            description: 'The average amount of an expense matching the query.',
            example: 83.38,
          },
          expensesByCategory: {
            type: 'array',
            description: 'An array of expenses grouped by category.',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Category ID.',
                  example: '507f1f77bcf86cd799439011',
                },
                total: {
                  type: 'number',
                  description: 'Total amount spent in this category.',
                  example: 500,
                },
                count: {
                  type: 'number',
                  description: 'Number of expenses in this category.',
                  example: 5,
                },
                name: {
                  type: 'string',
                  description: 'Name of the category.',
                  example: 'Groceries',
                },
                color: {
                  type: 'string',
                  description: 'Color associated with the category.',
                  example: '#FF5733',
                },
              },
            },
          },
          recentExpenses: {
            type: 'array',
            description:
              'A list of the 5 most recent expenses matching the query.',
            items: {
              $ref: '#/components/schemas/Expense',
            },
          },
          budgetComparison: {
            type: 'array',
            nullable: true,
            description:
              'A comparison of expenses against active budgets for the current month. This is null if a date range is provided.',
            items: {
              type: 'object',
              properties: {
                budget: { $ref: '#/components/schemas/Budget' },
                spent: {
                  type: 'number',
                  description: 'Total amount spent against this budget.',
                  example: 250,
                },
                remaining: {
                  type: 'number',
                  description: 'Remaining amount in this budget.',
                  example: 250,
                },
                percentage: {
                  type: 'number',
                  description: 'Percentage of the budget that has been spent.',
                  example: 50,
                },
                status: {
                  type: 'string',
                  enum: ['good', 'warning', 'exceeded'],
                  description: 'The status of the budget based on spending.',
                  example: 'good',
                },
              },
            },
          },
        },
      },
      MonthlyBreakdown: {
        type: 'object',
        description: 'A detailed breakdown of expenses for a given month.',
        properties: {
          month: {
            type: 'number',
            description: 'The month number (1-12).',
            example: 6,
          },
          year: {
            type: 'number',
            description: 'The year.',
            example: 2025,
          },
          period: {
            type: 'string',
            description: 'The formatted period string (YYYY-MM).',
            example: '2025-06',
          },
          summary: {
            type: 'object',
            description: 'A summary of all expenses within the month.',
            properties: {
              total: { type: 'number', example: 5432.1 },
              count: { type: 'number', example: 45 },
              avgAmount: { type: 'number', example: 120.71 },
              maxAmount: { type: 'number', example: 800 },
              minAmount: { type: 'number', example: 5.5 },
            },
          },
          dailyBreakdown: {
            type: 'array',
            description:
              'An array showing total expenses for each day of the month.',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'number',
                  description: 'The day of the month.',
                  example: 15,
                },
                total: {
                  type: 'number',
                  description: 'Total expenses for that day.',
                  example: 350,
                },
                count: {
                  type: 'number',
                  description: 'Number of transactions for that day.',
                  example: 3,
                },
                date: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The full date object for the day.',
                  example: '2025-06-15T00:00:00.000Z',
                },
              },
            },
          },
          weeklyBreakdown: {
            type: 'array',
            description:
              'An array showing total expenses for each week of the month.',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'number',
                  description: 'The week number of the year.',
                  example: 24,
                },
                total: {
                  type: 'number',
                  description: 'Total expenses for that week.',
                  example: 1200,
                },
                count: {
                  type: 'number',
                  description: 'Number of transactions for that week.',
                  example: 10,
                },
                startOfWeek: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The start date of that week.',
                },
                endOfWeek: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The end date of that week.',
                },
              },
            },
          },
          categoryBreakdown: {
            type: 'array',
            description: 'A breakdown of expenses by category for the month.',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Category ID.',
                  example: '507f1f77bcf86cd799439011',
                },
                total: { type: 'number', example: 1500 },
                count: { type: 'number', example: 12 },
                avgAmount: { type: 'number', example: 125 },
                name: {
                  type: 'string',
                  description: 'Name of the category.',
                  example: 'Rent',
                },
                color: {
                  type: 'string',
                  description: 'Color of the category.',
                  example: '#4A90E2',
                },
              },
            },
          },
        },
      },
      YearlyBreakdown: {
        type: 'object',
        description: 'A detailed breakdown of expenses for a given year.',
        properties: {
          year: {
            type: 'number',
            description: 'The year of the report.',
            example: 2025,
          },
          summary: {
            type: 'object',
            description: 'An overall summary of all expenses for the year.',
            properties: {
              total: { type: 'number', example: 65432.1 },
              count: { type: 'number', example: 540 },
              avgAmount: { type: 'number', example: 121.17 },
              maxAmount: { type: 'number', example: 1200 },
              minAmount: { type: 'number', example: 2.5 },
            },
          },
          monthlyBreakdown: {
            type: 'array',
            description:
              'A list of expense summaries for each month of the year.',
            items: {
              type: 'object',
              properties: {
                month: {
                  type: 'number',
                  description: 'The month number (1-12).',
                  example: 6,
                },
                monthName: {
                  type: 'string',
                  description: 'The full name of the month.',
                  example: 'June',
                },
                total: { type: 'number', example: 5432.1 },
                count: { type: 'number', example: 45 },
                avgAmount: { type: 'number', example: 120.71 },
              },
            },
          },
          quarterlyBreakdown: {
            type: 'array',
            description:
              'A list of expense summaries for each quarter of the year.',
            items: {
              type: 'object',
              properties: {
                quarter: {
                  type: 'number',
                  description: 'The quarter number (1-4).',
                  example: 2,
                },
                quarterName: {
                  type: 'string',
                  description: 'The name of the quarter.',
                  example: 'Q2',
                },
                total: { type: 'number', example: 15000 },
                count: { type: 'number', example: 130 },
                avgAmount: { type: 'number', example: 115.38 },
              },
            },
          },
          categoryBreakdown: {
            type: 'array',
            description:
              'A breakdown of total expenses by category for the year.',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                total: { type: 'number', example: 18000 },
                count: { type: 'number', example: 150 },
                avgAmount: { type: 'number', example: 120 },
                name: { type: 'string', example: 'Utilities' },
                color: { type: 'string', example: '#F5A623' },
              },
            },
          },
          topSpendingMonths: {
            type: 'array',
            description: 'The top 3 spending months of the year.',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'number',
                  description: 'Month number (1-12).',
                  example: 12,
                },
                total: { type: 'number', example: 8500 },
                count: { type: 'number', example: 60 },
                avgAmount: { type: 'number', example: 141.67 },
                monthName: { type: 'string', example: 'December' },
              },
            },
          },
        },
      },
      CategoryAnalysisDetail: {
        type: 'object',
        description: 'Detailed analysis for a single category.',
        properties: {
          _id: {
            type: 'string',
            description: 'The category ID.',
            example: '507f1f77bcf86cd799439011',
          },
          name: { type: 'string', example: 'Groceries' },
          color: { type: 'string', nullable: true, example: '#4CAF50' },
          icon: { type: 'string', nullable: true, example: 'shopping_cart' },
          total: {
            type: 'number',
            description: 'Total amount spent in this category.',
            example: 1234.56,
          },
          count: {
            type: 'number',
            description: 'Total number of transactions.',
            example: 25,
          },
          avgAmount: {
            type: 'number',
            description: 'Average transaction amount.',
            example: 49.38,
          },
          maxAmount: { type: 'number', example: 150.0 },
          minAmount: { type: 'number', example: 5.25 },
          percentage: {
            type: 'number',
            description:
              'The percentage this category represents out of the total spending in the period.',
            example: 22.5,
          },
          expenses: {
            type: 'array',
            description: 'A list of up to 5 recent expenses for this category.',
            items: {
              type: 'object',
              properties: {
                amount: { type: 'number', example: 75.2 },
                date: { type: 'string', format: 'date-time' },
                description: { type: 'string', example: 'Weekly grocery run' },
              },
            },
          },
        },
      },
      CategoryTrend: {
        type: 'object',
        description:
          'Spending trend data for a category over the last 6 months.',
        properties: {
          _id: {
            type: 'string',
            description: 'The category ID.',
            example: '507f1f77bcf86cd799439011',
          },
          name: { type: 'string', example: 'Groceries' },
          color: { type: 'string', nullable: true, example: '#4CAF50' },
          monthlyData: {
            type: 'array',
            description: 'Monthly spending totals for this category.',
            items: {
              type: 'object',
              properties: {
                year: { type: 'number', example: 2025 },
                month: { type: 'number', example: 6 },
                total: { type: 'number', example: 250.75 },
                count: { type: 'number', example: 5 },
              },
            },
          },
        },
      },
      CategoryWiseAnalysisSummary: {
        type: 'object',
        description: 'A high-level summary of the category analysis.',
        properties: {
          totalCategories: {
            type: 'number',
            description: 'The total number of categories the user has.',
            example: 12,
          },
          activeCategories: {
            type: 'number',
            description:
              'The number of categories with expenses in the period.',
            example: 9,
          },
          inactiveCategories: {
            type: 'number',
            description:
              'The number of categories with no expenses in the period.',
            example: 3,
          },
          totalSpent: {
            type: 'number',
            description: 'The total amount spent across all categories.',
            example: 5486.94,
          },
          avgSpentPerCategory: {
            type: 'number',
            description: 'The average amount spent per active category.',
            example: 609.66,
          },
          mostExpensiveCategory: {
            $ref: '#/components/schemas/CategoryAnalysisDetail',
            nullable: true,
            description: 'The category with the highest total spending.',
          },
          leastExpensiveCategory: {
            $ref: '#/components/schemas/CategoryAnalysisDetail',
            nullable: true,
            description: 'The active category with the lowest total spending.',
          },
        },
      },
      CategoryWiseAnalysis: {
        type: 'object',
        description: 'The main data object for the category-wise analysis.',
        properties: {
          summary: {
            $ref: '#/components/schemas/CategoryWiseAnalysisSummary',
          },
          categories: {
            type: 'array',
            description:
              'An array containing analysis for all user categories (both active and inactive).',
            items: { $ref: '#/components/schemas/CategoryAnalysisDetail' },
          },
          topCategories: {
            type: 'array',
            description: 'The top 5 spending categories.',
            items: { $ref: '#/components/schemas/CategoryAnalysisDetail' },
          },
          trends: {
            type: 'array',
            description:
              'Spending trends for all categories over the last 6 months.',
            items: { $ref: '#/components/schemas/CategoryTrend' },
          },
          period: {
            type: 'object',
            description: 'The date range used for the analysis.',
            properties: {
              startDate: {
                type: 'string',
                format: 'date-time',
                nullable: true,
              },
              endDate: { type: 'string', format: 'date-time', nullable: true },
            },
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            description: 'Response message',
          },
          data: {
            description: 'Response data (varies by endpoint)',
          },
          count: {
            type: 'number',
            description: 'Number of items returned (for list endpoints)',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            description: 'Error message',
            example: 'An error occurred',
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Validation error',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'name',
                },
                message: {
                  type: 'string',
                  example: 'Name is required',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              message: 'Unauthorized',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              message: 'Resource not found',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
      ConflictError: {
        description: 'Resource conflict (duplicate)',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              message: 'Category with this name already exists',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              message: 'Internal server error',
            },
          },
        },
      },
    },
  },
  security: [{ ClerkAuth: [] }],
  tags: [
    {
      name: 'Categories',
      description: 'Category management endpoints',
    },
    {
      name: 'Expenses',
      description: 'Expense management endpoints',
    },
    {
      name: 'Budgets',
      description: 'Budget management endpoints',
    },
    {
      name: 'Analytics',
      description: 'Endpoints for data analysis and summaries',
    },
    {
      name: 'Home',
      description: 'Home and general endpoints',
    },
  ],
  paths: {
    '/category': {
      get: {
        summary: 'Get all categories for authenticated user',
        description:
          'Retrieves all categories belonging to the authenticated user, sorted by creation date (newest first)',
        tags: ['Categories'],
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': {
            description: 'Categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Category',
                      },
                    },
                    count: {
                      type: 'number',
                      example: 5,
                    },
                  },
                },
                example: {
                  success: true,
                  data: [
                    {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                      userId: 'user_2abcdefghijklmnop',
                      createdAt: '2024-01-15T10:30:00.000Z',
                      updatedAt: '2024-01-15T10:30:00.000Z',
                    },
                  ],
                  count: 1,
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'No categories found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'No categories found',
                },
              },
            },
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      post: {
        summary: 'Create a new category',
        description:
          'Creates a new category for the authenticated user. Category names must be unique per user.',
        tags: ['Categories'],
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCategoryRequest',
              },
              example: {
                name: 'Food & Dining',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Category created successfully',
                    },
                    data: {
                      $ref: '#/components/schemas/Category',
                    },
                  },
                },
                example: {
                  success: true,
                  message: 'Category created successfully',
                  data: {
                    _id: '507f1f77bcf86cd799439011',
                    name: 'Food & Dining',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2024-01-15T10:30:00.000Z',
                    updatedAt: '2024-01-15T10:30:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '409': {
            $ref: '#/components/responses/ConflictError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/category/{id}': {
      get: {
        summary: 'Get a single category by its ID',
        description:
          'Retrieves a single category belonging to the authenticated user by MongoDB ObjectId.',
        tags: ['Categories'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the category',
              example: '507f1f77bcf86cd799439011',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Category retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
                example: {
                  success: true,
                  data: {
                    _id: '507f1f77bcf86cd799439011',
                    name: 'Food & Dining',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2024-01-15T10:30:00.000Z',
                    updatedAt: '2024-01-15T10:30:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            $ref: '#/components/responses/NotFoundError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      put: {
        summary: 'Update a category by its ID',
        description:
          'Updates an existing category belonging to the authenticated user. Category names must be unique per user.',
        tags: ['Categories'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the category',
              example: '507f1f77bcf86cd799439011',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCategoryRequest',
              },
              example: {
                name: 'Restaurants & Dining',
                id: '507f1f77bcf86cd799439011',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Category updated successfully',
                    },
                    data: {
                      $ref: '#/components/schemas/Category',
                    },
                  },
                },
                example: {
                  success: true,
                  message: 'Category updated successfully',
                  data: {
                    _id: '507f1f77bcf86cd799439011',
                    name: 'Restaurants & Dining',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2024-01-15T10:30:00.000Z',
                    updatedAt: '2024-01-15T12:45:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - Invalid ID or validation error',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/ErrorResponse',
                    },
                    {
                      $ref: '#/components/schemas/ValidationError',
                    },
                  ],
                },
                examples: {
                  validationError: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'too_small',
                          minimum: 3,
                          type: 'string',
                          inclusive: true,
                          exact: false,
                          message:
                            'Category name must be at least 3 characters long',
                          path: ['name'],
                        },
                        {
                          code: 'invalid_type',
                          expected: 'string',
                          received: 'undefined',
                          message: 'Category ID is required',
                          path: ['id'],
                        },
                      ],
                    },
                  },
                  missingFields: {
                    summary: 'Missing required fields',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'invalid_type',
                          expected: 'string',
                          received: 'undefined',
                          message: 'Category name is required',
                          path: ['name'],
                        },
                        {
                          code: 'invalid_type',
                          expected: 'string',
                          received: 'undefined',
                          message: 'Category ID is required',
                          path: ['id'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Category not found',
                },
              },
            },
          },
          '409': {
            description: 'Category name already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Category with this name already exists',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Failed to update category',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a category by its ID',
        description:
          'Permanently deletes a category belonging to the authenticated user. This action cannot be undone.',
        tags: ['Categories'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the category to delete',
              example: '507f1f77bcf86cd799439011',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Category deleted successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'ID of the deleted category',
                          example: '507f1f77bcf86cd799439011',
                        },
                      },
                    },
                  },
                },
                example: {
                  success: true,
                  message: 'Category deleted successfully',
                  data: {
                    id: '507f1f77bcf86cd799439011',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - Invalid or missing category ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  missingId: {
                    summary: 'Missing category ID',
                    value: {
                      success: false,
                      message: 'Category ID is required',
                    },
                  },
                  invalidId: {
                    summary: 'Invalid category ID format',
                    value: {
                      success: false,
                      message: 'Invalid category ID',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Category not found',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Failed to delete category',
                },
              },
            },
          },
        },
      },
    },
    '/expenses/search': {
      get: {
        summary: 'Search expenses by query',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Search completed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        expenses: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Expense' },
                        },
                        pagination: { type: 'object' },
                        searchQuery: { type: 'string' },
                      },
                    },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/expenses/by-category/{categoryId}': {
      get: {
        summary: 'Get expenses by category',
        description:
          'Retrieves all expenses for a specific category belonging to the authenticated user, including category name, total amount, and expense count',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'categoryId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the category',
              example: '507f1f77bcf86cd799439011',
            },
            description: 'Category ID to filter expenses by',
          },
        ],
        responses: {
          '200': {
            description: 'Expenses by category retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        expenses: {
                          type: 'array',
                          items: {
                            allOf: [
                              { $ref: '#/components/schemas/Expense' },
                              {
                                type: 'object',
                                properties: {
                                  category: {
                                    type: 'object',
                                    properties: {
                                      name: {
                                        type: 'string',
                                        example: 'Food & Dining',
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                        category: {
                          type: 'string',
                          description: 'Category name',
                          example: 'Food & Dining',
                        },
                        totalAmount: {
                          type: 'number',
                          description:
                            'Total amount of all expenses in this category',
                          example: 245.67,
                        },
                        count: {
                          type: 'number',
                          description: 'Number of expenses in this category',
                          example: 5,
                        },
                      },
                    },
                    message: {
                      type: 'string',
                      example: 'Expenses by category retrieved successfully',
                    },
                  },
                },
                example: {
                  success: true,
                  data: {
                    expenses: [
                      {
                        _id: '507f1f77bcf86cd799439012',
                        amount: 49.99,
                        description: 'Grocery shopping',
                        notes: 'Weekly groceries',
                        category: {
                          name: 'Food & Dining',
                        },
                        date: '2024-06-30T12:00:00.000Z',
                        userId: 'user_2abcdefghijklmnop',
                        createdAt: '2024-06-30T12:00:00.000Z',
                        updatedAt: '2024-06-30T12:00:00.000Z',
                      },
                      {
                        _id: '507f1f77bcf86cd799439013',
                        amount: 25.5,
                        description: 'Coffee shop',
                        category: {
                          name: 'Food & Dining',
                        },
                        date: '2024-06-29T08:30:00.000Z',
                        userId: 'user_2abcdefghijklmnop',
                        createdAt: '2024-06-29T08:30:00.000Z',
                        updatedAt: '2024-06-29T08:30:00.000Z',
                      },
                    ],
                    category: 'Food & Dining',
                    totalAmount: 75.49,
                    count: 2,
                  },
                  message: 'Expenses by category retrieved successfully',
                },
              },
            },
          },
          '400': {
            description: 'Bad request - Invalid category ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  invalidId: {
                    summary: 'Invalid category ID format',
                    value: {
                      success: false,
                      message: 'Invalid category ID',
                    },
                  },
                  missingId: {
                    summary: 'Missing category ID',
                    value: {
                      success: false,
                      message: 'Category ID is required',
                    },
                  },
                  validationError: {
                    summary: 'Validation error from Zod schema',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'custom',
                          message:
                            'params.categoryId must be a valid ObjectId in get Expenses By Category',
                          path: ['categoryId'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'Category not found or no expenses found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  categoryNotFound: {
                    summary: 'Category not found or does not belong to user',
                    value: {
                      success: false,
                      message: 'Category not found or does not belong to user',
                    },
                  },
                  noExpenses: {
                    summary: 'No expenses found for this category',
                    value: {
                      success: false,
                      message: 'No expenses found',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Failed to get expenses by category',
                },
              },
            },
          },
        },
      },
    },
    '/expenses': {
      get: {
        summary: 'Get expenses with filters and pagination',
        description:
          'Retrieves a paginated list of expenses for the authenticated user. Supports filtering by date range, category, amount, and sorting.',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'date' },
            description: 'Start date filter (YYYY-MM-DD)',
          },
          {
            name: 'endDate',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'date' },
            description: 'End date filter (YYYY-MM-DD)',
          },
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Category ID filter',
          },
          {
            name: 'minAmount',
            in: 'query',
            required: false,
            schema: { type: 'number' },
            description: 'Minimum amount filter',
          },
          {
            name: 'maxAmount',
            in: 'query',
            required: false,
            schema: { type: 'number' },
            description: 'Maximum amount filter',
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 10 },
            description: 'Items per page',
          },
          {
            name: 'sortBy',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['date', 'amount', 'category', 'description'],
              default: 'date',
            },
            description: 'Sort by field',
          },
          {
            name: 'sortOrder',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Sort order (asc or desc)',
          },
        ],
        responses: {
          '200': {
            description: 'Expenses retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  data: {
                    expenses: [
                      {
                        _id: '60d5ec49fa2b5c001c8d4f1a',
                        amount: 49.99,
                        description: 'Grocery shopping',
                        notes: 'Bought fruits and veggies',
                        category: '60d5ea8dfa2b5c001c8d4f19',
                        date: '2025-06-29T12:00:00.000Z',
                        userId: 'user_2abcdefghijklmnop',
                        createdAt: '2025-06-29T12:05:00.000Z',
                        updatedAt: '2025-06-29T12:05:00.000Z',
                      },
                      {
                        _id: '60d5ec61fa2b5c001c8d4f1b',
                        amount: 25.5,
                        description: 'Coffee shop',
                        notes: null,
                        category: '60d5ea8dfa2b5c001c8d4f19',
                        date: '2025-06-28T08:30:00.000Z',
                        userId: 'user_2abcdefghijklmnop',
                        createdAt: '2025-06-28T08:31:00.000Z',
                        updatedAt: '2025-06-28T08:31:00.000Z',
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 3,
                      totalItems: 25,
                      itemsPerPage: 10,
                      hasNextPage: true,
                      hasPrevPage: false,
                    },
                  },
                  message: 'Expenses retrieved successfully',
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      post: {
        summary: 'Create a new expense',
        description: 'Creates a new expense record for the authenticated user.',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateExpenseRequest' },
              example: {
                amount: 49.99,
                description: 'Grocery shopping',
                notes: 'Weekly fruits',
                category: '507f1f77bcf86cd799439011',
                date: '2025-06-30T12:00:00.000Z',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Expense created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  data: {
                    _id: '60d5ec49fa2b5c001c8d4f1a',
                    amount: 49.99,
                    description: 'Grocery shopping',
                    notes: 'Weekly fruits',
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    date: '2025-06-30T12:00:00.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2025-06-30T12:05:00.000Z',
                    updatedAt: '2025-06-30T12:05:00.000Z',
                  },
                  message: 'Expense created successfully',
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': {
            description: 'Category not found or unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Category not found or does not belong to user',
                },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/expenses/{id}': {
      get: {
        summary: 'Get a single expense by ID',
        description:
          'Retrieves a single expense record belonging to the authenticated user by its MongoDB ObjectId.',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the expense',
            },
            description: 'Expense ID to retrieve',
          },
        ],
        responses: {
          '200': {
            description: 'Expense retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  data: {
                    _id: '60d5ec49fa2b5c001c8d4f1a',
                    amount: 49.99,
                    description: 'Grocery shopping',
                    notes: 'Bought fruits and veggies',
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    date: '2025-06-29T12:00:00.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2025-06-29T12:05:00.000Z',
                    updatedAt: '2025-06-29T12:05:00.000Z',
                  },
                  message: 'Expense retrieved successfully',
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': {
            description: 'Expense not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, message: 'Expense not found' },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      put: {
        summary: 'Update an existing expense',
        description:
          'Updates fields of an existing expense belonging to the authenticated user.',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the expense',
            },
            description: 'Expense ID to update',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateExpenseRequest' },
              example: {
                amount: 59.99,
                description: 'Groceries and snacks',
                notes: 'Included weekend treats',
                category: '507f1f77bcf86cd799439011',
                date: '2025-07-01T10:00:00.000Z',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Expense updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  data: {
                    _id: '60d5ec49fa2b5c001c8d4f1a',
                    amount: 59.99,
                    description: 'Groceries and snacks',
                    notes: 'Included weekend treats',
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    date: '2025-07-01T10:00:00.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    createdAt: '2025-06-29T12:05:00.000Z',
                    updatedAt: '2025-07-01T10:05:00.000Z',
                  },
                  message: 'Expense updated successfully',
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': {
            description: 'Expense or category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, message: 'Expense not found' },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      delete: {
        summary: 'Delete an expense',
        description:
          'Permanently deletes an expense belonging to the authenticated user.',
        tags: ['Expenses'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              description: 'MongoDB ObjectId of the expense',
            },
            description: 'Expense ID to delete',
          },
        ],
        responses: {
          '200': {
            description: 'Expense deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  message: 'Expense deleted successfully',
                  data: { id: '60d5ec49fa2b5c001c8d4f1a' },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': {
            description: 'Expense not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, message: 'Expense not found' },
              },
            },
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/budgets': {
      get: {
        summary: 'Get all budgets for authenticated user',
        description:
          'Retrieves all budgets belonging to the authenticated user with populated category names, sorted by creation date (newest first)',
        tags: ['Budgets'],
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': {
            description: 'Budgets retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Budget',
                      },
                    },
                    message: {
                      type: 'string',
                      example: 'Budgets retrieved successfully',
                    },
                  },
                },
                example: {
                  success: true,
                  data: [
                    {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Monthly Groceries',
                      amount: 500.0,
                      category: {
                        _id: '507f1f77bcf86cd799439012',
                        name: 'Food & Dining',
                      },
                      period: 'monthly',
                      startDate: '2025-01-01T00:00:00.000Z',
                      endDate: '2025-01-31T23:59:59.000Z',
                      userId: 'user_2abcdefghijklmnop',
                      isActive: true,
                      createdAt: '2025-01-01T10:30:00.000Z',
                      updatedAt: '2025-01-01T10:30:00.000Z',
                    },
                    {
                      _id: '507f1f77bcf86cd799439013',
                      name: 'Weekly Entertainment',
                      amount: 100.0,
                      category: {
                        _id: '507f1f77bcf86cd799439014',
                        name: 'Entertainment',
                      },
                      period: 'weekly',
                      startDate: '2025-01-01T00:00:00.000Z',
                      endDate: '2025-01-07T23:59:59.000Z',
                      userId: 'user_2abcdefghijklmnop',
                      isActive: true,
                      createdAt: '2024-12-30T15:20:00.000Z',
                      updatedAt: '2024-12-30T15:20:00.000Z',
                    },
                  ],
                  message: 'Budgets retrieved successfully',
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Failed to get budgets',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new budget',
        description:
          'Creates a new budget for the authenticated user. Validates that the category belongs to the user and no overlapping active budget exists for the same category and period.',
        tags: ['Budgets'],
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBudgetRequest',
              },
              example: {
                name: 'Monthly Groceries Budget',
                amount: 500.0,
                category: '507f1f77bcf86cd799439011',
                period: 'monthly',
                startDate: '2025-01-01T00:00:00.000Z',
                endDate: '2025-01-31T23:59:59.000Z',
                isActive: true,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Budget created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/Budget',
                    },
                    message: {
                      type: 'string',
                      example: 'Budget created successfully',
                    },
                  },
                },
                example: {
                  success: true,
                  data: {
                    _id: '507f1f77bcf86cd799439015',
                    name: 'Monthly Groceries Budget',
                    amount: 500.0,
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    period: 'monthly',
                    startDate: '2025-01-01T00:00:00.000Z',
                    endDate: '2025-01-31T23:59:59.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    isActive: true,
                    createdAt: '2025-01-01T10:30:00.000Z',
                    updatedAt: '2025-01-01T10:30:00.000Z',
                  },
                  message: 'Budget created successfully',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          message: { type: 'string' },
                          path: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    },
                  },
                },
                examples: {
                  validationError: {
                    summary: 'Validation errors from Zod schema',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'too_small',
                          minimum: 1,
                          type: 'string',
                          inclusive: true,
                          exact: false,
                          message: 'Budget name cannot be empty',
                          path: ['name'],
                        },
                        {
                          code: 'too_small',
                          minimum: 0,
                          type: 'number',
                          inclusive: false,
                          exact: false,
                          message: 'Budget amount must be greater than 0',
                          path: ['amount'],
                        },
                        {
                          code: 'custom',
                          message: 'End date must be after start date',
                          path: ['endDate'],
                        },
                      ],
                    },
                  },
                  invalidCategoryId: {
                    summary: 'Invalid category ID format',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'custom',
                          message: 'Invalid category ID format',
                          path: ['category'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'Category not found or does not belong to user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Category not found or does not belong to user',
                },
              },
            },
          },
          '409': {
            description: 'Budget conflict - overlapping active budget exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message:
                    'An active budget already exists for this category in the specified period',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Failed to create budget',
                },
              },
            },
          },
        },
      },
    },
    '/budget/{id}': {
      get: {
        summary: 'Get a single budget by its ID',
        description:
          "Retrieves a single budget belonging to the authenticated user by its MongoDB ObjectId. The budget's category is populated with its name.",
        tags: ['Budgets'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The MongoDB ObjectId of the budget to retrieve.',
            schema: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Budget retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Budget' },
                  },
                },
                example: {
                  success: true,
                  message: 'Budget retrieved successfully',
                  data: {
                    _id: '60d0fe4f5311236168a109ca',
                    name: 'Monthly Groceries',
                    amount: 500,
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    period: 'monthly',
                    startDate: '2025-07-01T00:00:00.000Z',
                    endDate: '2025-07-31T23:59:59.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    isActive: true,
                    createdAt: '2025-06-28T10:00:00.000Z',
                    updatedAt: '2025-06-28T10:00:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - The provided budget ID is invalid.',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ErrorResponse' },
                    { $ref: '#/components/schemas/ValidationError' },
                  ],
                },
                examples: {
                  zodValidationError: {
                    summary: 'Validation Error from Zod',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'custom',
                          message: 'Invalid budget ID format',
                          path: ['id'],
                        },
                      ],
                    },
                  },
                  explicitInvalidId: {
                    summary: 'Invalid ID from Controller Check',
                    value: {
                      success: false,
                      message: 'Invalid budget ID',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'Budget not found for the given ID.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Budget not found',
                },
              },
            },
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      put: {
        summary: 'Update a budget by its ID',
        description:
          'Updates an existing budget belonging to the authenticated user. Any field provided in the request body will be updated. Fields not provided will remain unchanged.',
        tags: ['Budgets'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The MongoDB ObjectId of the budget to update.',
            schema: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
          },
        ],
        requestBody: {
          required: true,
          description: 'Object containing the fields to update for the budget.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateBudgetRequest',
              },
              example: {
                amount: 550,
                isActive: false,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Budget updated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Budget' },
                  },
                },
                example: {
                  success: true,
                  message: 'Budget updated successfully',
                  data: {
                    _id: '60d0fe4f5311236168a109ca',
                    name: 'Monthly Groceries',
                    amount: 550,
                    category: {
                      _id: '507f1f77bcf86cd799439011',
                      name: 'Food & Dining',
                    },
                    period: 'monthly',
                    startDate: '2025-07-01T00:00:00.000Z',
                    endDate: '2025-07-31T23:59:59.000Z',
                    userId: 'user_2abcdefghijklmnop',
                    isActive: false,
                    createdAt: '2025-06-28T10:00:00.000Z',
                    updatedAt: '2025-06-30T11:30:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description:
              'Bad Request - The request body or path parameter is invalid.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
                examples: {
                  validationError: {
                    summary: 'Zod Validation Error',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'too_small',
                          minimum: 0,
                          type: 'number',
                          inclusive: false,
                          message: 'Budget amount must be greater than 0',
                          path: ['amount'],
                        },
                        {
                          code: 'custom',
                          message: 'End date must be after start date',
                          path: ['endDate'],
                        },
                      ],
                    },
                  },
                  invalidId: {
                    summary: 'Invalid ID in Path',
                    value: {
                      success: false,
                      message: 'Invalid budget ID',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description:
              'Not Found - The budget or a specified category was not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  budgetNotFound: {
                    summary: 'Budget Not Found',
                    value: {
                      success: false,
                      message: 'Budget not found',
                    },
                  },
                  categoryNotFound: {
                    summary: 'Category Not Found',
                    value: {
                      success: false,
                      message: 'Category not found or does not belong to user',
                    },
                  },
                },
              },
            },
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      delete: {
        summary: 'Delete a budget by its ID',
        description:
          'Permanently deletes a budget belonging to the authenticated user. This action cannot be undone.',
        tags: ['Budgets'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The MongoDB ObjectId of the budget to delete.',
            schema: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Budget deleted successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
                example: {
                  success: true,
                  message: 'Budget deleted successfully',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - The provided budget ID is invalid.',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ErrorResponse' },
                    { $ref: '#/components/schemas/ValidationError' },
                  ],
                },
                examples: {
                  zodValidationError: {
                    summary: 'Validation Error from Zod',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'custom',
                          message: 'Invalid budget ID format',
                          path: ['id'],
                        },
                      ],
                    },
                  },
                  invalidId: {
                    summary: 'Invalid ID from Controller Check',
                    value: {
                      success: false,
                      message: 'Invalid budget ID',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description:
              'Not Found - The budget with the specified ID was not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  message: 'Budget not found',
                },
              },
            },
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/analytics/summary': {
      get: {
        summary: 'Get a summary of analytics data',
        description:
          'Retrieves a comprehensive summary of expenses, including totals, category breakdowns, recent transactions, and budget comparisons, based on a specified date range and category.',
        tags: ['Analytics'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date',
              description:
                'The start date for the analytics period (YYYY-MM-DD).',
              example: '2025-06-01',
            },
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date',
              description:
                'The end date for the analytics period (YYYY-MM-DD).',
              example: '2025-06-30',
            },
          },
          {
            name: 'categoryId',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              description: 'The ID of the category to filter by.',
              example: '507f1f77bcf86cd799439011',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Analytics summary retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/AnalyticsSummary' },
                    message: {
                      type: 'string',
                      example: 'Analytics summary retrieved successfully',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Missing or invalid query parameters.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  missingParameter: {
                    summary: 'Missing required parameter',
                    value: {
                      success: false,
                      message: 'Start date is required',
                    },
                  },
                  zodValidationError: {
                    summary: 'Zod validation error',
                    value: {
                      success: false,
                      message: [
                        {
                          code: 'invalid_string',
                          validation: 'date',
                          message: 'Invalid date',
                          path: ['query', 'startDate'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/analytics/monthly': {
      get: {
        summary: 'Get a monthly breakdown of expenses',
        description:
          'Retrieves a detailed breakdown of expenses for a specific month and year, including daily, weekly, and category-based aggregations.',
        tags: ['Analytics'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'year',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              description: "The year for the breakdown (e.g., '2025').",
              example: '2025',
            },
          },
          {
            name: 'month',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              description:
                "The month for the breakdown (1-12, e.g., '6' for June).",
              example: '6',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Monthly breakdown retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MonthlyBreakdown' },
                    message: {
                      type: 'string',
                      example: 'Monthly breakdown retrieved successfully',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Missing or invalid year/month.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  missingYear: {
                    summary: 'Missing Year',
                    value: {
                      success: false,
                      message: 'Year is required',
                    },
                  },
                  missingMonth: {
                    summary: 'Missing Month',
                    value: {
                      success: false,
                      message: 'Month is required',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/analytics/yearly': {
      get: {
        summary: 'Get a yearly breakdown of expenses',
        description:
          'Retrieves a detailed breakdown of expenses for a specific year, including monthly, quarterly, and category-based aggregations, as well as top spending months.',
        tags: ['Analytics'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'year',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              description: "The year for the breakdown (e.g., '2025').",
              example: '2025',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Yearly breakdown retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/YearlyBreakdown' },
                    message: {
                      type: 'string',
                      example: 'Yearly breakdown retrieved successfully',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Missing or invalid year.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Year is required',
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/analytics/category-wise': {
      get: {
        summary: 'Get a detailed analysis of expenses by category',
        description:
          'Retrieves an in-depth analysis of spending across all user categories for an optional date range. Includes overall summaries, detailed stats for each category, top-spending categories, and spending trends over the last 6 months.',
        tags: ['Analytics'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              format: 'date',
              description:
                'The start date for the analysis (YYYY-MM-DD). If omitted, all transactions from the beginning are considered.',
              example: '2025-01-01',
            },
          },
          {
            name: 'endDate',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              format: 'date',
              description:
                'The end date for the analysis (YYYY-MM-DD). If omitted, transactions up to the current date are considered.',
              example: '2025-06-30',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Category-wise analysis retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CategoryWiseAnalysis' },
                    message: {
                      type: 'string',
                      example: 'Category-wise analysis retrieved successfully',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '404': {
            description: 'No categories have been created by the user yet.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'No categories found for user',
                },
              },
            },
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/analytics/trends': {
      get: {
        summary: 'Get spending trends for a category',
        description:
          'Retrieves spending trends for a specific category over the last 6 months, including monthly totals and comparisons with previous periods.',
        tags: ['Analytics'],
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: 'categoryId',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              description: 'The category ID to analyze.',
              example: '507f1f77bcf86cd799439011',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Spending trends retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CategoryTrend' },
                    message: {
                      type: 'string',
                      example: 'Spending trends retrieved successfully',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Missing or invalid category ID.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  missingCategoryId: {
                    summary: 'Missing Category ID',
                    value: {
                      success: false,
                      message: 'Category ID is required',
                    },
                  },
                  invalidCategoryId: {
                    summary: 'Invalid Category ID',
                    value: {
                      success: false,
                      message: 'Invalid category ID',
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/UnauthorizedError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./../../routes/*.ts', './../../controller/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
