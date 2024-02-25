import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/faculty", async (req, res) => {
  const formattedBirthdate = new Date(req.body.birthdate);

  try {
    const faculty = await prisma.faculty.create({
      data: {
        faculty_fname: req.body.faculty_fname,
        faculty_mname: req.body.faculty_mname,
        faculty_lname: req.body.faculty_lname,
        faculty_password: req.body.faculty_password,
        gender: req.body.gender,
        birthdate: formattedBirthdate,
        email: req.body.email,
        program: { connect: { program_id: req.body.program_id } },
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
