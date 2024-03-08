import { PrismaClient } from "@prisma/client";
import express from "express";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "public/images";
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validate file types, only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post("/message/upload", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      inputMessage,
      email,
      program_id,
      incoming_id,
      outgoing_id,
      sent_at,
    } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    // Convert sent_at to a JavaScript Date object
    const sentAtDate = new Date(sent_at);

    // Check if sentAtDate is a valid date
    if (isNaN(sentAtDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Create a new message using Prisma Client
    const newMessage = await prisma.message.create({
      data: {
        name,
        inputMessage,
        email,
        image,
        program_id,
        incoming_id,
        outgoing_id,
        sent_at: sentAtDate,
      },
    });

    console.log("Data inserted:", newMessage);
    res.send("Data inserted successfully");
  } catch (error) {
    console.log("Data inserting error:", error);
    res.status(500).send("Error - Data insertion failed");
  }
});

export default router;
