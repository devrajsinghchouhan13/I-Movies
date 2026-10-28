import jwt from 'jsonwebtoken';
import { db } from '../db/store.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User account not found' });
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session token' });
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Access denied: Admin privileges required' });
      return;
    }
    next();
  });
}
