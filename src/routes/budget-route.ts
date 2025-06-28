import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { createBudget } from '../controller/budget/create-budget-controller';
import { deleteBudget } from '../controller/budget/delete-budget-controller';
import { getAllBudgets } from '../controller/budget/get-all-budgets-controller';
import { getBudget } from '../controller/budget/get-budget-byId-controller';
import { getBudgetStatus } from '../controller/budget/get-budget-status-controller';
import { updateBudget } from '../controller/budget/update-budget-controller';

const router: Router = Router();

router.get('/', requireAuth(), getAllBudgets);
router.post('/', requireAuth(), createBudget);
router.get('/:id', requireAuth(), getBudget);
router.put('/:id', requireAuth(), updateBudget);
router.delete('/:id', requireAuth(), deleteBudget);

router.get('/:id/status', requireAuth(), getBudgetStatus);

export default router;
