import { PrismaClient } from '@prisma/client';
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
    const { userId } = req.params;

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

  return {
    getUsers,
    getUsersById,
  };
};
