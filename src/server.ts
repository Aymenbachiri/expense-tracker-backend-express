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
import { PORT } from './config/config';
import { rateLimiter } from './lib/utils/rate-limiter';
import { connectToMongoDB } from './lib/db/mongoose';
import { swaggerSpec } from './lib/utils/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(clerkMiddleware());

const theme = new SwaggerTheme();

const swaggerUiOptions = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

(async () => {
  try {
    await connectToMongoDB();

    app.use('/api', HomeRoute);
    app.use('/api/category', CategoryRoute);
    app.use('/api/expenses', ExpenseRoute);
    app.use('/api/budgets', BudgetRoute);
    app.use('/api/analytics', AnalyticsRoute);

    app.listen(PORT, () => {
      console.log(`Server is running http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server error', error);
  }
})();
