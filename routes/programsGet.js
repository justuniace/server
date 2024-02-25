

import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Function to fetch programs from the database using Prisma
async function fetchProgramsFromDatabase() {
  try {
    const programs = await prisma.program.findMany();
    return programs;
  } catch (error) {
    console.error("Error fetching programs from the database: ", error);
    throw new Error("Error fetching programs from the database.");
  }
}

// Route to get all programs
router.get("/programs", async (req, res) => {
  console.log("Received GET request to /programs");

  try {
    const programs = await fetchProgramsFromDatabase();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
