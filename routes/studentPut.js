// students.js

import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.put("/updatestudents/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const {
      first_name,
      middle_name,
      last_name,
      gender,
      birthdate,
      status,
      email,
      strand,
    } = req.body;

    const formattedBirthdate = new Date(birthdate).toISOString();

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: {
        first_name,
        middle_name,
        last_name,
        gender,
        birthdate: formattedBirthdate,
        status,
        email,
        strand,
      },
    });

    res.json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updatestudents/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const updatedStudentData = req.body;

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: updatedStudentData,
    });

    res.json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update student status
router.put("/students/update-status/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const { newStatus } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: { status: newStatus },
    });

    res.json({
      message: "Student status updated successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update student password
router.put("/updatestudentspassword/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const { student_password } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: { student_password },
    });

    res.json({
      message: "Student password updated successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
