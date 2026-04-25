import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import Invitation from '../models/Invitation';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { generateTokens } from '../utils/generateToken';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const { name, email, password, role, inviteToken } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('User already exists', 400);

  let sellerId: mongoose.Types.ObjectId | undefined;
  
  if (role === 'employee') {
    if (!inviteToken) throw new AppError('Invite token required', 400);
    const invite = await Invitation.findOne({ token: inviteToken, status: 'pending' });
    if (!invite || invite.expiresAt < new Date()) throw new AppError('Invalid token', 400);
    sellerId = invite.sellerId;
    await Invitation.updateOne({ _id: invite._id }, { status: 'accepted' });
  }

  const user = await User.create({ name, email, password, role, sellerId });
  const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
  
  res.status(201).json({ user: { id: user._id, name, email, role: user.role }, ...tokens });
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email });
  
  if (!user || !(await user.comparePassword(data.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('No refresh token', 401);
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
    res.json(tokens);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};
