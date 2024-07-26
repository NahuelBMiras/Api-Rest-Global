import { PrismaClient } from '@prisma/client';
import { userSchema } from '../schema/userSchema.js';
import { encrypt } from '../utils/bycript.js';

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
  const newUser = req.body;
  const { error } = userSchema.validate(newUser);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const hashedPassword = await encrypt(newUser.password);
  newUser.password = hashedPassword;
  try {
    const createUser = await prisma.users.create({
      data: newUser,
    });
    return res
      .status(200)
      .json({ message: 'Login successful', user: createUser });
  } catch (error) {
    next(error);
  }
};
