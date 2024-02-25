// routes.js

import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/grades", async (req, res) => {
  const { student_number, course_id, grades, remarks } = req.body;

  try {
    const createdGrade = await prisma.grade.create({
      data: {
        student_number,
        course_id,
        grades,
        remarks,
      },
    });

    console.log("Data inserted successfully");
    res
      .status(201)
      .json({ message: "Data inserted successfully", grade: createdGrade });
  } catch (error) {
    console.error("Error inserting data into the database: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
