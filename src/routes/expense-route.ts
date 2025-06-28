import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { searchExpenses } from '../controller/expense/search-expense-controller';
import { getExpensesByCategory } from '../controller/expense/get-expense-by-category-controller';
import { getExpenses } from '../controller/expense/get-all-expenses-controller';
import { createExpense } from '../controller/expense/create-expense-controller';
import { updateExpense } from '../controller/expense/update-expense-controller';
import { deleteExpense } from '../controller/expense/delete-expense-controller';
import { getExpense } from '../controller/expense/get-expense-byId-controller';

const router: Router = Router();

router.get('/search', requireAuth(), searchExpenses);
router.get('/by-category/:categoryId', requireAuth(), getExpensesByCategory);

router.get('/', requireAuth(), getExpenses);
router.post('/', requireAuth(), createExpense);
router.get('/:id', requireAuth(), getExpense);
router.put('/:id', requireAuth(), updateExpense);
router.delete('/:id', requireAuth(), deleteExpense);

export default router;
