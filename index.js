import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
// import pdfParse from "pdf-parse";
// const pdf = require("pdf-parse");
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db/index.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Set up resume upload directory
const uploadDir = path.join(process.cwd(), "sample_data");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Analyze Resume Route
app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const { filename, path: filePath } = req.file;
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    const rawText = pdfData.text;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following resume and provide:
      - Full name (if present)
      - Key technologies and skills
      - A professional score out of 10
      - Summary of achievements (max 3 points)

      Resume Text:
      ${rawText}
    `;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    const analysis = {
      filename,
      rawText,
      parsedJson: output,
      createdAt: new Date(),
    };

    const saved = await prisma.resume.create({
      data: {
        filename,
        rawText,
        parsedJson: output,
      },
    });

    res.json(saved);
  } catch (error) {
    console.error("❌ Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume." });
  }
});

// ✅ Get All Resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes." });
  }
});

// ✅ Fallback Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Resume Analyzer API!");
});

// ✅ Start server
app.listen(8000, () => {
  console.log("🚀 Backend running at http://localhost:8000");
});

export default app;
