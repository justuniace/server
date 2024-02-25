import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/students", async (req, res) => {
  try {
    const {
      student_number,
      first_name,
      middle_name,
      last_name,
      gender,
      birthdate,
      status,
      email, 
      strand,
    } = req.body;

    const student = await prisma.student.create({
      data: {
        student_number,
        first_name,
        middle_name,
        last_name,
        gender,
        birthdate,
        status,
        email,
        strand,
      },
    });

    res.json(student);
  } catch (error) {
    console.error("Error during user signin:", error.message);
    res.status(500).json({ error: "An error occurred while signing the user" });
  }
});

router.post("/students/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const { gender, status, strand } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: {
        gender,
        status,
        strand,
      },
    });

    console.log("Updated Student:", updatedStudent);

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error during update:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the student" });
  }
});

export default router;
