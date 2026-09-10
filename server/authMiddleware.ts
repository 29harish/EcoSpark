import { Request, Response, NextFunction } from 'express';
import { adminAuth } from './firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    const token = header.slice(7);

    const decoded = await adminAuth.verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth verification failed:', error);

    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
}