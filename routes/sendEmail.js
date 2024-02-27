import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto"; // Import the crypto module

dotenv.config();

const app = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/generateVerificationToken", async (req, res) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString("hex");

    // Store the token in your database for verification later

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating verification token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/sendEmail", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    await transporter.sendMail({
      from: "pupces@gmail.com",
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
