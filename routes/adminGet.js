import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/admin", async (req, res) => {
  console.log("Received GET request to /admin");

  try {
    const admins = await prisma.admin.findMany();
    console.log("Query Result:", admins);
    return res.json(admins);
  } catch (err) {
    console.error("Error querying the database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/:email", async (req, res) => {
  const email = req.params.email;
  console.log("Received email parameter:", email);

  try {
    const admin = await prisma.admin.findUnique({
      where: { admin_email: email },
    });

    if (!admin) {
      console.log("No data found for admin email:", email);
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Query result:", admin);
    return res.json(admin);
  } catch (err) {
    console.error("Error querying the database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
