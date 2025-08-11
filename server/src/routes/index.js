import { Router } from "express";
import { authRoutes } from "./auth/auth.routes.js";

const router = Router();

router.use('/auth', authRoutes);

/*
routes:

POST /auth/signup
*/