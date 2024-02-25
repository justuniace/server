// grades.js

import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

// Update or insert grades
router.put("/update-grades", async (req, res) => {
  try {
    const { studentNumber, courseId, grades, remarks } = req.body;

    console.log("Received Request Body:", req.body);

    if (
      !studentNumber ||
      !courseId ||
      grades === undefined ||
      remarks === undefined
    ) {
      console.log("Invalid request. Missing data.");
      return res.status(400).json({ error: "Invalid request. Missing data." });
    }

const existingGrade = await prisma.grade.findFirst({
  where: {
    student_number: studentNumber,
    course_id: courseId,
  },
});



    console.log("Existing Grade:", existingGrade);

    if (existingGrade) {
      console.log("Updating existing grade with data:", { grades, remarks });

      await prisma.grade.update({
        where: { student_number_course_id: { studentNumber, courseId } },
        data: { grades, remarks },
      });
      console.log("Grades updated successfully");
      res.status(200).json({ message: "Grades updated successfully" });
    } else {
      console.log("Creating new grade with data:", {
        studentNumber,
        courseId,
        grades,
        remarks,
      });

      await prisma.grade.create({
        data: {
          student: { connect: { student_number: studentNumber } },
          course: { connect: { course_id: courseId } },
          grades,
          remarks,
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
