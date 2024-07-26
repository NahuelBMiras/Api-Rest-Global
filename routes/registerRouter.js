import express from 'express';
import { register } from '../controller/registerController.js';

const router = express.Router();

router.route('/').post(register);

export const registerRouter = router;
