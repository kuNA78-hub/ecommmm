import { Router } from 'express';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/roleCheck';
import { inviteEmployee, getInvitations } from '../controllers/invitationController';

const router = Router();
router.use(protect);
router.post('/', restrictTo('seller'), inviteEmployee);
router.get('/', restrictTo('seller'), getInvitations);

export default router;
