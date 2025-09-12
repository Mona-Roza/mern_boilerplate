import { User } from "../models/user.model.js";
import * as authUtils from "../utils/auth.utils.js";
import * as roleService from "./role.service.js";
import * as emailUtils from "../utils/email.utils.js";
import crypto from "crypto";
import bcrypt from "bcrypt"

export const createUser = async ({ name, email, phone, hashedPassword, role }) => {
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role._id
    });

    user.roleHash = roleService.generateRoleHash(user._id.toString(), role._id.toString());
    await user.save();

    return user;
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
    return await User.findById(id).populate("role").select("-password -roleHash -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");;
};

export const updateLastLogin = async (userId) => {
    return await User.findByIdAndUpdate(userId, { lastLogin: new Date() }, { new: true });
};

export const findUserByVerificationCode = async (code) => {
    return await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: new Date() }
    });
};

export const verifyUser = async (user) => {
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    return user;
};

export const setPasswordResetTokenAndDate = async (user) => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    return rawToken; // sadece bu gönderilir!
};

export const findUserByResetToken = async (token) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    return await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    });
};

export const resetPasswordForUser = async (user, newPassword) => {
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
};

export const sendVerificationToken = async (user) => {
    if (!user) throw new AppError("User not found", 404);

    const verificationToken = authUtils.generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();
    console.log("user saved")

    await emailUtils.sendVerificationEmail(user.email, verificationToken);
}

export const getAllUsers = async () => {
    return await User.find().select("-password -roleHash -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");
};

export const getUserById = async (id) => {
    return User.findById(id).select("-password -roleHash -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");
};

export const updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
