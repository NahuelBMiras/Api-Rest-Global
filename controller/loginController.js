import { PrismaClient } from '@prisma/client';
import { verified } from '../utils/bycript.js';
import { loginSchema } from '../schema/loginSchema.js';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const login = async (req, res, next) => {
  const { email, username, password } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const findUser = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
      include: {
        role: true,
      },
    });
    if (!findUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await verified(password, findUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(findUser);
    const refreshToken = generateToken(findUser, '7d', true);

    return res.status(200).json({
      message: 'Login successful',
      user: findUser,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
