import { verifiedToken, generateToken } from '../utils/jwt.js';

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const { userId, role } = verifiedToken(refreshToken, true);

    const token = generateToken({
      userId: userId,
      role: role,
    });

    return res.status(201).json({
      success: true,
      token,
      userId,
      role,
    });
  } catch (error) {
    next(error);
  }
};
