import { Router } from 'express';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/roleCheck';
import { createProduct, getSellerProducts, updateProduct, deleteProduct, getAllProducts } from '../controllers/productController';

const router = Router();
router.get('/public', getAllProducts); // buyer browse
router.use(protect);
router.post('/', restrictTo('seller', 'employee'), createProduct);
router.get('/', restrictTo('seller', 'employee'), getSellerProducts);
router.put('/:id', restrictTo('seller', 'employee'), updateProduct);
router.delete('/:id', restrictTo('seller', 'employee'), deleteProduct);

export default router;
