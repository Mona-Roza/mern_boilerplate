export const ERROR_CODES = {
    // Authentication
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",     // Wrong email/password
    INVALID_TOKEN: "INVALID_TOKEN",                 // Token invalid or expired
    TOKEN_MISSING: "TOKEN_MISSING",                 // No token in request
    UNAUTHORIZED: "UNAUTHORIZED",                   // Not logged in

    // Authorization / Permissions
    FORBIDDEN: "FORBIDDEN",                         // No permission
    ROLE_NOT_ALLOWED: "ROLE_NOT_ALLOWED",           // User role can't perform this

    // User management
    EMAIL_IN_USE: "EMAIL_IN_USE",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_NOT_VERIFIED: "USER_NOT_VERIFIED",

    // Validation
    MISSING_FIELDS: "MISSING_FIELDS",               // Required field missing
    INVALID_EMAIL: "INVALID_EMAIL",
    WEAK_PASSWORD: "WEAK_PASSWORD",
    INVALID_INPUT: "INVALID_INPUT",                 // Generic invalid data

    // Resource-related
    NOT_FOUND: "NOT_FOUND",                         // Resource doesn't exist
    DUPLICATE_ENTRY: "DUPLICATE_ENTRY",             // Duplicate DB entry

    // Server / General
    SERVER_ERROR: "SERVER_ERROR",                   // Generic 500
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",      // External service down

    // Category-specific
    PARENT_CATEGORY_NOT_FOUND: "PARENT_CATEGORY_NOT_FOUND",
    CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND"
};
