import express from 'express';
import { signIn, signUp, signOut, getUserProfile, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn', signIn); // Assuming signIn is defined in auth.controller.js
authRouter.post('/signOut', auth, signOut); // Assuming signOut is defined in auth.controller.js
authRouter.get('/profile', auth, getUserProfile); // Example of a protected route
authRouter.put('/updateProfile', auth, updateProfile); // Get user profile by ID

authRouter.get('/check-auth', checkAuth)

export default authRouter;
