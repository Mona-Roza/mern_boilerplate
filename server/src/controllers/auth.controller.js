import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";

import * as userService from "../services/user.service.js";
import { findRoleByName } from "../services/role.service.js";

import * as authUtils from "../utils/auth.utils.js";
import * as emailUtils from "../utils/email.utils.js";
import AppError, { catchAsync } from '../utils/error.utils.js';
import { logger } from "../utils/logger.js";

import { ERROR_CODES } from "../constants/error.constants.js";

export const signUp = catchAsync(async (req, res) => {
    // Capture email, password and name from request body
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim() || null;
    const { password } = req.body;

    // Check if all fields full
    if (!name || !email || !password) {
        throw new AppError("All fields are required.", 400, ERROR_CODES.MISSING_FIELDS);
    }

    // TODO validation for email and password

    // Check if email is already in use 
    const emailAlreadyInUse = await User.findOne({ email });
    if (emailAlreadyInUse) {
        throw new AppError("Email already in use.", 409, ERROR_CODES.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await findRoleByName("client");

    const user = await userService.createUser({ name, email, phone, hashedPassword, role });

    // JWT 
    authUtils.generateTokenAndSetCookie(res, user._id); // with using generated user id

    await userService.sendVerificationToken(user);

    // Response
    res.status(201).json({
        success: true,
        message: "User created successfully.",
        user: user.toJSON(),
    });

});

export const verifyEmail = catchAsync(async (req, res) => {
    const { code } = req.body;

    // Find user by verification Token and verification token expire date
    const user = await userService.findUserByVerificationCode(code);
    if (!user) {
        throw new AppError("Invalid or expired verification token.", 401, ERROR_CODES.INVALID_TOKEN);
    }

    const updatedUser = await userService.verifyUser(user);

    // Send welcome e-mail
    await emailUtils.sendWelcomeEmail(updatedUser.email, updatedUser.name);

    // Response
    res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        user: user.toJSON(),
    });
});

export const signIn = catchAsync(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) throw new AppError("Invalid credentials!", 401, ERROR_CODES.INVALID_CREDENTIALS);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Invalid credentials!", 401, ERROR_CODES.INVALID_CREDENTIALS);


    if (!user.isVerified) {
        throw new AppError("Email not verified.", 403, ERROR_CODES.USER_NOT_VERIFIED);
    }

    authUtils.generateTokenAndSetCookie(res, user._id);

    await userService.updateLastLogin(user._id);

    res.status(200).json({
        success: true,
        message: "Signed in successfully.",
        user: user.toJSON(),
    });
});

export const signOut = catchAsync(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
    res.status(200).json({
        success: true,
        message: "Signed out successfully."
    });

});

export const forgotPassword = catchAsync(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();

    // Always respond the same way at the end:
    const publicResponse = () =>
        res.status(200).json({
            success: true,
            message: "If an account exists for that email, a reset link has been sent."
        });

    const user = await userService.findUserByEmail(email);
    if (!user) {
        // Small artificial delay (100–300ms) on the “not found” path to blur timing differences.
        await new Promise(r => setTimeout(r, 200));
        return publicResponse();
    }

    // Generate & store HASHED token and expiration date
    const rawToken = await userService.setPasswordResetTokenAndDate(user);

    // Send email with RAW token (never store or log raw token server-side)
    try {
        const resetUrl = `${process.env.BASE_URL}${process.env.PORT}/api/auth/reset-password/${rawToken}`;
        await emailUtils.sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailErr) {
        // Log internally; do NOT change the outward response
        logger.error({ emailErr }, "Password reset email send failed:");
    }

    return publicResponse();
});

export const resetPassword = catchAsync(async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const user = awaituserService.findUserByResetToken(token);
    if (!user) {
        throw new AppError("Invalid or expired reset token.", 401, ERROR_CODES.INVALID_TOKEN);
    }

    await userService.resetPasswordForUser(user, password);

    // Optional notification email (non-blocking)
    emailUtils.sendResetSuccessEmail(user.email).catch(e => logger.error({ e }, "reset success email:"));

    res.status(200).json({ success: true, message: "Password reset successfully." });
});

