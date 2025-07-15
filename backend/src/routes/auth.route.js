import express from 'express';
import { signIn, signUp, signOut } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn', signIn); // Assuming signIn is defined in auth.controller.js
authRouter.post('/signOut', auth, signOut); // Assuming signOut is defined in auth.controller.js

export default authRouter;
