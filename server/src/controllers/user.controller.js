import * as userService from "../services/user.service.js";
import * as roleService from "../services/role.service.js";
import AppError, { catchAsync } from "../utils/error.utils.js";
import * as emailUtils from "../utils/email.utils.js";
import bcrypt from "bcrypt"

// ================= ADMIN SIDE =================
export const getAllUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();

    res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        timestamp: new Date().toISOString(),
        users
    });
});

export const getUserById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const user = await userService.getUserById(id);
    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
        success: true,
        message: "User fetched successfully.",
        timestamp: new Date().toISOString(),
        user,
    });
});

export const updateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password || updates.lastLogin || updates.email) {
        delete updates.password;
        delete updates.email;
        delete updates.lastLogin;
    }

    if (updates.role) {
        let roleName = updates.role === "admin" ? "admin" : "client";
        const role = await userService.getRoleByName(roleName);

        if (!role) {
            throw new AppError("Role not found", 404);
        }

        const user = await userService.getUserById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        updates.roleHash = roleService.generateRoleHash(user._id.toString(), role._id.toString());
    }

    const updated = await userService.updateUser(id, updates);
    if (!updated) throw new AppError("User not found", 404);

    res.status(200).json({
        success: true,
        message: "User updated successfully.",
        timestamp: new Date().toISOString(),
        user: updated,
    });
});

export const deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if (!deleted) throw new AppError("User not found", 404);
    res.status(204).send();
});

// ================= USER SIDE =================
export const getMe = catchAsync(async (req, res) => {
    if (!req.user) throw new AppError("Unauthenticated", 401);

    res.status(200).json({
        success: true,
        message: "User profile fetched.",
        timestamp: new Date().toISOString(),
        user: req.user.toJSON(),
    });
});

export const updateMe = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const updates = { ...req.body };

    if (updates.password ||
        updates.lastLogin ||
        updates.email ||
        updates.role ||
        updates.accountStatus ||
        updates.resetPasswordToken ||
        updates.resetPasswordExpiresAt ||
        updates.verificationToken ||
        updates.verificationTokenExpiresAt
    ) {
        delete updates.password;
        delete updates.email;
        delete updates.lastLogin;
        delete updates.role;
        delete updates.isVerified;
        delete updates.accountStatus;
        delete updates.resetPasswordToken;
        delete updates.resetPasswordExpiresAt;
        delete updates.verificationToken;
        delete updates.verificationTokenExpiresAt;
    }

    const updated = await userService.updateUser(userId, updates);
    if (!updated) throw new AppError("User not found", 404);

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        timestamp: new Date().toISOString(),
        user: updated,
    });
});

export const updateMyEmail = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { email } = req.body;

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const updated = await userService.updateUser(userId, { email, isVerified: false });
    if (!updated) throw new AppError("User not found", 404);

    await userService.sendVerificationToken(updated);

    res.status(200).json({
        success: true,
        message: "Email updated successfully. Please verify your new email.",
        timestamp: new Date().toISOString(),
        user
    });
});

export const updateMyPassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new AppError("Current and new passwords are required", 400);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new AppError("Invalid credentials!", 401, ERROR_CODES.INVALID_CREDENTIALS);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await userService.updateUser(req.user._id, { password: hashedPassword });
    if (!updated) throw new AppError("User not found", 404);

    await emailUtils.sendResetSuccessEmail(updated.email);

    res.status(200).json({
        success: true,
        message: "Password updated successfully.",
        timestamp: new Date().toISOString(),
        user: updated,
    });
});

export const updateMyAccountStatus = catchAsync(async (req, res) => {
    const { accountStatus } = req.body;

    // it's boolean field
    if (typeof accountStatus !== "boolean") {
        throw new AppError("Account status must be a boolean value", 400);
    }

    const updated = await userService.updateUser(req.user.id, { accountStatus });
    if (!updated) throw new AppError("User not found", 404);

    res.status(200).json({
        success: true,
        message: "Account status updated successfully.",
        timestamp: new Date().toISOString(),
        user: updated,
    });
});
