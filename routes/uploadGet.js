import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/studmessageData/:student_id", async (req, res) => {
  try {
    console.log("Received GET request to /studmessageData");

    const { student_id } = req.params;

    console.log("student_id:", student_id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ incoming_id: student_id }, { outgoing_id: student_id }],
      },
      orderBy: [{ incoming_id: "asc" }, { outgoing_id: "asc" }],
    });

    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    return res.json(messages);
  } catch (error) {
    console.error("Error in /messageData route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


router.get("/facultymessageData/:studentId", async (req, res) => {
  try {
    console.log("Received GET request to /facultymessageData");

    const { studentId } = req.params;

    console.log("studentId:", studentId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ incoming_id: studentId }, { outgoing_id: studentId }],
      },
      orderBy: [{ incoming_id: "asc" }, { outgoing_id: "asc" }],
    });

    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    return res.json(messages);
  } catch (error) {
    console.error("Error in /facultymessageData route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


router.get("/students123", async (req, res) => {
  try {
    console.log("Received GET request to /students123");

    // Fetch all students using Prisma Client
    const students = await prisma.student.findMany();

    // Check if any data was fetched
    if (students.length === 0) {
      return res.status(200).json([]);
    }

    // If data was fetched, send it as JSON response
    return res.json(students);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in /students123 route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.get("/messageData/:faculty_ID", async (req, res) => {
  try {
    console.log("Received GET request to /messageData");

    const program_id = req.query.program_id;
    const faculty_ID = req.params.faculty_ID;

    console.log("program_id:", program_id);
    console.log("faculty_ID:", faculty_ID);

    const messages = await prisma.message.findMany({
      where: {
        program_id,
        OR: [{ incoming_id: faculty_ID }, { outgoing_id: faculty_ID }],
      },
      orderBy: [{ incoming_id: "asc" }, { outgoing_id: "asc" }],
    });

    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    return res.json(messages);
  } catch (error) {
    console.error("Error in /messageData route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


router.get("/conversation/:selectedFacultyId", async (req, res) => {
  try {
    console.log("Received GET request to /conversation");

    const { selectedFacultyId } = req.params;
    const studentId = req.query.studentId;

    console.log("Selected Faculty ID:", selectedFacultyId);
    console.log("Student ID:", studentId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { incoming_id: selectedFacultyId, outgoing_id: studentId },
          { incoming_id: studentId, outgoing_id: selectedFacultyId },
        ],
      },
    });

    console.log("Query Result:", messages);

    return res.json(messages); // Return message data for the selected faculty ID
  } catch (error) {
    console.error("Error processing /conversation request:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/message/:messageId", async (req, res) => {
  try {
 
    const { messageId } = req.params;

   
    const message = await prisma.message.findUnique({
      where: {
        message_id: messageId,
      },
    });

   
    if (!message) {
    
      return res.status(404).json({ error: "Message not found" });
    }

    // Return the message details as a JSON response
    res.json(message);
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error fetching message details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/markMessagesAsRead", async (req, res) => {
  try {
    // Extract the messageIds from the request body
    const { messageIds } = req.body;

    // Update the is_read property of messages with the provided messageIds
    await prisma.message.updateMany({
      where: {
        message_id: {
          in: messageIds,
        },
      },
      data: {
        is_read: true,
      },
    });

    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "Messages marked as read successfully" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
