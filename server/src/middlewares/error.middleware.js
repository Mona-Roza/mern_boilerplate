import { ERROR_CODES } from "../constants/error.constants.js";

export const errorHandler = (err, req, res, next) => {
    // Duplicate key (unique index) => 409
    if (err && err.code === 11000) {
        const fields = Object.keys(err.keyValue || {});
        // Pick a specific code if you know the field
        const code =
            fields.includes("email") ? ERROR_CODES.EMAIL_IN_USE :
                fields.includes("username") ? ERROR_CODES.USERNAME_IN_USE :
                    ERROR_CODES.DUPLICATE_ENTRY;

        const message =
            fields.includes("email") ? "Email already in use." :
                fields.includes("username") ? "Username already in use." :
                    "Duplicate entry.";

        return res.status(409).json({
            success: false,
            message,
            code,
            statusCode: 409,
            timestamp: new Date().toISOString()
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(", "),
            code: ERROR_CODES.INVALID_INPUT,
            statusCode: 400,
            timestamp: new Date().toISOString()
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid identifier.",
            code: ERROR_CODES.INVALID_INPUT,
            statusCode: 400,
            timestamp: new Date().toISOString()
        });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            code: ERROR_CODES.INVALID_TOKEN,
            statusCode: 401,
            timestamp: new Date().toISOString()
        });
    }

    // fallback
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal server error",
        code: err.code || "SERVER_ERROR",
        details: err.details ?? null,
        statusCode: status,
        timestamp: new Date().toISOString()
    });
};
