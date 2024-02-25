import express from "express";
import { db } from "../db.js";

const app = express.Router();

app.get("/messageData", async (req, res) => {
  const { program_id } = req.query; // Destructure program_id from req.query

  console.log("Received GET request to /messageData");
  console.log("program_id:", program_id);

  const q = "SELECT * FROM message WHERE program_id = ?";
  console.log("Query:", q);

  // Execute the SQL query to fetch data from the message table where program_id matches
  db.query(q, [program_id], (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }

    // If no data is found, send an empty array
    if (results.length === 0) {
      return res.status(200).json([]);
    }

    // If data is found, send it as JSON response
    res.json(results);
  });
});





export default app;
