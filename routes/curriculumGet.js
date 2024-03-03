import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

// Route to fetch all data from the courses collection
router.get("/curriculum/all", async (req, res) => {
  try {
    // Use Prisma Client to query all documents from the Course model
    const courses = await prisma.course.findMany();

    // Return the courses data as JSON response
    return res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/curriculum-yearstarted", async (req, res) => {
  try {
    // Use Prisma Client to query distinct year_started values from Course model
    const yearStartedValues = await prisma.course.findMany({
      distinct: ["year_started"],
      select: { year_started: true },
    });

    // Extract year_started values from the result
    const yearStarted = yearStartedValues.map((course) => course.year_started);

    // Return year_started values as JSON response
    return res.json(yearStarted);
  } catch (error) {
    console.error("Error fetching year_started values:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch courses based on program_id and year_started
router.get("/curriculum", async (req, res) => {
  console.log("Received GET request to /curriculum");

  // Extract program_id and year_started from the query parameters
  const programId = req.query.programId;
  const yearStarted = parseInt(req.query.yearStarted, 10);

  if (!programId || !yearStarted) {
    return res.status(400).json({
      error:
        "Both program_id and year_started are required in the query parameters.",
    });
  }

  try {
    // Use Prisma Client to query courses based on program_id and year_started
    const courses = await prisma.course.findMany({
      where: {
        program_id: programId,
        year_started: yearStarted,
      },
      include: {
        program: true, // Include related program data
      },
    });

    // Modify the data before sending it to the client
    const modifiedData = courses.map((course) => {
      // Remove '\r\n' characters from the course code
      course.course_code = course.course_code.replace(/\r\n/g, "");
      return course;
    });

    // Send the modified data back to the client
    return res.json(modifiedData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/graduate-curriculum", async (req, res) => {
  console.log("Received GET request to /graduate-curriculum");

  // Extract programId, yearStarted, and course_id from the query parameters
  const programId = req.query.programId;
  const yearStarted = parseInt(req.query.yearStarted, 10);
  const courseId = req.query.courseId;

  if (!programId || !yearStarted || !courseId) {
    return res.status(400).json({
      error:
        "Both programId, yearStarted, and courseId are required in the query parameters.",
    });
  }

  try {
    // Use Prisma Client to query courses based on programId, yearStarted, and courseId
    const courses = await prisma.course.findMany({
      where: {
        program_id: programId,
        year_started: yearStarted,
        course_id: courseId,
      },
      include: {
        program: true, // Include related program data
      },
    });

    // Send the courses data back to the client
    return res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/evalcurriculum", async (req, res) => {
  try {
    console.log("Received GET request to /evalcurriculum");

    const programId = req.query.programId;
    const yearStarted = parseInt(req.query.yearStarted, 10);

    const courseCode = req.query.courseCode;

    // Check if all required query parameters are provided
    if (!programId || !yearStarted || !courseCode) {
      return res.status(400).json({
        error:
          "programId, yearStarted, and courseCode are required query parameters.",
      });
    }

    // Use Prisma Client to execute the query
    const course = await prisma.course.findFirst({
      where: {
        program_id: programId,
        year_started: yearStarted,
        course_code: courseCode,
      },
      include: {
        program: true, // Include related program data
      },
    });

    // If course is not found, return a 404 response
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Modify the data before sending it to the client
    course.course_sem = course.course_sem.toUpperCase();

    // Send the modified data back to the client
    return res.json(course);
  } catch (error) {
    console.error("Error in /evalcurriculum route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumyearsem", async (req, res) => {
  try {
    const { year, semester } = req.query;
    console.log(
      `Received GET request to /curriculumyearsem for year ${year} and semester ${semester}`
    );

    // Checking if year and semester are provided
    if (!year || !semester) {
      return res.status(400).json({
        error: "Both year and semester are required query parameters.",
      });
    }

    // Use Prisma Client to execute the query
    const courses = await prisma.course.findMany({
      where: {
        course_year: year,
        course_sem: semester,
      },
    });

    // Send the data back to the client
    return res.json(courses);
  } catch (error) {
    console.error("Error in /curriculumyearsem route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

// Route to get course details by course code
router.get("/curriculum/:courseCode", async (req, res) => {
  const { courseCode } = req.params;
  console.log(`Received GET request for course code ${courseCode}`);

  try {
    // Use Prisma Client to find the course by course code
    const course = await prisma.course.findFirst({
      where: {
        course_code: courseCode,
      },
    });

    // If course is not found, return a 404 response
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Modify the data before sending it to the client
    course.course_sem = course.course_sem.toUpperCase();

    // Send the modified data back to the client
    return res.json(course);
  } catch (error) {
    console.error("Error in /curriculum/:courseCode route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculum-prerequisite", async (req, res) => {
  try {
    const program_id = req.query.program_id?.toString(); // Convert to string explicitly
    const year_started = parseInt(req.query.year_started, 10); // Convert to string explicitly

    // Checking if programId and yearStarted are provided
    if (!program_id || !year_started) {
      return res.status(400).json({
        error:
          "Both programId and yearStarted are required in the query parameters.",
      });
    }

    // Query to get curriculum with prerequisites
    const courses = await prisma.course.findMany({
      where: {
        year_started,// Convert to integer if necessary
        program_id,
        NOT: {
          pre_requisite: null,
          pre_requisite: "",
        },
      },
      select: {
        course_code: true,
        pre_requisite: true,
      },
    });

    // Modify the response data
    const modifiedCourses = courses.map((course) => ({
      course_code: course.course_code.trim(),
      pre_requisite: course.pre_requisite
        ? course.pre_requisite.split(",").map((prereq) => prereq.trim())
        : [], // Check if pre_requisite is defined before splitting
    }));

    console.log(
      "Retrieved curriculum data with prerequisites:",
      modifiedCourses
    );
    return res.json(modifiedCourses);
  } catch (error) {
    console.error("Error in /curriculum-prerequisite route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

// Route to get curriculum with prerequisites (only course codes)
router.get("/curriculum-prerequisite-codes", async (req, res) => {
  try {
    // Query to get curriculum with prerequisites (only course codes)
    const courses = await prisma.course.findMany({
      where: {
        NOT: {
          pre_requisite: null,
          pre_requisite: "",
        },
      },
      select: {
        course_code: true,
        pre_requisite: true,
      },
    });

    // Modify the response data
    const curriculumWithPrerequisites = courses.map((course) => ({
      course_code: course.course_code.trim(),
      pre_requisite: course.pre_requisite
        .split(",")
        .map((prereq) => prereq.trim()),
    }));

    console.log(
      "Retrieved curriculum data with prerequisites (codes only):",
      curriculumWithPrerequisites
    );
    return res.json(curriculumWithPrerequisites);
  } catch (error) {
    console.error("Error in /curriculum-prerequisite-codes route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculum-prerequisite-codes-grades", async (req, res) => {
  try {
    const studentNumber = req.query.studentNumber;

    // Query to get curriculum with prerequisites and grades for a specific student
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            pre_requisite: {
              NOT: null,
              NOT: "",
            },
          },
          {
            course_code: {
              in: {
                select: {
                  pre_requisite: true,
                },
                where: {
                  pre_requisite: {
                    NOT: null,
                    NOT: "",
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        course_code: true,
        pre_requisite: true,
        grades: {
          select: {
            grades: true,
          },
          where: {
            student_number: studentNumber,
          },
        },
      },
    });

    // Modify the response data
    const prerequisitesWithGrades = courses.flatMap((course) => {
      return course.pre_requisite.split(",").map((prereq) => {
        const preReqCode = prereq.trim();
        const grade = course.grades.length
          ? String(course.grades[0].grades)
          : null;
        return { pre_requisite: preReqCode, grade };
      });
    });

    console.log(
      "Retrieved prerequisites with grades:",
      prerequisitesWithGrades
    );
    return res.json(prerequisitesWithGrades);
  } catch (error) {
    console.error(
      "Error in /curriculum-prerequisite-codes-grades route:",
      error
    );
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculum-first-first", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    // Parse year_started to integer
    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the first semester of the first year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted, // Use the parsed value here
        course_year: 1,
        course_sem: "FIRST SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculum-first-first route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumfirst-second", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    // Parse year_started to integer
    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the first semester of the first year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted, // Use the parsed value here
        course_year: 1,
        course_sem: "SECOND SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculum-first-first route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumsecond-first", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    // Parse year_started to integer
    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the first semester of the second year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 2,
        course_sem: "FIRST SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumsecond-first route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumsecond-second", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the second semester of the second year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 2,
        course_sem: "SECOND SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumsecond-second route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumthird-first", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the first semester of the third year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 3,
        course_sem: "FIRST SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumthird-first route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumthird-second", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the second semester of the third year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 3,
        course_sem: "SECOND SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumthird-second route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumfourth-first", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the first semester of the fourth year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 4,
        course_sem: "FIRST SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumfourth-first route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumfourth-second", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the second semester of the fourth year
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_year: 4,
        course_sem: "SECOND SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumfourth-second route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/curriculumsummer", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to get total credit units for the summer semester
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
        course_sem: "SUMMER SEMESTER",
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ totalCreditUnits: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /curriculumsummer route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get("/calculate_total_credit_units", async (req, res) => {
  try {
    const { programId, year_started } = req.query;

    const parsedYearStarted = parseInt(year_started);

    // Query to calculate total credit units
    const totalCreditUnits = await prisma.course.aggregate({
      _sum: {
        credit_unit: true,
      },
      where: {
        program_id: programId,
        year_started: parsedYearStarted,
      },
    });

    console.log("Total Credit Units:", totalCreditUnits);
    return res.json({ total_credit_units: totalCreditUnits._sum.credit_unit });
  } catch (error) {
    console.error("Error in /calculate_total_credit_units route:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
});

router.get(
  "/check-prerequisites/:studentNumber/:courseCode",
  async (req, res) => {
    try {
      const { studentNumber, courseCode } = req.params;

      // Fetch the prerequisite course for the selected course
      const course = await prisma.course.findUnique({
        where: {
          course_code: courseCode,
        },
        select: {
          pre_requisite: true,
        },
      });

      // If there is no prerequisite, consider prerequisites as met
      if (!course.pre_requisite) {
        return res.json({ prerequisitesMet: true });
      }

      const prerequisiteCourseCode = course.pre_requisite;

      // Check if the student has grades for the prerequisite course
      const grades = await prisma.grade.findFirst({
        where: {
          course_code: prerequisiteCourseCode,
          student_number: studentNumber,
        },
      });

      // Return the result based on whether grades exist for the prerequisite
      const prerequisitesMet = !!grades;
      res.json({ prerequisitesMet });
    } catch (error) {
      console.error("Error checking prerequisites:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
