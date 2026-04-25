import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';
import { orderSchema } from '../utils/validationSchemas';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const data = orderSchema.parse(req.body);
  const buyerId = req.user.id;
  // assume all items belong to same seller for simplicity (first product's seller)
  const firstProduct = await Product.findById(data.items[0].productId);
  if (!firstProduct) throw new AppError('Product not found', 404);
  const sellerId = firstProduct.sellerId;
  const order = await Order.create({ ...data, buyerId, sellerId, status: 'pending' });
  // reduce stock
  for (const item of data.items) {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
  }
  res.status(201).json(order);
};

export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  const orders = await Order.find({ sellerId }).populate('buyerId', 'name email');
  res.json(orders);
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) throw new AppError('Order not found', 404);
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  if (order.sellerId.toString() !== sellerId) throw new AppError('Unauthorized', 403);
  order.status = status;
  await order.save();
  res.json(order);
};

export const getBuyerOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ buyerId: req.user.id });
  res.json(orders);
};
