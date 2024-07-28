import express from 'express';
import { usersController } from '../controller/usersController.js';
import { isAdmin } from '../middleware/isAdmin.js';
const { getUsers, getUsersById, deleteUsers, editUser } = usersController();
const userRouter = express.Router();

userRouter.route('/').get(getUsers);
userRouter.route('/search').get(getUsersById);
userRouter.route('/delete-user').delete(isAdmin, deleteUsers);
userRouter.route('/edit-user').put(isAdmin, editUser);

export default userRouter;
