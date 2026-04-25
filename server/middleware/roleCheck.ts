import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// For seller/employee access to seller's resources
export const isSellerOrEmployeeOf = (getSellerIdFromReq: (req: AuthRequest) => string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const sellerId = getSellerIdFromReq(req);
    if (req.user.role === 'seller' && req.user.id === sellerId) return next();
    if (req.user.role === 'employee' && req.user.sellerId === sellerId) return next();
    return res.status(403).json({ message: 'Access denied' });
  };
};
