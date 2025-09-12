import { Role } from "../models/role.model.js";
import crypto from "crypto";

export const findRoleByName = async (roleName) => {
    return await Role.findOne({ name: roleName });
};

export const createRoleIfNotExists = async (name, permissions = []) => {
    let role = await Role.findOne({ name });
    if (!role) {
        const hash = crypto.createHash("sha256").update(name).digest("hex");
        role = await Role.create({ name, hash, permissions });
    }
    return role;
};

export const getRoleByName = async (roleName) => {
    return await Role.findOne({ name: roleName });
}

export const generateRoleHash = (userId, roleId) => {
    return crypto.createHash("sha256")
        .update(userId + roleId)
        .digest("hex");
};
