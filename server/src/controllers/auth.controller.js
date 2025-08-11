import bcrypt from "bcrypt";
import crypto from "crypto";

import { generateToken, generateVerificationToken } from "../utils/auth.utils.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/email.utils.js";
import { User } from "../models/user.model.js";

// signUp 
export const signUp = async (req, res) => {
    // Capture email, password and name from request body
    const { name, username, email, password } = req.body;

    try {
        // Check if all fields full
        if (!name || !username || !email || !password) {
            // TODO error middleware here ???
            return res.status(400).json({ success: false, message: "all fields are required." });

        }

        // TODO validation for email and password

        // Check if email is already in use 
        const emailAlreadyInUse = await User.findOne({ email });
        if (emailAlreadyInUse) {
            return res.status(400).json({ success: false, message: "email in use" });
        }

        // Check id username is already in use
        const usernameAlreadyInUse = await User.findOne({ username });
        if (usernameAlreadyInUse) {
            return res.status(400).json({ success: false, message: "email in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate new verification token
        const verificationToken = generateVerificationToken();

        // Create new user
        const user = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // Save it to db
        await user.save();

        // JWT 
        // TODO generate token and set it to cookie
        generateToken(res, user._id); // with using generated user id

        // Send the verification code to new user's e-mail
        await sendVerificationEmail(user.email, verificationToken);

        // Response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc, // ?
                password: undefined,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }

};

// verifyEmail
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find user by verification Token and verification token expire date
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // Check if user exist
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid or expired verification code" });
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
            message: "Email verified successfully",
            user: {
                ...user._doc, // ?
                password: undefined,
            },
        });

    } catch (err) {
        console.log("error in verifyEmail ", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
