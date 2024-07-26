import jwt from 'jsonwebtoken';

export const generateToken = (user, expiresIn = '1d', isRefresh = false) => {
  const payload = {
    userId: user.userId,
    role: user.role.role,
  };
  const secretKey = isRefresh
    ? process.env.REFRSH_SECRET_KEY
    : process.env.JWT_SECRET;
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

export const verifiedToken = (token, isRefresh = false) => {
  const secretKey = isRefresh
    ? process.env.REFRSH_SECRET_KEY
    : process.env.JWT_SECRET;
  return jwt.verify(token, secretKey);
};
