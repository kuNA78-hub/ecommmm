import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import Invitation from '../models/Invitation';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { generateTokens } from '../utils/generateToken';
import { AppError } from '../middleware/errorHandler';

const setTokenCookies = (res: Response, tokens: { accessToken: string; refreshToken: string }) => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const { name, email, password, role, inviteToken } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('An account with this email already exists.', 400);

  let sellerId: mongoose.Types.ObjectId | undefined;
  
  if (role === 'employee') {
    if (!inviteToken) throw new AppError('Invitation token is required for employee registration.', 400);
    const invite = await Invitation.findOne({ token: inviteToken, status: 'pending' });
    if (!invite || invite.expiresAt < new Date()) throw new AppError('This invitation token is invalid or has expired.', 400);
    sellerId = invite.sellerId;
    await Invitation.updateOne({ _id: invite._id }, { status: 'accepted' });
  }

  const user = await User.create({ name, email, password, role, sellerId });
  const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
  
  setTokenCookies(res, tokens);
  
  res.status(201).json({ 
    user: { id: user._id, name, email, role: user.role } 
  });
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email });
  
  if (!user || !(await user.comparePassword(data.password))) {
    throw new AppError('The email or password you entered is incorrect.', 401);
  }

  const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
  setTokenCookies(res, tokens);

  res.json({ 
    user: { id: user._id, name: user.name, email: user.email, role: user.role } 
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError('Session expired. Please log in again.', 401);

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    // Refresh Token Rotation
    const tokens = generateTokens(user._id.toString(), user.role, user.sellerId?.toString());
    setTokenCookies(res, tokens);

    res.json({ success: true });
  } catch {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw new AppError('Your session is invalid. Please log in again.', 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
