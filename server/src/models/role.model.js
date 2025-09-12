import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["client", "admin"],
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: String,
        enum: ["user:read", "user:write", "order:manage", "product:manage"]
    }]
}, { timestamps: true });

export const Role = mongoose.model("Role", roleSchema);