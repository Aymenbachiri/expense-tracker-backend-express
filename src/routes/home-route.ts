import { Router } from 'express';

const router: Router = Router();

router.get('/', async (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default router;
