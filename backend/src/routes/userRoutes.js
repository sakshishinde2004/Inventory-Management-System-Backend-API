import express from 'express';
import { Signup, Login, ForgotPassword,  resetPassword } from '../controllers/userController.js';

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forgot-password", ForgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router;