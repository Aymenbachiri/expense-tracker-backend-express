import { Router } from 'express';
import { createCategory } from '../controller/category/create-category-controller';
import { getCategories } from '../controller/category/get-categories-controller';
import { updateCategory } from '../controller/category/update-category-controller';
import { deleteCategory } from '../controller/category/delete-category-controller';
import { requireAuth } from '@clerk/express';

const router: Router = Router();

router.get('/', getCategories);
router.post('/', requireAuth(), createCategory);
router.get('/:id', requireAuth(), getCategories);
router.put('/:id', requireAuth(), updateCategory);
router.delete('/:id', requireAuth(), deleteCategory);

export default router;
