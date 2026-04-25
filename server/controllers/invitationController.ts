import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Invitation from '../models/Invitation';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler';

export const inviteEmployee = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const sellerId = req.user.id;
  const existing = await Invitation.findOne({ email, sellerId, status: 'pending' });
  if (existing) throw new AppError('Pending invitation already sent', 400);
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invitation = await Invitation.create({ email, sellerId, token, expiresAt });
  res.status(201).json({ message: 'Invitation created', inviteLink: `http://localhost:5173/register?token=${token}&role=employee` });
};

export const getInvitations = async (req: AuthRequest, res: Response) => {
  const sellerId = req.user.id;
  const invites = await Invitation.find({ sellerId });
  res.json(invites);
};
