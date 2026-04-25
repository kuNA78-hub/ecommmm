import { Router } from 'express';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/roleCheck';
import { createOrder, getSellerOrders, updateOrderStatus, getBuyerOrders } from '../controllers/orderController';

const router = Router();
router.use(protect);
router.post('/', restrictTo('buyer'), createOrder);
router.get('/me', restrictTo('buyer'), getBuyerOrders);
router.get('/seller', restrictTo('seller', 'employee'), getSellerOrders);
router.put('/:id/status', restrictTo('seller', 'employee'), updateOrderStatus);

export default router;
