/*
| Field        | Purpose                                                        | Example                                  |
| ------------ | -------------------------------------------------------------- | ---------------------------------------- |
| `success`    | Always `false` for errors (helps the client check quickly).    | `false`                                  |
| `message`    | Human-readable short description of the error.                 | `"Email already in use"`                 |
| `code`       | Optional app-specific error code for programmatic handling.    | `"EMAIL_IN_USE"`                         |
| `statusCode` | Optional HTTP status code (useful in debugging).               | `409`                                    |
| `details`    | Optional extra info (validation errors, missing fields, etc.). | `{ field: "email", issue: "duplicate" }` |
| `timestamp`  | Optional, helps with logging/debugging timelines.              | `"2025-08-12T21:12:00Z"`                 |
*/

export default class AppError extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const catchAsync = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);