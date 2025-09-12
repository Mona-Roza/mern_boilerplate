import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateVerificationToken = () => Math.floor(100000 + Math.random() * 900000).toString();

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Set the token in a cookie 
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
};
