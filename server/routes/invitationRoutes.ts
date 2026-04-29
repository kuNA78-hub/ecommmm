import express from 'express';
import { authenticateUser, isAdmin } from '../middleware/auth';
import { inviteUser, getInvitations } from '../controllers/invitationController';

const router = express.Router();
router.use(authenticateUser, isAdmin);
router.post('/', inviteUser);
router.get('/', getInvitations);

export default router;
