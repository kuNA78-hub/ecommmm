import { Router } from 'express';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/roleCheck';
import { getStats } from '../controllers/dashboardController';

const router = Router();
router.use(protect, restrictTo('seller', 'employee'));
router.get('/stats', getStats);

export default router;
