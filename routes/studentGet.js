import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

// Route to get all students
router.get("/students/all", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    if (students.length === 0) {
      // Return an empty array if no students are found
      return res.json([]);
    }
    return res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/students", async (req, res) => {
  try {
    const studentNumber = req.query.studentNumber;

    if (!studentNumber) {
      return res.status(400).json({ error: "Student number is missing" });
    }

    // Use Prisma to query the database
    const student = await prisma.student.findUnique({
      where: { student_number: studentNumber },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    console.error("Error querying the database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/students/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const student = await prisma.student.findUnique({
      where: { student_number: studentNumber },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get students by program ID
router.get("/students/program/:programId", async (req, res) => {
  try {
    const programId = req.params.programId;
    const students = await prisma.student.findMany({
      where: { program_id: programId },
    });

    return res.json(students);
  } catch (error) {
    console.error("Error fetching students by program:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get student password by student number
router.get("/students/password/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const student = await prisma.student.findUnique({
      where: { student_number: studentNumber },
      select: { student_password: true },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.json({ student_password: student.student_password });
  } catch (error) {
    console.error("Error fetching student password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
