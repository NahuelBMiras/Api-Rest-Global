import { loginRouter } from './routes/loginRouter.js';
import { registerRouter } from './routes/registerRouter.js';
import { refreshTokenRouter } from './routes/userRefreshTokenRouter.js';
import userRouter from './routes/userRouter.js';
import codeRouter from './routes/codeRouter.js';

import { expressjwt as ejwt } from 'express-jwt';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
  })
);

app.use(
  ejwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }).unless({
    path: ['/login', '/register', '/user/refresh-token'],
  })
);

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.use('/user/refresh-token', refreshTokenRouter);

app.use('/user', userRouter);

app.use('/code', codeRouter);

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
