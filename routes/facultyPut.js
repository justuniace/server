
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Update faculty password by email
router.put("/updatefacultypassword/:facultyemail", async (req, res) => {
  const facultyEmail = req.params.facultyemail;
  const updatedFacultyData = req.body;

  try {
    await prisma.faculty.update({
      where: { email: facultyEmail },
      data: { faculty_password: updatedFacultyData.faculty_password },
    });

    console.log("Faculty password updated successfully");
    res.json({ message: "Faculty password updated successfully" });
  } catch (error) {
    console.error("Error updating faculty password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update faculty by email
router.put("/updatefaculty/:email", async (req, res) => {
  const email = req.params.email;
  const updatedFacultyData = req.body;

  try {
    await prisma.faculty.update({
      where: { email },
      data: updatedFacultyData,
    });

    console.log("Faculty updated successfully");
    res.json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update faculty by facultyId
router.put("/faculty/:facultyId", async (req, res) => {
  const facultyId = req.params.facultyId;
  const updatedFacultyData = req.body;

  try {
    await prisma.faculty.update({
      where: { faculty_number: facultyId },
      data: updatedFacultyData,
    });

    console.log("Faculty updated successfully");
    res.json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
