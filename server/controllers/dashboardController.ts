import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';

export const getStats = async (req: AuthRequest, res: Response) => {
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  const totalProducts = await Product.countDocuments({ sellerId });
  const orders = await Order.find({ sellerId });
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  res.json({ totalProducts, totalOrders, revenue });
};
