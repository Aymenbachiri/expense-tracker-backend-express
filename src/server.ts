import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import HomeRoute from './routes/home-route';
import CategoryRoute from './routes/category-route';
import ExpenseRoute from './routes/expense-route';
import AnalyticsRoute from './routes/analytics-route';
import BudgetRoute from './routes/budget-route';
import swaggerUi from 'swagger-ui-express';
import { clerkMiddleware } from '@clerk/express';
import { rateLimiter } from './lib/utils/rate-limiter';
import { connectToMongoDB } from './lib/db/mongoose';
import { swaggerSpec } from './lib/utils/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://expense-tracker-backend-express.vercel.app',
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(clerkMiddleware());

const theme = new SwaggerTheme();

const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui { 
      background-color: #1a1a1a; 
      color: #ffffff; 
    }
    .swagger-ui .scheme-container { 
      background-color: #2a2a2a; 
      border: 1px solid #3a3a3a; 
    }
  `,
  customSiteTitle: 'Expense Tracker API Documentation',
  customfavIcon: '/favicon.ico',
};
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use('/api', HomeRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/expenses', ExpenseRoute);
app.use('/api/budgets', BudgetRoute);
app.use('/api/analytics', AnalyticsRoute);

connectToMongoDB().catch((err) => {
  console.error('MongoDB connection error:', err);
});

export default app;
