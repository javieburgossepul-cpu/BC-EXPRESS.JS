import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { registerHandler, loginHandler, meHandler } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login',    loginHandler);
authRouter.get('/me',        authenticate, meHandler);
