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
  servers: [{ url: 'http://localhost:3000/api', description: 'Local server' }],
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
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./../../routes/*.ts', './../../controller/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
