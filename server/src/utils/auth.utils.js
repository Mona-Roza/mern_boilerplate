import jwt from "jsonwebtoken";

export const generateVerificationToken = () => Math.floor(1000000 + Math.random() * 90000).toString()

export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    /*
    // TODO: can you use this in mobile apps?
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    */
    return token;
};