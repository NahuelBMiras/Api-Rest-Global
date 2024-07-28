import { verifiedToken } from '../utils/jwt.js';

export const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = verifiedToken(token);
    const access = decoded.role === 'admin';
    req.user = {
      access,
      message: access ? 'Access allowed' : 'Access denied',
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
