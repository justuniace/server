import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.email || decoded.purpose !== "verification") {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Update the user's record in the database to mark their email as verified
    await prisma.user.update({
      where: { email: decoded.email },
      data: { emailVerified: true },
    });

    // Optionally, you can redirect the user to a success page
    res.redirect("/verification-success");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
