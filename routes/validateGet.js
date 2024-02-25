import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/validateData", async (req, res) => {
  console.log("Received GET request to /validateData");

  try {
    const studentNumber = req.query.studentNumber;

    if (!studentNumber) {
      return res
        .status(400)
        .json({ error: "Student number is required in the query parameters." });
    }

    const data = await prisma.validated.findMany({
      where: {
        student_number: studentNumber,
      },
      select: {
        course_id: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/validate", async (req, res) => {
  console.log("Received GET request to /validate");

  try {
    const studentNumber = req.query.student_number;

    if (!studentNumber) {
      return res
        .status(400)
        .json({ error: "Student number is required in the query parameters." });
    }

    const data = await prisma.validated.findMany({
      where: {
        student_number: studentNumber,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/validate/all", async (req, res) => {
  console.log("Received GET request to /validate/all");

  try {
    const data = await prisma.validated.findMany();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/validation-status", async (req, res) => {
  console.log("Received GET request to /validation-status");

  try {
    const { student_number, course_id } = req.query;

    const validation = await prisma.validated.findFirst({
      where: {
        student_number,
        course_id,
      },
      select: {
        date_validated: true,
      },
    });

    const dateValidated = validation ? validation.date_validated : null;

    res.status(200).json({ date_validated: dateValidated });
  } catch (error) {
    console.error("Error in /validation-status route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.get("/fetch_course_codes", async (req, res) => {
  console.log("Received GET request to /fetch_course_codes");

  try {
    const courseCodes = await prisma.validated.findMany({
      select: {
        course_id: true,
      },
    });

    const courseCodeList = courseCodes.map((entry) => entry.course_id);

    res.status(200).json({ course_codes: courseCodeList });
  } catch (error) {
    console.error("Error fetching course codes:", error);
    res.status(500).json({
      error:
        "Internal Server Error. Check server and database logs for details.",
    });
  }
});;

export default router;
