
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.put("/updateadmin", async (req, res) => {
  const updatedAdminData = req.body;

  try {
    const updatedAdmin = await prisma.admin.updateMany({
      data: updatedAdminData,
    });

    console.log("Admins updated successfully:", updatedAdmin);
    return res.json({ message: "Admins updated successfully" });
  } catch (err) {
    console.error("Error updating the database:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
