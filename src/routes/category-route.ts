import { Router } from 'express';
import { createCategory } from '../controller/category/create-category-controller';
import { getCategories } from '../controller/category/get-categories-controller';
import { updateCategory } from '../controller/category/update-category-controller';
import { deleteCategory } from '../controller/category/delete-category-controller';
import { getCategoryById } from '../controller/category/get-category-byId-controller';

const router: Router = Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
