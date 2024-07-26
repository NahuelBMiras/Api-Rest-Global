import express from 'express';
import { login } from '../controller/loginController.js';

const router = express.Router();

router.route('/').post(login);

export const loginRouter = router;
