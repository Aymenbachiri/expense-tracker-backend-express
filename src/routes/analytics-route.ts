import { Router } from 'express';
import { getAnalyticsSummary } from '../controller/analytics/get-analytics-summary';
import { getCategoryWiseAnalysis } from '../controller/analytics/get-category-wise-analysis';
import { getMonthlyBreakdown } from '../controller/analytics/get-monthly-breakdown';
import { getSpendingTrends } from '../controller/analytics/get-spending-trends';
import { getYearlyBreakdown } from '../controller/analytics/get-yearly-breakdown';

const router: Router = Router();

router.get('/summary', getAnalyticsSummary);
router.get('/monthly', getMonthlyBreakdown);
router.get('/yearly', getYearlyBreakdown);
router.get('/category-wise', getCategoryWiseAnalysis);
router.get('/trends', getSpendingTrends);

export default router;
