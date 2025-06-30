import { Router } from 'express';
import { createBudget } from '../controller/budget/create-budget-controller';
import { deleteBudget } from '../controller/budget/delete-budget-controller';
import { getAllBudgets } from '../controller/budget/get-all-budgets-controller';
import { getBudget } from '../controller/budget/get-budget-byId-controller';
import { getBudgetStatus } from '../controller/budget/get-budget-status-controller';
import { updateBudget } from '../controller/budget/update-budget-controller';

const router: Router = Router();

router.get('/', getAllBudgets);
router.post('/', createBudget);
router.get('/:id', getBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

router.get('/:id/status', getBudgetStatus);

export default router;
