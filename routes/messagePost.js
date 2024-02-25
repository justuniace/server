import express from "express";
import multer from "multer";
import { db } from "../db.js";
import fs from "fs";

const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/images")) {
      fs.mkdirSync("public/images");
    }

    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, inputMessage, email, program_id } = req.body;

    let image = null;
    if (req.file !== undefined) {
      image = req.file.filename;
      console.log("req", req.file.filename);
    }

    const sql =
      "INSERT INTO message (name, inputMessage, email, image, program_id) VALUES (?, ?, ?, ?, ?)";

    db.query(
      sql,
      [name, inputMessage, email, image, program_id],
      (err, result) => {
        if (err) {
          console.log("Data insertion err:", err);
          res.send("Error - Data insertion failed"); // Send error response
        } else {
          console.log("Data inserted:", result);
          res.send("Data inserted successfully"); // Send success response
        }
      }
    );
  } catch (error) {
    console.log("Data inserting error:", error);
  }
});

export default app;
