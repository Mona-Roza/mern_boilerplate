import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./email.templates.js";
import { mailtrapClient, sender } from "../config/mailtrap.config.js";
import { verify } from "jsonwebtoken";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email;

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your e-mail",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
            category: "Email Verification"
        });

        // TODO Log
        console.log("Verification e-mail send successfully", response);
    } catch (err) {
        // TODO Log
        console.error(`Error sending verification`, err);
        throw new Error(`Error sending verification email: ${err}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = email;

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome!",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
            category: "Welcome"
        });
        //TODO Log
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        //TODO Log
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
    }

};

export const sendPasswordResetEmail = async (email, resetURL) => {
    //TODO
};

export const sendResetSuccessEmail = async (email) => {
    //TODO
};