// routes.js

import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

// Delete grades by studentNumber and courseId
router.delete("/grades/:studentNumber/:courseId", async (req, res) => {
  const studentNumber = req.params.studentNumber;
  const courseId = req.params.courseId;

  try {
    const deleteResult = await prisma.grade.deleteMany({
      where: { student_number: studentNumber, course_id: courseId },
    });

    if (deleteResult.count > 0) {
      console.log("Grades deleted successfully");
      res.status(200).json({ message: "Grades deleted successfully" });
    } else {
      console.log("No grades found to delete");
      res.status(404).json({ message: "Grades not found" });
    }
  } catch (error) {
    console.error("Error deleting grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
