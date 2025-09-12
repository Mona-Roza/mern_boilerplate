// routes/user.routes.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import * as authMiddlewares from "../middlewares/auth.middleware.js"; // your auth implementation

const router = express.Router();

router.get("/me/:id",
    authMiddlewares.authenticate,
    userController.getMe
);

// {
//      "name": "string",
//      "phone": "string",
//      "deliveryAddress": "string",
// }
router.put(
    "/me/:id",
    authMiddlewares.authenticate,
    userController.updateMe
);

// {
//      "email": "string"
// }
router.put(
    "/me/:id/email",
    authMiddlewares.authenticate,
    userController.updateMyEmail
);

// {
//      "currentPassword": "string",
//      "newPassword": "string"
// }
router.put(
    "/me/:id/password",
    authMiddlewares.authenticate,
    userController.updateMyPassword
);

// {
//      "accountStatus": boolean
// }
router.put(
    "/me/:id/account-status",
    authMiddlewares.authenticate,
    userController.updateMyAccountStatus
)

export default router;
