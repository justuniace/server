import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/checkEmail", async (req, res) => {
  const { email } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { email },
      select: { first_name: true, last_name: true, student_number: true },
    });

    if (student) {
      const { first_name, last_name, student_number } = student;
      res
        .status(200)
        .json({ exists: true, first_name, last_name, student_number });
      console.log(first_name, last_name, student_number);
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/facultycheckEmail", async (req, res) => {
  const { email } = req.body;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { email },
      select: { faculty_fname: true, faculty_lname: true, faculty_number: true },
    });

    if (faculty) {
      const { faculty_fname, faculty_lname, faculty_number } = faculty;
      res
        .status(200)
        .json({ exists: true, faculty_fname, faculty_lname, faculty_number });
      console.log(faculty_fname, faculty_lname, faculty_number);
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admincheckEmail", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { admin_email: email },
      select: { admin_email: true },
    });

    if (admin) {
      const { admin_email } = admin;
      res.status(200).json({ exists: true, admin_email });
      console.log(admin_email);
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
