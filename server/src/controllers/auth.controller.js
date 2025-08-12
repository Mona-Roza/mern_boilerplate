import bcrypt from "bcrypt";
import crypto from "crypto";

import { generateTokenAndSetCookie, generateVerificationToken } from "../utils/auth.utils.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../utils/email.utils.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import { logger } from "../utils/logger.js";

// signUp 
export const signUp = async (req, res) => {
    // Capture email, password and name from request body
    const name = String(req.body.name || "").trim();
    const username = String(req.body.username || "").trim().toLowerCase();
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    // Check if all fields full
    if (!name || !username || !email || !password) {
        throw new AppError("All fields are required.", 400, ERROR_CODES.MISSING_FIELDS);
    }

    // TODO validation for email and password

    // Check if email is already in use 
    const emailAlreadyInUse = await User.findOne({ email });
    if (emailAlreadyInUse) {
        throw new AppError("Email already in use.", 409, ERROR_CODES.EMAIL_IN_USE);
    }

    // Check id username is already in use
    const usernameAlreadyInUse = await User.findOne({ username });
    if (usernameAlreadyInUse) {
        throw new AppError("Username already in use.", 409, ERROR_CODES.USERNAME_IN_USE);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate new verification token
    const verificationToken = generateVerificationToken();

    // Create new user
    const user = await User.create({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 15 minutes
    });

    // JWT 
    generateTokenAndSetCookie(res, user._id); // with using generated user id

    // Send the verification token to new user's e-mail
    await sendVerificationEmail(user.email, verificationToken);

    // Response
    res.status(201).json({
        success: true,
        message: "User created successfully.",
        user: user.toJSON(),
    });

};

// verifyEmail
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    // Find user by verification Token and verification token expire date
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: new Date() }
    });

    // Check if user exist
    if (!user) {
        throw new AppError("Invalid or expired verification token.", 401, ERROR_CODES.INVALID_TOKEN);
    }

    // Complate user's verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    // Save user's new status
    await user.save();

    // Send welcome e-mail
    await sendWelcomeEmail(user.email, user.name);

    // Response
    res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        user: user.toJSON(),
    });
};

// signIn
export const signIn = async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password.", 401, ERROR_CODES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password.", 401, ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
        throw new AppError("Email not verified.", 403, ERROR_CODES.USER_NOT_VERIFIED);
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
        success: true,
        message: "Signed in successfully.",
        user: user.toJSON(),
    });
};

// signOut
export const signOut = async (req, res) => {
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

};

// forgotPassword
export const forgotPassword = async (req, res, next) => {
    const email = String(req.body.email || "").trim().toLowerCase();

    // Always respond the same way at the end:
    const publicResponse = () =>
        res.status(200).json({
            success: true,
            message: "If an account exists for that email, a reset link has been sent."
        });

    const user = await User.findOne({ email });
    if (!user) {
        // Small artificial delay (100–300ms) on the “not found” path to blur timing differences.
        await new Promise(r => setTimeout(r, 200));
        return publicResponse();
    }

    // Generate & store HASHED token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email with RAW token (never store or log raw token server-side)
    try {
        const resetUrl = `${process.env.BASE_URL}${process.env.PORT}/api/auth/reset-password/${rawToken}`;
        await sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailErr) {
        // Log internally; do NOT change the outward response
        logger.error({ emailErr }, "Password reset email send failed:");
    }

    return publicResponse();
};

// resetPassword
export const resetPassword = async (req, res, next) => {

    const { token } = req.params;
    const { password } = req.body;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    });

    if (!user) {
        throw new AppError("Invalid or expired reset token.", 401, ERROR_CODES.INVALID_TOKEN);
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Optional notification email (non-blocking)
    sendResetSuccessEmail(user.email).catch(e => logger.error({ e }, "reset success email:"));

    res.status(200).json({ success: true, message: "Password reset successfully." });
};

