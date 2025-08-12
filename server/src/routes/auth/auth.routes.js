import express from 'express'
import { signUp, signIn, verifyEmail, forgotPassword, resetPassword } from '../../controllers/auth.controller.js';
import { catchAsync } from '../../utils/error.utils.js';

const router = express.Router();

router.post("/signup", catchAsync(signUp));
router.post("/signin", catchAsync(signIn));
router.post("/verify-email", catchAsync(verifyEmail));
router.post("/forgot-password", catchAsync(forgotPassword));
router.post("/reset-password/:token", catchAsync(resetPassword));

export default router;