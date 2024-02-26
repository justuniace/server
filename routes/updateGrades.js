// grades.js

import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

// Update or insert grades
router.put("/update-grades", async (req, res) => {
  try {
    const { studentNumber, course_id, grades, remarks } = req.body;
    if (
      !studentNumber ||
      !course_id ||
      grades === undefined ||
      remarks === undefined
    ) {
      return res.status(400).json({ error: "Invalid request. Missing data." });
    }

    // Query for the existing grade record
    const existingGrade = await prisma.grade.findFirst({
      where: {
        student_number: studentNumber,
        course_id: course_id,
      },
    });

    if (existingGrade) {
      await prisma.grade.update({
        where: {
          grade_id: existingGrade.grade_id,
        },
        data: {
          grades: grades,
          remarks: remarks,
        },
      });
      console.log("Grades updated successfully");
      res.status(200).json({ message: "Grades updated successfully" });
    } else {
      await prisma.grade.create({
        data: {
          student_number: studentNumber,
          course_id: course_id,
          grades: grades,
          remarks: remarks,
        },
      });
      console.log("New grades inserted successfully");
      res.status(200).json({ message: "New grades inserted successfully" });
    }
  } catch (error) {
    console.error("Error updating/inserting grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update grades by student number and course code
router.put("/grades/:studentNumber/:courseCode", async (req, res) => {
  try {
    const { studentNumber, courseCode } = req.params;
    const updatedGrades = req.body.grades;

    const updatedGrade = await prisma.grade.update({
      where: { student_number_course_id: { studentNumber, courseCode } },
      data: { grades: updatedGrades },
    });

    console.log("Updated Grades Data:", updatedGrade);
    res.status(200).json(updatedGrade);
  } catch (error) {
    console.error("Error updating grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
