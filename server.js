import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import adminGetRouter from "./routes/adminGet.js"; // Import the router instance
import adminPutRouter from "./routes/adminPut.js";
import checkEmail from "./routes/checkEmail.js";
import curriculumGet from "./routes/curriculumGet.js";
import evaluateGet from "./routes/evaluateGet.js";
import evaluatePost from "./routes/evaluatePost.js";
import facultyGet from "./routes/facultyGet.js";
import facultyPost from "./routes/facultyPost.js";
import facultyPut from "./routes/facultyPut.js";
import gradesDelete from "./routes/gradesDelete.js";
import gradesGet from "./routes/gradesGet.js";
import gradesPost from "./routes/gradesPost.js";
import insertCurriclum from "./routes/insertCurriculum.js";
import programsGet from "./routes/programsGet.js";
import programPost from "./routes/programsPost.js";
import protectRoute from "./routes/protecRoute.js";
import sendEmail from "./routes/sendEmail.js";
import studentGet from "./routes/studentGet.js";
import studentPost from "./routes/studentPost.js";
import studentPut from "./routes/studentPut.js";
import updateGrades from "./routes/updateGrades.js";
import updatePass from "./routes/updatePass.js";
import upload from "./routes/upload.js";
import validateGet from "./routes/validateGet.js";
import validatePost from "./routes/validatePost.js";
//import veriToken from "./routes/veriToken.js";
import uploadGet from "./routes/uploadGet.js";
import uploadPost from "./routes/uploadPost.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to your API!");
});

// Correctly mount the adminGetRouter as middleware
app.use("/api", adminGetRouter);
app.use("/api", adminPutRouter);
app.use("/api", checkEmail);
app.use("/api", curriculumGet);
app.use("/api", evaluateGet);
app.use("/api", evaluatePost);
app.use("/api", facultyPost);
app.use("/api", facultyGet);
app.use("/api", facultyPut);
app.use("/api", gradesDelete);
app.use("/api", gradesGet);
app.use("/api", gradesPost);
app.use("/api", insertCurriclum);
app.use("/api", programsGet);
app.use("/api", programPost);
app.use("/api", protectRoute);
app.use("/api", sendEmail);
app.use("/api", studentGet);
app.use("/api", studentPost);
app.use("/api", studentPut);
app.use("/api", updateGrades);
app.use("/api", updatePass);
app.use("/api", upload);
app.use("/api", validateGet);
app.use("/api", validatePost);
app.use("/api", uploadGet);
app.use("/api", uploadPost);

app.use("/api/v1/uploads", express.static(`${__dirname}/public`));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
