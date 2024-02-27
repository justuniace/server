import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Prisma client initialization
const prisma = new PrismaClient();

// Body parser middleware
app.use(bodyParser.json());

// Endpoint to generate a verification token
app.post("/generateVerificationToken", async (req, res) => {
  try {
    const { email, expiresIn } = req.body;

    // Generate a verification token with the user's email and expiration time
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn });

    // Store the token in the database using Prisma
    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
      },
    });

    // Send the token back to the client
    res.json({ token });
  } catch (error) {
    console.error("Error generating verification token:", error);
    res.status(500).json({ error: "Failed to generate verification token" });
  }
});
