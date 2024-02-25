import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/evaluate", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      course_reco,
      evalcredit_unit,
      requiredcredit_unit,
      faculty_id,
      student_number,
      date_eval,
      eval_year,
      eval_sem,
    } = req.body;

    // Create a new evaluation record using Prisma Client
    const newEvaluation = await prisma.evaluate.create({
      data: {
        course_reco,
        evalcredit_unit,
        requiredcredit_unit,
        faculty_id,
        student_number,
        date_eval,
        eval_year,
        eval_sem,
      },
    });

    console.log("Data inserted successfully");

    // Respond with a success message
    res
      .status(201)
      .json({ message: "Data inserted successfully", data: newEvaluation });
  } catch (error) {
    console.error("Error inserting data into the database: ", error);
    // Handle errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
