import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 64
    },
    email: {
        type: String,
        unique: true,
        trim: true, lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
        maxlength: 64,
        select: false
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    deliveryAddress: {
        type: String,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: null
    },
    roleHash: {
        type: String,
        default: null
    },
    accountStatus: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},
    { timestamps: true, }
);

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.role;
        delete ret.roleHash;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiresAt;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.__v;
        return ret;
    }
});

export const User = mongoose.model("User", userSchema);

