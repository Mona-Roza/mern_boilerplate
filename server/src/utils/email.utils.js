import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./email.templates.js";
import { mailtrapClient, sender } from "../config/mailtrap.config.js";
import { logger } from "./logger.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email }],
            subject: "Verify Your e-mail",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
            category: "Email Verification"
        });

        logger.info("Verification e-mail send successfully", response);
    } catch (err) {
        logger.error({ err }, `Error sending verification`);
        throw new Error(`Error sending verification email: ${err}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email }],
            subject: "Welcome!",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
            category: "Welcome"
        });
        logger.info("Welcome email sent successfully", response);
    } catch (err) {
        logger.error({ err }, "Error sending welcome email");
    }

};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email }], // some SDK versions accept string; array-of-objects is safest
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });
        logger.info("Password reset email sent", response);
    } catch (err) {
        logger.error({ err }, "Error sending reset email");
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email }],
            subject: "Your password was reset",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });
        logger.info("Password reset success email sent", response);
    } catch (err) {
        logger.error({ err }, "Error sending reset success email");
    }
};
