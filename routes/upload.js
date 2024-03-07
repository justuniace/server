import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const router = express.Router();
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
// const upload = multer({ storage });


router.post("/studentsupload", async (req, res) => {
  console.log("Natatawag");
  try {
    const { studentsData, program_id, curriculum_year } = req.body;

    if (!studentsData || !Array.isArray(studentsData)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const duplicateEntries = [];

    for (const student of studentsData) {
      const {
        "Student Number": student_number,
        "First Name": first_name,
        "Middle Name": middle_name,
        "Last Name": last_name,
        Gender: gender,
        Email: email,
        Birthdate: birthdate,
        Status: status,
        "Student Password": student_password,
        Strand: strand,
      } = student;

      // Check if the entry already exists in the database
      const existingStudent = await prisma.student.findUnique({
        where: {
          student_number: student_number,
        },
      });

      if (existingStudent) {
        console.log(
          "Duplicate entry found for Student Number:",
          student_number
        );
        // Add duplicate entry to the list
        duplicateEntries.push({
          student_number,
          message: `Duplicate entry found for Student Number: ${student_number}`,
        });
      } else {
        // Insert data into the database, including program_id
        try {
          await prisma.student.create({
            data: {
              student_number,
              first_name,
              middle_name,
              last_name,
              gender,
              email,
              birthdate,
              status,
              student_password,
              strand,
              program_id,
              curriculum_year, // Add program_id to the parameters
            },
          });
          console.log("Data inserted successfully");
        } catch (error) {
          console.error("Error inserting data:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    }

    // Set the response status and message based on whether there are duplicate entries
    let responseStatus;
    let responseMessage;

    if (duplicateEntries.length > 0) {
      responseStatus = 409;
      responseMessage = "Duplicate entries found";
    } else {
      responseStatus = 200;
      responseMessage = "Data inserted successfully";
    }

    // Respond with success status and duplicate entries
    res.status(responseStatus).json({
      message: responseMessage,
      duplicateEntries,
    });
  } catch (error) {
    console.error("Error handling studentsupload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/facultyupload", async (req, res) => {
  try {
    const { facultyData, program_id } = req.body;

    if (!facultyData || !Array.isArray(facultyData)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const duplicateEntries = [];

    for (const faculty of facultyData) {
      const existingFaculty = await prisma.faculty.findUnique({
        where: { faculty_number: faculty["Faculty Number"] },
      });

      if (existingFaculty) {
        duplicateEntries.push({
          faculty_number: faculty["Faculty Number"],
          message: `Duplicate entry found for Faculty Number: ${faculty["Faculty Number"]}`,
        });
      } else {
        await prisma.faculty.create({
          data: {
            faculty_number: faculty["Faculty Number"],
            faculty_fname: faculty["First Name"],
            faculty_mname: faculty["Middle Name"],
            faculty_lname: faculty["Last Name"],
            gender: faculty.Gender,
            birthdate: faculty.Birthdate,
            email: faculty.Email,
            program_id: program_id,
          },
        });
      }
    }

    const responseStatus = duplicateEntries.length > 0 ? 409 : 200;
    const responseMessage =
      duplicateEntries.length > 0
        ? "Duplicate entries found"
        : "Data inserted successfully";

    res.status(responseStatus).json({
      message: responseMessage,
      duplicateEntries,
    });
  } catch (error) {
    console.error("Error handling facultyupload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
