import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/faculty/:email", async (req, res) => {
  // Retrieve email from URL parameters
  const email = req.params.email;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const formattedBirthdate = new Date(req.body.birthdate);

  try {
    const faculty = await prisma.faculty.create({
      data: {
        faculty_password: req.body.faculty_password,
        gender: req.body.gender,
        birthdate: formattedBirthdate,
        email: email, // Use the email from URL parameters
      },
    });

    console.log("Data inserted successfully");

    

    res.status(201).json({ message: "Data inserted successfully", faculty });
  } catch (error) {
    console.error("Error inserting data into the database: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/faculty/:facultyNumber", async (req, res) => {
  const facultyNumber = req.params.facultyNumber;
  const { gender, birthdate } = req.body;

  try {
    const updatedFaculty = await prisma.faculty.update({
      where: { faculty_number: facultyNumber },
      data: { gender, birthdate },
    });

    if (!updatedFaculty) {
      console.log("No faculty found for faculty number:", facultyNumber);
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Successful update
    res.status(200).json({
      message: "Faculty data updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.error("Error during update:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
