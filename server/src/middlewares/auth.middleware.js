import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

import * as roleService from "../services/role.service.js";

import AppError, { catchAsync } from "../utils/error.utils.js";

import { ERROR_CODES } from "../constants/error.constants.js";
import * as authUtils from "../utils/auth.utils.js";

// -------------------- AUTHENTICATION MIDDLEWARES -------------------- 
export const authenticate = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new AppError("No token provided!", 401, ERROR_CODES.TOKEN_MISSING);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
        throw new AppError("Invalid token!", 401, ERROR_CODES.TOKEN_INVALID);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new AppError("User not found!", 404, ERROR_CODES.USER_NOT_FOUND);
    }

    req.user = user;

    next();
});

// -------------------- AUTHORIZATION MIDDLEWARES -------------------- 
export const authorizeByRoleName = (roleName) => {
    return catchAsync(async (req, res, next) => {
        const user = req.user;

        if (!user) {
            throw new AppError("Unauthorized.", 401, ERROR_CODES.UNAUTHORIZED);
        }

        const role = await roleService.getRoleByName(roleName);
        if (!role) {
            throw new AppError("User role not found.", 500, ERROR_CODES.SERVER_ERROR);
        }

        const expectedHash = roleService.generateRoleHash(user._id.toString(), role._id.toString());

        if (user.roleHash !== expectedHash) {
            throw new AppError("Forbidden!", 403, ERROR_CODES.FORBIDDEN);
        }

        // if role is "client" also check user is owner of the resource
        if (roleName === "client" && req.params.id && (req.params.id !== user._id.toString())) {
            throw new AppError("Forbidden! You can only access your own resources.", 403, ERROR_CODES.FORBIDDEN);
        }
        next();
    });
};

export const authorizeByHash = (...allowedHashes) => {
    return catchAsync(async (req, res, next) => {
        const user = await User.findById(req.userId);

        if (!user || !user.roleHash) {
            throw new AppError("Access denied.", 403, ERROR_CODES.ROLE_NOT_ALLOWED);
        }

        if (!allowedHashes.includes(user.roleHash)) {
            throw new AppError("Forbidden!", 403, ERROR_CODES.FORBIDDEN);
        }

        next();
    });
};
