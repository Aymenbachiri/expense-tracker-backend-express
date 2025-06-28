import swaggerJsdoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  paths: {},
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description: 'REST API for tracking expenses, budgets, categories, etc.',
  },
  servers: [{ url: 'http://localhost:3000/api', description: 'Local server' }],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ ClerkAuth: [] }],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./../../routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
