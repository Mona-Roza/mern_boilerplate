// routes/user.routes.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import * as authMiddlewares from "../middlewares/auth.middleware.js"; // your auth implementation

const router = express.Router();

router.get(
    "/",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    userController.getAllUsers
);

router.get(
    "/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    userController.getUserById
);

router.put(
    "/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    userController.updateUser
);

router.delete(
    "/:id",
    authMiddlewares.authenticate,
    authMiddlewares.authorizeByRoleName("admin"),
    userController.deleteUser
);

export default router;
