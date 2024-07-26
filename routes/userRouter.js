import express from 'express';
import { usersController } from '../controller/usersController.js';
const { getUsers, getUsersById } = usersController();
const userRouter = express.Router();

userRouter.route('/').get(getUsers);
userRouter.route('/:userId').get(getUsersById);

export default userRouter;
