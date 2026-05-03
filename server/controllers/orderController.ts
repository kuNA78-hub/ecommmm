import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';
import { orderSchema } from '../utils/validationSchemas';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const data = orderSchema.parse(req.body);
  const buyerId = req.user.id;
  
  let totalCalculated = 0;
  const processedItems = [];

  // Verify prices and stock on server side
  for (const item of data.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
    }
    
    totalCalculated += product.price * item.quantity;
    processedItems.push({
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  // Use first product's sellerId for the order (simplified logic)
  const firstProduct = await Product.findById(data.items[0].productId);
  const sellerId = firstProduct!.sellerId;

  const order = await Order.create({ 
    items: processedItems, 
    buyerId, 
    sellerId, 
    totalAmount: totalCalculated,
    shippingAddress: data.shippingAddress,
    status: 'pending' 
  });

  // reduce stock securely
  for (const item of data.items) {
    await Product.updateOne(
      { _id: item.productId, stock: { $gte: item.quantity } }, 
      { $inc: { stock: -item.quantity } }
    );
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
