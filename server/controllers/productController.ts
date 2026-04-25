import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import Product from '../models/Product';
import { productSchema } from '../utils/validationSchemas';
import { AppError } from '../middleware/errorHandler';

export const createProduct = async (req: AuthRequest, res: Response) => {
  const data = productSchema.parse(req.body);
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  const product = await Product.create({ ...data, sellerId });
  res.status(201).json(product);
};

export const getSellerProducts = async (req: AuthRequest, res: Response) => {
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  const products = await Product.find({ sellerId });
  res.json(products);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = productSchema.partial().parse(req.body);
  const product = await Product.findOne({ _id: id });
  if (!product) throw new AppError('Product not found', 404);
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  if (product.sellerId.toString() !== sellerId) throw new AppError('Unauthorized', 403);
  Object.assign(product, data);
  await product.save();
  res.json(product);
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) throw new AppError('Product not found', 404);
  const sellerId = req.user.role === 'seller' ? req.user.id : req.user.sellerId;
  if (product.sellerId.toString() !== sellerId) throw new AppError('Unauthorized', 403);
  await product.deleteOne();
  res.status(204).send();
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filter: any = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter);
  res.json(products);
};
