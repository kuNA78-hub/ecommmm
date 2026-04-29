import { RequestHandler } from 'express';
import Invitation from '../models/Invitation';
import crypto from 'crypto';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { logInfo } from '../utils/logger';

export const inviteUser: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const invitedBy = req.userId; 

    const existing = await Invitation.findOne({ email, status: 'pending' });
    if (existing) return sendError(res, 400, 'Pending invitation already sent to this email');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    const invitation = await Invitation.create({ email, invitedBy, token, expiresAt });
    logInfo(`Invitation created for ${email} by admin ${invitedBy}`);

    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?token=${token}&role=user`;
    return sendSuccess(res, 201, 'Invitation created', { inviteLink, token });
  } catch (error) { next(error); }
};

export const getInvitations: RequestHandler = async (req, res, next) => {
  try {
    const invites = await Invitation.find({ invitedBy: req.userId }).populate('invitedBy', 'username email');
    return sendSuccess(res, 200, 'Invitations fetched', invites);
  } catch (error) { next(error); }
};
