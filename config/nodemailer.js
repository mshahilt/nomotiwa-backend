import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_ACCOUNT_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Your OTP Code</h2>
                <p style="font-size: 18px; font-weight: bold;">${otp}</p>
                <p>Please use this OTP to verify your email. It will expire in a few minutes.</p>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP Code: ${otp}`,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
