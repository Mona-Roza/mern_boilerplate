const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 64
    },
    username: {
        type: String,
        unique: true,
        require: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9_]+$/, 'is invalid']
    },
    email: {
        type: String,
        unique: true,
        require: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        maxLength: 64
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},
    { timestamp: true, }
);

export const User = mongoose.model("User", userSchema);

