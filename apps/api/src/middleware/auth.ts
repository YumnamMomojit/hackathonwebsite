import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Extend the Express Request type to include the user payload from the JWT
interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roles: string[];
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; roles: string[]; iat: number; exp: number; };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const hasRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles.some(role => roles.includes(role))) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
    }
    next();
  };
};

// This is a placeholder for a more granular permission system.
// For a real app, you would check permissions from the database.
export const hasPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // In a real app, you would look up the user's roles,
    // then look up the permissions for those roles from the database.
    // For this example, we will just check the roles.
    if (!req.user) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permission.' });
    }

    const { roles } = req.user;
    // This is a simplified permission check.
    if (roles.includes('SUPERADMIN')) {
        return next(); // Superadmin has all permissions
    }
    if (permission === 'manage_hackathons' && roles.includes('ORGANIZER')) {
        return next();
    }
    if (permission === 'view_dashboards' && (roles.includes('ORGANIZER') || roles.includes('USER'))) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden: You do not have the required permission.' });
  };
};
