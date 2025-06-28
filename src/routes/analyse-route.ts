import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { getAnalyticsSummary } from '../controller/analytics/get-analytics-summary';
import { getCategoryWiseAnalysis } from '../controller/analytics/get-category-wise-analysis';
import { getMonthlyBreakdown } from '../controller/analytics/get-monthly-breakdown';
import { getSpendingTrends } from '../controller/analytics/get-spending-trends';
import { getYearlyBreakdown } from '../controller/analytics/get-yearly-breakdown';

const router: Router = Router();

router.get('/summary', requireAuth(), getAnalyticsSummary);
router.get('/monthly', requireAuth(), getMonthlyBreakdown);
router.get('/yearly', requireAuth(), getYearlyBreakdown);
router.get('/category-wise', requireAuth(), getCategoryWiseAnalysis);
router.get('/trends', requireAuth(), getSpendingTrends);

export default router;
