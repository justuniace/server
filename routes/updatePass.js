
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/updatePassword", async (req, res) => {
  try {
    const { studentNumber, studentPassword } = req.body;

    console.log(
      "Received request to update password for student number:",
      studentNumber
    );
    console.log("New password:", studentPassword);

    if (!studentNumber) {
      return res.status(400).json({ error: "Student number is required" });
    }

    await prisma.student.update({
      where: { student_number: studentNumber },
      data: { student_password: studentPassword },
    });

    console.log(
      "Password updated successfully for student number:",
      studentNumber
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/facultyupdatePassword", async (req, res) => {
  try {
    const { facultyNumber, facultyPassword } = req.body;

    console.log(
      "Received request to update password for faculty ID:",
      facultyNumber
    );
    console.log("New password:", facultyPassword);

    await prisma.faculty.update({
      where: { faculty_number: facultyNumber },
      data: { faculty_password: facultyPassword },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/adminupdatePassword", async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    console.log(
      "Received request to update password for admin email:",
      adminEmail
    );
    console.log("New password:", adminPassword);

    await prisma.admin.update({
      where: { admin_email: adminEmail },
      data: { admin_password: adminPassword },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
