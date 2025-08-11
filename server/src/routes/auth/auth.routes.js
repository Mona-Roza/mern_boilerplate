import express from 'express'
import { signUp, verifyEmail } from '../controllers/auth.controller.js'

const router = express.Router();

// /api/auth/signup
router.post('/signup', signUp);

// /api/auth/verify-email
router.post('/verify-email', verifyEmail);

export default router;