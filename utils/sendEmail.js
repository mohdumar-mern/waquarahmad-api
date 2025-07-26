import nodemailer from "nodemailer"

export const sendEmail = async (subject, text, replyTo) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
        const mailOptions = {
            from: `Waquar ahmad ${process.env.EMAIL_USER}`,
            to: replyTo,
            subject,
            text,
        };
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(" Email sending failed:", error.message);
        throw new Error("Email sending failed: " + error.message);
    }
}