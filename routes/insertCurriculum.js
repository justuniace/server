import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express();
router.use(express.json());

router.post("/upload-curriculum", async (req, res) => {
  const data = req.body.data;
  const programId = req.body.program_id;
  const yearStarted = req.body.year_started;

  if (!data || !Array.isArray(data) || !programId || !yearStarted) {
    res.status(400).json({ error: "Invalid data format" });
    return;
  }

  try {
    // Capitalize course_sem in the data array
    const dataWithUpperCaseSem = data.map((row) => ({
      ...row,
      course_sem: row.course_sem ? row.course_sem.toUpperCase() : null,
    }));

    const curriculumData = dataWithUpperCaseSem.map((row) => ({
      // Map the fields to match the Course model
      course_code: row[0] || null,
      pre_requisite: row[1] || null,
      course_title: row[2] || null,
      num_lecture: parseInt(row[3]) || null,
      num_lab: parseInt(row[4]) || null,
      credit_unit: parseInt(row[5]) || null,
      course_year: parseInt(row[6]) || null,
      course_sem: row[7] || null,
      program_id: programId,
      year_started: yearStarted,
    }));

    // Use Prisma's createMany method to insert multiple records at once
    await prisma.course.createMany({
      data: curriculumData,
    });

    console.log("Data inserted successfully");
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

export default router;
