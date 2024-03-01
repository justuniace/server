import { PrismaClient } from "@prisma/client";
import express from "express";

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

router.post("/studentsSignin/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const { gender, status, strand, student_password } = req.body;

    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: {
        student_password,
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

router.post("/studentverification/:studentNumber", async (req, res) => {
  const studentNumber = req.params.studentNumber;
  const { isVerified } = req.body;

  try {
    const updatedStudent = await prisma.student.update({
      where: { student_number: studentNumber },
      data: { isVerified },
    });

    if (!updatedStudent) {
      console.log("No faculty found for student number:", studentNumber);
      return res.status(404).json({ message: "Student not found" });
    }

    // Successful update
    res.status(200).json({
      message: "Student data updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error during update:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
