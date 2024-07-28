import { PrismaClient } from '@prisma/client';
import { verifiedToken } from '../utils/jwt.js';
import { editUserSchema } from '../schema/userSchema.js';
import { verified, encrypt } from '../utils/bycript.js';

const prisma = new PrismaClient();

export const usersController = () => {
  const getUsers = async (_req, res, next) => {
    try {
      const usersList = await prisma.users.findMany();

      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos correctamente',
        data: usersList,
      });
    } catch (error) {
      next(error);
    }
  };

  const getUsersById = async (req, res, next) => {
    const { userId } = req.query;

    const NumberUserId = parseInt(userId);
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    try {
      const user = await prisma.users.findUnique({
        where: {
          userId: NumberUserId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos correctamente',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  const deleteUsers = async (req, res, next) => {
    try {
      const { access } = req.user;
      const { username } = req.query;

      let userId;
      if (!access) {
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

        const decodedToken = verifiedToken(token);
        userId = decodedToken.userId;

        if (!userId) {
          return res.status(401).json({ message: 'Invalid token' });
        }
      } else {
        userId = parseInt(req.query.userId);
        if (!userId) {
          return res.status(400).json({ message: 'User ID not provided' });
        }
      }

      const user = await prisma.users.findFirst({
        where: {
          username: username,
          userId: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await prisma.users.delete({
        where: {
          userId: userId,
        },
      });

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  const editUser = async (req, res, next) => {
    const { access } = req.user;
    const { username, user } = req.query;
    let token;
    let userId;
    console.log(userId);
    if (!access) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: 'No authorization header provided' });
      }
      token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }
      userId = verifiedToken(token).userId;
    } else {
      userId = parseInt(user);
    }
    console.log(!access);

    const editUser = req.body;

    try {
      console.log(username);
      console.log(userId);

      const findUser = await prisma.users.findFirst({
        where: {
          username: username,
          userId: userId,
        },
      });
      console.log(findUser);

      if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { error } = editUserSchema.validate(editUser);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const hashedPassword = await encrypt(editUser.changePassword);
      editUser.changePassword = hashedPassword;
      const updatedUser = await prisma.users.update({
        where: {
          userId: findUser.userId,
        },
        data: {
          name: editUser.name,
          lastname: editUser.lastname,
          email: editUser.email,
          username: editUser.username,
          password: editUser.changePassword,
        },
      });

      return res
        .status(200)
        .json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  return {
    getUsers,
    getUsersById,
    deleteUsers,
    editUser,
  };
};
