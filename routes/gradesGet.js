import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

// Get all grades
router.get("/all-grades", async (req, res) => {
  try {
    const allGrades = await prisma.grade.findMany();
    res.json(allGrades);
  } catch (error) {
    console.error("Error fetching all grades:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/grades", async (req, res) => {
  const studentNumber = req.query.studentNumber;
  try {
    const studentGrades = await prisma.grade.findMany({
      where: { student_number: studentNumber },
    });
    res.json(studentGrades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/failedgrades", async (req, res) => {
  try {
    const failedGrades = await prisma.grade.findMany({
      where: { grades: { in: [5, -1] } },
    });
    res.json(failedGrades);
  } catch (error) {
    console.error("Error fetching failed grades:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
