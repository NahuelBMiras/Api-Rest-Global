import express from 'express';
import { refreshToken } from '../controller/refreshTokenController.js';

const router = express.Router();

router.route('/').post(refreshToken);

export const refreshTokenRouter = router;
