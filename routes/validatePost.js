import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/validate", async (req, res) => {
  console.log("Received request body:", req.body);

  const dataToValidate = req.body;

  if (dataToValidate.length === 0) {
    return res.status(400).json({ error: "No data to validate" });
  }

  try {
    const insertPromises = dataToValidate.map(async (item) => {
      const studentNumber = item.student_number;
      const gradeId = item.grade_id;
      console.log("Received date to validate:", item.date_validated);

      // Parse the date from the request data
      const dateValidated = new Date(item.date_validated);

      // Check if the date is a valid date
      if (isNaN(dateValidated)) {
        throw new Error("Invalid date format");
      }

      // Format the date into ISO-8601 DateTime format
      const formattedDate = dateValidated.toISOString();

      // Insert data into the database
      await prisma.validated.create({
        data: {
          student_number: studentNumber,
          grade_id: gradeId,
          faculty_number: item.faculty_number,
          date_validated: formattedDate,
          course_id: item.course_id,
        },
      });
    });

    // Execute all the database insert operations concurrently
    await Promise.all(insertPromises);

    console.log("Data inserted successfully");

    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data into the database: ", error);
    if (error.message === "Invalid date format") {
      res.status(400).json({ error: "Invalid date format" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
export default router;
