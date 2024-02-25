import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

// Route to create a program
router.post("/programs", async (req, res) => {
  const { program_name } = req.body;

  try {
    const createdProgram = await prisma.program.create({
      data: {
        program_name,
      },
    });

    res.status(201).json(createdProgram);
  } catch (error) {
    console.error("Error during program creation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the program" });
  }
});

// Route to create a program with program abbreviation
router.post("/program", async (req, res) => {
  console.log("Received POST request to /programs");

  const { program_abbr, program_name } = req.body;

  if (!program_abbr || !program_name) {
    return res
      .status(400)
      .json({ error: "Both program_abbr and program_name are required." });
  }

  try {
    const createdProgram = await prisma.program.create({
      data: {
        program_name,
        program_abbr,
      },
    });

    res.status(201).json(createdProgram);
  } catch (error) {
    console.error("Error during program creation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the program" });
  }
});

export default router;
