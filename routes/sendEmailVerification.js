import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import { generateVerificationToken } from "./token"; // Import the generateVerificationToken function

dotenv.config();

const app = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// MongoDB or Prisma integration for database operations

app.post("/sendEmailVerification", async (req, res) => {
  try {
    const { to } = req.body;

    // Generate a verification token using the generateVerificationToken function
    const verificationToken = await generateVerificationToken(to, "1d");

    // Construct the verification link with the token
    // const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

    // Email content with the verification link
    const emailContent = `
      <p>Please click the following link to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;

    await transporter.sendMail({
      from: "pupces@gmail.com",
      to,
      subject: "Email Verification",
      html: emailContent, // Use html property for HTML content in the email
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email verification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
