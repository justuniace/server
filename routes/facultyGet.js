import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();


router.get("/faculty/password/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { email },
      select: { faculty_password: true },
    });

    if (!faculty) {
      console.log("No data found for faculty email:", email);
      return res.status(404).json({ message: "Faculty not found" });
    }

    return res.json({ faculty_password: faculty.faculty_password });
  } catch (error) {
    console.error("Error querying the database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/faculty/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { email },
    });

    if (!faculty) {
      console.log("No data found for faculty email:", email);
      return res.status(404).json({ message: "Faculty not found" });
    }

    return res.json(faculty);
  } catch (error) {
    console.error("Error querying the database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/faculty", async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany();
    return res.json(faculty);
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/facultyId/:facultyNumber", async (req, res) => {
  const facultyNumber = req.params.facultyNumber;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { faculty_number: facultyNumber },
    });

    if (!faculty) {
      console.log("No data found for facultyId:", facultyNumber);
      return res.status(404).json({ error: "Faculty not found" });
    }

    console.log("Result:", faculty); // Log the result to check
    return res.json(faculty); // Assuming you expect a single faculty record
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;