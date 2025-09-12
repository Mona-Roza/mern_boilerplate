import express from 'express'
import * as authController from '../controllers/auth.controller.js';
import * as authMiddlewares from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------------- POST REQUESTS ----------------
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/signout", authMiddlewares.authenticate, authController.signOut);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

export default router;