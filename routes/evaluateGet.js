import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Route to fetch all evaluations
router.get("/evaluate", async (req, res) => {
  try {
    const evaluations = await prisma.evaluate.findMany();
    return res.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch evaluations by student number
router.get("/evaluate-student", async (req, res) => {
  try {
    const studentNumber = req.query.studentNumber;
    if (!studentNumber) {
      return res.status(400).json({ error: "Student number is required" });
    }
    const evaluations = await prisma.evaluate.findMany({
      where: {
        student_number: studentNumber,
      },
    });
    return res.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations by student:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch evaluations by faculty id
router.get("/evaluate-faculty", async (req, res) => {
  try {
    const facultyNumber = req.query.facultyNumber;
    if (!facultyNumber) {
      return res.status(400).json({ error: "Faculty Id is required" });
    }
    const evaluations = await prisma.evaluate.findMany({
      where: {
        faculty_number: facultyNumber,
      },
    });
    return res.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations by faculty:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch evaluations by student number, year, and semester
router.get("/evaluate-recommend", async (req, res) => {
  try {
    const { student_number, eval_year, eval_sem } = req.query;

    const year = parseInt(eval_year, 10);

    const evaluations = await prisma.evaluate.findMany({
      where: {
        student_number: student_number,
        eval_year: year,
        eval_sem: eval_sem,
      },
    });
    return res.json(evaluations);
  } catch (error) {
    console.error("Error fetching recommended evaluations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch evaluation date by course code
router.get("/evaluate-get", async (req, res) => {
  try {
    const courseCode = req.query.course_reco;
    const evaluation = await prisma.evaluate.findFirst({
      where: {
        course_reco: courseCode,
      },
    });
    if (evaluation) {
      return res.json({ date_eval: evaluation.date_eval });
    } else {
      return res.status(404).json({ error: "Course code not found" });
    }
  } catch (error) {
    console.error("Error fetching evaluation date:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to calculate total evaluation credits by year, semester, and student number
router.get("/evaluate-units", async (req, res) => {
  try {
    const { eval_year, eval_sem, student_number } = req.query;

    // Parse eval_year to integer
    const parsedEvalYear = parseInt(eval_year);

    // Query to get total evaluated credit units
    const totalEvaluatedCreditUnits = await prisma.evaluate.aggregate({
      _sum: {
        evalcredit_unit: true,
      },
      where: {
        eval_year: parsedEvalYear, // Use the parsed value here
        eval_sem: eval_sem,
        student_number: student_number,
      },
    });

    console.log("Total Evaluated Credit Units:", totalEvaluatedCreditUnits);
    return res.json({
      totalEvaluatedCreditUnits: totalEvaluatedCreditUnits._sum.evalcredit_unit,
    });
  } catch (error) {
    console.error("Error calculating total evaluation credits:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

export default router;
