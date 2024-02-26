import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/evaluate", async (req, res) => {
  try {
    const {
      course_reco,
      evalcredit_unit,
      requiredcredit_unit,
      faculty_number,
      student_number,
      date_eval,
      eval_year,
      eval_sem,
    } = req.body;

    // Convert eval_year to an integer if it's a string
    const evalYear = parseInt(eval_year);

    // Use Prisma Client to create a new evaluation record
    const evaluation = await prisma.evaluate.create({
      data: {
        course_reco,
        evalcredit_unit,
        requiredcredit_unit,
        faculty_number,
        student_number,
        date_eval,
        eval_year: isNaN(evalYear) ? null : evalYear, // Provide integer or null value
        eval_sem,
      },
    });

    return res.json(evaluation);
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});


export default router;
