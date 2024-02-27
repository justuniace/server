// Import PrismaClient
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Function to generate verification token and store it in the database
export async function generateVerificationToken(email, expiresIn) {
  try {
    // Generate a verification token with the user email
    const verificationToken = jwt.sign(
      { email, purpose: "verification" },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Save the verification token and user email to the database using Prisma
    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        createdAt: new Date(), // Set the createdAt field to the current date and time
      },
    });

    return verificationToken;
  } catch (error) {
    // Handle errors if any
    console.error("Error generating verification token:", error);
    throw new Error("Failed to generate verification token");
  }
}
